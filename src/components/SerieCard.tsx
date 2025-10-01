import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface Serie {
    id: number;
    name: string;
    image: string;
}


const SerieCard = ({ serieItem } : { serieItem: Serie }) => {

    if (!serieItem || !serieItem.image || !serieItem.name) {
        return null; // Non renderizzare nulla se i dati non sono validi
      }
    
  return (
    <View style={styles.card}>
      <Image source={{ uri: serieItem.image }} style={styles.image} />
      <Text style={styles.title}>{serieItem.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    margin: 5,
    width: "30%", // Adatta la larghezza per il wrapping
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
   
  },
  image: {
    width: "100%",
    height: 130,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
});

export default SerieCard;