const redis = require("redis");
const { promisify } = require("node:util");

const client = redis.createClient(
	process.env.REDIS_URL || "redis://127.0.0.1:6379",
);

client.on("error", (err) => {
	console.error("Error en conexión Redis:", err);
});

client.on("connect", () => {
	console.log("Conectado a Redis exitosamente");
});

// Promisify Redis methods
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);
const expireAsync = promisify(client.expire).bind(client);

module.exports = {
	getCache: getAsync,
	setCache: setAsync,
	deleteCache: delAsync,
	expireCache: expireAsync,
	client,
};
