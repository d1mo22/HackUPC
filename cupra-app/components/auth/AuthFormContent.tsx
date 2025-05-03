import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { Typography } from "../../constants/Typography";
import CupraLogo from "../CupraLogo";
import PasswordField from "./PasswordField";

// Función para validar el formato del email
const validateEmail = (email: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

interface AuthFormContentProps {
	isLogin: boolean;
	name: string;
	setName: (name: string) => void;
	email: string;
	setEmail: (email: string) => void;
	password: string;
	setPassword: (password: string) => void;
	confirmPassword: string;
	setConfirmPassword: (password: string) => void;
	handleAuth: () => void;
	toggleAuthMode: () => void;
	passwordVisible: boolean;
	setPasswordVisible: (visible: boolean) => void;
	isSmallScreen: boolean;
	textColor: string;
	accentColor: string;
	cardBackground: string;
}

const AuthFormContent = React.memo(
	({
		isLogin,
		name,
		setName,
		email,
		setEmail,
		password,
		setPassword,
		confirmPassword,
		setConfirmPassword,
		handleAuth,
		toggleAuthMode,
		passwordVisible,
		setPasswordVisible,
		isSmallScreen,
		textColor,
		accentColor,
		cardBackground,
	}: AuthFormContentProps) => {
		// Estado para controlar si el email es válido
		const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);

		// Validar email cuando cambia
		useEffect(() => {
			if (email.length > 0) {
				setIsEmailValid(validateEmail(email));
			} else {
				setIsEmailValid(null); // Neutral cuando está vacío
			}
		}, [email]);

		// Función modificada para manejar la autenticación con validación
		const handleSubmit = () => {
			// Verificar el formato del email antes de proceder
			if (!validateEmail(email)) {
				alert("Por favor, introduce un correo electrónico válido");
				return;
			}

			// Si el email es válido, continuar con el proceso de autenticación
			handleAuth();
		};

		// Determinar el color del borde del input de email
		const getEmailBorderColor = () => {
			if (isEmailValid === null) return accentColor;
			return isEmailValid ? "#4CAF50" : "#F44336"; // Verde si es válido, rojo si no
		};

		// Icono para mostrar validación
		const getEmailIcon = () => {
			if (isEmailValid === null) return "mail-outline";
			return isEmailValid ? "checkmark-circle-outline" : "alert-circle-outline";
		};

		// Color del icono
		const getEmailIconColor = () => {
			if (isEmailValid === null) return accentColor;
			return isEmailValid ? "#4CAF50" : "#F44336";
		};

		return (
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
						<View
							style={[styles.inputContainer, { borderColor: getEmailBorderColor() }]}
						>
							<Ionicons
								name={getEmailIcon()}
								size={20}
								color={getEmailIconColor()}
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
								autoComplete="email"
								autoCorrect={false}
								value={email}
								onChangeText={setEmail}
							/>
						</View>
						{isEmailValid === false && email.length > 0 && (
							<Text style={styles.errorText}>
								Por favor, introduce un email válido
							</Text>
						)}
					</View>

					<PasswordField
						label="Contraseña"
						value={password}
						onChange={setPassword}
						isSmallScreen={isSmallScreen}
						passwordVisible={passwordVisible}
						togglePasswordVisibility={() =>
							setPasswordVisible(!passwordVisible)
						}
						textColor={textColor}
						accentColor={accentColor}
					/>

					{!isLogin && (
						<PasswordField
							label="Confirmar contraseña"
							value={confirmPassword}
							onChange={setConfirmPassword}
							placeholder="Confirma tu contraseña"
							isSmallScreen={isSmallScreen}
							passwordVisible={passwordVisible}
							togglePasswordVisibility={() =>
								setPasswordVisible(!passwordVisible)
							}
							textColor={textColor}
							accentColor={accentColor}
						/>
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
						style={[
							styles.authButton,
							{
								backgroundColor: accentColor,
								// Aplicar opacidad si el email no es válido
								opacity: email.length > 0 && isEmailValid === false ? 0.7 : 1,
							},
						]}
						onPress={handleSubmit}
						disabled={email.length > 0 && isEmailValid === false}
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
	},
);

const styles = StyleSheet.create({
	formWrapper: {
		padding: 30,
		paddingTop: 50,
	},
	desktopLogoContainer: {
		alignItems: "center",
		marginBottom: 40,
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
	errorText: {
		color: "#F44336",
		fontSize: 12,
		marginTop: 5,
		marginLeft: 5,
	},
});

export default AuthFormContent;
