const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
// ¡No importar app aquí!
const Caracteristica = require("../models/Caracteristica");

// Configuración para usar MongoDB en memoria para pruebas
let mongoServer;
let app; // Declarar app pero no importarla aún

beforeAll(async () => {
	// Cerrar cualquier conexión existente primero
	if (mongoose.connection.readyState !== 0) {
		await mongoose.disconnect();
	}

	mongoServer = await MongoMemoryServer.create();
	const uri = mongoServer.getUri();
	await mongoose.connect(uri);

	// Importar app después de establecer la conexión a MongoDB
	app = require("../server");
});

afterAll(async () => {
	await mongoose.disconnect();
	await mongoServer.stop();
});

beforeEach(async () => {
	// Limpiar y llenar la base de datos con datos de prueba antes de cada test
	await Caracteristica.deleteMany({});
	await Caracteristica.create([
		{
			id: "car-001",
			titulo: "Motor eléctrico",
			descripcion: "Potente motor eléctrico de alta eficiencia",
			imagen: "motor.jpg",
			categoria: "rendimiento",
			destacado: true,
		},
		{
			id: "car-002",
			titulo: "Diseño aerodinámico",
			descripcion: "Diseño que reduce la resistencia al aire",
			imagen: "aero.jpg",
			categoria: "diseño",
			destacado: false,
		},
	]);
});

describe("Rutas de Características", () => {
	test("GET /api/caracteristicas debería devolver todas las características", async () => {
		const response = await request(app).get("/api/caracteristicas");

		expect(response.statusCode).toBe(200);
		expect(Array.isArray(response.body)).toBeTruthy();
		expect(response.body.length).toBe(2);
		expect(response.body[0].titulo).toBe("Motor eléctrico");
	});

	test("GET /api/caracteristicas/destacadas debería devolver solo características destacadas", async () => {
		const response = await request(app).get("/api/caracteristicas/destacadas");

		expect(response.statusCode).toBe(200);
		expect(Array.isArray(response.body)).toBeTruthy();
		expect(response.body.length).toBe(1);
		expect(response.body[0].destacado).toBeTruthy();
	});

	test("GET /api/caracteristicas/categoria/rendimiento debería filtrar por categoría", async () => {
		const response = await request(app).get(
			"/api/caracteristicas/categoria/rendimiento",
		);

		expect(response.statusCode).toBe(200);
		expect(Array.isArray(response.body)).toBeTruthy();
		expect(response.body.length).toBe(1);
		expect(response.body[0].categoria).toBe("rendimiento");
	});

	test("GET /api/caracteristicas/car-001 debería devolver una característica específica", async () => {
		const response = await request(app).get("/api/caracteristicas/car-001");

		expect(response.statusCode).toBe(200);
		expect(response.body.id).toBe("car-001");
		expect(response.body.titulo).toBe("Motor eléctrico");
	});

	test("GET /api/caracteristicas/nonexistent debería devolver 404", async () => {
		const response = await request(app).get("/api/caracteristicas/nonexistent");

		expect(response.statusCode).toBe(404);
	});
});
