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

type AppRoutes = "/(tabs)/dailyReports" | "/(tabs)/generalReports";

export default function Reports() {
  const navegar = (route: AppRoutes) => {
    router.push({
      pathname: route,
    });
  };


  return (
    <View>
      <Text style={styles.title}>Reportes</Text>
      <TouchableOpacity onPress={() => navegar("/(tabs)/generalReports")}>
        <Text>Ver Reporte General</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navegar("/(tabs)/dailyReports")}>
        <Text>Ver Reporte diario</Text>
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
});