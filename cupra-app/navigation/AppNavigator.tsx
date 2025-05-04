import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { StyleSheet } from "react-native";

import FeatureDetailScreen from "../screens/FeatureDetailScreen";
import GlossaryScreen from "../screens/GlossaryScreen";
// Importar pantallas
import HomeScreen from "../screens/HomeScreen";
import LearningGameScreen from "../screens/LearningGameScreen";
import POIScreen from "../screens/POIScreen";
import { default as RewardsScreen, default as SearchScreen } from "../screens/SearchScreen";
import TaskScreen from "../screens/TaskScreen";

// Importar tema
import { useThemeColor } from "../hooks/useThemeColor";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack del Home
function HomeStack() {
	const headerBackgroundColor = useThemeColor({}, "background");
	const headerTintColor = useThemeColor({}, "text");

	return (
		<Stack.Navigator
			screenOptions={{
				headerStyle: { backgroundColor: headerBackgroundColor },
				headerTintColor: headerTintColor,
				headerTitleStyle: { fontWeight: "bold" },
			}}
		>
			<Stack.Screen
				name="Home"
				component={HomeScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="FeatureDetail"
				component={FeatureDetailScreen}
				options={{ title: "Detalle" }}
			/>
			<Stack.Screen
				name="TaskScreen"
				component={TaskScreen}
				options={{ title: "Tasks" }}
			 />
			<Stack.Screen
				name="LearningGame"
				component={LearningGameScreen}
				options={{ title: "Learning Game" }}
			/>
		</Stack.Navigator>
	);
}

export default function AppNavigator() {
	const tabBackgroundColor = useThemeColor({}, "background");
	const tabActiveTintColor = useThemeColor({}, "tint");
	const tabInactiveTintColor = useThemeColor({}, "tabIconDefault");

	return (
		<NavigationContainer>
			<Tab.Navigator
				screenOptions={{
					tabBarStyle: [styles.tabBar, { backgroundColor: tabBackgroundColor }],
					tabBarActiveTintColor: tabActiveTintColor,
					tabBarInactiveTintColor: tabInactiveTintColor,
					tabBarShowLabel: true,
					tabBarLabelStyle: styles.tabBarLabel,
					headerStyle: { backgroundColor: tabBackgroundColor },
					headerTintColor: useThemeColor({}, "text"),
				}}
			>
				<Tab.Screen
					name="HomeTab"
					component={HomeStack}
					options={{
						tabBarLabel: "Inicio",
						headerShown: false,
						tabBarIcon: ({ color, size }) => (
							<Ionicons name="home" size={size} color={color} />
						),
					}}
				/>
				<Tab.Screen
					name="Search"
					component={SearchScreen}
					options={{
						tabBarLabel: "Buscar",
						title: "Buscar",
						tabBarIcon: ({ color, size }) => (
							<Ionicons name="search" size={size} color={color} />
						),
					}}
				/>
				<Tab.Screen
					name="POI"
					component={POIScreen}
					options={{
						tabBarLabel: "Explorar",
						title: "Explorar",
						tabBarIcon: ({ color, size }) => (
							<Ionicons name="car-sport" size={size} color={color} />
						),
					}}
				/>
				<Tab.Screen
					name="Glossary"
					component={GlossaryScreen}
					options={{
						tabBarLabel: "Glosario",
						title: "Glosario",
						tabBarIcon: ({ color, size }) => (
							<Ionicons name="book" size={size} color={color} />
						),
					}}
				/>

				<Tab.Screen
					name="Rewards"
					component={RewardsScreen}
					options={{
						tabBarLabel: "Recompensas",
						title: "Recompensas",
						tabBarIcon: ({ color, size }) => (
							<Ionicons name="star" size={size} color={color} />
						),
					}}
				/>
				
			</Tab.Navigator>
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	tabBar: {
		elevation: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		borderTopWidth: 0,
		height: 60,
		paddingBottom: 5,
	},
	tabBarLabel: {
		fontSize: 12,
	},
});
