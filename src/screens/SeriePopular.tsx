import React from 'react';
import { useEffect, useState, useCallback } from "react";
import { StyleSheet, ScrollView, RefreshControl} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
const [refreshing, setRefreshing] = useState(false);
const MaxSeriesVisibile = 3;


//CARICAMENTO INIZIALE
useEffect(() => {
    getNewSeries().then(setNewSeries);
    getPopularSeries().then(setPopularSeries);
}, []);

 //(onRefresh).

  const onRefresh = useCallback(async () => {
    setRefreshing(true); // Mostra l'indicatore di caricamento

    // Esegue nuovamente le chiamate API per ottenere i dati più recenti
    const [newSeriesData, popularSeriesData] = await Promise.all([
      getNewSeries(),
      getPopularSeries()
    ]);
    setNewSeries(newSeriesData);
    setPopularSeries(popularSeriesData);

    setRefreshing(false); // Nasconde l'indicatore alla fine
  }, []); 




  /*
const MaxFilmVisible = 3; // Numero massimo di film da visualizzare
const title= "Serie Popolari"; // Titolo della sezione
const title2= "Serie Nuovi"; // Titolo della sezione
*/
return (
  <SafeAreaView style={styles.container}>
     <ScrollView 
        refreshControl={
          <RefreshControl
            refreshing={refreshing} // Collega lo stato di 'refreshing' al componente
            onRefresh={onRefresh}     // Dice al componente quale funzione chiamare
            colors={["#9966CC", "#7A4FA3"]}
            tintColor={"#9966CC"} // Colori dell'indicatore (opzionale) // Colori dell'indicatore (opzionale)
            progressBackgroundColor="#2D2D2D" // Sfondo scuro per l'indicatore
          />
        }
      >
      <SerieSection name="Serie Nuove" series={newSeries} maxVisible={MaxSeriesVisibile} />
      <SerieSection name="Serie Popolari" series={popularSeries} maxVisible={MaxSeriesVisibile} />
      </ScrollView>
    </SafeAreaView>
);
}


const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: "#1A1A1A",
},

});