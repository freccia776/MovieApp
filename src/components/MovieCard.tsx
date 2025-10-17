import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

interface Movie {
    id: number;
    title: string;
    image: string;
  }


  interface MovieCardProps {
  movieItem: Movie;
  onPress?: () => void; //tra le proprietà di moviecard aggiungiamo la funzione onPress con il TouchableOpacity
}

const MovieCard = ({ movieItem, onPress }: MovieCardProps) => {

    if (!movieItem || !movieItem.image || !movieItem.title) {
        return null; // Non renderizzare nulla se i dati non sono validi
      }
    
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} disabled={!onPress} style={styles.card}>

      <Image source={{ uri: movieItem.image }} style={styles.image} />
      <Text style={styles.title}>{movieItem.title}</Text>
   
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  card: {
    backgroundColor: "#2D2D2D", // Sfondo scuro coerente
    borderRadius: 12,
    padding: 10,
    margin: 5,
    width: "30%",
    shadowColor: "#9966CC", // Ombra viola
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(153, 102, 204, 0.2)", // Bordo viola sottile
  },
  image: {
    width: "100%",
    height: 130,
    borderRadius: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    textAlign: "center",
    color: "#FFFFFF", // Testo bianco
  },
});

export default MovieCard;