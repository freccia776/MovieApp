import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FilmContent from '../screens/FilmContent';
import HomeStackNavigator from './HomeStackNavigator';
const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (

    <Tab.Navigator screenOptions={tabScreenOptions} >
      <Tab.Screen name="Home" component={HomeStackNavigator} /> 
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    
    </Tab.Navigator>
  );

 
  
}

const tabScreenOptions = {
    headerShown: false,
    tabBarStyle: { backgroundColor: '#fff' },
    tabBarActiveTintColor: 'blue',
    tabBarInactiveTintColor: 'gray',
  };
