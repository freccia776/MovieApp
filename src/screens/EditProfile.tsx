import React, {useState} from "react";
import { ScrollView, View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchWithAuth } from "../api/fetchWithAuth";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack"; 
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";


  export default function EditProfile(){

    const { user, updateUser, signOut, setTokens } = useAuth(); //uso il context per prendere i dati dell'utente, updateUser e signOut nel caso servano.
    
    const navigation = useNavigation();

    // Inizializziamo gli stati. Se un campo è null, usiamo una stringa vuota.
    const [username, setUsername] = useState(user?.username || '');
    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [age, setAge] = useState(user?.age ? String(user.age) : ''); // Age è un numero, lo convertiamo in stringa per l'input
    const [bio, setBio] = useState(user?.bio || '');
    const [isUpdating, setIsUpdating] = useState(false);

    // --- CORREZIONE: Sincronizzazione Dati ---
  // Questo useEffect assicura che i campi vengano riempiti appena i dati dell'utente sono disponibili
  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setAge(user.age ? String(user.age) : '');
      setBio(user.bio || '');
    }
  }, [user]); //user così appena cambia (es. dopo il login) i campi si aggiornano.

    const handleSave = async () => {
    // Validazione base lato frontend
    if (!username.trim()) {
      Alert.alert("Errore", "L'username non può essere vuoto.");
      return;
    }

    // Convertiamo l'età in numero per il backend (se inserita)
    const ageNumber = age ? parseInt(age, 10) : undefined;
    if (age && (isNaN(ageNumber!) || ageNumber! < 14 || ageNumber! > 99)) {
        Alert.alert("Errore", "Inserisci un'età valida (14-99).");
        return;
    }

    setIsUpdating(true);
    
    try {
      const response = await fetchWithAuth('/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          firstName,
          lastName,
          age: ageNumber, // Inviamo il numero
          bio,
        }),
      }, { setTokens, signOut });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Errore durante l'aggiornamento.");
      }

      // Aggiorniamo il contesto locale istantaneamente
      await updateUser(data.user);

      Alert.alert("Successo", "Profilo aggiornato!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Si è verificato un errore.';
        Alert.alert("Errore", errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };
    

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Nessun utente loggato.</Text>
      </View>
    );
  }

   
   return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        
        {/* Header Personalizzato */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Annulla</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Modifica Profilo</Text>
          <TouchableOpacity onPress={handleSave} disabled={isUpdating}>
            {isUpdating ? <ActivityIndicator color="#9966CC" /> : <Text style={styles.saveText}>Salva</Text>}
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.container}>
          
          {/* Sezione Username */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              placeholder="Il tuo username univoco"
              placeholderTextColor="#666"
            />
          </View>

          {/* Sezione Nome e Cognome (Affiancati) */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Nome"
                placeholderTextColor="#666"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Cognome</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Cognome"
                placeholderTextColor="#666"
              />
            </View>
          </View>

          {/* Sezione Età */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Età</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={(text) => setAge(text.replace(/[^0-9]/g, ''))} // Accetta solo numeri
              keyboardType="numeric"
              maxLength={3}
              placeholder="La tua età"
              placeholderTextColor="#666"
            />
          </View>

          {/* Sezione Bio */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              placeholder="Scrivi qualcosa su di te..."
              placeholderTextColor="#666"
              maxLength={300}
            />
            <Text style={styles.charCount}>{bio.length}/300</Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1A1A1A' },
  container: { padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D2D',
    backgroundColor: '#1A1A1A',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  cancelText: { color: 'white', fontSize: 16 },
  saveText: { color: '#9966CC', fontSize: 16, fontWeight: 'bold' },
  
  inputGroup: { marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { color: '#888', marginBottom: 8, fontSize: 14, fontWeight: '600' },
  input: {
    backgroundColor: '#2D2D2D',
    color: 'white',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top', // Importante su Android per allineare il testo in alto
    paddingTop: 12,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  charCount: {
    color: '#666',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 5,
  },
});