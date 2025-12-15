// Importiamo i componenti base da React e React Native
import React, { useState } from 'react';
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

// --- IMPORT PER LA NAVIGAZIONE (CHIAVE PER LA CORREZIONE) ---
// Importiamo i tipi necessari da React Navigation per tipizzare la prop `navigation`.
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// --- IMPORT DEGLI STRUMENTI ---
import Constants from 'expo-constants';
import { useAuth } from '../../context/AuthContext'; // Assicurati che il percorso sia corretto!
import { RootStackParamList } from '../../types/types'; //TIPO DEFINITO NEL FILE types.ts



// Definiamo il tipo completo delle props per questa schermata.
// Stiamo dicendo: "Le props di questa schermata sono quelle di uno screen dello AuthStack,
// in particolare della rotta 'Login'".
type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;


// --- CONFIGURAZIONE ---
const API_URL = Constants.expoConfig?.extra?.API_URL;

// --- COMPONENTE LOGIN SCREEN ---
// Usiamo il tipo appena creato per le props. Ora TypeScript sa esattamente cos'è `navigation`.
const LoginScreen = ({ navigation }: LoginScreenProps) => {
  // --- STATI DEL COMPONENTE ---
  const [emailorusername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- HOOK ---
  const { signIn } = useAuth(); // Prendiamo solo la funzione signIn dal contesto

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
  return ( 
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
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
        <ActivityIndicator size="large" color="#007AFF" style={styles.buttonPlaceholder} />
      ) : (
        <Button title="Login" onPress={handleLogin} disabled={isLoading} />
      )}

      <TouchableOpacity 
        style={styles.linkContainer}
        // Ora TypeScript sa che `navigation.navigate('Register')` è un'azione valida!
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.linkText}>Non hai ancora un account? Registrati</Text>
      </TouchableOpacity> 
    </KeyboardAvoidingView>
  );
};

// --- STILI DEL COMPONENTE ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#1A1A1A', // Sfondo scuro per coerenza con il tema
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#FFFFFF', // Testo bianco
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
    height: 40,
    marginTop: 10,
  },
  linkContainer: {
    marginTop: 20,
  },
  linkText: {
    color: '#9966CC', // Colore primario del tema
    textAlign: 'center',
    fontSize: 16,
  },
});

export default LoginScreen;

