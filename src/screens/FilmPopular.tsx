import React from 'react';
import { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import MovieSection from '../components/MovieSection';
import { getPopularMovies, getNowPlayingMovies, Movie } from "../api/tmdb";


export default function FilmPopular() {


  
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
//BISOGNA MODIFICARE FILM POPULAR.TSX E TMDB.TS
  
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [newMovies, setNewMovies] = useState<Movie[]>([]);
  const MaxFilmVisible = 3;

  useEffect(() => {
    getPopularMovies().then(setPopularMovies);
    getNowPlayingMovies().then(setNewMovies);
  }, []);


/*
  //const MaxFilmVisible = 3; // Numero massimo di film da visualizzare
  const title= "Film Popolari"; // Titolo della sezione
  const title2= "Film Nuovi"; // Titolo della sezione */

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      <MovieSection title="Film Popolari" movies={popularMovies} maxVisible={MaxFilmVisible} />
      <MovieSection title="Film Nuovi" movies={newMovies} maxVisible={MaxFilmVisible} />
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