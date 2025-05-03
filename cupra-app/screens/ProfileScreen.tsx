import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
	Image,
	ScrollView,
	StyleSheet,
	Switch,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { useThemeColor } from "../hooks/useThemeColor";

// Datos de ejemplo del usuario
export const userData = {
	name: "Carlos Martínez",
	email: "carlos.martinez@example.com",
	phone: "+34 612 345 678",
	profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
	memberSince: "Mayo 2023",
	vehicleModel: "CUPRA Formentor VZ",
	vehicleYear: "2023",
	vehiclePlate: "1234 ABC",
};

export default function ProfileScreen() {
	const [notifications, setNotifications] = useState(true);
	const [locationServices, setLocationServices] = useState(true);

	const backgroundColor = useThemeColor({}, "background");
	const textColor = useThemeColor({}, "text");
	const accentColor = useThemeColor({}, "tint");
	const cardBackground = useThemeColor({}, "background");

	const handleGoBack = () => {
		router.back();
	};

	const toggleNotifications = () =>
		setNotifications((previousState) => !previousState);
	const toggleLocationServices = () =>
		setLocationServices((previousState) => !previousState);

	return (
		<ScrollView style={[styles.container, { backgroundColor }]}>
			{/* Cabecera de perfil */}
			<View style={styles.header}>
				<View style={styles.profileImageContainer}>
					<Image
						source={{ uri: userData.profileImage }}
						style={styles.profileImage}
					/>
					<TouchableOpacity style={styles.editButton}>
						<Ionicons name="pencil" size={16} color="white" />
					</TouchableOpacity>
				</View>
				<Text style={[styles.userName, { color: textColor }]}>
					{userData.name}
				</Text>
				<Text style={[styles.memberSince, { color: textColor }]}>
					Miembro desde {userData.memberSince}
				</Text>
			</View>

			{/* Información del vehículo */}
			<View style={[styles.section, { backgroundColor: cardBackground }]}>
				<Text style={[styles.sectionTitle, { color: textColor }]}>
					Mi Vehículo
				</Text>
				<View style={styles.vehicleInfo}>
					<Ionicons
						name="car-sport"
						size={50}
						color={accentColor}
						style={styles.vehicleIcon}
					/>
					<View style={styles.vehicleDetails}>
						<Text style={[styles.vehicleModel, { color: textColor }]}>
							{userData.vehicleModel}
						</Text>
						<Text style={[styles.vehicleYear, { color: textColor }]}>
							{userData.vehicleYear}
						</Text>
						<Text style={[styles.vehiclePlate, { color: textColor }]}>
							Matrícula: {userData.vehiclePlate}
						</Text>
					</View>
				</View>
			</View>

			{/* Información de contacto */}
			<View style={[styles.section, { backgroundColor: cardBackground }]}>
				<Text style={[styles.sectionTitle, { color: textColor }]}>
					Información de contacto
				</Text>
				<View style={styles.contactItem}>
					<Ionicons name="mail" size={20} color={accentColor} />
					<Text style={[styles.contactText, { color: textColor }]}>
						{userData.email}
					</Text>
				</View>
				<View style={styles.contactItem}>
					<Ionicons name="call" size={20} color={accentColor} />
					<Text style={[styles.contactText, { color: textColor }]}>
						{userData.phone}
					</Text>
				</View>
			</View>

			{/* Configuración */}
			<View style={[styles.section, { backgroundColor: cardBackground }]}>
				<Text style={[styles.sectionTitle, { color: textColor }]}>
					Configuración
				</Text>
				<View style={styles.settingItem}>
					<Text style={[styles.settingText, { color: textColor }]}>
						Notificaciones
					</Text>
					<Switch
						trackColor={{ false: "#767577", true: "#2f95dc" }}
						thumbColor={notifications ? "#ffffff" : "#f4f3f4"}
						ios_backgroundColor="#3e3e3e"
						onValueChange={toggleNotifications}
						value={notifications}
					/>
				</View>
				<View style={styles.settingItem}>
					<Text style={[styles.settingText, { color: textColor }]}>
						Servicios de ubicación
					</Text>
					<Switch
						trackColor={{ false: "#767577", true: "#2f95dc" }}
						thumbColor={locationServices ? "#ffffff" : "#f4f3f4"}
						ios_backgroundColor="#3e3e3e"
						onValueChange={toggleLocationServices}
						value={locationServices}
					/>
				</View>
			</View>

			{/* Botones de acción */}
			<View style={styles.actionButtons}>
				<TouchableOpacity
					style={[styles.actionButton, { backgroundColor: accentColor }]}
					onPress={() => router.push("/(tabs)")}
				>
					<Ionicons
						name="help-circle"
						size={20}
						color="white"
						style={styles.buttonIcon}
					/>
					<Text style={styles.buttonText}>Soporte</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.actionButton, styles.logoutButton]}
					onPress={() => console.log("Cerrar sesión")}
				>
					<Ionicons
						name="log-out"
						size={20}
						color="white"
						style={styles.buttonIcon}
					/>
					<Text style={styles.buttonText}>Cerrar Sesión</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	header: {
		alignItems: "center",
		marginVertical: 20,
	},
	profileImageContainer: {
		position: "relative",
		marginBottom: 16,
	},
	profileImage: {
		width: 100,
		height: 100,
		borderRadius: 50,
	},
	editButton: {
		position: "absolute",
		bottom: 0,
		right: 0,
		backgroundColor: "#2f95dc",
		width: 30,
		height: 30,
		borderRadius: 15,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 2,
		borderColor: "white",
	},
	userName: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 5,
	},
	memberSince: {
		fontSize: 14,
		opacity: 0.7,
	},
	section: {
		borderRadius: 10,
		padding: 16,
		marginVertical: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 3,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 16,
	},
	vehicleInfo: {
		flexDirection: "row",
		alignItems: "center",
	},
	vehicleIcon: {
		marginRight: 16,
	},
	vehicleDetails: {
		flex: 1,
	},
	vehicleModel: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 4,
	},
	vehicleYear: {
		fontSize: 16,
		marginBottom: 4,
	},
	vehiclePlate: {
		fontSize: 14,
		opacity: 0.8,
	},
	contactItem: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
	},
	contactText: {
		fontSize: 16,
		marginLeft: 10,
	},
	settingItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 8,
	},
	settingText: {
		fontSize: 16,
	},
	actionButtons: {
		marginVertical: 20,
	},
	actionButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 15,
		borderRadius: 10,
		marginBottom: 10,
	},
	logoutButton: {
		backgroundColor: "#ff3b30",
	},
	buttonIcon: {
		marginRight: 8,
	},
	buttonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "600",
	},
});
