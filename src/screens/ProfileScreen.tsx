import React, { useState } from "react";
import { ScrollView, View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfileStackParamList } from "../types/types";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack"; 
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from "../context/AuthContext";
import * as ImagePicker from 'expo-image-picker'; // 1. Importa ImagePicker
import { fetchWithAuth } from '../api/fetchWithAuth'; 
import Avatar from "../components/Avatar";

// Definiamo le props per l'intera schermata (che includono 'route')
//PRIMA ERA COSÌ PERCHÈ PASSAVAMO I PARAM DA ROUTE
//type ProfileScreenProps = NativeStackScreenProps<ProfileStackParamList, 'ProfileMain'>;

//DA CONTROLLARE.
type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

//PRIMA ERA COSÌ PERCHÈ PASSAVAMO I PARAM DA ROUTE
//export default function ProfileScreen({ route }: ProfileScreenProps) {

export default function ProfileScreen() {

  const { user, signOut, updateUser, setTokens } = useAuth(); //uso il context per prendere i dati dell'utente e la funzione di logout
  const [isUploading, setIsUploading] = useState(false);
  //const [refreshing, setRefreshing] = useState(false);
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
    
  const handleLogout = () => {
      Alert.alert(
        "Conferma Logout",
        "Sei sicuro di voler uscire?",
        [
          // Pulsante "Annulla"
          {
            text: "Annulla",
            style: "cancel"
          },
          // Pulsante "Esci", che chiama la funzione signOut
          { 
            text: "Esci", 
            onPress: signOut, // <-- ECCO LA CHIAMATA ALLA FUNZIONE!
            style: 'destructive'
          }
        ]
      );
    };

     // --- FUNZIONE PER SCEGLIERE E CARICARE L'IMMAGINE ---
  const pickAndUploadImage = async () => {
    // A. Controllo Permessi
    // Se non abbiamo ancora il permesso, lo chiediamo
    if (!status?.granted) {
      const permissionResponse = await requestPermission();
      // Se l'utente rifiuta anche dopo la richiesta, ci fermiamo
      if (!permissionResponse.granted) {
        Alert.alert("Permesso negato", "Serve l'accesso alla galleria per cambiare la foto profilo.");
        return;
      }
    }

    // B. Apri la galleria
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // Solo immagini
      allowsEditing: true,    // Permetti di ritagliare
      aspect: [1, 1],         // Ritaglio quadrato
      quality: 0.8,           // Qualità alta
    });

    if (!result.canceled) {
      // Se l'utente ha scelto una foto, caricala
      await uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    setIsUploading(true);
    try {
      // C. Prepara il file per l'invio (FormData)
      const formData = new FormData();
      // @ts-ignore: React Native ha bisogno di questo formato specifico per i file
      formData.append('avatar', {
        uri: uri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      });

      // D. Invia al backend usando fetchWithAuth
      // Nota: NON mettiamo headers 'Content-Type', fetch lo gestisce da solo per i file!
      const response = await fetchWithAuth('/user/avatar', {
        method: 'POST',
        body: formData,
      }, { setTokens, signOut });

      if (!response.ok) throw new Error("Upload fallito");

      const data = await response.json();

      // E. Aggiorna l'interfaccia con il nuovo URL restituito dal server
      await updateUser({ profileImageUrl: data.profileImageUrl });
      
      Alert.alert("Successo", "Nuova foto profilo impostata!");

    } catch (error) {
      console.error(error);
      Alert.alert("Errore", "Impossibile caricare la foto.");
    } finally {
      setIsUploading(false);
    }
  };

  
  // --- 2. FUNZIONE DELETE ---
  const removePhoto = async () => {
    setIsUploading(true);
    try {
      // Chiamata DELETE per rimuovere
      const response = await fetchWithAuth('/user/avatar', {
        method: 'DELETE',
      }, { setTokens, signOut });

      if (!response.ok) throw new Error("Errore rimozione");

      // Aggiorna l'utente locale impostando l'immagine a null
      await updateUser({ profileImageUrl: null });
      
      Alert.alert("Successo", "Foto rimossa. Tornato al default.");

    } catch (error) {
      Alert.alert("Errore", "Impossibile rimuovere la foto.");
    } finally {
      setIsUploading(false);
    }
  };

  // --- NUOVA LOGICA: Gestione Pressione Immagine ---
  const handleImagePress = () => {
    // Se l'utente non ha una foto (o è quella di default, anche se user.profileImageUrl è null in quel caso),
    // apriamo direttamente la galleria per aggiungerne una.
    if (!user?.profileImageUrl) {
      pickAndUploadImage();
      return;
    }

    // Se ha una foto, chiediamo cosa vuole fare
    Alert.alert(
      "Modifica Foto Profilo",
      "Cosa vuoi fare?",
      [
        { text: "Annulla", style: "cancel" },
        { 
          text: "Rimuovi foto attuale", 
          onPress: removePhoto,
          style: 'destructive' 
        },
        { 
          text: "Scegli dalla galleria", 
          onPress: pickAndUploadImage 
        },
      ]
    );
  };





  


  const MaxFilmVisible = 3; // Numero massimo di film da visualizzare
  const bio = "Questa è una bio molto lunga che supera il limite di 80 caratteri e deve essere troncata per adattarsi al layout.";
  const navigation = useNavigation<NavigationProp>();

  //IL PRIMO SERVE PER IL DEEPLINKING :
  //IL SECONDO INVECE DOVREBBE ESSERE PRESO DALLA SESSIONE DELL'UTENTE LOGGATO
  //const username = route.params?.username || "UtenteEsempio"; // Username fittizio dell'utente loggato
  
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Nessun utente loggato.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileSection}>
            <Text style={styles.username}>{user.username}</Text>
           {/* Immagine cliccabile */}
            <TouchableOpacity onPress={handleImagePress} disabled={isUploading}>
              <View style={styles.imageContainer}>
                 <Avatar 
                  uri={user.profileImageUrl} 
                  size={120} 
                  style={styles.profileImageBorder} 
                />
                  {/* Overlay di caricamento se stiamo uppando */}
                  {isUploading && (
                      <View style={styles.loadingOverlay}>
                          <ActivityIndicator color="#fff" />
                      </View>
                  )}
                  {/* Icona o testo per indicare che si può modificare */}
                  <View style={styles.editBadge}>
                      <Text style={styles.editBadgeText}>Modifica</Text>
                  </View>
              </View>
            </TouchableOpacity>
          <Text style={styles.bio}>
            {user.bio || ""}
          </Text>
          <View style={styles.buttonContainer}>
           <TouchableOpacity
              style={styles.button}
              onPress={() => Alert.alert("Link copiato negli appunti")}
            >
              <Ionicons name="link-outline" size={24} color="white" />
          </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => navigation.navigate("EditProfile") } 
            >
              <Ionicons name="create-outline"  size={24} color="white" />
           
            </TouchableOpacity>
          </View>
        </View>

        <View>
          
          <View style={styles.moviesContainer}>
      
          <TouchableOpacity
              style={styles.mostraAltroButton}
              onPress={() => navigation.navigate("Wishlist" ,{})}
            >
            <Text style={styles.buttonText}>Wishlist</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#9966CC",
  },
  bio: {
    fontSize: 14,
    color: "#A0A0A0",
    textAlign: "center",
    lineHeight: 20,
  },
  moviesContainer: {
    top: 30,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 15,
    marginBottom: 30,
    justifyContent: "center",
  },
  sezioneContainer: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 15,
    marginTop: 20,
  },
  button: {
    
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(153, 102, 204, 0.2)",
    padding: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#9966CC",
    width: 50,
    height: 50,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  settingsButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(153, 102, 204, 0.2)",
    padding: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#9966CC",
    width: 50,
    height: 50,
  },
  mostraAltroButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(153, 102, 204, 0.15)",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(153, 102, 204, 0.3)",
    width: 120,
    height: 40,
    marginTop: 10,
  },

  logoutButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(153, 102, 204, 0.15)",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(153, 102, 204, 0.3)",
    width: 120,
    height: 40,
    marginTop: 10,
    marginLeft: 10,
  },
   text: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#9966CC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  editBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
    // Stile specifico per il bordo viola dell'Avatar
  profileImageBorder: {
    borderWidth: 3,
    borderColor: "#9966CC",
  },
});