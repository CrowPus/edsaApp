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
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Smartphone,
  ShieldCheck,
  Lock,
} from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { Header } from '../../components/Header';
import { PaymentMethodId } from '../../types/edsa';
import { NavigationTabBar } from '../../components/NavigationTabBar';

interface PaymentOptionItem {
  id: PaymentMethodId;
  name: string;
  provider: string;
  badge: string;
  badgeBg: string;
  textColor: string;
  defaultPhone: string;
  description: string;
}

const PAYMENT_OPTIONS: PaymentOptionItem[] = [
  {
    id: 'orange_money',
    name: 'Orange Money',
    provider: 'Orange Sierra Leone',
    badge: 'Orange Money USSD',
    badgeBg: 'bg-orange-500',
    textColor: 'text-orange-500',
    defaultPhone: '+232 76 543 210',
    description: 'Instant USSD prompt pushed directly to your Orange SIM',
  },
  {
    id: 'afrimoney',
    name: 'Afrimoney',
    provider: 'Africell Sierra Leone',
    badge: 'Afrimoney FastPay',
    badgeBg: 'bg-purple-600',
    textColor: 'text-purple-600',
    defaultPhone: '+232 88 123 456',
    description: 'Instant mobile PIN approval on your Africell phone',
  },
  {
    id: 'card',
    name: 'Visa / Mastercard',
    provider: 'Bank Card / Debit / Credit',
    badge: '3D Secure',
    badgeBg: 'bg-edsa-primary',
    textColor: 'text-edsa-primary',
    defaultPhone: '',
    description: 'Sierra Leone Commercial Bank, Rokel, EcoBank & International Cards',
  },
];

