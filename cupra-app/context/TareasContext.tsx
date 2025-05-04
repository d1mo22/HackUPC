import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface TareasContextType {
  tareasCompletadas: number[];
  completarTarea: (tareaId: number) => void;
  isTareaCompletada: (tareaId: number) => boolean;
  xpTotal: number;
  racha: number;
  incrementarRacha: () => void;
  ultimaTareaCompletadaHoy: boolean;
}

const TareasContext = createContext<TareasContextType | undefined>(undefined);

export function TareasProvider({ children }: { children: ReactNode }) {
  const [tareasCompletadas, setTareasCompletadas] = useState<number[]>([]);
  const [xpTotal, setXpTotal] = useState<number>(0);
  const [racha, setRacha] = useState<number>(0);
  const [ultimaTareaCompletadaHoy, setUltimaTareaCompletadaHoy] = useState<boolean>(false);
  const [ultimaFechaCompletada, setUltimaFechaCompletada] = useState<string>('');
  
  // Cargar datos guardados al iniciar
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar tareas completadas
        const storedTareas = await AsyncStorage.getItem('tareasCompletadas');
        if (storedTareas) {
          setTareasCompletadas(JSON.parse(storedTareas));
        }
        
        // Cargar racha
        const storedRacha = await AsyncStorage.getItem('racha');
        if (storedRacha) {
          setRacha(JSON.parse(storedRacha));
        }
        
        // Cargar fecha de última completada
        const storedFecha = await AsyncStorage.getItem('ultimaFechaCompletada');
        if (storedFecha) {
          setUltimaFechaCompletada(storedFecha);
          
          // Comprobar si la última fecha es hoy
          const hoy = new Date().toISOString().split('T')[0];
          setUltimaTareaCompletadaHoy(storedFecha === hoy);
        }
      } catch (error) {
        console.error('Error al cargar datos guardados:', error);
      }
    };
    
    cargarDatos();
  }, []);
  
  // Guardar datos cuando cambien
  useEffect(() => {
    const guardarTareasCompletadas = async () => {
      try {
        await AsyncStorage.setItem('tareasCompletadas', JSON.stringify(tareasCompletadas));
      } catch (error) {
        console.error('Error al guardar tareas completadas:', error);
      }
    };
    
    guardarTareasCompletadas();
  }, [tareasCompletadas]);
  
  useEffect(() => {
    const guardarRacha = async () => {
      try {
        await AsyncStorage.setItem('racha', JSON.stringify(racha));
      } catch (error) {
        console.error('Error al guardar racha:', error);
      }
    };
    
    guardarRacha();
  }, [racha]);
  
  useEffect(() => {
    const guardarFecha = async () => {
      try {
        await AsyncStorage.setItem('ultimaFechaCompletada', ultimaFechaCompletada);
      } catch (error) {
        console.error('Error al guardar fecha:', error);
      }
    };
    
    guardarFecha();
  }, [ultimaFechaCompletada]);

  // Calcular XP cuando cambian las tareas completadas
  useEffect(() => {
    let totalXP = 0;
    import('../data/tasks.json').then(tasks => {
      tareasCompletadas.forEach(tareaId => {
        const tarea = tasks.allTasks.find(t => t.id === tareaId);
        if (tarea) {
          totalXP += tarea.points;
        }
      });
      
      // Sumar también las XP de las tareas que ya estaban marcadas como completadas en el JSON
      tasks.allTasks.forEach(tarea => {
        if (tarea.completed && !tareasCompletadas.includes(tarea.id)) {
          totalXP += tarea.points;
        }
      });
      
      setXpTotal(totalXP);
    });
  }, [tareasCompletadas]);

  const completarTarea = (tareaId: number) => {
    if (!tareasCompletadas.includes(tareaId)) {
      
      // Guardar la tarea como completada
      setTareasCompletadas(prev => [...prev, tareaId]);
      
      // Si es la tarea diaria (id 3), también incrementa la racha
      if (tareaId === 3) {
        const hoy = new Date().toISOString().split('T')[0];
        
        // Si no se ha completado hoy, incrementar la racha
        if (!ultimaTareaCompletadaHoy) {
          incrementarRacha();
          setUltimaTareaCompletadaHoy(true);
          setUltimaFechaCompletada(hoy);
        }
      }
    }
  };

  const incrementarRacha = () => {
    const hoy = new Date().toISOString().split('T')[0];
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    const ayerStr = ayer.toISOString().split('T')[0];
    
    // Si la última fecha completada fue ayer o no ha habido ninguna completada,
    // incrementamos la racha. Si no, reiniciamos la racha a 1.
    if (ultimaFechaCompletada === ayerStr || ultimaFechaCompletada === '') {
      setRacha(prev => prev + 1);
    } else if (ultimaFechaCompletada !== hoy) {
      // Si no completó ayer y no es hoy, reiniciar racha
      setRacha(1);
    }
    // Si ya completó hoy, no hacemos nada
  };

  const isTareaCompletada = (tareaId: number) => {
    return tareasCompletadas.includes(tareaId);
  };

  return (
    <TareasContext.Provider value={{ 
      tareasCompletadas, 
      completarTarea, 
      isTareaCompletada,
      xpTotal,
      racha,
      incrementarRacha,
      ultimaTareaCompletadaHoy
    }}>
      {children}
    </TareasContext.Provider>
  );
}

export function useTareas() {
  const context = useContext(TareasContext);
  if (context === undefined) {
    throw new Error('useTareas debe usarse dentro de un TareasProvider');
  }
  return context;
}