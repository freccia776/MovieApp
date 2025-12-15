import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

/**
 * Questa schermata viene mostrata all'avvio dell'app mentre
 * l'AuthContext controlla se esiste una sessione salvata.
 */
const SplashScreen = () => {
  // Il componente restituisce solo una View con un ActivityIndicator al centro.
  // Non c'è nessun testo "vagante" che possa causare l'errore.
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#9966CC" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A', // Usa lo sfondo del tuo tema per una transizione fluida
  },
});

export default SplashScreen;

