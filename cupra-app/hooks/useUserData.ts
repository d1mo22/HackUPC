import { useEffect, useState } from 'react';
import { authService } from '../api';

// Define la estructura de los datos del usuario
export interface UserData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  foto: string;
  fechaCreacion: string;
  vehicleModel: string;
  vehicleYear: string;
  vehiclePlate: string;
  rachaActual?: number;
  puntos?: number;
  ultimoLogin?: string;
}

/**
 * Hook personalizado para obtener y gestionar los datos del usuario
 * @returns Objeto con estados y funciones relacionadas con los datos del usuario
 */
export const useUserData = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Función para formatear la fecha
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      const month = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date);
      const year = date.getFullYear();
      
      return `${month} ${year}`;
    } catch (error) {
      console.error("Error al formatear fecha:", error);
      return "fecha desconocida";
    }
  };

  // Función para cargar los datos del usuario
  interface StoredUser {
    id?: string;
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
    foto?: string;
    fechaCreacion: string;
    vehicleModel?: string;
    vehicleYear?: string;
    vehiclePlate?: string;
    rachaActual?: number;
    puntos?: number;
    ultimoLogin?: string;
  }

  const fetchUserData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener datos del usuario desde el almacenamiento local
      const user = await authService.getCurrentUser() as StoredUser;
      
      if (!user) {
        throw new Error("No se encontró información del usuario");
      }
      
      // Seleccionar la primera opción de imagen disponible
      const profileImageUrl = user.foto || 
                            "https://randomuser.me/api/portraits/lego/1.jpg";
      
      // Configurar los datos del usuario
      const formattedUserData = {
        id: user.id || user._id || "guest",
        name: user.name || "Usuario CUPRA",
        email: user.email || "",
        foto: profileImageUrl,
        phone: user.phone || "+34 XXX XXX XXX",
        fechaCreacion: user.fechaCreacion || "Mayo 2023",
        rachaActual: user.rachaActual || 0,
        puntos: user.puntos || 0
      };
      
      setUserData(formattedUserData);
    } catch (err: any) {
      const errorMessage = err?.message || "Error desconocido al cargar datos";
      console.error("❌ useUserData: Error al cargar datos:", err);
      setError(errorMessage);
      
      // Configura datos por defecto para que la app siga funcionando
      setUserData({
        id: "error",
        name: "Usuario CUPRA",
        email: "",
        phone: "+34 XXX XXX XXX",
        foto: "https://randomuser.me/api/portraits/lego/1.jpg",
        memberSince: "Mayo 2023",
        vehicleModel: "CUPRA Tavascan 2025",
        vehicleYear: "2025",
        vehiclePlate: "1234 ABC",
        rachaActual: 0,
        puntos: 0
      });
    } finally {
      setLoading(false);
      console.log("🏁 useUserData: Finalizado fetchUserData");
    }
  };

  // Cargar datos cuando se monta el componente
  useEffect(() => {
    fetchUserData();
  }, []);

  // Función para cerrar sesión
  const handleLogout = async (): Promise<boolean> => {
    try {
      await authService.logout();
      return true;
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setError("Error al cerrar sesión");
      return false;
    }
  };

  // Función para recargar datos
  const refreshUserData = (): void => {
    fetchUserData();
  };

  return {
    userData,
    loading,
    error,
    handleLogout,
    refreshUserData
  };
};