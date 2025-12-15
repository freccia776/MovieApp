// 1. Importiamo dotenv per caricare le variabili dal file .env
require('dotenv').config();

// 2. Esportiamo una funzione che restituisce la configurazione
export default {
  // 3. Incolliamo qui dentro tutto il contenuto del tuo vecchio "expo" object
  "expo": {
    "name": "MovieApp",
    "slug": "MovieApp",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": true
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-secure-store"
    ],
    // 4. Aggiungiamo la nostra sezione "extra" per passare le variabili all'app
    "extra": {
      // Leggiamo la variabile API_URL_DEVELOPMENT dal file .env
      "API_URL": process.env.API_URL_DEVELOPMENT
    }
  }
};

