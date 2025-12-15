import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

//SCRIPT CHE CHIAMA LA FETCH VERIFICANDO E RINFRESCANDO IL TOKEN JWT

// Recuperiamo l'URL base dell'API dalla configurazione
const API_URL = Constants.expoConfig?.extra?.API_URL;


interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * Funzione interna per eseguire la chiamata API di refresh del token.
 * Contatta il backend per ottenere un nuovo access token.
 * @param currentRefreshToken Il refresh token attualmente salvato sul dispositivo.
 * @returns Il nuovo access token ricevuto dal backend, o null se il refresh fallisce.
 */

//CHIAMA API/REFRESH RESTITUISCE IL NUOVO ACCESS TOKEN
const refreshTokenApiCall = async (currentRefreshToken: string): Promise<RefreshResponse | null> => {
  // Se l'URL non è configurato, non possiamo fare il refresh.
  if (!API_URL) {
    console.error("API_URL non configurato in fetchWithAuth -> refreshTokenApiCall");
    return null;
  }
  try {
    // Chiama l'endpoint POST /api/auth/refresh
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Invia il refresh token nel corpo della richiesta
      body: JSON.stringify({ refreshToken: currentRefreshToken }),
    });
    const data = await response.json();

    // Se la risposta è OK e contiene il nuovo accessToken, lo restituiamo.
    if (response.ok && data.accessToken && data.refreshToken) {
       console.log('Rotation eseguita: Access e Refresh token aggiornati!');
      return {
       accessToken: data.accessToken,
       refreshToken: data.refreshToken
      };
    }
    // Se la risposta non è OK (es. 401 per refresh token non valido/scaduto), logghiamo l'errore.
    console.error('Refresh token fallito:', data.error || `Status: ${response.status}`);
    return null; // Il refresh è fallito.
  } catch (error) {
    // Se c'è un errore di rete durante il refresh.
    console.error("Errore di rete durante il refresh del token:", error);
    return null; // Il refresh è fallito.
  }
};

/**
 * Funzione wrapper per fetch che gestisce automaticamente il refresh del token JWT.
 * Sostituisce l'uso diretto di `fetch` per le chiamate API autenticate.
 * @param url L'endpoint API da chiamare (es. '/wishlist/ids'). Deve iniziare con '/'.
 * @param options Le opzioni standard per fetch (method, body, headers aggiuntivi, etc.).
 * @param authContext Un oggetto contenente le funzioni { setAccessToken, signOut } dall'AuthContext, necessarie per aggiornare lo stato e fare logout.
 * @returns La risposta della fetch (Response object).
 * @throws Lancia un errore specifico ("Sessione scaduta" o simile) se la chiamata fallisce anche dopo il refresh o se il refresh fallisce.
 */

//CHIAMATA FETCH
export const fetchWithAuth = async (
    url: string, 
    options: RequestInit = {}, 
    // Passiamo le funzioni necessarie dall'AuthContext
    authContext: { 
        setTokens: (access: string, refresh: string) => Promise<void>, 
        signOut: () => Promise<void> 
    } 
): Promise<Response> => {
    
    // Controllo preliminare sull'URL
    if (!API_URL) {
        console.error("API_URL non configurato in fetchWithAuth");
        throw new Error("Configurazione API non trovata.");
    }

    // --- PRIMO TENTATIVO DI CHIAMATA ---
    
    // 1. Recupera l'access token CORRENTE da SecureStore
    const accessToken = await SecureStore.getItemAsync('accessToken');
    
    // 2. Prepara gli header
    const headers = new Headers(options.headers || {}); 
    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }
    if (options.body && !headers.has('Content-Type') && typeof options.body === 'string') { // Assicurati che il body sia una stringa JSON
        headers.set('Content-Type', 'application/json');
    }

    // 3. Esegui la chiamata fetch iniziale
    let response = await fetch(`${API_URL}${url}`, { ...options, headers });

    // --- GESTIONE TOKEN SCADUTO (ERRORE 401) ---
    // Se la risposta è 401 Unauthorized, l'access token potrebbe essere scaduto.
    if (response.status === 401) {
        console.warn(`Ricevuto 401 Unauthorized per ${url}. Tentativo di refresh del token...`);
        
        // Recuperiamo il refresh token salvato
        const currentRefreshToken = await SecureStore.getItemAsync('refreshToken');
        
        // Se abbiamo un refresh token...
        if (currentRefreshToken) {
            // ...tentiamo di ottenere un nuovo access token chiamando la nostra funzione helper
            const newTokens = await refreshTokenApiCall(currentRefreshToken);

            // Se il refresh ha successo (abbiamo ricevuto un nuovo access token)...
            if (newTokens) {
                console.log("Refresh riuscito. Riprovo la chiamata originale...");
                
                // 1. Aggiorna l'access token nello stato globale e in SecureStore tramite la funzione del context
                await authContext.setTokens(newTokens.accessToken, newTokens.refreshToken); 
                
                // 2. Aggiorna l'header per la nuova chiamata
                headers.set('Authorization', `Bearer ${newTokens.accessToken}`);
                
                // --- SECONDO TENTATIVO DI CHIAMATA ---
                // Ritenta la chiamata originale ESATTAMENTE come prima, ma con il nuovo token.
                response = await fetch(`${API_URL}${url}`, { ...options, headers }); 
                console.log(`Chiamata a ${url} ritentata. Nuovo Status: ${response.status}`);

            } else {
                // Se il refresh token fallisce (es. è scaduto o non valido):
                console.error("Refresh token fallito o non valido. Logout in corso...");
                // Esegui il logout tramite la funzione del context
                await authContext.signOut(); 
                // Lancia un errore specifico per informare il componente chiamante.
                throw new Error("Sessione scaduta. Effettua nuovamente il login."); 
            }
        } else {
             // Se non avevamo nemmeno un refresh token salvato, non possiamo fare nulla. Logout.
             console.error("Refresh token non trovato localmente. Logout in corso...");
             await authContext.signOut();
             throw new Error("Sessione non valida. Effettua nuovamente il login.");
        }
    }

    // Restituisci la risposta finale (originale o quella ritentata)
    return response;
};


//CONTROLLATO È GIUSTA LA LOGICA

