import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  Store,
  ShieldCheck,
  CreditCard,
  Building,
  Check,
  ArrowRight,
  ArrowLeft,
  Camera,
  Upload,
  AlertCircle,
  Sparkles,
} from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { IdDocumentType } from '../../types/edsa';

export default function VendorRegistrationScreen() {
  const {
    applyVendorAccount,
    vendor,
    adminToggleVendorApproval,
    loginAs,
  } = useApp();

  const [businessName, setBusinessName] = useState('Sierra Power Link Ltd');
  const [agentName, setAgentName] = useState('Alpha Koroma');
  const [phoneNumber, setPhoneNumber] = useState('+232 78 901 234');
  const [email, setEmail] = useState('alpha.koroma@powerlink.sl');
  const [physicalAddress, setPhysicalAddress] = useState('22 Kissy Road, Freetown');
  const [district, setDistrict] = useState('Western Area Urban (Freetown)');
  const [idType, setIdType] = useState<IdDocumentType>('national_id');
  const [idNumber, setIdNumber] = useState('SL-AGT-551902');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!businessName.trim() || !agentName.trim() || !idNumber.trim()) {
      setErrorMsg('Please complete all vendor business details and ID number.');
      return;
    }

    applyVendorAccount({
      businessName,
      agentName,
      phoneNumber,
      email,
      physicalAddress,
      district,
      idType,
      idNumber,
      passportPhotoUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&fit=crop&q=80',
      shopPhotoUrl:
        'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=300&fit=crop&q=80',
    });

    setSubmitted(true);
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-white border-b border-slate-200 px-4 py-3 flex-row items-center justify-between">
        <Pressable
          onPress={() => router.push('/' as any)}
          className="flex-row items-center active:opacity-70"
        >
          <ArrowLeft size={20} color="#0B2545" className="mr-2" />
          <Text className="text-edsa-navy font-bold text-base">
            Vendor / Agent Application
          </Text>
        </Pressable>

        <View className="bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
          <Text className="text-amber-900 text-[10px] font-bold uppercase">
            Authorized Agent
          </Text>
        </View>
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
            {submitted || vendor?.approvalStatus === 'pending' ? (
              /* Verification Pending Status Screen */
              <View className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg items-center text-center">
                <View className="w-16 h-16 rounded-full bg-amber-100 border-4 border-amber-50 items-center justify-center mb-3">
                  <Store size={32} color="#D97706" />
                </View>

                <Text className="text-xl font-black text-slate-900 text-center mb-1">
                  Vendor Application Submitted
                </Text>
                <Text className="text-xs text-slate-600 text-center leading-5 mb-4">
                  Your business credentials, physical premises address, and identification documents have been submitted to the EDSA Commercial Directorate.
                </Text>

                {/* Status Card */}
                <View className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-xs font-bold text-amber-900">
                      Application Status:
                    </Text>
                    <View className="bg-amber-200/80 px-2.5 py-0.5 rounded-full">
                      <Text className="text-[10px] font-black text-amber-950 uppercase">
                        Under Admin Review
                      </Text>
                    </View>
                  </View>
                  <Text className="text-[11px] text-amber-800">
                    Business: {businessName} • Agent: {agentName}
                  </Text>
                </View>

                {/* Admin Approval Simulator Tool */}
                <View className="w-full bg-slate-900 rounded-2xl p-4 mb-4">
                  <View className="flex-row items-center mb-2">
                    <Sparkles size={14} color="#FBBF24" className="mr-1.5" />
                    <Text className="text-amber-400 font-bold text-xs">
                      EDSA Commercial Admin Simulator
                    </Text>
                  </View>
                  <Text className="text-[11px] text-slate-300 mb-3">
                    Simulate real-time EDSA vendor approval:
                  </Text>
                  <Pressable
                    onPress={() => {
                      adminToggleVendorApproval(true);
                      router.replace('/vendor/portal' as any);
                    }}
                    className="w-full py-2.5 bg-emerald-600 rounded-xl items-center mb-2 active:bg-emerald-700"
                  >
                    <Text className="text-white font-bold text-xs">
                      ✓ Approve Agent & Issue Terminal
                    </Text>
                  </Pressable>
                </View>

                <Pressable
                  onPress={() => router.replace('/' as any)}
                  className="w-full py-3 bg-slate-100 rounded-xl items-center border border-slate-200"
                >
                  <Text className="text-slate-700 font-bold text-xs">
                    Return to Portal
                  </Text>
                </Pressable>
              </View>
            ) : (
              /* Registration Form */
              <>
                {/* Benefits Banner */}
                <View className="bg-slate-900 rounded-3xl p-5 text-white mb-4 shadow-md border border-slate-800">
                  <View className="flex-row items-center mb-2">
                    <Sparkles size={18} color="#FBBF24" className="mr-2" />
                    <Text className="text-amber-400 font-black text-sm uppercase tracking-wider">
                      Authorized Vendor Benefits
                    </Text>
                  </View>
                  <Text className="text-slate-300 text-xs leading-4 mb-2">
                    • Vend instant STS tokens for any customer meter{'\n'}
                    • Earn customer bonus credits directly as <Text className="text-amber-400 font-bold">Vendor Commission</Text>{'\n'}
                    • 1-Tap Exchange accrued bonuses into Vending Wallet Credits
                  </Text>
                </View>

                {/* Business Information */}
                <View className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-4 space-y-3">
                  <Text className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    1. Business & Agent Information
                  </Text>

                  <View>
                    <Text className="text-[11px] font-bold text-slate-600 mb-1">
                      Business / Agency Trade Name *
                    </Text>
                    <TextInput
                      value={businessName}
                      onChangeText={setBusinessName}
                      placeholder="e.g. Sierra Power Link Ltd"
                      className="bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium text-sm"
                    />
                  </View>

                  <View>
                    <Text className="text-[11px] font-bold text-slate-600 mb-1">
                      Authorized Agent Full Name *
                    </Text>
                    <TextInput
                      value={agentName}
                      onChangeText={setAgentName}
                      placeholder="e.g. Alpha Koroma"
                      className="bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium text-sm"
                    />
                  </View>

                  <View>
                    <Text className="text-[11px] font-bold text-slate-600 mb-1">
                      Agent Phone Number (For Vending Alerts) *
                    </Text>
                    <TextInput
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      placeholder="+232 78 000 000"
                      keyboardType="phone-pad"
                      className="bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium text-sm"
                    />
                  </View>

                  <View>
                    <Text className="text-[11px] font-bold text-slate-600 mb-1">
                      Physical Shop / Kiosk Address *
                    </Text>
                    <TextInput
                      value={physicalAddress}
                      onChangeText={setPhysicalAddress}
                      placeholder="Street number, Shop name, Area"
                      className="bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium text-sm"
                    />
                  </View>
                </View>

                {/* Identification & Documents */}
                <View className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-4">
                  <Text className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                    2. Agent Identification (ID / NIN / Passport)
                  </Text>

                  {/* ID Selector */}
                  <View className="flex-row gap-2 mb-3">
                    {[
                      { id: 'national_id', label: 'National ID' },
                      { id: 'nin', label: 'NIN' },
                      { id: 'passport', label: 'Passport' },
                    ].map((doc) => (
                      <Pressable
                        key={doc.id}
                        onPress={() => setIdType(doc.id as IdDocumentType)}
                        className={`flex-1 py-2 rounded-xl border items-center ${
                          idType === doc.id
                            ? 'bg-slate-900 border-slate-900'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <Text
                          className={`text-xs font-bold ${
                            idType === doc.id ? 'text-white' : 'text-slate-700'
                          }`}
                        >
                          {doc.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>

                  <View className="mb-3">
                    <Text className="text-[11px] font-bold text-slate-600 mb-1">
                      Identification Number *
                    </Text>
                    <TextInput
                      value={idNumber}
                      onChangeText={setIdNumber}
                      placeholder="e.g. SL-AGT-551902"
                      className="bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono font-bold text-sm"
                    />
                  </View>

                  {/* Attached Documents */}
                  <View className="border border-dashed border-amber-300 bg-amber-50/50 rounded-2xl p-3.5 items-center mb-2">
                    <Check size={20} color="#D97706" className="mb-1" />
                    <Text className="text-xs font-bold text-slate-800">
                      Passport Photo & Business Certificate Attached
                    </Text>
                    <Text className="text-[10px] text-slate-500">
                      agent_passport_photo.jpg • business_registration.pdf
                    </Text>
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

                {/* Submit Button */}
                <Pressable
                  onPress={handleSubmit}
                  className="w-full py-4 bg-amber-600 active:bg-amber-700 rounded-2xl flex-row items-center justify-center shadow-lg mb-4"
                >
                  <Text className="text-white font-black text-base mr-2">
                    Submit Vendor Application
                  </Text>
                  <ArrowRight size={18} color="#FFFFFF" />
                </Pressable>

                {/* Direct Demo Login */}
                <Pressable
                  onPress={() => {
                    loginAs('vendor', 'approved');
                    router.replace('/vendor/portal' as any);
                  }}
                  className="w-full py-3 bg-white rounded-2xl border border-slate-300 items-center active:bg-slate-50"
                >
                  <Text className="text-slate-800 font-bold text-xs">
                    Already Approved Agent? Open Terminal →
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
