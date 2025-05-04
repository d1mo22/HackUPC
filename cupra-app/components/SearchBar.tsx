import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { useThemeColor } from "../hooks/useThemeColor";

interface SearchBarProps {
	value: string;
	onChangeText: (text: string) => void;
	onSearch: () => void;
	placeholder?: string;
}

export default function SearchBar({
	value,
	onChangeText,
	onSearch,
	placeholder = "Buscar",
}: SearchBarProps) {
	const backgroundColor = useThemeColor({}, "background");
	const textColor = useThemeColor({}, "text");
	const placeholderColor = useThemeColor({}, "tabIconDefault");
	const tintColor = useThemeColor({}, "tint");

	return (
		<View style={[styles.container, { backgroundColor }]}>
			<View
				style={[
					styles.searchContainer,
					{ backgroundColor: useThemeColor({}, "card") },
				]}
			>
				<Ionicons
					name="search"
					size={20}
					color={placeholderColor}
					style={styles.icon}
				/>
				<TextInput
					style={[styles.input, { color: textColor }]}
					value={value}
					onChangeText={onChangeText}
					placeholder={placeholder}
					placeholderTextColor={placeholderColor}
					returnKeyType="search"
					onSubmitEditing={onSearch}
					clearButtonMode="while-editing"
				/>
				{value.length > 0 && (
					<TouchableOpacity onPress={() => onChangeText("")}>
						<Ionicons
							name="close-circle"
							size={20}
							color={placeholderColor}
							style={styles.clearIcon}
						/>
					</TouchableOpacity>
				)}
			</View>
			{value.length > 0 && (
				<TouchableOpacity
					style={[styles.searchButton, { backgroundColor: tintColor }]}
					onPress={onSearch}
				>
					<Ionicons name="arrow-forward" size={22} color="white" />
				</TouchableOpacity>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	searchContainer: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		borderRadius: 10,
		paddingHorizontal: 10,
		height: 44,
	},
	icon: {
		marginRight: 16,
	},
	clearIcon: {
		marginLeft: 8,
	},
	input: {
		flex: 1,
		fontSize: 16,
		height: "100%",
		paddingHorizontal: 12,
	},
	searchButton: {
		width: 44,
		height: 44,
		borderRadius: 22,
		justifyContent: "center",
		alignItems: "center",
		marginLeft: 12,
	},
});
