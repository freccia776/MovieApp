import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types';
import { useAuth } from '../context/AuthContext';
import Constants from 'expo-constants';

type Props = NativeStackScreenProps<RootStackParamList, 'SetUsername'>;


const API_URL = Constants.expoConfig?.extra?.API_URL;

export default function SetUsernameScreen({ route, navigation }: Props) {
  // Riceviamo i dati dal LoginScreen
  const { socialToken, provider, email, firstName, lastName }= route.params;
  const { setTokens } = useAuth();
  //inizializzo i dati ricevuti da google/apple
  const [firstnameInput, setFirstnameInput] = useState(firstName || '');
  const [lastnameInput, setLastnameInput] = useState(lastName || '');
  const [username, setUsername] = useState("");
  const [age, setAge] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    // Validazione Frontend
    if (username.length < 3) {
      Alert.alert("Attenzione", "L'username deve avere almeno 3 caratteri.");
      return;
    }

    //validazione età
    const parsedAge = parseInt(age);
    if (!age || isNaN(parsedAge) || parsedAge < 14) {
      Alert.alert("Attenzione", "Devi avere almeno 14 anni per iscriverti.");
      return;
    }

    // 3. Validazione Nome (Opzionale ma consigliata)
    if (!firstnameInput.trim()) {
        Alert.alert("Attenzione", "Il nome non può essere vuoto.");
        return;
    }

    setIsLoading(true);
    try {
      // Nota: Qui usiamo l'URL completo perché non siamo ancora autenticati
      // Assicurati che process.env.API_URL sia configurato o mettilo a mano per test
      
      console.log("Sto per fare la fetch con i seguenti dati:", {
        token: socialToken,
        provider: provider});
      const response = await fetch(`${API_URL}/auth/social-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: socialToken,
          provider: provider,
          // Ecco i dati mancanti che ora inviamo:
          username: username.trim(),
          age: parsedAge,
           // IMPORTANTE: Inviamo i valori modificati dagli input, non quelli originali di route.params
          firstName: firstnameInput.trim(),
          lastName: lastnameInput.trim()
        })
      });

      console.log("response: ", response.json);
      const data = await response.json();

      if (response.ok) {
        // SUCCESSO! Il backend ha creato l'utente e ci ha dato i token.
        // setTokens salverà tutto e l'AuthContext ci porterà alla Home automaticamente.
        await setTokens(data.accessToken, data.refreshToken, data.user);
      } else {
        Alert.alert("Errore", data.error || "Impossibile completare la registrazione.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Errore", "Errore di connessione col server.");
    } finally {
      setIsLoading(false);
    }
  };

   return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          
          <Text style={styles.title}>Quasi fatto! 🚀</Text>
          <Text style={styles.subtitle}>
            Completa il tuo profilo per accedere a MovieApp.
          </Text>

           {/* Input Nome (Precompilato ma modificabile) */}
           <View style={styles.inputContainer}>
            <Text style={styles.label}>Il tuo Nome</Text>
            <TextInput
              style={styles.input}
              value={firstnameInput}
              onChangeText={setFirstnameInput}
              placeholder="Nome"
              placeholderTextColor="#666"
            />
          </View>

           {/* Input Cognome (Precompilato ma modificabile) */}
           <View style={styles.inputContainer}>
            <Text style={styles.label}>Il tuo Cognome</Text>
            <TextInput
              style={styles.input}
              value={lastnameInput}
              onChangeText={setLastnameInput}
              placeholder="Cognome"
              placeholderTextColor="#666"
            />
          </View>

          {/* Input Username */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Scegli il tuo Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="es. cinemaniaco99"
              placeholderTextColor="#666"
              autoCapitalize="none"
            />
          </View>

          {/* Input Età */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>La tua Età</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              placeholder="es. 25"
              placeholderTextColor="#666"
              keyboardType="number-pad"
              maxLength={3}
            />
          </View>

          {email && (
            <Text style={styles.infoText}>Account collegato a: {email}</Text>
          )}

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Inizia l'avventura</Text>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A1A' },
  content: { padding: 20, justifyContent: 'center', flexGrow: 1 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#9966CC', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#AAA', marginBottom: 40, textAlign: 'center' },
  inputContainer: { marginBottom: 20 },
  label: { color: '#FFF', marginBottom: 8, fontSize: 14, fontWeight: '600' },
  input: {
    backgroundColor: '#2D2D2D',
    color: '#FFF',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333'
  },
  infoText: { color: '#666', fontSize: 12, marginBottom: 30, textAlign: 'center' },
  button: {
    backgroundColor: '#9966CC',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});