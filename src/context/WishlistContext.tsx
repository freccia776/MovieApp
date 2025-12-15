import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

import { useAuth } from './AuthContext';
import { fetchWithAuth } from '../api/fetchWithAuth';
import Constants from 'expo-constants'; // Per accedere alle variabili di configurazione
// Definiamo la forma dello stato che il nostro contesto gestirà
interface WishlistState {
  movieIds: Set<number>; // Usiamo un Set per controlli istantanei (più veloce di un array)
  tvShowIds: Set<number>; //.has al posto di .include
}

// Definiamo cosa esporrà il nostro contesto
interface WishlistContextType {
  wishlist: WishlistState;
  fetchWishlist: () => Promise<void>; // Funzione per caricare i dati
  addMovie: (movieId: number) => void; // Funzioni per aggiornare lo stato localmente
  removeMovie: (movieId: number) => void;
  addTvShow: (tvShowId: number) => void; // --- AGGIUNTO ---
  removeTvShow: (tvShowId: number) => void; // --- AGGIUNTO ---
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// --- CONFIGURAZIONE ---
// Spostiamo la logica dell'API URL qui, così è riutilizzabile

const API_URL = Constants.expoConfig?.extra?.API_URL;

// Creiamo il Provider
export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistState>({
    movieIds: new Set(),
    tvShowIds: new Set(),
  });

  const {setTokens, signOut} = useAuth();

  // Funzione per caricare gli ID dal backend
  const fetchWishlist = useCallback(async () => {
    if (!API_URL){
       console.error("API_URL non definito in WishlistContext"); 
       return;
    }
    try {
      const response = await fetchWithAuth(
        '/wishlist/ids',
        {}, ///opzioni ( default GET)
        {setTokens, signOut} //passiamo le funzioni di out
      );
       
      if (response.ok) {
        const data = await response.json();
        setWishlist({
          movieIds: new Set(data.movieIds),
          tvShowIds: new Set(data.tvShowIds),
        });
      }
    } catch (error) {
      console.error("Errore nel caricamento della wishlist:", error);
    }
  }, [setTokens, signOut]); // Le dipendenze della funzione

  // --- FUNZIONI PER I FILM ---
  const addMovie = useCallback((movieId: number) => {
    setWishlist(prev => ({ ...prev, movieIds: new Set(prev.movieIds).add(movieId) }));
  }, []);
  const removeMovie = useCallback((movieId: number) => {
    setWishlist(prev => {
      const newSet = new Set(prev.movieIds);
      newSet.delete(movieId);
      return { ...prev, movieIds: newSet };
    });
  }, []);

  // --- FUNZIONI PER LE SERIE TV (Complete) ---
  const addTvShow = useCallback((tvShowId: number) => {
    setWishlist(prev => ({ ...prev, tvShowIds: new Set(prev.tvShowIds).add(tvShowId) }));
  }, []);
  const removeTvShow = useCallback((tvShowId: number) => {
    setWishlist(prev => {
      const newSet = new Set(prev.tvShowIds);
      newSet.delete(tvShowId);
      return { ...prev, tvShowIds: newSet };
    });
  }, []);

  // Forniamo tutte le funzioni nel value del provider
  const value = { wishlist, fetchWishlist, addMovie, removeMovie, addTvShow, removeTvShow };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

// Hook personalizzato per usare il contesto
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist deve essere usato dentro un WishlistProvider');
  }
  return context;
};

//QUESTO CONTEXT CI RITORNA GLI ID DELLA WISHLIST E LE FUNZIONI PER AGGIUNGERE/RIMUOVERE FILM E SERIE TV