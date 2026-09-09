import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  Phone,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  ShieldCheck,
  Building,
  ArrowLeft,
  Mail,
  Zap,
} from 'lucide-react-native';
import { Header } from '../../components/Header';
import { PrototypeNoticeBanner } from '../../components/PrototypeNoticeBanner';
import { NavigationTabBar } from '../../components/NavigationTabBar';
import { FAQ_ITEMS, EDSA_OFFICES } from '../../services/mockData';

export default function SupportScreen() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleCallHelpline = () => {
    Linking.openURL('tel:672');
  };

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/23276672672');
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-slate-50">
      <Header />
      <PrototypeNoticeBanner />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="max-w-4xl w-full self-center px-4 pt-3">
          {/* Title row */}
          <View className="flex-row items-center mb-4">
            <Pressable
              onPress={() => router.back()}
              className="mr-2 p-2 rounded-xl bg-white border border-slate-200 active:bg-slate-100"
            >
              <ArrowLeft size={18} color="#1E293B" />
            </Pressable>
            <View>
              <Text className="text-xl font-black text-slate-900">
                Customer Support & Help
              </Text>
              <Text className="text-xs text-slate-500 font-medium">
                Official EDSA Helplines, FAQs & Regional Offices
              </Text>
            </View>
          </View>

          {/* Emergency Helplines Grid */}
          <View className="flex-row flex-wrap gap-3 mb-4">
            {/* 672 Toll-Free */}
            <Pressable
              onPress={handleCallHelpline}
              className="bg-rose-600 rounded-3xl p-5 shadow-sm active:bg-rose-700"
            >
              <View className="flex-row items-center justify-between mb-2">
                <View className="w-10 h-10 rounded-2xl bg-white/20 items-center justify-center">
                  <Phone size={20} color="#FFFFFF" />
                </View>
                <View className="bg-white/20 px-2.5 py-0.5 rounded-full">
                  <Text className="text-white text-[10px] font-bold">
                    TOLL FREE 24/7
                  </Text>
                </View>
              </View>
              <Text className="text-white font-black text-2xl tracking-wide">
                672
              </Text>
              <Text className="text-rose-100 text-xs mt-0.5">
                Emergency Faults, Sparking Wires & Blackouts
              </Text>
            </Pressable>

            {/* WhatsApp Support */}
            <Pressable
              onPress={handleWhatsApp}
              className="bg-emerald-600 rounded-3xl p-5 shadow-sm active:bg-emerald-700"
            >
              <View className="flex-row items-center justify-between mb-2">
                <View className="w-10 h-10 rounded-2xl bg-white/20 items-center justify-center">
                  <MessageCircle size={20} color="#FFFFFF" />
                </View>
                <View className="bg-white/20 px-2.5 py-0.5 rounded-full">
                  <Text className="text-white text-[10px] font-bold">
                    OFFICIAL WHATSAPP
                  </Text>
                </View>
              </View>
              <Text className="text-white font-black text-xl tracking-wide">
                +232 76 672 672
              </Text>
              <Text className="text-emerald-100 text-xs mt-0.5">
                Token Queries, Meter Errors & Account Support
              </Text>
            </Pressable>
          </View>

          {/* General Inquiries */}
          <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-4">
            <Text className="text-sm font-black text-slate-900 mb-2">
              Direct Contact Numbers
            </Text>
            <View className="space-y-2">
              <View className="flex-row items-center justify-between py-1.5 border-b border-slate-100">
                <Text className="text-xs text-slate-600">
                  Customer Care Line 1 (Africell)
                </Text>
                <Text className="text-xs font-bold text-slate-900 font-mono">
                  +232 88 111 222
                </Text>
              </View>
              <View className="flex-row items-center justify-between py-1.5 border-b border-slate-100">
                <Text className="text-xs text-slate-600">
                  Customer Care Line 2 (Orange)
                </Text>
                <Text className="text-xs font-bold text-slate-900 font-mono">
                  +232 79 111 222
                </Text>
              </View>
              <View className="flex-row items-center justify-between py-1.5">
                <Text className="text-xs text-slate-600">Email Support</Text>
                <Text className="text-xs font-bold text-edsa-primary">
                  customercare@edsa.sl
                </Text>
              </View>
            </View>
          </View>

          {/* Frequently Asked Questions */}
          <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-4">
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 rounded-xl bg-blue-50 items-center justify-center mr-2">
                <HelpCircle size={18} color="#1E40AF" />
              </View>
              <View>
                <Text className="text-base font-black text-slate-900">
                  Frequently Asked Questions
                </Text>
                <Text className="text-xs text-slate-400">
                  Quick answers to common meter & token questions
                </Text>
              </View>
            </View>

            <View className="space-y-2">
              {FAQ_ITEMS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <View
                    key={faq.id}
                    className="border border-slate-200 rounded-2xl overflow-hidden mb-2"
                  >
                    <Pressable
                      onPress={() => toggleFaq(idx)}
                      className="p-3.5 bg-slate-50 flex-row items-center justify-between active:bg-slate-100"
                    >
                      <Text className="text-slate-900 font-bold text-xs flex-1 mr-2">
                        {faq.question}
                      </Text>
                      {isOpen ? (
                        <ChevronUp size={16} color="#64748B" />
                      ) : (
                        <ChevronDown size={16} color="#64748B" />
                      )}
                    </Pressable>

                    {isOpen && (
                      <View className="p-3.5 bg-white border-t border-slate-200">
                        <Text className="text-slate-600 text-xs leading-5">
                          {faq.answer}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          {/* Regional Offices Directory */}
          <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 rounded-xl bg-amber-50 items-center justify-center mr-2">
                <Building size={18} color="#D97706" />
              </View>
              <View>
                <Text className="text-base font-black text-slate-900">
                  EDSA Regional Customer Offices
                </Text>
                <Text className="text-xs text-slate-400">
                  Walk-in service centers across Sierra Leone
                </Text>
              </View>
            </View>

            <View className="space-y-3">
              {EDSA_OFFICES.map((office) => (
                <View
                  key={office.name}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200"
                >
                  <Text className="text-slate-900 font-bold text-xs">
                    {office.name}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <MapPin size={12} color="#64748B" className="mr-1" />
                    <Text className="text-slate-500 text-[11px] ml-1 flex-1">
                      {office.address}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-slate-200">
                    <View className="flex-row items-center">
                      <Clock size={11} color="#64748B" className="mr-1" />
                      <Text className="text-slate-400 text-[10px] ml-1">
                        {office.hours}
                      </Text>
                    </View>
                    <Text className="text-edsa-primary font-mono text-[11px] font-bold">
                      {office.phone}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <NavigationTabBar currentRoute="/support" />
    </SafeAreaView>
  );
}
