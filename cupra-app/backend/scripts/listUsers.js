require('dotenv').config({path: '../.env'});
const mongoose = require('mongoose');
const Usuario = require('../models/Usuario');

// Función para conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');
  } catch (err) {
    console.error('Error al conectar a MongoDB:', err);
    process.exit(1);
  }
};

// Función para listar usuarios
const listUsers = async (criteria = {}) => {
  try {
    const usuarios = await Usuario.find(criteria).select('-password'); // Excluye el campo password
    
    console.log(`\n=== Total de usuarios: ${usuarios.length} ===\n`);
    
    usuarios.forEach((usuario, index) => {
      console.log(`\n--- Usuario ${index + 1} ---`);
      console.log(`ID: ${usuario._id}`);
      console.log(`Email: ${usuario.email}`);
      console.log(`Racha actual: ${usuario.rachaActual}`);
      console.log(`Puntos: ${usuario.puntos}`);
      console.log(`Último login: ${usuario.ultimoLogin}`);
      console.log(`Fecha creación: ${usuario.fechaCreacion}`);
      console.log('------------------------');
    });
    
    return usuarios;
  } catch (err) {
    console.error('Error al listar usuarios:', err);
    return [];
  }
};

// Ejecutar el script
const run = async () => {
  await connectDB();
  
  // Listar todos los usuarios
  await listUsers();
  
  // También podrías listar con criterios específicos:
  // await listUsers({ puntos: { $gt: 100 } }); // Usuarios con más de 100 puntos
  
  // Cerrar la conexión
  mongoose.connection.close();
};

run();