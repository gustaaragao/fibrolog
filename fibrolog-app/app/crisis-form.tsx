import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import { crisesService } from "@/services/crises-service";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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

export default function CrisisFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
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

  useEffect(() => {
    if (isEditing) {
      const fetchCrisis = async () => {
        try {
          const data = await crisesService.getById(parseInt(id));
          setValue("intensidade_dor", data.intensidade_dor);
          setValue("contexto", data.contexto);
          setValue("duracao", data.duracao || "");
          setValue("sintomas_relatados", data.sintomas_relatados || "");
          setValue("observacoes", data.observacoes || "");
        } catch (error) {
          Alert.alert("Erro", "Não foi possível carregar os dados da crise.");
          router.back();
        } finally {
          setInitialLoading(false);
        }
      };
      fetchCrisis();
    }
  }, [id]);

  const onSubmit = async (data: CrisisFormData) => {
    try {
      setLoading(true);
      if (isEditing) {
        await crisesService.update(parseInt(id), data);
        Alert.alert("Sucesso", "Crise atualizada com sucesso!");
        router.replace("/history");
      } else {
        await crisesService.create(data);
        Alert.alert("Sucesso", "Crise registrada com sucesso!");
        router.replace("/(tabs)/home");
      }
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
                  styles.intensityCircleText,
                  selectedIntensity === num &&
                    styles.intensityCircleTextSelected,
                ]}
              >
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.intensityLabel}>
          {selectedIntensity <= 2
            ? "Leve"
            : selectedIntensity <= 6
              ? "Moderada"
              : "Intensa"}
        </Text>
      </View>
    );
  };

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7d1e60" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: isEditing ? "Editar Crise" : "Registrar Crise",
          headerShown: true,
        }}
      />

      <View style={styles.form}>
        {renderIntensitySelector()}

        <Input
          name="contexto"
          control={control}
          label="Contexto"
          placeholder="O que estava fazendo? Gatilhos?"
          error={errors.contexto?.message}
        />

        <Input
          name="duracao"
          control={control}
          label="Duração"
          placeholder="Ex: 2 horas, o dia todo"
        />

        <TextArea
          name="sintomas_relatados"
          control={control}
          label="Sintomas Relatados"
          placeholder="Além da dor, o que sentiu? (ex: fadiga, névoa mental)"
        />

        <TextArea
          name="observacoes"
          control={control}
          label="Observações Adicionais"
          placeholder="Algo mais que queira registrar?"
        />

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <MaterialIcons name="save" size={24} color="white" />
              <Text style={styles.submitButtonText}>
                {isEditing ? "Atualizar Registro" : "Salvar Registro"}
              </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fdf2f9",
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#641c4d",
    marginBottom: 10,
  },
  intensityContainer: {
    marginBottom: 20,
  },
  intensityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  intensityCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#f9a8d4", // pink-300
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  intensityCircleSelected: {
    backgroundColor: "#7d1e60",
    borderColor: "#7d1e60",
  },
  intensityCircleText: {
    fontSize: 14,
    color: "#7d1e60",
  },
  intensityCircleTextSelected: {
    color: "white",
    fontWeight: "bold",
  },
  intensityLabel: {
    textAlign: "right",
    marginTop: 5,
    fontWeight: "bold",
    color: "#7d1e60",
  },
  submitButton: {
    backgroundColor: "#7d1e60",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    elevation: 3,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
