require('dotenv').config({path: '../.env'});
const mongoose = require('mongoose');

async function dropIndex() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Eliminar el índice problemático
    await mongoose.connection.db.collection('usuarios').dropIndex('username_1');
  } catch (error) {
    if (error.code === 27) {
      console.log('El índice username_1 ya no existe');
    } else {
      console.error('Error al eliminar índice:', error);
    }
  } finally {
    await mongoose.disconnect();
  }
}

dropIndex();