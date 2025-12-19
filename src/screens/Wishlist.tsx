import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { ProfileStackParamList } from "../types/types";
import { useWishlist } from "../context/WishlistContext";
import { getCardbyId, GenericCard } from "../api/tmdb";
import FavoriteCard from "../components/FavoriteCard";
import { useAuth } from "../context/AuthContext";
import { fetchWithAuth } from "../api/fetchWithAuth";

type WishlistProps = NativeStackScreenProps<ProfileStackParamList, "Wishlist">;


// Definiamo il tipo per la risposta dell'API della wishlist
interface WishlistApiResponse {
  movieIds: number[];
  tvShowIds: number[];
}
export default function Wishlist({ route, navigation}: WishlistProps) {
  //const username = route.params?.username; 
  const friendUserId = route.params?.userId; 
  const friendUsername = route.params?.username;

  const { wishlist } = useWishlist(); //uso il context per prendere la wishlist
  const {setTokens, signOut} = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [favoriteCards, setFavoriteCards] = useState<GenericCard[]>([]);

  
  // --- FUNZIONE HELPER PER EVITARE DUPLICAZIONI ---
  // Prende gli array di ID e restituisce i dettagli completi da TMDB
  const fetchDetailsFromTMDB = async (movieIds: number[], tvShowIds: number[]) => {
      const moviePromises = movieIds.map((id) => getCardbyId(id, "movie"));
      const seriePromises = tvShowIds.map((id) => getCardbyId(id, "serietv"));
      
      const results = await Promise.all([...moviePromises, ...seriePromises]);
      return results.filter((item) => item !== null) as GenericCard[];
  };

  // 🔁 Caricamento dati quando cambia la wishlist
  useEffect(() => {
    const fetchFavoriteDetails = async () => {
      setIsLoading(true);
      try{

        let finalMovieIds: number[] = [];
        let finalTvShowIds: number[] = [];

        if(friendUserId){ //se è definito l'userId del friend, carico la sua wishlist prendo i valori da data dopo la fetch
           const response = await fetchWithAuth(
             `/wishlist/user/${friendUserId}`, 
             { method: 'GET' }, 
             { setTokens, signOut }
            );

          if(response.ok){
                  const data = await response.json() as WishlistApiResponse;
                  finalMovieIds = Array.from(data.movieIds);
                  finalTvShowIds = Array.from(data.tvShowIds);

          }

          } else{ //altrimenti carico la mia wishlist, prendo i valori da wishlist nel context

             finalMovieIds = Array.from( wishlist.movieIds);
            finalTvShowIds = Array.from( wishlist.tvShowIds);
          
          }

            // Una volta che abbiamo gli ID (da una fonte o dall'altra), chiamiamo TMDB
        // CORRETTO: Uso il nome corretto della funzione definita sopra
        const validResults = await fetchDetailsFromTMDB(finalMovieIds, finalTvShowIds);
        
        // Opzionale: Ordina i risultati (es. per titolo o data)
        // validResults.sort((a, b) => a.title.localeCompare(b.title));
        
        setFavoriteCards(validResults);
         
        
        
      } catch (error) {
        console.error("Errore nel caricamento dei dettagli della wishlist:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteDetails();
  }, [friendUserId, wishlist]);

  // 🔑 Estrattore della chiave per FlatList
  const keyExtractor = useCallback((item: GenericCard) => `${item.tipo}-${item.id}`, []);

  // 🧩 Render di ogni elemento
  const renderItem = useCallback(({ item }: { item: GenericCard }) => (
    <FavoriteCard card={item} />
  ), []);

  return (
    
    <SafeAreaView style={styles.container}> 
       {/* --- HEADER PERSONALIZZATO --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        
       <Text style={styles.headerTitle}>
          {friendUsername ? `Wishlist di ${friendUsername}` : "La mia Wishlist"}
        </Text>
        
        {/* View vuota per bilanciare lo spazio e centrare il titolo */}
        <View style={{ width: 28 }} />
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#9966CC" style={{ marginTop: 40 }} />
      ) : favoriteCards.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nessun preferito ancora</Text>
        </View>
      ) : (
        
        <FlatList
          data={favoriteCards}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          numColumns={2} // 🔹 Mostra 2 card per riga (puoi modificare)
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
        
      )}  
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  loadingIndicator: {
    marginTop: 40,
  },
  // Stili per l'header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  backButton: {
    padding: 5, // Aumenta l'area cliccabile
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 30,
    paddingTop: 10,
  },
  columnWrapper: {
    justifyContent: "center", // Centrale
    gap: 10, // Spazio fisso tra le card
    marginBottom: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#A0A0A0",
    fontSize: 18,
    textAlign: "center",
    opacity: 0.8,
  },

});
