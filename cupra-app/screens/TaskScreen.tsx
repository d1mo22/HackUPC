import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useThemeColor } from "../hooks/useThemeColor";

export default function TaskScreen() {
    const backgroundColor = useThemeColor({}, "background");
    const textColor = useThemeColor({}, "text");
    const accentColor = useThemeColor({}, "tint");

    // Sample task data (replace with actual data or props)
    const data = {
        todaysTasks: [
            { id: 1, title: "Task 1", points: 10, completed: false, icon: "📌" },
            { id: 2, title: "Task 2", points: 20, completed: true, icon: "✅" },
        ],
        completedTasks: [
            { id: 3, title: "Task 3", points: 15, completed: true, icon: "✅" },
        ],
    };

    const notCompletedTasks = data.todaysTasks.filter((task) => !task.completed);

    return (
        <ScrollView
            style={[styles.container, { backgroundColor }]}
            contentContainerStyle={styles.contentContainer}
        >
            <Text style={[styles.title, { color: textColor }]}>Your Tasks</Text>

            {/* Daily Tasks */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: accentColor }]}>
                    Daily Tasks
                </Text>
                {data.todaysTasks.map((task) => (
                    <View
                        key={task.id}
                        style={[
                            styles.taskCard,
                            task.completed && styles.taskCardCompleted,
                        ]}
                    >
                        <Text style={styles.taskIcon}>{task.icon}</Text>
                        <View style={styles.taskDetails}>
                            <Text style={[styles.taskTitle, { color: textColor }]}>
                                {task.title}
                            </Text>
                            <Text style={styles.taskPoints}>
                                +{task.points} points
                            </Text>
                        </View>
                        {task.completed && (
                            <Ionicons
                                name="checkmark-circle-outline"
                                size={20}
                                color={accentColor}
                            />
                        )}
                    </View>
                ))}
            </View>

            {/* Completed Tasks */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: accentColor }]}>
                    Completed Tasks
                </Text>
                {data.completedTasks.map((task) => (
                    <View key={task.id} style={styles.taskCard}>
                        <Text style={styles.taskIcon}>{task.icon}</Text>
                        <View style={styles.taskDetails}>
                            <Text style={[styles.taskTitle, { color: textColor }]}>
                                {task.title}
                            </Text>
                            <Text style={styles.taskPoints}>
                                +{task.points} points
                            </Text>
                        </View>
                        <Ionicons
                            name="checkmark-circle-outline"
                            size={20}
                            color={accentColor}
                        />
                    </View>
                ))}
            </View>

            {/* Not Completed Tasks */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: accentColor }]}>
                    Not Completed Tasks
                </Text>
                {notCompletedTasks.map((task) => (
                    <View key={task.id} style={styles.taskCard}>
                        <Text style={styles.taskIcon}>{task.icon}</Text>
                        <View style={styles.taskDetails}>
                            <Text style={[styles.taskTitle, { color: textColor }]}>
                                {task.title}
                            </Text>
                            <Text style={styles.taskPoints}>
                                +{task.points} points
                            </Text>
                        </View>
                        <Ionicons
                            name="close-circle-outline"
                            size={20}
                            color="red"
                        />
                    </View>
                ))}
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
        backgroundColor: "#333",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
    },
    taskCardCompleted: {
        borderLeftWidth: 4,
        borderLeftColor: "#CFA56C",
    },
    taskIcon: {
        fontSize: 24,
        marginRight: 16,
    },
    taskDetails: {
        flex: 1,
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    taskPoints: {
        fontSize: 14,
        color: "#CFA56C",
    },
});