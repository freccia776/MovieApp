import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import MovieSection from '../components/MovieSection';

export default function SeriePopular() {
 //PARAMETRI
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
const title= "Serie Popolari"; // Titolo della sezione
const title2= "Serie Nuovi"; // Titolo della sezione

return (
  <SafeAreaView style={styles.container}>
      <ScrollView>
      <MovieSection title={title} movies={movies} maxVisible={MaxFilmVisible} />
      <MovieSection title={title2} movies={movies} maxVisible={MaxFilmVisible} />
      </ScrollView>
    </SafeAreaView>
);
}


const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: "#f9f9f9",
},

});