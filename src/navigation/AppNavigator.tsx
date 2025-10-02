import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MediaContent from '../screens/MediaContent';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types';


const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator<RootStackParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {/* Le tab principali */}
      <RootStack.Screen name="Tabs" component={TabNavigator} />
      {/* Content è globale, raggiungibile ovunque */}
      <RootStack.Screen name="Content" component={MediaContent} />
    </RootStack.Navigator>
  );
}

const tabScreenOptions = {
  headerShown: false,
  tabBarStyle: { backgroundColor: '#fff' },
  tabBarActiveTintColor: 'blue',
  tabBarInactiveTintColor: 'gray',
};