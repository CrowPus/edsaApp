import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Modal,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { useApp } from '../../context/AppContext';
import { Header } from '../../components/Header';
import { PrototypeNoticeBanner } from '../../components/PrototypeNoticeBanner';
import { NavigationTabBar } from '../../components/NavigationTabBar';
import { MeterService } from '../../services/meterService';
import { Meter, TariffCategory } from '../../types/edsa';
import {
  Zap,
  Plus,
  Copy,
  Check,
  Building,
  Home,
  MapPin,
  CheckCircle2,
  X,
  ArrowLeft,
  Smartphone,
  Info,
} from 'lucide-react-native';

export default function ManageMetersScreen() {
  const { meters, activeMeterId, setActiveMeterId, addMeter, updateBuyDraft } =
    useApp();

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [copiedMeterId, setCopiedMeterId] = useState<string | null>(null);

  // Form states
  const [meterNumber, setMeterNumber] = useState('');
  const [nickname, setNickname] = useState('');
  const [location, setLocation] = useState('');
  const [tariffCategory, setTariffCategory] =
    useState<TariffCategory>('residential');
  const [customerName, setCustomerName] = useState('Amadu Sesay');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCopy = async (meter: Meter) => {
    await Clipboard.setStringAsync(meter.meterNumber);
    if (Platform.OS !== 'web') {
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (_) {}
    }
    setCopiedMeterId(meter.id);
    setTimeout(() => setCopiedMeterId(null), 2000);
  };

  const handleQuickBuy = (meter: Meter) => {
    setActiveMeterId(meter.id);
    updateBuyDraft({
      meterId: meter.id,
      meterNumber: meter.meterNumber,
      meterNickname: meter.nickname,
      customerName: meter.customerName,
      location: meter.location,
      tariffCategory: meter.tariffCategory,
    });
    router.push('/buy' as any);
  };

  const handleAddNewMeter = () => {
    setErrorMsg(null);
    const cleanNum = meterNumber.replace(/[^0-9]/g, '');

    if (!MeterService.validateMeterNumber(cleanNum)) {
      setErrorMsg(
        'Please enter a valid 11-digit EDSA meter number (e.g. 12345678901)'
      );
      return;
    }

    if (meters.some((m) => m.meterNumber === cleanNum)) {
      setErrorMsg('This meter number is already registered in your account.');
      return;
    }

    if (!nickname.trim()) {
      setErrorMsg('Please enter a friendly name for this meter (e.g. Home, Shop)');
      return;
    }

    addMeter({
      meterNumber: cleanNum,
      nickname: nickname.trim(),
      location: location.trim() || 'Freetown, Sierra Leone',
      tariffCategory: tariffCategory,
      customerName: customerName.trim() || 'Amadu Sesay',
    });

    // Reset form and close
    setMeterNumber('');
    setNickname('');
    setLocation('');
    setTariffCategory('residential');
    setAddModalVisible(false);
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-slate-50">
      <Header />
      <PrototypeNoticeBanner />

      <View className="flex-1 max-w-4xl w-full self-center px-4 pt-3 pb-24">
        {/* Title row */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Pressable
              onPress={() => router.back()}
              className="mr-2 p-2 rounded-xl bg-white border border-slate-200 active:bg-slate-100"
            >
              <ArrowLeft size={18} color="#1E293B" />
            </Pressable>
            <View>
              <Text className="text-xl font-black text-slate-900">
                Registered Meters
              </Text>
              <Text className="text-xs text-slate-500 font-medium">
                Manage your STS prepaid electricity meters
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => setAddModalVisible(true)}
            className="bg-edsa-primary active:bg-edsa-primary px-3.5 py-2 rounded-xl flex-row items-center shadow-sm"
          >
            <Plus size={16} color="#FFFFFF" className="mr-1" />
            <Text className="text-white text-xs font-bold ml-1">Add Meter</Text>
          </Pressable>
        </View>

        {/* Meters List */}
        <FlatList
          data={meters}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isSelected = item.id === activeMeterId;
            const isCopied = copiedMeterId === item.id;

            return (
              <View
                className={`bg-white rounded-3xl p-5 border mb-3 shadow-sm ${
                  isSelected
                    ? 'border-edsa-primary ring-2 ring-blue-500/20'
                    : 'border-slate-200'
                }`}
              >
                {/* Header */}
                <View className="flex-row items-start justify-between">
                  <View className="flex-row items-center flex-1 mr-2">
                    <View
                      className={`w-10 h-10 rounded-2xl items-center justify-center mr-3 ${
                        item.tariffCategory === 'residential'
                          ? 'bg-blue-50'
                          : 'bg-amber-50'
                      }`}
                    >
                      {item.tariffCategory === 'residential' ? (
                        <Home size={20} color="#1E40AF" />
                      ) : (
                        <Building size={20} color="#D97706" />
                      )}
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center space-x-2">
                        <Text className="text-slate-900 font-black text-base">
                          {item.nickname}
                        </Text>
                        {isSelected && (
                          <View className="bg-blue-100 px-2 py-0.5 rounded-full ml-2">
                            <Text className="text-edsa-primary text-[10px] font-bold">
                              Active
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-slate-400 text-xs mt-0.5">
                        {item.location}
                      </Text>
                    </View>
                  </View>

                  <View className="items-end">
                    <Text className="text-slate-400 text-[10px] font-bold uppercase">
                      Est. Balance
                    </Text>
                    <Text className="text-slate-900 font-black text-lg">
                      {item.balanceKwh.toFixed(1)}{' '}
                      <Text className="text-xs text-slate-500 font-normal">
                        kWh
                      </Text>
                    </Text>
                  </View>
                </View>

                {/* Meter Number Box */}
                <View className="bg-slate-100 rounded-2xl p-3 flex-row items-center justify-between my-3">
                  <View>
                    <Text className="text-[10px] text-slate-500 font-medium">
                      METER NUMBER
                    </Text>
                    <Text
                      selectable
                      className="text-base font-mono font-bold text-slate-900 tracking-wider"
                    >
                      {MeterService.formatMeterNumber(item.meterNumber)}
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => handleCopy(item)}
                    className={`px-3 py-1.5 rounded-xl flex-row items-center ${
                      isCopied ? 'bg-emerald-600' : 'bg-white border border-slate-200'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check size={14} color="#FFFFFF" className="mr-1" />
                        <Text className="text-white text-xs font-bold ml-1">
                          Copied
                        </Text>
                      </>
                    ) : (
                      <>
                        <Copy size={14} color="#64748B" className="mr-1" />
                        <Text className="text-slate-700 text-xs font-medium ml-1">
                          Copy
                        </Text>
                      </>
                    )}
                  </Pressable>
                </View>

                {/* Actions */}
                <View className="flex-row items-center space-x-2 pt-1">
                  {!isSelected && (
                    <Pressable
                      onPress={() => setActiveMeterId(item.id)}
                      className="flex-1 bg-white border border-slate-200 py-2.5 rounded-xl items-center mr-2 active:bg-slate-50"
                    >
                      <Text className="text-slate-700 font-bold text-xs">
                        Set as Active
                      </Text>
                    </Pressable>
                  )}

                  <Pressable
                    onPress={() => handleQuickBuy(item)}
                    className="flex-1 bg-edsa-primary active:bg-edsa-primary py-2.5 rounded-xl flex-row items-center justify-center"
                  >
                    <Zap size={14} color="#FBBF24" className="mr-1" />
                    <Text className="text-white font-bold text-xs ml-1">
                      Buy Electricity
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
          }}
        />
      </View>

      <NavigationTabBar currentRoute="/meters" />

      {/* Add Meter Modal */}
      <Modal
        visible={addModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View className="flex-1 bg-black/60 justify-end sm:justify-center p-0 sm:p-4">
          <View className="bg-white rounded-t-3xl sm:rounded-3xl p-6 max-w-lg w-full self-center">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-xl font-black text-slate-900">
                  Register New Meter
                </Text>
                <Text className="text-xs text-slate-500">
                  Link an EDSA prepaid meter to your account
                </Text>
              </View>
              <Pressable
                onPress={() => setAddModalVisible(false)}
                className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
              >
                <X size={18} color="#64748B" />
              </Pressable>
            </View>

            {errorMsg && (
              <View className="bg-rose-50 border border-rose-200 p-3 rounded-xl mb-3 flex-row items-center">
                <Info size={16} color="#E11D48" className="mr-2" />
                <Text className="text-rose-700 text-xs font-medium flex-1 ml-1">
                  {errorMsg}
                </Text>
              </View>
            )}

            <ScrollView className="space-y-3" showsVerticalScrollIndicator={false}>
              {/* Meter Number */}
              <View>
                <Text className="text-xs font-bold text-slate-700 mb-1">
                  11-Digit Meter Number *
                </Text>
                <TextInput
                  value={meterNumber}
                  onChangeText={setMeterNumber}
                  placeholder="e.g. 12345678901"
                  keyboardType="numeric"
                  maxLength={11}
                  className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-base font-mono font-bold text-slate-900"
                />
              </View>

              {/* Nickname */}
              <View className="mt-3">
                <Text className="text-xs font-bold text-slate-700 mb-1">
                  Meter Friendly Name *
                </Text>
                <TextInput
                  value={nickname}
                  onChangeText={setNickname}
                  placeholder="e.g. Home, Shop, Mother's House"
                  className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-900"
                />
              </View>

              {/* Location */}
              <View className="mt-3">
                <Text className="text-xs font-bold text-slate-700 mb-1">
                  Location / Address
                </Text>
                <TextInput
                  value={location}
                  onChangeText={setLocation}
                  placeholder="e.g. Siaka Stevens Street, Freetown"
                  className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-900"
                />
              </View>

              {/* Tariff Category */}
              <View className="mt-3">
                <Text className="text-xs font-bold text-slate-700 mb-1.5">
                  Tariff Category
                </Text>
                <View className="flex-row space-x-2">
                  <Pressable
                    onPress={() => setTariffCategory('residential')}
                    className={`flex-1 p-3 rounded-2xl border mr-2 items-center ${
                      tariffCategory === 'residential'
                        ? 'bg-blue-50 border-edsa-primary'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        tariffCategory === 'residential'
                          ? 'text-edsa-primary'
                          : 'text-slate-700'
                      }`}
                    >
                      Residential
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setTariffCategory('commercial')}
                    className={`flex-1 p-3 rounded-2xl border items-center ${
                      tariffCategory === 'commercial'
                        ? 'bg-amber-50 border-amber-500'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        tariffCategory === 'commercial'
                          ? 'text-amber-700'
                          : 'text-slate-700'
                      }`}
                    >
                      Commercial
                    </Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>

            {/* Submit button */}
            <View className="mt-5 pt-3 border-t border-slate-100 flex-row space-x-2">
              <Pressable
                onPress={() => setAddModalVisible(false)}
                className="flex-1 bg-slate-100 py-3.5 rounded-2xl items-center mr-2"
              >
                <Text className="text-slate-700 font-bold text-sm">Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleAddNewMeter}
                className="flex-1 bg-edsa-primary py-3.5 rounded-2xl items-center"
              >
                <Text className="text-white font-bold text-sm">Save Meter</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
