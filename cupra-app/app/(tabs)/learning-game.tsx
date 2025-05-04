import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from 'react-native';
import LearningGameScreen from '../../screens/LearningGameScreen';

export default function LearningGameRoute() {
    const { levelId } = useLocalSearchParams<{ levelId: string }>();

    return (
        <View style={styles.container}>
            <LearningGameScreen levelId={levelId} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});