import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// 1. Importiamo i nostri Provider
import { AuthProvider } from './src/context/AuthContext';
import { WishlistProvider } from './src/context/WishlistContext';
// 2. Importiamo il nostro navigatore "intelligente"
import AppNavigator from './src/navigation/AppNavigator';


//con authprovider e useeffect quando il componente si avvia controlla se c'è una sessione salvata.
//wishlistprovider fornisce lo stato della wishlist a tutta l'app e si munisce di authcontext per fare fetch autenticati.
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#1A1A1A"
      />
      
      {/* AuthProvider deve avvolgere WishlistProvider perché la wishlist
        dipende dallo stato di autenticazione dell'utente.
      */}
      <AuthProvider> 
        <WishlistProvider>
          <AppNavigator />
        </WishlistProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

