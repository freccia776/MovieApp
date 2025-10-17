
import React, { useState,  useEffect }from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView, ActivityIndicator} from 'react-native';
import FilmCategory from "../components/FilmCategory"
import { SafeAreaView } from 'react-native-safe-area-context';
import { Movie } from '../api/tmdb';
import { Serie } from '../api/tmdb';
import { Ionicons } from '@expo/vector-icons'; 
import { searchMovies, searchSeries } from '../api/tmdb';
import MovieSection from '../components/MovieSection';
import SerieSection from '../components/SerieSection';



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




export default function SearchScreen() {
  

  const [text, setText] = useState<string>("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Serie[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
  const maxVisible = 6; //massimo visibile per serie e film //DA OTTIMIZZARE

  
  //USARE USEEFFECT
    useEffect(() => {
    if (text.trim() === "") {
      setMovies([]);
      setSeries([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    /*
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
*/

   const handler = setTimeout(() => {
    const fetchData = async () => {
      const [moviesData, seriesData] = await Promise.all([
        searchMovies(text),
        searchSeries(text)
      ]);
      setMovies(moviesData);
      setSeries(seriesData);
      setLoading(false);
    };
    
    fetchData();
  }, 300);

  return () => {
    clearTimeout(handler);
    setLoading(false);
  };
}, [text]);

  
  const clearSearch = () => {
    setText("");
    setMovies([]);
    setSeries([]);
    setLoading(false);
  };
 

  

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.inputContainer}>
        <View style={styles.searchIcon}>
          <Ionicons name="search" size={22} color="#9966CC" />
        </View>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Cerca film o serie TV..."
          placeholderTextColor="#A0A0A0"
          returnKeyType="search" // Mostra il tasto "Cerca" sulla tastiera
        />
        {text !== "" && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={clearSearch}
          >
            <Ionicons name="close-circle" size={20} color="#9966CC" />
          </TouchableOpacity>
        )}
      </View>

    {text === "" && ( //CONDIZIONE CHE SE IL TESTO E' VUOTO MOSTRA LE CATEGORIE
      <View style = {styles.categoryContainer}>
         <Text style={styles.categoriesTitle}>Categorie</Text>
         <ScrollView 
            style={styles.categoriesScroll} 
            contentContainerStyle={styles.categoriesContent}
            showsVerticalScrollIndicator={false}
            >
            
           {categories.map((category) => (
              <FilmCategory key={category.id} categoryItem={category} />

          ))}

        </ScrollView> 
      </View>

      )}


       {/* Loading durante la ricerca */}
       {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9966CC" />
          <Text style={styles.loadingText}>Ricerca in corso...</Text>
        </View>
      )}



      {/* Risultati della ricerca */}  
       {text !== "" && !loading && ( //CONDIZIONE
           <ScrollView 
              style={styles.resultsContainer}
              contentContainerStyle={styles.resultsContent}
              showsVerticalScrollIndicator={false}
            >


           <Text style={styles.resultsTitle}>Risultati per: "{text}"</Text>
          {/* LISTA DEI RISULTATI */}
           <MovieSection title="Film" movies={movies} maxVisible={maxVisible} />
           <SerieSection name="Serie TV" series={series} maxVisible={maxVisible} />
           
            {/* Messaggio nessun risultato */}
          {movies.length === 0 && series.length === 0 && (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>Nessun risultato trovato</Text>
            </View>
          )}
           
           </ScrollView>
      
      )}
      

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#1A1A1A',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#2D2D2D',
    marginHorizontal: 20,
    borderRadius: 25,
    height: 50,
    shadowColor: "#9966CC",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#3A3A3A',
    marginBottom: 20,
  },
  searchIcon: {
    padding: 5,
    marginRight: 10,
    backgroundColor: 'rgba(153, 102, 204, 0.1)',
    borderRadius: 20,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 12,
  },
  clearButton: {
    padding: 5,
    marginLeft: 10,
  },
  categoryContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  categoriesTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  categoriesScroll: {
    width: '100%',
  },
  categoriesContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 16,
    opacity: 0.7,
  },
  resultsContainer: {
    flex: 1,
    width: '100%',
  },
  resultsContent: {
    paddingBottom: 50,
    alignItems: 'center',
  },
  resultsTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  noResults: {
    paddingVertical: 50,
    alignItems: 'center',
  },
  noResultsText: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.7,
  },
});