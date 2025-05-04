import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface RewardCardProps {
  title: string;
  description: string;
  xpRequired: number;
  claimed: boolean;
  onClaim: () => void;
  accentColor: string;
  textColor: string;
}

export default function RewardCard({
  title,
  description,
  xpRequired,
  claimed,
  onClaim,
  accentColor,
  textColor,
}: RewardCardProps) {
  return (
    <View style={[styles.card, { borderColor: accentColor }]}>
      <View style={styles.cardContent}>
        <Ionicons
          name={claimed ? "checkmark-circle" : "gift"}
          size={32}
          color={accentColor}
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: textColor }]}>{title}</Text>
          <Text style={[styles.description, { color: textColor }]}>
            {description}
          </Text>
          <Text style={[styles.xpRequired, { color: textColor }]}>
            XP Requerida: {xpRequired}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[
          styles.claimButton,
          { backgroundColor: claimed ? "#666" : "#003e51" },
        ]}
        disabled={claimed}
        onPress={onClaim}
      >
        <Text
          style={[
            styles.claimButtonText,
            { color: claimed ? "#aaa" : "#FFFFFF" },
          ]}
        >
          {claimed ? "Reclamada" : "Reclamar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    marginVertical: 4,
  },
  xpRequired: {
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
});