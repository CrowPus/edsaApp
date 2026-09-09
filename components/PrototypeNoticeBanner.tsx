import React, { useState } from 'react';
import { View, Text, Pressable, Switch } from 'react-native';
import { router } from 'expo-router';
import {
  Sparkles,
  Zap,
  UserCheck,
  Store,
  FileCheck,
  CheckCircle2,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';

export const PrototypeNoticeBanner: React.FC = () => {
  const {
    simulateFailureMode,
    setSimulateFailureMode,
    loginAs,
    setUserRole,
    userRole,
    user,
    vendor,
  } = useApp();
  const currentRole = userRole || (vendor ? 'vendor' : 'user');
  const [showControls, setShowControls] = useState(false);

  return (
    <View className="bg-slate-900 border-b border-slate-800 px-4 py-2">
      <View className="max-w-5xl mx-auto w-full flex-row items-center justify-between">
        <View className="flex-row items-center flex-1 mr-2">
          <View className="w-5 h-5 rounded-full bg-amber-500/20 items-center justify-center mr-2 border border-amber-400/40">
            <Sparkles size={11} color="#FBBF24" />
          </View>
          <Text
            className="text-slate-300 text-[11px] font-medium"
            numberOfLines={1}
          >
            <Text className="text-amber-400 font-bold">EDSA Platform</Text> •
            Active Portal:{' '}
            <Text className="text-white font-bold uppercase">
              {currentRole === 'vendor'
                ? '🏪 Vendor Terminal'
                : currentRole === 'guest'
                ? '⚡ Guest'
                : '👤 Customer'}
            </Text>
          </Text>
        </View>

        <Pressable
          onPress={() => setShowControls(!showControls)}
          className="bg-slate-800 hover:bg-slate-700 active:bg-slate-600 px-2.5 py-1 rounded-full border border-slate-700 flex-row items-center"
        >
          <Text className="text-amber-300 text-[10px] font-bold mr-1">
            ⚡ Switch Portal / Persona
          </Text>
        </Pressable>
      </View>

      {showControls && (
        <View className="max-w-5xl mx-auto w-full mt-2 pt-2 border-t border-slate-800 bg-slate-950/90 p-3 rounded-2xl">
          <Text className="text-white text-xs font-bold mb-2">
            Switch Presentation Mode (3 Personas):
          </Text>

          {/* 3 Persona Buttons */}
          <View className="flex-row flex-wrap gap-2 mb-3">
            {/* 1. Guest */}
            <Pressable
              onPress={() => {
                loginAs('guest');
                router.push('/guest' as any);
              }}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 flex-row items-center active:bg-slate-700"
            >
              <Zap size={14} color="#F59E0B" className="mr-1.5" />
              <View>
                <Text className="text-white font-bold text-xs">
                  1. Guest Quick Buy
                </Text>
                <Text className="text-slate-400 text-[9px]">
                  No login • Privacy mode • No bonus
                </Text>
              </View>
            </Pressable>

            {/* 2. Customer */}
            <Pressable
              onPress={() => {
                loginAs('user', 'approved');
                router.push('/' as any);
              }}
              className="bg-blue-900/60 border border-blue-500 rounded-xl px-3 py-2 flex-row items-center active:bg-blue-800"
            >
              <UserCheck size={14} color="#60A5FA" className="mr-1.5" />
              <View>
                <Text className="text-white font-bold text-xs">
                  2. Registered Customer
                </Text>
                <Text className="text-blue-300 text-[9px]">
                  +5% Bonus • 2+ Meters • Buy Meter
                </Text>
              </View>
            </Pressable>

            {/* 3. Vendor */}
            <Pressable
              onPress={() => {
                loginAs('vendor', 'approved');
                router.push('/vendor/portal' as any);
              }}
              className="bg-amber-950/60 border border-amber-500 rounded-xl px-3 py-2 flex-row items-center active:bg-amber-900"
            >
              <Store size={14} color="#FBBF24" className="mr-1.5" />
              <View>
                <Text className="text-amber-300 font-bold text-xs">
                  3. Vendor Terminal
                </Text>
                <Text className="text-amber-200/70 text-[9px]">
                  Vend for all • Commission Bonus Wallet
                </Text>
              </View>
            </Pressable>

            {/* 4. Apply for Meter */}
            <Pressable
              onPress={() => router.push('/meters/apply' as any)}
              className="bg-emerald-950/60 border border-emerald-600 rounded-xl px-3 py-2 flex-row items-center active:bg-emerald-900"
            >
              <FileCheck size={14} color="#34D399" className="mr-1.5" />
              <View>
                <Text className="text-emerald-300 font-bold text-xs">
                  Buy / Apply for Meter
                </Text>
                <Text className="text-emerald-200/70 text-[9px]">
                  New connection • Pickup tracker
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Failure simulation toggle */}
          <View className="flex-row items-center justify-between pt-2 border-t border-slate-800">
            <Text className="text-slate-400 text-[11px]">
              Payment Failure Simulation:
            </Text>
            <View className="flex-row items-center gap-2">
              <Text
                className={`text-xs font-semibold ${
                  simulateFailureMode ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                {simulateFailureMode ? 'Simulate Error: ON' : 'Normal: OK'}
              </Text>
              <Switch
                value={simulateFailureMode}
                onValueChange={setSimulateFailureMode}
                trackColor={{ false: '#334155', true: '#DC2626' }}
                thumbColor={simulateFailureMode ? '#FEF2F2' : '#FFFFFF'}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
