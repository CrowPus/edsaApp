import React, { useState } from 'react';
import { View, Text, Modal, Pressable, ScrollView, Platform, Image } from 'react-native';
import {
  X,
  FileText,
  Copy,
  Check,
  Share2,
  Download,
  Zap,
  CheckCircle2,
  Printer,
} from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Transaction } from '../types/edsa';
import { TokenVendingService } from '../services/tokenVendingService';

interface ReceiptModalProps {
  visible: boolean;
  transaction: Transaction | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  visible,
  transaction,
  onClose,
}) => {
  const [copiedToken, setCopiedToken] = useState(false);
  const [downloadFeedback, setDownloadFeedback] = useState(false);

  if (!transaction) return null;

  const handleCopyToken = async () => {
    try {
      const cleanDigits = transaction.tokenNumber.replace(/[^0-9]/g, '');
      await Clipboard.setStringAsync(cleanDigits);
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    } catch {
      // no-op
    }
  };

  const handleDownload = () => {
    setDownloadFeedback(true);
    setTimeout(() => {
      setDownloadFeedback(false);
    }, 2500);
  };

  const formattedDate = new Date(transaction.createdAt).toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const displayToken = TokenVendingService.formatTokenForDisplay(
    transaction.tokenNumber
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 items-center justify-center p-4">
        <View className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl max-h-[90%]">
          {/* Header */}
          <View className="bg-edsa-navy p-4 flex-row items-center justify-between border-b border-white/10">
            <View className="flex-row items-center space-x-2">
              <View className="w-10 h-10 rounded-xl bg-white items-center justify-center mr-2.5 p-1 shadow-sm">
                <Image
                  source={require('../assets/edsa/edsa.png')}
                  style={{ width: 32, height: 32 }}
                  resizeMode="contain"
                />
              </View>
              <View>
                <Text className="text-white font-bold text-base">
                  EDSA Official VAT Receipt
                </Text>
                <Text className="text-slate-300 text-xs">
                  Electricity Distribution and Supply Authority
                </Text>
              </View>
            </View>

            <Pressable
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-white/10 items-center justify-center active:bg-white/20"
            >
              <X size={18} color="#FFFFFF" />
            </Pressable>
          </View>

          <ScrollView className="p-5">
            {/* Status & Reference Banner */}
            <View className="items-center justify-center py-3 bg-emerald-50 rounded-2xl border border-emerald-200 mb-4">
              <CheckCircle2 size={32} color="#059669" />
              <Text className="text-emerald-800 font-bold text-sm mt-1">
                Payment Completed & Verified
              </Text>
              <Text className="text-slate-500 text-xs font-mono mt-0.5">
                Ref: {transaction.referenceNumber}
              </Text>
            </View>

            {/* Token Block */}
            <View className="bg-slate-900 rounded-2xl p-4 mb-4 items-center">
              <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                STS VENDING TOKEN (20 DIGITS)
              </Text>
              <Text
                selectable
                className="text-xl font-mono font-black text-amber-300 tracking-wider text-center py-1"
              >
                {displayToken}
              </Text>

              <Pressable
                onPress={handleCopyToken}
                className="flex-row items-center bg-white/15 active:bg-white/25 px-3 py-1.5 rounded-lg mt-2"
              >
                {copiedToken ? (
                  <>
                    <Check size={14} color="#10B981" />
                    <Text className="text-emerald-300 text-xs font-bold ml-1.5">
                      Copied!
                    </Text>
                  </>
                ) : (
                  <>
                    <Copy size={14} color="#FFFFFF" />
                    <Text className="text-white text-xs font-medium ml-1.5">
                      Copy Token
                    </Text>
                  </>
                )}
              </Pressable>
            </View>

            {/* Receipt Itemized Details Table */}
            <View className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5 mb-4">
              <View className="flex-row justify-between py-1 border-b border-slate-200/60">
                <Text className="text-slate-500 text-xs">Customer Name</Text>
                <Text className="text-slate-900 font-bold text-xs">
                  {transaction.customerName}
                </Text>
              </View>

              <View className="flex-row justify-between py-1 border-b border-slate-200/60">
                <Text className="text-slate-500 text-xs">Meter Number</Text>
                <Text className="text-slate-900 font-mono font-bold text-xs">
                  {transaction.meterNumber}
                </Text>
              </View>

              <View className="flex-row justify-between py-1 border-b border-slate-200/60">
                <Text className="text-slate-500 text-xs">Tariff Category</Text>
                <Text className="text-slate-900 font-semibold text-xs uppercase">
                  {transaction.tariffCategory || 'residential'}
                </Text>
              </View>

              <View className="flex-row justify-between py-1 border-b border-slate-200/60">
                <Text className="text-slate-500 text-xs">Date & Time</Text>
                <Text className="text-slate-900 font-medium text-xs">
                  {formattedDate}
                </Text>
              </View>

              <View className="flex-row justify-between py-1 border-b border-slate-200/60">
                <Text className="text-slate-500 text-xs">Payment Method</Text>
                <Text className="text-slate-900 font-semibold text-xs capitalize">
                  {transaction.paymentMethod.replace('_', ' ')}
                </Text>
              </View>

              <View className="flex-row justify-between py-1 border-b border-slate-200/60">
                <Text className="text-slate-500 text-xs">Energy Units Credited</Text>
                <Text className="text-edsa-primary font-bold text-sm">
                  {transaction.unitsKwh.toFixed(1)} kWh
                </Text>
              </View>

              {/* Financial breakdown */}
              <View className="pt-2">
                <View className="flex-row justify-between py-0.5">
                  <Text className="text-slate-500 text-xs">Gross Energy Amount</Text>
                  <Text className="text-slate-700 text-xs">
                    Le {(transaction.amountLe - (transaction.vatAmountLe || 0) - (transaction.serviceFeeLe || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </Text>
                </View>

                <View className="flex-row justify-between py-0.5">
                  <Text className="text-slate-500 text-xs">GST / VAT (15%)</Text>
                  <Text className="text-slate-700 text-xs">
                    Le {(transaction.vatAmountLe || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </Text>
                </View>

                <View className="flex-row justify-between py-0.5">
                  <Text className="text-slate-500 text-xs">EDSA Service Fee</Text>
                  <Text className="text-slate-700 text-xs">
                    Le {(transaction.serviceFeeLe || 5).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </Text>
                </View>

                <View className="flex-row justify-between pt-2 mt-2 border-t-2 border-slate-300">
                  <Text className="text-slate-900 font-black text-sm">
                    Total Amount Paid
                  </Text>
                  <Text className="text-slate-900 font-black text-base">
                    Le {transaction.amountLe.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>

            {/* Official Tax Stamp */}
            <View className="items-center justify-center p-3 bg-blue-50/50 rounded-xl border border-blue-100 mb-4">
              <Text className="text-[11px] font-bold text-edsa-primary">
                National Revenue Authority (NRA) Compliant Receipt
              </Text>
              <Text className="text-[10px] text-slate-400 mt-0.5">
                Electricity Distribution & Supply Authority • Sierra Leone
              </Text>
            </View>

            {/* Actions: Download PDF & Close */}
            <View className="flex-row gap-3 mb-4">
              <Pressable
                onPress={handleDownload}
                className="flex-1 bg-edsa-primary py-3 rounded-xl flex-row items-center justify-center active:bg-edsa-primary"
              >
                {downloadFeedback ? (
                  <>
                    <Check size={16} color="#FFFFFF" className="mr-1.5" />
                    <Text className="text-white font-bold text-xs">
                      Receipt Saved!
                    </Text>
                  </>
                ) : (
                  <>
                    <Download size={16} color="#FFFFFF" className="mr-1.5" />
                    <Text className="text-white font-bold text-xs">
                      Download PDF
                    </Text>
                  </>
                )}
              </Pressable>

              <Pressable
                onPress={onClose}
                className="bg-slate-100 border border-slate-300 px-5 py-3 rounded-xl items-center justify-center"
              >
                <Text className="text-slate-700 font-semibold text-xs">
                  Done
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
