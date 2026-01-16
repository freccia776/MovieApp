import { useState, useEffect } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootTabParamList } from '../types/types';
import Constants from 'expo-constants';
// 1. CONFIGURAZIONE "APP APERTA"
Notifications.setNotificationHandler({
  handleNotification: async () => ({
   shouldShowBanner: true, // <--- TRUE: Fa scendere la tendina
    shouldShowList: true,   // <--- TRUE: La aggiunge al centro notifiche
    shouldPlaySound: true,  // <--- TRUE: Suona
    shouldSetBadge: false,
  }),
});

type NavigationProp = NativeStackNavigationProp<RootTabParamList>

export const usePushNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const navigation = useNavigation<NavigationProp>(); 
  useEffect(() => {
    // A. Ottieni il Token
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // B. LISTENER "CLICK" (Opzionale)
    // TypeScript capisce da solo che 'responseListener' è di tipo Subscription
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      console.log("Utente ha cliccato la notifica:", data);
      // Qui potrai gestire la navigazione (es. vai alla pagina Richieste)
       // LOGICA DI NAVIGAZIONE
      if (data?.type === 'FRIEND_REQUEST') { //definito nel backend.
        // Naviga al Tab "Amici" passando il parametro per aprire subito la sezione Richieste
        // Assicurati che 'Amici' sia il nome esatto della rotta nel tuo TabNavigator
         navigation.navigate('FriendsStack', {screen: 'FriendsMain', params: {screen: 'Richieste'}});
      }

        // CASO 2: Richiesta Accettata -> Vai su "Amici" (la lista)
      else if (data?.type === 'FRIEND_ACCEPTED') {
        navigation.navigate('FriendsStack', {screen: 'FriendsMain', params: { screen: 'Amici' } 
        });
      }

    });

    return () => {
      // Pulizia del listener
      if (responseListener) {
        responseListener.remove();
      }
    };
  }, []);

  return { expoPushToken };
};

// --- Funzione standard per Permessi e Token ---
async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Permesso notifiche negato!');
      return;
    }

    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        
      /*Dice all'app: "Cerca il mio documento 
      d'identità nel portafoglio (expoConfig), 
      e se non c'è lì, guarda nella tasca (easConfig)". 
      Serve a garantire che le notifiche funzionino 
      in qualsiasi scenario.*/
      
      if (!projectId) {
         console.warn("Project ID non trovato.");
      }

      const tokenData = await Notifications.getExpoPushTokenAsync(
        projectId ? { projectId } : undefined
      );
      
      token = tokenData.data;
      console.log("Token ottenuto:", token);
    } catch (e) {
      console.error("Errore ottenimento token:", e);
    }

  } else {
    console.log('Serve un dispositivo fisico per le notifiche push');
  }

  return token;
}