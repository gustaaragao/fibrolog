import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import BodyMap from "../components/ui/BodyMap";
import Button from "../components/ui/Button";
import TextArea from "../components/ui/TextArea";
import { Symptom, SYMPTOMS } from "../constants/symptoms";
import { DailyLogPayload, DailyLogService } from "../services/symptoms-service";
import { Colors } from "../src/constants/theme";

export default function SymptomsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;
  const [step, setStep] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [symptomIntensities, setSymptomIntensities] = useState<
    Record<string, number>
  >({});
  const [regionIntensities, setRegionIntensities] = useState<
    Record<string, number>
  >({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [originalTimestamp, setOriginalTimestamp] = useState<string | null>(
    null,
  );

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      notes: "",
    },
  });

  // Carregar dados existentes se estiver editando
  useEffect(() => {
    if (isEditing) {
      // Validar ID numérico
      const numericId = parseInt(id, 10);
      if (!Number.isFinite(numericId) || numericId <= 0) {
        Toast.show({
          type: "error",
          text1: "Erro",
          text2: "ID de registro inválido.",
        });
        router.back();
        return;
      }

      const loadExistingData = async () => {
        try {
          const data = await DailyLogService.getById(numericId);

          // Preservar timestamp original
          setOriginalTimestamp(data.timestamp);

          // Carregar sintomas selecionados e suas intensidades
          const symptomIds = data.symptoms.map((s) => s.id);
          setSelectedSymptoms(symptomIds);
          const sympIntensities: Record<string, number> = {};
          data.symptoms.forEach((s) => {
            sympIntensities[s.id] = s.intensity;
          });
          setSymptomIntensities(sympIntensities);

          // Carregar regiões selecionadas e suas intensidades
          const regionIds = data.painRegions.map((r) => r.id);
          setSelectedRegions(regionIds);
          const regIntensities: Record<string, number> = {};
          data.painRegions.forEach((r) => {
            regIntensities[r.id] = r.intensity;
          });
          setRegionIntensities(regIntensities);

          // Carregar observações
          if (data.notes) {
            setValue("notes", data.notes);
          }
        } catch (error) {
          Alert.alert(
            "Erro",
            "Não foi possível carregar os dados do registro.",
          );
          router.back();
        } finally {
          setInitialLoading(false);
        }
      };
      loadExistingData();
    }
  }, [id]);

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const toggleRegion = (id: string) => {
    setSelectedRegions((prev) => {
      if (prev.includes(id)) {
        // Remove região e sua intensidade
        const newRegions = prev.filter((r) => r !== id);
        setRegionIntensities((prevInt) => {
          const newInt = { ...prevInt };
          delete newInt[id];
          return newInt;
        });
        return newRegions;
      } else {
        // Adiciona região com intensidade padrão 4
        setRegionIntensities((prevInt) => ({ ...prevInt, [id]: 4 }));
        return [...prev, id];
      }
    });
  };

  const updateSymptomIntensity = (symptomId: string, value: number) => {
    setSymptomIntensities((prev) => ({ ...prev, [symptomId]: value }));
  };

  const updateRegionIntensity = (regionId: string, value: number) => {
    setRegionIntensities((prev) => ({ ...prev, [regionId]: value }));
  };

  const handleNext = () => {
    if (step === 1 && selectedSymptoms.length === 0) {
      Alert.alert(
        "Seleção necessária",
        "Por favor, selecione pelo menos um sintoma.",
      );
      return;
    }
    if (step === 2 && selectedRegions.length === 0) {
      Alert.alert(
        "Seleção necessária",
        "Por favor, marque pelo menos um local de dor no mapa.",
      );
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const payload: DailyLogPayload = {
        symptoms: selectedSymptoms.map((id) => ({
          id,
          intensity: symptomIntensities[id] || 0,
        })),
        painRegions: selectedRegions.map((id) => ({
          id,
          intensity: regionIntensities[id] || 4,
        })),
        notes: data.notes,
        timestamp: isEditing && originalTimestamp 
          ? originalTimestamp 
          : new Date().toISOString(),
      };

      if (isEditing) {
        await DailyLogService.update(parseInt(id, 10), payload);
        Toast.show({
          type: "success",
          text1: "Sucesso!",
          text2: "Seus sintomas foram atualizados.",
        });
        router.replace("/history");
      } else {
        await DailyLogService.create(payload);
        Toast.show({
          type: "success",
          text1: "Sucesso!",
          text2: "Seus sintomas foram registrados.",
        });
        router.replace("/home");
      }
    } catch (error) {
      Alert.alert(
        "Erro",
        error instanceof Error
          ? error.message
          : "Não foi possível salvar os sintomas.",
      );
    } finally {
      setLoading(false);
    }
  };

  const renderSymptomItem = ({ item }: { item: Symptom }) => {
    const isSelected = selectedSymptoms.includes(item.id);
    return (
      <TouchableOpacity
        className={`flex-1 m-2 p-4 rounded-2xl items-center justify-center border-2 ${
          isSelected
            ? "bg-pink-100 border-pink-500"
            : "bg-white border-pink-200"
        }`}
        onPress={() => toggleSymptom(item.id)}
      >
        <MaterialCommunityIcons
          name={item.icon}
          size={40}
          color={isSelected ? Colors.pink[600] : Colors.pink[300]}
        />
        <Text
          className={`mt-2 text-center font-semibold ${isSelected ? "text-pink-800" : "text-pink-400"}`}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const getTitle = () => {
    switch (step) {
      case 1:
        return "Passo 1 de 3: Sintomas";
      case 2:
        return "Passo 2 de 3: Localização";
      case 3:
        return "Passo 3 de 3: Intensidade";
      default:
        return "Sintomas";
    }
  };

  return (
    <View className="flex-1 bg-pink-50">
      <Stack.Screen
        options={{
          title: getTitle(),
          headerShown: true,
        }}
      />

      {initialLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={Colors.pink[500]} />
          <Text className="mt-4 text-pink-600">Carregando dados...</Text>
        </View>
      ) : (
        <>
          {step === 1 && (
        <ScrollView className="flex-1">
          <View className="p-4">
            <Text className="text-pink-800 text-lg font-bold mb-2 text-center">
              Como você está hoje?
            </Text>
            <Text className="text-pink-600 text-sm mb-4 text-center">
              Selecione os sintomas que você está sentindo:
            </Text>
            <FlatList
              data={SYMPTOMS}
              renderItem={renderSymptomItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={{ paddingBottom: 10 }}
            />
            <View className="mt-4">
              <Button title="Próximo: Local da Dor" onPress={handleNext} />
            </View>
          </View>
        </ScrollView>
      )}

      {step === 2 && (
        <ScrollView className="flex-1">
          <View className="pb-4">
            <View className="px-4 pt-4">
              <Text className="text-pink-800 text-lg font-bold mb-2 text-center">
                Onde dói?
              </Text>
              <Text className="text-pink-600 text-sm mb-4 text-center">
                Toque nas áreas do corpo onde você sente dor.
              </Text>
            </View>
            <View className="mb-4">
              <BodyMap
                selectedRegions={selectedRegions}
                onRegionToggle={toggleRegion}
              />
            </View>

            {selectedRegions.length > 0 && (
              <View className="mt-4 px-4">
                <Text className="text-pink-800 font-bold mb-3 text-base">
                  Intensidade da dor em cada região (0-10):
                </Text>
                {selectedRegions.map((regionId) => {
                  const intensity = regionIntensities[regionId] || 5;
                  return (
                    <View
                      key={regionId}
                      className="bg-white p-4 rounded-xl mb-3 border border-pink-100"
                    >
                      <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-pink-800 font-semibold">
                          Região {regionId}
                        </Text>
                        <Text className="text-pink-600 font-bold text-xl">
                          {intensity}
                        </Text>
                      </View>
                      <View className="flex-row justify-between">
                        {[0, 2, 4, 6, 8, 10].map((val) => (
                          <TouchableOpacity
                            key={val}
                            onPress={() => updateRegionIntensity(regionId, val)}
                            className={`w-12 h-12 rounded-full items-center justify-center border-2 ${
                              intensity === val
                                ? "bg-pink-500 border-pink-500"
                                : "bg-white border-pink-200"
                            }`}
                          >
                            <Text
                              className={`font-bold ${
                                intensity === val
                                  ? "text-white"
                                  : "text-pink-400"
                              }`}
                            >
                              {val}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
            <View className="flex-row justify-between mt-6 mb-4 px-4">
              <View className="flex-1 mr-2">
                <Button title="Voltar" variant="outline" onPress={handleBack} />
              </View>
              <View className="flex-1 ml-2">
                <Button title="Próximo" onPress={handleNext} />
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      {step === 3 && (
        <ScrollView className="flex-1 p-4">
          <Text className="text-pink-800 text-lg font-bold mb-4">
            Qual a intensidade de cada sintoma? (0 a 10)
          </Text>

          {selectedSymptoms.map((id) => {
            const symptom = SYMPTOMS.find((s) => s.id === id);
            const intensity = symptomIntensities[id] || 0;
            return (
              <View
                key={id}
                className="bg-white p-4 rounded-xl mb-4 border border-pink-100"
              >
                <View className="flex-row items-center mb-3">
                  <MaterialCommunityIcons
                    name={symptom?.icon as any}
                    size={24}
                    color={Colors.pink[600]}
                  />
                  <Text className="ml-2 text-pink-800 font-bold text-base">
                    {symptom?.name}
                  </Text>
                  <Text className="ml-auto text-pink-600 font-bold text-lg">
                    {intensity}
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  {[0, 2, 4, 6, 8, 10].map((val) => (
                    <TouchableOpacity
                      key={val}
                      onPress={() => updateSymptomIntensity(id, val)}
                      className={`w-12 h-12 rounded-full items-center justify-center border-2 ${
                        intensity === val
                          ? "bg-pink-500 border-pink-500"
                          : "bg-white border-pink-200"
                      }`}
                    >
                      <Text
                        className={`font-bold ${
                          intensity === val ? "text-white" : "text-pink-400"
                        }`}
                      >
                        {val}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          })}

          <TextArea
            name="notes"
            control={control}
            label="Observações Adicionais"
            placeholder="Descreva como você está se sentindo..."
          />

          <View className="flex-row justify-between mt-4 mb-8">
            <View className="flex-1 mr-2">
              <Button title="Voltar" variant="outline" onPress={handleBack} />
            </View>
            <View className="flex-1 ml-2">
              <Button
                title="Salvar Registro"
                loading={loading}
                onPress={handleSubmit(onSubmit)}
              />
            </View>
          </View>
        </ScrollView>
      )}
        </>
      )}
    </View>
  );
}
