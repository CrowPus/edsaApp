import React, { useState } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import {
  History,
  Copy,
  Check,
  Zap,
  ChevronRight,
  ExternalLink,
} from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useApp } from '../context/AppContext';
import { TokenVendingService } from '../services/tokenVendingService';
import { Transaction } from '../types/edsa';
import { ReceiptModal } from './ReceiptModal';

export const RecentTransactionsCard: React.FC = () => {
  const { transactions } = useApp();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const recentTx = transactions.slice(0, 3);
  const latestSuccessTx = transactions.find((t) => t.status === 'completed');

  const handleCopyToken = async (id: string, token: string) => {
    try {
      const cleanDigits = token.replace(/[^0-9]/g, '');
      await Clipboard.setStringAsync(cleanDigits);
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // no-op
    }
  };

  return (
    <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm my-2">
      {/* Card Header */}
      <View className="flex-row items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <View className="flex-row items-center space-x-2">
          <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center mr-2">
            <History size={16} color="#1E40AF" />
          </View>
          <Text className="text-slate-900 font-bold text-base">
            Recent Tokens & Purchases
          </Text>
        </View>

        <Pressable
          onPress={() => router.push('/transactions' as any)}
          className="flex-row items-center active:opacity-70"
        >
          <Text className="text-edsa-primary font-semibold text-xs mr-0.5">
            View All
          </Text>
          <ChevronRight size={14} color="#133E87" />
        </Pressable>
      </View>

      {/* Highlight: Most Recent STS Token (1-Tap Copy) */}
      {latestSuccessTx && (
        <View className="bg-slate-900 rounded-2xl p-4 mb-3">
          <View className="flex-row items-center justify-between mb-1.5">
            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5" />
              <Text className="text-emerald-400 font-bold text-[11px] uppercase tracking-wider">
                Latest STS Token
              </Text>
            </View>
            <Text className="text-slate-400 text-[11px]">
              +{latestSuccessTx.unitsKwh.toFixed(1)} kWh (Le {latestSuccessTx.amountLe.toLocaleString()})
            </Text>
          </View>

          <Text
            selectable
            className="text-lg font-mono font-black text-amber-300 tracking-wider my-1"
          >
            {TokenVendingService.formatTokenForDisplay(
              latestSuccessTx.tokenNumber
            )}
          </Text>

          <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-slate-800">
            <Text className="text-[11px] text-slate-400">
              Meter: {latestSuccessTx.meterNumber}
            </Text>

            <Pressable
              onPress={() =>
                handleCopyToken(latestSuccessTx.id, latestSuccessTx.tokenNumber)
              }
              className="flex-row items-center bg-white/10 active:bg-white/20 px-2.5 py-1 rounded-md"
            >
              {copiedId === latestSuccessTx.id ? (
                <>
                  <Check size={12} color="#10B981" />
                  <Text className="text-emerald-300 text-[11px] font-bold ml-1">
                    Copied!
                  </Text>
                </>
              ) : (
                <>
                  <Copy size={12} color="#FFFFFF" />
                  <Text className="text-white text-[11px] font-medium ml-1">
                    Copy
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
      )}

      {/* List of earlier transactions */}
      <View className="space-y-2">
        {recentTx.map((tx) => {
          const formattedDate = new Date(tx.createdAt).toLocaleDateString(
            'en-GB',
            {
              day: 'numeric',
              month: 'short',
            }
          );

          return (
            <Pressable
              key={tx.id}
              onPress={() => setSelectedTx(tx)}
              className="flex-row items-center justify-between py-2.5 px-3 rounded-xl bg-slate-50 active:bg-slate-100 border border-slate-100"
            >
              <View className="flex-row items-center flex-1 mr-2">
                <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-2.5">
                  <Zap size={15} color="#1E40AF" />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-900 font-bold text-xs">
                    Le {tx.amountLe.toLocaleString()} • {tx.unitsKwh.toFixed(1)} kWh
                  </Text>
                  <Text className="text-slate-400 text-[11px]">
                    {formattedDate} • {tx.meterNickname || tx.meterNumber}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <Text className="text-edsa-primary font-semibold text-[11px] mr-1">
                  Receipt
                </Text>
                <ChevronRight size={13} color="#133E87" />
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Modal for viewing receipt */}
      <ReceiptModal
        visible={!!selectedTx}
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
      />
    </View>
  );
};
