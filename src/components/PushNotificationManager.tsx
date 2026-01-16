import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { fetchWithAuth } from '../api/fetchWithAuth';

export default function PushNotificationManager() {
  const { expoPushToken } = usePushNotifications();
  // Nota: Assicurati che userId sia esposto dal tuo useAuth, altrimenti usa l'access token per verificare il login
  const { user, setTokens, signOut } = useAuth(); 

  useEffect(() => {

    console.log("sono dentro useffect salvataggio token");
    // Funzione interna per registrare il token
    const registerToken = async () => {
      
      // Procediamo solo se abbiamo un token valido e un utente loggato
      if (expoPushToken && user?.id) { 
       
        try {
          console.log("Tentativo invio token al backend:", expoPushToken);
          
          await fetchWithAuth(
            '/user/push-token',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: expoPushToken })
            },
            { setTokens, signOut }
          );

          
          
          console.log("Push Token salvato/aggiornato con successo!");
        } catch (error) {
          console.error("Errore durante il salvataggio del push token:", error);
        }
      }
    };

    registerToken();
  }, [expoPushToken, user?.id]); // Riesegue se cambia il token o l'utente fa login/logout

  // Questo componente non renderizza nulla di visibile
  return null;
}