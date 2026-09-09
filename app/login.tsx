import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useApp } from "../context/AppContext";
import {
  Smartphone,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react-native";

export default function LoginScreen() {
  const { loginAs } = useApp();
  const [phoneNumber, setPhoneNumber] = useState("+232 76 123 456");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");

  const handleLogin = (phoneToUse?: string) => {
    loginAs("user", "approved");
    router.replace("/" as any);
  };

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* Background Masked Scenic Image Layer */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 480,
          zIndex: 0,
        }}
        pointerEvents="none"
      >
        <Image
          source={require("../assets/edsa/edsa-image1.png")}
          style={{
            width: "100%",
            height: "100%",
            // @ts-ignore
            maskImage:
              Platform.OS === "web"
                ? "linear-gradient(to bottom, transparent 0px, rgba(0,0,0,0.03) 40px, rgba(0,0,0,0.2) 100px, rgba(0,0,0,0.65) 170px, black 240px)"
                : undefined,
            WebkitMaskImage:
              Platform.OS === "web"
                ? "linear-gradient(to bottom, transparent 0px, rgba(0,0,0,0.03) 40px, rgba(0,0,0,0.2) 100px, rgba(0,0,0,0.65) 170px, black 240px)"
                : undefined,
          }}
          resizeMode="cover"
        />

        {/* Native Fallback Gradient Overlay if maskImage is not supported on non-web */}
        {Platform.OS !== "web" && (
          <LinearGradient
            colors={[
              "#FFFFFF",
              "rgba(255, 255, 255, 0.96)",
              "rgba(255, 255, 255, 0.75)",
              "rgba(255, 255, 255, 0.30)",
              "transparent",
            ]}
            locations={[0, 0.2, 0.45, 0.75, 1]}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 240,
            }}
          />
        )}

        {/* Slogan Text Overlay on Bottom-Left */}
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
              textShadowColor: "rgba(0, 0, 0, 0.8)",
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
              lineHeight: 21,
              textShadowColor: "rgba(0, 0, 0, 0.8)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 3,
            }}
          >
            for a{" "}
            <Text style={{ fontWeight: "800", color: "#FFFFFF" }}>
              Stronger,
            </Text>
          </Text>
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 15,
              lineHeight: 21,
              textShadowColor: "rgba(0, 0, 0, 0.8)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 3,
            }}
          >
            <Text style={{ fontWeight: "800", color: "#FFFFFF" }}>
              Brighter
            </Text>{" "}
            Sierra Leone.
          </Text>

          {/* Sierra Leone Tricolor Accent Bar */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 8,
              gap: 3,
            }}
          >
            <View
              style={{
                width: 24,
                height: 3,
                borderRadius: 2,
                backgroundColor: "#0052CC",
              }}
            />
            <View
              style={{
                width: 12,
                height: 3,
                borderRadius: 2,
                backgroundColor: "#FFFFFF",
              }}
            />
            <View
              style={{
                width: 24,
                height: 3,
                borderRadius: 2,
                backgroundColor: "#DC2626",
              }}
            />
          </View>
        </View>
      </View>

      {/* Foreground Form Layer */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, backgroundColor: "transparent", zIndex: 10 }}
      >
        <ScrollView
          style={{ flex: 1, backgroundColor: "transparent" }}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 8,
            paddingBottom: 180,
            maxWidth: 410,
            width: "100%",
            alignSelf: "center",
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Bar: Back to Gateway & Language Dropdown */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              position: "relative",
              zIndex: 30,
              marginBottom: 10,
            }}
          >
            <Pressable
              onPress={() => router.replace("/" as any)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 9999,
                borderWidth: 1,
                borderColor: "#E2E8F0",
                backgroundColor: "#FFFFFF",
              }}
            >
              <Text style={{ fontSize: 12.5, fontWeight: "700", color: "#0052CC" }}>
                ← Gateway
              </Text>
            </Pressable>

            <View style={{ position: "relative" }}>
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

              {/* Language Selection Popover Menu */}
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
              style={{ width: 175, height: 60 }}
              resizeMode="contain"
            />
            <Text
              style={{
                color: "#0B2545",
                fontSize: 13.5,
                fontWeight: "600",
                textAlign: "center",
                marginTop: 6,
                letterSpacing: -0.2,
              }}
            >
              Electricity Distribution and Supply Authority
            </Text>
            <Text
              style={{
                fontStyle: "italic",
                color: "#1E293B",
                fontSize: 13.5,
                fontWeight: "500",
                textAlign: "center",
                marginTop: 2,
              }}
            >
              Powering a Brighter Sierra Leone
            </Text>

            {/* Sierra Leone Tricolor Accent Bar */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 8,
                gap: 2,
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: "#0047BA",
                }}
              />
              <View
                style={{
                  width: 32,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: "#FFFFFF",
                  borderWidth: 0.5,
                  borderColor: "#E2E8F0",
                }}
              />
              <View
                style={{
                  width: 32,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: "#E11D48",
                }}
              />
            </View>
          </View>

          {/* Section Heading & Subtitle */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                color: "#0B2545",
                fontSize: 26,
                fontWeight: "800",
                textAlign: "center",
                letterSpacing: -0.5,
              }}
            >
              Login to Your Account
            </Text>
            <Text
              style={{
                fontSize: 13.5,
                color: "#64748B",
                textAlign: "center",
                lineHeight: 19,
                maxWidth: 290,
                alignSelf: "center",
                marginTop: 5,
              }}
            >
              Access your meter, buy electricity and manage your account
              securely.
            </Text>
          </View>

          {/* Input 1: Phone Number Card */}
          <View
            style={{
              borderWidth: 1.5,
              borderColor: "#E2E8F0",
              borderRadius: 18,
              backgroundColor: "#FFFFFF",
              paddingHorizontal: 16,
              paddingVertical: 12,
              marginBottom: 14,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Smartphone
              size={24}
              color="#0F172A"
              strokeWidth={1.75}
              style={{ marginRight: 14 }}
            />
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: 11.5,
                  fontWeight: "500",
                  color: "#64748B",
                  marginBottom: 2,
                }}
              >
                Phone Number
              </Text>
              <TextInput
                style={{
                  color: "#0F172A",
                  fontWeight: "700",
                  fontSize: 16,
                  padding: 0,
                  letterSpacing: 0.3,
                }}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                placeholder="+232 76 123 456"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* Input 2: Password Card */}
          <View
            style={{
              borderWidth: 1.5,
              borderColor: "#E2E8F0",
              borderRadius: 18,
              backgroundColor: "#FFFFFF",
              paddingHorizontal: 16,
              paddingVertical: 12,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Lock
              size={24}
              color="#0F172A"
              strokeWidth={1.75}
              style={{ marginRight: 14 }}
            />
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: 11.5,
                  fontWeight: "500",
                  color: "#64748B",
                  marginBottom: 2,
                }}
              >
                Password
              </Text>
              <TextInput
                style={{
                  color: "#0F172A",
                  fontWeight: "700",
                  fontSize: 16,
                  padding: 0,
                  letterSpacing: 1.5,
                }}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
              />
            </View>
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={8}
            >
              {showPassword ? (
                <EyeOff size={20} color="#0F172A" strokeWidth={1.75} />
              ) : (
                <Eye size={20} color="#0F172A" strokeWidth={1.75} />
              )}
            </Pressable>
          </View>

          {/* Forgot Password? Link */}
          <View
            style={{
              alignItems: "flex-end",
              marginTop: 10,
              marginBottom: 18,
            }}
          >
            <Pressable
              onPress={() => {
                alert(
                  "Password reset verification code sent via SMS to " +
                    phoneNumber
                );
              }}
              hitSlop={8}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: "#0052CC",
                }}
              >
                Forgot Password?
              </Text>
            </Pressable>
          </View>

          {/* Primary Action Button: Login */}
          <Pressable
            onPress={() => handleLogin()}
            style={{
              width: "100%",
              backgroundColor: "#0052CC",
              height: 52,
              borderRadius: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#0052CC",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              marginBottom: 14,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 16.5,
                fontWeight: "700",
                marginRight: 8,
              }}
            >
              Login
            </Text>
            <ArrowRight size={19} color="#FFFFFF" strokeWidth={2.2} />
          </Pressable>

          {/* "or" Divider Line */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 14,
            }}
          >
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: "#E2E8F0",
              }}
            />
            <Text
              style={{
                paddingHorizontal: 12,
                fontSize: 12,
                fontWeight: "500",
                color: "#94A3B8",
              }}
            >
              or
            </Text>
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: "#E2E8F0",
              }}
            />
          </View>

          {/* Secondary Action Button: Create a New Account */}
          <Pressable
            onPress={() => router.push("/register" as any)}
            style={{
              width: "100%",
              backgroundColor: "#FFFFFF",
              borderWidth: 1.5,
              borderColor: "#0052CC",
              height: 52,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#0052CC",
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              Create a New Account
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
