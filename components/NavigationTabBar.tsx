import React from "react";
import { View, Text, Pressable, Platform } from "react-native";
import { router } from "expo-router";
import { Home, Zap, History, AlertTriangle, User } from "lucide-react-native";

interface NavigationTabBarProps {
  currentRoute?: string;
}

export const NavigationTabBar: React.FC<NavigationTabBarProps> = ({ currentRoute = "/" }) => {
  const tabs = [
    {
      id: "home",
      label: "Home",
      route: "/",
      icon: Home,
    },
    {
      id: "buy",
      label: "Buy",
      route: "/buy",
      icon: Zap,
    },
    {
      id: "history",
      label: "Tokens",
      route: "/transactions",
      icon: History,
    },
    {
      id: "outage",
      label: "Outage",
      route: "/outage",
      icon: AlertTriangle,
    },
    {
      id: "profile",
      label: "Account",
      route: "/profile",
      icon: User,
    },
  ];

  return (
    <View
      style={{
        position: (Platform.OS === "web" ? "fixed" : "relative") as any,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#E2E8F0",
        paddingBottom: Platform.OS === "ios" ? 24 : 10,
      }}
    >
      <View className="max-w-md mx-auto w-full px-2 py-2 flex-row justify-around items-center">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive =
            tab.route === "/"
              ? currentRoute === "/"
              : currentRoute.startsWith(tab.route);

          return (
            <Pressable
              key={tab.id}
              onPress={() => router.push(tab.route as any)}
              className="items-center justify-center flex-1 py-1 active:opacity-75"
            >
              <View
                className={`p-1.5 rounded-full items-center justify-center ${
                  isActive ? "bg-blue-100" : "bg-transparent"
                }`}
              >
                <IconComponent
                  size={22}
                  color={isActive ? "#133E87" : "#64748B"}
                  strokeWidth={isActive ? 2.4 : 1.8}
                />
              </View>
              <Text
                className={`text-[11px] mt-0.5 font-medium ${
                  isActive ? "text-edsa-primary font-bold" : "text-slate-500"
                }`}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
