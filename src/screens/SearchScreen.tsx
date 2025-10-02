
import React, { useState,  useEffect }from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView} from 'react-native';
import FilmCategory from "../components/FilmCategory"
import { Movie } from '../api/tmdb';
import { Serie } from '../api/tmdb';
import { searchMovies, searchSeries } from '../api/tmdb';
import MovieSection from '../components/MovieSection';
import SerieSection from '../components/SerieSection';



export default function SearchScreen() {
  

  const [text, setText] = useState<string>("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Serie[]>([]);
  const maxVisible = 6; //massimo visibile per serie e film //DA OTTIMIZZARE

  
  //USARE USEEFFECT
    useEffect(() => {
    if (text.trim() === "") {
      setMovies([]);
      setSeries([]);
      return;
    }

    const fetchData = async () => {
      try {
        const moviesData = await searchMovies(text);
        const seriesData = await searchSeries(text);
        setMovies(moviesData);
        setSeries(seriesData);
      } catch (err) {
        console.error("Errore nella ricerca:", err);
      }
    };

    fetchData();
  }, [text]);

 

  //CATEGORIE
  const categories = [
    {id :1 , title: "Azione"},
    {id :2 , title: "Avventura"},  
    {id :3 , title: "Commedia"},
    {id :4 , title: "Drammatico"},
    {id :5 , title: "Fantascienza"},
    {id :6 , title: "Horror"},
    {id :7 , title: "Romantico"},
    {id :8 , title: "Thriller"},
    {id :9 , title: "Animazione"},
    {id :10 , title: "Documentario"},
   
  ];

  

  return (
    <View style={styles.container}>
       <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Scrivi qualcosa..."
        />
      </View>
    {text === "" && ( //CONDIZIONE CHE SE IL TESTO E' VUOTO MOSTRA LE CATEGORIE
      <View style = {styles.categoryContainer}>
        <ScrollView style={{ width: "100%" }} contentContainerStyle={{ alignItems: 'center' }}>
          {categories.slice(0, categories.length).map((category) => (
            <FilmCategory key={category.id} categoryItem={category} />

          ))}

        </ScrollView>
      </View>

      )}

       {text !== "" && ( //CONDIZIONE
        <View>
           <ScrollView style={{ width: "100%" , marginBottom: 50}} contentContainerStyle={{ alignItems: 'center' }}>
          <Text>Risultati per: {text}</Text>
          {/* qui potresti mettere la lista dei risultati */}
           <MovieSection title="Film" movies={movies} maxVisible={maxVisible} />
           <SerieSection name="Serie TV" series={series} maxVisible={maxVisible} />
           </ScrollView>
        </View>
      )}
      

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    
  },
  input: {
    flex: 1,
    borderColor: '#9966CC',
    borderWidth: 1,
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 5,
    marginRight: 10,
  },

  buttoninput: {
    backgroundColor: '#9966CC',
    borderRadius: 5,
    borderWidth: 1,
    padding: 10,
    height: 40,
    width: 70,
    alignItems: 'center',
  },


  buttontext:{
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  categoryContainer: {
    marginTop: "2%",
    marginBottom: "12%",
    alignItems: 'center',
    width: "100%",
  
    
  },
 
});