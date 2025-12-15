
import React, { useState, useEffect }from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { Image } from 'react-native';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView} from 'react-native';

import {getContentById, ContentDetails } from '../api/tmdb'; //importo il tipo ContentDetails che ho creato nel file tmdb.tsx

import { ContentProps } from '../types/types'; //importo props
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import Constants from 'expo-constants';
const API_URL = Constants.expoConfig?.extra?.API_URL;
import { Ionicons } from '@expo/vector-icons';
import { fetchWithAuth } from '../api/fetchWithAuth';
//mi collego alla schermata FilmContent e prendo le props
export default function MediaContent({ route }: ContentProps) {
  
/*
  function onPress() { //SIMULAZIONE AGGIUNTA AI PREFERITI
  console.log("Aggiunto ai preferiti " + route.params.id);
  }
  */  

const [content, setContent] = useState<ContentDetails | null>(null);
const [isLoadingContent, setIsLoadingContent] = useState(true);
const [isUpdatingWishlist, setIsUpdatingWishlist] = useState(false);


//HOOKS

const {user, setTokens, signOut} = useAuth();
const {wishlist, addMovie, removeMovie, addTvShow, removeTvShow} = useWishlist();
//wishlist contiene wishlist.movieIds e wishlist.tvShowIds

const {id: mediaId, type} = route.params; //estraggo id e type da route.params


useEffect(() => {
  const fetchContent = async () => {
    setIsLoadingContent(true);
  
     const data = await getContentById(mediaId, type === 'film' ? 'movie' : 'serietv');

    setContent(data);
    setIsLoadingContent(false);
  };

  fetchContent();
}, [mediaId, type]); 
    // ^ si riesegue ogni volta che cambia l’id e il type (es. se passi da un film all'altro

const isFavorite = type === 'film'
  ? wishlist.movieIds.has(mediaId)
  : wishlist.tvShowIds.has(mediaId);


  const handleToggleWishlist = async() =>{
    if (!user){
     Alert.alert("Attenzione", "Devi effettuare il login per aggiungere elementi alla tua wishlist.");
      return;
    }

    setIsUpdatingWishlist(true);

    try{

      const rottapi = type === 'film' ? '/wishlist/movies' : '/wishlist/tvshows';
      const body = type === 'film' ? {movieId: mediaId} : {tvShowId: mediaId};
      const authFunctions = {setTokens, signOut};

      let response;
      if(isFavorite){

       response = await fetchWithAuth(
        `${rottapi}/${mediaId}`, 
          { method: 'DELETE' },  //rimuovo dalla wishlist
          authFunctions

       );
        if (!response.ok) throw new Error(`Errore nella rimozione dalla wishlist.`);
        
        // Se l'API ha successo, aggiorniamo lo stato locale
        type === 'film' ? removeMovie(mediaId) : removeTvShow(mediaId);


      } else {
        response = await fetchWithAuth(
          rottapi,
          {
            method: 'POST', //aggiungo alla wishlist
            body: JSON.stringify(body),
          },
          authFunctions
        );

         if (!response.ok) throw new Error(`Errore nell'aggiunta alla wishlist.`);
        // Se l'API ha successo, aggiorniamo lo stato locale
        type === 'film' ? addMovie(mediaId) : addTvShow(mediaId);
    }
  } catch(error){
      const errorMessage = error instanceof Error ? error.message : 'Si è verificato un errore.';
       if (errorMessage.includes("Sessione scaduta")) {
        console.log("Sessione scaduta, logout in corso...");
      } else {
        Alert.alert('Errore', errorMessage);
      }
    
    } finally {
      setIsUpdatingWishlist(false);
    }
  };
  

  if (isLoadingContent) {  //!!MODOFICARE LA LOADING !!!!!!!!!!!!!!!!!!!!!1
    return (
      
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#710dd4ff" />
      </SafeAreaView>
    );
  }

  if (!content) { // MODIFICARE !!!!!!!!!!1
    return (
      <SafeAreaView style={styles.container}>
          <Text style={styles.errorText}>Errore: contenuto non trovato</Text>
      </SafeAreaView>
    );
  }

   return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Image source={{ uri: content.image }} style={styles.image} />
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{content.title}</Text>
           
          {user && (
            <TouchableOpacity onPress={handleToggleWishlist} disabled={isUpdatingWishlist}>
              {isUpdatingWishlist ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Ionicons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={32}
                  color={isFavorite ? '#E91E63' : '#FFFFFF'}
                />
              )}
            </TouchableOpacity>
          )}
        </View> 

          
        

        <Text style={styles.info}>Anno: {content.anno}</Text>
        
        {type === "film" && content.durata && (
          <Text style={styles.info}>Durata: {content.durata} min</Text>
        )}
        
        {type === "serie" && (
          <>
            <Text style={styles.info}>Stagioni: {content.seasons}</Text>
            <Text style={styles.info}>Episodi: {content.episodes}</Text>
          </>
        )}  
        
        <Text style={styles.overview}>{content.overview}</Text> 
      </ScrollView>
    </SafeAreaView>
  );
}

// --- STILI AGGIORNATI PER IL TEMA SCURO ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    alignItems: 'center',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1, // Permette al testo di andare a capo se lungo
  },
  image: {
    height: 300,
    width: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  info: {
    fontSize: 16,
    color: '#ccc',
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  overview: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 15,
    lineHeight: 24,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});
