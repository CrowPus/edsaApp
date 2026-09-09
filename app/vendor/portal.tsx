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
  Store,
  Zap,
  Wallet,
  Coins,
  ArrowRight,
  ArrowLeft,
  Check,
  Copy,
  Receipt,
  RefreshCw,
  LogOut,
  Sparkles,
  ShieldCheck,
  User,
  History,
  Phone,
  AlertCircle,
  TrendingUp,
  Package,
  MapPin,
  CheckCircle2,
  Clock,
  FileText,
  ChevronRight,
  Building,
} from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { useApp } from '../../context/AppContext';
import { MeterService } from '../../services/meterService';
import { TokenVendingService } from '../../services/tokenVendingService';
import { IdDocumentType, MeterApplication, Transaction } from '../../types/edsa';
import { ReceiptModal } from '../../components/ReceiptModal';

const VENDOR_PRESET_AMOUNTS = [50, 100, 200, 500, 1000, 2000];

const EDSA_PICKUP_OFFICES = [
  'EDSA Central District Office - Siaka Stevens Street, Freetown',
  'EDSA East District Office - Cline Town, Freetown',
  'EDSA West District Office - Lumley Main Road, Freetown',
  'EDSA Bo Regional Hub - Bo Town Center',
  'EDSA Kenema Regional Office - Hangha Road, Kenema',
  'EDSA Makeni Regional Office - Rogbaneh Road, Makeni',
];

