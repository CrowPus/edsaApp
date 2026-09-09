import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  MapPin,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';

export const GridStatusBanner: React.FC = () => {
  const { gridStatus } = useApp();
  const [expanded, setExpanded] = useState(false);

  const normalCount = gridStatus.filter((g) => g.status === 'normal').length;
  const totalCount = gridStatus.length;

  return (
    <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm my-2">
      {/* Header */}
      <Pressable
        onPress={() => setExpanded(!expanded)}
        className="flex-row items-center justify-between"
      >
        <View className="flex-row items-center space-x-3">
          <View className="w-9 h-9 rounded-full bg-emerald-50 items-center justify-center mr-2.5">
            <Activity size={18} color="#059669" />
          </View>
          <View>
            <View className="flex-row items-center">
              <Text className="text-slate-900 font-bold text-base mr-2">
                National Grid Status
              </Text>
              <View className="bg-emerald-100 px-2 py-0.5 rounded-full flex-row items-center">
                <View className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />
                <Text className="text-emerald-800 text-[10px] font-bold">
                  {normalCount}/{totalCount} Feeder Lines Active
                </Text>
              </View>
            </View>
            <Text className="text-slate-500 text-xs mt-0.5">
              Western Area & Provincial distribution network
            </Text>
          </View>
        </View>

        <View className="p-1 rounded-full bg-slate-100">
          {expanded ? (
            <ChevronUp size={16} color="#64748B" />
          ) : (
            <ChevronDown size={16} color="#64748B" />
          )}
        </View>
      </Pressable>

      {/* Expanded Grid details */}
      {expanded && (
        <View className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
          {gridStatus.map((item) => {
            const isNormal = item.status === 'normal';
            const isMaintenance = item.status === 'maintenance';

            return (
              <View
                key={item.id}
                className="bg-slate-50 p-3 rounded-2xl border border-slate-100"
              >
                <View className="flex-row items-center justify-between mb-1">
                  <View className="flex-row items-center">
                    <MapPin size={13} color="#64748B" className="mr-1" />
                    <Text className="text-slate-900 font-bold text-xs ml-1">
                      {item.region}
                    </Text>
                  </View>

                  <View
                    className={`px-2 py-0.5 rounded-full flex-row items-center ${
                      isNormal
                        ? 'bg-emerald-100'
                        : isMaintenance
                        ? 'bg-amber-100'
                        : 'bg-rose-100'
                    }`}
                  >
                    {isNormal ? (
                      <CheckCircle2 size={10} color="#059669" />
                    ) : (
                      <AlertTriangle
                        size={10}
                        color={isMaintenance ? '#D97706' : '#DC2626'}
                      />
                    )}
                    <Text
                      className={`text-[10px] font-bold uppercase ml-1 ${
                        isNormal
                          ? 'text-emerald-800'
                          : isMaintenance
                          ? 'text-amber-800'
                          : 'text-rose-800'
                      }`}
                    >
                      {item.status === 'normal'
                        ? 'Stable'
                        : item.status === 'maintenance'
                        ? 'Maintenance'
                        : 'Fault'}
                    </Text>
                  </View>
                </View>

                {item.bulletin && (
                  <Text className="text-slate-600 text-xs leading-4">
                    {item.bulletin}
                  </Text>
                )}

                <View className="flex-row items-center justify-between mt-1.5 pt-1.5 border-t border-slate-200/50">
                  <Text className="text-slate-400 text-[10px]">
                    Substations: {Array.isArray(item.substations) ? item.substations.map(s => s.name).join(', ') : item.substations || 'Primary Substation'}
                  </Text>
                  {item.lastUpdated && (
                    <Text className="text-slate-400 text-[10px]">
                      Updated: {item.lastUpdated}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};
