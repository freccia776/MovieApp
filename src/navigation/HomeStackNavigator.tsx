import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import FilmContent from '../screens/FilmContent';
import { RootStackParamList } from '../types/types';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function HomeStackNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="HomeTab" component={HomeScreen} />
      <RootStack.Screen
        name="FilmContent"
        component={FilmContent}
        initialParams={{ movieId: 0 }}
      />
    </RootStack.Navigator>
  );
}
