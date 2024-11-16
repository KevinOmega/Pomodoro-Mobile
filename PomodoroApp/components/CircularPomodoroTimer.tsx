import { useGlobalContext } from "@/context/AppContext";
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ImageBackground,
} from "react-native";
import { Svg, Circle } from "react-native-svg";
import { ActionKind } from "@/context/reducer";
import { PomodoroState } from "@/context/reducer";
import { PomodoroStatus } from "@/db/models/Pomodoro";
import { DisctractionType } from "@/db/Controllers/PomodoroController";
import Entypo from '@expo/vector-icons/Entypo';

enum TimerStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  PAUSED = "PAUSED",
}
//

const CircularPomodoroTimer = () => {

  const [timerStatus, setTimerStatus] = useState<TimerStatus>(TimerStatus.NOT_STARTED);
  const {
    state,
    dispatch,
    user,
    controllers: {
      TaskController: { getTasksByList, deleteTask, addTask,incrementEffort,changeTaskStatus },
      ListController: { getMainListID },
      PomodoroController: { addPomodoro, changePomodoroStatus, scoreDistraccion },
    },
  } = useGlobalContext();



  const [seconds, setSeconds] = useState(state.timer);
  //const imagenBackg = {source: require("@/assets/images/cropped-pomodoro-solo.png")};
  

  const toggle = () => {
    if(state.status === PomodoroState.FOCUS &&  timerStatus === TimerStatus.NOT_STARTED){
      const response = addPomodoro(state.activeTask);
      console.log(response,"Response");
      
      if(response.status === "error"){
        alert(response.message);
      }else{
        const pomodoro_id = response.pomodoro_id;
        dispatch({ type: ActionKind.SET_POMODORO, payload: pomodoro_id.toString() });

      }
    }
    setTimerStatus(
      timerStatus === TimerStatus.PAUSED || timerStatus === TimerStatus.NOT_STARTED
        ? TimerStatus.IN_PROGRESS
        : TimerStatus.PAUSED
    );
  };

  const reset = () => {
    setSeconds(state.timer);
    setTimerStatus(TimerStatus.NOT_STARTED);
    changePomodoroStatus(state.currentPomodoro, PomodoroStatus.CANCELED);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const incrementPomodoro = () => {
    incrementEffort(state.activeTask);

  }; 
  
  //UseEffect para manejar los intervalos de tiempo
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerStatus === TimerStatus.IN_PROGRESS) {
      if (seconds === 0) {
        if (state.status !== PomodoroState.BREAK && state.status !== PomodoroState.LONG_BREAK) {
            incrementPomodoro(); // Incrementa el contador solo al final de un ciclo completo
            changePomodoroStatus(state.currentPomodoro, PomodoroStatus.FINISHED);
            dispatch({ type: ActionKind.SET_POMODORO, payload: "" });
        }
        dispatch({ type: ActionKind.SWITCH });
        setTimerStatus(TimerStatus.NOT_STARTED);
      } else {
        interval = setInterval(() => {
          setSeconds((seconds) => seconds - 1);
        }, 1000);
      }
    } else if (timerStatus === TimerStatus.NOT_STARTED && seconds !== 0) {
      clearInterval(interval!);
    }
    return () => clearInterval(interval!);
  }, [timerStatus, seconds]);

  useEffect(() => {
    setSeconds(state.timer);
  }, [state.timer]);

  const radius = 120; // Nuevo radio
  const circumference = 2 * Math.PI * radius;
  const progress = (seconds / state.timer) * circumference;

  return (
    
      <View style={styles.container}>
        <View style={styles.status_container}>
          {Object.values(PomodoroState).map((status) => (
            <View
              key={status}
              style={[
                styles.status_box,
                state.status === status && styles.active_status,
              ]}
            >
              <Text>
                {status.charAt(0) +
                  status.slice(1).toLowerCase().replace("_", " ")}
              </Text>
            </View>
          ))}
        </View>
        {/* Fondo circular y temporizador en un contenedor */}

        <View style={styles.timerContainer}>
          <View style={styles.circle} />
          <Svg width={radius * 2 + 20} height={radius * 2 + 20}>
            <Circle
              stroke="#d7301f" // color del circulo
              fill="none"
              cx={radius + 10}
              cy={radius + 10}
              r={radius}
              strokeWidth="13"
            />
            <Circle
              stroke="#7f0000" // color del progreso
              fill="none"
              cx={radius - 30}
              cy={radius - 30}
              r={radius}
              strokeWidth="13"
              strokeDasharray={circumference}
              strokeDashoffset={progress}
              transform="rotate(180 110 110)"
            />
          </Svg>
          <Text style={styles.timer}>{formatTime(seconds)}</Text>
        </View>
        {/* Contenedor de botones */}

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => {
            if (state.currentPomodoro) {
              scoreDistraccion(state.currentPomodoro, DisctractionType.INTERNAL);
            } else {
              console.warn("No active Pomodoro to record internal distraction.");
            }
            }}>
            <Entypo name="emoji-neutral" size={24} color="black" />
          </TouchableOpacity>
        
          <TouchableOpacity style={styles.button} onPress={toggle}>
            <Text style={styles.textButton}>
              {" "}
              {timerStatus === TimerStatus.NOT_STARTED ? "    Iniciar" : 
              timerStatus === TimerStatus.IN_PROGRESS ? "   Pausar" : "Reanudar"}{" "}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={reset}>
            <Text style={styles.textButton}>  Cancelar</Text>
          </TouchableOpacity> 

          <TouchableOpacity onPress={() => {
            if (state.currentPomodoro) {
              scoreDistraccion(state.currentPomodoro, DisctractionType.EXTERNAL);
            } else {
              console.warn("No active Pomodoro to record distraction.");
            }
            }}>
            <Entypo name="emoji-sad" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fee8c8", //fondo de toda la app-si pongo backgroun quitar
  },
  timerContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10, // Espacio para los botones
    //backgroundColor: 'yellow',
  },
  timer: {
    position: "absolute",
    fontSize: 60,
    top: "35%",
    color: "#fee8c8",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    height: "15%",
  },
  button: {
    backgroundColor: "#ef6548",
    marginHorizontal: 10,
    borderRadius: 5,
    marginBottom: 5,
    flex: 1,
    margin: 10,
    color: "red",
    alignContent: "center",
    justifyContent: "center",
    paddingHorizontal: 0,
    paddingVertical: 0,
    opacity: 0.8,
    shadowColor: "white",
    elevation: 5,
  },
  textButton: {
    color: "black", //texto Star Reset
    fontSize: 15,
  },

  circle: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "#ef6548", // Fondo del circulo
  },
  status_container: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
    marginBottom: 20,
  },
  status_box: {
    //backgroundColor: '#ef6548',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    marginBottom: 5,
    opacity: 0.8,
  },
  active_status: {
    backgroundColor: "#ef6548",
  },
  
  
});

export default CircularPomodoroTimer;
