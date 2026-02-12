import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Stack } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import {
  ProgressStatistics,
  statisticsService,
} from "@/services/statistics-service";
import { MetricCard } from "@/components/ui/MetricCard";
import { WeeklyPainChart } from "@/components/ui/WeeklyPainChart";
import { SelfCareCard } from "@/components/ui/SelfCareCard";
import { SELF_CARE_TIPS } from "@/constants/self-care";
import Button from "@/components/ui/Button";

export default function ProgressoScreen() {
  const [data, setData] = useState<ProgressStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const result = await statisticsService.getProgresso();
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar progresso."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const onRefresh = () => fetchProgress(true);

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#D330AA" />
        <Text style={styles.loadingText}>Carregando seu progresso...</Text>
      </View>
    );
  }

  if (error && !data) {
    return (
      <View style={styles.centerContainer}>
        <MaterialIcons name="error-outline" size={64} color="#EF4444" />
        <Text style={styles.errorTitle}>Ops! Algo deu errado</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Tentar Novamente" onPress={() => fetchProgress()} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Stack.Screen
        options={{
          title: "Progresso",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#D330AA",
          },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerRight: () => (
            <TouchableOpacity onPress={() => fetchProgress(true)} style={{ marginRight: 15 }}>
              <MaterialIcons name="refresh" size={24} color="white" />
            </TouchableOpacity>
          ),
        }}
      />

      {data && (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Métricas da Semana</Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              label="Média de Dor"
              data={data.media_dor_semana}
              formatValue={(v) => v.toFixed(1)}
            />
            <MetricCard
              label="Crises este Mês"
              data={data.crises_mes}
            />
          </View>
          
          <View style={styles.fullWidthCard}>
              <MetricCard
                label="Dias Registrados (Mês)"
                data={data.dias_registrados_mes}
                suffix=" dias"
              />
          </View>

          <WeeklyPainChart data={data.grafico_dor_semanal} />

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Dicas de Autocuidado</Text>
          {SELF_CARE_TIPS.map((tip) => (
            <SelfCareCard key={tip.id} tip={tip} />
          ))}
          
          <View style={styles.footerSpacer} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdf2f9",
  },
  content: {
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fdf2f9",
  },
  loadingText: {
    marginTop: 10,
    color: "#7d1e60",
    fontSize: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#641c4d",
    marginTop: 20,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: "#7d1e60",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#641c4d",
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  fullWidthCard: {
      width: "100%",
      marginBottom: 12,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontStyle: "italic",
    marginTop: 10,
  },
  footerSpacer: {
      height: 40
  }
});
