import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';


const DarkTheme = {
  ...DefaultTheme, // Copia tutte le proprietà del tema di default di react (...) 
  colors: {
    ...DefaultTheme.colors, // Copia tutti i colori di default
    background: '#1A1A1A', // ...e poi sovrascrive quelli che vuoi cambiare
    card: '#2D2D2D',      
    text: '#FFFFFF',      
    border: '#3A3A3A',     
    primary: '#9966CC',    
  },
};

export default function App() {
  return (
    <SafeAreaProvider> 
        <StatusBar 
        barStyle="light-content"  //: Imposta il colore del testo della status bar (su iOS)
        backgroundColor="#1A1A1A" //: Imposta il colore di sfondo della status bar (su Android)
        />
      <NavigationContainer theme={DarkTheme} >
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

