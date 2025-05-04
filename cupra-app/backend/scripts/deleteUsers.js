require('dotenv').config({path: '../.env'});
const mongoose = require('mongoose');
const Usuario = require('../models/Usuario');

// Función para conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (err) {
    console.error('Error al conectar a MongoDB:', err);
    process.exit(1);
  }
};

// Función para eliminar usuarios según criterios
const deleteUsers = async () => {
  try {
    const result = await Usuario.deleteMany({});
  } catch (err) {
    console.error('Error al eliminar usuarios:', err);
  }
};

// Ejecutar el script
const run = async () => {
  await connectDB();
  
  // Ejemplo: eliminar usuarios inactivos por más de 6 meses
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
    await deleteUsers();
  
  // Cerrar la conexión
  mongoose.connection.close();
};

run();
