cupra-app/
│
├── assets/                # Imágenes, íconos, animaciones Lottie, etc.
│
├── components/            # Componentes reutilizables
│   ├── FeatureCard.tsx
│   ├── POIImage.tsx       # Imagen con puntos de interés
│   └── SearchBar.tsx
│
├── data/                  # JSON o TS con datos simulados
│   ├── features.json
│   ├── pois.json
│   └── glossary.json
│
├── screens/               # Pantallas principales
│   ├── HomeScreen.tsx         # Con la daily feature
│   ├── FeatureDetailScreen.tsx
│   ├── SearchScreen.tsx       # Buscar características
│   ├── POIScreen.tsx          # Imagen + puntos de interés
│   └── GlossaryScreen.tsx     # (Opcional) Glosario
│
├── navigation/            # Configuración de navegación
│   └── AppNavigator.tsx
│
├── App.tsx                # Entry point
├── app.json               # Configuración de Expo
└── tsconfig.json          # Configuración TypeScript
