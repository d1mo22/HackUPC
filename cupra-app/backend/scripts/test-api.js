const axios = require("axios");

const API_URL = "http://localhost:5000/api";
let authToken = "";

async function runTests() {
	const results = {
		total: 0,
		passed: 0,
		failed: 0,
		tests: [],
	};

	// Función auxiliar para ejecutar y registrar tests
	const runTest = async (name, testFn) => {
		results.total++;
		try {
			await testFn();
			console.log(`✅ PASÓ: ${name}`);
			results.passed++;
			results.tests.push({ name, status: "passed" });
		} catch (error) {
			console.error(`❌ FALLÓ: ${name}`);
			console.error(`   Error: ${error.message}`);
			results.failed++;
			results.tests.push({ name, status: "failed", error: error.message });
		}
	};

	// Test 1: Verificar que el servidor está funcionando
	await runTest("Servidor en línea", async () => {
		const response = await axios.get("http://localhost:5000/");
		if (response.status !== 200) throw new Error(`Status ${response.status}`);
		if (!response.data.includes("funcionando"))
			throw new Error("Respuesta inesperada");
	});

	// Test 2: Obtener características
	await runTest("Obtener características", async () => {
		const response = await axios.get(`${API_URL}/caracteristicas`);
		if (response.status !== 200) throw new Error(`Status ${response.status}`);
		if (!Array.isArray(response.data))
			throw new Error("No se recibió un array");
	});

	// Test 3: Registrar usuario (si no existe)
	await runTest("Registrar usuario de prueba", async () => {
		try {
			const response = await axios.post(`${API_URL}/usuarios/registro`, {
				username: "testuser",
				email: "test@example.com",
				password: "password123",
			});
			authToken = response.data.token;
		} catch (err) {
			// Si el usuario ya existe, intentar login
			if (err.response && err.response.status === 400) {
				const loginResponse = await axios.post(`${API_URL}/usuarios/login`, {
					username: "testuser",
					password: "password123",
				});
				authToken = loginResponse.data.token;
			} else {
				throw err;
			}
		}

		if (!authToken) throw new Error("No se pudo obtener token");
	});

	// Test 4: Acceder a ruta protegida
	await runTest("Acceder a ruta protegida", async () => {
		const response = await axios.get(`${API_URL}/progreso/mi-progreso`, {
			headers: {
				"x-auth-token": authToken,
			},
		});
		if (response.status !== 200) throw new Error(`Status ${response.status}`);
	});

	// Mostrar resumen
	console.log("\n📊 RESUMEN DE PRUEBAS:");
	console.log(`Total: ${results.total}`);
	console.log(`Pasaron: ${results.passed}`);
	console.log(`Fallaron: ${results.failed}`);

	return results;
}

runTests()
	.then((results) => {
		if (results.failed > 0) {
			process.exit(1); // Salir con error si hay fallos
		}
	})
	.catch((error) => {
		console.error("Error al ejecutar pruebas:", error);
		process.exit(1);
	});
