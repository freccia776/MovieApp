//web
//455952996246-al9032vbj9v7qlgbsl6d1r6cf1dthn7b.apps.googleusercontent.com
//ios
//455952996246-9kbkno6nsibviknm7npnfoqkefimau7i.apps.googleusercontent.com
// Importiamo i componenti base da React e React Native
import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';

// --- IMPORT PER LA NAVIGAZIONE (CHIAVE PER LA CORREZIONE) ---
// Importiamo i tipi necessari da React Navigation per tipizzare la prop `navigation`.
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// --- IMPORT DEGLI STRUMENTI ---
import Constants from 'expo-constants';
import { useAuth } from '../../context/AuthContext'; // Assicurati che il percorso sia corretto!
import { RootStackParamList } from '../../types/types'; //TIPO DEFINITO NEL FILE types.ts
import { Ionicons } from '@expo/vector-icons';

// --- IMPORT NATIVO PER ENTRAMBE LE PIATTAFORME ---


import {
  GoogleSignin,
  statusCodes,
  isErrorWithCode
} from '@react-native-google-signin/google-signin';


/* SBLOCCARE QUESTO E RIBLOCCARE SE SI USA EXPO GO E SI VUOLE EVITARE L'ERRORE DI IMPORT DINAMICO
const IS_EXPO_GO = Constants.appOwnership === 'expo';

let GoogleSignin: typeof import('@react-native-google-signin/google-signin').GoogleSignin | null = null;
let statusCodes: typeof import('@react-native-google-signin/google-signin').statusCodes | null = null;
let isErrorWithCode: typeof import('@react-native-google-signin/google-signin').isErrorWithCode | null = null;

if (!IS_EXPO_GO) {
  const GooglePackage = require('@react-native-google-signin/google-signin');
  GoogleSignin = GooglePackage.GoogleSignin;
  statusCodes = GooglePackage.statusCodes;
  isErrorWithCode = GooglePackage.isErrorWithCode;
}

*/
// Definiamo il tipo completo delle props per questa schermata.
// Stiamo dicendo: "Le props di questa schermata sono quelle di uno screen dello AuthStack,
// in particolare della rotta 'Login'".
type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;


// --- CONFIGURAZIONE ---
const API_URL = Constants.expoConfig?.extra?.API_URL;

// ID per il Backend (Web) - FONDAMENTALE per ottenere l'idToken
const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
// ID per iOS Nativo (Lo userai in futuro nel .env)
const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_IOS_GOOGLE_CLIENT_ID;


