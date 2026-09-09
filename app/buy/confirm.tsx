import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Switch,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  ArrowLeft,
  ShieldCheck,
  Zap,
  CreditCard,
  Smartphone,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Lock,
} from "lucide-react-native";
import { useApp } from "../../context/AppContext";
import { Header } from "../../components/Header";
import { PrototypeNoticeBanner } from "../../components/PrototypeNoticeBanner";
import { NavigationTabBar } from "../../components/NavigationTabBar";
import { MeterService } from "../../services/meterService";
import { PaymentService } from "../../services/paymentService";
import { TariffCategory } from "../../types/edsa";

export default function ConfirmPaymentScreen() {
  const {
    buyDraft,
    activeMeter,
    completePurchase,
    simulateFailureMode,
    setSimulateFailureMode,
  } = useApp();

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>("");
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Fallback defaults if draft was partially filled
  const meterId = buyDraft.meterId || activeMeter?.id || "mtr_001";
  const meterNumber =
    buyDraft.meterNumber || activeMeter?.meterNumber || "12345678901";
  const meterNickname =
    buyDraft.meterNickname || activeMeter?.nickname || "Home Meter";
  const customerName =
    buyDraft.customerName || activeMeter?.customerName || "Amadu Sesay";
  const amountLe = buyDraft.amountLe && buyDraft.amountLe > 0 ? buyDraft.amountLe : 500;
  const tariffCategory: TariffCategory =
    buyDraft.tariffCategory || activeMeter?.tariffCategory || "residential";
  const paymentMethod = buyDraft.paymentMethod || "orange_money";
  const paymentPhone = buyDraft.paymentPhone || "+232 76 543 210";

  const breakdown = MeterService.calculateEstimatedUnits(
    amountLe,
    tariffCategory
  );

  const handleAuthorizePayment = async () => {
    setIsProcessing(true);
    setPaymentError(null);

    try {
      setProcessingStep("Connecting to payment provider...");
      await new Promise((r) => setTimeout(r, 600));

      setProcessingStep(
        paymentMethod === "card"
          ? "Authorizing card transaction with bank..."
          : `Sending USSD prompt to ${paymentPhone}...`
      );

      const paymentResult = await PaymentService.processPayment(
        paymentMethod,
        paymentPhone,
        amountLe,
        simulateFailureMode
      );

      if (!paymentResult.success) {
        setIsProcessing(false);
        setPaymentError(
          paymentResult.errorMessage ||
            "Payment failed. Please verify your mobile money balance or PIN."
        );
        return;
      }

      setProcessingStep("Contacting EDSA STS Vending Server...");
      await new Promise((r) => setTimeout(r, 700));

      setProcessingStep("Generating 20-digit STS Token...");
      const result = await completePurchase({
        simulateFailure: simulateFailureMode,
      });

      if (!result.success || !result.transaction) {
        setIsProcessing(false);
        setPaymentError(
          result.error ||
            "Failed to vend STS token. Please retry or contact 672."
        );
        return;
      }

      setIsProcessing(false);
      // Navigate to Success screen with transaction details
      router.push({
        pathname: "/buy/success" as any,
        params: {
          tokenNumber: result.transaction.tokenNumber,
          unitsKwh: result.transaction.unitsKwh.toString(),
          amountLe: result.transaction.amountLe.toString(),
          meterNumber: result.transaction.meterNumber,
          customerName: result.transaction.customerName,
          referenceNumber: result.transaction.referenceNumber,
        },
      });
    } catch (err: any) {
      setIsProcessing(false);
      setPaymentError(
        err.message || "An unexpected error occurred during processing."
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top", "bottom"]}>
      <Header />
      <PrototypeNoticeBanner />

      <ScrollView
        className="flex-1 px-4 py-4"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="max-w-xl w-full mx-auto">
          {/* Back button & Step Indicator */}
          <View className="flex-row items-center justify-between mb-4">
            <Pressable
              onPress={() => router.push("/buy/payment" as any)}
              className="flex-row items-center bg-white px-3 py-1.5 rounded-xl border border-slate-200 active:bg-slate-100"
            >
              <ArrowLeft size={16} color="#1E3A8A" />
              <Text className="text-xs font-semibold text-slate-700 ml-1">
                Back to Payment
              </Text>
            </Pressable>

            <View className="flex-row items-center space-x-1.5">
              <View className="w-6 h-6 rounded-full bg-emerald-500 items-center justify-center">
                <Text className="text-white text-xs font-bold">✓</Text>
              </View>
              <View className="w-5 h-0.5 bg-emerald-500" />
              <View className="w-6 h-6 rounded-full bg-emerald-500 items-center justify-center">
                <Text className="text-white text-xs font-bold">✓</Text>
              </View>
              <View className="w-5 h-0.5 bg-edsa-primary" />
              <View className="w-6 h-6 rounded-full bg-blue-700 items-center justify-center">
                <Text className="text-white text-xs font-bold">3</Text>
              </View>
            </View>
          </View>

          {/* Screen Title */}
          <View className="mb-4">
            <Text className="text-2xl font-black text-slate-900">
              Confirm & Authorize
            </Text>
            <Text className="text-xs text-slate-500 mt-0.5">
              Review transaction breakdown before generating your STS token
            </Text>
          </View>

          {/* Error Banner if payment was rejected */}
          {paymentError && (
            <View className="bg-rose-50 border border-rose-200 rounded-2xl p-4 mb-4">
              <View className="flex-row items-start">
                <AlertTriangle size={20} color="#DC2626" />
                <View className="ml-3 flex-1">
                  <Text className="text-rose-900 font-bold text-sm">
                    Transaction Declined / Failed
                  </Text>
                  <Text className="text-rose-700 text-xs mt-1 leading-4">
                    {paymentError}
                  </Text>
                  <Text className="text-slate-500 text-[11px] mt-2">
                    Tip: You can toggle off "Simulate Failure" below to test the
                    successful vending flow.
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Processing Modal / Overlay Card */}
          {isProcessing && (
            <View className="bg-edsa-primary rounded-3xl p-6 mb-6 shadow-lg border border-blue-800 items-center">
              <ActivityIndicator size="large" color="#FCD34D" />
              <Text className="text-white font-bold text-lg mt-4 text-center">
                Processing Electricity Vend
              </Text>
              <Text className="text-blue-200 text-xs mt-2 text-center">
                {processingStep}
              </Text>
              <View className="mt-4 px-3 py-1.5 bg-edsa-navy/70 rounded-full flex-row items-center space-x-1.5">
                <Lock size={12} color="#93C5FD" />
                <Text className="text-[11px] text-blue-300">
                  256-bit Encrypted STS Session
                </Text>
              </View>
            </View>
          )}

          {/* Review Summary Card */}
          <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-4">
            {/* Meter Header */}
            <View className="flex-row items-center justify-between pb-4 border-b border-slate-100">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-2xl bg-blue-50 items-center justify-center mr-3">
                  <Zap size={20} color="#1E40AF" />
                </View>
                <View>
                  <Text className="text-sm font-bold text-slate-900">
                    {meterNickname}
                  </Text>
                  <Text className="text-xs text-slate-500">
                    {MeterService.formatMeterNumber(meterNumber)}
                  </Text>
                </View>
              </View>

              <View className="bg-blue-50 px-2.5 py-1 rounded-full">
                <Text className="text-[10px] font-bold text-blue-700 uppercase">
                  {tariffCategory}
                </Text>
              </View>
            </View>

            {/* Customer info */}
            <View className="py-3 border-b border-slate-100 flex-row justify-between">
              <Text className="text-xs text-slate-500">Customer</Text>
              <Text className="text-xs font-semibold text-slate-800">
                {customerName}
              </Text>
            </View>

            {/* Units estimation */}
            <View className="py-3 border-b border-slate-100 flex-row justify-between items-center bg-blue-50/50 -mx-5 px-5">
              <View>
                <Text className="text-xs font-bold text-edsa-navy">
                  Estimated Units Credited
                </Text>
                <Text className="text-[10px] text-blue-700">
                  Based on official EDSA tariff rate
                </Text>
              </View>
              <Text className="text-lg font-black text-blue-700">
                +{breakdown.totalUnitsKwh.toFixed(1)} kWh
              </Text>
            </View>

            {/* Price breakdown */}
            <View className="py-3 space-y-2 border-b border-slate-100">
              <View className="flex-row justify-between">
                <Text className="text-xs text-slate-500">Energy Subtotal</Text>
                <Text className="text-xs text-slate-800 font-medium">
                  Le {breakdown.energyCostLe.toFixed(2)}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-xs text-slate-500">GST (15%)</Text>
                <Text className="text-xs text-slate-800 font-medium">
                  Le {breakdown.vatAmountLe.toFixed(2)}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-xs text-slate-500">Fixed Service Fee</Text>
                <Text className="text-xs text-slate-800 font-medium">
                  Le {breakdown.serviceFeeLe.toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Total Payable */}
            <View className="pt-3 flex-row justify-between items-center">
              <Text className="text-sm font-bold text-slate-900">Total Payable</Text>
              <Text className="text-xl font-black text-slate-900">
                Le {amountLe.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Payment Method Badge */}
          <View className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-5 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-9 h-9 rounded-xl bg-slate-100 items-center justify-center mr-3">
                {paymentMethod === "card" ? (
                  <CreditCard size={18} color="#0F172A" />
                ) : (
                  <Smartphone size={18} color="#0F172A" />
                )}
              </View>
              <View>
                <Text className="text-xs font-bold text-slate-800">
                  {paymentMethod === "orange_money"
                    ? "Orange Money SL"
                    : paymentMethod === "afrimoney"
                    ? "Afrimoney (Africell SL)"
                    : "Debit / Credit Card"}
                </Text>
                <Text className="text-[11px] text-slate-500">
                  Prompt: {paymentPhone}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => router.push("/buy/payment" as any)}
              className="px-2.5 py-1 rounded-lg bg-slate-100"
            >
              <Text className="text-[11px] font-semibold text-slate-600">
                Change
              </Text>
            </Pressable>
          </View>

          {/* Board Presentation: Simulate Failure toggle */}
          <View className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 mb-5 flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <View className="flex-row items-center space-x-1">
                <Text className="text-xs font-bold text-amber-900">
                  Board Demo: Test Failure Handling
                </Text>
              </View>
              <Text className="text-[11px] text-amber-700 mt-0.5">
                Toggle ON to simulate a carrier rejection / timeout scenario
              </Text>
            </View>

            <Switch
              value={simulateFailureMode}
              onValueChange={setSimulateFailureMode}
              trackColor={{ false: "#CBD5E1", true: "#F59E0B" }}
              thumbColor={simulateFailureMode ? "#FFFFFF" : "#FFFFFF"}
            />
          </View>

          {/* Primary Action Button */}
          <Pressable
            disabled={isProcessing}
            onPress={handleAuthorizePayment}
            className={`py-4 rounded-2xl items-center flex-row justify-center shadow-md active:opacity-90 ${
              isProcessing ? "bg-slate-400" : "bg-blue-700 active:bg-blue-800"
            }`}
          >
            {isProcessing ? (
              <View className="flex-row items-center space-x-2">
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text className="text-white font-bold text-base ml-2">
                  Authorizing Payment...
                </Text>
              </View>
            ) : (
              <View className="flex-row items-center space-x-2">
                <ShieldCheck size={20} color="#FFFFFF" />
                <Text className="text-white font-black text-base ml-2">
                  Authorize & Vend Token (Le {amountLe.toLocaleString()})
                </Text>
              </View>
            )}
          </Pressable>

          <View className="mt-3 items-center">
            <Text className="text-[11px] text-slate-400 text-center">
              EDSA Sierra Leone • Official STS Meter Vending System
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Tab Bar */}
      <NavigationTabBar />
    </SafeAreaView>
  );
}
