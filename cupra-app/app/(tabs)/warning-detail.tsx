import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import WarningDetailScreen from "../../screens/WarningDetailScreen";

export default function WarningDetailRoute() {
    const { warningId } = useLocalSearchParams<{ warningId: string }>();
    
    return <WarningDetailScreen warningId={warningId} />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});