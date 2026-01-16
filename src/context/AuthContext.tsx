//QUESTO CONTEXT SERVE PER GESTIRE L'AUTENTICAZIONE DELL'UTENTE NELL'APP REACT NATIVE USANDO EXPO SECURE STORE

import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
// RIMOSSO: import { secureHeapUsed } from 'crypto'; (Non funziona su React Native!)

// La definizione di User
interface User {
  id: number;
  email: string;
  username: string;
  firstName?: string | null;
  lastName?: string | null;
  age?: number | null;
  profileImageUrl?: string | null;
  bio?: string | null;
}

// La definizione di AuthContextType
interface AuthContextType {
  user: User | null;
  accessToken: string | null;   
  refreshToken: string | null; 
  isLoading: boolean;
  signIn: (accessToken: string, refreshToken: string, userData: User) => Promise<void>;
  signOut: () => Promise<void>;
  //setAccessToken: (newAccessToken: string | null) => Promise<void>; // È definito qui...
    // Permette di aggiornare solo alcuni campi dell'utente (es. solo la foto)
  // --- MODIFICA 1: Aggiunto userInfo come parametro opzionale (?) ---
  setTokens: (access: string, refresh: string, userInfo?: User) => Promise<void>;
  updateUser: (updatedData: Partial<User>) => Promise<void>;
}

//INIZIALMENTE È INDEFINITO
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//IL PROVIDER CONTIENE LO STATO DELL'AUTENTICAZIONE E LE FUNZIONI PER GESTIRLA
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null); 
  const [refreshToken, setRefreshTokenState] = useState<string | null>(null); 
  const [isLoading, setIsLoading] = useState(true);


  /*useEffect esegue codice dopo il render del componente. 
  Nel tuo AuthContext serve a ripristinare l'autenticazione all'avvio dell'app. */

  useEffect(() => { 
    const restoreAuthState = async () => {
      try {
        const storedAccessToken = await SecureStore.getItemAsync('accessToken');
        const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');
        const storedUser = await SecureStore.getItemAsync('userData');

        if (storedAccessToken && storedRefreshToken && storedUser) {
          const userData: User = JSON.parse(storedUser); //si fa parse perchè è salvato come stringa
          setAccessTokenState(storedAccessToken);
          setRefreshTokenState(storedRefreshToken);
          setUser(userData);
        }
      } catch (e) {
        console.error('Errore nel ripristino dei dati di autenticazione', e);
      } finally {
        setIsLoading(false); //is loading diventa false !!!!!???? aggiungere possibile controllo 
      }
    };

    restoreAuthState(); //lancia la funzione dentro use Effect
  }, []);

  // Funzione per il LOGIN
  const signIn = async (newAccess: string, newRefresh: string, userData: User) => {
    setAccessTokenState(newAccess);
    setRefreshTokenState(newRefresh);
    setUser(userData);
    await SecureStore.setItemAsync('accessToken', newAccess);
    //serve per salvare i token in modo persistente su il dispositivo con SecureStore
    await SecureStore.setItemAsync('refreshToken', newRefresh);
    await SecureStore.setItemAsync('userData', JSON.stringify(userData));
  };

  // Funzione per il LOGOUT
  const signOut = async () => {
    setAccessTokenState(null);
    setRefreshTokenState(null); 
    setUser(null);
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken'); 
    await SecureStore.deleteItemAsync('userData');
  };


  /*
  // FUNZIONE PER AGGIORNARE SOLO ACCESS TOKEN
  const setAccessToken = async (newAccess: string | null) => {
    setAccessTokenState(newAccess);
    if (newAccess) {
        await SecureStore.setItemAsync('accessToken', newAccess);
    } else {
        await SecureStore.deleteItemAsync('accessToken');
    }
  };

  */

  //FUNZIONE PER AGGIORNARE ENTRAMBI I TOKEN con possibile passaggio userinfo
  const setTokens = async (newAccess: string, newRefresh: string, userInfo?: User) => {
    // 1. Aggiorniamo sempre i token (Stato + SecureStore)
    setAccessTokenState(newAccess);
    setRefreshTokenState(newRefresh);
    await SecureStore.setItemAsync('accessToken', newAccess);
    await SecureStore.setItemAsync('refreshToken', newRefresh);

    // 2. NUOVO: Se ci viene passato anche l'utente (es. dal Social Login), aggiorniamo anche lui!
    if (userInfo) {
        setUser(userInfo);
        await SecureStore.setItemAsync('userData', JSON.stringify(userInfo));
    }
  };

  
  // --- IMPLEMENTAZIONE updateUser ---
  // Questa è la funzione che mancava!
  const updateUser = async (updatedData: Partial<User>) => {
    if (!user) return; // Se non c'è utente, non facciamo nulla
    
    // 1. Creiamo un nuovo oggetto utente unendo i vecchi dati con quelli nuovi
    const newUser = { ...user, ...updatedData };
    
    // 2. Aggiorniamo lo stato dell'app (così la UI si aggiorna subito)
    setUser(newUser);
    
    // 3. Aggiorniamo la memoria persistente (così al riavvio i dati sono nuovi)
    await SecureStore.setItemAsync('userData', JSON.stringify(newUser));
  };

  // --- CORREZIONE QUI SOTTO ---
  // Ho aggiunto setAccessToken all'oggetto value
  const value = { 
      user, 
      accessToken, 
      refreshToken, 
      isLoading, 
      signIn, 
      signOut, 
      setTokens,
      updateUser,
      //setAccessToken // <--- MANCAVA QUESTO!
  }; 

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  
};

export const useAuth = () => {
  const context = useContext(AuthContext); 
  if (context === undefined) {
    throw new Error('useAuth deve essere usato all\'interno di un AuthProvider');
  }
  return context;
};

/*

Avvio app:
  user = null, accessToken = null, refreshToken = null, isLoading = true
  ↓
restoreAuthState carica da SecureStore:
  Se trova dati → user = User, accessToken = "token...", refreshToken = "token...", isLoading = false
  Se non trova → user = null, accessToken = null, refreshToken = null, isLoading = false
  ↓
Utente accede (signIn):
  user = User, accessToken = "newToken", refreshToken = "newToken"
  ↓
Utente esce (signOut):
  user = null, accessToken = null, refreshToken = null
  */
