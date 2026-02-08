import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SYMPTOMS_MAP } from "../constants/symptoms";
import { DailyLog, DailyLogService } from "../services/symptoms-service";
import { Colors } from "../src/constants/theme";

export default function HistoryScreen() {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<DailyLog | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await DailyLogService.getAll();
      // Sort by date newest first
      const sortedData = data.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
      setLogs(sortedData);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderLogItem = ({ item }: { item: DailyLog }) => {
    return (
      <TouchableOpacity
        onPress={() => setSelectedLog(item)}
        className="bg-white p-5 mb-4 rounded-[32px] shadow-lg shadow-black/20"
      >
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            <View className="bg-pink-100 p-2 rounded-full mr-3">
              <MaterialCommunityIcons
                name="calendar-clock"
                size={20}
                color={Colors.pink[500]}
              />
            </View>
            <Text className="text-pink-900 font-black text-base">
              {formatDate(item.timestamp)}
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={Colors.pink[500]}
          />
        </View>

        <View className="flex-row flex-wrap mb-2">
          {item.symptoms.slice(0, 4).map((s) => {
            const symptom = SYMPTOMS_MAP[s.id];
            return (
              <View
                key={s.id}
                className="flex-row items-center bg-pink-50 px-3 py-1.5 rounded-full mr-2 mb-2 border border-pink-100"
              >
                <MaterialCommunityIcons
                  name={symptom?.icon || "alert-circle-outline"}
                  size={14}
                  color={Colors.pink[500]}
                />
                <Text className="text-pink-800 text-xs ml-1.5 font-bold">
                  {symptom?.name || `Sintoma ${s.id}`}
                </Text>
                <View className="ml-1.5 bg-pink-500 rounded-full w-5 h-5 items-center justify-center">
                  <Text className="text-white text-[10px] font-black">
                    {s.intensity}
                  </Text>
                </View>
              </View>
            );
          })}
          {item.symptoms.length > 4 && (
            <View className="bg-neutral-100 px-3 py-1.5 rounded-full mb-2">
              <Text className="text-neutral-500 text-xs font-bold">
                +{item.symptoms.length - 4} mais
              </Text>
            </View>
          )}
        </View>

        <View className="flex-row items-center justify-between mt-2 pt-3 border-t border-pink-50">
          <View className="flex-row items-center">
            <MaterialCommunityIcons
              name="map-marker-radius"
              size={16}
              color={Colors.pink[400]}
            />
            <Text className="text-pink-400 text-xs ml-1 font-bold">
              {item.painRegions.length} áreas de dor
            </Text>
          </View>
          {item.notes && (
            <View className="bg-pink-50 px-2 py-1 rounded-md">
              <MaterialCommunityIcons
                name="note-text-outline"
                size={16}
                color={Colors.pink[500]}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color={Colors.pink[500]} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: "Meu Histórico",
          headerShown: true,
        }}
      />
      
      <FlatList
        data={logs}
        renderItem={renderLogItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View className="items-center justify-center mt-20">
            <MaterialCommunityIcons
              name="calendar-blank"
              size={64}
              color={Colors.pink[100]}
            />
            <Text className="text-pink-300 text-lg mt-4 text-center">
              Você ainda não possui registros.
            </Text>
          </View>
        }
      />

      <Modal
        visible={!!selectedLog}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedLog(null)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 h-[80%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-pink-900 text-xl font-bold">
                Detalhes do Registro
              </Text>
              <TouchableOpacity onPress={() => setSelectedLog(null)}>
                <MaterialCommunityIcons
                  name="close"
                  size={28}
                  color={Colors.pink[800]}
                />
              </TouchableOpacity>
            </View>

            {selectedLog && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View className="mb-6 bg-pink-50 p-4 rounded-3xl">
                  <Text className="text-pink-400 text-xs uppercase font-black mb-1">
                    Data e Hora
                  </Text>
                  <Text className="text-pink-900 text-lg font-bold">
                    {formatDate(selectedLog.timestamp)}
                  </Text>
                </View>

                <View className="mb-6">
                  <Text className="text-pink-400 text-xs uppercase font-black mb-3 ml-1">
                    Sintomas e Intensidade
                  </Text>
                  {selectedLog.symptoms.map((s, index) => {
                    const symptom = SYMPTOMS_MAP[s.id];
                    return (
                      <View
                        key={index}
                        className="flex-row justify-between items-center bg-white p-4 rounded-3xl mb-3 border border-pink-100 shadow-sm"
                      >
                        <View className="flex-row items-center flex-1">
                          <View className="bg-pink-100 p-2 rounded-full">
                            <MaterialCommunityIcons
                              name={symptom?.icon || "alert-circle-outline"}
                              size={24}
                              color={Colors.pink[500]}
                            />
                          </View>
                          <Text className="text-pink-900 font-bold ml-3 text-base">
                            {symptom?.name || `Sintoma ${s.id}`}
                          </Text>
                        </View>
                        <View className="bg-pink-500 w-10 h-10 rounded-full items-center justify-center shadow-md shadow-pink-200">
                          <Text className="text-white font-black text-lg">
                            {s.intensity}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>

                <View className="mb-6">
                  <Text className="text-pink-400 text-xs uppercase font-black mb-3 ml-1">
                    Regiões de Dor e Intensidade
                  </Text>
                  <View className="flex-row flex-wrap">
                    {selectedLog.painRegions.map((r, index) => (
                      <View
                        key={index}
                        className="bg-white border border-pink-100 px-4 py-3 rounded-[20px] mr-3 mb-3 flex-row items-center shadow-sm"
                      >
                        <View className="bg-pink-500 w-6 h-6 rounded-full items-center justify-center mr-2">
                          <Text className="text-white font-black text-[10px]">
                            {r.id}
                          </Text>
                        </View>
                        <Text className="text-pink-900 font-black text-lg">
                          {r.intensity}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {selectedLog.notes && (
                  <View className="mb-10">
                    <Text className="text-pink-400 text-xs uppercase font-black mb-3 ml-1">
                      Observações
                    </Text>
                    <View className="bg-neutral-50 p-5 rounded-3xl border border-neutral-100">
                      <Text className="text-neutral-700 leading-6 italic font-medium">
                        "{selectedLog.notes}"
                      </Text>
                    </View>
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
