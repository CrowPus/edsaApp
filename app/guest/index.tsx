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
  Zap,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  CreditCard,
  Check,
  Lock,
  Info,
  AlertCircle,
  HelpCircle,
} from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { MeterService } from '../../services/meterService';
import { PaymentMethodId, TariffCategory } from '../../types/edsa';

const PRESET_AMOUNTS = [50, 100, 200, 500, 1000, 2000];

export default function GuestCheckoutScreen() {
  const { guestCheckout, updateBuyDraft } = useApp();

  const [meterNumber, setMeterNumber] = useState('');
  const [amountLe, setAmountLe] = useState<number>(100);
  const [customAmountStr, setCustomAmountStr] = useState('100');
  const [tariffCategory, setTariffCategory] =
    useState<TariffCategory>('residential');
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodId>('orange_money');
  const [payerPhone, setPayerPhone] = useState('+232 76 ');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Real-time calculation with 0% bonus for guest
  const breakdown = MeterService.calculateEstimatedUnits(
    amountLe,
    tariffCategory,
    true
  );

  const handleSelectAmount = (val: number) => {
    setAmountLe(val);
    setCustomAmountStr(val.toString());
    setErrorMsg(null);
  };

  const handleCustomAmountChange = (text: string) => {
    setCustomAmountStr(text);
    const num = parseFloat(text);
    if (!isNaN(num) && num > 0) {
      setAmountLe(num);
      setErrorMsg(null);
    } else {
      setAmountLe(0);
    }
  };

  const handlePayNow = async () => {
    setErrorMsg(null);
    const cleanMeter = meterNumber.replace(/\D/g, '');

    if (cleanMeter.length !== 11) {
      setErrorMsg('Please enter a valid 11-digit EDSA meter number.');
      return;
    }

    if (!amountLe || amountLe < 10) {
      setErrorMsg('Minimum electricity purchase is Le 10.00.');
      return;
    }

    if (paymentMethod !== 'card' && payerPhone.trim().length < 9) {
      setErrorMsg('Please enter a valid mobile money phone number.');
      return;
    }

    setLoading(true);

    try {
      const result = await guestCheckout({
        meterNumber: cleanMeter,
        amountLe,
        paymentMethod,
        paymentPhone: payerPhone,
      });

      setLoading(false);

      if (result.success && result.transaction) {
        updateBuyDraft({
          generatedToken: result.transaction.tokenNumber,
          transactionId: result.transaction.id,
          meterNumber: cleanMeter,
          amountLe,
          unitsKwh: result.transaction.unitsKwh,
        });
        router.push('/guest/success' as any);
      } else {
        setErrorMsg(result.error || 'Payment failed. Please check balance.');
      }
    } catch (e: any) {
      setLoading(false);
      setErrorMsg(e.message || 'Payment service unreachable.');
    }
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
            EDSA Guest Checkout
          </Text>
        </Pressable>

        <View className="bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
          <Text className="text-amber-900 text-[10px] font-bold uppercase tracking-wider">
            Guest Mode (No Login)
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
            {/* Strict Privacy Notice Card */}
            <View className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4">
              <View className="flex-row items-start">
                <ShieldCheck size={20} color="#1E40AF" className="mr-2.5 mt-0.5" />
                <View className="flex-1">
                  <Text className="text-xs font-bold text-blue-900 mb-1">
                    Direct Guest Vending with Privacy Protection
                  </Text>
                  <Text className="text-[11px] text-blue-800 leading-4">
                    Enter any 11-digit meter number to buy token instantly. For privacy, customer name, meter balance, and history are kept hidden.
                  </Text>
                  <View className="mt-2 bg-white/70 px-2 py-1 rounded-lg self-start">
                    <Text className="text-[10px] text-slate-600">
                      💡 Standard units only • No loyalty bonus on guest purchases
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Step 1: Meter Number Input */}
            <View className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-4">
              <Text className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. Enter 11-Digit Meter Number
              </Text>
              <View className="flex-row items-center bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:border-edsa-primary">
                <Zap size={18} color="#0B2545" className="mr-2" />
                <TextInput
                  value={meterNumber}
                  onChangeText={(val) => {
                    setMeterNumber(val);
                    setErrorMsg(null);
                  }}
                  placeholder="e.g. 1234 5678 901"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  maxLength={11}
                  className="flex-1 text-slate-900 font-mono font-bold text-base"
                />
              </View>
              <Text className="text-[10px] text-slate-400 mt-1.5 ml-1">
                Found on your prepaid keypad, EDSA plastic card, or previous receipt
              </Text>
            </View>

            {/* Step 2: Amount & Tariff */}
            <View className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  2. Select Amount (Le)
                </Text>
                <View className="flex-row bg-slate-100 p-0.5 rounded-lg">
                  <Pressable
                    onPress={() => setTariffCategory('residential')}
                    className={`px-2 py-1 rounded-md ${
                      tariffCategory === 'residential' ? 'bg-white shadow-xs' : ''
                    }`}
                  >
                    <Text className="text-[10px] font-bold text-slate-800">
                      Residential
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setTariffCategory('commercial')}
                    className={`px-2 py-1 rounded-md ${
                      tariffCategory === 'commercial' ? 'bg-white shadow-xs' : ''
                    }`}
                  >
                    <Text className="text-[10px] font-bold text-slate-800">
                      Commercial
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Preset Buttons */}
              <View className="flex-row flex-wrap gap-2 mb-3">
                {PRESET_AMOUNTS.map((val) => (
                  <Pressable
                    key={val}
                    onPress={() => handleSelectAmount(val)}
                    className={`py-2 px-3.5 rounded-xl border flex-1 min-w-[70px] items-center ${
                      amountLe === val
                        ? 'bg-blue-900 border-blue-900'
                        : 'bg-slate-50 border-slate-200 active:bg-slate-100'
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        amountLe === val ? 'text-white' : 'text-slate-800'
                      }`}
                    >
                      Le {val}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Custom Amount Input */}
              <View className="flex-row items-center bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2">
                <Text className="text-sm font-bold text-slate-500 mr-2">Le</Text>
                <TextInput
                  value={customAmountStr}
                  onChangeText={handleCustomAmountChange}
                  keyboardType="numeric"
                  placeholder="Other amount"
                  placeholderTextColor="#94A3B8"
                  className="flex-1 text-slate-900 font-bold text-base"
                />
              </View>

              {/* Live Tariff & Unit Calculation Display */}
              <View className="mt-3 bg-slate-900 rounded-xl p-3.5 flex-row items-center justify-between">
                <View>
                  <Text className="text-[10px] uppercase font-bold text-slate-400">
                    Calculated Energy Units
                  </Text>
                  <Text className="text-amber-400 font-mono font-black text-xl">
                    {breakdown.unitsKwh.toFixed(1)} kWh
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-[10px] text-slate-400">
                    Rate: Le {breakdown.ratePerKwh}/kWh
                  </Text>
                  <Text className="text-[10px] text-slate-400">
                    Incl. 15% GST + Le 5 Fee
                  </Text>
                </View>
              </View>
            </View>

            {/* Step 3: Payment Method */}
            <View className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-4">
              <Text className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                3. Choose Payment Method
              </Text>

              {/* Mobile Money Options */}
              <View className="space-y-2 mb-3">
                {[
                  {
                    id: 'orange_money',
                    name: 'Orange Money',
                    color: '#EA580C',
                    desc: 'Instant USSD PIN Prompt',
                  },
                  {
                    id: 'afrimoney',
                    name: 'Afrimoney',
                    color: '#DC2626',
                    desc: 'Africell Mobile Wallet',
                  },
                  {
                    id: 'card',
                    name: 'Visa / Mastercard',
                    color: '#1E40AF',
                    desc: 'Debit / Credit Card',
                  },
                ].map((pm) => (
                  <Pressable
                    key={pm.id}
                    onPress={() => setPaymentMethod(pm.id as PaymentMethodId)}
                    className={`p-3 rounded-xl border flex-row items-center justify-between ${
                      paymentMethod === pm.id
                        ? 'bg-blue-50/50 border-blue-600'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <View className="flex-row items-center">
                      <View
                        className="w-4 h-4 rounded-full border items-center justify-center mr-3"
                        style={{
                          borderColor: paymentMethod === pm.id ? '#1E40AF' : '#94A3B8',
                        }}
                      >
                        {paymentMethod === pm.id && (
                          <View className="w-2 h-2 rounded-full bg-blue-900" />
                        )}
                      </View>
                      <View>
                        <Text className="text-xs font-bold text-slate-900">
                          {pm.name}
                        </Text>
                        <Text className="text-[10px] text-slate-500">{pm.desc}</Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>

              {/* Payer Phone Number */}
              {paymentMethod !== 'card' && (
                <View>
                  <Text className="text-[11px] font-bold text-slate-600 mb-1">
                    Mobile Money Payer Phone Number
                  </Text>
                  <View className="flex-row items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-2">
                    <Smartphone size={16} color="#64748B" className="mr-2" />
                    <TextInput
                      value={payerPhone}
                      onChangeText={setPayerPhone}
                      placeholder="+232 76 000 000"
                      placeholderTextColor="#94A3B8"
                      keyboardType="phone-pad"
                      className="flex-1 text-slate-900 font-bold text-sm"
                    />
                  </View>
                </View>
              )}
            </View>

            {/* Error banner */}
            {errorMsg && (
              <View className="bg-red-50 border border-red-200 rounded-2xl p-3.5 flex-row items-center mb-4">
                <AlertCircle size={18} color="#DC2626" className="mr-2" />
                <Text className="text-red-700 text-xs font-medium flex-1">
                  {errorMsg}
                </Text>
              </View>
            )}

            {/* Authorize & Pay Button */}
            <Pressable
              onPress={handlePayNow}
              disabled={loading}
              className={`w-full py-4 rounded-2xl flex-row items-center justify-center shadow-lg active:opacity-90 ${
                loading ? 'bg-slate-400' : 'bg-edsa-primary'
              }`}
            >
              <Text className="text-white font-black text-base mr-2">
                {loading
                  ? 'Authorizing Purchase...'
                  : `Pay Le ${amountLe.toLocaleString()} & Get Token`}
              </Text>
              {!loading && <ArrowRight size={18} color="#FFFFFF" />}
            </Pressable>

            {/* Prompt to register for benefits */}
            <View className="mt-4 p-3 bg-white rounded-2xl border border-slate-200 items-center">
              <Text className="text-xs text-slate-600 text-center mb-2">
                Want to earn +5% bonus kWh and apply for meters?
              </Text>
              <Pressable
                onPress={() => router.push('/register' as any)}
                className="py-1.5 px-4 bg-slate-100 rounded-xl border border-slate-300 active:bg-slate-200"
              >
                <Text className="text-xs font-bold text-blue-900">
                  Register as Approved Customer →
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