const LoginScreen = ({ navigation }: LoginScreenProps) => {
  // --- STATI DEL COMPONENTE ---
  const [emailorusername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- HOOK ---
  const { signIn, setTokens} = useAuth(); // Prendiamo solo la funzione signIn dal contesto


 // --- 1. CONFIGURAZIONE GOOGLE NATIVA (Android & iOS) ---
  useEffect(() => {
    try {
      GoogleSignin.configure({
        // webClientId è CRUCIALE: serve per ottenere l'idToken che il backend può validare.
        webClientId: GOOGLE_WEB_CLIENT_ID, 
        
        // iosClientId: Opzionale se usi GoogleService-Info.plist, ma utile forzarlo qui se lo hai.
        iosClientId: GOOGLE_IOS_CLIENT_ID,
        
        // androidClientId: Non serve specificarlo qui se hai il google-services.json correttamente configurato.
        
        offlineAccess: false, // Non ci serve perchè usiamo solo idToken
      });
    } catch (e) {
      console.error("Errore configurazione Google Signin:", e);
    }
  }, []);

  
  // --- 2. FUNZIONE LOGIN NATIVO ---
  const handleNativeGoogleLogin = async () => {
    setIsLoading(true);
    console.log(GOOGLE_WEB_CLIENT_ID);
    try {

      
      // Verifica configurazione e servizi
      if (Platform.OS === 'android') {
        console.log("Checking Play Services...");
         await GoogleSignin.hasPlayServices( { showPlayServicesUpdateDialog: true });
      }
     // await GoogleSignin.hasPlayServices();
      
      // Apre la modale nativa (BottomSheet su Android, Alert nativo su iOS)
      const userInfo = await GoogleSignin.signIn();
      console.log('RESULT:', userInfo);
      
      // Recupero Token (supporto per diverse versioni della libreria)
      const token = userInfo.data?.idToken;
      console.log("token: ", token);

      if (token) {
        await handleGoogleBackendHandshake(token);

      } else {
        Alert.alert("Errore", "Nessun token ricevuto da Google.");
        setIsLoading(false);
      }

    } catch (error) {
      setIsLoading(false);
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            console.log("Login annullato dall'utente");
            break;
          case statusCodes.IN_PROGRESS:
            Alert.alert("Info", "Login già in corso");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert("Errore", "Google Play Services non disponibili.");
            break;
          default:
            console.error(error);
            Alert.alert("Errore", "Errore durante il login Google.");
        }
      } else {
         console.error("Errore generico:", error);
         Alert.alert("Errore", "Si è verificato un problema con il login.");
      }
    }
  };

  // --- 3. COMUNICAZIONE CON IL BACKEND ---
  const handleGoogleBackendHandshake = async (token: string) => {
    if (!API_URL) {
        Alert.alert('Errore', "Configurazione server mancante.");
        setIsLoading(false);
        return;
    }

    try {
      console.log("sono prima della fetch");
      const res = await fetch(`${API_URL}/auth/social-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, provider: 'google' })
      });
      console.log("sono dopo la fetch");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore server");
   
      if (data.isNewUser) {
         console.log("sono dopo la fetch3");
        navigation.navigate('SetUsername', {
          socialToken: token,
          provider: 'google',
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName
        });
      } else {
        await setTokens(data.accessToken, data.refreshToken, data.user);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Errore", "Impossibile accedere al momento.");
    } finally {
      setIsLoading(false);
    }
  };


  // --- FUNZIONE DI LOGIN ---
  const handleLogin = async () => {
    if (!emailorusername || !password) {
      Alert.alert('Errore', 'Per favore, compila tutti i campi.');
      return;
    }
    
    if (!API_URL) {
      Alert.alert('Errore di Configurazione', "L'URL del server non è definito. Riavvia il server di Expo.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(API_URL + "/auth/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailorusername, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Credenziali non valide.');
      }

      const { accessToken, refreshToken, user } = data;

      if (accessToken && refreshToken && user) {
        await signIn(accessToken, refreshToken, user);

        
      } else {
        throw new Error('Risposta del server non valida.');
      }
    } catch (error) {
         // --- CORREZIONE DELL'ERRORE ---
      // Controlliamo se 'error' è un'istanza della classe Error.
      // Solo in quel caso possiamo accedere in sicurezza a 'error.message'.
      let errorMessage = 'Si è verificato un errore inaspettato.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      Alert.alert('Login Fallito', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDER DELL'INTERFACCIA (JSX) ---
  // --- RENDER DELL'INTERFACCIA (JSX) ---
return ( 
  <SafeAreaView style={styles.safeArea}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      enabled={false} // DISABILITA IL COMPORTAMENTO DI KEYBOARD AVOIDING
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Accedi</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email o Username"
          value={emailorusername}
          onChangeText={setEmailOrUsername}
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="next"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          returnKeyType="done"
        />

        {isLoading ? (
          <ActivityIndicator size="large" color="#9966CC" style={styles.buttonPlaceholder} />
        ) : (
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        )}

        {/* DIVISORE */}
        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>OPPURE</Text>
          <View style={styles.line} />
        </View>

        {/* PULSANTE GOOGLE NATIVO (Android e iOS) */}
        <TouchableOpacity 
          style={styles.googleButton} 
          onPress={handleNativeGoogleLogin} 
          disabled={isLoading}
        >
          <Ionicons name="logo-google" size={20} color="black" style={{ marginRight: 10 }} />
          <Text style={styles.googleButtonText}>Accedi con Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.appleButton, { opacity: 0.6 }]} onPress={() => Alert.alert("Info", "Presto disponibile")}>
          <Ionicons name="logo-apple" size={20} color="white" style={{ marginRight: 10 }} />
          <Text style={styles.appleButtonText}>Accedi con Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkContainer}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.linkText}>Non hai ancora un account? Registrati</Text>
        </TouchableOpacity> 
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
);
};

// --- STILI DEL COMPONENTE ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#FFFFFF',
  },
  input: {
    height: 50,
    borderColor: '#3A3A3A',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#2D2D2D',
    color: '#FFFFFF',
  },
  buttonPlaceholder: {
    height: 50,
    marginTop: 10,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#9966CC',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  linkContainer: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  linkText: {
    color: '#9966CC',
    textAlign: 'center',
    fontSize: 16,
  },
  // STILI SOCIAL
  divider: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 20 
  },
  line: { 
    flex: 1, 
    height: 1, 
    backgroundColor: '#3A3A3A' 
  },
  dividerText: { 
    color: '#A0A0A0', 
    paddingHorizontal: 10, 
    fontSize: 12 
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  googleButtonText: { 
    color: '#000', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  appleButton: {
    backgroundColor: '#000000',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333'
  },
  appleButtonText: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});

export default LoginScreen;

