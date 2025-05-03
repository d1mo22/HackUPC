/**
 * Configuración centralizada para la API
 * Facilita cambiar entre entornos (desarrollo, producción)
 */

// URL base de la API: desarrollo local o servidor de producción
export const API_URL = "http://localhost:3000/api"; // Desarrollo (local)

// Tiempo máximo de espera para peticiones (en ms)
export const API_TIMEOUT = 10000;

// Headers comunes para todas las peticiones
export const DEFAULT_HEADERS = {
	"Content-Type": "application/json",
	Accept: "application/json",
};

// Función para incluir el token de autenticación en los headers
export const getAuthHeaders = (token) => ({
	...DEFAULT_HEADERS,
	"x-auth-token": token,
});
