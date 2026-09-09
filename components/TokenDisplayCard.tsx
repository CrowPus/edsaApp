import React, { useState } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import {
  Copy,
  Check,
  Share2,
  Zap,
  Info,
  Smartphone,
  ShieldCheck,
} from 'lucide-react-native';
import { TokenVendingService } from '../services/tokenVendingService';

interface TokenDisplayCardProps {
  tokenNumber: string;
  unitsKwh: number;
  amountLe: number;
  meterNumber: string;
  customerName?: string;
  referenceNumber?: string;
  onOpenReceipt?: () => void;
}

export const TokenDisplayCard: React.FC<TokenDisplayCardProps> = ({
  tokenNumber,
  unitsKwh,
  amountLe,
  meterNumber,
  customerName,
  referenceNumber,
  onOpenReceipt,
}) => {
  const [copied, setCopied] = useState(false);

  const formattedToken = TokenVendingService.formatTokenForDisplay(tokenNumber);

  const handleCopy = async () => {
    try {
      const plainDigits = tokenNumber.replace(/[^0-9]/g, '');
      await Clipboard.setStringAsync(plainDigits);
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // no-op
    }
  };

  return (
    <View className="bg-white rounded-2xl border-2 border-edsa-primary/20 shadow-md p-5 my-3">
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <View className="flex-row items-center space-x-2">
          <View className="w-8 h-8 rounded-full bg-edsa-greenLight items-center justify-center">
            <Zap size={18} color="#059669" />
          </View>
          <View>
            <Text className="text-xs font-semibold text-edsa-green uppercase tracking-wider">
              Official STS Electricity Token
            </Text>
            <Text className="text-xs text-slate-400">
              Meter: {meterNumber}
            </Text>
          </View>
        </View>

        <View className="bg-edsa-light px-2.5 py-1 rounded-full border border-edsa-accent/20">
          <Text className="text-xs font-bold text-edsa-primary">
            +{unitsKwh} kWh
          </Text>
        </View>
      </View>

      {/* Main 20-Digit STS Token display */}
      <View className="bg-slate-900 rounded-xl p-4 my-2 items-center">
        <Text className="text-xs text-slate-400 mb-2 font-medium tracking-wide">
          20-DIGIT VENDING TOKEN
        </Text>
        <Text
          selectable
          className="text-2xl font-black text-amber-300 tracking-wider text-center font-mono py-1"
        >
          {formattedToken || tokenNumber}
        </Text>
        <Text className="text-[11px] text-slate-400 mt-1">
          Valid for Meter: {meterNumber}
        </Text>
      </View>

      {/* 1-Tap Copy Token button */}
      <View className="flex-row gap-3 mt-3">
        <Pressable
          onPress={handleCopy}
          className={`flex-1 flex-row items-center justify-center py-3.5 px-4 rounded-xl active:scale-[0.98] ${
            copied ? 'bg-edsa-green' : 'bg-edsa-primary'
          }`}
        >
          {copied ? (
            <>
              <Check size={18} color="#FFFFFF" className="mr-2" />
              <Text className="text-white font-bold text-sm">
                Token Copied to Clipboard!
              </Text>
            </>
          ) : (
            <>
              <Copy size={18} color="#FFFFFF" className="mr-2" />
              <Text className="text-white font-bold text-sm">
                Copy 20-Digit Token
              </Text>
            </>
          )}
        </Pressable>

        {onOpenReceipt && (
          <Pressable
            onPress={onOpenReceipt}
            className="bg-slate-100 border border-slate-300 px-4 py-3.5 rounded-xl items-center justify-center active:bg-slate-200"
          >
            <Text className="text-slate-700 font-semibold text-xs">
              View Receipt
            </Text>
          </Pressable>
        )}
      </View>

      {/* Keypad Instructions */}
      <View className="bg-slate-50 rounded-xl p-3.5 mt-4 border border-slate-200">
        <View className="flex-row items-center mb-2">
          <Info size={15} color="#1E40AF" />
          <Text className="text-xs font-bold text-edsa-navy ml-1.5">
            How to Load onto Your Keypad (CIU):
          </Text>
        </View>

        <View className="space-y-1.5">
          <View className="flex-row items-start">
            <Text className="text-xs font-bold text-edsa-primary mr-1.5">1.</Text>
            <Text className="text-xs text-slate-600 flex-1">
              Ensure meter has power connection from the mains.
            </Text>
          </View>
          <View className="flex-row items-start">
            <Text className="text-xs font-bold text-edsa-primary mr-1.5">2.</Text>
            <Text className="text-xs text-slate-600 flex-1">
              Enter all 20 digits in sequence on your CIU keypad.
            </Text>
          </View>
          <View className="flex-row items-start">
            <Text className="text-xs font-bold text-edsa-primary mr-1.5">3.</Text>
            <Text className="text-xs text-slate-600 flex-1">
              Press the Blue or Red Enter key (↵). The meter will beep and display credited kWh.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
