import { StyleSheet, View } from 'react-native';
import LearningGameScreen from '../../screens/LearningGameScreen';

export default function LearningGameRoute() {
    return (
        <View style={styles.container}>
            <LearningGameScreen />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});