import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  AlertTriangle,
  ZapOff,
  Phone,
  Clock,
  CheckCircle2,
  MapPin,
  ArrowLeft,
  ChevronRight,
  Info,
  Building,
} from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { Header } from '../../components/Header';
import { PrototypeNoticeBanner } from '../../components/PrototypeNoticeBanner';
import { NavigationTabBar } from '../../components/NavigationTabBar';
import { OutageService } from '../../services/outageService';
import { OutageType } from '../../types/edsa';

const SIERRA_LEONE_AREAS = [
  'Freetown Central',
  'Lumley / Aberdeen',
  'Kissy / Eastern Freetown',
  'Congo Cross / Brookfields',
  'Wilberforce / Hill Station',
  'Waterloo / Western Rural',
  'Bo City (Southern Province)',
  'Kenema (Eastern Province)',
  'Makeni (Northern Province)',
];

const ISSUE_TYPES: { id: OutageType; title: string; desc: string }[] = [
  {
    id: 'blackout',
    title: 'Total Blackout',
    desc: 'Entire building or street without electricity',
  },
  {
    id: 'phase_problem',
    title: 'Phase / Single Phase Fault',
    desc: 'Partial light or some appliances not powering on',
  },
  {
    id: 'low_voltage',
    title: 'Low / Fluctuating Voltage',
    desc: 'Dim bulbs, flickering, or brownouts',
  },
  {
    id: 'transformer',
    title: 'Transformer / Substation Fault',
    desc: 'Loud bang, sparks, or local transformer smoke',
  },
  {
    id: 'fallen_cable',
    title: 'Fallen Wire / Dangerous Line',
    desc: 'Downed pole or loose electrical wire on the road',
  },
];