export default function PaymentMethodScreen() {
  const { buyDraft, updateBuyDraft } = useApp();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId>(
    buyDraft.paymentMethod || 'orange_money'
  );

  const [phoneOrAccount, setPhoneOrAccount] = useState<string>(
    buyDraft.paymentPhone || '+232 76 543 210'
  );

  const [cardNumber, setCardNumber] = useState(
    buyDraft.cardNumber || '4242 •••• •••• 4242'
  );
  const [cardExpiry, setCardExpiry] = useState(buyDraft.cardExpiry || '12/28');
  const [cardCvv, setCardCvv] = useState(buyDraft.cardCvv || '888');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelectMethod = (option: PaymentOptionItem) => {
    setSelectedMethod(option.id);
    if (option.id !== 'card' && !phoneOrAccount) {
      setPhoneOrAccount(option.defaultPhone);
    }
  };

  const handleProceedToConfirm = () => {
    setErrorMsg(null);

    if (selectedMethod !== 'card') {
      if (!phoneOrAccount.trim()) {
        setErrorMsg('Please enter your mobile money telephone number.');
        return;
      }
    } else {
      if (!cardNumber.trim()) {
        setErrorMsg('Please enter your card number.');
        return;
      }
    }

    updateBuyDraft({
      paymentMethod: selectedMethod,
      paymentPhone: phoneOrAccount,
      cardNumber: selectedMethod === 'card' ? cardNumber : undefined,
      cardExpiry: selectedMethod === 'card' ? cardExpiry : undefined,
      cardCvv: selectedMethod === 'card' ? cardCvv : undefined,
    });

    router.push('/buy/confirm' as any);
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-slate-50">
      <Header />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="max-w-3xl w-full self-center px-4 pt-3">
          {/* Title bar */}
          <View className="flex-row items-center justify-between mb-4">
            <Pressable
              onPress={() => router.back()}
              className="flex-row items-center p-2 rounded-xl bg-white border border-slate-200 active:bg-slate-100 mr-3"
            >
              <ArrowLeft size={18} color="#1E293B" />
            </Pressable>

            <View className="flex-1">
              <Text className="text-xl font-black text-slate-900">
                Payment Method
              </Text>
              <Text className="text-xs text-slate-500 font-medium">
                Step 2 of 3 • Select Carrier or Card
              </Text>
            </View>
          </View>

          {/* Amount and Meter summary pill */}
          <View className="bg-edsa-primary rounded-2xl p-4 mb-4 flex-row items-center justify-between">
            <View>
              <Text className="text-blue-200 text-xs">Total to Pay</Text>
              <Text className="text-white font-black text-xl">
                Le {(buyDraft.amountLe || 200).toLocaleString()}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-blue-200 text-xs">Prepaid Meter</Text>
              <Text className="text-white font-bold text-sm">
                {buyDraft.meterNickname || 'Home Meter'} ({buyDraft.meterNumber})
              </Text>
            </View>
          </View>

          {/* Payment Method Selector */}
          <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-4">
            <Text className="text-slate-900 font-bold text-base mb-3">
              Choose Sierra Leone Payment Provider
            </Text>

            <View className="space-y-3">
              {PAYMENT_OPTIONS.map((opt) => {
                const isSelected = selectedMethod === opt.id;
                return (
                  <Pressable
                    key={opt.id}
                    onPress={() => handleSelectMethod(opt)}
                    className={`p-4 rounded-2xl border flex-row items-center justify-between active:opacity-80 ${
                      isSelected
                        ? 'bg-blue-50/70 border-edsa-primary'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <View className="flex-row items-center flex-1 mr-2">
                      <View
                        className={`w-11 h-11 rounded-2xl items-center justify-center mr-3 ${
                          opt.id === 'orange_money'
                            ? 'bg-orange-500'
                            : opt.id === 'afrimoney'
                            ? 'bg-purple-600'
                            : 'bg-edsa-primary'
                        }`}
                      >
                        {opt.id === 'card' ? (
                          <CreditCard size={20} color="#FFFFFF" />
                        ) : (
                          <Smartphone size={20} color="#FFFFFF" />
                        )}
                      </View>

                      <View className="flex-1">
                        <View className="flex-row items-center">
                          <Text className="font-bold text-slate-900 text-sm mr-2">
                            {opt.name}
                          </Text>
                          <View
                            className={`px-2 py-0.5 rounded-full ${
                              opt.id === 'orange_money'
                                ? 'bg-orange-100'
                                : opt.id === 'afrimoney'
                                ? 'bg-purple-100'
                                : 'bg-blue-100'
                            }`}
                          >
                            <Text
                              className={`text-[10px] font-bold ${opt.textColor}`}
                            >
                              {opt.badge}
                            </Text>
                          </View>
                        </View>
                        <Text className="text-xs text-slate-500 mt-0.5">
                          {opt.description}
                        </Text>
                      </View>
                    </View>

                    <View
                      className={`w-6 h-6 rounded-full items-center justify-center border ${
                        isSelected
                          ? 'bg-edsa-primary border-edsa-primary'
                          : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <Check size={14} color="#FFFFFF" />}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Account / Phone details form */}
          <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-5">
            {selectedMethod !== 'card' ? (
              <View>
                <Text className="text-slate-900 font-bold text-sm mb-1">
                  {selectedMethod === 'orange_money'
                    ? 'Orange Money Phone Number'
                    : 'Afrimoney Phone Number'}
                </Text>
                <Text className="text-xs text-slate-500 mb-2">
                  A USSD authorization prompt will be simulated to this number.
                </Text>

                <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
                  <Smartphone size={18} color="#64748B" className="mr-2" />
                  <TextInput
                    value={phoneOrAccount}
                    onChangeText={setPhoneOrAccount}
                    keyboardType="phone-pad"
                    placeholder="+232 76 543 210"
                    className="flex-1 text-base font-bold text-slate-900 ml-2"
                  />
                </View>

                <View className="flex-row items-center mt-2.5">
                  <Lock size={13} color="#059669" className="mr-1" />
                  <Text className="text-emerald-700 text-xs ml-1 font-medium">
                    Secured by EDSA & Sierra Leone National Payment Switch
                  </Text>
                </View>
              </View>
            ) : (
              <View className="space-y-3">
                <Text className="text-slate-900 font-bold text-sm mb-1">
                  Card Details
                </Text>

                <View>
                  <Text className="text-xs font-semibold text-slate-600 mb-1">
                    Card Number
                  </Text>
                  <TextInput
                    value={cardNumber}
                    onChangeText={setCardNumber}
                    placeholder="4242 4242 4242 4242"
                    keyboardType="numeric"
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono text-slate-900"
                  />
                </View>

                <View className="flex-row space-x-3">
                  <View className="flex-1">
                    <Text className="text-xs font-semibold text-slate-600 mb-1">
                      Expiry (MM/YY)
                    </Text>
                    <TextInput
                      value={cardExpiry}
                      onChangeText={setCardExpiry}
                      placeholder="12/28"
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono text-slate-900"
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="text-xs font-semibold text-slate-600 mb-1">
                      CVV / CVC
                    </Text>
                    <TextInput
                      value={cardCvv}
                      onChangeText={setCardCvv}
                      placeholder="888"
                      secureTextEntry
                      keyboardType="numeric"
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono text-slate-900"
                    />
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* CTA */}
          <Pressable
            onPress={handleProceedToConfirm}
            className="bg-edsa-primary active:bg-edsa-primary py-4 px-6 rounded-2xl flex-row items-center justify-center shadow-lg"
          >
            <Text className="text-white font-black text-base mr-2">
              Review & Authorize Payment
            </Text>
            <ArrowRight size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </ScrollView>

      {/* Bottom Floating Navigation Bar on Mobile */}
      <NavigationTabBar currentRoute="/buy" />
    </SafeAreaView>
  );
}
