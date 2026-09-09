import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
  Switch,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  Zap,
  ArrowLeft,
  ArrowRight,
  Building,
  Home,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Check,
} from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { IdDocumentType, MeterApplication } from '../../types/edsa';

const EDSA_PICKUP_OFFICES = [
  'EDSA Central District Office - Siaka Stevens Street, Freetown',
  'EDSA East District Office - Cline Town, Freetown',
  'EDSA West District Office - Lumley Road, Freetown',
  'EDSA Waterloo Regional Office - Waterloo Highway',
  'EDSA Bo Regional Hub - 12 Bo-Tajama Road, Bo Town',
  'EDSA Kenema Regional Office - 44 Hangha Road, Kenema',
  'EDSA Makeni Regional Office - 18 Rogbaneh Road, Makeni',
];

export default function ApplyNewMeterScreen() {
  const {
    user,
    meterApplications,
    applyForNewMeter,
  } = useApp();
  const isApprovedCustomer = user?.verificationStatus === 'approved';

  const [useDefaultDetails, setUseDefaultDetails] = useState(true);

  // Form Fields
  const [applicantName, setApplicantName] = useState(
    user?.fullName || 'Amadu Sesay'
  );
  const [applicantPhone, setApplicantPhone] = useState(
    user?.phoneNumber || '+232 76 543 210'
  );
  const [applicantIdType, setApplicantIdType] = useState<IdDocumentType>(
    user?.idType || 'national_id'
  );
  const [applicantIdNumber, setApplicantIdNumber] = useState(
    user?.idNumber || 'SL-NAT-984210'
  );
  const [premisesAddress, setPremisesAddress] = useState(
    user?.address || '14 Siaka Stevens Street, Freetown'
  );
  const [district, setDistrict] = useState(
    user?.city || 'Western Area Urban (Freetown)'
  );
  const [propertyType, setPropertyType] = useState<
    'residential' | 'commercial' | 'industrial'
  >('residential');
  const [connectionType, setConnectionType] = useState<
    'single_phase_5_30a' | 'three_phase_10_100a'
  >('single_phase_5_30a');
  const [pickupOffice, setPickupOffice] = useState(EDSA_PICKUP_OFFICES[0]);
  const [notes, setNotes] = useState('');

  const [submittedApp, setSubmittedApp] = useState<MeterApplication | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'apply' | 'my_applications'>('apply');

  const handleSubmitApplication = () => {
    if (!applicantName.trim() || !applicantPhone.trim() || !premisesAddress.trim()) {
      setErrorMsg('Please complete all applicant and premises details.');
      return;
    }

    const app = applyForNewMeter({
      applicantName,
      applicantPhone,
      applicantIdType,
      applicantIdNumber,
      premisesAddress,
      district,
      propertyType,
      connectionType,
      useDefaultDetails,
      pickupOfficeLocation: pickupOffice,
      notes: notes.trim() || undefined,
    });

    setSubmittedApp(app);
    setActiveTab('my_applications');
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-white border-b border-slate-200 px-4 py-3 flex-row items-center justify-between">
        <Pressable
          onPress={() => router.push('/meters' as any)}
          className="flex-row items-center active:opacity-70"
        >
          <ArrowLeft size={20} color="#0B2545" className="mr-2" />
          <Text className="text-edsa-navy font-bold text-base">
            Apply to Buy New Meter
          </Text>
        </Pressable>

        <View className="bg-blue-100 px-2.5 py-1 rounded-full border border-blue-200">
          <Text className="text-blue-900 text-[10px] font-bold uppercase">
            EDSA Standard STS
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row bg-white border-b border-slate-200 px-4 pt-1">
        <Pressable
          onPress={() => setActiveTab('apply')}
          className={`pb-2.5 px-3 border-b-2 mr-4 ${
            activeTab === 'apply'
              ? 'border-edsa-primary'
              : 'border-transparent'
          }`}
        >
          <Text
            className={`text-xs font-bold ${
              activeTab === 'apply' ? 'text-edsa-primary' : 'text-slate-500'
            }`}
          >
            New Meter Application
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('my_applications')}
          className={`pb-2.5 px-3 border-b-2 ${
            activeTab === 'my_applications'
              ? 'border-edsa-primary'
              : 'border-transparent'
          }`}
        >
          <Text
            className={`text-xs font-bold ${
              activeTab === 'my_applications'
                ? 'text-edsa-primary'
                : 'text-slate-500'
            }`}
          >
            Track Status ({meterApplications.length})
          </Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="max-w-md w-full mx-auto px-4 pt-4">
            {activeTab === 'my_applications' ? (
              /* Applications List & Status Tracker */
              <View className="space-y-4">
                {meterApplications.map((app) => {
                  const isReady = app.status === 'ready_for_pickup';
                  const isSubmitted = app.status === 'submitted';
                  const isVerified = app.status === 'document_verified';

                  return (
                    <View
                      key={app.id}
                      className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm"
                    >
                      {/* Application Reference & Status */}
                      <View className="flex-row items-center justify-between pb-3 border-b border-slate-100 mb-3">
                        <View>
                          <Text className="text-xs font-mono font-bold text-slate-800">
                            {app.applicationNumber}
                          </Text>
                          <Text className="text-[10px] text-slate-400">
                            Applied: {new Date(app.appliedDate).toLocaleDateString()}
                          </Text>
                        </View>

                        <View
                          className={`px-3 py-1 rounded-full border ${
                            isReady
                              ? 'bg-emerald-50 border-emerald-300'
                              : 'bg-amber-50 border-amber-300'
                          }`}
                        >
                          <Text
                            className={`text-[10.5px] font-black uppercase ${
                              isReady ? 'text-emerald-800' : 'text-amber-800'
                            }`}
                          >
                            {isReady
                              ? '✓ Ready for Pickup'
                              : isVerified
                              ? 'Site Inspected'
                              : 'In Review'}
                          </Text>
                        </View>
                      </View>

                      {/* Ready for Pickup Highlight Banner */}
                      {isReady && (
                        <View className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-3">
                          <View className="flex-row items-center mb-1">
                            <Sparkles size={16} color="#059669" className="mr-1.5" />
                            <Text className="text-emerald-900 font-black text-xs">
                              Your Meter is Ready for Collection!
                            </Text>
                          </View>
                          <Text className="text-emerald-800 text-[11px] leading-4 mb-2">
                            Serial: <Text className="font-mono font-bold">{app.meterSerialNumber || '12345678901'}</Text>{'\n'}
                            Location: {app.pickupOfficeLocation}
                          </Text>
                          <Text className="text-[10px] text-emerald-700 italic">
                            Please bring your National ID and payment receipt when collecting.
                          </Text>
                        </View>
                      )}

                      {/* Details */}
                      <View className="space-y-1.5 mb-3 text-xs">
                        <View className="flex-row justify-between">
                          <Text className="text-slate-400 text-xs">Applicant:</Text>
                          <Text className="text-slate-800 font-bold text-xs">
                            {app.applicantName}
                          </Text>
                        </View>

                        <View className="flex-row justify-between">
                          <Text className="text-slate-400 text-xs">Premises:</Text>
                          <Text className="text-slate-800 font-medium text-xs max-w-[200px] text-right">
                            {app.premisesAddress}
                          </Text>
                        </View>

                        <View className="flex-row justify-between">
                          <Text className="text-slate-400 text-xs">Connection:</Text>
                          <Text className="text-slate-800 font-bold text-xs">
                            {app.connectionType === 'single_phase_5_30a'
                              ? 'Single Phase 230V'
                              : 'Three Phase 400V'}
                          </Text>
                        </View>
                      </View>

                      {/* 4-Step Progress Tracker */}
                      <View className="bg-slate-50 rounded-2xl p-3 pt-4 border border-slate-100">
                        <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Application Milestones
                        </Text>
                        <View className="space-y-2">
                          {[
                            { label: '1. Application Submitted', done: true },
                            {
                              label: '2. KYC & Document Verification',
                              done: isVerified || isReady,
                            },
                            {
                              label: '3. Technical Site Inspection',
                              done: isVerified || isReady,
                            },
                            {
                              label: '4. Meter Commissioned & Ready for Pickup',
                              done: isReady,
                            },
                          ].map((step, idx) => (
                            <View key={idx} className="flex-row items-center">
                              <View
                                className={`w-4 h-4 rounded-full items-center justify-center mr-2 ${
                                  step.done ? 'bg-emerald-500' : 'bg-slate-300'
                                }`}
                              >
                                {step.done && <Check size={10} color="#FFFFFF" />}
                              </View>
                              <Text
                                className={`text-[11px] ${
                                  step.done
                                    ? 'text-slate-900 font-bold'
                                    : 'text-slate-400'
                                }`}
                              >
                                {step.label}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : (
              /* Application Form */
              <>
                {/* Default Details Toggle Card */}
                <View className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-4">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1 pr-3">
                      <Text className="text-sm font-bold text-slate-900">
                        Use Registered Account Details
                      </Text>
                      <Text className="text-xs text-slate-500">
                        Auto-fills with your verified KYC info ({user?.fullName})
                      </Text>
                    </View>
                    <Switch
                      value={useDefaultDetails}
                      onValueChange={(val) => {
                        setUseDefaultDetails(val);
                        if (val && user) {
                          setApplicantName(user.fullName);
                          setApplicantPhone(user.phoneNumber);
                          setPremisesAddress(user.address || '');
                        }
                      }}
                      trackColor={{ false: '#CBD5E1', true: '#133E87' }}
                    />
                  </View>
                </View>

                {/* Applicant & Premises Information */}
                <View className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-4 space-y-3">
                  <Text className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    1. Applicant & Installation Premises
                  </Text>

                  <View>
                    <Text className="text-[11px] font-bold text-slate-600 mb-1">
                      Applicant Full Name *
                    </Text>
                    <TextInput
                      value={applicantName}
                      onChangeText={setApplicantName}
                      placeholder="e.g. Amadu Sesay"
                      editable={!useDefaultDetails}
                      className={`border rounded-xl px-3.5 py-2.5 text-sm ${
                        useDefaultDetails
                          ? 'bg-slate-100 border-slate-200 text-slate-600'
                          : 'bg-slate-50 border-slate-300 text-slate-900 font-medium'
                      }`}
                    />
                  </View>

                  <View>
                    <Text className="text-[11px] font-bold text-slate-600 mb-1">
                      Contact Phone *
                    </Text>
                    <TextInput
                      value={applicantPhone}
                      onChangeText={setApplicantPhone}
                      placeholder="+232 76 000 000"
                      keyboardType="phone-pad"
                      editable={!useDefaultDetails}
                      className={`border rounded-xl px-3.5 py-2.5 text-sm ${
                        useDefaultDetails
                          ? 'bg-slate-100 border-slate-200 text-slate-600'
                          : 'bg-slate-50 border-slate-300 text-slate-900 font-medium'
                      }`}
                    />
                  </View>

                  <View>
                    <Text className="text-[11px] font-bold text-slate-600 mb-1">
                      Premises Installation Address *
                    </Text>
                    <TextInput
                      value={premisesAddress}
                      onChangeText={setPremisesAddress}
                      placeholder="Street number, Building name, Landmark"
                      className="bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium text-sm"
                    />
                  </View>
                </View>

                {/* Connection & Tariff Type */}
                <View className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-4">
                  <Text className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                    2. Electricity Connection Type
                  </Text>

                  <View className="flex-row gap-2 mb-3">
                    <Pressable
                      onPress={() => setConnectionType('single_phase_5_30a')}
                      className={`flex-1 p-3 rounded-xl border ${
                        connectionType === 'single_phase_5_30a'
                          ? 'bg-blue-900 border-blue-900'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <Text
                        className={`text-xs font-black ${
                          connectionType === 'single_phase_5_30a'
                            ? 'text-white'
                            : 'text-slate-800'
                        }`}
                      >
                        Single Phase (230V)
                      </Text>
                      <Text
                        className={`text-[10px] mt-0.5 ${
                          connectionType === 'single_phase_5_30a'
                            ? 'text-blue-200'
                            : 'text-slate-500'
                        }`}
                      >
                        5-30A Domestic / Flat
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => setConnectionType('three_phase_10_100a')}
                      className={`flex-1 p-3 rounded-xl border ${
                        connectionType === 'three_phase_10_100a'
                          ? 'bg-blue-900 border-blue-900'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <Text
                        className={`text-xs font-black ${
                          connectionType === 'three_phase_10_100a'
                            ? 'text-white'
                            : 'text-slate-800'
                        }`}
                      >
                        Three Phase (400V)
                      </Text>
                      <Text
                        className={`text-[10px] mt-0.5 ${
                          connectionType === 'three_phase_10_100a'
                            ? 'text-blue-200'
                            : 'text-slate-500'
                        }`}
                      >
                        10-100A Commercial
                      </Text>
                    </Pressable>
                  </View>
                </View>

                {/* District Office Pickup Location */}
                <View className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-4">
                  <Text className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    3. EDSA District Office for Pickup
                  </Text>
                  <Text className="text-xs text-slate-500 mb-3">
                    You will receive an in-app and SMS alert as soon as your programmed meter is ready for collection:
                  </Text>

                  <View className="space-y-2">
                    {EDSA_PICKUP_OFFICES.map((office, idx) => (
                      <Pressable
                        key={idx}
                        onPress={() => setPickupOffice(office)}
                        className={`p-3 rounded-xl border flex-row items-center justify-between ${
                          pickupOffice === office
                            ? 'bg-blue-50 border-blue-600'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <View className="flex-1 pr-2">
                          <Text className="text-xs font-bold text-slate-800">
                            {office}
                          </Text>
                        </View>
                        {pickupOffice === office && (
                          <CheckCircle2 size={18} color="#1E40AF" />
                        )}
                      </Pressable>
                    ))}
                  </View>
                </View>

                {errorMsg && (
                  <View className="bg-red-50 border border-red-200 rounded-2xl p-3.5 flex-row items-center mb-4">
                    <AlertCircle size={18} color="#DC2626" className="mr-2" />
                    <Text className="text-red-700 text-xs font-medium flex-1">
                      {errorMsg}
                    </Text>
                  </View>
                )}

                {/* Submit Application */}
                <Pressable
                  onPress={handleSubmitApplication}
                  className="w-full py-4 bg-edsa-primary rounded-2xl flex-row items-center justify-center shadow-lg active:opacity-90 mb-4"
                >
                  <Text className="text-white font-black text-base mr-2">
                    Submit Meter Application
                  </Text>
                  <ArrowRight size={18} color="#FFFFFF" />
                </Pressable>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
