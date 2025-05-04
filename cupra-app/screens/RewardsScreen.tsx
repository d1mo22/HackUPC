import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { Typography } from "../constants/Typography";
import tasks from "../data/tasks.json"; // Import tasks from tasks.json
import { useThemeColor } from "../hooks/useThemeColor";
import { useUserData } from "../hooks/useUserData"; // Importar el hook de datos de usuario

interface Reward {
  id: string;
  title: string;
  description: string;
  xpRequired: number;
  claimed: boolean;
}

const initialRewards: Reward[] = [
  { id: "1", title: "Lavado de Coche Gratis", description: "consigue un lavado de coche gratuito!", xpRequired: 20, claimed: false },
  { id: "2", title: "Descuento de combustible", description: "5% de descuento en tu próxima compra de combustible.", xpRequired: 100, claimed: false },
  { id: "3", title: "Cubridores de Asiento Personalizables", description: "Mejora el interior de tu auto", xpRequired: 150, claimed: false },
];

export default function RewardsScreen() {
  const [xp, setXp] = useState(0); // Replace with actual XP from tasks
  const [streak, setStreak] = useState(3); // Replace with actual streak data
  const [rewards, setRewards] = useState(initialRewards);
  const { userData } = useUserData();

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const accentColor = useThemeColor({}, "tint");

// Obtenemos las dimensiones de la pantalla
  const { width } = useWindowDimensions();
  const isMobile = width <= 850; // Consideramos móvil cuando es menor o igual a 768px

  const claimReward = (rewardId: string) => {
    setRewards((prevRewards) =>
      prevRewards.map((reward) =>
        reward.id === rewardId ? { ...reward, claimed: true } : reward
      )
    );
  };

  // Agrupa todos los colores del tema al inicio del componente
          const taskCompletedColor = useThemeColor({}, "taskCompleted");
          const taskDisabledColor = useThemeColor({}, "taskDisabled");
          const contrastHighlight = useThemeColor({}, "contrastHighlight");
          const backgroundVariant = useThemeColor({}, "backgroundVariant")
          const xpEarned = tasks.allTasks
          .filter((task) => task.completed)
          .reduce((total, task) => total + task.points, 0);
  useEffect(() => {
    // Simulate fetching XP and streak data
    setXp(xpEarned); // Replace with actual XP calculation
    setStreak(userData?.rachaActual); // Replace with actual streak calculation
  }, []);

  return (
    <ScrollView style={[styles.container, { backgroundColor, paddingHorizontal: isMobile ? 0 : 25  }]
    } contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
              <View style={styles.headerTitle}>
                <Text
                  style={[
                    styles.greeting,
                    { color: textColor, fontFamily: Typography.fonts.title },
                  ]}
                >
                  ¡Recompensas!
                </Text>
                <Text
                  style={[
                    styles.subtitle,
                    { color: textColor, fontFamily: Typography.fonts.regular },
                  ]}
                >
                  Obtiene recompensas por completar tareas y mantener rachas.
                </Text>
              </View>
            </View>

      {/* XP and Streak Section */}
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Ionicons name="star" size={48} color={accentColor} /> {/* Increased icon size */}
          <Text style={[styles.statText, { color: textColor }]}>XP: {xp}</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="flame" size={48} color={accentColor} /> {/* Increased icon size */}
          <Text style={[styles.statText, { color: textColor }]}>
            Racha: {streak} días
          </Text>
        </View>
      </View>

      {/* Rewards Section */}
      <View style={styles.rewardsContainer}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          Recompensas disponibles
        </Text>
        {rewards.map((reward) => (
          <View
            key={reward.id}
            style={[
              styles.rewardCard,
              reward.claimed ? styles.rewardCardClaimed: styles.rewardCardUnclaimed,
              reward.claimed
                                            ? {backgroundColor : taskCompletedColor}
                                            : {backgroundColor : taskDisabledColor},
              reward.claimed
                                            ? {borderColor : contrastHighlight}
                                            : {borderColor : accentColor},
            ]}
          >
            <Text style={[styles.rewardTitle, { color: textColor }]}>
              {reward.title}
            </Text>
            <Text style={[styles.rewardDescription, { color: textColor }]}>
              {reward.description}
            </Text>
            <Text style={[styles.rewardXp, { color: textColor }]}>
              XP Requerida: {reward.xpRequired}
            </Text>
            <TouchableOpacity
              style={[
                styles.claimButton,
                { backgroundColor: reward.claimed ? backgroundVariant : contrastHighlight},
                { color: reward.claimed || xp < reward.xpRequired ? "#aaa" : accentColor },
              ]}
              disabled={reward.claimed || xp < reward.xpRequired}
              onPress={() => claimReward(reward.id)}
            >
              <Text
                style={[
                  styles.claimButtonText,
                  { color: reward.claimed || xp < reward.xpRequired ? "#aaa" : accentColor },
                ]}
              >
                {reward.claimed ? "Reclamada" : "Reclamar"}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Missions Section */}
      <View style={styles.missionsContainer}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          Misiones
        </Text>
        {/* 7-day streak mission */}
        <View style={[styles.missionCard, { backgroundColor: taskCompletedColor, borderColor: contrastHighlight }]}>
          <Text style={[styles.missionTitle, { color: textColor }]}>
          Mantiene una racha de 7 días
          </Text>
          <Text style={[styles.missionDescription, { color: textColor }]}>
            Obtiene 20 XP bonus por mantener una racha de 7 días.
          </Text>
        </View>

        {/* 15-day streak mission */}
        <View style={[styles.missionCard, { backgroundColor: taskCompletedColor, borderColor: contrastHighlight }]}>
          <Text style={[styles.missionTitle, { color: textColor }]}>
            Mantiene una racha de 15 días
          </Text>
          <Text style={[styles.missionDescription, { color: textColor }]}>
          Obtiene 100 XP bonus por mantener una racha de 15 días.
          </Text>
        </View>

        {/* 30-day streak mission */}
        <View style={[styles.missionCard, { backgroundColor: taskCompletedColor, borderColor: contrastHighlight }]}>
          <Text style={[styles.missionTitle, { color: textColor }]}>
          Mantiene una racha de 30 días
          </Text>
          <Text style={[styles.missionDescription, { color: textColor }]}>
          Obtiene 150 XP bonus por mantener una racha de 30 días.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
		padding: 16,
	},
  header: {
    flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
		marginTop: 12,
  },
  headerTitle: {
		flex: 1,
	},
  
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
		opacity: 0.8,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 24, // Increased spacing between the stats section and other sections
  },
  stat: {
    alignItems: "center",
    marginHorizontal: 16, // Added horizontal spacing between XP and streak
  },
  statText: {
    marginTop: 12, // Increased spacing between the icon and text
    fontSize: 24, // Increased font size for better visibility
    fontWeight: "bold",
  },
  rewardsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  rewardCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  rewardDescription: {
    fontSize: 14,
    marginVertical: 8,
  },
  rewardXp: {
    fontSize: 14,
    fontWeight: "bold",
  },
  claimButton: {
    marginTop: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  claimButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  missionsContainer: {
    padding: 16,
  },
  missionCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  missionDescription: {
    fontSize: 14,
    marginTop: 8,
  },
  greeting: {
		fontSize: 28,
		fontWeight: "bold",
		marginBottom: 8,
	},
  rewardCardUnclaimed: {
    borderWidth: 3,
  },
  rewardCardClaimed: {
    borderWidth: 1,
  },
});