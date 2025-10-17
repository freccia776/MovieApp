import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MediaContent from '../screens/MediaContent';
import Wishlist from '../screens/Wishlist';
import { 
  HomeStackParamList, 
  SearchStackParamList, 
  ProfileStackParamList, 
  RootTabParamList 
} from '../types/types';

const Tab = createBottomTabNavigator<RootTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const SearchStack = createNativeStackNavigator<SearchStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

// Stack per la tab Home
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="Content" component={MediaContent} />
    </HomeStack.Navigator>
  );
}

// Stack per la tab Search
function SearchStackNavigator() {
  return (
    <SearchStack.Navigator screenOptions={{ headerShown: false }}>
      <SearchStack.Screen name="SearchMain" component={SearchScreen} />
      <SearchStack.Screen name="Content" component={MediaContent} />
    </SearchStack.Navigator>
  );
}

// Stack per la tab Profile
function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen name="Content" component={MediaContent} />
      <ProfileStack.Screen name="Wishlist" component={Wishlist} />
    </ProfileStack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen 
        name="HomeStack" 
        component={HomeStackNavigator} 
         options={{ 
          title: 'Home',
          // 2. Aggiungiamo l'opzione tabBarIcon
          tabBarIcon: ({ focused, color, size }) => {
            const iconName = focused ? 'home' : 'home-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        }} 
      />
      <Tab.Screen 
        name="SearchStack" 
        component={SearchStackNavigator} 
        options={{ 
          title: 'Search',
          tabBarIcon: ({ focused, color, size }) => {
            const iconName = focused ? 'search' : 'search-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        }} 
      />
      <Tab.Screen 
        name="ProfileStack" 
        component={ProfileStackNavigator} 
       options={{ 
          title: 'Profile',
          tabBarIcon: ({ focused, color, size }) => {
            const iconName = focused ? 'person-circle' : 'person-circle-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        }} 
      />
    </Tab.Navigator>
  );
}

const tabScreenOptions = {
  headerShown: false,
  tabBarStyle: { backgroundColor: '#1A1A1A' },
  tabBarActiveTintColor: '#9966CC',
  tabBarInactiveTintColor: '#9966CC',
};

