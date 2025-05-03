import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import FeatureDetailScreen from "../../screens/FeatureDetailScreen";

export default function FeatureDetailRoute() {
    const { featureId } = useLocalSearchParams<{ featureId: string }>();
    const navigation = useNavigation();


    return <FeatureDetailScreen featureId={featureId} />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
