import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  Modal,
  ScrollView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import {
  Zap,
  ChevronDown,
  User,
  LogOut,
  Bell,
  Check,
  Building,
  Home,
  ShieldCheck,
  AlertTriangle,
  X,
  ExternalLink,
  Gift,
  FileCheck,
} from "lucide-react-native";
import { useApp } from "../context/AppContext";

export const Header: React.FC = () => {
  const {
    user,
    vendor,
    userRole,
    meters,
    activeMeterId,
    activeMeter,
    setActiveMeterId,
    logout,
  } = useApp();

  const [meterModalVisible, setMeterModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);

  const isVendor = userRole === "vendor" || !!vendor;
  const displayName = isVendor
    ? vendor?.agentName || "Alpha Koroma"
    : user?.fullName || "Amadu Sesay";
  const displayPhone = isVendor
    ? vendor?.phoneNumber || "+232 76 111 222"
    : user?.phoneNumber || "+232 76 543 210";
  const displayInitials = isVendor
    ? displayName.split(" ").map(n => n[0]).join("").slice(0, 2) || "AK"
    : displayName.split(" ").map(n => n[0]).join("").slice(0, 2) || "AS";

  return (
    <>
      <View className="bg-white border-b border-slate-200 px-3 py-2.5">
        <View className="max-w-5xl mx-auto w-full flex-row items-center justify-between">
          {/* Left: Brand Logo & Title */}
          <Pressable
            onPress={() => router.push("/" as any)}
            className="flex-row items-center active:opacity-80"
          >
            <View className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm items-center justify-center p-1 mr-2 flex-shrink-0">
              <Image
                source={require("../assets/edsa/edsa.png")}
                style={{ width: 34, height: 34 }}
                resizeMode="contain"
              />
            </View>
            <View>
              <View className="flex-row items-center">
                <Text className="text-base font-black text-slate-900 tracking-tight">
                  EDSA
                </Text>
                <View className="bg-blue-100 px-1.5 py-0.5 rounded text-[10px] ml-1.5">
                  <Text className="text-[10px] font-bold text-blue-900">
                    SL
                  </Text>
                </View>
              </View>
              <Text className="text-[10px] text-slate-500 font-medium tracking-tight">
                Electricity Distribution & Supply
              </Text>
            </View>
          </Pressable>

          {/* Right Action Icons */}
          <View className="flex-row items-center space-x-1.5 sm:space-x-2">
            {/* Active Meter Switcher Dropdown Pill */}
            {!isVendor && meters.length > 0 && (
              <Pressable
                onPress={() => setMeterModalVisible(true)}
                className="bg-slate-100 border border-slate-200 rounded-full px-2.5 py-1.5 flex-row items-center space-x-1 active:bg-slate-200 mr-1"
              >
                <Zap size={13} color="#1E40AF" />
                <Text
                  numberOfLines={1}
                  className="text-xs font-semibold text-slate-800 max-w-[80px] sm:max-w-[120px]"
                >
                  {activeMeter ? activeMeter.nickname.split(" - ")[0] : "Meter"}
                </Text>
                <ChevronDown size={12} color="#64748B" />
              </Pressable>
            )}

            {/* Notification Bell */}
            <Pressable
              onPress={() => setNotificationModalVisible(true)}
              className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 items-center justify-center relative active:bg-slate-200"
            >
              <Bell size={17} color="#334155" />
              <View className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600" />
            </Pressable>

            {/* User Profile Avatar Pill */}
            <Pressable
              onPress={() => setProfileModalVisible(true)}
              className="flex-row items-center bg-blue-50 border border-blue-200 rounded-full pl-1 pr-2 py-1 active:bg-blue-100 shadow-sm"
            >
              <View className="w-7 h-7 rounded-full bg-blue-900 items-center justify-center mr-1 shadow-sm">
                <Text className="text-white text-xs font-bold">
                  {displayInitials}
                </Text>
              </View>
              <ChevronDown size={12} color="#1E40AF" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Meter Selector Modal */}
      <Modal
        visible={meterModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMeterModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/60 justify-end sm:justify-center items-center p-0 sm:p-4"
          onPress={() => setMeterModalVisible(false)}
        >
          <Pressable
            className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[85%]"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="flex-row items-center justify-between pb-3 border-b border-slate-100">
              <View className="flex-row items-center space-x-2">
                <View className="w-9 h-9 rounded-xl bg-blue-100 items-center justify-center mr-2">
                  <Zap size={18} color="#1E40AF" />
                </View>
                <View>
                  <Text className="text-base font-black text-slate-900">
                    Switch Active Meter
                  </Text>
                  <Text className="text-xs text-slate-500">
                    Select a registered STS meter
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => setMeterModalVisible(false)}
                className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center active:bg-slate-200"
              >
                <X size={16} color="#64748B" />
              </Pressable>
            </View>

            <ScrollView className="py-3 max-h-72">
              {meters.map((m) => {
                const isSelected = m.id === activeMeterId;
                return (
                  <Pressable
                    key={m.id}
                    onPress={() => {
                      setActiveMeterId(m.id);
                      setMeterModalVisible(false);
                    }}
                    className={`p-3.5 rounded-2xl mb-2 flex-row items-center justify-between border ${
                      isSelected
                        ? "bg-blue-50/80 border-blue-300"
                        : "bg-slate-50 border-slate-200 active:bg-slate-100"
                    }`}
                  >
                    <View className="flex-row items-center space-x-3 flex-1 mr-2">
                      <View
                        className={`w-9 h-9 rounded-xl items-center justify-center mr-2.5 ${
                          isSelected ? "bg-blue-600" : "bg-slate-200"
                        }`}
                      >
                        {m.tariffCategory === "residential" ? (
                          <Home
                            size={16}
                            color={isSelected ? "#FFFFFF" : "#64748B"}
                          />
                        ) : (
                          <Building
                            size={16}
                            color={isSelected ? "#FFFFFF" : "#64748B"}
                          />
                        )}
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-bold text-slate-900">
                          {m.nickname}
                        </Text>
                        <Text className="text-xs font-mono text-slate-500">
                          {m.meterNumber}
                        </Text>
                      </View>
                    </View>

                    <View className="items-end">
                      <Text className="text-xs font-bold text-slate-800">
                        {m.balanceKwh.toFixed(1)} kWh
                      </Text>
                      {isSelected && (
                        <View className="flex-row items-center mt-0.5">
                          <Check size={12} color="#059669" className="mr-0.5" />
                          <Text className="text-[10px] font-bold text-emerald-700">
                            Active
                          </Text>
                        </View>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Pressable
              onPress={() => {
                setMeterModalVisible(false);
                router.push("/meters" as any);
              }}
              className="bg-slate-100 border border-slate-200 rounded-2xl p-3 items-center active:bg-slate-200"
            >
              <Text className="text-xs font-bold text-slate-800">
                Manage All Meters & Add New
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* User Profile & Account Modal - Always 100% Populated */}
      <Modal
        visible={profileModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/60 justify-end sm:justify-center items-center p-0 sm:p-4"
          onPress={() => setProfileModalVisible(false)}
        >
          <Pressable
            className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl"
            onPress={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <View className="flex-row items-center justify-between pb-3.5 border-b border-slate-100">
              <View className="flex-row items-center space-x-2.5">
                <View className="w-11 h-11 rounded-2xl bg-blue-900 items-center justify-center mr-2.5 shadow-md">
                  <Text className="text-white text-base font-black">
                    {displayInitials}
                  </Text>
                </View>
                <View>
                  <Text className="text-base font-black text-slate-900">
                    {displayName}
                  </Text>
                  <Text className="text-xs text-slate-500 font-mono">
                    {displayPhone}
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => setProfileModalVisible(false)}
                className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center active:bg-slate-200"
              >
                <X size={16} color="#64748B" />
              </Pressable>
            </View>

            {/* Account Details & Status Grid */}
            <View className="my-3.5 space-y-2">
              {/* Verification & Persona Pill */}
              <View className="bg-emerald-50 border border-emerald-200 rounded-2xl p-2.5 flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <ShieldCheck size={16} color="#059669" className="mr-1.5" />
                  <Text className="text-xs font-bold text-emerald-800">
                    {isVendor ? "Authorized EDSA Agent" : "Verified Customer Account"}
                  </Text>
                </View>
                <Text className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  ACTIVE
                </Text>
              </View>

              {/* Stats Row */}
              <View className="flex-row gap-2">
                <View className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-2.5">
                  <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {isVendor ? "Agent Code" : "Registered Meters"}
                  </Text>
                  <Text className="text-sm font-black text-slate-800 mt-0.5">
                    {isVendor ? vendor?.agentCode || "EDSA-AGT-4402" : `${meters.length} Meters`}
                  </Text>
                </View>

                <View className="flex-1 bg-amber-50 border border-amber-200 rounded-2xl p-2.5">
                  <Text className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                    {isVendor ? "Commission Units" : "Loyalty Bonus"}
                  </Text>
                  <Text className="text-sm font-black text-amber-900 mt-0.5">
                    {isVendor
                      ? `+${vendor?.bonusCommissionKwh || 142.8} kWh`
                      : `+${user?.loyaltyBonusBalanceKwh || 18.5} kWh`}
                  </Text>
                </View>
              </View>

              {/* Location & Email Info */}
              <View className="bg-slate-50 rounded-2xl p-3 border border-slate-100 space-y-1.5">
                <View className="flex-row justify-between items-center">
                  <Text className="text-xs text-slate-500">Email Address</Text>
                  <Text className="text-xs font-semibold text-slate-800">
                    {isVendor
                      ? vendor?.email || "agent@sierrapowerlink.sl"
                      : user?.email || "amadu.sesay@example.sl"}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-xs text-slate-500">Location</Text>
                  <Text className="text-xs font-semibold text-slate-800">
                    {isVendor
                      ? vendor?.physicalAddress || "Freetown, Western Area"
                      : user?.city || "Freetown, Western Area"}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-xs text-slate-500">National Platform</Text>
                  <Text className="text-xs font-bold text-blue-700">
                    EDSA Sierra Leone v1.0
                  </Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="space-y-2 pt-1">
              {isVendor ? (
                <Pressable
                  onPress={() => {
                    setProfileModalVisible(false);
                    router.push("/vendor/portal" as any);
                  }}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex-row items-center justify-between active:bg-slate-800"
                >
                  <View className="flex-row items-center">
                    <Zap size={16} color="#F59E0B" className="mr-2" />
                    <Text className="text-white text-xs font-bold">
                      Open Vendor Terminal
                    </Text>
                  </View>
                  <ExternalLink size={14} color="#94A3B8" />
                </Pressable>
              ) : (
                <>
                  <Pressable
                    onPress={() => {
                      setProfileModalVisible(false);
                      router.push("/profile" as any);
                    }}
                    className="bg-slate-100 border border-slate-200 rounded-2xl p-3 flex-row items-center justify-between active:bg-slate-200"
                  >
                    <View className="flex-row items-center">
                      <User size={16} color="#0B2545" className="mr-2" />
                      <Text className="text-slate-800 text-xs font-bold">
                        View Full Profile & Meter Settings
                      </Text>
                    </View>
                    <ExternalLink size={14} color="#64748B" />
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      setProfileModalVisible(false);
                      router.push("/meters/apply" as any);
                    }}
                    className="bg-blue-50 border border-blue-200 rounded-2xl p-3 flex-row items-center justify-between active:bg-blue-100"
                  >
                    <View className="flex-row items-center">
                      <FileCheck size={16} color="#1E40AF" className="mr-2" />
                      <Text className="text-blue-900 text-xs font-bold">
                        Apply to Buy a New Meter
                      </Text>
                    </View>
                    <ExternalLink size={14} color="#1E40AF" />
                  </Pressable>
                </>
              )}

              {/* Log Out Button */}
              <Pressable
                onPress={() => {
                  setProfileModalVisible(false);
                  logout();
                  router.replace("/" as any);
                }}
                className="bg-rose-600 rounded-2xl p-3.5 flex-row items-center justify-center active:bg-rose-700 shadow-sm"
              >
                <LogOut size={16} color="#FFFFFF" className="mr-2" />
                <Text className="text-white text-xs font-bold">
                  {isVendor ? "Log Out of Agent Terminal" : "Log Out of EDSA Account"}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Notifications Modal */}
      <Modal
        visible={notificationModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setNotificationModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/60 justify-end sm:justify-center items-center p-0 sm:p-4"
          onPress={() => setNotificationModalVisible(false)}
        >
          <Pressable
            className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="flex-row items-center justify-between pb-3 border-b border-slate-100">
              <View className="flex-row items-center space-x-2">
                <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-2">
                  <Bell size={16} color="#1E40AF" />
                </View>
                <Text className="text-base font-black text-slate-900">
                  EDSA Alerts & Notifications
                </Text>
              </View>
              <Pressable
                onPress={() => setNotificationModalVisible(false)}
                className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center active:bg-slate-200"
              >
                <X size={16} color="#64748B" />
              </Pressable>
            </View>

            <View className="py-4 space-y-3">
              <View className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3">
                <Text className="text-xs font-bold text-emerald-900 mb-0.5">
                  ✓ Token Recharged Successfully
                </Text>
                <Text className="text-[11px] text-emerald-700">
                  Meter 12345678901 credited with 42.7 kWh. +2.1 kWh bonus applied.
                </Text>
              </View>

              <View className="bg-blue-50 border border-blue-200 rounded-2xl p-3">
                <Text className="text-xs font-bold text-blue-900 mb-0.5">
                  ℹ Scheduled Maintenance Notice
                </Text>
                <Text className="text-[11px] text-blue-700">
                  Substation maintenance scheduled for Western Area this Sunday 08:00 - 12:00.
                </Text>
              </View>

              <View className="bg-amber-50 border border-amber-200 rounded-2xl p-3">
                <Text className="text-xs font-bold text-amber-900 mb-0.5">
                  📦 Meter Application Update
                </Text>
                <Text className="text-[11px] text-amber-700">
                  Application MTR-APP-2025-0491 is Site Inspected & Ready for District Pickup.
                </Text>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};
