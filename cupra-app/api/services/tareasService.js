import apiClient from "../client";
import authService from "./authService";

/**
 * Servicio para gestionar las tareas del usuario
 */
const tareasService = {
	/**
	 * Obtiene las tareas del día actual
	 * @returns {Promise} Lista de tareas del día
	 */
	getTareasHoy: async () => {
		try {
			const token = await authService.getToken();
			return await apiClient.get("/tareas/hoy", token);
		} catch (error) {
			console.error("Error al obtener tareas de hoy:", error);
			throw error;
		}
	},

	/**
	 * Marca una tarea como completada
	 * @param {string} tareaId - ID de la tarea a completar
	 * @returns {Promise} Resultado de la operación
	 */
	completarTarea: async (tareaId) => {
		try {
			const token = await authService.getToken();
			return await apiClient.post(`/tareas/completar/${tareaId}`, {}, token);
		} catch (error) {
			console.error(`Error al completar tarea ${tareaId}:`, error);
			throw error;
		}
	},
};

export default tareasService;
