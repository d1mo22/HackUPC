import React from "react";
import { StyleSheet, View } from "react-native";
import TaskScreen from "../../screens/TaskScreen";

export default function TaskListRoute() {
    // Obtener el parámetro featureId de la URL
    return (
        <View style={styles.container}>
            <TaskScreen />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
