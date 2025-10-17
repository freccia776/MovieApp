import React from "react";
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import MovieCard from "../components/MovieCard"; 
import { ProfileStackParamList } from "../types/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";


type WishlistProps = NativeStackScreenProps<ProfileStackParamList, 'Wishlist'>;

export default function Wishlist({route}: WishlistProps) {
  const movies = [
    { id: 1, title: "Inception", image: "https://via.placeholder.com/150" },
    { id: 2, title: "Interstellar", image: "https://via.placeholder.com/150" },
    { id: 3, title: "The Dark Knight", image: "https://via.placeholder.com/150" },
    { id: 4, title: "Tenet", image: "https://via.placeholder.com/150" },
    { id: 5, title: "Dunkirk", image: "https://via.placeholder.com/150" },
    { id: 6, title: "The Hangover", image: "https://via.placeholder.com/150" },
    { id: 7, title: "Spiderman", image: "https://via.placeholder.com/150" },
    { id: 8, title: "IronMan", image: "https://via.placeholder.com/150" },
    { id: 9, title: "Thor", image: "https://via.placeholder.com/150" },
    { id: 10, title: "Captain America", image: "https://via.placeholder.com/150" },

  ];

  const MaxFilmVisible = 8; // Numero massimo di film da visualizzare

    const { username } = route.params;

    // In futuro, useresti questo username per fare una chiamata API:
    // useEffect(() => {
    //   fetchWishlistForUser(username).then(setData);
    // }, [username]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Sezione dei film preferiti */}
        <View>
          <Text style={styles.sezioneContainer}>Preferiti: di {username}</Text> 
          <View style={styles.moviesContainer}>
            {/*RIEMPIRE I FILM CON LA PROPRIA LISTA PREFRITI FARE CHIAMATA FETCH DATABASE */}
          {movies.slice(0, MaxFilmVisible).map((movie) => (  
              <MovieCard key={movie.id} movieItem={movie} />
            ))}

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    marginTop: 20,
  },
  bio: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
 
  moviesContainer: {
    flexDirection: "row", // Allinea le schede in orizzontale
    flexWrap: "wrap", // Permette il wrapping delle MovieCard
    //justifyContent: "space-between", // Spaziatura tra le schede
    paddingHorizontal: 10,
    marginBottom: 30,
    //justifyContent: "center",
  },

  sezioneContainer: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 20,
  },

  buttonContainer: {
    flexDirection: "row",
    gap: 10,

  

  },

  button: {
    alignItems: "center",
    backgroundColor: "#9966CC",
    padding: 10,
    marginTop: 20,
    borderRadius: 30,
    width: 100,
    height: 40,
  },


  buttonText: {
    color: "#fff",
  },

  settingsButton: {
    alignItems: "center",
    backgroundColor: "#9966CC",
    padding: 10,
    marginTop: 20,
    borderRadius: 30,
    width: 40,
    height: 40,
  },

  mostraAltroButton: {
    alignItems: "center",
    backgroundColor: "#9966CC",
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    width: 100,
    height: 40,
    marginLeft: 20,
  },



});