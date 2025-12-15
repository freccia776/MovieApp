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
import { RootStackParamList } from '../../types/types'; //TIPO DEFINITO NEL FILE types.ts



// Definiamo il tipo completo delle props per questa schermata.
// Stiamo dicendo: "Le props di questa schermata sono quelle di uno screen dello AuthStack,
// in particolare della rotta 'Login'".
type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, 'Register'>;


// --- CONFIGURAZIONE ---
const API_URL = Constants.expoConfig?.extra?.API_URL;

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
 // const { signIn } = useAuth(); // Prendiamo solo la funzione signIn dal contesto

  // --- FUNZIONE DI LOGIN ---
  const handleRegister = async () => {
    console.log("Registrazione in corso con:", {username, firstName, lastName, age, email, password, confirmPassword});
    if (!username || !password || !email || !confirmPassword || !firstName || !lastName || !age) {
      Alert.alert('Errore', 'Per favore, compila tutti i campi.');
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

      Alert.alert(
        'Registrazione Completata!',
        'Ora puoi accedere con le tue nuove credenziali.',
        [
          // Aggiungiamo un pulsante all'alert che porta direttamente al login
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]
      );
      
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
    <KeyboardAvoidingView
    
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      // keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      style={styles.container}
    > 
      <Text style={styles.title}>Registrati</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        returnKeyType="next"
      />

       <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        returnKeyType="next"
      />

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize="none"
        returnKeyType="next"
      />

      <TextInput
        style={styles.input}
        placeholder="Cognome"
        value={lastName}
        onChangeText={setLastName}
        autoCapitalize="none"
        returnKeyType="next"
      />

      <TextInput
        style={styles.input}
        placeholder="Età"
        value={age}
        onChangeText={(t) => setAge(t.replace(/[^0-9]/g, ''))} // permette solo cifre
        keyboardType="numeric"
        returnKeyType="next"
        maxLength={2}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        returnKeyType="next"
      />

      <TextInput
        style={styles.input}
        placeholder="Conferma Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        returnKeyType="done"
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.buttonPlaceholder} />
      ) : (
        <Button title="Registrati" onPress={handleRegister} disabled={isLoading} />
      )}

       <TouchableOpacity 
        style={styles.linkContainer}
        onPress={() => navigation.goBack()} // Torna alla schermata precedente (Login)
      >
        <Text style={styles.linkText}>Hai già un account? Accedi</Text>
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

export default RegisterScreen;

