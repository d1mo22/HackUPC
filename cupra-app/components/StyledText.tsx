import { Text, type TextProps } from "react-native";
import { Typography } from "../constants/Typography";

export function StyledText(props: TextProps) {
	return (
		<Text
			{...props}
			style={[{ fontFamily: Typography.fonts.regular }, props.style]}
		/>
	);
}

// Componentes variantes de texto
export function Heading1(props: TextProps) {
	return <StyledText {...props} style={[Typography.heading1, props.style]} />;
}

export function Heading2(props: TextProps) {
	return <StyledText {...props} style={[Typography.heading2, props.style]} />;
}

export function Heading3(props: TextProps) {
	return <StyledText {...props} style={[Typography.heading3, props.style]} />;
}

export function BodyText(props: TextProps) {
	return <StyledText {...props} style={[Typography.body, props.style]} />;
}

export function CaptionText(props: TextProps) {
	return <StyledText {...props} style={[Typography.caption, props.style]} />;
}
