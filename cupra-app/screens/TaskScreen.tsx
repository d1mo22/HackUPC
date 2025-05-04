import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ProgressSection from "../components/ProgressSection";
import TaskCard from "../components/TaskCard";
import { Typography } from "../constants/Typography";
import tasks from "../data/tasks.json"; 
import { useThemeColor } from "../hooks/useThemeColor";
import { useTareas } from "../context/TareasContext";

export default function TaskScreen() {
    const backgroundColor = useThemeColor({}, "background");
    const textColor = useThemeColor({}, "text");
    const accentColor = useThemeColor({}, "tint");

    const currentDay = 3; // Arbitrary day variable
    const navigation = useNavigation();
    const { isTareaCompletada } = useTareas();

    // Crear una versión modificada de las tareas con el estado actualizado
    const updatedTasks = useMemo(() => {
        return tasks.allTasks.map(task => ({
            ...task,
            // Si la tarea tiene id 3, usar isTareaCompletada para verificar su estado
            completed: task.id === 3 ? isTareaCompletada(3) : task.completed
        }));
    }, [isTareaCompletada]);

    // Map numeric levels to their corresponding names
    const levelMapping: { [key: number]: string } = {
        0: "Introductorio",
        1: "Principiante",
        2: "Intermedio",
        3: "Avanzado",
        4: "Maestro",
        5: "Experto",
    };

    // Agrupar las tareas actualizadas por nivel
    const tasksByLevel = updatedTasks.reduce<Record<string, typeof tasks.allTasks>>((acc, task) => {
        const levelName = levelMapping[task.level] || `Nivel ${task.level}`;
        if (!acc[levelName]) acc[levelName] = [];
        acc[levelName].push(task);
        return acc;
    }, {});

    // Filtrar tareas de hoy con el estado actualizado
    const todaysTasks = updatedTasks.filter((task) => task.day === currentDay);

    // Calcular progreso con el estado actualizado
    const totalTasks = updatedTasks.length;
    const completedTasks = updatedTasks.filter((task) => task.completed).length;
    const progress = totalTasks > 0 ? completedTasks / totalTasks : 0;

    // Calcular XP ganada con el estado actualizado
    const xpEarned = updatedTasks
        .filter((task) => task.completed)
        .reduce((total, task) => total + task.points, 0);



    return (
        <ScrollView
            style={[styles.container, { backgroundColor }]}
            contentContainerStyle={styles.contentContainer}
        >
            {/* Header con botón atrás */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
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

            {/* Sección de progreso */}
            <ProgressSection
                completedTasks={completedTasks}
                totalTasks={totalTasks}
                progress={progress}
                xpEarned={xpEarned}
                accentColor={accentColor}
                textColor={textColor}
            />

            {/* Tareas de hoy */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: accentColor }]}>
                    Tareas Diarias
                </Text>
                {todaysTasks.map((task) => (
                    <TaskCard
                        key={task.id}
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

            {/* Tareas por nivel */}
            {Object.keys(tasksByLevel).map((level) => (
                <View key={level} style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: accentColor }]}>
                        Tareas de {level}
                    </Text>
                    {tasksByLevel[level].map((task) => (
                        <TaskCard
                            key={task.id}
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