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
  Zap,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Building,
  Home,
  AlertCircle,
} from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { Header } from '../../components/Header';
import { MeterService } from '../../services/meterService';
import { TariffCategory } from '../../types/edsa';
import { NavigationTabBar } from '../../components/NavigationTabBar';

const PRESET_AMOUNTS = [50, 100, 200, 500, 1000, 2000];

export default function BuyElectricityScreen() {
  const { meters, activeMeter, buyDraft, updateBuyDraft } = useApp();

  const [selectedMeterId, setSelectedMeterId] = useState<string>(
    buyDraft.meterId || activeMeter?.id || meters[0]?.id || ''
  );
  const [useCustomMeter, setUseCustomMeter] = useState(false);
  const [customMeterNum, setCustomMeterNum] = useState(
    buyDraft.customMeterNumber || ''
  );

  const [selectedAmount, setSelectedAmount] = useState<number>(
    buyDraft.amountLe || 200
  );
  const [customAmountText, setCustomAmountText] = useState<string>(
    buyDraft.amountLe ? buyDraft.amountLe.toString() : '200'
  );

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentMeter = meters.find((m) => m.id === selectedMeterId) || activeMeter || meters[0];
  const tariffCategory: TariffCategory = currentMeter?.tariffCategory || 'residential';

  // Calculate live breakdown from current amount
  const breakdown = MeterService.calculateEstimatedUnits(
    selectedAmount,
    tariffCategory
  );

  const handleSelectPreset = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmountText(amount.toString());
    setErrorMsg(null);
  };

  const handleCustomAmountChange = (text: string) => {
    const numeric = text.replace(/[^0-9]/g, '');
    setCustomAmountText(numeric);
    const val = parseInt(numeric, 10);
    if (!isNaN(val)) {
      setSelectedAmount(val);
      setErrorMsg(null);
    } else {
      setSelectedAmount(0);
    }
  };

  const handleProceedToPayment = () => {
    setErrorMsg(null);

    if (useCustomMeter) {
      const cleanNum = customMeterNum.replace(/[^0-9]/g, '');
      if (!MeterService.validateMeterNumber(cleanNum)) {
        setErrorMsg('Please enter a valid 11-digit EDSA meter number.');
        return;
      }
    }

    if (selectedAmount < 20) {
      setErrorMsg('Minimum electricity purchase amount is Le 20.');
      return;
    }

    if (selectedAmount > 50000) {
      setErrorMsg('Maximum single purchase amount is Le 50,000.');
      return;
    }

    // Save draft state
    updateBuyDraft({
      meterId: useCustomMeter ? undefined : currentMeter.id,
      meterNumber: useCustomMeter
        ? customMeterNum.replace(/[^0-9]/g, '')
        : currentMeter.meterNumber,
      meterNickname: useCustomMeter ? 'Manual Meter' : currentMeter.nickname,
      customerName: useCustomMeter ? 'Customer Purchase' : currentMeter.customerName,
      location: useCustomMeter ? 'Sierra Leone' : currentMeter.location,
      tariffCategory: tariffCategory,
      customMeterNumber: useCustomMeter ? customMeterNum : undefined,
      amountLe: selectedAmount,
      unitsKwh: breakdown.totalUnitsKwh,
      energyCostLe: breakdown.energyCostLe,
      vatAmountLe: breakdown.vatAmountLe,
      serviceFeeLe: breakdown.serviceFeeLe,
      tariffRatePerKwh: breakdown.ratePerKwh,
    });

    router.push('/buy/payment' as any);
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
          {/* Top Title & Step Indicator */}
          <View className="flex-row items-center justify-between mb-4">
            <Pressable
              onPress={() => router.back()}
              className="flex-row items-center p-2 rounded-xl bg-white border border-slate-200 active:bg-slate-100 mr-3"
            >
              <ArrowLeft size={18} color="#1E293B" />
            </Pressable>

            <View className="flex-1">
              <Text className="text-xl font-black text-slate-900">
                Buy Electricity
              </Text>
              <Text className="text-xs text-slate-500 font-medium">
                Step 1 of 3 • Select Meter & Amount
              </Text>
            </View>

            <View className="bg-blue-100 px-2.5 py-1 rounded-full">
              <Text className="text-edsa-primary font-bold text-xs">
                STS Vending
              </Text>
            </View>
          </View>

          {/* Section 1: Choose Meter */}
          <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-slate-900 font-bold text-base">
                1. Select Prepaid Meter
              </Text>
              <Pressable
                onPress={() => setUseCustomMeter(!useCustomMeter)}
                className="active:opacity-70"
              >
                <Text className="text-edsa-primary font-bold text-xs">
                  {useCustomMeter ? 'Choose Saved Meter' : '+ Enter Other Meter'}
                </Text>
              </Pressable>
            </View>

            {!useCustomMeter ? (
              <View className="space-y-2.5">
                {meters.map((m) => {
                  const isSelected = m.id === selectedMeterId;
                  return (
                    <Pressable
                      key={m.id}
                      onPress={() => setSelectedMeterId(m.id)}
                      className={`p-3.5 rounded-2xl border flex-row items-center justify-between ${
                        isSelected
                          ? 'bg-blue-50/70 border-edsa-primary'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <View className="flex-row items-center flex-1 mr-2">
                        <View
                          className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${
                            isSelected ? 'bg-edsa-primary' : 'bg-slate-200'
                          }`}
                        >
                          {m.tariffCategory === 'residential' ? (
                            <Home
                              size={20}
                              color={isSelected ? '#FFFFFF' : '#475569'}
                            />
                          ) : (
                            <Building
                              size={20}
                              color={isSelected ? '#FFFFFF' : '#475569'}
                            />
                          )}
                        </View>

                        <View className="flex-1">
                          <Text className="font-bold text-slate-900 text-sm">
                            {m.nickname}
                          </Text>
                          <Text className="font-mono text-xs text-slate-500">
                            {m.meterNumber}
                          </Text>
                          <Text className="text-[11px] text-slate-400">
                            {m.location}
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
            ) : (
              <View className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <Text className="text-xs font-bold text-slate-700 mb-1.5">
                  11-Digit Meter Number
                </Text>
                <TextInput
                  value={customMeterNum}
                  onChangeText={setCustomMeterNum}
                  placeholder="e.g. 04291884210"
                  keyboardType="numeric"
                  maxLength={11}
                  className="bg-white border border-slate-300 rounded-xl p-3 text-base font-mono font-bold text-slate-900"
                />
                <Text className="text-[11px] text-slate-500 mt-1">
                  Enter the 11-digit number displayed on your meter interface unit.
                </Text>
              </View>
            )}
          </View>

          {/* Section 2: Choose Amount */}
          <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-4">
            <Text className="text-slate-900 font-bold text-base mb-3">
              2. Select Purchase Amount (Le)
            </Text>

            {/* Presets Grid */}
            <View className="flex-row flex-wrap gap-2.5 mb-4">
              {PRESET_AMOUNTS.map((amt) => {
                const isSelected = selectedAmount === amt;
                return (
                  <Pressable
                    key={amt}
                    onPress={() => handleSelectPreset(amt)}
                    className={`flex-1 min-w-[90px] py-3 rounded-2xl items-center justify-center border active:opacity-80 ${
                      isSelected
                        ? 'bg-edsa-primary border-edsa-primary'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <Text
                      className={`font-black text-sm ${
                        isSelected ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      Le {amt.toLocaleString()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Custom Amount Input */}
            <View>
              <Text className="text-xs font-bold text-slate-700 mb-1.5">
                Or Enter Custom Amount (Sierra Leonean Leones)
              </Text>
              <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
                <Text className="text-base font-bold text-slate-500 mr-2">
                  Le
                </Text>
                <TextInput
                  value={customAmountText}
                  onChangeText={handleCustomAmountChange}
                  keyboardType="numeric"
                  placeholder="Enter amount"
                  className="flex-1 text-lg font-bold text-slate-900"
                />
              </View>
            </View>
          </View>

          {/* Section 3: Live Unit & Tariff Breakdown Calculation */}
          <View className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-sm mb-5">
            <View className="flex-row items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-[#FBBF24] items-center justify-center mr-2.5">
                  <Zap size={16} color="#0B2545" />
                </View>
                <View>
                  <Text className="text-white font-bold text-sm">
                    Estimated Electricity Units
                  </Text>
                  <Text className="text-slate-400 text-xs">
                    {tariffCategory === 'residential'
                      ? 'Residential Tariff (Subsidised)'
                      : 'Commercial Tariff'}
                  </Text>
                </View>
              </View>

              <View className="bg-[#FBBF24]/20 px-3 py-1 rounded-full border border-amber-400/40">
                <Text className="text-amber-300 font-mono font-black text-base">
                  {breakdown.totalUnitsKwh.toFixed(1)} kWh
                </Text>
              </View>
            </View>

            {/* Line-item breakdown */}
            <View className="space-y-1.5">
              <View className="flex-row justify-between">
                <Text className="text-slate-400 text-xs">Total Payment Amount</Text>
                <Text className="text-white font-bold text-xs">
                  Le {breakdown.totalAmountLe.toLocaleString()}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-slate-400 text-xs">EDSA Service Fee</Text>
                <Text className="text-slate-300 text-xs">
                  Le {breakdown.serviceFeeLe.toFixed(2)}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-slate-400 text-xs">
                  GST VAT (15%)
                </Text>
                <Text className="text-slate-300 text-xs">
                  Le {breakdown.vatAmountLe.toFixed(2)}
                </Text>
              </View>
              <View className="flex-row justify-between pt-1.5 border-t border-slate-800">
                <Text className="text-slate-300 font-bold text-xs">
                  Net Electricity Energy
                </Text>
                <Text className="text-amber-400 font-bold text-xs">
                  Le {breakdown.energyCostLe.toFixed(2)} (@ Le {breakdown.ratePerKwh.toFixed(2)}/kWh)
                </Text>
              </View>
            </View>
          </View>

          {/* Error Message */}
          {errorMsg && (
            <View className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex-row items-center mb-4">
              <AlertCircle size={18} color="#DC2626" className="mr-2.5" />
              <Text className="text-rose-800 text-xs font-semibold flex-1 ml-2">
                {errorMsg}
              </Text>
            </View>
          )}

          {/* CTA Button */}
          <Pressable
            onPress={handleProceedToPayment}
            className="bg-edsa-primary active:bg-edsa-primary py-4 px-6 rounded-2xl flex-row items-center justify-center shadow-lg"
          >
            <Text className="text-white font-black text-base mr-2">
              Proceed to Payment
            </Text>
            <ArrowRight size={18} color="#FFFFFF" />
          </Pressable>

          <View className="flex-row items-center justify-center mt-3">
            <ShieldCheck size={14} color="#059669" className="mr-1" />
            <Text className="text-slate-400 text-xs ml-1">
              Official EDSA Secure Vending Platform
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Floating Navigation Bar on Mobile */}
      <NavigationTabBar currentRoute="/buy" />
    </SafeAreaView>
  );
}
