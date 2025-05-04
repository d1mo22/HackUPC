import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ProgressSection from "../components/ProgressSection";
import TaskCard from "../components/TaskCard";
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

    // Map numeric levels to their corresponding names
    const levelMapping = {
        0: "Introductorio",
        1: "Principiante",
        2: "Intermedio",
        3: "Avanzado",
        4: "Maestro",
        5: "Experto",
    };

    // Group tasks by level
    const tasksByLevel = tasks.allTasks.reduce((acc, task) => {
        const levelName = levelMapping[task.level] || `Nivel ${task.level}`;
        if (!acc[levelName]) acc[levelName] = [];
        acc[levelName].push(task);
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
                    <TaskCard
                        id={task.id}
                        title={task.title}
                        points={task.points}
                        completed={task.completed}
                        icon={task.icon}
                        day={task.day}
                        currentDay={currentDay}
                        targetLevel={task.targetLevel}
                    />
                ))}
            </View>

            {/* Tasks by Level */}
            {Object.keys(tasksByLevel).map((level) => (
                <View key={level} style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: accentColor }]}>
                        Tareas de {level}
                    </Text>
                    {tasksByLevel[level].map((task) => (
                        <TaskCard
                            id={task.id}
                            title={task.title}
                            points={task.points}
                            completed={task.completed}
                            icon={task.icon}
                            day={task.day}
                            currentDay={currentDay}
                            targetLevel={task.targetLevel}
                        />
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
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
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
});