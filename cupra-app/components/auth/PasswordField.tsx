import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Typography } from "../../constants/Typography";

interface PasswordFieldProps {
	label: string;
	value: string;
	onChange: (text: string) => void;
	placeholder?: string;
	isSmallScreen: boolean;
	passwordVisible: boolean;
	togglePasswordVisibility: () => void;
	textColor: string;
	accentColor: string;
}

const PasswordField = React.memo(
	({
		label,
		value,
		onChange,
		placeholder = "Introduce tu contraseña",
		isSmallScreen,
		passwordVisible,
		togglePasswordVisibility,
		textColor,
		accentColor,
	}: PasswordFieldProps) => (
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
						isSmallScreen && { position: "absolute", right: 10 },
					]}
					onPress={togglePasswordVisibility}
				>
					<Ionicons
						name={passwordVisible ? "eye-off-outline" : "eye-outline"}
						size={20}
						color={accentColor}
					/>
				</TouchableOpacity>
			</View>
		</View>
	),
);

const styles = StyleSheet.create({
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
});

export default PasswordField;
