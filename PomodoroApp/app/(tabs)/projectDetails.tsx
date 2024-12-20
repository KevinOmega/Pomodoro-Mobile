import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import util_styles from "@/styles/utils";
import taskList_styles from "@/styles/taskList";
import { useGlobalContext } from "@/context/AppContext";
import { Task } from "@/db/models/Task";

interface NewTask {
  name: string;
  estimated_effort: number;
}

export default function ProjectDetails() {
  const { projectName } = useLocalSearchParams<{ projectName: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<NewTask>({
    name: "",
    estimated_effort: 1,
  });
  const [render, setRender] = useState<boolean>(false);
  const {
    user,
    controllers: {
      TaskController: {
        getTasksByList,
        deleteTask,
        addTask,
        getTasksByProject,
      },
      ListController: { getMainListID },
    },
  } = useGlobalContext();

  const handleAddTask = () => {
    if (newTask.name.trim() !== "") {
      console.log("Añadiendo Tarea");
      if (user) {
        const project_id = user.projects.find(
          (project) => project.name === projectName
        )?._id;
        addTask({
          name: newTask.name,
          estimated_effort: 1,
          list_id: getMainListID(),
          project_id: project_id,
        });
        setNewTask({ name: "", estimated_effort: 1 });
        setRender(!render);
      } else {
        console.error("User is null");
      }
    }
  };

  useEffect(() => {
    if (user) {
      const project = user.projects.find(
        (project) => project.name === projectName
      );
      if (project) {
        const project_id = project._id;
        setTasks(getTasksByProject(project_id));
      } else {
        console.error("Project not found");
      }
    }
  }, [render, user, projectName]);

  const handleDeleteTask = (taskId: Realm.BSON.ObjectID) => {
    console.log(taskId.toString(), "Eliminando Tarea");
    setRender(!render);
    deleteTask(taskId);
  };

  const handleTaskPress = (Taskname: string) => {
    console.log("Tarea seleccionada:", Taskname);
    router.push({
      pathname: "../taskDetails",
      params: { Taskname },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tareas del proyecto</Text>
      <Text style={styles.projectName}>{projectName}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTask.name}
          onChangeText={(text) => setNewTask({ ...newTask, name: text })}
          placeholder="Nombre de la Tarea"
        />
        <TouchableOpacity style={styles.button} onPress={handleAddTask}>
          <Text style={styles.buttonText}>Añadir Tarea</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.projectItem}
            onPress={() => handleTaskPress(item.name)}
          >
            <Text>{item.name}</Text>
            <Text>Iniciado: {item.status}</Text>
            <Text>Pomodoros estimados: {item.estimated_effort}</Text>
            <Text>Pomodoros realizados: {item.real_effort}</Text>
            {/* <Text>Fecha de inicio: {item.started_at}</Text> */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteTask(item._id)}
            >
              <Text style={styles.deleteButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id.toString()}
      />
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
    marginTop: 20,
  },
  projectName: {
    fontSize: 18,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 25,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#ef6548",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    justifyContent: "center",
  },
  projectItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  deleteButton: {
    backgroundColor: "#ff4444",
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
  },
  deleteButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 14,
  },
});
