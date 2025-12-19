import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FriendsTab from '../screens/FriendsTab';
import RequestFriendsTab from '../screens/RequestFriendsTab';


const Tab = createMaterialTopTabNavigator();


export default function NavigatorFriends(){
  return (
    <Tab.Navigator>
      <Tab.Screen name="Amici" component={FriendsTab} />
      <Tab.Screen name="Richieste" component={RequestFriendsTab} />
    </Tab.Navigator>
  )
}
