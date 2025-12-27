import React, {useEffect} from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// --- NUOVI IMPORT PER L'AUTENTICAZIONE ---
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/authScreens/LoginScreen';
import RegisterScreen from '../screens/authScreens/RegisterScreen';
import SplashScreen from '../screens/SplashScreen'; 

// --- IMPORT ESISTENTI ---
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MediaContent from '../screens/MediaContent';
import Wishlist from '../screens/Wishlist';
import EditProfile from '../screens/EditProfile';
import FriendsScreen from '../screens/FriendsScreen';
import FriendProfileScreen from '../screens/FriendProfileScreen';
import {useWishlist} from '../context/WishlistContext';
import { 
  HomeStackParamList, 
  SearchStackParamList, 
  ProfileStackParamList, 
  RootTabParamList,
  RootStackParamList
  
} from '../types/types'; // Assicurati che questi tipi siano definiti
import { FriendsStackParamList } from '../types/types';
import { AddFriendScreen } from '../screens/AddFriendScreen';
// --- DEFINIZIONE DEL TEMA ---
// Spostiamo il DarkTheme qui, così è legato alla navigazione.
const DarkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#1A1A1A',
    card: '#2D2D2D',      
    text: '#FFFFFF',      
    border: '#3A3A3A',     
    primary: '#9966CC',    
  },
};

/*

interface User { //NON SO SE È DA METTERE QUI MOMENTANEO
  id: number;
  email: string;
  username: string;
}

const user: User = {id: 123, email: "freccia776", username: "freccia776"}; ///MOMENTANEO */

// --- CREAZIONE DEI NAVIGATORI ---
// Creiamo un navigatore extra solo per le schermate di autenticazione
const RootStack = createNativeStackNavigator<RootStackParamList>();

const Tab = createBottomTabNavigator<RootTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const SearchStack = createNativeStackNavigator<SearchStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

//FRIENDS STACK
const FriendsStack = createNativeStackNavigator<FriendsStackParamList>();

// --- COMPONENTE PER LA NAVIGAZIONE PRINCIPALE (LE TUE TAB) ---
// Ho preso il tuo codice e l'ho messo in un componente separato per pulizia.
function MainAppTabs() {
  const tabScreenOptions = {
    headerShown: false,
    tabBarStyle: { backgroundColor: DarkTheme.colors.card },
    tabBarActiveTintColor: DarkTheme.colors.primary,
    tabBarInactiveTintColor: 'gray',
  };

  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen 
        name="HomeStack" 
        component={HomeStackNavigator} 
        options={{ 
          title: 'Home',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }} 
      />
      <Tab.Screen 
        name="SearchStack" 
        component={SearchStackNavigator} 
        options={{ 
          title: 'Search',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={size} color={color} />
          ),
        }} 
      />
      <Tab.Screen 
        name="FriendsStack" 
        component={FriendsStackNavigator} 
        options={{ 
          title: 'Friends',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'people' : 'people-outline'} size={size} color={color} />
           

          ),
        }} 
      />
      <Tab.Screen 
        name="ProfileStack" 
        component={ProfileStackNavigator} 
        options={{ 
          title: 'Profile',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'person-circle' : 'person-circle-outline'} size={size} color={color} />
          ),
        }} 
      />
    </Tab.Navigator>
  );
}



// --- IL "REGISTA" PRINCIPALE ---
export default function AppNavigator() {
  const { user, accessToken, isLoading } = useAuth(); 
  const {fetchWishlist} = useWishlist();

  // --- 4. ECCO LA LOGICA useEffect ---
  // Questo hook si attiva quando il componente viene montato e ogni volta che `user` o `token` cambiano.
  useEffect(() => {
    // Se l'utente è loggato (cioè `user` e `token` esistono)...
    if (user && accessToken) {
      // ...allora chiamiamo la funzione per caricare la sua wishlist.
      console.log("Utente autenticato. Caricamento della wishlist...");
      fetchWishlist();
    }
  }, [user, accessToken, fetchWishlist]); // L'array di dipendenze: l'effetto si riesegue solo se questi valori cambiano.

  // 1. Se stiamo ancora caricando lo stato di autenticazione, mostra lo splash screen.
  if (isLoading) {
    return <SplashScreen/>;
  }

  // 2. Mettiamo qui l'UNICO NavigationContainer
  return (
    // L'UNICO NavigationContainer dell'app.
    <NavigationContainer theme={DarkTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // Se l'utente è loggato, mostra il navigatore principale con le Tab.
          <RootStack.Screen name="MainApp" component={MainAppTabs} />
        ) : (
          // Se l'utente NON è loggato, mostra le schermate di autenticazione.
          // In questo modo, LoginScreen riceverà la prop "navigation".
          <>
            <RootStack.Screen name="Login" component={LoginScreen} />
            <RootStack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}


// --- DEFINIZIONI DEGLI STACK INTERNI (il tuo codice, invariato) ---

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="Content" component={MediaContent} />
    </HomeStack.Navigator>
  );
}

function SearchStackNavigator() {
  return (
    <SearchStack.Navigator screenOptions={{ headerShown: false }}>
      <SearchStack.Screen name="SearchMain" component={SearchScreen} />
      <SearchStack.Screen name="Content" component={MediaContent} />
    </SearchStack.Navigator>
  );
}

function FriendsStackNavigator() {
  return ( 
    <FriendsStack.Navigator screenOptions={{ headerShown: false }}>
      <FriendsStack.Screen name="FriendsMain" component={FriendsScreen} />
      <FriendsStack.Screen name="Content" component={MediaContent} />
      <FriendsStack.Screen name="AddFriend" component={AddFriendScreen} />
      <FriendsStack.Screen name="FriendProfile" component={FriendProfileScreen} />
      <ProfileStack.Screen name="Wishlist" component={Wishlist} />
    </FriendsStack.Navigator>

  )
}


function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen name="Content" component={MediaContent} />
      <ProfileStack.Screen name="Wishlist" component={Wishlist} />
      <ProfileStack.Screen name="EditProfile" component={EditProfile} />
      <FriendsStack.Screen name="FriendProfile" component={FriendProfileScreen} />
    </ProfileStack.Navigator>
  );
}

