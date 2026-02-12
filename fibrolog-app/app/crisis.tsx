import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import { crisesService } from "@/services/crises-service";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface CrisisFormData {
  intensidade_dor: number;
  contexto: string;
  duracao: string;
  sintomas_relatados: string;
  observacoes: string;
}

export default function CrisisScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CrisisFormData>({
    defaultValues: {
      intensidade_dor: 4,
      contexto: "",
      duracao: "",
      sintomas_relatados: "",
      observacoes: "",
    },
  });

  const selectedIntensity = watch("intensidade_dor");

  const onSubmit = async (data: CrisisFormData) => {
    try {
      setLoading(true);
      await crisesService.create(data);
      Alert.alert("Sucesso", "Crise registrada com sucesso!");
      reset();
      router.push("/(tabs)/home");
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao salvar crise.");
    } finally {
      setLoading(false);
    }
  };

  const renderIntensitySelector = () => {
    return (
      <View style={styles.intensityContainer}>
        <Text style={styles.label}>Intensidade da Dor (0-10)</Text>
        <View style={styles.intensityGrid}>
          {[0, 2, 4, 6, 8, 10].map((num) => (
            <TouchableOpacity
              key={num}
              style={[
                styles.intensityCircle,
                selectedIntensity === num && styles.intensityCircleSelected,
              ]}
              onPress={() => setValue("intensidade_dor", num)}
            >
              <Text
                style={[
                  styles.intensityNumber,
                  selectedIntensity === num && styles.intensityNumberSelected,
                ]}
              >
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Registrar Crise", headerShown: true }} />

      <View style={styles.form}>
        {renderIntensitySelector()}

        <Input
          name="contexto"
          control={control}
          label="Contexto da Crise"
          placeholder="Ex: Estresse no trabalho, mudança de clima..."
          error={errors.contexto?.message}
        />

        <Input
          name="duracao"
          control={control}
          label="Duração Estimada"
          placeholder="Ex: 2 horas, 30 minutos..."
        />

        <TextArea
          name="sintomas_relatados"
          control={control}
          label="Sintomas Relatados"
          placeholder="Descreva os sintomas que você está sentindo..."
          numberOfLines={4}
        />

        <TextArea
          name="observacoes"
          control={control}
          label="Observações Adicionais"
          placeholder="Outras informações relevantes..."
          numberOfLines={4}
        />

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <MaterialIcons name="save" size={24} color="white" />
              <Text style={styles.submitButtonText}>Registrar Crise</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdf2f9",
  },
  form: {
    padding: 15,
  },
  intensityContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#641c4d",
    marginBottom: 12,
  },
  intensityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  intensityCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fce7f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  intensityCircleSelected: {
    backgroundColor: "#7d1e60",
    borderColor: "#d81b60",
  },
  intensityNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#7d1e60",
  },
  intensityNumberSelected: {
    color: "white",
  },
  submitButton: {
    backgroundColor: "#7d1e60",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 40,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  submitButtonDisabled: {
    backgroundColor: "#b88ba4",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16,
  },
});
