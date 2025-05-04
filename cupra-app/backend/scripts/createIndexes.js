const mongoose = require('mongoose');
const path = require('node:path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Importar modelos
const Usuario = require('../models/Usuario');
const Caracteristica = require('../models/Caracteristica');
const Progreso = require('../models/Progreso');
const Mision = require('../models/Mision');
const Tarea = require('../models/Tarea');
const TareaCompletada = require('../models/TareaCompletada');

async function createIndexes() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conexión exitosa, creando índices...');

    // Índices para Características
    await Caracteristica.collection.createIndex({ id: 1 }, { unique: true });
    await Caracteristica.collection.createIndex({ categoria: 1 });
    await Caracteristica.collection.createIndex({ destacado: 1 });
    console.log('Índices para Características creados');

    // Índices para Usuarios
    await Usuario.collection.createIndex({ email: 1 }, { unique: true });
    console.log('Índices para Usuarios creados');

    // Índices para Progreso
    await Progreso.collection.createIndex(
      { usuario: 1, nivelId: 1, misionId: 1 },
      { unique: true }
    );
    await Progreso.collection.createIndex({ usuario: 1, completada: 1 });
    await Progreso.collection.createIndex({ fechaCompletada: -1 });
    console.log('Índices para Progreso creados');

    // Índices para Misiones
    await Mision.collection.createIndex({ nivelId: 1, misionId: 1 }, { unique: true });
    console.log('Índices para Misiones creados');

    // Índices para Tareas
    await Tarea.collection.createIndex({ dia: 1 });
    await Tarea.collection.createIndex({ nivel: 1 });
    console.log('Índices para Tareas creados');

    // Índices para TareasCompletadas
    await TareaCompletada.collection.createIndex(
      { usuario: 1, tareaId: 1, fecha: 1 },
      { unique: true }
    );
    console.log('Índices para TareasCompletadas creados');

    console.log('Todos los índices creados correctamente');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error al crear índices:', error);
    process.exit(1);
  }
}

createIndexes();