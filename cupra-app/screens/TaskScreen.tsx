import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ProgressSection from "../components/ProgressSection";
import { Typography } from "../constants/Typography";
import tasks from "../data/tasks.json"; // Import tasks from tasks.json
import { useThemeColor } from "../hooks/useThemeColor";

export default function TaskScreen() {
    const backgroundColor = useThemeColor({}, "background");
    const textColor = useThemeColor({}, "text");
    const accentColor = useThemeColor({}, "tint");

    const currentDay = 3; // Arbitrary day variable

    const navigation = useNavigation();

    // Filter tasks based on the current day
    const todaysTasks = tasks.allTasks.filter((task) => task.day === currentDay);

    // Group tasks by level
    const tasksByLevel = tasks.allTasks.reduce((acc, task) => {
        if (!acc[task.level]) acc[task.level] = [];
        acc[task.level].push(task);
        return acc;
    }, {});

    // Calculate progress
    const totalTasks = tasks.allTasks.length;
    const completedTasks = tasks.allTasks.filter((task) => task.completed).length;
    const progress = completedTasks / totalTasks;

    // Calculate XP earned
    const xpEarned = tasks.allTasks
        .filter((task) => task.completed)
        .reduce((total, task) => total + task.points, 0);

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor }]}
            contentContainerStyle={styles.contentContainer}
        >
            {/* Header with back button */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={handleGoBack}
                    style={styles.backButtonContainer}
                >
                    <Ionicons name="arrow-back" size={24} color={textColor} />
                </TouchableOpacity>
                <Text
                    style={[
                        styles.headerTitle,
                        { color: textColor, fontFamily: Typography.fonts.title },
                    ]}
                >
                    Tareas disponibles
                </Text>
            </View>

            {/* Progress Section */}
            <ProgressSection
                completedTasks={completedTasks}
                totalTasks={totalTasks}
                progress={progress}
                xpEarned={xpEarned}
                accentColor={accentColor}
                textColor={textColor}
            />

            {/* Today's Tasks */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: accentColor }]}>
                    Tareas Diarias
                </Text>
                {todaysTasks.map((task) => (
                    <TouchableOpacity
                        key={task.id}
                        style={[
                            styles.taskCard,
                            task.completed ? styles.taskCardCompleted : styles.taskCardDefault,
                        ]}
                        onPress={() => console.log(`Task ${task.id} pressed`)}
                        activeOpacity={0.7}
                    >
                        {/* Task Icon */}
                        <View style={styles.taskIconContainer}>
                            <Text style={styles.taskIconText}>{task.icon}</Text>
                            <View
                                style={[
                                    styles.taskCompletionIndicator,
                                    task.completed
                                        ? styles.taskCompletionIndicatorCompleted
                                        : styles.taskCompletionIndicatorDefault,
                                ]}
                            />
                        </View>

                        {/* Task Details */}
                        <View style={styles.taskDetails}>
                            <Text
                                style={[
                                    styles.taskTitle,
                                    task.completed ? styles.taskTitleCompleted : styles.taskTitleDefault,
                                ]}
                            >
                                {task.title}
                            </Text>
                            <View style={styles.taskMeta}>
                                <View style={styles.taskDueDay}>
                                <Text style={styles.taskDueDayLabel}>DÍA </Text>
                                    <View style={styles.taskDueDayBadge}>
                                        <Text style={styles.taskDueDayText}>{task.day}</Text>
                                    </View>
                                </View>
                                <View style={styles.taskPointsContainer}>
                                    <Text style={styles.taskPointsValue}>+{task.points}</Text>
                                    <Text style={styles.taskPointsLabel}>puntos</Text>
                                </View>
                            </View>
                        </View>

                        {/* Completion Status */}
                        <View style={styles.taskStatus}>
                            {task.completed ? (
                                <View style={styles.taskStatusBadgeCompleted}>
                                    <Text style={styles.taskStatusTextCompleted}>COMPLETADO</Text>
                                </View>
                            ) : (
                                <View style={styles.taskStatusBadgeDefault}>
                                    <Text style={styles.taskStatusTextDefault}>TODO</Text>
                                </View>
                            )}
                        </View>

                        {/* Completion Icon */}
                        <Ionicons
                            name={task.completed ? "checkmark-circle" : "ellipse-outline"}
                            size={20}
                            color={task.completed ? "#dbd3cb" : "#666"}
                            style={styles.taskCompletionIcon}
                        />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Tasks by Level */}
            {Object.keys(tasksByLevel).map((level) => (
                <View key={level} style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: accentColor }]}>
                        Tareas de nível {level}
                    </Text>
                    {tasksByLevel[level].map((task) => (
                        <TouchableOpacity
                            key={task.id}
                            style={[
                                styles.taskCard,
                                task.completed
                                    ? styles.taskCardCompleted
                                    : task.day <= currentDay
                                    ? styles.taskCardDefault
                                    : styles.taskCardDisabled,
                            ]}
                            onPress={() => console.log(`Task ${task.id} pressed`)}
                            disabled={task.day > currentDay}
                            activeOpacity={0.7}
                        >
                            {/* Task Icon */}
                            <View style={styles.taskIconContainer}>
                                <Ionicons
                                    name={task.completed ? "checkmark-circle" : "ellipse-outline"}
                                    size={24}
                                    color={task.completed ? "#4CAF50" : "#666"} // Green for completed, gray for others
                                />
                            </View>

                            {/* Task Details */}
                            <View style={styles.taskDetails}>
                                <Text
                                    style={[
                                        styles.taskTitle,
                                        task.completed
                                            ? styles.taskTitleCompleted
                                            : task.day > currentDay
                                            ? styles.taskTitleLocked
                                            : styles.taskTitleDefault,
                                    ]}
                                >
                                    {task.title}
                                </Text>
                                <View style={styles.taskMeta}>
                                    <View style={styles.taskDueDay}>
                                    <Text style={styles.taskDueDayLabel}>DÍA </Text>
                                        <View style={styles.taskDueDayBadge}>
                                            <Text style={styles.taskDueDayText}>
                                                {task.day}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.taskPointsContainer}>
                                        <Text style={styles.taskPointsValue}>
                                            +{task.points}
                                        </Text>
                                        <Text style={styles.taskPointsLabel}>puntos</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Completion Status */}
                            <View style={styles.taskStatus}>
                                {task.completed ? (
                                    <View style={styles.taskStatusBadgeCompleted}>
                                        <Text style={styles.taskStatusTextCompleted}>
                                            COMPLETADO
                                        </Text>
                                    </View>
                                ) : (
                                    <View style={styles.taskStatusBadgeDefault}>
                                        {task.day <= currentDay ?
                                        <Text style={styles.taskStatusTextDefault}>
                                            TODO
                                        </Text> :
                                        <Text style={styles.taskStatusTextDefault}>
                                            BLOQUEADO
                                        </Text>}
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            ))}
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
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
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
    taskCardDefault: {
        backgroundColor: "#1e1e1e",
        borderColor: "#444",
    },
    taskCardCompleted: {
        backgroundColor: "#1e1e1e",
        borderColor: "#dbd3cb",
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
    taskTitleDefault: {
        color: "#fff",
    },
    taskTitleCompleted: {
        color: "#dbd3cb",
    },
    taskTitleLocked: {
        color: "#888", // Dimmed text for locked tasks
    },
    taskPoints: {
        fontSize: 14,
        color: "#CFA56C", // Accent color for points
    },
    taskUnlockDay: {
        fontSize: 12,
        color: "#888",
        marginTop: 4,
        fontStyle: "italic",
    },
    taskCompletedBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#4CAF50", // Green badge for completed tasks
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    taskCompletedText: {
        color: "#fff",
        fontSize: 12,
        marginLeft: 4,
    },
    header: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	backButtonContainer: {
		padding: 8,
	},
	headerTitle: {
		fontSize: 18,
		marginLeft: 12,
		fontWeight: "bold",
	},
    progressSection: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 24,
    },
    progressCard: {
        flex: 1,
        marginRight: 8,
        backgroundColor: "#444",
        padding: 16,
        borderRadius: 8,
    },
    progressText: {
        fontSize: 14,
        marginBottom: 8,
    },
    progressBar: {
        height: 8,
        backgroundColor: "#666",
        borderRadius: 4,
        overflow: "hidden",
    },
    progressBarFill: {
        height: "100%",
        borderRadius: 4,
    },
    progressPercentage: {
        fontSize: 14,
        marginTop: 8,
        textAlign: "right",
    },
    xpCard: {
        backgroundColor: "#444",
        padding: 16,
        borderRadius: 8,
    },
    xpText: {
        fontSize: 14,
        fontWeight: "bold",
    },
    xpValue: {
        fontSize: 18,
        fontWeight: "bold",
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
        backgroundColor: "#dbd3cb",
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 4,
    },
    taskDueDayText: {
        color: "#1e1e1e",
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
        color: "#dbd3cb",
        fontSize: 14,
        fontWeight: "bold",
        marginRight: 4,
    },
    taskPointsLabel: {
        color: "#888",
        fontSize: 12,
    },
    taskStatus: {
        marginLeft: 12,
    },
    taskStatusBadgeDefault: {
        backgroundColor: "#444",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    taskStatusBadgeCompleted: {
        backgroundColor: "#dbd3cb",
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
        color: "#1e1e1e",
        fontSize: 12,
        fontWeight: "bold",
    },
    taskCompletionIcon: {
        marginLeft: 12,
    },
    
});