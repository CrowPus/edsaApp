import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  User,
  Phone,
  Mail,
  MapPin,
  LogOut,
  Zap,
  ShieldCheck,
  ChevronRight,
  Globe,
  HelpCircle,
  PhoneCall,
  ArrowLeft,
  Building,
} from "lucide-react-native";
import { useApp } from "../context/AppContext";
import { Header } from "../components/Header";
import { PrototypeNoticeBanner } from "../components/PrototypeNoticeBanner";
import { NavigationTabBar } from "../components/NavigationTabBar";

export default function ProfileScreen() {
  const { user, meters, activeMeter, logout } = useApp();
  const [selectedLang, setSelectedLang] = useState("English");

  const handleLogout = () => {
    logout();
    router.replace("/login" as any);
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-slate-50">
      <Header />
      <PrototypeNoticeBanner />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 100,
          maxWidth: 600,
          width: "100%",
          alignSelf: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Screen Header */}
        <View className="flex-row items-center mb-4">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 items-center justify-center mr-3 active:bg-slate-100"
          >
            <ArrowLeft size={20} color="#0B2545" />
          </Pressable>
          <View>
            <Text className="text-2xl font-black text-slate-900 tracking-tight">
              Customer Profile
            </Text>
            <Text className="text-xs text-slate-500 font-medium">
              Manage your EDSA account & linked meters
            </Text>
          </View>
        </View>

        {/* User Card */}
        <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-4">
          <View className="flex-row items-center space-x-3 mb-4">
            <View className="w-16 h-16 rounded-2xl bg-blue-900 items-center justify-center mr-3 shadow-md">
              <Text className="text-white text-2xl font-black">
                {user ? user.fullName.charAt(0) : "A"}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-slate-900">
                {user?.fullName || "Amadu Sesay"}
              </Text>
              <View className="flex-row items-center mt-0.5">
                <ShieldCheck size={14} color="#059669" className="mr-1" />
                <Text className="text-xs font-semibold text-emerald-700">
                  Verified EDSA Account
                </Text>
              </View>
              <Text className="text-xs text-slate-500 font-mono mt-0.5">
                ID: {user?.id || "USR-SL-82910"}
              </Text>
            </View>
          </View>

          {/* User Details Grid */}
          <View className="bg-slate-50 rounded-2xl p-3.5 space-y-2.5 border border-slate-100">
            <View className="flex-row items-center justify-between py-1">
              <View className="flex-row items-center">
                <Phone size={16} color="#64748B" className="mr-2" />
                <Text className="text-xs font-medium text-slate-600">Phone</Text>
              </View>
              <Text className="text-xs font-bold text-slate-900 font-mono">
                {user?.phoneNumber || "+232 76 543 210"}
              </Text>
            </View>

            <View className="flex-row items-center justify-between py-1 border-t border-slate-200/60">
              <View className="flex-row items-center">
                <Mail size={16} color="#64748B" className="mr-2" />
                <Text className="text-xs font-medium text-slate-600">Email</Text>
              </View>
              <Text className="text-xs font-bold text-slate-900">
                {user?.email || "amadu.sesay@freetown.sl"}
              </Text>
            </View>

            <View className="flex-row items-center justify-between py-1 border-t border-slate-200/60">
              <View className="flex-row items-center">
                <MapPin size={16} color="#64748B" className="mr-2" />
                <Text className="text-xs font-medium text-slate-600">District</Text>
              </View>
              <Text className="text-xs font-bold text-slate-900">
                Freetown, Western Area Urban
              </Text>
            </View>
          </View>
        </View>

        {/* Meters Section */}
        <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Zap size={18} color="#0B2545" className="mr-2" />
              <Text className="text-base font-bold text-slate-900">
                Linked Meters ({meters.length})
              </Text>
            </View>
            <Pressable
              onPress={() => router.push("/meters" as any)}
              className="active:opacity-70"
            >
              <Text className="text-xs font-bold text-blue-700">
                Manage Meters →
              </Text>
            </Pressable>
          </View>

          {meters.map((meter) => (
            <Pressable
              key={meter.id}
              onPress={() => router.push("/meters" as any)}
              className="bg-slate-50 p-3 rounded-2xl border border-slate-200 mb-2 flex-row items-center justify-between active:bg-slate-100"
            >
              <View>
                <Text className="text-xs font-bold text-slate-900">
                  {meter.nickname}
                </Text>
                <Text className="text-[11px] font-mono text-slate-500">
                  {meter.meterNumber}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-xs font-bold text-blue-900 mr-2">
                  {meter.balanceKwh} kWh
                </Text>
                <ChevronRight size={16} color="#94A3B8" />
              </View>
            </Pressable>
          ))}
        </View>

        {/* Quick Links */}
        <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-6 space-y-3">
          <Pressable
            onPress={() => router.push("/support" as any)}
            className="flex-row items-center justify-between py-2 border-b border-slate-100 active:opacity-70"
          >
            <View className="flex-row items-center">
              <PhoneCall size={18} color="#0B2545" className="mr-3" />
              <Text className="text-sm font-semibold text-slate-800">
                Emergency 672 Helpline & Support
              </Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </Pressable>

          <Pressable
            onPress={() => router.push("/outage" as any)}
            className="flex-row items-center justify-between py-2 border-b border-slate-100 active:opacity-70"
          >
            <View className="flex-row items-center">
              <Building size={18} color="#0B2545" className="mr-3" />
              <Text className="text-sm font-semibold text-slate-800">
                Report Fault or Power Outage
              </Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </Pressable>

          <View className="flex-row items-center justify-between py-2">
            <View className="flex-row items-center">
              <Globe size={18} color="#0B2545" className="mr-3" />
              <Text className="text-sm font-semibold text-slate-800">Language</Text>
            </View>
            <Text className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              English
            </Text>
          </View>
        </View>

        {/* Big Red Logout Button */}
        <Pressable
          onPress={handleLogout}
          className="w-full bg-rose-600 active:bg-rose-700 py-4 rounded-2xl flex-row items-center justify-center shadow-md shadow-rose-200 mb-6"
        >
          <LogOut size={20} color="#FFFFFF" className="mr-2" />
          <Text className="text-white text-base font-bold ml-1">
            Log Out of EDSA
          </Text>
        </Pressable>

        {/* Prototype Version Footer */}
        <Text className="text-center text-xs text-slate-400 font-medium">
          Electricity Distribution and Supply Authority of Sierra Leone
        </Text>
        <Text className="text-center text-[11px] text-slate-400 font-mono mt-0.5">
          Platform Prototype v1.0.0
        </Text>
      </ScrollView>

      {/* Bottom Floating Navigation */}
      <NavigationTabBar currentRoute="/profile" />
    </SafeAreaView>
  );
}
