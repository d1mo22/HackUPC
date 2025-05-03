import { storeData, getData, removeData } from '../../utils/storageUtils';
import apiClient from "../client";

// Claves para almacenamiento
const TOKEN_KEY = "@cupra_auth_token";
const USER_KEY = "@cupra_user_data";

/**
 * Servicio para gestionar la autenticación
 */
const authService = {
	/**
	 * Inicia sesión con email y contraseña
	 * @param {string} email - Email del usuario
	 * @param {string} password - Contraseña del usuario
	 * @returns {Promise} Datos del usuario y token
	 */
	login: async (email, password) => {
		try {
			const data = await apiClient.post("/usuarios/login", { email, password });

			if (data?.token) {
				await storeData(TOKEN_KEY, data.token);
			}

			if (data?.usuario) {
				await storeData(USER_KEY, JSON.stringify(data.usuario));
			}

			return data;
		} catch (error) {
			console.error("Error al iniciar sesión:", error);
			throw error;
		}
	},

	/**
	 * Registra un nuevo usuario
	 * @param {object} userData - Datos del nuevo usuario
	 * @returns {Promise} Datos del usuario creado y token
	 */
	register: async (userData) => {
		try {
			const data = await apiClient.post("/usuarios/registro", userData);

			if (data?.token) {
				await storeData(TOKEN_KEY, data.token);
			}

			if (data?.usuario) {
				await storeData(USER_KEY, JSON.stringify(data.usuario));
			}

			return data;
		} catch (error) {
			console.error("Error al registrar usuario:", error);
			throw error;
		}
	},

	/**
	 * Cierra la sesión del usuario
	 */
	logout: async () => {
		try {
			await removeData(TOKEN_KEY);
			await removeData(USER_KEY);
		} catch (error) {
			console.error("Error al cerrar sesión:", error);
		}
	},

	/**
	 * Verifica si hay un usuario autenticado
	 * @returns {Promise<boolean>} True si hay un usuario autenticado
	 */
	isAuthenticated: async () => {
		try {
			const token = await getData(TOKEN_KEY);
			return !!token;
		} catch (error) {
			console.error("Error al verificar autenticación:", error);
			return false;
		}
	},

	/**
	 * Obtiene el token actual
	 * @returns {Promise<string|null>} Token del usuario o null
	 */
	getToken: async () => {
		try {
			return await getData(TOKEN_KEY);
		} catch (error) {
			console.error("Error al obtener token:", error);
			return null;
		}
	},

	/**
	 * Obtiene los datos del usuario actual
	 * @returns {Promise<object|null>} Datos del usuario o null
	 */
	getCurrentUser: async () => {
		try {
			const userData = await getData(USER_KEY);
			return userData ? JSON.parse(userData) : null;
		} catch (error) {
			console.error("Error al obtener datos del usuario:", error);
			return null;
		}
	},
};

export default authService;
