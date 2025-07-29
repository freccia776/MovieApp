import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MovieCard from './MovieCard';

interface Movie {
  id: number;
  title: string;
  image: string;
}

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  maxVisible?: number;
}

const MovieSection: React.FC<MovieSectionProps> = ({ title, movies, maxVisible = 9 }) => {
  return (
        <View>
          <Text style={styles.sezioneContainer}>{title}</Text> 
          <View style={styles.moviesContainer}>
          {movies.slice(0, maxVisible).map((movie) => (  
              <MovieCard key={movie.id} movieItem={movie} />
            ))}
          </View>
        </View>
      
  );
};
const styles = StyleSheet.create({
 
  scrollContainer: {
    flexGrow: 1, 
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

  

});
export default MovieSection;
