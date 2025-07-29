import React from "react";
import { SafeAreaView, ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import MovieCard from "../components/MovieCard"; // Assicurati che il percorso sia corretto


export default function ProfileScreen() {
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

  const bio = "Questa è una bio molto lunga che supera il limite di 80 caratteri e deve essere troncata per adattarsi al layout.";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileSection}>
          <Text style={styles.username}>Username</Text>
          <Image
            style={styles.profileImage}
            source={require("../img/profile.jpg")}
          />
          <Text style={styles.bio}>
            {bio.length > 80 ? `${bio.slice(0, 80)}` : bio}
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => Alert.alert("Link copiato negli appunti")}
            >
            <Text style={styles.buttonText}>copia link</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => Alert.alert("Impostazioni")}
            >
            <Text style={styles.buttonText}>imp</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sezione dei film preferiti */}
        <View>
          <Text style={styles.sezioneContainer}>Preferiti:</Text> 
          <View style={styles.moviesContainer}>
          {movies.slice(0, MaxFilmVisible).map((movie) => (  
              <MovieCard key={movie.id} movieItem={movie} />
            ))}


          <TouchableOpacity
              style={styles.mostraAltroButton}
              onPress={() => Alert.alert("mostra altro")}
            >
            <Text style={styles.buttonText}>mostra altro</Text>
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