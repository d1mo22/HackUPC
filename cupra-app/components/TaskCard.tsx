import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useThemeColor } from "../hooks/useThemeColor";

interface TaskCardProps {
    id: number;
    title: string;
    points: number;
    completed: boolean;
    icon: string;
    day: number;
    currentDay: number;
    targetLevel: string;
}

const TaskCard: React.FC<TaskCardProps> = ({
    id,
    title,
    points,
    completed,
    icon,
    day,
    currentDay,
    targetLevel,
}) => {
    const navigation = useNavigation(); // Access navigation

    // Agrupa todos los colores del tema al inicio del componente
        const backgroundColor = useThemeColor({}, "background");
        const textColor = useThemeColor({}, "text");
        const accentColor = useThemeColor({}, "tint");
        const cardColor = useThemeColor({}, "card");
        const cardBackgroundColor = useThemeColor({}, "cardBackground");
        const cardAccentColor = useThemeColor({}, "cardAccent");
        const taskColor = useThemeColor({}, "task");
        const taskCompletedColor = useThemeColor({}, "taskCompleted");
        const taskDisabledColor = useThemeColor({}, "taskDisabled");
        const contrastHighlight = useThemeColor({}, "contrastHighlight");
        const contrastText = useThemeColor({}, "contrastText");
        const backgroundVariant = useThemeColor({}, "backgroundVariant")

    const handlePress = () => {
        router.push({
                pathname: "/(tabs)/learning-game",
                params: { levelId: targetLevel },
        }); // Navigate to LearningGameScreen
    };

    return (
        <TouchableOpacity
                                    key={id}
                                    style={[
                                        styles.taskCard,
                                        {borderColor : contrastHighlight}
                                        ,
                                        completed
                                            ? styles.taskCardCompleted
                                            : day <= currentDay
                                            ? styles.taskCard
                                            : styles.taskCardDisabled,
                                        completed
                                            ? {backgroundColor : taskCompletedColor}
                                            : day <= currentDay
                                            ? {backgroundColor : taskColor}
                                            : {backgroundColor : taskDisabledColor},
                                    ]}
                                    onPress={handlePress} // Use the new handler
                                    disabled={day > currentDay}
                                    activeOpacity={0.7}
                                >
                                    {/* Task Icon */}
                                    <View style={styles.taskIconContainer}>
                                        <Ionicons
                                            name={completed ? "checkmark-circle" : "ellipse-outline"}
                                            size={24}
                                            color={completed ? "#4CAF50" : "#666"} // Green for completed, gray for others
                                        />
                                    </View>
        
                                    {/* Task Details */}
                                    <View style={styles.taskDetails}>
                                        <Text
                                            style={[
                                                styles.taskTitle,
                                                {color : textColor}
                                            ]}
                                        >
                                            {title}
                                        </Text>
                                        <View style={styles.taskMeta}>
                                            <View style={styles.taskDueDay}>
                                            <Text style={styles.taskDueDayLabel}>DÍA </Text>
                                                <View style={[styles.taskDueDayBadge, {backgroundColor: contrastHighlight}]}>
                                                    <Text style={[styles.taskDueDayText, {color: contrastText}]}>
                                                        {day}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.taskPointsContainer}>
                                                <Text style={[styles.taskPointsValue, {color: contrastHighlight}]}>
                                                    +{points}
                                                </Text>
                                                <Text style={[styles.taskPointsLabel, {color : textColor}]}>puntos</Text>
                                            </View>
                                        </View>
                                    </View>
        
                                    {/* Completion Status */}
                                    <View style={styles.taskStatus}>
                                        {completed ? (
                                            <View style={[styles.taskStatusBadgeCompleted, {backgroundColor: contrastHighlight}]}>
                                                <Text style={[styles.taskStatusTextCompleted, {color: contrastText}]}>
                                                    COMPLETADO
                                                </Text>
                                            </View>
                                        ) : (
                                            <View style={[styles.taskStatusBadgeDefault, {backgroundColor : backgroundVariant}]}>
                                                {day <= currentDay ?
                                                <Text style={[styles.taskStatusTextDefault, {color: textColor}]}>
                                                    TODO
                                                </Text> :
                                                <Text style={[styles.taskStatusTextDefault, {color: textColor}]}>
                                                    BLOQUEADO
                                                </Text>}
                                            </View>
                                        )}
                                    </View>
                                </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    taskMeta: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 4,
    },
    taskDueDay: {
        flexDirection: "row",
        alignItems: "center",
    },
    taskDueDayBadge: {
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 4,
    },
    taskDueDayText: {
        fontSize: 12,
        fontWeight: "bold",
    },
    taskDueDayLabel: {
        color: "#888",
        fontSize: 12,
    },
    taskPointsContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    taskPointsValue: {
        fontSize: 14,
        fontWeight: "bold",
        marginRight: 4,
    },
    taskPointsLabel: {
        fontSize: 12,
    },
    taskStatus: {
        marginLeft: 12,
    },
    taskStatusBadgeDefault: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    taskStatusBadgeCompleted: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    taskStatusTextDefault: {
        color: "#888",
        fontSize: 12,
        fontWeight: "bold",
    },
    taskStatusTextCompleted: {
        fontSize: 12,
        fontWeight: "bold",
    },
    taskCompletionIcon: {
        marginLeft: 12,
    },
	taskIconContainer: {
        position: "relative",
        marginRight: 16,
    },
    taskCompletionIndicator: {
        position: "absolute",
        bottom: -2,
        right: -2,
        width: 8,
        height: 8,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: "#1e1e1e",
    },
    taskCompletionIndicatorDefault: {
        backgroundColor: "#666",
    },
    taskCompletionIndicatorCompleted: {
        backgroundColor: "#dbd3cb",
    },
    taskCompletionIndicatorLocked: {
        backgroundColor: "#444", // Gray indicator for locked tasks
    },
	taskTitleDefault: {
        color: "#fff",
    },
    taskTitleCompleted: {
        color: "#dbd3cb",
    },
    taskCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    taskCardCompleted: {
        borderWidth: 4,
    },
    taskCardDisabled: {
        backgroundColor: "#2c2c2c", // Subtle difference for locked tasks
        borderColor: "#444",
        opacity: 0.7,
    },
    taskIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#444", // Icon background
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    taskIconText: {
        fontSize: 20,
        color: "#fff", // White text for icons
    },
    taskDetails: {
        flex: 1,
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    taskTitleLocked: {
        color: "#888", // Dimmed text for locked tasks
    },
});
export default TaskCard;