export default function OutageScreen() {
  const { outageReports, reportOutage, meters, activeMeter } = useApp();

  const [activeTab, setActiveTab] = useState<'report' | 'my_reports'>('report');

  // Form State
  const [selectedArea, setSelectedArea] = useState(SIERRA_LEONE_AREAS[0]);
  const [address, setAddress] = useState('');
  const [selectedIssueType, setSelectedIssueType] =
    useState<OutageType>('blackout');
  const [meterNumber, setMeterNumber] = useState(
    activeMeter?.meterNumber || '12345678901'
  );
  const [contactPhone, setContactPhone] = useState('+232 76 543 210');
  const [description, setDescription] = useState('');
  const [submittedReportRef, setSubmittedReportRef] = useState<string | null>(
    null
  );

  const handleSubmitOutage = () => {
    const report = reportOutage({
      locationArea: selectedArea,
      streetAddress: address.trim() || 'Main Junction / Landmark',
      issueType: selectedIssueType,
      meterNumber: meterNumber.trim() || undefined,
      contactPhone: contactPhone.trim(),
      description: description.trim() || undefined,
    });

    setSubmittedReportRef(report.referenceCode || report.ticketNumber);
    setActiveTab('my_reports');
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-slate-50">
      <Header />
      <PrototypeNoticeBanner />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="max-w-4xl w-full self-center px-4 pt-3">
          {/* Title row */}
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Pressable
                onPress={() => router.back()}
                className="mr-2 p-2 rounded-xl bg-white border border-slate-200 active:bg-slate-100"
              >
                <ArrowLeft size={18} color="#1E293B" />
              </Pressable>
              <View>
                <Text className="text-xl font-black text-slate-900">
                  Report Power Fault & Outages
                </Text>
                <Text className="text-xs text-slate-500 font-medium">
                  Direct dispatch to EDSA field fault team
                </Text>
              </View>
            </View>
          </View>

          {/* Emergency Hotline Banner */}
          <View className="bg-rose-600 rounded-2xl p-4 mb-4 flex-row items-center justify-between shadow-sm">
            <View className="flex-row items-center flex-1 mr-2">
              <View className="w-10 h-10 rounded-xl bg-white/20 items-center justify-center mr-3">
                <Phone size={20} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold text-sm">
                  EDSA Emergency Hotline: 672
                </Text>
                <Text className="text-rose-100 text-xs">
                  Toll-Free 24/7 for downed wires & sparking transformers
                </Text>
              </View>
            </View>
          </View>

          {/* Tab Pill Switcher */}
          <View className="flex-row bg-slate-200 p-1 rounded-2xl mb-4">
            <Pressable
              onPress={() => setActiveTab('report')}
              className={`flex-1 py-2.5 rounded-xl items-center ${
                activeTab === 'report' ? 'bg-white shadow-sm' : ''
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  activeTab === 'report'
                    ? 'text-slate-900'
                    : 'text-slate-600'
                }`}
              >
                Log New Fault
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('my_reports')}
              className={`flex-1 py-2.5 rounded-xl items-center ${
                activeTab === 'my_reports' ? 'bg-white shadow-sm' : ''
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  activeTab === 'my_reports'
                    ? 'text-slate-900'
                    : 'text-slate-600'
                }`}
              >
                Track Outage Tickets ({outageReports.length})
              </Text>
            </Pressable>
          </View>

          {activeTab === 'report' ? (
            /* New Report Form */
            <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
              {/* Select Area */}
              <View>
                <Text className="text-xs font-bold text-slate-700 mb-1.5">
                  District / Distribution Area *
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="space-x-2 py-1"
                >
                  {SIERRA_LEONE_AREAS.map((area) => (
                    <Pressable
                      key={area}
                      onPress={() => setSelectedArea(area)}
                      className={`px-3.5 py-2 rounded-xl border mr-2 ${
                        selectedArea === area
                          ? 'bg-edsa-primary border-edsa-primary'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <Text
                        className={`text-xs font-bold ${
                          selectedArea === area
                            ? 'text-white'
                            : 'text-slate-700'
                        }`}
                      >
                        {area}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              {/* Specific Street Address */}
              <View className="mt-3">
                <Text className="text-xs font-bold text-slate-700 mb-1">
                  Street Address or Landmark *
                </Text>
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  placeholder="e.g. 42 Siaka Stevens Street, opposite Total Station"
                  className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-900"
                />
              </View>

              {/* Issue Type */}
              <View className="mt-3">
                <Text className="text-xs font-bold text-slate-700 mb-2">
                  Fault Category *
                </Text>
                <View className="space-y-2">
                  {ISSUE_TYPES.map((type) => {
                    const isSelected = selectedIssueType === type.id;
                    return (
                      <Pressable
                        key={type.id}
                        onPress={() => setSelectedIssueType(type.id)}
                        className={`p-3.5 rounded-2xl border flex-row items-center mb-2 ${
                          isSelected
                            ? 'bg-blue-50 border-edsa-primary'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <View
                          className={`w-8 h-8 rounded-xl items-center justify-center mr-3 ${
                            isSelected ? 'bg-edsa-primary' : 'bg-slate-200'
                          }`}
                        >
                          <ZapOff
                            size={16}
                            color={isSelected ? '#FFFFFF' : '#64748B'}
                          />
                        </View>
                        <View className="flex-1">
                          <Text
                            className={`text-sm font-bold ${
                              isSelected
                                ? 'text-edsa-primary'
                                : 'text-slate-900'
                            }`}
                          >
                            {type.title}
                          </Text>
                          <Text className="text-slate-500 text-xs mt-0.5">
                            {type.desc}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Contact Phone & Meter Number */}
              <View className="flex-row flex-wrap gap-3 mt-3">
                <View>
                  <Text className="text-xs font-bold text-slate-700 mb-1">
                    Affected Meter Number (Optional)
                  </Text>
                  <TextInput
                    value={meterNumber}
                    onChangeText={setMeterNumber}
                    placeholder="e.g. 12345678901"
                    keyboardType="numeric"
                    className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-mono text-slate-900"
                  />
                </View>

                <View>
                  <Text className="text-xs font-bold text-slate-700 mb-1">
                    Contact Phone Number *
                  </Text>
                  <TextInput
                    value={contactPhone}
                    onChangeText={setContactPhone}
                    placeholder="+232 76 543 210"
                    keyboardType="phone-pad"
                    className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-900"
                  />
                </View>
              </View>

              {/* Notes */}
              <View className="mt-3">
                <Text className="text-xs font-bold text-slate-700 mb-1">
                  Additional Details
                </Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Describe when the power went off or any visible issues..."
                  multiline
                  numberOfLines={3}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-sm font-medium text-slate-900 h-20"
                />
              </View>

              {/* Submit */}
              <Pressable
                onPress={handleSubmitOutage}
                className="bg-edsa-primary active:bg-edsa-primary py-4 rounded-2xl items-center justify-center shadow-md mt-4"
              >
                <Text className="text-white font-bold text-base">
                  Transmit Outage Report
                </Text>
              </Pressable>
            </View>
          ) : (
            /* My Reports List */
            <View className="space-y-3">
              {submittedReportRef && (
                <View className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl mb-3 flex-row items-center">
                  <CheckCircle2 size={24} color="#059669" className="mr-3" />
                  <View className="flex-1 ml-2">
                    <Text className="text-emerald-900 font-bold text-sm">
                      Report Dispatched to Dispatch Center
                    </Text>
                    <Text className="text-emerald-700 text-xs">
                      Reference: {submittedReportRef}. EDSA technicians have been
                      notified.
                    </Text>
                  </View>
                </View>
              )}

              {outageReports.map((report) => {
                const statusMeta = OutageService.getStatusBadge(report.status);
                return (
                  <View
                    key={report.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-3"
                  >
                    <View className="flex-row items-start justify-between mb-2">
                      <View className="flex-1 mr-2">
                        <View className="flex-row items-center space-x-2">
                          <Text className="text-slate-900 font-black text-base">
                            {OutageService.getOutageTypeLabel(report.issueType)}
                          </Text>
                        </View>
                        <Text className="text-slate-500 text-xs mt-0.5">
                          {report.locationArea} • {report.streetAddress}
                        </Text>
                      </View>

                      <View
                        className="px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: `${statusMeta.color}15` }}
                      >
                        <Text
                          className="text-xs font-bold"
                          style={{ color: statusMeta.color }}
                        >
                          {statusMeta.label}
                        </Text>
                      </View>
                    </View>

                    {/* Meta info */}
                    <View className="bg-slate-50 rounded-2xl p-3 my-2 space-y-1">
                      <View className="flex-row justify-between">
                        <Text className="text-slate-400 text-xs">
                          Ticket Reference:
                        </Text>
                        <Text className="text-slate-800 font-mono font-bold text-xs">
                          {report.referenceCode || report.ticketNumber}
                        </Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text className="text-slate-400 text-xs">
                          Reported At:
                        </Text>
                        <Text className="text-slate-700 text-xs">
                          {new Date(report.reportedAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          ,{' '}
                          {new Date(report.reportedAt).toLocaleDateString(
                            'en-GB',
                            { day: 'numeric', month: 'short' }
                          )}
                        </Text>
                      </View>
                      {report.estimatedResolutionTime && (
                        <View className="flex-row justify-between">
                          <Text className="text-slate-400 text-xs">
                            Est. Resolution:
                          </Text>
                          <Text className="text-amber-700 font-bold text-xs">
                            {report.estimatedResolutionTime}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      <NavigationTabBar currentRoute="/outage" />
    </SafeAreaView>
  );
}
