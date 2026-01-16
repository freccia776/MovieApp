import { NativeStackScreenProps } from '@react-navigation/native-stack';




export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainApp: undefined; // Questa è la schermata che contiene le Tab      
  SetUsername: { 
    socialToken: string;
    provider: 'google' | 'apple';
    email?: string;
    firstName?: string;
    lastName?: string;
  };
};
// Un tipo condiviso per i parametri della rotta Content
export type ContentRouteParams = {
  id: number;
  type: 'film' | 'serie';
};

// Parametri per lo Stack che vive DENTRO la tab "Home"
export type HomeStackParamList = {
  HomeMain: undefined;
  Content: ContentRouteParams;
};

// Parametri per lo Stack che vive DENTRO la tab "Search"
export type SearchStackParamList = {
  SearchMain: undefined;
  Content: ContentRouteParams;
};

// Parametri per lo Stack che vive DENTRO la tab "Profile"
export type ProfileStackParamList = {
  // ProfileMain ora può ricevere un 'username' (per i link pubblici)
  // o niente (per il profilo dell'utente loggato). L'userId interno non viene più esposto qui.
  ProfileMain: { username?: string } | undefined;
  Content: ContentRouteParams;
  // Wishlist ora riceve l'username per sapere di chi è la lista da mostrare.
  // In futuro, la WishlistScreen userà questo username per chiedere al server l'ID corretto.
  FriendProfile: { userId: number }; // ID dell'utente di cui vedere il profilo pubblico 
  Wishlist: { username?: string; userId?: number }; 
  EditProfile: undefined; 
  Settings: undefined;
  
};

// Parametri per lo Stack che vive DENTRO la screen "Friends"
export type FriendsStackParamList = {
  FriendsMain: undefined;
  AddFriend: undefined;
  Content: ContentRouteParams;
  FriendProfile: { userId: number }; // ID dell'utente di cui vedere il profilo pubblico 
  
  // Modifichiamo Wishlist per accettare userId (opzionale)
  Wishlist: { username?: string; userId?: number }; 
};
// 2. "MAPPA" PER LE TAB (Semplificata)
// Definisce le schermate del navigatore a schede. Ogni schermata è uno Stack a sé.
export type RootTabParamList = {
  HomeStack: undefined;
  SearchStack: undefined;

  FriendsStack: {
    screen: 'FriendsMain';
    params: {
       screen: 'Richieste' | 'Amici'; 
    };
  } | undefined;

  ProfileStack: undefined;
};
/*
// Parametri per il Tab Navigator principale, che ora punta a 3 stack diversi. (IN PRATICA È UNO STACK CON 3 STACK DENTRO VEDERE APPNAVIGATOR)
export type RootTabParamList = {
  HomeStack: { screen: string, params?: object }; // Aggiornato per consentire il passaggio di parametri
  SearchStack: { screen: string, params?: object }; 
  ProfileStack: { screen: string, params?: object };
};
*/



// Le props per la schermata Content.
// La leghiamo a HomeStackParamList; va bene perché la struttura dei parametri
// per 'Content' è identica in tutti gli stack.
export type ContentProps = NativeStackScreenProps<HomeStackParamList, 'Content'>;
