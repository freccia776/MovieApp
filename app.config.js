import 'dotenv/config'; // Carica le variabili .env (assicurati di avere installato dotenv)

export default {
  owner: "ifdkdkd",
  name: "MovieApp",
  slug: "movieapp",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",

  scheme: "movieapp",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.iltuonome.movieapp",
    googleServicesFile: "./GoogleService-Info.plist" // (Se/quando farai iOS) // Aggiungi se serve per notifiche iOS
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    edgeToEdgeEnabled: true,
    package: "com.iltuonome.movieapp",
    googleServicesFile: "./google-services.json" // <--- FONDAMENTALE // Aggiungi se serve per notifiche Android
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  plugins: [
    "expo-secure-store",
    "expo-web-browser",
    "@react-native-google-signin/google-signin",
    // Se usi i suoni nelle notifiche, potresti dover aggiungere config plugin qui in futuro
  ],
 
  extra: {
    eas: {
      projectId: "91f64ad5-8ae4-4af7-830a-58a004d4a7b4"
    },
    API_URL: process.env.API_URL_DEVELOPMENT
  }
  // 4. SEZIONE EXTRA (Fondamentale per il codice delle notifiche)
  
};

//PER LE NOTIFICHE ANCORA DA CAPIRE SE USARE I SERVE EXPO O FIREBASE SU ANDROID
//al momento sto usando i server di expo per le notifiche