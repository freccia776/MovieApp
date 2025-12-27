import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, RefreshControl} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from "@react-navigation/native-stack"; 
import { Ionicons } from '@expo/vector-icons';
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

// Tipi per lo stato dell'amicizia
type FriendshipStatus = 'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'ACCEPTED';


export default function FriendProfileScreen({ navigation, route }: Props) {
  const { userId } = route.params; // Prendiamo l'ID dai parametri
  const { signOut, setTokens } = useAuth();
  
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  
    // Stato Amicizia
  const [friendshipStatus, setFriendshipStatus] = useState<FriendshipStatus>('NONE');
  const [friendshipId, setFriendshipId] = useState<number | null>(null);

  
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAction, setIsLoadingAction] = useState(false); 
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


    // 2. CONTROLLA STATO AMICIZIA
  const checkFriendshipStatus = useCallback(async () => {
    try {
        // NOTA: Questa rotta backend deve ritornare lo stato dell'amicizia tra Me e userId.
        // Esempio risposta: { status: 'ACCEPTED', id: 123, requesterId: ... }
        // Se non esiste, restituisce 404 o null, quindi assumiamo 'NONE'.
        const response = await fetchWithAuth(
            `/friends/status/${userId}`,    //IN QUESTO CASO E IN QUESTA SCHERMATA USERID LO PRENDIAMO DAI PARAMETRI è PROPRIO QUELLO DELL'UTENTE TERZO
            { method: 'GET' },
            { signOut, setTokens }
        );

        if (response.ok) {
            const data = await response.json();
            // data.status potrebbe essere 'PENDING', 'ACCEPTED'
            // Dobbiamo capire se PENDING è inviata (SENT) o ricevuta (RECEIVED)
            // Backend dovrebbe dirtelo, oppure controlli se data.requesterId === myId
            
            // Logica semplificata (adatta in base alla tua risposta backend):
            if (data.status === 'ACCEPTED') {
                setFriendshipStatus('ACCEPTED');
            } else if (data.status === 'PENDING') {
                // Se il backend ti dice chi ha fatto la richiesta:
                if (data.isRequester) { 
                    setFriendshipStatus('PENDING_SENT');
                } else {
                    setFriendshipStatus('PENDING_RECEIVED');
                }
            } else {
                setFriendshipStatus('NONE');
            }
            
            if (data.id) setFriendshipId(data.id);

        } else {
            // Se 404 o altro, assumiamo che non siano amici
            setFriendshipStatus('NONE');
            setFriendshipId(null);
        }
    } catch (error) {
        console.log("Stato amicizia non trovato o errore:", error);
        setFriendshipStatus('NONE');
    }
  }, [userId, signOut, setTokens]);

  

  // Effetto per il primo caricamento (mostra lo spinner grande)

  // Caricamento Iniziale
  useEffect(() => {
    const initialLoad = async () => {
      setIsLoading(true);
      await Promise.all([loadUserProfile(), checkFriendshipStatus()]);
      setIsLoading(false);
    };
    initialLoad();
  }, [loadUserProfile, checkFriendshipStatus]);


  
  // Funzione chiamata quando l'utente tira giù la lista
  const onRefresh = async () => {
    setRefreshing(true); // Mostra lo spinner piccolo in alto
     await Promise.all([loadUserProfile(), checkFriendshipStatus()]);
    setRefreshing(false); // Nasconde lo spinner
  };
  
  // 3. GESTIONE AZIONI (Aggiungi, Rimuovi, Annulla)
  const handleFriendAction = async () => {
    if (!profile) return;
    setIsLoadingAction(true);

    try {
        // CASO A: NON AMICI -> INVIA RICHIESTA
        if (friendshipStatus === 'NONE') {

            
            const response = await fetchWithAuth(
                '/friends/request',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ targetUsername: profile.username })
                },
                { setTokens, signOut }
            );

            if (response.ok) {
                const data = await response.json(); // Si spera torni l'id della friendship
                setFriendshipStatus('PENDING_SENT');
                if (data.id) setFriendshipId(data.id);
                // Ricarichiamo per sicurezza per avere l'ID corretto
                checkFriendshipStatus(); 
            } else {
                Alert.alert("Errore", "Impossibile inviare richiesta.");
            }
        } 
        // CASO B: RICHIESTA INVIATA -> ANNULLA (DELETE)
        else if (friendshipStatus === 'PENDING_SENT' && friendshipId) {
            const response = await fetchWithAuth(
                `/friends/${friendshipId}`,
                { method: 'DELETE' },
                { setTokens, signOut }
            );

            if (response.ok) {
                setFriendshipStatus('NONE');
                setFriendshipId(null);
            } else {
                Alert.alert("Errore", "Impossibile annullare la richiesta.");
            }
        }
        // CASO C: AMICI -> RIMUOVI (DELETE con Conferma)
        else if (friendshipStatus === 'ACCEPTED' && friendshipId) {
            Alert.alert(
                "Rimuovi amico",
                `Sei sicuro di voler rimuovere ${profile.username} dagli amici?`,
                [
                    { text: "Annulla", style: "cancel", onPress: () => setIsLoadingAction(false) },
                    { 
                        text: "Rimuovi", 
                        style: "destructive", 
                        onPress: async () => {
                            try {
                                const response = await fetchWithAuth(
                                    `/friends/${friendshipId}`,
                                    { method: 'DELETE' },
                                    { setTokens, signOut }
                                );
                                if (response.ok) {
                                    setFriendshipStatus('NONE');
                                    setFriendshipId(null);
                                } else {
                                    Alert.alert("Errore", "Impossibile rimuovere l'amico.");
                                }
                            } catch (e) { console.error(e); }
                            finally { setIsLoadingAction(false); }
                        }
                    }
                ]
            );
            return; // Usciamo per gestire il loading nell'Alert callback
        }
        // CASO D: RICHIESTA RICEVUTA -> ACCETTA (O vai a tab richieste)
        else if (friendshipStatus === 'PENDING_RECEIVED' && friendshipId) {
             // Opzione semplice: Accetta direttamente qui
             const response = await fetchWithAuth(
                `/friends/${friendshipId}/accept`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'ACCEPTED' })
                },
                { setTokens, signOut }
            );
            if (response.ok) {
                setFriendshipStatus('ACCEPTED');
            }
        }

    } catch (error) {
        console.error("Errore azione amicizia:", error);
        Alert.alert("Errore", "Si è verificato un problema.");
    } finally {
        setIsLoadingAction(false);
    }
  };

  // Funzione helper per stile e testo bottone
  const getButtonConfig = () => {
    switch (friendshipStatus) {
        case 'ACCEPTED':
            return { 
                text: "Amici", 
                icon: "checkmark-circle", 
                color: "#2D2D2D", 
                textColor: "#FFFFFF",
                borderColor: "#9966CC" // Bordo viola per indicare stato attivo
            };
        case 'PENDING_SENT':
            return { 
                text: "Annulla richiesta", 
                icon: "time", 
                color: "#2D2D2D", 
                textColor: "#A0A0A0",
                borderColor: "#444" 
            };
        case 'PENDING_RECEIVED':
            return { 
                text: "Accetta richiesta", 
                icon: "person-add", 
                color: "#9966CC", 
                textColor: "#FFFFFF",
                borderColor: "#9966CC" 
            };
        default: // NONE
            return { 
                text: "Aggiungi", 
                icon: "person-add", 
                color: "#9966CC", 
                textColor: "#FFFFFF",
                borderColor: "#9966CC" 
            };
    }
  };

  const btnConfig = getButtonConfig();


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
               style={[
                   styles.friendButton, 
                   { backgroundColor: btnConfig.color, borderColor: btnConfig.borderColor, borderWidth: 1 }
               ]} 
               onPress={handleFriendAction}
               disabled={isLoadingAction}
             >
               {isLoadingAction ? (
                   <ActivityIndicator size="small" color={btnConfig.textColor} />
               ) : (
                   <>
                       <Ionicons name={btnConfig.icon as any} size={20} color={btnConfig.textColor} />
                       <Text style={[styles.buttonText, { color: btnConfig.textColor }]}>{btnConfig.text}</Text>
                   </>
               )}
             </TouchableOpacity>

             {/* Se siamo amici, mostra magari un tasto per rimuovere esplicitamente o altro, 
                 ma il toggle sopra gestisce già la logica principale (tap su "Amici" -> Rimuovi) */}
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