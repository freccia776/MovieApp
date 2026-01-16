import React from 'react';
import SeriePopular from '../screens/SeriePopular';
import FilmPopular from '../screens/FilmPopular';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();



export default function NavigatorType() {
  return (
     <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { 
          fontSize: 14, 
          fontWeight: '600',
          color: '#FFFFFF' // Testo bianco
        },
        tabBarIndicatorStyle: { 
          backgroundColor: '#9966CC' // Viola coerente
        },
        tabBarStyle: { 
          backgroundColor: '#2D2D2D' // Sfondo scuro della tab bar
        },
        tabBarActiveTintColor: '#9966CC', // Colore attivo viola
        tabBarInactiveTintColor: '#A0A0A0', // Colore inattivo grigio
      }}
    >
        <Tab.Screen name="Film Popolari" component={FilmPopular} />
        <Tab.Screen name="Serie Popolari" component={SeriePopular} />
    </Tab.Navigator>
  );
}




 