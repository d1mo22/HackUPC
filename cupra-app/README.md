# CUPRA App - HackUPC 2024

![CUPRA Logo](https://cdn.icon-icons.com/icons2/2845/PNG/512/cupra_logo_icon_181333.png)

## 🚗 Visión General

CUPRA App es una aplicación móvil y web desarrollada durante HackUPC 2024 que permite a los propietarios y entusiastas de vehículos CUPRA interactuar con su coche, conocer sus características y mejorar su experiencia de conducción. La aplicación ofrece una interfaz intuitiva y moderna que refleja la identidad de la marca CUPRA.

## ⚡ Características Principales

- **Exploración Interactiva**: Descubre las características y especificaciones de tu CUPRA Tavascan a través de una interfaz atractiva y fácil de usar.
- **Puntos de Interés**: Explora los puntos de interés del vehículo de forma interactiva con visualizaciones detalladas.
- **Características Diarias**: Recibe una característica destacada diariamente para conocer mejor tu vehículo.
- **Tareas y Misiones**: Completa tareas diarias para ganar puntos y mantener una racha de engagement.
- **Búsqueda Avanzada**: Busca características, términos del glosario y avisos de forma rápida y eficiente.
- **Glosario**: Accede a un glosario completo de términos técnicos relacionados con tu vehículo.
- **Perfil Personalizado**: Visualiza tus estadísticas, información del vehículo y configuración personal.
- **Recompensas**: Gana puntos al interactuar con la aplicación y canjéalos por recompensas exclusivas.

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React Native con Expo
- **Navegación**: Expo Router con navegación basada en archivos
- **Estilos**: StyleSheet de React Native con soporte para temas claro/oscuro
- **Iconografía**: Expo Vector Icons (Ionicons)
- **Backend**: Node.js con Express
- **Base de datos**: MongoDB con Mongoose
- **Autenticación**: JWT (JSON Web Tokens)

## 🚀 Instalación y Uso

1. Clona este repositorio:
   ```bash
   git clone https://github.com/your-username/cupra-app.git
   cd cupra-app
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia la aplicación:
   ```bash
   npx expo start
   ```

4. Visualiza la aplicación en:
   - Web: Pulsa `w` en la terminal
   - iOS: Pulsa `i` en la terminal (requiere Xcode y simulador iOS)
   - Android: Pulsa `a` en la terminal (requiere Android Studio y emulador)
   - Dispositivo físico: Escanea el código QR con la app Expo Go

## 📱 Estructura del Proyecto

```
cupra-app/
│
├── app/                   # Rutas y navegación (Expo Router)
│   ├── (tabs)/            # Pestañas principales
│   ├── auth.tsx           # Pantalla de autenticación
│   └── index.tsx          # Pantalla de bienvenida
│
├── assets/                # Recursos estáticos (imágenes, fuentes, etc.)
│
├── components/            # Componentes reutilizables
│   ├── CupraLogo.tsx      # Logo de CUPRA
│   ├── FeatureCard.tsx    # Tarjeta de características
│   └── POIImage.tsx       # Imagen con puntos de interés
│
├── data/                  # Datos de la aplicación
│   ├── features.json      # Características del vehículo
│   ├── glossary.json      # Términos del glosario
│   └── levels.json        # Niveles y misiones
│
├── screens/               # Pantallas principales
│   ├── HomeScreen.tsx     # Pantalla de inicio
│   ├── SearchScreen.tsx   # Búsqueda de características
│   ├── ProfileScreen.tsx  # Perfil de usuario
│   └── FeatureDetailScreen.tsx  # Detalle de características
│
├── constants/             # Constantes de la aplicación
├── hooks/                 # Hooks personalizados
├── context/               # Contextos de React
└── backend/               # Código del servidor
```

## 🌐 API y Backend

El backend de la aplicación está desarrollado con Node.js y Express, proporcionando endpoints para:

- Autenticación y gestión de usuarios
- Información de vehículos
- Progreso de misiones y tareas
- Gestión de recompensas

## 👥 Equipo

Este proyecto fue desarrollado durante HackUPC 2025 por:

- [David Morias]
- [Sergi Metcalf]
- [Hector Rodon]
- [Eudald Pizarro]

## 🔗 Enlaces

- [Repositorio en GitHub](https://github.com/d1mo22/HackUPC)

