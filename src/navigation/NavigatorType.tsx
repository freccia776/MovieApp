import React from 'react';
import SeriePopular from '../screens/SeriePopular';
import FilmPopular from '../screens/FilmPopular';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const Tab = createMaterialTopTabNavigator();



export default function NavigatorType() {
  return (
    <Tab.Navigator
    screenOptions={{
        tabBarLabelStyle: { fontSize: 14 },
        tabBarIndicatorStyle: { backgroundColor: 'purple' },
        tabBarStyle: { backgroundColor: '#fff' },
        
      }}
    >
        <Tab.Screen name="Film Popolari" component={FilmPopular} />
        <Tab.Screen name="Serie Popolari" component={SeriePopular} />
    </Tab.Navigator>
  );
}


 