import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	Image,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	useWindowDimensions,
} from "react-native";
import CupraLogo from "../components/CupraLogo";
import { Typography } from "../constants/Typography";
import { useThemeColor } from "../hooks/useThemeColor";

export default function AuthScreen() {
	// Estados para manejar la alternancia entre inicio de sesión y registro
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [name, setName] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [isSmallScreen, setIsSmallScreen] = useState(false);

	// Obtener dimensiones para el diseño responsive
	const { width, height } = useWindowDimensions();
	const isMobile = width <= 850;

	// Actualizar el estado de pantalla pequeña cuando cambia el ancho
	useEffect(() => {
		setIsSmallScreen(width < 1000);
	}, [width]);

	// Acceder a los colores del tema
	const backgroundColor = useThemeColor({}, "background");
	const textColor = useThemeColor({}, "text");
	const accentColor = useThemeColor({}, "tint");
	const cardBackground = useThemeColor({}, "card");

	// Función para manejar el inicio de sesión/registro
	const handleAuth = () => {
		if (isLogin) {
			// Lógica de inicio de sesión
			console.log("Iniciar sesión con:", email, password);
			// En un caso real, aquí llamarías a tu API de autenticación

			// Por ahora, simplemente redirigimos a la HomeScreen
			router.replace("/(tabs)");
		} else {
			// Lógica de registro
			if (password !== confirmPassword) {
				alert("Las contraseñas no coinciden");
				return;
			}

			console.log("Registrar usuario:", name, email, password);
			// En un caso real, aquí llamarías a tu API de registro

			// Por ahora, simplemente redirigimos a la HomeScreen
			router.replace("/(tabs)");
		}
	};

	// Función para alternar entre inicio de sesión y registro
	const toggleAuthMode = () => {
		setIsLogin(!isLogin);
		// Limpiar campos al cambiar de modo
		setPassword("");
		setConfirmPassword("");
	};

	// Renderizar el campo de contraseña de manera adaptativa
	const renderPasswordField = (
		label,
		value,
		onChange,
		placeholder = "Introduce tu contraseña",
	) => (
		<View style={styles.inputGroup}>
			<Text
				style={[
					styles.inputLabel,
					{ color: textColor, fontFamily: Typography.fonts.regular },
				]}
			>
				{label}
			</Text>
			<View
				style={[
					styles.inputContainer,
					{
						borderColor: accentColor,
						// Ajustar altura para pantallas pequeñas
						height: isSmallScreen ? 60 : 50,
					},
				]}
			>
				<Ionicons
					name="lock-closed-outline"
					size={20}
					color={accentColor}
					style={styles.inputIcon}
				/>
				<TextInput
					style={[
						styles.input,
						{
							color: textColor,
							fontFamily: Typography.fonts.regular,
							height: isSmallScreen ? 60 : 50,
							// Reducir el ancho para dar espacio al icono
							width: isSmallScreen ? "80%" : "85%",
						},
					]}
					placeholder={placeholder}
					placeholderTextColor="#999"
					secureTextEntry={!passwordVisible}
					value={value}
					onChangeText={onChange}
				/>
				<TouchableOpacity
					style={[
						styles.passwordToggle,
						// Ajustar posición para pequeñas pantallas
						isSmallScreen && { position: "absolute", right: 10 },
					]}
					onPress={() => setPasswordVisible(!passwordVisible)}
				>
					<Ionicons
						name={passwordVisible ? "eye-off-outline" : "eye-outline"}
						size={20}
						color={accentColor}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);

	// Formulario como componente separado para reutilizarlo
	const AuthForm = () => (
		<View style={styles.formWrapper}>
			<View style={styles.desktopLogoContainer}>
				<CupraLogo width={220} height={100} />
			</View>

			<Text
				style={[
					styles.title,
					{ color: textColor, fontFamily: Typography.fonts.title },
				]}
			>
				{isLogin ? "Bienvenido de nuevo" : "Únete a la comunidad CUPRA"}
			</Text>

			<Text
				style={[
					styles.subtitle,
					{ color: textColor, fontFamily: Typography.fonts.regular },
				]}
			>
				{isLogin
					? "Inicia sesión para continuar con tu experiencia CUPRA"
					: "Crea una cuenta para descubrir todo lo que CUPRA tiene para ti"}
			</Text>

			<View style={[styles.formContainer, { backgroundColor: cardBackground }]}>
				{!isLogin && (
					<View style={styles.inputGroup}>
						<Text
							style={[
								styles.inputLabel,
								{ color: textColor, fontFamily: Typography.fonts.regular },
							]}
						>
							Nombre completo
						</Text>
						<View style={[styles.inputContainer, { borderColor: accentColor }]}>
							<Ionicons
								name="person-outline"
								size={20}
								color={accentColor}
								style={styles.inputIcon}
							/>
							<TextInput
								style={[
									styles.input,
									{
										color: textColor,
										fontFamily: Typography.fonts.regular,
									},
								]}
								placeholder="Introduce tu nombre"
								placeholderTextColor="#999"
								value={name}
								onChangeText={setName}
								autoComplete="off"
							/>
						</View>
					</View>
				)}

				<View style={styles.inputGroup}>
					<Text
						style={[
							styles.inputLabel,
							{ color: textColor, fontFamily: Typography.fonts.regular },
						]}
					>
						Correo electrónico
					</Text>
					<View style={[styles.inputContainer, { borderColor: accentColor }]}>
						<Ionicons
							name="mail-outline"
							size={20}
							color={accentColor}
							style={styles.inputIcon}
						/>
						<TextInput
							style={[
								styles.input,
								{ color: textColor, fontFamily: Typography.fonts.regular },
							]}
							placeholder="ejemplo@correo.com"
							placeholderTextColor="#999"
							keyboardType="email-address"
							autoCapitalize="none"
							value={email}
							onChangeText={setEmail}
						/>
					</View>
				</View>

				{/* Usar la función para renderizar el campo de contraseña */}
				{renderPasswordField("Contraseña", password, setPassword)}

				{/* Renderizar campo de confirmación de contraseña si es registro */}
				{!isLogin &&
					renderPasswordField(
						"Confirmar contraseña",
						confirmPassword,
						setConfirmPassword,
						"Confirma tu contraseña",
					)}

				{isLogin && (
					<View style={styles.rememberContainer}>
						<TouchableOpacity>
							<Text
								style={[
									styles.forgotPassword,
									{
										color: accentColor,
										fontFamily: Typography.fonts.regular,
									},
								]}
							>
								¿Olvidaste tu contraseña?
							</Text>
						</TouchableOpacity>
					</View>
				)}

				<TouchableOpacity
					style={[styles.authButton, { backgroundColor: accentColor }]}
					onPress={handleAuth}
				>
					<Text
						style={[
							styles.authButtonText,
							{ fontFamily: Typography.fonts.title },
						]}
					>
						{isLogin ? "Iniciar sesión" : "Registrarse"}
					</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.toggleContainer}>
				<Text
					style={[
						styles.toggleText,
						{ color: textColor, fontFamily: Typography.fonts.regular },
					]}
				>
					{isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}
				</Text>
				<TouchableOpacity onPress={toggleAuthMode}>
					<Text
						style={[
							styles.toggleAction,
							{ color: accentColor, fontFamily: Typography.fonts.title },
						]}
					>
						{isLogin ? "Regístrate" : "Inicia sesión"}
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	// Diseño móvil (original)
	if (isMobile) {
		return (
			<ScrollView style={[styles.container, { backgroundColor }]}>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={styles.keyboardView}
				>
					<View style={styles.logoContainer}>
						<CupraLogo width={150} height={60} />
					</View>

					<View style={styles.heroContainer}>
						<Image
							source={require("../assets/images/cupra-tavascan-2024-ski-rack-car-accessory.avif")}
							style={styles.heroImage}
							resizeMode="cover"
						/>
						<LinearGradient
							colors={["transparent", backgroundColor]}
							style={styles.gradientOverlay}
						/>
					</View>

					<View style={styles.contentContainer}>
						<Text
							style={[
								styles.title,
								{ color: textColor, fontFamily: Typography.fonts.title },
							]}
						>
							{isLogin ? "Bienvenido de nuevo" : "Únete a la comunidad CUPRA"}
						</Text>

						<Text
							style={[
								styles.subtitle,
								{ color: textColor, fontFamily: Typography.fonts.regular },
							]}
						>
							{isLogin
								? "Inicia sesión para continuar con tu experiencia CUPRA"
								: "Crea una cuenta para descubrir todo lo que CUPRA tiene para ti"}
						</Text>

						<View
							style={[
								styles.formContainer,
								{ backgroundColor: cardBackground },
							]}
						>
							{!isLogin && (
								<View style={styles.inputGroup}>
									<Text
										style={[
											styles.inputLabel,
											{
												color: textColor,
												fontFamily: Typography.fonts.regular,
											},
										]}
									>
										Nombre completo
									</Text>
									<View
										style={[
											styles.inputContainer,
											{ borderColor: accentColor },
										]}
									>
										<Ionicons
											name="person-outline"
											size={20}
											color={accentColor}
											style={styles.inputIcon}
										/>
										<TextInput
											style={[
												styles.input,
												{
													color: textColor,
													fontFamily: Typography.fonts.regular,
												},
											]}
											placeholder="Introduce tu nombre"
											placeholderTextColor="#999"
											value={name}
											onChangeText={setName}
										/>
									</View>
								</View>
							)}

							<View style={styles.inputGroup}>
								<Text
									style={[
										styles.inputLabel,
										{ color: textColor, fontFamily: Typography.fonts.regular },
									]}
								>
									Correo electrónico
								</Text>
								<View
									style={[styles.inputContainer, { borderColor: accentColor }]}
								>
									<Ionicons
										name="mail-outline"
										size={20}
										color={accentColor}
										style={styles.inputIcon}
									/>
									<TextInput
										style={[
											styles.input,
											{
												color: textColor,
												fontFamily: Typography.fonts.regular,
											},
										]}
										placeholder="ejemplo@correo.com"
										placeholderTextColor="#999"
										keyboardType="email-address"
										autoCapitalize="none"
										value={email}
										onChangeText={setEmail}
									/>
								</View>
							</View>

							{/* Usar la función para renderizar el campo de contraseña */}
							{renderPasswordField("Contraseña", password, setPassword)}

							{/* Renderizar campo de confirmación de contraseña si es registro */}
							{!isLogin &&
								renderPasswordField(
									"Confirmar contraseña",
									confirmPassword,
									setConfirmPassword,
									"Confirma tu contraseña",
								)}

							{isLogin && (
								<View style={styles.rememberContainer}>
									<TouchableOpacity>
										<Text
											style={[
												styles.forgotPassword,
												{
													color: accentColor,
													fontFamily: Typography.fonts.regular,
												},
											]}
										>
											¿Olvidaste tu contraseña?
										</Text>
									</TouchableOpacity>
								</View>
							)}

							<TouchableOpacity
								style={[styles.authButton, { backgroundColor: accentColor }]}
								onPress={handleAuth}
							>
								<Text
									style={[
										styles.authButtonText,
										{ fontFamily: Typography.fonts.title },
									]}
								>
									{isLogin ? "Iniciar sesión" : "Registrarse"}
								</Text>
							</TouchableOpacity>
						</View>

						<View style={styles.toggleContainer}>
							<Text
								style={[
									styles.toggleText,
									{ color: textColor, fontFamily: Typography.fonts.regular },
								]}
							>
								{isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}
							</Text>
							<TouchableOpacity onPress={toggleAuthMode}>
								<Text
									style={[
										styles.toggleAction,
										{ color: accentColor, fontFamily: Typography.fonts.title },
									]}
								>
									{isLogin ? "Regístrate" : "Inicia sesión"}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</KeyboardAvoidingView>
			</ScrollView>
		);
	}

	// Diseño escritorio (pantalla dividida)
	return (
		<View style={[styles.desktopContainer, { backgroundColor }]}>
			{/* Formulario a la izquierda (1/3) */}
			<View style={styles.formSide}>
				<ScrollView contentContainerStyle={styles.desktopScrollView}>
					<KeyboardAvoidingView
						behavior={Platform.OS === "ios" ? "padding" : "height"}
						style={styles.desktopKeyboardView}
					>
						<AuthForm />
					</KeyboardAvoidingView>
				</ScrollView>
			</View>

			{/* Imagen a la derecha (2/3) */}
			<View style={styles.imageSide}>
				<Image
					source={
						isLogin
							? require("../assets/images/cupra-tavascan-2024-roof-box-car-accessory.avif")
							: require("../assets/images/cupra-tavascan-2024-surf-rack-car-accessory.avif")
					}
					style={styles.desktopImage}
					resizeMode="cover"
				/>
				<LinearGradient
					colors={["rgba(0,0,0,0.5)", "transparent", "rgba(0,0,0,0.5)"]}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
					style={styles.desktopGradient}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	// Estilos originales para móvil
	container: {
		flex: 1,
	},
	keyboardView: {
		flex: 1,
	},
	logoContainer: {
		alignItems: "center",
		marginTop: 40,
		marginBottom: 20,
	},
	heroContainer: {
		height: 200,
		width: "100%",
		position: "relative",
	},
	heroImage: {
		width: "100%",
		height: "100%",
	},
	gradientOverlay: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		height: 100,
	},
	contentContainer: {
		padding: 20,
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		marginBottom: 10,
	},
	subtitle: {
		fontSize: 16,
		marginBottom: 30,
		opacity: 0.8,
	},
	formContainer: {
		borderRadius: 15,
		padding: 20,
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	inputGroup: {
		marginBottom: 20,
	},
	inputLabel: {
		fontSize: 14,
		marginBottom: 8,
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderRadius: 10,
		height: 50,
	},
	inputIcon: {
		marginHorizontal: 10,
	},
	input: {
		flex: 1,
		height: 50,
		padding: 10,
	},
	passwordToggle: {
		padding: 10,
	},
	rememberContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
	},
	rememberGroup: {
		flexDirection: "row",
		alignItems: "center",
	},
	rememberText: {
		marginLeft: 8,
		fontSize: 14,
	},
	forgotPassword: {
		fontSize: 14,
	},
	authButton: {
		borderRadius: 10,
		height: 50,
		justifyContent: "center",
		alignItems: "center",
	},
	authButtonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "600",
	},
	toggleContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 20,
		marginBottom: 30,
	},
	toggleText: {
		fontSize: 14,
		marginRight: 5,
	},
	toggleAction: {
		fontSize: 14,
		fontWeight: "bold",
	},

	// Estilos nuevos para escritorio
	desktopContainer: {
		flex: 1,
		flexDirection: "row",
	},
	formSide: {
		width: "33.33%", // 1/3 de la pantalla
		height: "100%",
	},
	imageSide: {
		width: "66.67%", // 2/3 de la pantalla
		height: "100%",
		position: "relative",
	},
	desktopImage: {
		width: "100%",
		height: "100%",
	},
	desktopGradient: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	desktopOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: "center",
		alignItems: "center",
	},
	desktopTagline: {
		color: "white",
		fontSize: 24,
		fontWeight: "bold",
		marginTop: 20,
		textShadowColor: "rgba(0,0,0,0.75)",
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 3,
	},
	desktopScrollView: {
		flexGrow: 1,
		justifyContent: "center",
	},
	desktopKeyboardView: {
		flex: 1,
		justifyContent: "center",
	},
	formWrapper: {
		padding: 30,
		paddingTop: 50, // Añadimos más espacio arriba para el logo
	},
	desktopLogoContainer: {
		alignItems: "center",
		marginBottom: 40,
	},
});
