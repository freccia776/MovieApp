
import React, { useState, useEffect }from 'react';
import { ActivityIndicator } from 'react-native';
import { Image } from 'react-native';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView} from 'react-native';
import { FilmContentProps } from '../types/types';
import {getContentById, ContentDetails } from '../api/tmdb'; //importo il tipo ContentDetails che ho creato nel file tmdb.tsx
//importo direttamente le filmprops che ho creato nel types.tsx


//mi collego alla schermata FilmContent e prendo le props
export default function FilmContent({route}: FilmContentProps) { 
    
const [loading, setLoading] = useState(true);
const [content, setContent] = useState<ContentDetails | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      const data = await getContentById((route.params.movieId), "movie"); 
      setContent(data);
      setLoading(false);
    };

    /*
     //POTEVO FARLO ANCHE COSI
    useEffect(() => {
  getContentById(route.params.movieId, "movie")
    .then(setContent)
    .catch(console.error);
    }, [route.params.movieId]);

    */
    fetchContent();
  }, [route.params.movieId]);
    // ^ si riesegue ogni volta che cambia l’id (es. se passi da un film all'altro

  if (loading) {  //!!MODOFICARE LA LOADING !!!!!!!!!!!!!!!!!!!!!1
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#710dd4ff" />
        <Text>Caricamento {route.params.movieId} </Text>
      </View>
    );
  }

  if (!content) { // MODIFICARE !!!!!!!!!!1
    return (
      <View style={styles.container}>
        <Text>Errore: contenuto non trovato</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ alignItems: "center" }}>
      <Text style={styles.title}>{content.title}</Text>
      <Image source={{ uri: content.image }} style={styles.image} />
      <Text style={styles.info}>Anno: {content.anno}</Text>
      {content.durata && <Text style={styles.info}>Durata: {content.durata} min</Text>}
      <Text style={styles.overview}>{content.overview}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
  overview: {
    fontSize: 14,
    marginTop: 15,
    lineHeight: 20,
  },
  image:{
        height: 300,
        width: 200,
        borderRadius: 10,
        marginBottom: 15,
  },
});