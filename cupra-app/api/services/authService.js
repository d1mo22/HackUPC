import { getData, removeData, storeData } from '../../utils/storageUtils';
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
		  console.log('📱 Intentando login con:', { email, password: '********' });
		  const data = await apiClient.post("/usuarios/login", { email, password });
		  
		  console.log("🔐 Respuesta de login:", JSON.stringify(data, null, 2));
	  
		  if (data?.token) {
			await storeData(TOKEN_KEY, data.token);
			console.log("🔑 Token almacenado con éxito");
		  }
	  
		  if (data?.usuario) {
			// Log detallado para verificar qué campos contienen la imagen
			console.log("👤 Campos de imagen en usuario:", {
			  foto: data.usuario.foto,
			});
			
			console.log("👤 Datos de usuario a almacenar:", JSON.stringify(data.usuario, null, 2));
			
			// Asegúrate de que data.usuario sea una cadena JSON
			const userDataString = typeof data.usuario === 'string' 
			  ? data.usuario 
			  : JSON.stringify(data.usuario);
			
			await storeData(USER_KEY, userDataString);
			console.log("💾 Datos de usuario almacenados con éxito");
		  }
	  
		  return data;
		} catch (error) {
		  console.error("❌ Error al iniciar sesión:", error);
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
			console.log('📱 Intentando registro con:', { ...userData, password: '********' });
			const data = await apiClient.post("/usuarios/registro", userData);
			
			console.log("🔐 Respuesta de registro:", JSON.stringify(data, null, 2));
		
			if (data?.token) {
				await storeData(TOKEN_KEY, data.token);
				console.log("🔑 Token almacenado con éxito");
			}
		
			if (data?.usuario) {
				// Log detallado para verificar qué campos contienen la imagen
				console.log("👤 Campos de imagen en usuario:", {
					foto: data.usuario.foto,
				});
				
				console.log("👤 Datos de usuario a almacenar:", JSON.stringify(data.usuario, null, 2));
				
				// Asegúrate de que data.usuario sea una cadena JSON
				const userDataString = typeof data.usuario === 'string' 
					? data.usuario 
					: JSON.stringify(data.usuario);
				
				await storeData(USER_KEY, userDataString);
				console.log("💾 Datos de usuario almacenados con éxito");
			}
		
			return data;
		} catch (error) {
			console.error("❌ Error al registrar usuario:", error);
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
			
			// Añadir más información para depuración
			console.log('📂 Datos brutos recuperados:', userData);
			
			if (!userData) return null;
			
			// Intenta determinar si ya es un objeto o necesita ser parseado
			try {
			  // Si es una cadena JSON válida, parseala
			  if (typeof userData === 'string') {
				return JSON.parse(userData);
			  } 
			  // Si ya es un objeto, devuélvelo directamente
			  return userData;
			} catch (parseError) {
			  console.error("Error al parsear datos del usuario:", parseError);
			  // Si falla el parseo, devuelve null para evitar errores en cascada
			  return null;
			}
		  } catch (error) {
			console.error("Error al obtener datos del usuario:", error);
			return null;
		  }
		},

	/**
	 * Método de prueba para verificar el almacenamiento de datos del usuario
	 * @returns {Promise<Object>} Resultado de prueba
	 */
	testStorage: async () => {
		try {
			// Verificar si hay un token almacenado
			const token = await getData(TOKEN_KEY);
			
			// Verificar si hay datos de usuario almacenados
			const userData = await getData(USER_KEY);
			
			console.log('--- Test de Storage ---');
			console.log('Token existe:', !!token);
			console.log('Datos de usuario existen:', !!userData);
			
			if (userData) {
				console.log('Datos del usuario:', userData);
			}
			
			return {
				tokenExists: !!token,
				userDataExists: !!userData,
				userData: userData ? (typeof userData === 'string' ? JSON.parse(userData) : userData) : null
			};
		} catch (error) {
			console.error('Error en testStorage:', error);
			return { error: error.message };
		}
	}
};

export default authService;
