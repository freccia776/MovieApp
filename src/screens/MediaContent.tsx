
import React, { useState, useEffect }from 'react';
import { ActivityIndicator } from 'react-native';
import { Image } from 'react-native';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView} from 'react-native';

import {getContentById, ContentDetails } from '../api/tmdb'; //importo il tipo ContentDetails che ho creato nel file tmdb.tsx

import { ContentProps } from '../types/types'; //importo props



//mi collego alla schermata FilmContent e prendo le props
export default function MediaContent({ route }: ContentProps) {

  function onPress() { //SIMULAZIONE AGGIUNTA AI PREFERITI
  console.log("Aggiunto ai preferiti " + route.params.id);
  }
    
const [loading, setLoading] = useState(true);
const [content, setContent] = useState<ContentDetails | null>(null);

  useEffect(() => {
  const fetchContent = async () => {
    let data: ContentDetails | null = null;

    if (route.params.type === "film") {
      data = await getContentById(route.params.id, "movie");
    } else {
      data = await getContentById(route.params.id, "serietv"); 
    }

    setContent(data);
    setLoading(false);
  };

  fetchContent();
}, [route.params.id, route.params.type]); 
    // ^ si riesegue ogni volta che cambia l’id e il type (es. se passi da un film all'altro

  if (loading) {  //!!MODOFICARE LA LOADING !!!!!!!!!!!!!!!!!!!!!1
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#710dd4ff" />
        <Text>Caricamento {route.params.id} </Text>
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
      {/* Se film → durata */}
      {route.params.type === "film" && content.durata && (
        <Text style={styles.info}>Durata: {content.durata} min</Text>
      )}

      {/* Se serie → stagioni ed episodi */}
      {route.params.type === "serie" && (
        <>
          <Text style={styles.info}>Stagioni: {content.seasons}</Text>
          <Text style={styles.info}>Episodi: {content.episodes}</Text>
        </>
      )}
      
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text>Add</Text>
      </TouchableOpacity>
     
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
    marginTop: 50,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
  overview: {
    fontSize: 14,
    marginTop: 5,
    lineHeight: 20,
    marginBottom: 100, //ALLUNGARE
  },
  image:{
        height: 300,
        width: 200,
        borderRadius: 10,
        marginBottom: 15,
  },
  button: {
    backgroundColor: "#710dd4ff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 50,
    marginTop: 20,
  }
});

//HO UNICIZZATO TUTTO IN MODO CHE CONTENT POSSA APRIRE SERIE E FILM 02/10/2025