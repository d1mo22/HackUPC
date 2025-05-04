import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
// Importar el servicio de tareas
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from "react-native";
import { Typography } from "../constants/Typography";
import { useTareas } from '../context/TareasContext';
import { useThemeColor } from "../hooks/useThemeColor";

import levels from "../data/levels.json";

interface Level {
  id: string;
  index: number;
  title: string;
  mission: string;
  secondMission: string;
  image: string;
  secondImage: string;
  message: string;
  touchableArea: Area;
  secondTouchableArea?: Area;
  imageScale: number;
  interestPoints?: InterestPoint[];
  interestPoints2?: InterestPoint[];
}

interface Area {
  x: number;
  y: number;
  radius: number;
}

interface InterestPoint {
  id: string;
  x: number;
  y: number;
  title: string;
  description: string;
}

export default function LearningGameScreen({ levelId }: { levelId: string }) {
  const [level, setLevel] = useState<Level | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPart2, setShowPart2] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [lastTouch, setLastTouch] = useState({ x: 0, y: 0, visible: false });

  // Agregar estos estados para almacenar las dimensiones reales de la imagen renderizada
  const [actualImageDimensions, setActualImageDimensions] = useState({
    width: 0, 
    height: 0,
    offsetX: 0, // Desplazamiento X donde comienza la imagen real
    offsetY: 0, // Desplazamiento Y donde comienza la imagen real
  });

  const [originalImageDimensions, setOriginalImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation<any>();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isMobile = windowWidth <= 850;
  const isTablet = windowWidth > 850 && windowWidth <= 1200;
  const isDesktop = windowWidth > 1200;

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const accentColor = useThemeColor({}, "tint");
  const cardColor = useThemeColor({}, "card");

  // Añade esta línea para crear una referencia al contenedor de la imagen
  const imageContainerRef = useRef(null);

  const { completarTarea, isTareaCompletada } = useTareas();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: level ? `Nivel ${level.index}` : "Cargando...",
      headerStyle: { backgroundColor },
      headerTintColor: textColor,
      headerTitleStyle: { fontFamily: Typography.fonts.title, fontSize: 18 },
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, level, backgroundColor, textColor]);

  useEffect(() => {
    setLoading(true);
    const foundLevel = levels.find((lvl) => lvl.id === levelId);
    if (foundLevel) {
      setLevel(foundLevel);
    } else {
      console.error(`Level with ID ${levelId} not found.`);
    }
    setLoading(false);
  }, [levelId]);

  // Añadir este efecto para limpiar el punto seleccionado cuando cambia showPart2
  useEffect(() => {
    // Al cambiar de imagen, deseleccionar cualquier punto
    setSelectedPoint(null);
  }, [showPart2]);

  useEffect(() => {
    if (level) {
      const currentImage = showPart2 && level.secondImage ? level.secondImage : level.image;
      
      // Solo si es una imagen con URI (no un recurso local)
      if (typeof currentImage === 'object' && currentImage.uri) {
        Image.getSize(
          currentImage.uri,
          (width, height) => {
            // Almacena estas dimensiones para usarlas en tus cálculos
            setOriginalImageDimensions({ width, height });
          },
          (error) => {
            console.error("Error obteniendo tamaño de imagen:", error);
          }
        );
      }
    }
  }, [level, showPart2]);

  const onContainerLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerDimensions({ width, height });
  };

  // Modifica la función onImageLayout para calcular las dimensiones reales
  const onImageLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setImageDimensions({ width, height });
    
    // Ahora necesitamos conocer las dimensiones originales de la imagen
    // Si las conoces de antemano (por ejemplo, 1920x1080), puedes usarlas directamente
    // De lo contrario, necesitarás obtenerlas de alguna manera

    if (level) {
      // Supongamos que conoces la relación de aspecto de la imagen original
      // O que tienes estos datos en tu objeto level
      const originalWidth = originalImageDimensions.width || 1920; // Valor por defecto o del nivel
      const originalHeight = originalImageDimensions.height || 1080; // Valor por defecto o del nivel
      
      const imageRatio = originalWidth / originalHeight;
      const containerRatio = width / height;
      
      let actualWidth, actualHeight, offsetX, offsetY;
      
      if (imageRatio > containerRatio) {
        // La imagen es más ancha proporcionalmente que el contenedor
        actualWidth = width;
        actualHeight = width / imageRatio;
        offsetX = 0;
        offsetY = (height - actualHeight) / 2;
      } else {
        // La imagen es más alta proporcionalmente que el contenedor
        actualHeight = height;
        actualWidth = height * imageRatio;
        offsetX = (width - actualWidth) / 2;
        offsetY = 0;
      }
      
      setActualImageDimensions({
        width: actualWidth,
        height: actualHeight,
        offsetX,
        offsetY
      });
    }
  };

  const calculatePointPosition = (point: Area) => {
    if (actualImageDimensions.width === 0 || actualImageDimensions.height === 0) {
      return { x: 0, y: 0, size: 0 };
    }

    // Calcular posición basada en el área real de la imagen
    const x = (point.x * actualImageDimensions.width) + actualImageDimensions.offsetX;
    const y = (point.y * actualImageDimensions.height) + actualImageDimensions.offsetY;

    // Hacer que el tamaño sea relativo a la imagen real, no al contenedor
    const baseSizePercent = 0.05;
    const size = Math.min(actualImageDimensions.width, actualImageDimensions.height) * baseSizePercent;

    return { x, y, size };
  };

  const handlePointPress = (pointId: string) => {
    setSelectedPoint(selectedPoint === pointId ? null : pointId);
  };

  const getImageContainerHeight = () => {
    if (isDesktop) {
      return windowHeight * 0.6;
    } else if (isTablet) {
      return windowHeight * 0.5;
    } else {
      return 350;
    }
  };

  const isPointInArea = (x: number, y: number, area: Area): boolean => {
    if (!area) return false;

    // Primero, necesitamos convertir las coordenadas del toque al sistema de coordenadas de la imagen
    // Si el toque está fuera del área de la imagen, directamente retornamos false
    if (
      x < actualImageDimensions.offsetX ||
      y < actualImageDimensions.offsetY ||
      x > actualImageDimensions.offsetX + actualImageDimensions.width ||
      y > actualImageDimensions.offsetY + actualImageDimensions.height
    ) {
      return false;
    }

    // Convertir las coordenadas del toque a coordenadas relativas a la imagen real
    const touchXRelative = (x - actualImageDimensions.offsetX) / actualImageDimensions.width;
    const touchYRelative = (y - actualImageDimensions.offsetY) / actualImageDimensions.height;

    // Calcular la distancia entre el punto de toque (en coordenadas relativas) y el área
    const dx = touchXRelative - area.x;
    const dy = touchYRelative - area.y;
    
    // Calcular el radio relativo - dividir el radio en píxeles por el ancho para obtener un valor relativo
    const relativeRadius = area.radius / actualImageDimensions.width;
    
    return (dx * dx + dy * dy) <= (relativeRadius * relativeRadius);
  };

  const interestPoints = level?.interestPoints || [];
  const activeInterestPoints = showPart2 
  ? (level?.interestPoints2 || []) 
  : (level?.interestPoints || []);

  const handleImagePress = (event: any) => {
    if (!level || imageDimensions.width === 0 || imageDimensions.height === 0) return;

    const { nativeEvent } = event;
    let locationX = nativeEvent.locationX;
    let locationY = nativeEvent.locationY;

    // Verificar si estamos en un entorno web y las coordenadas de ubicación no están disponibles
    if (locationX === undefined || locationY === undefined) {
      
      // Obtener coordenadas de página
      const pageX = nativeEvent.pageX;
      const pageY = nativeEvent.pageY;
      
      // Obtener la referencia del elemento (imagen o contenedor)
      if (imageContainerRef.current) {
        // Necesitamos obtener la posición del elemento en la página
        // En web, podemos usar getBoundingClientRect
        // @ts-ignore - Esto funcionará en web pero no está en los tipos de React Native
        const rect = imageContainerRef.current.getBoundingClientRect();
        
        // Calcular las coordenadas relativas
        locationX = pageX - rect.left;
        locationY = pageY - rect.top;
        
      } else {
        return;
      }
    }

    // El resto de tu código para manejar el toque con las coordenadas corregidas
    setLastTouch({
      x: locationX,
      y: locationY,
      visible: true,
    });

    setTimeout(() => setLastTouch((prev) => ({ ...prev, visible: false })), 2000);


    if (!showPart2 && level.touchableArea) {
      if (isPointInArea(locationX, locationY, level.touchableArea)) {
        setShowPart2(true);
      }
    } else if (showPart2 && level.secondTouchableArea) {
      if (isPointInArea(locationX, locationY, level.secondTouchableArea)) {
        setShowSuccess(true);
        
        if (level.id === "3") {
          completarTarea(3);
        }
      }
    }
  };

  const renderTouchableArea = (area: Area, isSecondary = false) => {
    if (!area) return null;

    const position = calculatePointPosition(area);
    const color = isSecondary ? "rgba(0, 255, 0, 0)" : "rgba(255, 0, 0, 0)";

    return (
      <Animated.View
        style={[
          styles.touchableArea,
          {
            left: position.x - area.radius,
            top: position.y - area.radius,
            width: area.radius * 2,
            height: area.radius * 2,
            backgroundColor: color,
            opacity: 0.5,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />
    );
  };

  if (loading || !level) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={[styles.instructions, { color: textColor }]}>
          Cargando...
        </Text>
      </View>
    );
  }

  // Primero, define un helper para determinar el modo
  const isDarkMode = backgroundColor !== "#fff" && backgroundColor !== "white";

  // Luego, define el color de los puntos basado en el modo
  const pointColor = isDarkMode ? "#dbd3cb" : "#003e51";

  return (
    <ScrollView 
      style={[styles.scrollContainer, { backgroundColor }]}
      contentContainerStyle={styles.scrollContentContainer}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.levelBadge, { backgroundColor: accentColor }]}>
            Nivel {level.id}
          </Text>
          <Text style={[styles.levelTitle, { color: textColor, fontFamily: Typography.fonts.title }]}>
            {level.title}
          </Text>
        </View>

        <Text style={[styles.missionText, { color: textColor, fontFamily: Typography.fonts.regular }]}>
          {showPart2 && level.secondMission ? level.secondMission : level.mission}
        </Text>

        <View
          style={[
            styles.imageContainer, 
            { 
              backgroundColor: cardColor,
              height: getImageContainerHeight(),
              maxWidth: isDesktop ? '80%' : '100%',
              alignSelf: 'center',
            }
          ]}
          onLayout={onContainerLayout}
        >

          <TouchableOpacity 
            activeOpacity={1}
            onPress={handleImagePress}
            style={styles.imageTouchable}
            ref={imageContainerRef}
          >
            <Image
              source={showPart2 && level.secondImage 
                ? level.secondImage 
                : level.image}
              style={[
                styles.levelImage, 
                imageError && styles.hiddenImage,
                {
                  width: '100%',
                  height: '100%',
                }
              ]}
              resizeMode="contain"
              onLayout={onImageLayout}

              onError={() => {
                console.error(`Error al cargar imagen: ${
                  showPart2 
                    ? JSON.stringify(level.secondImage) 
                    : JSON.stringify(level.image)
                }`);
                setImageError(true);
              }}
            />
            
            {!showPart2 && level.touchableArea && renderTouchableArea(level.touchableArea)}
            {showPart2 && level.secondTouchableArea && renderTouchableArea(level.secondTouchableArea, true)}
            
            {/* Indicador visual del último toque (para depuración) */}
            {lastTouch.visible && (
              <View
                style={{
                  position: 'absolute',
                  left: lastTouch.x - 10,
                  top: lastTouch.y - 10,
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: 'rgba(255, 255, 0, 0.6)',
                  borderWidth: 2,
                  borderColor: 'yellow',
                  zIndex: 999,
                }}
              />
            )}
          </TouchableOpacity>

          {!imageError && activeInterestPoints.length > 0 && activeInterestPoints.map((point) => {
            const position = calculatePointPosition({ x: point.x, y: point.y, radius: 0 });
            return (
              <React.Fragment key={point.id}>
                <Animated.View
                  style={[
                    styles.interestPoint,
                    {
                      left: position.x - position.size / 2,
                      top: position.y - position.size / 2,
                      width: position.size,
                      height: position.size,
                      opacity: fadeAnim,
                      transform: [{ scale: pulseAnim }],
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.pointButton,
                      {
                        backgroundColor: pointColor, // Usar el color según el modo
                      }
                    ]}
                    onPress={() => handlePointPress(point.id)}
                  >
                    <Ionicons name="add" size={position.size * 0.6} color="white" />
                  </TouchableOpacity>
                </Animated.View>

                {selectedPoint === point.id && (
                  <View
                    style={[
                      styles.pointInfoBox,
                      {
                        left: position.x > imageDimensions.width / 2 ? position.x - 150 : position.x,
                        top: position.y + position.size,
                        backgroundColor: accentColor, // Mantener el color de acento para los cuadros de info
                      },
                    ]}
                  >
                    <Text style={styles.pointTitle}>{point.title}</Text>
                    <Text style={styles.pointDescription}>{point.description}</Text>
                  </View>
                )}
              </React.Fragment>
            );
          })}
        </View>

        {showSuccess && (
          <View style={[styles.messageContainer, { backgroundColor: accentColor }]}>
            <Ionicons name="trophy" size={24} color="white" />
            <Text style={styles.successMessage}>
              {level.message}
            </Text>
            {level.id === "3" && isTareaCompletada(3) && (
              <Text style={[styles.successMessage, {marginTop: 8}]}>
                ¡Tarea 3 completada correctamente!
              </Text>
            )}
          </View>
        )}

        {showSuccess && (
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: accentColor }]}
            onPress={() => {
              // Opcional: Puedes pasar un parámetro para indicar que debe refrescar las tareas
              navigation.navigate({
                name: 'task-list',
                params: { refresh: true },
                merge: true,
              });
            }}
          >
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        )}

        <View style={styles.instructionsContainer}>
          <Text style={[styles.instructions, { color: textColor, opacity: 0.7 }]}>
            {showPart2 
              ? "Busca el elemento clave para completar el nivel" 
              : "Toca los puntos + para descubrir las características y busca el elemento interactivo"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  backButtonContainer: {
    padding: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 20,
  },
  levelBadge: {
    color: "white",
    fontWeight: "bold",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 12,
  },
  levelTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  missionText: {
    fontSize: 18,
    marginBottom: 20,
  },
  imageContainer: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelImage: {
    objectFit: 'contain',
  },
  hiddenImage: {
    display: "none",
  },
  imageLoadingContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    zIndex: 5,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorImageContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    zIndex: 5,
  },
  errorImageText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
  },
  interestPoint: {
    position: "absolute",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  pointButton: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  pointInfoBox: {
    position: "absolute",
    width: 200,
    padding: 10,
    borderRadius: 8,
    zIndex: 20,
  },
  pointTitle: {
    color: "white",
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 16,
  },
  pointDescription: {
    color: "white",
    fontSize: 14,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  successMessage: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
  },
  backButton: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  instructionsContainer: {
    marginTop: 10,
    padding: 16,
    alignItems: "center",
  },
  instructions: {
    fontSize: 16,
    textAlign: "center",
  },
  imageTouchable: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  touchableArea: {
    position: 'absolute',
    borderRadius: 999,
    zIndex: 5,
  },
  actionButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#dbd3cb',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
});