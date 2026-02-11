import DatePicker from "@/components/ui/DatePicker";
import PdfViewer from "@/components/ui/PdfViewer";
import { reportsService } from "@/services/reports-service";
import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import * as FileSystem from "expo-file-system";
import { Stack } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import * as z from "zod";

const reportSchema = z
  .object({
    dataInicio: z.date({
      required_error: "Data de início é obrigatória",
    }),
    dataFim: z.date({
      required_error: "Data de fim é obrigatória",
    }),
  })
  .refine((data) => data.dataFim >= data.dataInicio, {
    message: "A data de fim deve ser posterior ou igual à data de início",
    path: ["dataFim"],
  });

type ReportFormData = z.infer<typeof reportSchema>;

export default function RelatorioScreen() {
  const [loading, setLoading] = useState(false);
  const [pdfUri, setPdfUri] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    mode: "onChange",
    defaultValues: {
      dataInicio: new Date(new Date().setDate(new Date().getDate() - 30)),
      dataFim: new Date(),
    },
  });

  const handleQuickSelect = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    setValue("dataInicio", start, { shouldValidate: true });
    setValue("dataFim", end, { shouldValidate: true });
  };

  const onGenerateReport = async (data: ReportFormData) => {
    setLoading(true);
    setPdfUri(null);
    try {
      const blob = await reportsService.getReportPdf(
        data.dataInicio.toISOString(),
        data.dataFim.toISOString()
      );

      if (Platform.OS === "web") {
        const url = URL.createObjectURL(blob);
        setPdfUri(url);
      } else {
        const filename = `relatorio_fibrolog_${Date.now()}.pdf`;
        const tempUri = `${FileSystem.cacheDirectory}${filename}`;

        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64data = (reader.result as string).split(",")[1];
          await FileSystem.writeAsStringAsync(tempUri, base64data, {
            encoding: FileSystem.EncodingType.Base64,
          });
          setPdfUri(tempUri);
        };
        reader.readAsDataURL(blob);
      }
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao gerar relatório");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!pdfUri) return;

    if (Platform.OS === "web") {
      // In web, sharing is usually downloading or opening in new tab
      window.open(pdfUri, "_blank");
      return;
    }

    try {
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Erro", "O compartilhamento não está disponível no seu dispositivo");
        return;
      }
      await Sharing.shareAsync(pdfUri, {
        mimeType: "application/pdf",
        dialogTitle: "Compartilhar Relatório",
        UTI: "com.adobe.pdf",
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível compartilhar o arquivo");
    }
  };

  const handleDownload = async () => {
    if (!pdfUri) return;

    if (Platform.OS === "web") {
      const link = document.createElement("a");
      link.href = pdfUri;
      link.download = "relatorio_fibrolog.pdf";
      link.click();
      return;
    }

    try {
      await Sharing.shareAsync(pdfUri, {
        mimeType: "application/pdf",
        dialogTitle: "Salvar Relatório",
      });
      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Relatório pronto para salvar ou compartilhar",
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o arquivo");
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Relatórios",
          headerShown: true,
          headerTintColor: "#ffffff",
          headerStyle: { backgroundColor: "#D21F8F" },
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📅 Período do Relatório</Text>
          
          <DatePicker
            name="dataInicio"
            control={control}
            label="De:"
            placeholder="Data de início"
            error={errors.dataInicio?.message}
          />

          <DatePicker
            name="dataFim"
            control={control}
            label="Até:"
            placeholder="Data de fim"
            error={errors.dataFim?.message}
          />

          <Text style={styles.label}>Períodos rápidos:</Text>
          <View style={styles.quickButtons}>
            {[7, 15, 30, 60].map((days) => (
              <TouchableOpacity
                key={days}
                style={styles.quickButton}
                onPress={() => handleQuickSelect(days)}
              >
                <Text style={styles.quickButtonText}>{days}d</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.generateButton, !isValid && styles.disabledButton]}
            onPress={handleSubmit(onGenerateReport)}
            disabled={loading || !isValid}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <MaterialIcons name="assessment" size={24} color="#fff" />
                <Text style={styles.generateButtonText}>Gerar Relatório</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {pdfUri && (
          <View style={styles.previewContainer}>
            <Text style={styles.sectionTitle}>📄 Pré-visualização</Text>
            <PdfViewer uri={pdfUri} />
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                <MaterialIcons 
                  name={Platform.OS === 'web' ? "open-in-new" : "share"} 
                  size={24} 
                  color="#D21F8F" 
                />
                <Text style={styles.actionButtonText}>
                  {Platform.OS === 'web' ? "Abrir" : "Compartilhar"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={handleDownload}>
                <MaterialIcons name="file-download" size={24} color="#D21F8F" />
                <Text style={styles.actionButtonText}>Baixar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdf2f9",
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#641c4d",
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#7d1e60",
    marginBottom: 10,
    fontWeight: "600",
  },
  quickButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  quickButton: {
    backgroundColor: "#fce7f5",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#f9a8d4",
  },
  quickButtonText: {
    color: "#D21F8F",
    fontWeight: "bold",
  },
  generateButton: {
    backgroundColor: "#D21F8F",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#e0a0c4",
  },
  generateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  previewContainer: {
    height: 600,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#fce7f5",
    paddingTop: 15,
  },
  actionButton: {
    alignItems: "center",
  },
  actionButtonText: {
    color: "#D21F8F",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 5,
  },
});
