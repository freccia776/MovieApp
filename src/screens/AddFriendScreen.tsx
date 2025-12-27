import React, { useState } from 'react';
import { useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, FlatList, ActivityIndicator, RefreshControl  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import FriendCard from '../components/FriendCard';
import { fetchWithAuth } from '../api/fetchWithAuth';
import { useAuth } from '../context/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FriendsStackParamList } from '../types/types';

type NavigationProp = NativeStackNavigationProp<FriendsStackParamList>;


interface SentRequestData {
  id: number;
  status: 'PENDING';
  addressee: {
    id: number;
    username: string;
    profileImageUrl?: string | null;
  };
}


export function AddFriendScreen() {
    
    const navigation = useNavigation<NavigationProp>();
    const { setTokens, signOut } = useAuth();

    // Stato Input
    const [targetUsername, setTargetUsername] = useState(""); // Input text

    // Stato Dati
    const [sentRequests, setSentRequests] = useState<SentRequestData[]>([]);
    
    // Stato Caricamento e Paginazione
    const [isLoadingInitial, setIsLoadingInitial] = useState(true); // Caricamento prima volta
    const [isSending, setIsSending] = useState(false); // Caricamento invio richiesta
    const [isFetchingMore, setIsFetchingMore] = useState(false); // Caricamento paginazione
    const [isRefreshing, setIsRefreshing] = useState(false); // Pull to refresh

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    
    // ----------------------------------------------------------------
    // 1. FETCH RICHIESTE INVIATE (GET)
    // ----------------------------------------------------------------
    const fetchSentRequests = async (pageNumber: number, shouldRefresh: boolean = false) => {
      try {
        if (shouldRefresh) {
            setIsRefreshing(true);
        } else if (pageNumber > 1) {
            setIsFetchingMore(true);
        }

        const response = await fetchWithAuth(
          `/friends/sent?page=${pageNumber}&limit=20`,
          { method: 'GET' },
          { setTokens, signOut }
        );

        if (response.ok) {
          const data = await response.json();
          
          // Verifica se abbiamo finito i dati (se ne arrivano meno di 20)
          if (data.length < 20) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }

          if (shouldRefresh || pageNumber === 1) {
            setSentRequests(data);
          } else {
            // Aggiungi i nuovi dati ai vecchi, filtrando eventuali duplicati per sicurezza
            setSentRequests(prev => {
                const newIds = new Set(data.map((d: SentRequestData) => d.id));
                const filteredPrev = prev.filter(p => !newIds.has(p.id));
                return [...filteredPrev, ...data];
            });
          }
        } else {
            console.error("Errore fetch pending requests");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingInitial(false);
        setIsFetchingMore(false);
        setIsRefreshing(false);
      }
    };

    // Caricamento iniziale
    useEffect(() => {
        fetchSentRequests(1, false);
    }, []);

    // ----------------------------------------------------------------
    // 2. INVIA NUOVA RICHIESTA (POST)
    // ----------------------------------------------------------------
    const handleSendRequest = async () => {
        if (!targetUsername.trim()) return;

        setIsSending(true);
        try {

            
            // NOTA: Verifica che la rotta '/friends/request' sia corretta nel tuo backend
            // e che si aspetti un body JSON con { username: string }
            const response = await fetchWithAuth(
                '/friends/request', 
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ targetUsername: targetUsername.trim() })
                },
                { setTokens, signOut }
            );

            const responseData = await response.json();

            if (response.ok) {
                Alert.alert("Successo", "Richiesta inviata!");
                setTargetUsername(""); // Pulisci input
                
                // RESETTA E RICARICA LA LISTA
                // Impostiamo pagina 1 e ricarichiamo tutto per far apparire la nuova richiesta
                setPage(1);
                fetchSentRequests(1, true); 
            } else {
                Alert.alert("Errore", responseData.message || "Impossibile inviare la richiesta");
            }
        } catch (error) {
            Alert.alert("Errore", "Errore di connessione");
            console.error(error);
        } finally {
            setIsSending(false);
        }
    };

    
    // ----------------------------------------------------------------
    // 3. CANCELLA RICHIESTA (DELETE)
    // ----------------------------------------------------------------
    const handleDeleteRequest = async (friendshipId: number) => {
        try {
            // Supponiamo che la rotta sia /friends/{id} dove id è l'id della friendship
            const response = await fetchWithAuth(
                `/friends/${friendshipId}`,
                { 
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                },
                { setTokens, signOut }
            );

            if (response.ok) {
                // Rimuovi l'elemento dalla lista locale per aggiornare la UI istantaneamente
                setSentRequests(prev => prev.filter(req => req.id !== friendshipId));
                // Opzionale: Alert.alert("Cancellata", "Richiesta annullata con successo");
            } else {
                const errorData = await response.json();
                Alert.alert("Errore", errorData.message || "Impossibile annullare la richiesta");
            }
        } catch (error) {
            console.error("Errore delete:", error);
            Alert.alert("Errore", "Si è verificato un errore di rete");
        }
    };

    // ----------------------------------------------------------------
    // 3. GESTORI UI
    // ----------------------------------------------------------------
    const clearSearch = () => {
        setTargetUsername("");
    };

    const handleLoadMore = () => {
        if (!isFetchingMore && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchSentRequests(nextPage);
        }
    };

    const handleRefresh = () => {
        setPage(1);
        setHasMore(true);
        fetchSentRequests(1, true);
    };

    

    // Render per ogni item della lista
    const renderRequestItem = ({ item }: { item: SentRequestData }) => (
      
        <FriendCard 
            friendItem={{ 
                id: item.addressee.id, 
                username: item.addressee.username, 
                image: item.addressee.profileImageUrl || "https://via.placeholder.com/150" 
                
            }} 
            type="pending"
            // Passiamo una funzione che chiama handleDeleteRequest con l'ID dell'AMICIZIA (item.id),
            // non l'ID dell'utente (item.addressee.id).
            onDelete={() => handleDeleteRequest(item.id)}
            onPressCard={() => navigation.navigate("FriendProfile", { userId: item.addressee.id })}
        />
    );
    return (

        <SafeAreaView style={styles.safecontainer}>
            <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} >
                        <Ionicons name="arrow-back" size={28} color="#9966CC" />
                    </TouchableOpacity>
                    <View style={styles.inputContainer}>
                      
            
                       <TextInput
                        style={styles.input}
                        value={targetUsername}
                        onChangeText={setTargetUsername}
                        placeholder="Inserisci username..."
                        placeholderTextColor="#A0A0A0"
                        returnKeyType="send"
                        onSubmitEditing={handleSendRequest} // Invia quando premi "Invio" sulla tastiera
                    />

                    {targetUsername !== "" && (
                        <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
                            <Ionicons name="close-circle" size={20} color="#9966CC" />
                        </TouchableOpacity>
                    )}
                    </View>
            
                    <TouchableOpacity 
                        style={styles.addButton}
                        onPress={handleSendRequest}
                        disabled={isSending}
                    >
                       {isSending ? (
                        <ActivityIndicator size="small" color="#9966CC" />
                    ) : (
                        <Ionicons name="send-outline" size={24} color="#9966CC" />
                    )}

                    </TouchableOpacity>
                  </View>
            
            <View>
               
            </View>
             <View style={styles.container}>
                <Text style={styles.title}>Inviate ({sentRequests.length})</Text>
                
                {isLoadingInitial ? (
                    <ActivityIndicator size="large" color="#9966CC" style={{ marginTop: 20 }} />
                ) : (
                    <FlatList
                        style = {styles.flatList}
                        data={sentRequests}
                        renderItem={renderRequestItem}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        
                        // Gestione Refresh (tirare giù)
                        refreshControl={
                            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#9966CC" />
                        }

                        // Gestione Paginazione (scorrere in basso)
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={
                            isFetchingMore ? <ActivityIndicator size="small" color="#9966CC" style={{ marginVertical: 10 }} /> : null
                        }
                        ListEmptyComponent={
                            <Text style={{ color: 'gray', textAlign: 'center', marginTop: 20 }}>Nessuna richiesta in attesa.</Text>
                        }
                    />
                )}
            </View>
            
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    safecontainer: {
        flex: 1,
        backgroundColor: '#1A1A1A',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        marginBottom: 10,
        gap: 12,
        marginTop: 10,
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2D2D2D',
        borderRadius: 25,
        height: 50,
        shadowColor: "#9966CC",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(153, 102, 204, 0.3)',
        paddingHorizontal: 15,
    },
    input: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
        paddingVertical: 12,
    },
    clearButton: {
        padding: 5,
        marginLeft: 5,
    },
    addButton: {
        backgroundColor: 'rgba(153, 102, 204, 0.2)',
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(153, 102, 204, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#9966CC",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    container: {
        flex: 1,
        backgroundColor: '#1A1A1A',
    },
     flatList: {
    flex: 1, // Occupa tutto lo spazio disponibile sotto l'header
  },
    listContent: {
        flexGrow: 1,
        paddingHorizontal: 15,
        paddingBottom: 30,
        gap: 10,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#9966CC',
        paddingBottom: 10,
        textShadowColor: 'rgba(153, 102, 204, 0.3)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
        marginHorizontal: 40,
    },
});

