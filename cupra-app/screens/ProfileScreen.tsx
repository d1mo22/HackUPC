import UserStatsSection from '@/components/profile/UserStatsSection';
import { useThemeColor } from "@/hooks/useThemeColor";
import { useUserData } from "@/hooks/useUserData";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
	ActivityIndicator,
	Image,
	Linking,
	RefreshControl,
	ScrollView,
	StyleSheet,
	Switch,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

export default function ProfileScreen() {
	const [notifications, setNotifications] = useState(true);
	const [locationServices, setLocationServices] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	// Función para validar URL de imagen
	const getValidImageSource = (uri?: string) => {
		if (!uri || uri.trim() === '') {
			return { uri: 'https://randomuser.me/api/portraits/lego/1.jpg' };
		}
		
		// Verificar si la URI es válida
		try {
			// Valida si es una URL completa
			new URL(uri);
			return { uri };
		} catch (e) {
			// Si la URI no es una URL completa, puede ser una ruta relativa
			// o simplemente inválida
			if (uri.startsWith('/')) {
				// Asume que es una ruta relativa al servidor
				// Reemplaza esto con la base URL de tu servidor
				return { uri: `https://tu-servidor.com${uri}` };
			}
			return { uri: 'https://randomuser.me/api/portraits/lego/1.jpg' };
		}
	};

	// Obtener imagen de perfil
	const getProfileImage = () => {
		console.log("userData", userData);
		if (userData?.foto) {
			return { uri: userData.foto };
		}
	 	else {
			// Imagen de respaldo
			return { uri: 'https://randomuser.me/api/portraits/lego/1.jpg' };
		}
	};

	// Obtener colores del tema
	const backgroundColor = useThemeColor({}, "background");
	const textColor = useThemeColor({}, "text");
	const accentColor = useThemeColor({}, "tint");
	const cardBackground = useThemeColor({}, "background");

	// Usar el hook personalizado para obtener datos del usuario
	const { userData, loading, error, handleLogout, refreshUserData } =
		useUserData();

	// Función para manejar el pull-to-refresh
	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		refreshUserData();
		setRefreshing(false);
	}, [refreshUserData]);

	// Manipuladores de eventos
	const toggleNotifications = () =>
		setNotifications((previousState) => !previousState);
	const toggleLocationServices = () =>
		setLocationServices((previousState) => !previousState);

	// Manejar cierre de sesión
	const onLogout = async () => {
		const success = await handleLogout();
		if (success) {
			router.replace("/auth");
		}
	};

	// Mostrar pantalla de carga
	if (loading) {
		return (
			<View style={[styles.loadingContainer, { backgroundColor }]}>
				<ActivityIndicator size="large" color={accentColor} />
				<Text style={[styles.loadingText, { color: textColor }]}>
					Cargando perfil...
				</Text>
			</View>
		);
	}

	// Mostrar pantalla de error
	if (error || !userData) {
		return (
			<View style={[styles.errorContainer, { backgroundColor }]}>
				<Ionicons name="alert-circle" size={50} color="#ff3b30" />
				<Text style={[styles.errorText, { color: textColor }]}>
					{error || "No se pudo cargar el perfil"}
				</Text>
				<TouchableOpacity
					style={[styles.actionButton, { backgroundColor: accentColor }]}
					onPress={() => router.replace("/auth")}
				>
					<Text style={styles.buttonText}>Volver a iniciar sesión</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<ScrollView
			style={[styles.container, { backgroundColor }]}
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={onRefresh}
					tintColor={accentColor}
				/>
			}
		>
			{/* Cabecera de perfil */}
			<View style={styles.header}>
				<View style={styles.profileImageContainer}>
					<Image
						source={getProfileImage()}
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

			{/* Estadísticas del usuario */}
			<UserStatsSection 
				rachaActual={userData.rachaActual || 0}
				puntos={userData.puntos || 0}
				textColor={textColor}
				accentColor={accentColor}
				backgroundColor={cardBackground}
			/>

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
						trackColor={{ false: "#767577", true: accentColor }}
						thumbColor={notifications ? accentColor : "#ffffff"}
						ios_backgroundColor={cardBackground}
						onValueChange={toggleNotifications}
						value={notifications}
						style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
					/>
				</View>
				<View style={styles.settingItem}>
					<Text style={[styles.settingText, { color: textColor }]}>
						Servicios de ubicación
					</Text>
					<Switch
						trackColor={{ false: "#767577", true: accentColor }}
						thumbColor={locationServices ? accentColor : "#ffffff"}
						ios_backgroundColor={cardBackground}
						onValueChange={toggleLocationServices}
						value={locationServices}
						style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
					/>
				</View>
			</View>

			{/* Botones de acción */}
			<View style={styles.actionButtons}>
				<TouchableOpacity
					style={[styles.actionButton, { backgroundColor: accentColor }]}
					onPress={() => Linking.openURL('https://www.cupraofficial.es/contacto')}
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
					onPress={onLogout}
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
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	loadingText: {
		marginTop: 15,
		fontSize: 16,
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	errorText: {
		marginTop: 15,
		marginBottom: 20,
		fontSize: 16,
		textAlign: "center",
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
		marginVertical: 7,
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
