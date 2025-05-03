import apiClient from "../client";

/**
 * Servicio para gestionar las características del coche
 */
const caracteristicasService = {
	/**
	 * Obtiene todas las características
	 * @returns {Promise} Lista de características
	 */
	getAll: async () => {
		try {
			return await apiClient.get("/caracteristicas");
		} catch (error) {
			console.error("Error al obtener características:", error);
			throw error;
		}
	},

	/**
	 * Obtiene las características destacadas
	 * @returns {Promise} Lista de características destacadas
	 */
	getDestacadas: async () => {
		try {
			return await apiClient.get("/caracteristicas/destacadas");
		} catch (error) {
			console.error("Error al obtener características destacadas:", error);
			throw error;
		}
	},

	/**
	 * Obtiene una característica por su ID
	 * @param {string} id - ID de la característica
	 * @returns {Promise} Característica encontrada
	 */
	getById: async (id) => {
		try {
			return await apiClient.get(`/caracteristicas/${id}`);
		} catch (error) {
			console.error(`Error al obtener característica ${id}:`, error);
			throw error;
		}
	},

	/**
	 * Obtiene características por categoría
	 * @param {string} categoria - Categoría a filtrar
	 * @returns {Promise} Lista de características de la categoría
	 */
	getByCategoria: async (categoria) => {
		try {
			return await apiClient.get(`/caracteristicas/categoria/${categoria}`);
		} catch (error) {
			console.error(`Error al obtener características de ${categoria}:`, error);
			throw error;
		}
	},
};

export default caracteristicasService;
