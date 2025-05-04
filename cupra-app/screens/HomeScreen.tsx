import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	View,
	useWindowDimensions
} from "react-native";
import FeatureCard from "../components/FeatureCard";
import ProgressSection from "../components/ProgressSection";
import TaskCard from "../components/TaskCard";
import { Typography } from "../constants/Typography";
import tasks from "../data/tasks.json"; // Import tasks from tasks.json
import { useThemeColor } from "../hooks/useThemeColor";
import { useUserData } from "../hooks/useUserData"; // Importar el hook de datos de usuario

// Define el tipo de navegación
type NavigationProps = StackNavigationProp<{
	Home: undefined;
	FeatureDetail: { featureId: string };
	Profile: undefined;
	TaskScreen: undefined;
}>;

// Importar los datos de características
import features from "../data/features.json";

export default function HomeScreen() {
	// Obtener datos del usuario
	const { userData } = useUserData();
	console.log("userData", userData);

	// Especifica el tipo genérico en useNavigation
	const navigation = useNavigation<NavigationProps>();

	const [loading, setLoading] = useState(true);
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [dailyFeature, setDailyFeature] = useState<any>(null);
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [otherFeatures, setOtherFeatures] = useState<any[]>([]);

	// Calcular días restantes basados en la fecha de creación
	const calculateDaysRemaining = () => {
		console.log("Fecha de creacion:", userData?.fechaCreacion);
		if (!userData?.fechaCreacion) return 30; // Valor por defecto si no hay fecha

		// Fecha desde la que empezamos a contar (fecha de creación)
		const startDate = new Date(userData.fechaCreacion);

		// Fecha objetivo (30 días después de la fecha de creación)
		const targetDate = new Date(startDate);
		targetDate.setDate(targetDate.getDate() + 30);

		// Fecha actual
		const currentDate = new Date();

		// Calcular diferencia en milisegundos
		const timeDiff = targetDate.getTime() - currentDate.getTime();

		// Convertir a días y redondear hacia abajo
		const daysRemaining = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

		// Retornar máximo entre 0 y los días calculados
		return Math.max(0, daysRemaining);
	};

	const [daysRemaining, setDaysRemaining] = useState(calculateDaysRemaining());

	// Obtenemos las dimensiones de la pantalla
	const { width } = useWindowDimensions();
	const isMobile = width <= 850; // Consideramos móvil cuando es menor o igual a 768px

	// Agrupa todos los colores del tema al inicio del componente
	const backgroundColor = useThemeColor({}, "background");
	const textColor = useThemeColor({}, "text");
	const accentColor = useThemeColor({}, "tint");
	const cardColor = useThemeColor({}, "card");
	const cardBackgroundColor = useThemeColor({}, "cardBackground");
	const cardAccentColor = useThemeColor({}, "cardAccent");

	const getItemWidth = (screenWidth: number) => {
		if (screenWidth <= 650) return "100%";
		if (screenWidth <= 900) return "48%";
		if (screenWidth <= 1200) return "31%";
		return "23%"; // 4 por fila en pantallas muy grandes
	};

	const currentDay = 3; // Arbitrary day variable
	const todaysTasks = tasks.allTasks.filter((task) => task.day === currentDay);

	// Calculate progress
	const totalTasks = tasks.allTasks.length;
	const completedTasks = tasks.allTasks.filter((task) => task.completed).length;
	const progress = completedTasks / totalTasks;

	// Calculate XP earned
	const xpEarned = tasks.allTasks
		.filter((task) => task.completed)
		.reduce((total, task) => total + task.points, 0);

	useEffect(() => {
		// Simular carga de datos
		setTimeout(() => {
			// Obtener características destacadas
			const featured = features.filter((feature) => feature.isFeatured);
			// Seleccionar una característica destacada aleatoria como característica diaria
			const randomIndex = Math.floor(Math.random() * featured.length);
			setDailyFeature(featured[randomIndex]);

			// Obtener el resto de características que no son la característica diaria
			setOtherFeatures(
				features.filter((feature) => feature.id !== featured[randomIndex].id),
			);

			setLoading(false);
		}, 1000);
	}, []);

	// Añadir un useEffect adicional para actualizar daysRemaining cuando cambie userData
	useEffect(() => {
		setDaysRemaining(calculateDaysRemaining());
	}, [userData]);

	const handleFeaturePress = (id: string) => {
		// Usar el router de Expo en lugar de React Navigation
		router.push({
			pathname: "/(tabs)/feature-detail",
			params: { featureId: id },
		});
	};

	const handleUserPress = () => {
		// Navegación al perfil de usuario
		navigation.navigate("Profile");
	};

	const handleSeeAllPress = () => {
		router.push({
			pathname: "/(tabs)/task-list"
		});
	};

	const completeTask = (taskId) => {
		setData((prevData) => ({
			...prevData,
			todaysTasks: prevData.todaysTasks.map((task) =>
				task.id === taskId ? { ...task, completed: true } : task,
			),
			completedTasks: prevData.todaysTasks.find((t) => t.id === taskId)
				?.completed
				? prevData.completedTasks
				: prevData.completedTasks + 1,
		}));
	};

	if (loading) {
		return (
			<View style={[styles.loadingContainer, { backgroundColor }]}>
				<ActivityIndicator size="large" color={accentColor} />
			</View>
		);
	}

	return (
		<ScrollView
			style={[
				styles.container,
				{ backgroundColor, paddingHorizontal: isMobile ? 0 : 25 },
			]}
			contentContainerStyle={styles.contentContainer}
		>
			{/* Header con icono de usuario a la derecha */}
			<View style={styles.headerWithUser}>
				<View style={styles.headerTexts}>
					<Text
						style={[
							styles.greeting,
							{ color: textColor, fontFamily: Typography.fonts.title },
						]}
					>
						¡Descubre tu Cupra!
					</Text>
					<Text
						style={[
							styles.subtitle,
							{ color: textColor, fontFamily: Typography.fonts.regular },
						]}
					>
						Descubre las características de tu vehículo
					</Text>
				</View>
			</View>

			{/* Widget de días para recibir el coche */}
			<View style={styles.deliveryCountdownContainer}>
				<View
					style={[
						styles.deliveryCountdownBadge,
						{
							backgroundColor: accentColor,
							width: isMobile ? "80%" : "40%",
						},
					]}
				>
					<View style={styles.countdownTopRow}>
						<Ionicons
							name="time-outline"
							size={22}
							color="white"
							style={styles.clockIcon}
						/>
						<Text style={styles.deliveryCountdownText}>
							<Text style={styles.deliveryCountdownDays}>{daysRemaining}</Text>{" "}
							días para recibir tu CUPRA
						</Text>
					</View>
				</View>

				{/* Miniatura del coche separada del contador */}
				<View style={styles.carImageWrapper}>
					<Image
						source={require("../assets/images/cupra-tavascan-side-view.png")}
						style={styles.carImage}
						resizeMode="contain"
					/>
					<Text style={[styles.modelName, { color: textColor }]}>
						CUPRA TAVASCAN
					</Text>
				</View>
			</View>

			{/* TODAY'S TASKS Section */}
			<View
				style={[
					styles.tasksContainer,
					{ backgroundColor: cardColor }, // Usar la variable en lugar de la función
				]}
			>
				<View style={styles.tasksHeader}>
					<View style={styles.tasksTitle}>
						<Ionicons name="calendar-outline" size={20} color={accentColor} />
						<Text
							style={[
								styles.tasksTitleText,
								{ color: textColor }, // Usar el color de texto del tema
							]}
						>
							TAREAS DIARIAS
						</Text>
					</View>
					<View style={styles.tasksSeeAll}>
						<Text
							style={[
								styles.tasksSeeAllText,
								{ color: accentColor }, // Usar el color de acento del tema
							]}
							onPress={handleSeeAllPress}
						>
							Ver Todas	
						</Text>
						<Ionicons
							name="chevron-forward-outline"
							size={16}
							color={accentColor}
						/>
					</View>
				</View>

				{todaysTasks.map((task) => (
					<TaskCard
						key={task.id}
									id = {task.id}
									title={task.title}
									points={task.points}
									completed={task.completed}
									day={task.day}
									currentDay={currentDay}
									targetLevel= {task.targetLevel}
								/>
								))}
			</View>

			<View
				style={[
					styles.streakContainer,
					{ backgroundColor: cardColor }, // Opcional: añadir fondo a la sección de racha
				]}
			>
				<Ionicons name="flame-outline" size={24} color={accentColor} />
				<Text
					style={[
						styles.streakText,
						{ color: textColor }, // Usar color de texto del tema
					]}
				>
					Tienes una {" "}
					<Text style={[styles.streakHighlight, { color: accentColor }]}>
						racha de {userData?.rachaActual} días
					</Text>
					!
				</Text>
			</View>

			{/* Progress Section */}
            <ProgressSection
                completedTasks={completedTasks}
                totalTasks={totalTasks}
                progress={progress}
                xpEarned={xpEarned}
                accentColor={accentColor}
                textColor={textColor}
            />

			{/* Daily Feature en la parte superior */}
			<View
				style={[
					styles.dailyFeatureContainer,
					{
						alignSelf: "center", // Centrar el contenido horizontalmente
						width: "100%",
						maxWidth: 750,
						minWidth: 320,
					},
				]}
			>
				<Text
					style={[
						styles.sectionTitle,
						{
							color: textColor,
							fontFamily: Typography.fonts.title,
							textAlign: "center", // Centrar el texto
						},
					]}
				>
					Característica del día
				</Text>
				{dailyFeature && (
					<View
						style={{
							width: isMobile ? "100%" : "80%", // Menos ancho en escritorio
							overflow: "hidden", // Evitar que el contenido desborde
						}}
					>
						<FeatureCard
							id={dailyFeature.id}
							title={dailyFeature.title}
							description={dailyFeature.description}
							image={dailyFeature.image}
							category={dailyFeature.category}
							onPress={handleFeaturePress}
							isFeatured={true}
						/>
					</View>
				)}
			</View>

			{/* Resto de características */}
			<View
				style={[
					styles.otherFeaturesContainer,
					isMobile
						? { width: "100%" }
						: {
								width: "100%",
								maxWidth: 2000,
								minWidth: 320,
								alignSelf: "center",
							},
				]}
			>
				<Text
					style={[
						styles.sectionTitle,
						{
							color: textColor,
							fontFamily: Typography.fonts.title,
						},
					]}
				>
					Otras características
				</Text>
				<View style={styles.featuresGrid}>
					{otherFeatures.map((feature) => (
						<View
							key={feature.id}
							style={[
								styles.featureCardWrapper,
								{ width: getItemWidth(width) }, // 48% para dejar un pequeño espacio entre tarjetas
							]}
						>
							<FeatureCard
								id={feature.id}
								title={feature.title}
								description={feature.description}
								image={feature.image}
								category={feature.category}
								onPress={handleFeaturePress}
							/>
						</View>
					))}
				</View>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	contentContainer: {
		padding: 16,
	},
	featuresGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		width: "100%",
	},
	featureCardWrapper: {
		marginBottom: 16,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	headerWithUser: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
		marginTop: 12,
	},
	headerTexts: {
		flex: 1,
	},
	greeting: {
		fontSize: 28,
		fontWeight: "bold",
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		opacity: 0.8,
	},
	deliveryCountdownContainer: {
		marginBottom: 20,
		alignItems: "center",
		width: "100%",
	},
	deliveryCountdownBadge: {
		paddingHorizontal: 18,
		paddingVertical: 14,
		borderRadius: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 6,
	},
	countdownTopRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	clockIcon: {
		marginRight: 10,
	},
	deliveryCountdownText: {
		color: "white",
		fontSize: 15,
		fontFamily: Typography.fonts.regular,
	},
	deliveryCountdownDays: {
		fontWeight: "bold",
		fontSize: 20,
		fontFamily: Typography.fonts.title,
	},
	carImageWrapper: {
		marginTop: 10,
		alignItems: "center",
		width: "100%",
	},
	carImage: {
		width: 240,
		height: 110,
	},
	modelName: {
		fontSize: 18,
		fontWeight: "bold",
		marginTop: 10,
		fontFamily: Typography.fonts.title,
		letterSpacing: 0.5,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 16,
	},
	dailyFeatureContainer: {
		marginBottom: 5,
		paddingVertical: 20,
		alignItems: "center",
		width: "100%",
	},
	otherFeaturesContainer: {
		marginBottom: 16,
		flexGrow: 1,
	},
	tasksContainer: {
		padding: 16,
		marginBottom: 20,
		borderRadius: 12,
	},
	tasksHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	tasksTitle: {
		flexDirection: "row",
		alignItems: "center",
	},
	tasksTitleText: {
		fontSize: 16,
		fontWeight: "bold",
		marginLeft: 8,
		fontFamily: Typography.fonts.title,
	},
	tasksSeeAll: {
		flexDirection: "row",
		alignItems: "center",
	},
	tasksSeeAllText: {
		fontSize: 14,
		marginRight: 4,
	},
	streakContainer: {
		marginTop: 30,
		alignItems: "center",
		marginBottom: 20,
		padding: 16,
		borderRadius: 12,
	},
	streakText: {
		marginTop: 10,
		fontSize: 20,
		fontWeight: "bold",
		textAlign: "center",
		fontFamily: Typography.fonts.title,
	},
	streakHighlight: {
		fontWeight: "bold",
		textDecorationLine: "underline",
	},
});
