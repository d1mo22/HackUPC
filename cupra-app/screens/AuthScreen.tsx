import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
	Image,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	View,
	useWindowDimensions,
} from "react-native";
import { authService } from "../api";
import AuthFormContent from "../components/auth/AuthFormContent";
import CupraLogo from "../components/CupraLogo";
import { useThemeColor } from "../hooks/useThemeColor";

export default function AuthScreen() {
  // Estados para manejar la alternancia entre inicio de sesión y registro
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Obtener dimensiones para el diseño responsive
  const { width } = useWindowDimensions();
  const isMobile = width <= 850;

  // Actualizar el estado de pantalla pequeña cuando cambia el ancho
  useEffect(() => {
    setIsSmallScreen(width < 1000);
  }, [width]);

  // Acceder a los colores del tema
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const accentColor = useThemeColor({}, "tint");
  const cardBackground = useThemeColor({}, "card");

  // Función para manejar el inicio de sesión/registro
  const handleAuth = useCallback(async () => {
    try {
      if (isLogin) {
        // Iniciar sesión
        setLoading(true);
        await authService.login(email, password);
        setLoading(false);
        router.replace("/(tabs)");
      } else {
        // Registrar usuario
        if (password !== confirmPassword) {
          alert("Las contraseñas no coinciden");
          return;
        }

        setLoading(true);
        await authService.register({
          name,
          email,
          password,
        });
        setLoading(false);
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      setLoading(false);
      alert(error?.message || "Error en la autenticación");
    }
  }, [isLogin, email, password, confirmPassword, name]);

  // Función para alternar entre inicio de sesión y registro
  const toggleAuthMode = useCallback(() => {
    setIsLogin(!isLogin);
    // Limpiar campos al cambiar de modo
    setPassword("");
    setConfirmPassword("");
  }, [isLogin]);

  // Diseño móvil (original)
  if (isMobile) {
    return (
      <ScrollView style={[styles.container, { backgroundColor }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.logoContainer}>
            <CupraLogo width={150} height={60} />
          </View>

          <View style={styles.heroContainer}>
            <Image
              source={require("../assets/images/cupra-tavascan-2024-ski-rack-car-accessory.avif")}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", backgroundColor]}
              style={styles.gradientOverlay}
            />
          </View>

          <View style={styles.contentContainer}>
            <AuthFormContent
              isLogin={isLogin}
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              handleAuth={handleAuth}
              toggleAuthMode={toggleAuthMode}
              passwordVisible={passwordVisible}
              setPasswordVisible={setPasswordVisible}
              isSmallScreen={isSmallScreen}
              textColor={textColor}
              accentColor={accentColor}
              cardBackground={cardBackground}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }

  // Diseño escritorio (pantalla dividida)
  return (
    <View style={[styles.desktopContainer, { backgroundColor }]}>
      {/* Formulario a la izquierda (1/3) */}
      <View style={styles.formSide}>
        <ScrollView contentContainerStyle={styles.desktopScrollView}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.desktopKeyboardView}
          >
            <AuthFormContent
              isLogin={isLogin}
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              handleAuth={handleAuth}
              toggleAuthMode={toggleAuthMode}
              passwordVisible={passwordVisible}
              setPasswordVisible={setPasswordVisible}
              isSmallScreen={isSmallScreen}
              textColor={textColor}
              accentColor={accentColor}
              cardBackground={cardBackground}
            />
          </KeyboardAvoidingView>
        </ScrollView>
      </View>

      {/* Imagen a la derecha (2/3) */}
      <View style={styles.imageSide}>
        <Image
          source={
            isLogin
              ? require("../assets/images/cupra-tavascan-2024-roof-box-car-accessory.avif")
              : require("../assets/images/cupra-tavascan-2024-surf-rack-car-accessory.avif")
          }
          style={styles.desktopImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["rgba(0,0,0,0.5)", "transparent", "rgba(0,0,0,0.5)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.desktopGradient}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Estilos originales para móvil
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  heroContainer: {
    height: 200,
    width: "100%",
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  contentContainer: {
    padding: 20,
  },
  
  // Estilos para escritorio
  desktopContainer: {
    flex: 1,
    flexDirection: "row",
  },
  formSide: {
    width: "33.33%", // 1/3 de la pantalla
    height: "100%",
  },
  imageSide: {
    width: "66.67%", // 2/3 de la pantalla
    height: "100%",
    position: "relative",
  },
  desktopImage: {
    width: "100%",
    height: "100%",
  },
  desktopGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  desktopScrollView: {
    flexGrow: 1,
    justifyContent: "center",
  },
  desktopKeyboardView: {
    flex: 1,
    justifyContent: "center",
  },
});
