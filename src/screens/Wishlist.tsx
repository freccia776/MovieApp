import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { ProfileStackParamList } from "../types/types";
import { useWishlist } from "../context/WishlistContext";
import { getCardbyId, GenericCard } from "../api/tmdb";
import FavoriteCard from "../components/FavoriteCard";


type WishlistProps = NativeStackScreenProps<ProfileStackParamList, "Wishlist">;

export default function Wishlist({ route, navigation}: WishlistProps) {
  const username = route.params?.username;
  const { wishlist } = useWishlist(); //uso il context per prendere la wishlist
  const [isLoading, setIsLoading] = useState(false);
  const [favoriteCards, setFavoriteCards] = useState<GenericCard[]>([]);

  // 🔁 Caricamento dati quando cambia la wishlist
  useEffect(() => {
    const fetchFavoriteDetails = async () => {
      setIsLoading(true);

      const moviePromises = Array.from(wishlist.movieIds).map((id) =>
        getCardbyId(id, "movie")
      );
      const seriePromises = Array.from(wishlist.tvShowIds).map((id) =>
        getCardbyId(id, "serietv")
      );

      try {
        const results = await Promise.all([...moviePromises, ...seriePromises]);
        const validResults = results.filter((item) => item !== null) as GenericCard[];
        setFavoriteCards(validResults);
      } catch (error) {
        console.error("Errore nel caricamento dei dettagli della wishlist:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteDetails();
  }, [wishlist]);

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
        
        <Text style={styles.headerTitle}>Preferiti</Text>
        
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
