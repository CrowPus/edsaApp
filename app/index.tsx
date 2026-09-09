import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  Platform,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useApp } from "../context/AppContext";
import {
  Zap,
  UserCheck,
  Store,
  ArrowRight,
  ChevronDown,
  LogOut,
} from "lucide-react-native";
import { Header } from "../components/Header";
import { PrototypeNoticeBanner } from "../components/PrototypeNoticeBanner";
import { MeterCard } from "../components/MeterCard";
import { QuickActions } from "../components/QuickActions";
import { RecentTransactionsCard } from "../components/RecentTransactionsCard";
import { GridStatusBanner } from "../components/GridStatusBanner";
import { NavigationTabBar } from "../components/NavigationTabBar";

export default function HomeScreen() {
  const { user, vendor, isLoggedIn, userRole, activeMeter, logout } = useApp();
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 800;
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");

  // ==========================================
  // 1. LOGGED IN AS CUSTOMER -> SHOW DASHBOARD
  // ==========================================
  if (isLoggedIn && user && userRole === "user") {
    return (
      <SafeAreaView edges={["top"]} className="flex-1 bg-slate-50">
        <Header />
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 110 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="max-w-5xl w-full self-center px-4 pt-2">
            <PrototypeNoticeBanner />

            {/* Customer Welcome & Loyalty Bonus Bar */}
            <View className="bg-white border border-slate-200 rounded-2xl p-3.5 mb-3 flex-row items-center justify-between shadow-sm mt-2">
              <View className="flex-row items-center flex-1 mr-2">
                <View className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 items-center justify-center mr-3">
                  <UserCheck size={20} color="#0052CC" />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <Text className="text-slate-900 font-bold text-sm" numberOfLines={1}>
                      {user.fullName}
                    </Text>
                    <View className="bg-emerald-100 px-1.5 py-0.5 rounded-full ml-1.5">
                      <Text className="text-emerald-800 text-[9px] font-bold">VERIFIED</Text>
                    </View>
                  </View>
                  <Text className="text-slate-500 text-xs">
                    Loyalty Bonus:{" "}
                    <Text className="text-amber-600 font-bold">
                      +{user.loyaltyBonusBalanceKwh || 0} kWh earned
                    </Text>
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => {
                  logout();
                  router.replace("/" as any);
                }}
                className="bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-xl flex-row items-center active:bg-slate-200"
              >
                <LogOut size={12} color="#64748B" className="mr-1" />
                <Text className="text-slate-600 text-xs font-semibold">Exit Portal</Text>
              </Pressable>
            </View>

            {isLargeScreen ? (
              <View className="flex-row space-x-6 mt-1">
                <View className="flex-1 space-y-4">
                  <MeterCard
                    meter={activeMeter}
                    onSwitchPress={() => router.push("/meters" as any)}
                  />
                  <QuickActions />
                </View>
                <View className="flex-1 space-y-4">
                  <RecentTransactionsCard />
                  <GridStatusBanner />
                </View>
              </View>
            ) : (
              <View className="space-y-4">
                <MeterCard
                  meter={activeMeter}
                  onSwitchPress={() => router.push("/meters" as any)}
                />
                <QuickActions />
                <RecentTransactionsCard />
                <GridStatusBanner />
              </View>
            )}
          </View>
        </ScrollView>
        <NavigationTabBar currentRoute="/" />
      </SafeAreaView>
    );
  }

  // ==========================================
  // 2. LOGGED IN AS VENDOR -> SHOW VENDOR SHORTCUT
  // ==========================================
  if (isLoggedIn && vendor && userRole === "vendor") {
    return (
      <SafeAreaView edges={["top"]} className="flex-1 bg-slate-900">
        <Header />
        <ScrollView className="flex-1 p-5" contentContainerStyle={{ paddingBottom: 100 }}>
          <View className="max-w-md mx-auto w-full bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-2xl">
            <View className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400 items-center justify-center mb-4">
              <Store size={32} color="#FBBF24" />
            </View>
            <Text className="text-white text-xl font-black">{vendor.businessName}</Text>
            <Text className="text-amber-400 text-xs font-mono mt-0.5">
              Agent Code: {vendor.agentCode}
            </Text>
            <Text className="text-slate-300 text-sm mt-3">
              Authorized EDSA Vendor Terminal. Vend for customer meters and convert bonuses to credit.
            </Text>
            <Pressable
              onPress={() => router.push("/vendor/portal" as any)}
              className="bg-amber-500 active:bg-amber-600 rounded-2xl py-4 items-center justify-center mt-6 flex-row shadow-lg shadow-amber-500/30"
            >
              <Text className="text-slate-950 font-black text-base mr-2">Open Vendor Terminal</Text>
              <ArrowRight size={18} color="#020617" />
            </Pressable>
            <Pressable
              onPress={() => {
                logout();
                router.replace("/" as any);
              }}
              className="bg-slate-700 active:bg-slate-600 rounded-2xl py-3 items-center justify-center mt-3"
            >
              <Text className="text-slate-300 font-semibold text-xs">Sign Out & Return to Gateway</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ==========================================
  // 3. PUBLIC STARTING GATEWAY (3 BIG BUTTONS)
  // ==========================================
  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* Masked Scenic Landscape Image at bottom */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 380,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <Image
          source={require("../assets/edsa/edsa-image1.png")}
          style={{
            width: "100%",
            height: "100%",
            maskImage:
              "linear-gradient(to bottom, transparent 0px, rgba(0,0,0,0.03) 40px, rgba(0,0,0,0.2) 100px, rgba(0,0,0,0.65) 170px, black 240px)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0px, rgba(0,0,0,0.03) 40px, rgba(0,0,0,0.2) 100px, rgba(0,0,0,0.65) 170px, black 240px)",
          } as any}
          resizeMode="cover"
        />

        {/* Overlaid Bottom-Left Slogan & Tricolor Accent */}
        <View
          style={{
            position: "absolute",
            left: 24,
            bottom: 24,
            zIndex: 10,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 15,
              fontWeight: "600",
              lineHeight: 21,
              fontStyle: "italic",
              textShadowColor: "rgba(0, 0, 0, 0.75)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 3,
            }}
          >
            Reliable Electricity
          </Text>
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 15,
              fontWeight: "400",
              lineHeight: 21,
              textShadowColor: "rgba(0, 0, 0, 0.75)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 3,
            }}
          >
            for a <Text style={{ fontWeight: "800" }}>Stronger,</Text>
          </Text>
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 15,
              fontWeight: "800",
              lineHeight: 21,
              textShadowColor: "rgba(0, 0, 0, 0.75)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 3,
            }}
          >
            Brighter{" "}
            <Text style={{ fontWeight: "400", fontStyle: "italic" }}>
              Sierra Leone.
            </Text>
          </Text>

          {/* Sierra Leone Tricolor Accent Bar */}
          <View
            style={{
              flexDirection: "row",
              height: 3.5,
              width: 48,
              borderRadius: 2,
              overflow: "hidden",
              marginTop: 6,
            }}
          >
            <View style={{ flex: 1, backgroundColor: "#0052CC" }} />
            <View style={{ flex: 1, backgroundColor: "#FFFFFF" }} />
            <View style={{ flex: 1, backgroundColor: "#DC2626" }} />
          </View>
        </View>
      </View>

      {/* Main Content Area */}
      <ScrollView
        style={{ flex: 1, backgroundColor: "transparent", zIndex: 10 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: 220,
          maxWidth: 440,
          width: "100%",
          alignSelf: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar: Language Dropdown Pill */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            position: "relative",
            zIndex: 30,
            marginBottom: 8,
          }}
        >
          <Pressable
            onPress={() => setShowLangMenu(!showLangMenu)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 9999,
              borderWidth: 1,
              borderColor: "#E2E8F0",
              backgroundColor: "#FFFFFF",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: "#1E293B",
                marginRight: 6,
              }}
            >
              {selectedLang}
            </Text>
            <ChevronDown size={14} color="#1E293B" strokeWidth={2.5} />
          </Pressable>

          {showLangMenu && (
            <View
              style={{
                position: "absolute",
                right: 0,
                top: 38,
                backgroundColor: "#FFFFFF",
                borderWidth: 1,
                borderColor: "#E2E8F0",
                borderRadius: 16,
                padding: 6,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                zIndex: 40,
                minWidth: 130,
              }}
            >
              {["English", "Krio", "Mende", "Temne"].map((lang) => (
                <Pressable
                  key={lang}
                  onPress={() => {
                    setSelectedLang(lang);
                    setShowLangMenu(false);
                  }}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 8,
                    backgroundColor:
                      selectedLang === lang ? "#EFF6FF" : "transparent",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: selectedLang === lang ? "700" : "500",
                      color: selectedLang === lang ? "#0052CC" : "#334155",
                    }}
                  >
                    {lang}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Centered EDSA Brand Lockup */}
        <View
          style={{
            alignItems: "center",
            marginTop: 0,
            marginBottom: 20,
          }}
        >
          <Image
            source={require("../assets/edsa/edsa.png")}
            style={{
              width: 72,
              height: 72,
              marginBottom: 8,
            }}
            resizeMode="contain"
          />

          <Text
            style={{
              color: "#0B2545",
              fontSize: 17,
              fontWeight: "900",
              letterSpacing: -0.3,
              textAlign: "center",
            }}
          >
            Electricity Distribution and Supply Authority
          </Text>

          <Text
            style={{
              color: "#64748B",
              fontSize: 12.5,
              fontStyle: "italic",
              fontWeight: "500",
              marginTop: 2,
              textAlign: "center",
            }}
          >
            Powering a Brighter Sierra Leone
          </Text>

          <View
            style={{
              flexDirection: "row",
              height: 3,
              width: 54,
              borderRadius: 2,
              overflow: "hidden",
              marginTop: 8,
            }}
          >
            <View style={{ flex: 1, backgroundColor: "#0052CC" }} />
            <View style={{ flex: 1, backgroundColor: "#FFFFFF" }} />
            <View style={{ flex: 1, backgroundColor: "#DC2626" }} />
          </View>
        </View>

        {/* 3 Large, Clean, Visual Action Buttons */}
        <View className="space-y-3.5">
          {/* Button 1: GUEST QUICK BUY */}
          <Pressable
            onPress={() => router.push("/guest" as any)}
            className="bg-white border-2 border-amber-400 rounded-3xl p-4.5 flex-row items-center justify-between shadow-md shadow-amber-500/10 active:scale-[0.98]"
            style={{ padding: 18 }}
          >
            <View className="flex-row items-center space-x-3.5 flex-1 mr-2">
              <View className="w-13 h-13 rounded-2xl bg-amber-500 items-center justify-center shadow-md shadow-amber-500/30" style={{ width: 52, height: 52 }}>
                <Zap size={28} color="#FFFFFF" />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-[17px] font-black text-slate-900 tracking-tight">
                  Guest Quick Buy
                </Text>
                <Text className="text-slate-500 text-xs mt-0.5">
                  No login needed • Fast token
                </Text>
              </View>
            </View>
            <View className="w-9 h-9 rounded-full bg-amber-100 items-center justify-center">
              <ArrowRight size={18} color="#D97706" />
            </View>
          </Pressable>

          {/* Button 2: CUSTOMER ACCOUNT */}
          <Pressable
            onPress={() => router.push("/login" as any)}
            className="bg-white border-2 border-blue-600 rounded-3xl p-4.5 flex-row items-center justify-between shadow-md shadow-blue-500/10 active:scale-[0.98]"
            style={{ padding: 18 }}
          >
            <View className="flex-row items-center space-x-3.5 flex-1 mr-2">
              <View className="w-13 h-13 rounded-2xl bg-[#0052CC] items-center justify-center shadow-md shadow-blue-500/30" style={{ width: 52, height: 52 }}>
                <UserCheck size={28} color="#FFFFFF" />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-[17px] font-black text-slate-900 tracking-tight">
                  Customer Account
                </Text>
                <Text className="text-slate-500 text-xs mt-0.5">
                  Sign In / Register • Manage meters
                </Text>
              </View>
            </View>
            <View className="w-9 h-9 rounded-full bg-blue-100 items-center justify-center">
              <ArrowRight size={18} color="#0052CC" />
            </View>
          </Pressable>

          {/* Button 3: VENDOR AGENT PORTAL */}
          <Pressable
            onPress={() => router.push("/vendor/portal" as any)}
            className="bg-white border-2 border-slate-900 rounded-3xl p-4.5 flex-row items-center justify-between shadow-md shadow-slate-900/10 active:scale-[0.98]"
            style={{ padding: 18 }}
          >
            <View className="flex-row items-center space-x-3.5 flex-1 mr-2">
              <View className="w-13 h-13 rounded-2xl bg-slate-900 items-center justify-center shadow-md shadow-slate-900/30" style={{ width: 52, height: 52 }}>
                <Store size={28} color="#FBBF24" />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-[17px] font-black text-slate-900 tracking-tight">
                  Vendor / Agent Portal
                </Text>
                <Text className="text-slate-500 text-xs mt-0.5">
                  Authorized agent • Vend for others
                </Text>
              </View>
            </View>
            <View className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center">
              <ArrowRight size={18} color="#0F172A" />
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
