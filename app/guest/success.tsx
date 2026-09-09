import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  CheckCircle2,
  Receipt,
  Home,
  Copy,
  Check,
  Zap,
  ArrowRight,
  ShieldCheck,
  Download,
  Share2,
} from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { useApp } from '../../context/AppContext';
import { ReceiptModal } from '../../components/ReceiptModal';
import { TokenDisplayCard } from '../../components/TokenDisplayCard';

export default function GuestSuccessScreen() {
  const { transactions, buyDraft, resetBuyDraft } = useApp();
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  const latestTx = transactions[0];
  const tokenToDisplay =
    buyDraft.generatedToken || latestTx?.tokenNumber || '4829 1934 0281 9472 0184';

  const handleCopy = async () => {
    const cleanDigits = tokenToDisplay.replace(/[^0-9]/g, '');
    await Clipboard.setStringAsync(cleanDigits);
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2500);
  };

  const handleFinish = () => {
    resetBuyDraft();
    router.replace('/' as any);
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-white border-b border-slate-200 px-4 py-3 flex-row items-center justify-between">
        <Text className="text-edsa-navy font-bold text-base">
          Payment Successful
        </Text>
        <View className="bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
          <Text className="text-emerald-900 text-[10px] font-bold uppercase">
            STS Token Generated
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="max-w-md w-full mx-auto px-4 pt-4">
          {/* Success Banner */}
          <View className="items-center mb-4">
            <View className="w-16 h-16 rounded-full bg-emerald-100 border-4 border-emerald-50 items-center justify-center mb-2 shadow-sm">
              <CheckCircle2 size={36} color="#059669" />
            </View>
            <Text className="text-slate-900 font-black text-xl text-center">
              Electricity Token Ready!
            </Text>
            <Text className="text-slate-500 text-xs text-center mt-0.5">
              Ref: {latestTx?.referenceNumber || 'EDSA-GST-78210'} • Meter: {latestTx?.meterNumber || buyDraft.meterNumber || '12345678901'}
            </Text>
          </View>

          {/* High-Contrast 20-Digit STS Token Card */}
          <View className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-2xl mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center">
                <View className="w-2.5 h-2.5 rounded-full bg-emerald-400 mr-2 animate-pulse" />
                <Text className="text-emerald-400 text-xs font-black uppercase tracking-wider">
                  20-Digit STS Token
                </Text>
              </View>
              <Text className="text-amber-400 font-mono font-bold text-xs">
                +{latestTx?.unitsKwh.toFixed(1) || buyDraft.unitsKwh?.toFixed(1) || '9.4'} kWh
              </Text>
            </View>

            {/* Token Digits */}
            <View className="bg-slate-800/80 rounded-2xl p-4 my-2 border border-slate-700/60 items-center">
              <Text className="text-white font-mono font-black text-2xl tracking-widest text-center select-all">
                {tokenToDisplay}
              </Text>
            </View>

            {/* 1-Tap Copy Action */}
            <Pressable
              onPress={handleCopy}
              className={`w-full py-3 rounded-xl flex-row items-center justify-center mt-2 ${
                copiedToken
                  ? 'bg-emerald-600'
                  : 'bg-edsa-primary active:bg-blue-800'
              }`}
            >
              {copiedToken ? (
                <>
                  <Check size={18} color="#FFFFFF" className="mr-1.5" />
                  <Text className="text-white font-bold text-sm">
                    Token Digits Copied!
                  </Text>
                </>
              ) : (
                <>
                  <Copy size={18} color="#FFFFFF" className="mr-1.5" />
                  <Text className="text-white font-bold text-sm">
                    1-Tap Copy 20-Digit Token
                  </Text>
                </>
              )}
            </Pressable>

            {/* Keypad entry instructions */}
            <View className="mt-4 pt-3 border-t border-slate-800">
              <Text className="text-[11px] font-bold text-slate-300 mb-1">
                How to enter into your meter keypad:
              </Text>
              <Text className="text-[10.5px] text-slate-400 leading-4">
                1. Type the 20 digits directly on your EDSA keypad.{'\n'}
                2. Press the blue or red <Text className="font-bold text-white">↵ Enter</Text> key.{'\n'}
                3. The screen will display <Text className="text-emerald-400 font-bold">ACCEPT</Text> and your balance updates immediately.
              </Text>
            </View>
          </View>

          {/* View Digital VAT Receipt */}
          <Pressable
            onPress={() => setShowReceiptModal(true)}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex-row items-center justify-between mb-4 active:bg-slate-50"
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-xl bg-blue-50 items-center justify-center mr-3">
                <Receipt size={20} color="#1E40AF" />
              </View>
              <View>
                <Text className="text-sm font-bold text-slate-900">
                  Official Digital VAT Receipt
                </Text>
                <Text className="text-[11px] text-slate-500">
                  View, download or print tax invoice
                </Text>
              </View>
            </View>
            <ArrowRight size={18} color="#64748B" />
          </Pressable>

          {/* Return Home Button */}
          <Pressable
            onPress={handleFinish}
            className="bg-slate-800 active:bg-slate-900 py-3.5 rounded-2xl flex-row items-center justify-center shadow-md mb-3"
          >
            <Home size={18} color="#FFFFFF" className="mr-2" />
            <Text className="text-white font-bold text-sm">
              Return to EDSA Portal
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Digital Receipt Modal */}
      {latestTx && (
        <ReceiptModal
          visible={showReceiptModal}
          onClose={() => setShowReceiptModal(false)}
          transaction={latestTx}
        />
      )}
    </SafeAreaView>
  );
}
