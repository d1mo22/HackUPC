import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook
import * as Asset from "expo-asset"; // Import Asset for copying bundled files
import * as FileSystem from "expo-file-system"; // Import FileSystem for file operations
import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { Typography } from "../constants/Typography";
import { useThemeColor } from "../hooks/useThemeColor";

import levels from "../data/levels.json";

interface Level {
  id: string;
  index: number;
  title: string;
  mission: string;
  secondMission: string;
  image: string;
  secondImage: string;
  message: string;
  touchableArea: Area;
  secondTouchableArea?: Area;
  imageScale: number;
}

interface Area {
  x: number;
  y: number;
  radius: number;
}

export default function LearningGameScreen({ levelId }: { levelId: string }) {
  const [level, setLevel] = useState<Level | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPart2, setShowPart2] = useState(false);

  const navigation = useNavigation(); // Initialize navigation

  const { width } = useWindowDimensions();
  const isMobile = width <= 850;

  // Theme colors
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const accentColor = useThemeColor({}, "tint");
  const cardColor = useThemeColor({}, "card");

  // Set header options dynamically
  useEffect(() => {
    navigation.setOptions({
      title: level ? `Nivel ${level.index}` : "Cargando...",
      headerStyle: { backgroundColor },
      headerTintColor: textColor,
      headerTitleStyle: { fontFamily: Typography.fonts.title, fontSize: 18 },
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, level, backgroundColor, textColor]);

  // Load the level based on the provided levelId
  useEffect(() => {
    setLoading(true);
    const foundLevel = levels.find((lvl) => lvl.id === levelId);
    if (foundLevel) {
      setLevel(foundLevel);
    } else {
      console.error(`Level with ID ${levelId} not found.`);
    }
    setLoading(false);
  }, [levelId]);

  // Ensure tasks.json is copied to a writable directory
  const ensureTasksFileExists = async () => {
    const tasksFilePath = FileSystem.documentDirectory + "tasks.json";

    if (Platform.OS === "web") {
      console.log("Web platform detected. File operations are not supported.");
      return; // Skip file operations on the web
    }

    const fileExists = await FileSystem.getInfoAsync(tasksFilePath);
    if (!fileExists.exists) {
      const asset = Asset.fromModule(require("../data/tasks.json"));
      await FileSystem.downloadAsync(asset.uri, tasksFilePath);
      console.log("tasks.json copied to writable directory.");
    }
  };

  // Call this function in a useEffect to ensure the file is ready
  useEffect(() => {
    ensureTasksFileExists();
  }, []);

  if (loading || !level) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={[styles.instructions, { color: textColor }]}>
          Loading...
        </Text>
      </View>
    );
  }

  const handleAreaPress = async () => {
    if (showSuccess) return;

    if (!showPart2 && level?.secondMission) {
      setShowPart2(true);
      return;
    }

    setShowSuccess(true);

    // Mark the level as completed
    if (level) {
      await updateTaskCompletion(level.id); // Update task completion
    }
  };

  const updateTaskCompletion = async (levelId: string) => {
    return;
  };

  const getCurrentMission = () => {
    return showPart2 && level.secondMission ? level.secondMission : level.mission;
  };

  const getImageSource = () => {
    return showPart2 && level.secondImage ? level.secondImage : level.image;
  };

  const getTouchableAreaProps = () => {
    return showPart2 && level.secondTouchableArea
      ? level.secondTouchableArea
      : level.touchableArea;
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.levelBadge, { backgroundColor: accentColor }]}>
          Nivel {level.id}
        </Text>
        <Text style={[styles.levelTitle, { color: textColor, fontFamily: Typography.fonts.title }]}>
          {level.title}
        </Text>
      </View>

      <Text style={[styles.missionText, { color: textColor, fontFamily: Typography.fonts.regular }]}>
        Misión: "{getCurrentMission()}"
      </Text>

      <View
        style={[
          styles.imageContainer,
          {
            backgroundColor: cardColor,
            height: 350,
          },
        ]}
      >
        <Image
          source={getImageSource()}
          style={styles.levelImage}
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
              },
            ]}
            onPress={handleAreaPress}
          />
        )}
      </View>

      {showSuccess && (
        <View style={[styles.messageContainer, { backgroundColor: accentColor }]}>
          <Ionicons name="trophy" size={24} color="white" />
          <Text style={styles.successMessage}>{level.message}</Text>
        </View>
      )}

      {showSuccess && (
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: accentColor }]}
          onPress={() => navigation.goBack()} // Navigate back
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      )}

      <View style={styles.instructionsContainer}>
        <Text style={[styles.instructions, { color: textColor, opacity: 0.7 }]}>
          {!showSuccess
            ? !showPart2
              ? "Toca el área indicada para completar la misión."
              : "Completa la segunda parte de la misión."
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
  backButtonContainer: {
    padding: 8,
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
  },
  levelImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  touchableArea: {
    position: "absolute",
    backgroundColor: "transparent",
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
  backButton: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
});