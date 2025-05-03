import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { Typography } from "../constants/Typography";
import { useThemeColor } from "../hooks/useThemeColor";

// Arreglo de niveles disponibles
const LEVELS = [
  {
    id: 1,
    title: "Piloto Novato",
    mission: "¿En que zona aproximada está el botón de arranque?",
    secondMission: "Enciende la bestia", // Nueva misión para la segunda parte
    image: { uri: "https://xlelknonfenpcsdiyglf.supabase.co/storage/v1/object/public/images//CUPRA%20TAVASCAN%20096.webp" },
    secondImage: { uri: "https://xlelknonfenpcsdiyglf.supabase.co/storage/v1/object/public/images//WhatsApp%20Image%202025-05-03%20at%2004.52.15.webp" },
    message: "¡Excelente! Has completado tu primera misión. El Tavascan responde a tu comando 🚀",
    touchableArea: {
      x: 0.55,
      y: 0.4,
      radius: 40,
    },
    secondTouchableArea: {
      x: 0.79,
      y: 0.67,
      radius: 20,
    }
  },
  {
    id: 2,
    title: "Conductor Intermedio",
    mission: "¿Dónde se cambia el modo de conducción?",
    secondMission: "Activa el modo Performance", // Nueva misión para la segunda parte
    image: { uri: "https://xlelknonfenpcsdiyglf.supabase.co/storage/v1/object/public/images//CUPRA%20TAVASCAN%20099.webp" },
    secondImage: { uri: "https://xlelknonfenpcsdiyglf.supabase.co/storage/v1/object/public/images//Info_panel.webp" },
    message: "¡Perfecto! Has activado el modo Sport. Siente la potencia y precisión del Tavascan ⚡",
    touchableArea: {
      x: 0.55,
      y: 0.1,
      radius: 30,
    },
    secondTouchableArea: {
      x: 0.67,
      y: 0.73,
      radius: 34,
    },
    imageScale: 1.2,
  },
  {
    id: 3,
    title: "Experto Tavascan",
    mission: "Personaliza la iluminación ambiental",
    secondMission: "Electrifica el ambiente", // Nueva misión para la segunda parte
    image: { uri: "https://xlelknonfenpcsdiyglf.supabase.co/storage/v1/object/public/images//multipanel.webp" },
    message: "¡Magnífico! Has electrificado el ambiente del Tavascan 🏆",
    touchableArea: {
      x: 0.73,
      y: 0.57,
      radius: 30,
    },
    imageScale: 1.3,
  }
];

