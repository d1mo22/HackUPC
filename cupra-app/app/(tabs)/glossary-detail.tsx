import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import GlossaryDetailScreen from "../../screens/GlossaryDetailScreen";

export default function GlossaryDetailRoute() {
    const { termId } = useLocalSearchParams<{ termId: string }>();
    
    return <GlossaryDetailScreen termId={termId} />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});