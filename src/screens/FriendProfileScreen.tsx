import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Alert, RefreshControl} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from "@react-navigation/native-stack"; 
import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { useAuth } from "../context/AuthContext";
// Import interni
import { FriendsStackParamList } from "../types/types";
import { fetchWithAuth } from '../api/fetchWithAuth'; 
import Avatar from "../components/Avatar";


// Props specifiche per questa schermata
type Props = NativeStackScreenProps<FriendsStackParamList, 'FriendProfile'>;

// Definizione dei dati che ci aspettiamo dal server per un profilo pubblico
interface PublicProfile {
  id: number;
  username: string;
  bio?: string | null;
  profileImageUrl?: string | null;
    // Questi array arrivano grazie al 'select' che abbiamo fatto nel service del backend
  favoriteMovies: { movieId: number }[];
  favoriteTvShows: { tvShowId: number }[];
}

export default function FriendProfileScreen({ navigation, route }: Props) {
  const { userId } = route.params; // Prendiamo l'ID dai parametri
  const { signOut, setTokens } = useAuth();
  
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFriend, setIsFriend] = useState(false); // Per gestire il pulsante "Aggiungi/Rimuovi"
  const [refreshing, setRefreshing] = useState(false);


  //funzione per caricare i dati utente.
  const loadUserProfile = useCallback(async () => { //usiamo callback perchè pasiamo la funzione anche su on refresh e allo stesso tempo su useeffect.
  
      try {
        // Chiamata al backend (Endpoint da creare se non esiste)
        const response = await fetchWithAuth(
            "/user/" + userId,
            {method: 'GET'},
            {signOut, setTokens}

        );

        
        if (!response.ok){
            
             throw new Error("Utente non trovato");
        }
        
       const userData: PublicProfile = await response.json();
        setProfile(userData);

       

      } catch (error) {
        Alert.alert("Errore", "Impossibile caricare il profilo.");
        //navigation.goBack();
      } 

  }, [userId, signOut, setTokens]); 
  

  // Effetto per il primo caricamento (mostra lo spinner grande)
  useEffect(() => {
    const initialLoad = async () => {
      setIsLoading(true);
      await loadUserProfile();
      setIsLoading(false);
    };
    initialLoad();
  }, [loadUserProfile]);


  
  // Funzione chiamata quando l'utente tira giù la lista
  const onRefresh = async () => {
    setRefreshing(true); // Mostra lo spinner piccolo in alto
    await loadUserProfile(); // Ricarica i dati
    setRefreshing(false); // Nasconde lo spinner
  };


  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#9966CC" />
      </View>
    );
  }

  if (!profile) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
             <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#9966CC" // Colore dello spinner su iOS
            colors={["#9966CC"]} // Colore dello spinner su Android
            progressBackgroundColor={"#2D2D2D"} // Sfondo dello spinner su Android
          />
        }
      >
        <View style={styles.profileSection}>
            <Text style={styles.username}>{profile.username}</Text>
            
            <View style={styles.imageContainer}>
                 <Avatar 
                  uri={profile.profileImageUrl} 
                  size={120} 
                  style={styles.profileImageBorder} 
                />
            </View>

          <Text style={styles.bio}>
            {profile.bio || "Nessuna biografia."}
          </Text>

          <View style={styles.buttonContainer}>
             <TouchableOpacity 
               style={styles.friendButton} 
               onPress={() => Alert.alert("Funzionalità futura", "Aggiungi/Rimuovi amico")}
             >
               <Ionicons name={isFriend ? "person-remove" : "person-add"} size={20} color="white" />
               <Text style={styles.buttonText}>{isFriend ? "Rimuovi" : "Aggiungi"}</Text>
             </TouchableOpacity>
          </View>
        </View>

        {/* --- SEZIONE PREFERITI --- */}
        <View>
         
            <TouchableOpacity
                style={styles.mostraAltroButton}
                // Qui potresti navigare a una Wishlist specifica per questo utente in futuro
                onPress={() => navigation.navigate("Wishlist", { username: profile.username, userId: profile.id })}
              >
              <Text style={styles.buttonText}>Vedi tutti</Text>
            </TouchableOpacity>
          
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
  header: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  backButton: {
    padding: 5,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
    shadowColor: "#9966CC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#9966CC", 
    backgroundColor: '#2D2D2D',
  },
  bio: {
    fontSize: 14,
    color: "#A0A0A0",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 15,
    marginTop: 10,
  },
  friendButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#9966CC",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25,
    gap: 8,
  },
  moviesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 15,
    marginBottom: 20,
    justifyContent: "center", // Centra le card
    gap: 10 // Spazio tra le card
  },
  sezioneContainer: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginLeft: 20,
    marginBottom: 15,
    marginTop: 20
  },
  mostraAltroButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(153, 102, 204, 0.15)",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(153, 102, 204, 0.3)",
    width: 200,
    height: 40,
    marginTop: 10,
    alignSelf: 'center',
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  // Stile specifico per il bordo viola dell'Avatar
  profileImageBorder: {
    borderWidth: 3,
    borderColor: "#9966CC",
  },
});