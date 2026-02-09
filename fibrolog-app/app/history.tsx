import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
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
import Toast from "react-native-toast-message";
import { SYMPTOMS_MAP } from "../constants/symptoms";
import { crisesService, Crisis } from "../services/crises-service";
import { DailyLog, DailyLogService } from "../services/symptoms-service";
import { Colors } from "../src/constants/theme";

type HistoryItem =
  | { type: "daily"; data: DailyLog }
  | { type: "crisis"; data: Crisis };

export default function HistoryScreen() {
  const router = useRouter();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<DailyLog | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const [logsData, crisesData] = await Promise.all([
        DailyLogService.getAll(),
        crisesService.list(),
      ]);

      const combined: HistoryItem[] = [
        ...logsData.map((log) => ({ type: "daily" as const, data: log })),
        ...(crisesData.crises || []).map((crisis) => ({
          type: "crisis" as const,
          data: crisis,
        })),
      ];

      // Sort by date newest first
      const sorted = combined.sort((a, b) => {
        const dateA = new Date(
          a.type === "daily" ? a.data.timestamp : a.data.data_hora,
        ).getTime();
        const dateB = new Date(
          b.type === "daily" ? b.data.timestamp : b.data.data_hora,
        ).getTime();
        return dateB - dateA;
      });

      setItems(sorted);
    } catch (_error) {
      // Erro ao buscar histórico
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

  const handleDeleteClick = () => {
    // Validar se o ID é válido
    if (!selectedLog?.id || typeof selectedLog.id !== "number") {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: `ID inválido: ${selectedLog?.id}`,
      });
      return;
    }
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedLog?.id) return;

    setShowDeleteDialog(false);

    try {
      await DailyLogService.delete(selectedLog.id);
      setSelectedLog(null);
      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Registro excluído com sucesso.",
      });
      fetchHistory();
    } catch (error: any) {
      const errorMessage =
        error?.message || "Não foi possível excluir o registro.";
      Toast.show({
        type: "error",
        text1: "Erro ao excluir",
        text2: errorMessage,
      });
    }
  };

  const renderItem = ({ item }: { item: HistoryItem }) => {
    if (item.type === "daily") {
      const log = item.data;
      return (
        <TouchableOpacity
          onPress={() => setSelectedLog(log)}
          className="bg-white p-5 mb-4 rounded-[32px] shadow-lg shadow-black/10 border border-pink-50"
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
              <View>
                <Text className="text-pink-400 text-[10px] font-black uppercase">
                  Registro Diário
                </Text>
                <Text className="text-pink-900 font-black text-base">
                  {formatDate(log.timestamp)}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => router.push(`/symptoms?id=${log.id}`)}
              className="bg-pink-50 p-2 rounded-full"
            >
              <MaterialIcons name="edit" size={20} color={Colors.pink[500]} />
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap mb-2">
            {log.symptoms.slice(0, 3).map((s) => {
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
                </View>
              );
            })}
            {log.symptoms.length > 3 && (
              <View className="bg-neutral-100 px-3 py-1.5 rounded-full mb-2">
                <Text className="text-neutral-500 text-xs font-bold">
                  +{log.symptoms.length - 3}
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
                {log.painRegions.length} áreas de dor
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={Colors.pink[200]}
            />
          </View>
        </TouchableOpacity>
      );
    } else {
      const crisis = item.data;
      return (
        <TouchableOpacity
          onPress={() => router.push(`/crisis-detail?id=${crisis.id}`)}
          className="bg-rose-50 p-5 mb-4 rounded-[32px] shadow-lg shadow-black/10 border border-rose-100"
        >
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <View className="bg-rose-200 p-2 rounded-full mr-3">
                <MaterialCommunityIcons
                  name="alert-octagon"
                  size={20}
                  color="#be123c"
                />
              </View>
              <View>
                <Text className="text-rose-400 text-[10px] font-black uppercase">
                  Crise de Dor
                </Text>
                <Text className="text-rose-900 font-black text-base">
                  {formatDate(crisis.data_hora)}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => router.push(`/crisis-form?id=${crisis.id}`)}
              className="bg-white/50 p-2 rounded-full"
            >
              <MaterialIcons name="edit" size={20} color="#be123c" />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center mb-3">
            <View className="bg-rose-600 px-3 py-1 rounded-full mr-3">
              <Text className="text-white font-black text-xs">
                Intensidade {crisis.intensidade_dor}
              </Text>
            </View>
            <Text
              className="text-rose-800 text-sm font-bold flex-1"
              numberOfLines={1}
            >
              {crisis.contexto}
            </Text>
          </View>

          <View className="flex-row items-center justify-between mt-2 pt-3 border-t border-rose-100">
            <Text className="text-rose-400 text-xs font-bold">
              {crisis.duracao || "Duração não informada"}
            </Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color="#be123c"
            />
          </View>
        </TouchableOpacity>
      );
    }
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
        data={items}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        contentContainerStyle={{ padding: 16 }}
        refreshing={loading}
        onRefresh={fetchHistory}
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

                <View className="flex-row justify-between mb-10">
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedLog(null);
                      router.push(`/symptoms?id=${selectedLog.id}`);
                    }}
                    className="bg-pink-600 p-4 rounded-2xl flex-row items-center justify-center flex-1 mr-2"
                  >
                    <MaterialIcons name="edit" size={24} color="white" />
                    <Text className="text-white font-bold ml-2 text-lg">
                      Editar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleDeleteClick}
                    className="bg-red-600 p-4 rounded-2xl flex-row items-center justify-center flex-1 ml-2"
                  >
                    <MaterialIcons name="delete" size={24} color="white" />
                    <Text className="text-white font-bold ml-2 text-lg">
                      Excluir
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      <ConfirmDialog
        visible={showDeleteDialog}
        title="Confirmar Exclusão"
        message={`Deseja realmente excluir o registro?`}
        confirmText="Excluir"
        cancelText="Cancelar"
        confirmColor="#dc2626"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteDialog(false)}
      />

      <Toast />
    </View>
  );
}
