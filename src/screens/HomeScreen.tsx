import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavigatorType from '../navigation/NavigatorType';

const APP_NAME = "MovieApp"; // NOME App

export default function HomeScreen() {
  return (
    // Questo contenitore SafeArea ora occupa l'intera altezza dello schermo
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Anche questa View si espande per riempire la SafeAreaView,
        permettendo al NavigatorType di occupare tutto lo spazio rimanente.
      */}
      <View style={styles.contentWrapper}>
        <Text style={styles.nameApp}>{APP_NAME}</Text>
        <NavigatorType />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A", // Sfondo scuro coerente
    // Rimossi i bordi di debug
  },
  contentWrapper: {
    flex: 1,
    paddingTop: 10,
    gap: 15,
    // Rimossi i bordi di debug
  },
  nameApp: {
    textAlign: "center",
    fontSize: 24, // Leggermente più grande
    fontWeight: "bold",
    color: "#FFFFFF", // Testo bianco
    marginBottom: 10,
    textShadowColor: "#9966CC", // Effetto glow viola
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,

  },
});