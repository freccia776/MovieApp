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

import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

// --- IMPORT PER LA NAVIGAZIONE (CHIAVE PER LA CORREZIONE) ---
// Importiamo i tipi necessari da React Navigation per tipizzare la prop `navigation`.
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// --- IMPORT DEGLI STRUMENTI ---
import Constants from 'expo-constants';
import { RootStackParamList } from '../../types/types'; //TIPO DEFINITO NEL FILE types.ts


import {
  GoogleSignin,
  statusCodes,
  isErrorWithCode
} from '@react-native-google-signin/google-signin';




// Definiamo il tipo completo delle props per questa schermata.
// Stiamo dicendo: "Le props di questa schermata sono quelle di uno screen dello AuthStack,
// in particolare della rotta 'Login'".
type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, 'Register'>;



// --- CONFIGURAZIONE ---
const API_URL = Constants.expoConfig?.extra?.API_URL;

// ID per il Backend (Web) - FONDAMENTALE per ottenere l'idToken
const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
// ID per iOS Nativo (Lo userai in futuro nel .env)
const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_IOS_GOOGLE_CLIENT_ID;
// --- COMPONENTE LOGIN SCREEN ---
// Usiamo il tipo appena creato per le props. Ora TypeScript sa esattamente cos'è `navigation`.
const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  // --- STATI DEL COMPONENTE ---
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
 
  // --- HOOK ---
  const {setTokens} = useAuth();
 // const { signIn } = useAuth(); // Prendiamo solo la funzione signIn dal contesto
  
  
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
  
  

 
  // --- FUNZIONE DI REGISTRAZIONE CLASSICA ---
  const handleRegister = async () => {
    console.log("Registrazione in corso con:", {username, firstName, lastName, age, email, password, confirmPassword});
    if (!username || !password || !email || !confirmPassword || !firstName || !lastName || !age) {
      Alert.alert('Errore', 'Per favore, compila tutti i campi.');
      return;
    }

    
    if (password !== confirmPassword) {
        Alert.alert('Errore', 'Le password non coincidono.');
        return;
    }


    const ageNumber = parseInt(age, 10);
    if (isNaN(ageNumber) || ageNumber < 14 || ageNumber > 99) {
      Alert.alert('Errore', 'Inserisci un\'età valida (da 14 a 99 anni).');
      return;
    }
    
    if (!API_URL) {
      Alert.alert('Errore di Configurazione', "L'URL del server non è definito. Riavvia il server di Expo.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(API_URL + "/auth/register", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            email,
            username,
            password,
            firstName,
            lastName,
            age: ageNumber
             }),
      });

      const data = await response.json();
        
      if (!response.ok) {
        
        throw new Error(data.error || 'Credenziali non valide.');
      }

      // Login Automatico dopo la registrazione
      if (data.accessToken && data.refreshToken && data.user) {
          await setTokens(data.accessToken, data.refreshToken, data.user);
      } else {
          Alert.alert('Successo', 'Registrazione completata! Ora puoi accedere.');
          navigation.navigate('Login');
      }
      
    } catch (error) {
        console.log("Errore durante la registrazione: CATCH");
     // 6. Se c'è un errore, lo mostriamo all'utente
      let errorMessage = 'Si è verificato un errore inaspettato.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      Alert.alert('Registrazione Fallita ciao', errorMessage);
    } finally {
      // 7. Disattiviamo lo stato di caricamento
      setIsLoading(false);
    }
  };

  // --- RENDER DELL'INTERFACCIA (JSX) ---
   return (
     <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Registrati</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
          />

          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#888"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            returnKeyType="next"
          />

          <TextInput
            style={styles.input}
            placeholder="Nome"
            placeholderTextColor="#888"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="none"
            returnKeyType="next"
          />

          <TextInput
            style={styles.input}
            placeholder="Cognome"
            placeholderTextColor="#888"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="none"
            returnKeyType="next"
          />

          <TextInput
            style={styles.input}
            placeholder="Età"
            placeholderTextColor="#888"
            value={age}
            onChangeText={(t) => setAge(t.replace(/[^0-9]/g, ''))} // permette solo cifre
            keyboardType="numeric"
            returnKeyType="next"
            maxLength={2}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            returnKeyType="next"
          />

          <TextInput
            style={styles.input}
            placeholder="Conferma Password"
            placeholderTextColor="#888"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            returnKeyType="done"
          />

          {isLoading ? (
            <ActivityIndicator size="large" color="#9966CC" style={styles.buttonPlaceholder} />
          ) : (
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>Registrati</Text>
            </TouchableOpacity>
          )}

          {/* DIVISORE */}
          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>OPPURE</Text>
            <View style={styles.line} />
          </View>

          {/* PULSANTE GOOGLE */}
          <TouchableOpacity 
            style={styles.googleButton} 
            disabled={isLoading}
            onPress={handleNativeGoogleLogin}
          >
            <Ionicons name="logo-google" size={20} color="black" style={{ marginRight: 10 }} />
            <Text style={styles.googleButtonText}>Registrati con Google</Text>
          </TouchableOpacity>

          {/* PULSANTE APPLE (Placeholder) */}
          <TouchableOpacity 
            style={[styles.appleButton, { opacity: 0.6 }]} 
            onPress={() => Alert.alert("Presto disponibile", "In arrivo!")}
          >
            <Ionicons name="logo-apple" size={20} color="white" style={{ marginRight: 10 }} />
            <Text style={styles.appleButtonText}>Registrati con Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.linkContainer}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.linkText}>Hai già un account? Accedi</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// STILI 
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
  registerButton: {
    backgroundColor: '#9966CC',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  registerButtonText: { 
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

export default RegisterScreen;

