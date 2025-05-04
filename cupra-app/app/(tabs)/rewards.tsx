import React from "react";
import { StyleSheet, View } from "react-native";
import RewardsScreen from "../../screens/RewardsScreen";

export default function Rewards() {
    return (
        <View style={styles.container}>
            <RewardsScreen/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
});
