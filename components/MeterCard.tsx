import React, { useState } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { Zap, Copy, Check, ChevronRight, Gauge, ShieldAlert } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useApp } from '../context/AppContext';
import { Meter } from '../types/edsa';

interface MeterCardProps {
  meter?: Meter;
  onSwitchPress?: () => void;
  showQuickBuy?: boolean;
}

export const MeterCard: React.FC<MeterCardProps> = ({
  meter: propMeter,
  onSwitchPress,
  showQuickBuy = true,
}) => {
  const { activeMeter } = useApp();
  const [copied, setCopied] = useState(false);

  const meter = propMeter || activeMeter;

  if (!meter) {
    return (
      <View className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <Text className="text-slate-500">No active meter selected</Text>
      </View>
    );
  }

  const handleCopyMeter = async () => {
    try {
      await Clipboard.setStringAsync(meter.meterNumber);
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // no-op
    }
  };

  const isLowBalance = meter.balanceKwh < 20;

  return (
    <View className="bg-edsa-navy rounded-3xl p-6 shadow-xl relative overflow-hidden my-2">
      {/* Background visual accents */}
      <View className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-edsa-blue/20 blur-2xl pointer-events-none" />
      <View className="absolute -left-10 -bottom-10 w-36 h-36 rounded-full bg-edsa-accent/10 blur-2xl pointer-events-none" />

      {/* Top row: Nickname & Tariff Category */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-1 mr-2">
          <View className="flex-row items-center space-x-2">
            <Text className="text-white font-bold text-lg" numberOfLines={1}>
              {meter.nickname}
            </Text>
          </View>
          <Text className="text-slate-300 text-xs mt-0.5" numberOfLines={1}>
            {meter.location}
          </Text>
        </View>

        <View className="flex-row items-center space-x-1.5">
          <View
            className={`px-2.5 py-1 rounded-full border ${
              meter.tariffCategory === 'residential'
                ? 'bg-blue-500/20 border-blue-400/30'
                : 'bg-edsa-gold/20 border-amber-400/30'
            }`}
          >
            <Text
              className={`text-[11px] font-bold uppercase tracking-wider ${
                meter.tariffCategory === 'residential'
                  ? 'text-blue-200'
                  : 'text-amber-200'
              }`}
            >
              {meter.tariffCategory}
            </Text>
          </View>
        </View>
      </View>

      {/* Meter Number with 1-Tap Copy */}
      <View className="flex-row items-center justify-between bg-black/25 rounded-xl px-3.5 py-2 mb-4 border border-white/10">
        <View>
          <Text className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Meter Number
          </Text>
          <Text className="text-white font-mono font-bold text-sm tracking-widest mt-0.5">
            {meter.meterNumber}
          </Text>
        </View>

        <Pressable
          onPress={handleCopyMeter}
          className="flex-row items-center bg-white/10 active:bg-white/20 px-2.5 py-1.5 rounded-lg border border-white/10"
        >
          {copied ? (
            <>
              <Check size={13} color="#10B981" />
              <Text className="text-emerald-300 text-xs ml-1 font-semibold">
                Copied
              </Text>
            </>
          ) : (
            <>
              <Copy size={13} color="#FFFFFF" />
              <Text className="text-white text-xs ml-1 font-medium">Copy</Text>
            </>
          )}
        </Pressable>
      </View>

      {/* Main Units Balance Section */}
      <View className="flex-row items-end justify-between py-2 border-t border-white/10">
        <View>
          <View className="flex-row items-center space-x-1.5 mb-1">
            <Gauge size={14} color="#93C5FD" />
            <Text className="text-blue-200 text-xs font-medium">
              Estimated Balance
            </Text>
          </View>
          <View className="flex-row items-baseline">
            <Text className="text-white text-3xl font-black tracking-tight">
              {meter.balanceKwh.toFixed(1)}
            </Text>
            <Text className="text-slate-300 text-sm font-semibold ml-1.5">
              kWh
            </Text>
          </View>
        </View>

        {isLowBalance && (
          <View className="flex-row items-center bg-red-500/20 border border-red-500/40 px-2.5 py-1 rounded-lg">
            <ShieldAlert size={13} color="#FCA5A5" />
            <Text className="text-red-200 text-[11px] font-semibold ml-1">
              Low Balance
            </Text>
          </View>
        )}
      </View>

      {/* Action buttons */}
      {showQuickBuy && (
        <View className="mt-4 pt-3 border-t border-white/10 flex-row gap-3">
          <Pressable
            onPress={() => router.push('/buy' as any)}
            className="flex-1 bg-[#FBBF24] active:bg-amber-300 py-3 rounded-xl flex-row items-center justify-center shadow-md active:scale-[0.98]"
          >
            <Zap size={18} color="#0B2545" className="mr-1.5 fill-current" />
            <Text className="text-edsa-navy font-black text-sm">
              Buy Electricity Now
            </Text>
          </Pressable>

          {onSwitchPress && (
            <Pressable
              onPress={onSwitchPress}
              className="bg-white/10 active:bg-white/20 px-3 py-3 rounded-xl items-center justify-center border border-white/15"
            >
              <Text className="text-white text-xs font-semibold">Switch</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};