export default function LearningGameScreen() {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLevel1Part2, setShowLevel1Part2] = useState(false); // Estado para la parte 2 del nivel 1
  const [showLevel2Part2, setShowLevel2Part2] = useState(false); // Estado para la parte 2 del nivel 2
  const [showLevel3Part2, setShowLevel3Part2] = useState(false); // Estado para la parte 2 del nivel 3
  
  const { width } = useWindowDimensions();
  const isMobile = width <= 850;

  // Theme colors
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const accentColor = useThemeColor({}, "tint");
  const cardColor = useThemeColor({}, "card");

  // Obtenemos el nivel actual
  const currentLevel = LEVELS[currentLevelIndex];
  
  // Verificar si estamos en un nivel específico
  const isLevel1 = currentLevelIndex === 0;
  const isLevel2 = currentLevelIndex === 1;
  const isLevel3 = currentLevelIndex === 2;
  const isLastLevel = currentLevelIndex === LEVELS.length - 1;

  // Obtener la misión actual basada en el nivel y la parte
  const getCurrentMission = () => {
    if (isLevel1 && showLevel1Part2 && currentLevel.secondMission) {
      return currentLevel.secondMission;
    }
    if (isLevel2 && showLevel2Part2 && currentLevel.secondMission) {
      return currentLevel.secondMission;
    }
    if (isLevel3 && showLevel3Part2 && currentLevel.secondMission) {
      return currentLevel.secondMission;
    }
    return currentLevel.mission;
  };

  const handleAreaPress = () => {
    if (showSuccess) return;

    // Caso especial para nivel 1, parte 1
    if (isLevel1 && !showLevel1Part2) {
      setShowLevel1Part2(true); // Cambiar a la parte 2 en lugar de completar
      return;
    }

    // Caso especial para nivel 2, parte 1
    if (isLevel2 && !showLevel2Part2) {
      setShowLevel2Part2(true); // Cambiar a la parte 2 en lugar de completar
      return;
    }

    // Caso especial para nivel 3, parte 1
    if (isLevel3 && !showLevel3Part2) {
      setShowLevel3Part2(true); // Cambiar a la parte 2 en lugar de completar
      return;
    }

    // Normal completion for other levels or level 1/2/3 part 2
    setShowSuccess(true);
    setCompleted(true);
  };

  const handleNextMission = () => {
    // Si hay más niveles disponibles
    if (currentLevelIndex < LEVELS.length - 1) {
      // Avanzamos al siguiente nivel
      setCurrentLevelIndex(currentLevelIndex + 1);
      // Reseteamos los estados para la nueva misión
      setShowSuccess(false);
      setCompleted(false);
      setShowLevel1Part2(false);
      setShowLevel2Part2(false);
      setShowLevel3Part2(false);
    } else {
      // Estamos en el último nivel, podríamos mostrar un mensaje de finalización
      console.log("¡Has completado todos los niveles disponibles!");
      // O reiniciar al primer nivel
      setCurrentLevelIndex(0);
      setShowSuccess(false);
      setCompleted(false);
      setShowLevel1Part2(false);
      setShowLevel2Part2(false);
      setShowLevel3Part2(false);
    }
  };

  // Determinar la imagen a mostrar según el nivel y parte
  const getImageSource = () => {
    if (isLevel1 && showLevel1Part2 && currentLevel.secondImage) {
      return currentLevel.secondImage;
    }
    if (isLevel2 && showLevel2Part2 && currentLevel.secondImage) {
      return currentLevel.secondImage;
    }
    if (isLevel3 && showLevel3Part2) {
      return { uri: "https://xlelknonfenpcsdiyglf.supabase.co/storage/v1/object/public/images//ambient_leds.webp" };
    }
    return currentLevel.image;
  };

  // Determinar la posición del área tocable según el nivel y parte
  const getTouchableAreaProps = () => {
    if (isLevel1 && showLevel1Part2 && currentLevel.secondTouchableArea) {
      return currentLevel.secondTouchableArea;
    }
    if (isLevel2 && showLevel2Part2 && currentLevel.secondTouchableArea) {
      return currentLevel.secondTouchableArea;
    }
    if (isLevel3 && showLevel3Part2) {
      return {
        x: 0.75,
        y: 0.72,
        radius: 35,
      };
    }
    return currentLevel.touchableArea;
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.levelBadge, { backgroundColor: accentColor }]}>
          Nivel {currentLevel.id}
        </Text>
        <Text style={[styles.levelTitle, { color: textColor, fontFamily: Typography.fonts.title }]}>
          {currentLevel.title}
        </Text>
      </View>
      
      <Text style={[styles.missionText, { color: textColor, fontFamily: Typography.fonts.regular }]}>
        Misión: "{getCurrentMission()}"
      </Text>
      
      <View style={[
        styles.imageContainer, 
        { 
          backgroundColor: cardColor,
          height: isLevel2 || isLevel3 ? 380 : 350
        }
      ]}>
        <Image
          source={getImageSource()}
          style={[
            styles.levelImage,
            (isLevel2 && showLevel2Part2) || isLevel3 ? {
              transform: [{ scale: currentLevel.imageScale || 1.0 }],
              marginTop: isLevel3 && !showLevel3Part2 ? -70 : -50,
            } : {}
          ]}
          resizeMode="contain"
        />
        
        {!showSuccess && (
          <TouchableOpacity
            style={[
              styles.touchableArea,
              {
                left: getTouchableAreaProps().x * width * (isMobile ? 0.9 : 0.7), 
                top: getTouchableAreaProps().y * 300,
                width: getTouchableAreaProps().radius * 2,
                height: getTouchableAreaProps().radius * 2,
                borderRadius: getTouchableAreaProps().radius,
                borderWidth: 0, 
                borderColor: "transparent", 
                backgroundColor: "transparent", 
              },
            ]}
            onPress={handleAreaPress}
          />
        )}
      </View>
      
      {showSuccess && (
        <View style={[styles.messageContainer, { backgroundColor: accentColor }]}>
          <Ionicons name="trophy" size={24} color="white" />
          <Text style={styles.successMessage}>{currentLevel.message}</Text>
        </View>
      )}
      
      {showSuccess && (
        <TouchableOpacity 
          style={[styles.nextMissionButton, { backgroundColor: accentColor }]} 
          onPress={handleNextMission}
        >
          <Text style={styles.nextMissionButtonText}>
            {!isLastLevel ? "SIGUIENTE MISIÓN" : "COMPLETAR CURSO"}
          </Text>
          <Ionicons 
            name={!isLastLevel ? "arrow-forward" : "checkmark-circle"} 
            size={18} 
            color="white" 
            style={styles.nextIcon} 
          />
        </TouchableOpacity>
      )}
      
      <View style={styles.instructionsContainer}>
        <Text style={[styles.instructions, { color: textColor, opacity: 0.7 }]}>
          {!showSuccess ? 
            (isLevel1 && !showLevel1Part2 ?
              "Toca donde está ubicado el botón de arranque" :
              isLevel1 && showLevel1Part2 ?
              "Toca el botón de encendido para arrancar el coche" : 
              isLevel2 && !showLevel2Part2 ?
              "Toca donde está el selector de modos de conducción" :
              isLevel2 && showLevel2Part2 ?
              "Activa el modo de conducción Sport para máximo rendimiento" :
              !showLevel3Part2 ?
              "Toca el botón de asistente de conducción" :
              "Haz que el ambiente sea electizante"
            ) 
            : "¡Misión completada!"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 20,
  },
  levelBadge: {
    color: "white",
    fontWeight: "bold",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 12,
  },
  levelTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  missionText: {
    fontSize: 18,
    marginBottom: 20,
  },
  imageContainer: {
    width: "100%",
    height: 350,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 0,
  },
  levelImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  touchableArea: {
    position: "absolute",
    backgroundColor: "transparent",
    borderWidth: 0,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  successMessage: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
  },
  instructionsContainer: {
    marginTop: 10,
    padding: 16,
    alignItems: "center",
  },
  instructions: {
    fontSize: 16,
    textAlign: "center",
  },
  nextMissionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nextMissionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  nextIcon: {
    marginLeft: 8,
  },
});