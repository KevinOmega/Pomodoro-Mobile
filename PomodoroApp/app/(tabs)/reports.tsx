import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useGlobalContext } from "@/context/AppContext";
import { Task } from "@/db/models/Task";
import { BarChart } from "react-native-chart-kit";
import { router } from "expo-router";
import util_styles from "@/styles/utils";
import { colors } from "@/styles/colors";

// type AppRoutes = "/(tabs)/dailyReports" | "/(tabs)/generalReports" | "/(tabs)/monthlyReports";

enum AppRoutes {
  DailyReports = "/(tabs)/dailyReports",
  GeneralReports = "/(tabs)/generalReports",
  MonthlyReports = "/(tabs)/monthlyReports",
}

export default function Reports() {
  const navegar = (route: AppRoutes) => {
    router.push({
      pathname: route,
    });
  };

  return (
    <View style={[util_styles.container,{backgroundColor: colors.secondary}]}>
      <Text style={styles.title}>Reportes</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navegar(AppRoutes.GeneralReports)}
      >
        <Text style={styles.buttonText}>Ver Reporte General</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navegar(AppRoutes.DailyReports)}
      >
        <Text style={styles.buttonText}>Ver Reporte diario</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navegar(AppRoutes.MonthlyReports)}
      >
        <Text style={styles.buttonText}>Ver Reporte Semanal</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fee8c8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#ef6548",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#c53f27",
  },
  statsContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  statsText: {
    fontSize: 16,
    marginBottom: 5,
  },
  chartContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  taskList: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
  },
  taskItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 10,
  },

  button: {
    backgroundColor: "#ef6548",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    marginVertical: 5, //cochinada cambiar despues
  },
  buttonText: {
    color: "white",
  },
});
