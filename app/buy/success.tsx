import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  CheckCircle2,
  Receipt,
  Home,
  Zap,
  ArrowRight,
} from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { Header } from '../../components/Header';
import { TokenDisplayCard } from '../../components/TokenDisplayCard';
import { ReceiptModal } from '../../components/ReceiptModal';
import { NavigationTabBar } from '../../components/NavigationTabBar';

export default function BuySuccessScreen() {
  const { transactions, buyDraft, resetBuyDraft } = useApp();
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Grab latest transaction
  const latestTx = transactions[0];

  const tokenNumber =
    latestTx?.tokenNumber || buyDraft.generatedToken || '5820 1938 4721 9042 1184';
  const unitsKwh = latestTx?.unitsKwh || buyDraft.unitsKwh || 17.1;
  const amountLe = latestTx?.amountLe || buyDraft.amountLe || 200;
  const meterNumber =
    latestTx?.meterNumber || buyDraft.meterNumber || '12345678901';
  const customerName =
    latestTx?.customerName || buyDraft.customerName || 'Amadu Sesay';

  const handleGoHome = () => {
    resetBuyDraft();
    router.push('/' as any);
  };

  const handleBuyAnother = () => {
    resetBuyDraft();
    router.push('/buy' as any);
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
          {/* Success Banner */}
          <View className="bg-emerald-600 rounded-3xl p-5 mb-4 shadow-md flex-row items-center">
            <View className="w-12 h-12 rounded-2xl bg-white/20 items-center justify-center mr-3">
              <CheckCircle2 size={28} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-black text-xl">
                Recharge Successful!
              </Text>
              <Text className="text-emerald-100 text-xs">
                Your 20-digit STS Electricity Token has been generated.
              </Text>
            </View>
          </View>

          {/* STS Token Display Card with Copy & Keypad instructions */}
          <TokenDisplayCard
            tokenNumber={tokenNumber}
            unitsKwh={unitsKwh}
            amountLe={amountLe}
            meterNumber={meterNumber}
            customerName={customerName}
          />

          {/* Action buttons */}
          <View className="space-y-3 mt-4">
            {/* View Official VAT Receipt */}
            <Pressable
              onPress={() => setShowReceiptModal(true)}
              className="bg-white border border-slate-200 active:bg-slate-50 p-4 rounded-2xl flex-row items-center justify-between shadow-sm"
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-xl bg-blue-50 items-center justify-center mr-3">
                  <Receipt size={20} color="#1E40AF" />
                </View>
                <View>
                  <Text className="text-slate-900 font-bold text-sm">
                    Official Digital VAT Receipt
                  </Text>
                  <Text className="text-slate-500 text-xs">
                    View, download or share tax invoice
                  </Text>
                </View>
              </View>
              <ArrowRight size={18} color="#64748B" />
            </Pressable>

            {/* Back to Home button */}
            <Pressable
              onPress={handleGoHome}
              className="bg-edsa-primary active:bg-edsa-primary py-4 px-6 rounded-2xl flex-row items-center justify-center shadow-md"
            >
              <Home size={18} color="#FFFFFF" className="mr-2" />
              <Text className="text-white font-black text-base ml-1">
                Return to Dashboard
              </Text>
            </Pressable>

            {/* Buy another */}
            <Pressable
              onPress={handleBuyAnother}
              className="bg-slate-100 active:bg-slate-200 py-3.5 px-6 rounded-2xl flex-row items-center justify-center"
            >
              <Zap size={16} color="#1E293B" className="mr-1.5" />
              <Text className="text-slate-800 font-bold text-sm ml-1">
                Buy Token for Another Meter
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Receipt Modal */}
      {latestTx && (
        <ReceiptModal
          visible={showReceiptModal}
          onClose={() => setShowReceiptModal(false)}
          transaction={latestTx}
        />
      )}
      {/* Bottom Floating Navigation Bar */}
      <NavigationTabBar currentRoute="/buy" />
    </SafeAreaView>
  );
}