/*
 const styles =  StyleSheet.create({

    safecontainer: {
        flex: 1,
        backgroundColor: '#1A1A1A',
    },

    headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 20,
    gap: 12,
    marginTop: 10,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D2D2D',
    borderRadius: 25,
    height: 50,
    shadowColor: "#9966CC",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(153, 102, 204, 0.3)',
    paddingHorizontal: 15,
  },
  searchIcon: {
    padding: 5,
    marginRight: 10,
    backgroundColor: 'rgba(153, 102, 204, 0.1)',
    borderRadius: 20,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 12,
  },
  clearButton: {
    padding: 5,
    marginLeft: 5,
  },
  addButton: {
    backgroundColor: 'rgba(153, 102, 204, 0.2)',
    padding: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(153, 102, 204, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    
    shadowColor: "#9966CC",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },

    container:{
        flex: 1,
      
        backgroundColor: '#1A1A1A',
       
    },
      scrollContent: {
    flexGrow: 1, // Permette al contenuto di espandersi
    paddingHorizontal: 15,
    paddingBottom: 30,
    marginTop: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',

    marginBottom: 18,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#9966CC',
    paddingBottom: 10,
    textShadowColor: 'rgba(153, 102, 204, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  friendsContainer: {
    alignItems: 'center', // Centra gli elementi orizzontalmente
    gap: 10, // Spazio tra le card
  },

  
 });
 */