export default function VendorPortalScreen() {
  const {
    vendor,
    vendorVendForCustomer,
    vendorExchangeBonusToCredit,
    meterApplications,
    applyForNewMeter,
    transactions,
    logout,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'vend' | 'apply_meter' | 'history'>('vend');

  // Vending Form State
  const [customerMeter, setCustomerMeter] = useState('');
  const [amountLe, setAmountLe] = useState<number>(200);
  const [customAmount, setCustomAmount] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+232 76 111 222');
  const [paymentSource, setPaymentSource] = useState<'wallet' | 'direct'>('wallet');

  // Vending Outcome State
  const [isProcessing, setIsProcessing] = useState(false);
  const [latestVendTx, setLatestVendTx] = useState<Transaction | null>(null);
  const [earnedCommissionLe, setEarnedCommissionLe] = useState<number>(0);
  const [copiedToken, setCopiedToken] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [exchangeNotice, setExchangeNotice] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Meter Application Form State for Agents
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custDistrict, setCustDistrict] = useState('Western Area Urban (Freetown)');
  const [custPropertyType, setCustPropertyType] = useState<'residential' | 'commercial'>('residential');
  const [custConnectionType, setCustConnectionType] = useState<'single_phase_5_30a' | 'three_phase_10_100a'>('single_phase_5_30a');
  const [custIdType, setCustIdType] = useState<IdDocumentType>('national_id');
  const [custIdNumber, setCustIdNumber] = useState('');
  const [selectedPickupOffice, setSelectedPickupOffice] = useState(EDSA_PICKUP_OFFICES[0]);
  const [meterAppSubmittedRef, setMeterAppSubmittedRef] = useState<string | null>(null);
  const [meterAppSuccess, setMeterAppSuccess] = useState(false);
  const [meterAppError, setMeterAppError] = useState<string | null>(null);

  const activeAmount = customAmount ? parseFloat(customAmount) || 0 : amountLe;
  const breakdown = MeterService.calculateEstimatedUnits(
    activeAmount,
    'residential',
    false
  );

  // Handle Vend
  const handleVendForCustomer = async () => {
    setErrorMsg(null);
    const cleanMeter = customerMeter.replace(/\D/g, '');
    if (cleanMeter.length !== 11) {
      setErrorMsg('Please enter a valid 11-digit EDSA meter number.');
      return;
    }
    if (activeAmount < 20) {
      setErrorMsg('Minimum vending amount is Le 20.00.');
      return;
    }
    if (paymentSource === 'wallet' && (vendor?.walletBalanceLe || 0) < activeAmount) {
      setErrorMsg('Insufficient Agent Wallet Balance. Please top up or switch payment method.');
      return;
    }

    setIsProcessing(true);
    const res = await vendorVendForCustomer({
      customerMeterNumber: cleanMeter,
      amountLe: activeAmount,
      customerPhone: customerPhone.trim() || undefined,
      paymentSource,
    });
    setIsProcessing(false);

    if (res.success && res.transaction) {
      setLatestVendTx(res.transaction);
      setEarnedCommissionLe(res.commissionEarnedLe);
    } else {
      setErrorMsg(res.error || 'Vending failed. Please try again.');
    }
  };

  // Handle Exchange Bonus to Credit
  const handleExchangeBonus = () => {
    const res = vendorExchangeBonusToCredit();
    if (res.success) {
      setExchangeNotice(
        `Successfully exchanged bonus into +Le ${res.creditedLe.toFixed(2)} Agent Wallet balance!`
      );
      setTimeout(() => setExchangeNotice(null), 5000);
    }
  };

  // Handle Meter Application for Customer
  const handleApplyMeterForCustomer = () => {
    setMeterAppError(null);
    if (!custName.trim()) {
      setMeterAppError('Please enter customer full name.');
      return;
    }
    if (!custPhone.trim() || custPhone.trim().length < 8) {
      setMeterAppError('Please enter a valid customer phone number.');
      return;
    }
    if (!custAddress.trim()) {
      setMeterAppError('Please enter customer premises address.');
      return;
    }
    if (!custIdNumber.trim()) {
      setMeterAppError('Please enter customer ID / NIN number.');
      return;
    }

    const app = applyForNewMeter({
      applicantName: custName.trim(),
      applicantPhone: custPhone.trim(),
      applicantIdType: custIdType,
      applicantIdNumber: custIdNumber.trim(),
      premisesAddress: custAddress.trim(),
      district: custDistrict,
      propertyType: custPropertyType,
      connectionType: custConnectionType,
      useDefaultDetails: false,
      pickupOfficeLocation: selectedPickupOffice,
      notes: `Application processed by Authorized Agent: ${vendor?.businessName || 'Agent'} (Code: ${vendor?.agentCode || 'EDSA-AGT-4402'})`,
    });

    setMeterAppSubmittedRef(app.applicationNumber);
    setMeterAppSuccess(true);
    // Reset form
    setCustName('');
    setCustPhone('');
    setCustAddress('');
    setCustIdNumber('');
  };

  const handleCopy = async (token: string) => {
    const cleanDigits = token.replace(/[^0-9]/g, '');
    await Clipboard.setStringAsync(cleanDigits);
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const vendorTransactions = transactions.filter((t) => t.isVendorVending);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-slate-900">
      {/* Top Agent Bar */}
      <View className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 items-center justify-center mr-2.5">
            <Store size={20} color="#F59E0B" />
          </View>
          <View>
            <View className="flex-row items-center">
              <Text className="text-white font-black text-sm">
                {vendor?.businessName || 'Sierra Power Link Ltd'}
              </Text>
              <View className="bg-amber-400/20 px-2 py-0.5 rounded ml-2 border border-amber-400/30">
                <Text className="text-amber-300 font-mono text-[10px] font-bold">
                  {vendor?.agentCode || 'EDSA-AGT-4402'}
                </Text>
              </View>
            </View>
            <Text className="text-slate-400 text-[10px]">
              Agent: {vendor?.agentName || 'Alpha Koroma'} • {vendor?.district || 'Freetown'}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => {
            logout();
            router.replace('/' as any);
          }}
          className="p-2 rounded-xl bg-slate-800/80 active:bg-slate-800 flex-row items-center space-x-1"
        >
          <LogOut size={15} color="#94A3B8" />
          <Text className="text-slate-300 text-xs font-bold ml-1">Exit</Text>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="max-w-4xl w-full mx-auto px-4 pt-3">
          {/* Dual Wallets Grid: Vending Balance & Commission Bonus */}
          <View className="flex-row flex-wrap gap-3 mb-4">
            {/* Wallet 1: Agent Vending Float Balance */}
            <View className="flex-1 min-w-[280px] bg-slate-800/90 rounded-3xl p-4 border border-slate-700/80 shadow-lg">
              <View className="flex-row items-center justify-between mb-1">
                <View className="flex-row items-center">
                  <Wallet size={16} color="#60A5FA" className="mr-1.5" />
                  <Text className="text-slate-300 text-xs font-bold uppercase tracking-wider">
                    Agent Vending Float
                  </Text>
                </View>
                <View className="bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <Text className="text-emerald-400 text-[10px] font-black">
                    Active
                  </Text>
                </View>
              </View>

              <Text className="text-white text-2xl font-black tracking-tight my-1">
                Le {(vendor?.walletBalanceLe || 4850).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                })}
              </Text>
              <Text className="text-slate-400 text-[10px]">
                Total Vended to Date: Le {(vendor?.totalVendedLe || 24500).toLocaleString()}
              </Text>
            </View>

            {/* Wallet 2: Commission & Bonus Exchange Wallet */}
            <View className="flex-1 min-w-[280px] bg-gradient-to-br from-amber-950/60 to-slate-800 rounded-3xl p-4 border border-amber-500/40 shadow-lg">
              <View className="flex-row items-center justify-between mb-1">
                <View className="flex-row items-center">
                  <Coins size={16} color="#FBBF24" className="mr-1.5" />
                  <Text className="text-amber-300 text-xs font-black uppercase tracking-wider">
                    Agent Commission Wallet
                  </Text>
                </View>
                <View className="bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/40">
                  <Text className="text-amber-300 text-[10px] font-black">
                    +5% Per Sale
                  </Text>
                </View>
              </View>

              <View className="flex-row items-baseline justify-between my-1">
                <Text className="text-amber-400 text-2xl font-black tracking-tight font-mono">
                  +{(vendor?.bonusCommissionKwh || 142.8).toFixed(1)} kWh
                </Text>
                <Text className="text-slate-300 font-bold text-xs">
                  ≈ Le {(vendor?.bonusCommissionLe || 1438).toFixed(2)}
                </Text>
              </View>

              {/* Bonus Exchange Button */}
              <Pressable
                onPress={handleExchangeBonus}
                className="w-full mt-2 py-2 bg-amber-500 active:bg-amber-600 rounded-xl flex-row items-center justify-center shadow-md"
              >
                <RefreshCw size={14} color="#000000" className="mr-1.5" />
                <Text className="text-slate-950 font-black text-xs">
                  Exchange Bonus to Vending Credit
                </Text>
              </Pressable>
            </View>
          </View>

          {exchangeNotice && (
            <View className="bg-emerald-950/80 border border-emerald-500/50 rounded-2xl p-3 mb-4 flex-row items-center">
              <Sparkles size={16} color="#34D399" className="mr-2" />
              <Text className="text-emerald-300 text-xs font-bold flex-1">
                {exchangeNotice}
              </Text>
            </View>
          )}

          {/* 3-Tab Segmented Selector for Agents */}
          <View className="flex-row bg-slate-950 p-1.5 rounded-2xl border border-slate-800 mb-4">
            <Pressable
              onPress={() => setActiveTab('vend')}
              className={`flex-1 py-2.5 rounded-xl flex-row items-center justify-center ${
                activeTab === 'vend'
                  ? 'bg-amber-500 shadow-sm'
                  : 'bg-transparent active:bg-slate-900'
              }`}
            >
              <Zap
                size={16}
                color={activeTab === 'vend' ? '#000000' : '#94A3B8'}
                className="mr-1.5"
              />
              <Text
                className={`text-xs font-black ${
                  activeTab === 'vend' ? 'text-slate-950' : 'text-slate-400'
                }`}
              >
                Vend Token
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('apply_meter')}
              className={`flex-1 py-2.5 rounded-xl flex-row items-center justify-center ${
                activeTab === 'apply_meter'
                  ? 'bg-amber-500 shadow-sm'
                  : 'bg-transparent active:bg-slate-900'
              }`}
            >
              <Package
                size={16}
                color={activeTab === 'apply_meter' ? '#000000' : '#94A3B8'}
                className="mr-1.5"
              />
              <Text
                className={`text-xs font-black ${
                  activeTab === 'apply_meter' ? 'text-slate-950' : 'text-slate-400'
                }`}
              >
                Buy Meter
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('history')}
              className={`flex-1 py-2.5 rounded-xl flex-row items-center justify-center ${
                activeTab === 'history'
                  ? 'bg-amber-500 shadow-sm'
                  : 'bg-transparent active:bg-slate-900'
              }`}
            >
              <History
                size={16}
                color={activeTab === 'history' ? '#000000' : '#94A3B8'}
                className="mr-1.5"
              />
              <Text
                className={`text-xs font-black ${
                  activeTab === 'history' ? 'text-slate-950' : 'text-slate-400'
                }`}
              >
                Ledger ({vendorTransactions.length})
              </Text>
            </Pressable>
          </View>

          {/* TAB 1: VEND ELECTRICITY */}
          {activeTab === 'vend' && (
            <View className="flex-row flex-wrap gap-4">
              {/* Left: Fast Vending Terminal */}
              <View className="flex-1 min-w-[320px] bg-slate-800 rounded-3xl p-5 border border-slate-700 shadow-xl">
                <View className="flex-row items-center justify-between pb-3 border-b border-slate-700 mb-4">
                  <View className="flex-row items-center">
                    <Zap size={18} color="#F59E0B" className="mr-2" />
                    <Text className="text-white font-black text-base">
                      Fast Customer Vending
                    </Text>
                  </View>
                  <View className="bg-slate-700 px-2 py-0.5 rounded-full">
                    <Text className="text-slate-300 text-[10px]">Instant STS</Text>
                  </View>
                </View>

                {/* Customer Meter Input */}
                <View className="mb-3">
                  <Text className="text-xs font-bold text-slate-300 mb-1">
                    Customer 11-Digit Meter Number *
                  </Text>
                  <TextInput
                    value={customerMeter}
                    onChangeText={setCustomerMeter}
                    placeholder="e.g. 12345678901"
                    placeholderTextColor="#64748B"
                    keyboardType="numeric"
                    maxLength={11}
                    className="bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-white font-mono font-bold text-base"
                  />
                </View>

                {/* Amount Presets */}
                <View className="mb-3">
                  <Text className="text-xs font-bold text-slate-300 mb-1.5">
                    Select Vending Amount (Le) *
                  </Text>
                  <View className="flex-row flex-wrap gap-2 mb-2">
                    {VENDOR_PRESET_AMOUNTS.map((amt) => {
                      const isSelected = amountLe === amt && !customAmount;
                      return (
                        <Pressable
                          key={amt}
                          onPress={() => {
                            setAmountLe(amt);
                            setCustomAmount('');
                          }}
                          className={`py-2 px-3.5 rounded-xl border ${
                            isSelected
                              ? 'bg-amber-500 border-amber-500'
                              : 'bg-slate-900 border-slate-700'
                          }`}
                        >
                          <Text
                            className={`text-xs font-bold ${
                              isSelected ? 'text-slate-950 font-black' : 'text-slate-300'
                            }`}
                          >
                            Le {amt}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  <TextInput
                    value={customAmount}
                    onChangeText={(val) => {
                      setCustomAmount(val);
                      const num = parseFloat(val);
                      if (!isNaN(num) && num > 0) setAmountLe(num);
                    }}
                    placeholder="Or enter custom amount in Leones..."
                    placeholderTextColor="#64748B"
                    keyboardType="numeric"
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm"
                  />
                </View>

                {/* Customer Phone for SMS token */}
                <View className="mb-4">
                  <Text className="text-xs font-bold text-slate-300 mb-1">
                    Customer Mobile for SMS Token Delivery (Optional)
                  </Text>
                  <TextInput
                    value={customerPhone}
                    onChangeText={setCustomerPhone}
                    placeholder="+232 76 000 000"
                    placeholderTextColor="#64748B"
                    keyboardType="phone-pad"
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm"
                  />
                </View>

                {/* Estimated Units & Commission breakdown card */}
                <View className="bg-slate-900 rounded-2xl p-3 border border-slate-700/80 mb-4">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-slate-400 text-xs">Customer Energy Units:</Text>
                    <Text className="text-emerald-400 font-mono font-bold text-sm">
                      {breakdown.unitsKwh.toFixed(1)} kWh
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center pt-1 border-t border-slate-800">
                    <Text className="text-amber-400 text-xs font-bold">
                      Your +5% Commission Bonus:
                    </Text>
                    <Text className="text-amber-300 font-mono font-black text-sm">
                      +{(breakdown.unitsKwh * 0.05).toFixed(1)} kWh (Le {(activeAmount * 0.05).toFixed(2)})
                    </Text>
                  </View>
                </View>

                {errorMsg && (
                  <View className="bg-red-950/80 border border-red-500 rounded-xl p-3 mb-3 flex-row items-center">
                    <AlertCircle size={16} color="#EF4444" className="mr-2" />
                    <Text className="text-red-300 text-xs flex-1 font-medium">{errorMsg}</Text>
                  </View>
                )}

                {/* Submit Vend Button */}
                <Pressable
                  onPress={handleVendForCustomer}
                  disabled={isProcessing}
                  className="bg-amber-500 active:bg-amber-600 py-3.5 px-4 rounded-2xl flex-row items-center justify-center shadow-lg"
                >
                  <Zap size={18} color="#000000" className="mr-2" />
                  <Text className="text-slate-950 font-black text-base">
                    {isProcessing ? 'Generating STS Token...' : `Vend Le ${activeAmount.toLocaleString()} STS Token`}
                  </Text>
                </Pressable>
              </View>

              {/* Right: Output / Receipt Card */}
              {latestVendTx && (
                <View className="flex-1 min-w-[320px] bg-slate-800 rounded-3xl p-5 border border-emerald-500/50 shadow-xl justify-between">
                  <View>
                    <View className="flex-row items-center justify-between pb-3 border-b border-slate-700 mb-3">
                      <View className="flex-row items-center">
                        <CheckCircle2 size={20} color="#10B981" className="mr-2" />
                        <Text className="text-white font-black text-base">
                          Token Generated
                        </Text>
                      </View>
                      <View className="bg-emerald-500/20 px-2 py-0.5 rounded-full">
                        <Text className="text-emerald-400 text-[10px] font-bold">
                          Commission +Le {earnedCommissionLe.toFixed(2)}
                        </Text>
                      </View>
                    </View>

                    {/* 20-Digit Token Card */}
                    <View className="bg-slate-950 rounded-2xl p-4 border border-slate-700 mb-4 items-center">
                      <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1">
                        20-Digit Standard STS Token
                      </Text>
                      <Text className="text-amber-400 font-mono font-black text-lg text-center tracking-widest my-2">
                        {TokenVendingService.formatTokenForDisplay(latestVendTx.tokenNumber)}
                      </Text>
                      <Pressable
                        onPress={() => handleCopy(latestVendTx.tokenNumber)}
                        className="bg-slate-800 border border-slate-700 py-2 px-4 rounded-xl flex-row items-center active:bg-slate-700"
                      >
                        {copiedToken ? (
                          <>
                            <Check size={14} color="#10B981" className="mr-1.5" />
                            <Text className="text-emerald-400 text-xs font-bold">Copied!</Text>
                          </>
                        ) : (
                          <>
                            <Copy size={14} color="#FFFFFF" className="mr-1.5" />
                            <Text className="text-white text-xs font-bold">Copy Token</Text>
                          </>
                        )}
                      </Pressable>
                    </View>

                    {/* Summary list */}
                    <View className="bg-slate-900 rounded-2xl p-3 space-y-1.5 text-xs mb-4">
                      <View className="flex-row justify-between">
                        <Text className="text-slate-400 text-xs">Meter Number:</Text>
                        <Text className="text-white font-mono font-bold text-xs">{latestVendTx.meterNumber}</Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text className="text-slate-400 text-xs">Customer Units:</Text>
                        <Text className="text-emerald-400 font-mono font-bold text-xs">+{latestVendTx.unitsKwh.toFixed(1)} kWh</Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text className="text-slate-400 text-xs">Amount Paid:</Text>
                        <Text className="text-white font-bold text-xs">Le {latestVendTx.amountLe.toLocaleString()}</Text>
                      </View>
                    </View>
                  </View>

                  <Pressable
                    onPress={() => setShowReceiptModal(true)}
                    className="w-full py-3 bg-slate-700 active:bg-slate-600 rounded-2xl flex-row items-center justify-center"
                  >
                    <Receipt size={16} color="#FFFFFF" className="mr-2" />
                    <Text className="text-white font-bold text-sm">View Official VAT Invoice</Text>
                  </Pressable>
                </View>
              )}
            </View>
          )}

          {/* TAB 2: BUY / REQUEST METER FOR CUSTOMER */}
          {activeTab === 'apply_meter' && (
            <View className="bg-slate-800 rounded-3xl p-5 border border-slate-700 shadow-xl">
              <View className="flex-row items-center justify-between pb-3 border-b border-slate-700 mb-4">
                <View className="flex-row items-center">
                  <Package size={20} color="#F59E0B" className="mr-2" />
                  <View>
                    <Text className="text-white font-black text-base">
                      Apply / Order Meter for Customer
                    </Text>
                    <Text className="text-slate-400 text-[11px]">
                      Authorized Agent Service • Direct EDSA District Fulfillment
                    </Text>
                  </View>
                </View>
                <View className="bg-amber-400/20 px-2.5 py-1 rounded-full border border-amber-400/30">
                  <Text className="text-amber-300 font-bold text-[10px]">
                    AGENT SERVICE
                  </Text>
                </View>
              </View>

              {meterAppSuccess && meterAppSubmittedRef && (
                <View className="bg-emerald-950/90 border border-emerald-500 rounded-2xl p-4 mb-4">
                  <View className="flex-row items-center mb-1">
                    <CheckCircle2 size={18} color="#10B981" className="mr-2" />
                    <Text className="text-emerald-300 font-black text-sm">
                      Application Submitted Successfully!
                    </Text>
                  </View>
                  <Text className="text-slate-300 text-xs mb-2">
                    Application Reference: <Text className="text-amber-400 font-mono font-bold">{meterAppSubmittedRef}</Text>
                  </Text>
                  <Text className="text-slate-400 text-xs">
                    Customer will receive SMS updates when inspection is completed and meter is ready for pickup.
                  </Text>
                </View>
              )}

              {meterAppError && (
                <View className="bg-red-950/80 border border-red-500 rounded-xl p-3 mb-4 flex-row items-center">
                  <AlertCircle size={16} color="#EF4444" className="mr-2" />
                  <Text className="text-red-300 text-xs flex-1 font-medium">{meterAppError}</Text>
                </View>
              )}

              {/* Application Form */}
              <View className="space-y-3">
                <View className="flex-row flex-wrap gap-3">
                  <View className="flex-1 min-w-[240px]">
                    <Text className="text-xs font-bold text-slate-300 mb-1">
                      Customer Full Name *
                    </Text>
                    <TextInput
                      value={custName}
                      onChangeText={setCustName}
                      placeholder="e.g. Mariama Koroma"
                      placeholderTextColor="#64748B"
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm"
                    />
                  </View>

                  <View className="flex-1 min-w-[240px]">
                    <Text className="text-xs font-bold text-slate-300 mb-1">
                      Customer Phone Number *
                    </Text>
                    <TextInput
                      value={custPhone}
                      onChangeText={setCustPhone}
                      placeholder="+232 76 000 000"
                      placeholderTextColor="#64748B"
                      keyboardType="phone-pad"
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm"
                    />
                  </View>
                </View>

                {/* ID Type & Number */}
                <View className="flex-row flex-wrap gap-3">
                  <View className="flex-1 min-w-[240px]">
                    <Text className="text-xs font-bold text-slate-300 mb-1">
                      Identification Document *
                    </Text>
                    <View className="flex-row gap-2">
                      {[
                        { id: 'national_id', label: 'National ID' },
                        { id: 'nin', label: 'NIN' },
                        { id: 'passport', label: 'Passport' },
                      ].map((item) => (
                        <Pressable
                          key={item.id}
                          onPress={() => setCustIdType(item.id as IdDocumentType)}
                          className={`py-2 px-3 rounded-xl border flex-1 items-center ${
                            custIdType === item.id
                              ? 'bg-amber-500 border-amber-500'
                              : 'bg-slate-900 border-slate-700'
                          }`}
                        >
                          <Text
                            className={`text-xs font-bold ${
                              custIdType === item.id ? 'text-slate-950' : 'text-slate-400'
                            }`}
                          >
                            {item.label}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  <View className="flex-1 min-w-[240px]">
                    <Text className="text-xs font-bold text-slate-300 mb-1">
                      ID / NIN Number *
                    </Text>
                    <TextInput
                      value={custIdNumber}
                      onChangeText={setCustIdNumber}
                      placeholder="e.g. SL-NAT-123456"
                      placeholderTextColor="#64748B"
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm"
                    />
                  </View>
                </View>

                {/* Premises Address & District */}
                <View className="flex-row flex-wrap gap-3">
                  <View className="flex-1 min-w-[240px]">
                    <Text className="text-xs font-bold text-slate-300 mb-1">
                      Premises Physical Address *
                    </Text>
                    <TextInput
                      value={custAddress}
                      onChangeText={setCustAddress}
                      placeholder="e.g. 24 Wilkinson Road, Freetown"
                      placeholderTextColor="#64748B"
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm"
                    />
                  </View>

                  <View className="flex-1 min-w-[240px]">
                    <Text className="text-xs font-bold text-slate-300 mb-1">
                      Connection Phase *
                    </Text>
                    <View className="flex-row gap-2">
                      {[
                        { id: 'single_phase_5_30a', label: 'Single Phase (230V)' },
                        { id: 'three_phase_10_100a', label: 'Three Phase (400V)' },
                      ].map((conn) => (
                        <Pressable
                          key={conn.id}
                          onPress={() => setCustConnectionType(conn.id as any)}
                          className={`py-2 px-2.5 rounded-xl border flex-1 items-center ${
                            custConnectionType === conn.id
                              ? 'bg-amber-500 border-amber-500'
                              : 'bg-slate-900 border-slate-700'
                          }`}
                        >
                          <Text
                            className={`text-[11px] font-bold ${
                              custConnectionType === conn.id ? 'text-slate-950 font-black' : 'text-slate-400'
                            }`}
                          >
                            {conn.label}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                </View>

                {/* Pickup Office */}
                <View>
                  <Text className="text-xs font-bold text-slate-300 mb-1">
                    Designated EDSA District Pickup Office *
                  </Text>
                  <View className="space-y-1.5">
                    {EDSA_PICKUP_OFFICES.slice(0, 3).map((office) => {
                      const isSel = selectedPickupOffice === office;
                      return (
                        <Pressable
                          key={office}
                          onPress={() => setSelectedPickupOffice(office)}
                          className={`p-2.5 rounded-xl border flex-row items-center justify-between ${
                            isSel
                              ? 'bg-amber-500/20 border-amber-400'
                              : 'bg-slate-900 border-slate-700/80'
                          }`}
                        >
                          <View className="flex-row items-center flex-1 mr-2">
                            <MapPin size={14} color={isSel ? '#FBBF24' : '#64748B'} className="mr-2" />
                            <Text className={`text-xs ${isSel ? 'text-white font-bold' : 'text-slate-300'}`}>
                              {office}
                            </Text>
                          </View>
                          {isSel && <CheckCircle2 size={16} color="#FBBF24" />}
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                {/* Submit Application Button */}
                <Pressable
                  onPress={handleApplyMeterForCustomer}
                  className="w-full mt-2 bg-amber-500 active:bg-amber-600 py-3.5 rounded-2xl flex-row items-center justify-center shadow-lg"
                >
                  <Package size={18} color="#000000" className="mr-2" />
                  <Text className="text-slate-950 font-black text-sm">
                    Submit Meter Application for Customer →
                  </Text>
                </Pressable>
              </View>

              {/* Agent Submitted Applications Tracker */}
              <View className="mt-6 pt-5 border-t border-slate-700">
                <Text className="text-white font-black text-sm mb-3">
                  Recent Meter Applications Handled by Agent ({meterApplications.length})
                </Text>
                <View className="space-y-2.5">
                  {meterApplications.map((app) => (
                    <View
                      key={app.id}
                      className="bg-slate-900 p-3.5 rounded-2xl border border-slate-700"
                    >
                      <View className="flex-row items-center justify-between mb-1">
                        <Text className="text-amber-400 font-mono font-bold text-xs">
                          {app.applicationNumber}
                        </Text>
                        <View className="bg-blue-500/20 px-2 py-0.5 rounded-full border border-blue-500/30">
                          <Text className="text-blue-300 text-[10px] font-bold uppercase">
                            {app.status.replace('_', ' ')}
                          </Text>
                        </View>
                      </View>
                      <Text className="text-white text-xs font-bold">
                        {app.applicantName} • {app.applicantPhone}
                      </Text>
                      <Text className="text-slate-400 text-[11px] mt-0.5">
                        {app.premisesAddress} ({app.district})
                      </Text>
                      <View className="flex-row items-center justify-between mt-2 pt-1.5 border-t border-slate-800">
                        <Text className="text-slate-400 text-[10px]">
                          Pickup: {app.pickupOfficeLocation.split('-')[0]}
                        </Text>
                        <Text className="text-slate-400 text-[10px]">
                          Applied: {app.appliedDate}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* TAB 3: COMMISSION LEDGER & HISTORY */}
          {activeTab === 'history' && (
            <View className="bg-slate-800 rounded-3xl p-5 border border-slate-700 shadow-xl">
              <View className="flex-row items-center justify-between pb-3 border-b border-slate-700 mb-4">
                <View className="flex-row items-center">
                  <TrendingUp size={20} color="#F59E0B" className="mr-2" />
                  <Text className="text-white font-black text-base">
                    Agent Commission & Vending Ledger
                  </Text>
                </View>
                <Text className="text-amber-400 text-xs font-bold">
                  {vendorTransactions.length} Transactions
                </Text>
              </View>

              {vendorTransactions.length === 0 ? (
                <View className="py-8 items-center justify-center">
                  <History size={36} color="#64748B" className="mb-2" />
                  <Text className="text-slate-400 text-sm font-medium">
                    No transactions recorded yet today.
                  </Text>
                </View>
              ) : (
                <View className="space-y-3">
                  {vendorTransactions.map((tx) => (
                    <View
                      key={tx.id}
                      className="bg-slate-900 rounded-2xl p-4 border border-slate-700"
                    >
                      <View className="flex-row justify-between items-center mb-1">
                        <Text className="text-amber-400 font-mono font-bold text-xs">
                          {tx.meterNumber}
                        </Text>
                        <View className="bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          <Text className="text-emerald-400 text-[10px] font-black">
                            Commission: +Le {(tx.amountLe * 0.05).toFixed(2)}
                          </Text>
                        </View>
                      </View>
                      <Text className="text-white font-mono font-bold text-sm my-1">
                        {TokenVendingService.formatTokenForDisplay(tx.tokenNumber)}
                      </Text>
                      <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
                        <Text className="text-slate-400 text-xs">
                          +{tx.unitsKwh.toFixed(1)} kWh • Le {tx.amountLe.toLocaleString()}
                        </Text>
                        <Text className="text-slate-500 text-[10px]">
                          {new Date(tx.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Receipt Modal */}
      {latestVendTx && (
        <ReceiptModal
          visible={showReceiptModal}
          onClose={() => setShowReceiptModal(false)}
          transaction={latestVendTx}
        />
      )}
    </SafeAreaView>
  );
}
