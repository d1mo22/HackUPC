import {
	API_TIMEOUT,
	API_URL,
	DEFAULT_HEADERS,
	getAuthHeaders,
} from "./config";

/**
 * Cliente HTTP para realizar peticiones a la API
 */
class ApiClient {
	/**
	 * Realiza una petición HTTP
	 * @param {string} endpoint - Ruta del endpoint (sin la URL base)
	 * @param {object} options - Opciones de la petición
	 * @returns {Promise} - Promesa con la respuesta
	 */
	async request(endpoint, options = {}) {
		const url = `${API_URL}${endpoint}`;

		// Configurar tiempo máximo de espera
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

		try {
			// Configuración por defecto
			const config = {
				...options,
				headers: options.headers || DEFAULT_HEADERS,
				signal: controller.signal,
			};
			const response = await fetch(url, config);
			clearTimeout(timeoutId);

			// Convertir la respuesta a JSON
			const data = await response.json();

			// Verificar si la respuesta es exitosa (código 2xx)
			if (!response.ok) {
				throw {
					status: response.status,
					message: data.mensaje || "Error en la petición",
					data,
				};
			}

			return data;
		} catch (error) {
			clearTimeout(timeoutId);

			// Si el error ya tiene el formato que queremos, lo propagamos tal cual
			if (error.status && error.message) {
				throw error;
			}

			// Si es un error de timeout
			if (error.name === "AbortError") {
				throw {
					status: 408,
					message: "La petición ha excedido el tiempo máximo de espera",
				};
			}

			// Para cualquier otro tipo de error
			throw {
				status: 500,
				message:
					error.message || "Error desconocido al contactar con el servidor",
			};
		}
	}

	// Métodos para los diferentes tipos de peticiones HTTP
	async get(endpoint, token = null) {
		return this.request(endpoint, {
			method: "GET",
			headers: token ? getAuthHeaders(token) : DEFAULT_HEADERS,
		});
	}

	async post(endpoint, data = {}, token = null) {
		return this.request(endpoint, {
			method: "POST",
			headers: token ? getAuthHeaders(token) : DEFAULT_HEADERS,
			body: JSON.stringify(data),
		});
	}

	async put(endpoint, data = {}, token = null) {
		return this.request(endpoint, {
			method: "PUT",
			headers: token ? getAuthHeaders(token) : DEFAULT_HEADERS,
			body: JSON.stringify(data),
		});
	}

	async delete(endpoint, token = null) {
		return this.request(endpoint, {
			method: "DELETE",
			headers: token ? getAuthHeaders(token) : DEFAULT_HEADERS,
		});
	}
}

export default new ApiClient();
