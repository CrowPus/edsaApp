import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  User,
  ShieldCheck,
  CreditCard,
  FileText,
  Check,
  ArrowRight,
  ArrowLeft,
  Camera,
  Upload,
  AlertCircle,
  Building,
  Sparkles,
  Lock,
} from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { IdDocumentType } from '../../types/edsa';

const SIERRA_LEONE_DISTRICTS = [
  'Western Area Urban (Freetown)',
  'Western Area Rural (Waterloo)',
  'Bo District (Southern Province)',
  'Kenema District (Eastern Province)',
  'Bombali District (Makeni)',
  'Port Loko District',
  'Kono District',
  'Tonkolili District',
];

export default function CustomerRegistrationScreen() {
  const { registerCustomer, user, adminToggleCustomerApproval, loginAs } =
    useApp();

  const [fullName, setFullName] = useState('Amadu Sesay');
  const [phoneNumber, setPhoneNumber] = useState('+232 76 543 210');
  const [email, setEmail] = useState('amadu.sesay@example.sl');
  const [address, setAddress] = useState('14 Siaka Stevens Street, Freetown');
  const [district, setDistrict] = useState(SIERRA_LEONE_DISTRICTS[0]);
  const [idType, setIdType] = useState<IdDocumentType>('national_id');
  const [idNumber, setIdNumber] = useState('SL-NAT-984210');
  const [uploadedId, setUploadedId] = useState(true);
  const [uploadedPhoto, setUploadedPhoto] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!fullName.trim() || !phoneNumber.trim() || !idNumber.trim()) {
      setErrorMsg('Please fill in all required customer details and ID number.');
      return;
    }

    registerCustomer({
      fullName,
      phoneNumber,
      email,
      address,
      city: district,
      idType,
      idNumber,
      idPhotoUrl:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&fit=crop&q=80',
      passportPhotoUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&fit=crop&q=80',
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
            Customer KYC Registration
          </Text>
        </Pressable>

        <View className="bg-blue-100 px-2.5 py-1 rounded-full border border-blue-200">
          <Text className="text-blue-900 text-[10px] font-bold uppercase">
            Official Account
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
            {submitted || user?.verificationStatus === 'pending' ? (
              /* Verification Pending Status Screen */
              <View className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg items-center text-center">
                <View className="w-16 h-16 rounded-full bg-amber-100 border-4 border-amber-50 items-center justify-center mb-3">
                  <ShieldCheck size={32} color="#D97706" />
                </View>

                <Text className="text-xl font-black text-slate-900 text-center mb-1">
                  Registration Submitted
                </Text>
                <Text className="text-xs text-slate-600 text-center leading-5 mb-4">
                  Your identity documents (NIN / National ID) have been submitted to the EDSA verification team. Once approved, all bonus units, multiple meters, and meter purchase requests will be activated.
                </Text>

                {/* Status Card */}
                <View className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-xs font-bold text-amber-900">
                      Verification Status:
                    </Text>
                    <View className="bg-amber-200/80 px-2.5 py-0.5 rounded-full">
                      <Text className="text-[10px] font-black text-amber-950 uppercase">
                        Pending Admin Review
                      </Text>
                    </View>
                  </View>
                  <Text className="text-[11px] text-amber-800">
                    Applicant: {fullName} • {idNumber}
                  </Text>
                </View>

                {/* Admin Approval Simulator Tool */}
                <View className="w-full bg-slate-900 rounded-2xl p-4 mb-4">
                  <View className="flex-row items-center mb-2">
                    <Sparkles size={14} color="#FBBF24" className="mr-1.5" />
                    <Text className="text-amber-400 font-bold text-xs">
                      EDSA Administrator Simulator
                    </Text>
                  </View>
                  <Text className="text-[11px] text-slate-300 mb-3">
                    Simulate real-time EDSA compliance review:
                  </Text>
                  <Pressable
                    onPress={() => {
                      adminToggleCustomerApproval(true);
                      router.replace('/' as any);
                    }}
                    className="w-full py-2.5 bg-emerald-600 rounded-xl items-center mb-2 active:bg-emerald-700"
                  >
                    <Text className="text-white font-bold text-xs">
                      ✓ Admin: Approve Customer Account
                    </Text>
                  </Pressable>
                </View>

                <Pressable
                  onPress={() => router.replace('/' as any)}
                  className="w-full py-3 bg-slate-100 rounded-xl items-center border border-slate-200"
                >
                  <Text className="text-slate-700 font-bold text-xs">
                    Return to Home
                  </Text>
                </Pressable>
              </View>
            ) : (
              /* Registration Form */
              <>
                {/* Benefits Banner */}
                <View className="bg-gradient-to-r from-blue-900 to-indigo-900 bg-blue-900 rounded-3xl p-5 text-white mb-4 shadow-md">
                  <View className="flex-row items-center mb-2">
                    <Sparkles size={18} color="#FBBF24" className="mr-2" />
                    <Text className="text-amber-400 font-black text-sm uppercase tracking-wider">
                      Approved Customer Benefits
                    </Text>
                  </View>
                  <Text className="text-white text-xs leading-4 mb-2">
                    • Earn +5% Loyalty Bonus Units on every recharge{'\n'}
                    • Link 2 or more meters under your single account{'\n'}
                    • Apply to Buy New Residential or Commercial Meters
                  </Text>
                </View>

                {/* Personal Information */}
                <View className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-4">
                  <Text className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                    1. Personal Information
                  </Text>

                  <View className="space-y-3">
                    <View>
                      <Text className="text-[11px] font-bold text-slate-600 mb-1">
                        Full Legal Name *
                      </Text>
                      <TextInput
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder="e.g. Amadu Sesay"
                        className="bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium text-sm"
                      />
                    </View>

                    <View>
                      <Text className="text-[11px] font-bold text-slate-600 mb-1">
                        Mobile Phone Number *
                      </Text>
                      <TextInput
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        placeholder="+232 76 000 000"
                        keyboardType="phone-pad"
                        className="bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium text-sm"
                      />
                    </View>

                    <View>
                      <Text className="text-[11px] font-bold text-slate-600 mb-1">
                        Email Address (Optional)
                      </Text>
                      <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="customer@example.sl"
                        keyboardType="email-address"
                        className="bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium text-sm"
                      />
                    </View>

                    <View>
                      <Text className="text-[11px] font-bold text-slate-600 mb-1">
                        Physical Premises Address *
                      </Text>
                      <TextInput
                        value={address}
                        onChangeText={setAddress}
                        placeholder="Street, Building / Landmark"
                        className="bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium text-sm"
                      />
                    </View>
                  </View>
                </View>

                {/* Identity Verification (KYC) */}
                <View className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-4">
                  <Text className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                    2. National Identification (KYC)
                  </Text>

                  {/* ID Document Selector */}
                  <View className="flex-row gap-2 mb-3">
                    {[
                      { id: 'national_id', label: 'National ID' },
                      { id: 'nin', label: 'NIN' },
                      { id: 'passport', label: 'Passport' },
                      { id: 'voters_card', label: "Voter's Card" },
                    ].map((doc) => (
                      <Pressable
                        key={doc.id}
                        onPress={() => setIdType(doc.id as IdDocumentType)}
                        className={`flex-1 py-2 rounded-xl border items-center ${
                          idType === doc.id
                            ? 'bg-blue-900 border-blue-900'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <Text
                          className={`text-[10.5px] font-bold ${
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
                      placeholder="e.g. SL-NAT-984210"
                      className="bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono font-bold text-sm"
                    />
                  </View>

                  {/* Document Upload Simulator */}
                  <View className="border border-dashed border-blue-300 bg-blue-50/50 rounded-2xl p-3.5 items-center mb-3">
                    <Check size={20} color="#059669" className="mb-1" />
                    <Text className="text-xs font-bold text-slate-800">
                      ID Document & Passport Photo Attached
                    </Text>
                    <Text className="text-[10px] text-slate-500">
                      national_id_front.jpg (1.4 MB) • passport_photo.jpg (940 KB)
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

                {/* Submit KYC Registration */}
                <Pressable
                  onPress={handleSubmit}
                  className="w-full py-4 bg-edsa-primary rounded-2xl flex-row items-center justify-center shadow-lg active:opacity-90 mb-4"
                >
                  <Text className="text-white font-black text-base mr-2">
                    Submit Application for Approval
                  </Text>
                  <ArrowRight size={18} color="#FFFFFF" />
                </Pressable>

                {/* Already have an account */}
                <Pressable
                  onPress={() => {
                    loginAs('user', 'approved');
                    router.replace('/' as any);
                  }}
                  className="w-full py-3 bg-white rounded-2xl border border-slate-300 items-center active:bg-slate-50"
                >
                  <Text className="text-blue-900 font-bold text-xs">
                    Already Registered? Sign In →
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
