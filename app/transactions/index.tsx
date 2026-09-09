import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import {
  Search,
  Filter,
  Copy,
  Check,
  Zap,
  ArrowRight,
  Receipt,
  Clock,
  ArrowLeft,
} from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { Header } from '../../components/Header';
import { PrototypeNoticeBanner } from '../../components/PrototypeNoticeBanner';
import { NavigationTabBar } from '../../components/NavigationTabBar';
import { ReceiptModal } from '../../components/ReceiptModal';
import { TokenVendingService } from '../../services/tokenVendingService';
import { Transaction } from '../../types/edsa';

export default function TransactionsScreen() {
  const { transactions, meters } = useApp();

  const [selectedMeterId, setSelectedMeterId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);
  const [selectedTxForReceipt, setSelectedTxForReceipt] =
    useState<Transaction | null>(null);

  const filteredTransactions = transactions.filter((tx) => {
    const matchMeter =
      selectedMeterId === 'all' || tx.meterId === selectedMeterId;
    const matchQuery =
      searchQuery.trim() === '' ||
      tx.tokenNumber.replace(/\s+/g, '').includes(searchQuery.replace(/\s+/g, '')) ||
      tx.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.meterNumber.includes(searchQuery);
    return matchMeter && matchQuery;
  });

  const handleCopyToken = async (tx: Transaction) => {
    await Clipboard.setStringAsync(tx.tokenNumber);
    if (Platform.OS !== 'web') {
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (_) {}
    }
    setCopiedTokenId(tx.id);
    setTimeout(() => setCopiedTokenId(null), 2000);
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-slate-50">
      <Header />
      <PrototypeNoticeBanner />

      <View className="flex-1 max-w-4xl w-full self-center px-4 pt-3 pb-24">
        {/* Title bar */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <Pressable
              onPress={() => router.back()}
              className="mr-2 p-2 rounded-xl bg-white border border-slate-200 active:bg-slate-100"
            >
              <ArrowLeft size={18} color="#1E293B" />
            </Pressable>
            <View>
              <Text className="text-xl font-black text-slate-900">
                STS Tokens & History
              </Text>
              <Text className="text-xs text-slate-500 font-medium">
                Official Digital Vending Receipts
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => router.push('/buy' as any)}
            className="bg-edsa-primary active:bg-edsa-primary px-3.5 py-2 rounded-xl flex-row items-center"
          >
            <Zap size={14} color="#FBBF24" className="mr-1" />
            <Text className="text-white text-xs font-bold ml-1">Buy Electricity</Text>
          </Pressable>
        </View>

        {/* Search bar */}
        <View className="bg-white rounded-2xl border border-slate-200 px-3.5 py-2.5 flex-row items-center mb-3 shadow-sm">
          <Search size={18} color="#64748B" className="mr-2" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by 20-digit Token, Meter, or Ref..."
            placeholderTextColor="#94A3B8"
            className="flex-1 text-sm font-medium text-slate-900"
          />
        </View>

        {/* Meter Filter Pills */}
        <View className="flex-row space-x-2 mb-3 overflow-x-auto">
          <Pressable
            onPress={() => setSelectedMeterId('all')}
            className={`px-3 py-1.5 rounded-full border mr-2 ${
              selectedMeterId === 'all'
                ? 'bg-edsa-primary border-edsa-primary'
                : 'bg-white border-slate-200'
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                selectedMeterId === 'all' ? 'text-white' : 'text-slate-700'
              }`}
            >
              All Meters ({transactions.length})
            </Text>
          </Pressable>

          {meters.map((meter) => (
            <Pressable
              key={meter.id}
              onPress={() => setSelectedMeterId(meter.id)}
              className={`px-3 py-1.5 rounded-full border mr-2 ${
                selectedMeterId === meter.id
                  ? 'bg-edsa-primary border-edsa-primary'
                  : 'bg-white border-slate-200'
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  selectedMeterId === meter.id ? 'text-white' : 'text-slate-700'
                }`}
              >
                {meter.nickname.split(' - ')[0]}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Transactions List */}
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="bg-white rounded-3xl p-8 items-center justify-center border border-slate-200 mt-4">
              <Receipt size={36} color="#94A3B8" />
              <Text className="text-slate-900 font-bold text-base mt-2">
                No Transactions Found
              </Text>
              <Text className="text-slate-500 text-xs text-center mt-1 mb-4">
                No recharge token records match your search filter.
              </Text>
              <Pressable
                onPress={() => router.push('/buy' as any)}
                className="bg-edsa-primary px-4 py-2.5 rounded-xl"
              >
                <Text className="text-white text-xs font-bold">
                  Buy Electricity Now
                </Text>
              </Pressable>
            </View>
          }
          renderItem={({ item }) => {
            const isCopied = copiedTokenId === item.id;
            return (
              <View className="bg-white rounded-2xl p-4 border border-slate-200 mb-3 shadow-sm">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center mr-2">
                      <Zap size={16} color="#1E40AF" />
                    </View>
                    <View>
                      <Text className="text-slate-900 font-bold text-sm">
                        +{item.unitsKwh.toFixed(1)} kWh Recharge
                      </Text>
                      <Text className="text-slate-400 text-[11px]">
                        {item.meterNickname || item.meterNumber} •{' '}
                        {new Date(item.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </Text>
                    </View>
                  </View>

                  <View className="items-end">
                    <Text className="text-slate-900 font-black text-sm">
                      Le {item.amountLe.toLocaleString()}
                    </Text>
                    <View className="bg-emerald-100 px-2 py-0.5 rounded-full mt-0.5">
                      <Text className="text-emerald-700 text-[10px] font-bold">
                        Vended
                      </Text>
                    </View>
                  </View>
                </View>

                {/* 20-Digit STS Token row */}
                <View className="bg-slate-900 rounded-xl p-3 flex-row items-center justify-between my-1.5">
                  <View className="flex-1 mr-2">
                    <Text className="text-[10px] text-slate-400 font-medium">
                      STS TOKEN
                    </Text>
                    <Text
                      selectable
                      className="text-sm font-mono font-black text-amber-300 tracking-wider"
                    >
                      {TokenVendingService.formatTokenForDisplay(item.tokenNumber)}
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => handleCopyToken(item)}
                    className={`px-3 py-1.5 rounded-lg flex-row items-center ${
                      isCopied ? 'bg-emerald-600' : 'bg-slate-800'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check size={13} color="#FFFFFF" className="mr-1" />
                        <Text className="text-white text-xs font-bold ml-1">
                          Copied
                        </Text>
                      </>
                    ) : (
                      <>
                        <Copy size={13} color="#CBD5E1" className="mr-1" />
                        <Text className="text-slate-200 text-xs font-medium ml-1">
                          Copy
                        </Text>
                      </>
                    )}
                  </Pressable>
                </View>

                {/* Actions row: View Receipt */}
                <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-slate-100">
                  <Text className="text-slate-400 text-[11px]">
                    Ref: {item.referenceNumber}
                  </Text>
                  <Pressable
                    onPress={() => setSelectedTxForReceipt(item)}
                    className="flex-row items-center py-1 px-2 rounded-lg active:bg-slate-100"
                  >
                    <Receipt size={14} color="#1E40AF" className="mr-1" />
                    <Text className="text-edsa-primary font-bold text-xs ml-1">
                      View Official Receipt
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
          }}
        />
      </View>

      <NavigationTabBar currentRoute="/transactions" />

      {/* Receipt Modal */}
      {selectedTxForReceipt && (
        <ReceiptModal
          visible={!!selectedTxForReceipt}
          onClose={() => setSelectedTxForReceipt(null)}
          transaction={selectedTxForReceipt}
        />
      )}
    </SafeAreaView>
  );
}
