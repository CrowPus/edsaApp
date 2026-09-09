import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import {
  Zap,
  Receipt,
  AlertTriangle,
  Sliders,
  PhoneCall,
  FileCheck,
  Store,
} from 'lucide-react-native';

export const QuickActions: React.FC = () => {
  const actions = [
    {
      id: 'buy',
      label: 'Buy Token',
      desc: 'Instant STS Vending',
      icon: Zap,
      color: '#EA580C',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      route: '/buy',
    },
    {
      id: 'apply-meter',
      label: 'Buy New Meter',
      desc: 'Apply & Track Pickup',
      icon: FileCheck,
      color: '#16A34A',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      route: '/meters/apply',
    },
    {
      id: 'vendor',
      label: 'Vendor Hub',
      desc: 'Earn Commissions',
      icon: Store,
      color: '#D97706',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      route: '/vendor/portal',
    },
    {
      id: 'history',
      label: 'Token History',
      desc: 'View & Copy Tokens',
      icon: Receipt,
      color: '#2563EB',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      route: '/transactions',
    },
    {
      id: 'outage',
      label: 'Report Outage',
      desc: 'Blackout & Faults',
      icon: AlertTriangle,
      color: '#DC2626',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      route: '/outage',
    },
    {
      id: 'meters',
      label: 'My Meters',
      desc: 'Manage & Add',
      icon: Sliders,
      color: '#0D9488',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      route: '/meters',
    },
  ];

  return (
    <View className="my-3">
      <Text className="text-slate-900 font-bold text-base mb-2.5 px-0.5">Quick Actions</Text>
      <View className="flex-row flex-wrap justify-between gap-y-2.5">
        {actions.map((act) => {
          const IconComponent = act.icon;
          return (
            <Pressable
              key={act.id}
              onPress={() => router.push(act.route as any)}
              className={`w-[48%] sm:w-[18%] bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm active:bg-slate-50 transition-all hover:border-slate-300`}
            >
              <View
                className={`w-10 h-10 rounded-xl ${act.bgColor} border ${act.borderColor} items-center justify-center mb-2.5`}
              >
                <IconComponent size={20} color={act.color} />
              </View>
              <Text className="font-bold text-slate-900 text-sm">{act.label}</Text>
              <Text className="text-slate-500 text-[11px] mt-0.5">{act.desc}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
