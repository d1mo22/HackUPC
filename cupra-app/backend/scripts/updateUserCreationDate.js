require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Usuario = require('../models/Usuario');

/**
 * Script para modificar la fecha de creación de un usuario
 * Uso: node updateUserCreationDate.js <email> <nuevaFecha>
 * 
 * Ejemplos: 
 * - Fecha específica: node updateUserCreationDate.js usuario@ejemplo.com "2023-05-15"
 * - Hace 30 días: node updateUserCreationDate.js usuario@ejemplo.com "30days"
 * - Hace 3 meses: node updateUserCreationDate.js usuario@ejemplo.com "3months"
 */

const updateUserCreationDate = async () => {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔌 Conectado a MongoDB');
    
    // Obtener parámetros de línea de comandos
    const [, , userEmail, dateInput] = process.argv;
    
    if (!userEmail || !dateInput) {
      console.error('❌ Error: Debes proporcionar un email de usuario y una fecha');
      console.log('📝 Uso: node updateUserCreationDate.js <email> <nuevaFecha>');
      console.log('📝 Ejemplos:');
      console.log('  - Fecha específica: node updateUserCreationDate.js usuario@ejemplo.com "2023-05-15"');
      console.log('  - Hace 30 días: node updateUserCreationDate.js usuario@ejemplo.com "30days"');
      console.log('  - Hace 3 meses: node updateUserCreationDate.js usuario@ejemplo.com "3months"');
      process.exit(1);
    }
    
    // Buscar al usuario
    const usuario = await Usuario.findOne({ email: userEmail });
    
    if (!usuario) {
      console.error(`❌ Usuario con email "${userEmail}" no encontrado`);
      process.exit(1);
    }
    
    // Determinar la nueva fecha
    let nuevaFecha;
    
    if (dateInput.endsWith('days')) {
      // Si es un formato como "30days"
      const days = parseInt(dateInput.replace('days', ''));
      nuevaFecha = new Date();
      nuevaFecha.setDate(nuevaFecha.getDate() - days);
    } else if (dateInput.endsWith('months')) {
      // Si es un formato como "3months"
      const months = parseInt(dateInput.replace('months', ''));
      nuevaFecha = new Date();
      nuevaFecha.setMonth(nuevaFecha.getMonth() - months);
    } else {
      // Si es una fecha específica en formato YYYY-MM-DD
      nuevaFecha = new Date(dateInput);
    }
    
    // Validar que la fecha sea válida
    if (isNaN(nuevaFecha.getTime())) {
      console.error('❌ Formato de fecha inválido');
      process.exit(1);
    }
    
    // Mostrar información antes de actualizar
    console.log('👤 Usuario:', usuario.name);
    console.log('📧 Email:', usuario.email);
    console.log('📅 Fecha de creación actual:', usuario.fechaCreacion);
    console.log('📅 Nueva fecha de creación:', nuevaFecha);
    
    // Pedir confirmación
    console.log('\n⚠️ ¿Estás seguro de que quieres actualizar la fecha de creación? (s/n)');
    
    // Esperar confirmación del usuario
    process.stdin.once('data', async (data) => {
      const respuesta = data.toString().trim().toLowerCase();
      
      if (respuesta === 's' || respuesta === 'si' || respuesta === 'y' || respuesta === 'yes') {
        // Actualizar la fecha de creación
        usuario.fechaCreacion = nuevaFecha;
        await usuario.save();
        
        console.log('✅ Fecha de creación actualizada con éxito');
      } else {
        console.log('❌ Operación cancelada');
      }
      
      // Cerrar la conexión a la base de datos
      await mongoose.disconnect();
      console.log('🔌 Conexión a MongoDB cerrada');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    // Cerrar la conexión a la base de datos
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('🔌 Conexión a MongoDB cerrada');
    }
    process.exit(1);
  }
};

updateUserCreationDate();