/**
 * Configuración global de tipografía para la aplicación CUPRA
 */

export const Typography = {
	fonts: {
		regular: "CupraRegular",
		title: "CupraBook",
	},

	// Variantes de texto por tamaño
	heading1: {
		fontFamily: "CupraBook",
		fontSize: 32,
		fontWeight: "700" as const,
		lineHeight: 40,
	},
	heading2: {
		fontFamily: "CupraBook",
		fontSize: 24,
		fontWeight: "600" as const,
		lineHeight: 32,
	},
	heading3: {
		fontFamily: "CupraBook",
		fontSize: 20,
		fontWeight: "500" as const,
		lineHeight: 28,
	},
	body: {
		fontFamily: "CupraRegular",
		fontSize: 16,
		fontWeight: "400" as const,
		lineHeight: 24,
	},
	bodySmall: {
		fontFamily: "CupraRegular",
		fontSize: 14,
		fontWeight: "200" as const,
		lineHeight: 20,
	},
	caption: {
		fontFamily: "CupraRegular",
		fontSize: 12,
		fontWeight: "300" as const,
		lineHeight: 16,
	},
};
