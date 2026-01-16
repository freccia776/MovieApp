import React from 'react';
import { View, Text, StyleSheet, ScrollView} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
//import NavigatorFriends from '../navigation/NavigatorFriends';
import FriendsTab from './FriendsTab';
import RequestFriendsTab from './RequestFriendsTab';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

export default function NavigatorFriends() {


   return (
    // Spostiamo qui la SafeAreaView che avevi in FriendsScreen
    <SafeAreaView style={styles.container} edges={['top']}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: '#2D2D2D' }, // Colore header tab
          tabBarActiveTintColor: '#9966CC',
          tabBarInactiveTintColor: 'gray',
          tabBarIndicatorStyle: { backgroundColor: '#9966CC' },
         
        }}
      >
        <Tab.Screen name="Amici" component={FriendsTab} />
        <Tab.Screen name="Richieste" component={RequestFriendsTab} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
});