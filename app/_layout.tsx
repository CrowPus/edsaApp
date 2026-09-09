import "../global.css";
import React from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";
import { AppProvider } from "../context/AppContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider
      initialMetrics={initialWindowMetrics}
      style={{ flex: 1, width: "100%", height: "100%" }}
    >
      <AppProvider>
        <View style={{ flex: 1, width: "100%", height: "100%" }}>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </AppProvider>
    </SafeAreaProvider>
  );
}
