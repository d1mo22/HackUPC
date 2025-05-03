import apiClient from "../client";
import authService from "./authService";

/**
 * Servicio para gestionar el progreso del usuario
 */
const progresoService = {
	/**
	 * Obtiene el resumen del progreso del usuario
	 * @returns {Promise} Resumen del progreso
	 */
	getResumen: async () => {
		try {
			const token = await authService.getToken();
			return await apiClient.get("/progreso/resumen", token);
		} catch (error) {
			console.error("Error al obtener resumen de progreso:", error);
			throw error;
		}
	},

	/**
	 * Obtiene las últimas misiones completadas
	 * @returns {Promise} Lista de misiones completadas recientemente
	 */
	getUltimasCompletadas: async () => {
		try {
			const token = await authService.getToken();
			return await apiClient.get("/progreso/ultimas-completadas", token);
		} catch (error) {
			console.error("Error al obtener últimas misiones completadas:", error);
			throw error;
		}
	},

	/**
	 * Marca una misión como completada
	 * @param {object} misionData - Datos de la misión a completar
	 * @returns {Promise} Resultado de la operación
	 */
	completarMision: async (misionData) => {
		try {
			const token = await authService.getToken();
			return await apiClient.post(
				"/progreso/completar-mision",
				misionData,
				token,
			);
		} catch (error) {
			console.error("Error al completar misión:", error);
			throw error;
		}
	},

	/**
	 * Obtiene el ranking de usuarios
	 * @returns {Promise} Lista de usuarios ordenados por puntos
	 */
	getRanking: async () => {
		try {
			return await apiClient.get("/progreso/ranking");
		} catch (error) {
			console.error("Error al obtener ranking:", error);
			throw error;
		}
	},
};

export default progresoService;
