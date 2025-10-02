import React from 'react';
import { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import SerieSection from '../components/SerieSection';
import { getNewSeries, getPopularSeries, Serie } from "../api/tmdb";


export default function SeriePopular() {
 //PARAMETRI

 /*
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

*/

const [newSeries, setNewSeries] = useState<Serie[]>([]);
const [popularSeries, setPopularSeries] = useState<Serie[]>([]);
const MaxSeriesVisibile = 3;



useEffect(() => {
    getNewSeries().then(setNewSeries);
    getPopularSeries().then(setPopularSeries);
}, []);

  /*
const MaxFilmVisible = 3; // Numero massimo di film da visualizzare
const title= "Serie Popolari"; // Titolo della sezione
const title2= "Serie Nuovi"; // Titolo della sezione
*/
return (
  <SafeAreaView style={styles.container}>
      <ScrollView>
      <SerieSection name="Serie Nuove" series={newSeries} maxVisible={MaxSeriesVisibile} />
      <SerieSection name="Serie Popolari" series={popularSeries} maxVisible={MaxSeriesVisibile} />
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