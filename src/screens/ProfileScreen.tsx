import React from "react";
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import MovieCard from "../components/MovieCard"; // Assicurati che il percorso sia corretto
import { ProfileStackParamList } from "../types/types";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack"; 
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';


// Definiamo le props per l'intera schermata (che includono 'route')
type ProfileScreenProps = NativeStackScreenProps<ProfileStackParamList, 'ProfileMain'>;

// STIAMO UTILIZZANDO NAVIGATION PROP MA IN REALTÀ FORSE DOBBIAMO USARE PROPS PERCHÈ DOVREMMO 
// PASSARE L'ID DEL PROFILO PER VEDERE LA LISTA PREFERITI DI OGNI UTENTE QUANDO APRO IL SUO PROFILO
type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

export default function ProfileScreen({ route }: ProfileScreenProps) {
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

  const MaxFilmVisible = 3; // Numero massimo di film da visualizzare
  const bio = "Questa è una bio molto lunga che supera il limite di 80 caratteri e deve essere troncata per adattarsi al layout.";
  const navigation = useNavigation<NavigationProp>();

  //IL PRIMO SERVE PER IL DEEPLINKING :
  //IL SECONDO INVECE DOVREBBE ESSERE PRESO DALLA SESSIONE DELL'UTENTE LOGGATO
  const username = route.params?.username || "UtenteEsempio"; // Username fittizio dell'utente loggato
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileSection}>
            <Text style={styles.username}>{username}</Text>
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
              <Ionicons name="copy-outline" size={24} color="white" />
              <Text style={styles.buttonText}>Condividi</Text>
          </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => Alert.alert("Impostazioni")} 
            >
              <Ionicons name="create-outline"  size={24} color="white" />
           
            </TouchableOpacity>
          </View>
        </View>

        {/* Sezione dei film preferiti */}
        <View>
          <Text style={styles.sezioneContainer}>Preferiti recenti:</Text> 
          <View style={styles.moviesContainer}>
          {movies.slice(0, MaxFilmVisible).map((movie) => (  
              <MovieCard key={movie.id} movieItem={movie} />
            ))}


          <TouchableOpacity
              style={styles.mostraAltroButton}
              onPress={() => navigation.navigate("Wishlist", { username: username })}
            >
            <Text style={styles.buttonText}>Mostra tutti</Text>
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(153, 102, 204, 0.2)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#9966CC",
    gap: 8,
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
});