import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Guarda un valor en AsyncStorage de forma segura
 * @param {string} key - Clave para guardar el valor
 * @param {any} value - Valor a guardar
 * @returns {Promise<void>}
 */
export const storeData = async (key, value) => {
  try {
    if (value === null || value === undefined) {
      console.warn(`Intentando guardar valor nulo/indefinido en la clave: ${key}`);
      return;
    }
    
    // Convertir a string si no lo es
    const valueToStore = typeof value === 'string' 
      ? value 
      : JSON.stringify(value);
      
    await AsyncStorage.setItem(key, valueToStore);
  } catch (error) {
    console.error(`Error al guardar datos en ${key}:`, error);
  }
};

/**
 * Obtiene un valor de AsyncStorage
 * @param {string} key - Clave del valor a obtener
 * @param {boolean} parseJson - Si debe interpretar como JSON
 * @returns {Promise<any>} El valor guardado
 */
export const getData = async (key, parseJson = true) => {
  try {
    const value = await AsyncStorage.getItem(key);
    
    if (value === null) return null;
    
    return parseJson ? JSON.parse(value) : value;
  } catch (error) {
    console.error(`Error al recuperar datos de ${key}:`, error);
    return null;
  }
};

/**
 * Elimina un valor de AsyncStorage
 * @param {string} key - Clave del valor a eliminar
 * @returns {Promise<void>}
 */
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error al eliminar datos de ${key}:`, error);
  }
};