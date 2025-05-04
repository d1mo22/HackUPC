import { Ionicons } from "@expo/vector-icons";
import { Stack, router, usePathname } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Platform, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import CupraLogo from "../../components/CupraLogo";
import { useThemeColor } from "../../hooks/useThemeColor";
import { useUserData } from "../../hooks/useUserData";

// Definir la altura del footer como una constante que podamos reutilizar
const FOOTER_HEIGHT = 80;

// Imagen por defecto para mostrar mientras se carga el perfil
const DEFAULT_PROFILE_IMAGE = "https://randomuser.me/api/portraits/lego/1.jpg";

export default function TabLayout() {
    const accentColor = useThemeColor({}, "tint");
    const backgroundColor = useThemeColor({}, "background");
    const textColor = useThemeColor({}, "text");
    const path = usePathname();

    // Usar el hook de datos de usuario
    const { userData, loading } = useUserData();
    
    // Determinar si es un dispositivo móvil o desktop
    const { width } = useWindowDimensions();
    const [isDesktop, setIsDesktop] = useState(false);

    // Actualizar el estado de desktop/móvil cuando cambie el tamaño de la ventana
    useEffect(() => {
        // Considerar desktop si el ancho es mayor a 768px o estamos en web y no es un dispositivo móvil
		const desktop = width > 760;
        setIsDesktop(desktop);
    }, [width]);
    
    // Determinar la pestaña activa directamente
    let activeTab = "";
    if (path === "/") {
        activeTab = "home";
    } else if (path === "/explore") {
        activeTab = "explore";
    } else if (path === "/search") {
        activeTab = "search";
    }

    const handleUserPress = () => {
        router.push("/(tabs)/profile");
    };

    // Función para navegar solo si no estamos ya en esa ruta
    const navigateIfNeeded = (route: string) => {
        // Comprobamos si ya estamos en la ruta actual para evitar navegación innecesaria
        if (
            (route === "/" && path === "/") ||
            (route === "/explore" && path === "/explore") ||
            (route === "/search" && path === "/search")
        ) {
            console.log("Ya estás en esta ruta:", route);
            return;
        }

        // Navegar a la ruta sin el prefijo "/(tabs)"
        router.push(route);
    };

    // Componente para el botón de perfil del usuario
    const UserProfileButton = () => {
        // Si los datos están cargando, mostrar un spinner
        if (loading) {
            return (
                <View style={styles.userIconContainer}>
                    <ActivityIndicator size="small" color={accentColor} />
                </View>
            );
        }

        // Obtener la imagen de perfil de userData o usar la imagen por defecto
        const profileImage = userData?.foto || DEFAULT_PROFILE_IMAGE;

        return (
            <TouchableOpacity
                style={styles.userIconContainer}
                onPress={handleUserPress}
            >
                <Image
                    source={{ uri: profileImage }}
                    style={styles.userProfileImage}
                />
            </TouchableOpacity>
        );
    };

    // Componente de navegación para escritorio
    const DesktopNavigation = () => (
        <View style={styles.desktopNav}>
            <TouchableOpacity 
                style={[styles.desktopNavItem, activeTab === "home" && styles.desktopNavItemActive]} 
                onPress={() => navigateIfNeeded("/")}
            >
                <Ionicons
                    name="home"
                    size={20}
                    color={activeTab === "home" ? accentColor : textColor}
                />
                <Text style={[
                    styles.desktopNavText,
                    { color: activeTab === "home" ? accentColor : textColor }
                ]}>
                    Inicio
                </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={[styles.desktopNavItem, activeTab === "explore" && styles.desktopNavItemActive]} 
                onPress={() => navigateIfNeeded("/explore")}
            >
                <Ionicons
                    name="compass"
                    size={20}
                    color={activeTab === "explore" ? accentColor : textColor}
                />
                <Text style={[
                    styles.desktopNavText,
                    { color: activeTab === "explore" ? accentColor : textColor }
                ]}>
                    Descubrir
                </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={[styles.desktopNavItem, activeTab === "search" && styles.desktopNavItemActive]} 
                onPress={() => navigateIfNeeded("/search")}
            >
                <Ionicons
                    name="search"
                    size={20}
                    color={activeTab === "search" ? accentColor : textColor}
                />
                <Text style={[
                    styles.desktopNavText,
                    { color: activeTab === "search" ? accentColor : textColor }
                ]}>
                    Buscar
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: backgroundColor,
                    },
                    headerTintColor: textColor,
                    headerShadowVisible: false,
                    headerBackVisible: false,
                    headerLeft: () => null,
                    // Ajustar el padding según si es desktop o móvil
                    contentStyle: { 
                        paddingBottom: isDesktop ? 0 : FOOTER_HEIGHT 
                    },
                }}
            >
                <Stack.Screen
                    name="index"
                    options={{
                        headerTitle: () => (
                            <CupraLogo width={80} height={30} color={textColor} />
                        ),
                        headerBackVisible: false,
                        headerLeft: () => null,
                        headerRight: () => (
                            <View style={styles.headerRightContainer}>
                                {isDesktop && <DesktopNavigation />}
                                <UserProfileButton />
                            </View>
                        )
                    }}
                />
                {/* Resto de definiciones de pantalla... */}
                <Stack.Screen
                    name="task-list"
                    options={{
                        headerTitle: () => (
                            <CupraLogo width={80} height={30} color={textColor} />
                        ),
                        headerBackVisible: false,
                        headerLeft: () => null,
                        headerRight: () => (
                            <View style={styles.headerRightContainer}>
                                {isDesktop && <DesktopNavigation />}
                                <UserProfileButton />
                            </View>
                        )
                    }}
                />
                <Stack.Screen
                    name="profile"
                    options={{
                        title: "Mi Perfil",
                        headerBackTitle: "Atrás",
                        headerBackVisible: true,
                        headerLeft: undefined,
                        headerTitleStyle: {
                            fontFamily: "CupraBook",
                        },
                    }}
                />
                <Stack.Screen
                    name="feature-detail"
                    options={{
                        title: "",
                        headerBackTitle: "Atrás",
                        headerBackVisible: true,
                        headerLeft: undefined,
                        headerTitleStyle: {
                            fontFamily: "CupraBook",
                        },
                    }}
                />
                <Stack.Screen
                name="test-hook"
                options={{
                    title: "Test Hook",
                    headerBackTitle: "Atrás",
                }}
                />
            </Stack>

            {/* Footer solo para móviles */}
            {!isDesktop && (
                <View style={[styles.footer, { backgroundColor }]}>
                    <View style={styles.footerContent}>
                        {/* Botón Home */}
                        <TouchableOpacity
                            style={styles.footerItem}
                            onPress={() => navigateIfNeeded("/")}
                        >
                            <View
                                style={[
                                    styles.footerButton,
                                    activeTab === "home" && styles.activeButton,
                                ]}
                            >
                                <Ionicons
                                    name="home"
                                    size={24}
                                    color={activeTab === "home" ? accentColor : textColor}
                                />
                            </View>
                            <Text
                                style={[
                                    styles.footerText,
                                    activeTab === "home"
                                        ? { color: accentColor, fontWeight: "600" }
                                        : { color: textColor },
                                ]}
                            >
                                Inicio
                            </Text>
                        </TouchableOpacity>

                        {/* Botón Discover */}
                        <TouchableOpacity
                            style={styles.footerItem}
                            onPress={() => navigateIfNeeded("/explore")}
                        >
                            <View
                                style={[
                                    styles.footerButton,
                                    activeTab === "explore" && styles.activeButton,
                                ]}
                            >
                                <Ionicons
                                    name="compass"
                                    size={24}
                                    color={activeTab === "explore" ? accentColor : textColor}
                                />
                            </View>
                            <Text
                                style={[
                                    styles.footerText,
                                    activeTab === "explore"
                                        ? { color: accentColor, fontWeight: "600" }
                                        : { color: textColor },
                                ]}
                            >
                                Descubrir
                            </Text>
                        </TouchableOpacity>

                        {/* Botón Search */}
                        <TouchableOpacity
                            style={styles.footerItem}
                            onPress={() => navigateIfNeeded("/search")}
                        >
                            <View
                                style={[
                                    styles.footerButton,
                                    activeTab === "search" && styles.activeButton,
                                ]}
                            >
                                <Ionicons
                                    name="search"
                                    size={24}
                                    color={activeTab === "search" ? accentColor : textColor}
                                />
                            </View>
                            <Text
                                style={[
                                    styles.footerText,
                                    activeTab === "search"
                                        ? { color: accentColor, fontWeight: "600" }
                                        : { color: textColor },
                                ]}
                            >
                                Buscar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerRightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    desktopNav: {
        flexDirection: 'row',
        marginRight: 20,
    },
    desktopNavItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginHorizontal: 5,
    },
    desktopNavItemActive: {
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    desktopNavText: {
        marginLeft: 6,
        fontSize: 15,
        fontFamily: "CupraBook",
    },
    userIconContainer: {
        marginRight: 15,
        borderRadius: 20,
        overflow: "hidden",
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userProfileImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: FOOTER_HEIGHT,
        paddingBottom: 10,
        borderTopWidth: 1,
        borderTopColor: "rgba(0,0,0,0.1)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 10,
    },
    footerContent: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    footerItem: {
        alignItems: "center",
        justifyContent: "center",
    },
    footerButton: {
        padding: 10,
        borderRadius: 30,
    },
    footerText: {
        fontSize: 12,
        marginTop: 4,
        fontFamily: "CupraBook",
    },
    activeButton: {
        backgroundColor: "rgba(0,0,0,0.05)",
    },
    headerStyle: {
        height: 80, // Specify the height of your custom header
    },
});
