import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import FriendCard from '../components/FriendCard';
import { fetchWithAuth } from '../api/fetchWithAuth';
import { useAuth } from '../context/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FriendsStackParamList } from '../types/types';
import { useNavigation } from '@react-navigation/native';
type NavigationProp = NativeStackNavigationProp<FriendsStackParamList>;



interface IncomingRequestData {
  id: number; // ID della friendship
  status: 'PENDING';
  requester: {
    id: number;
    username: string;
    profileImageUrl?: string | null;
  };
}

export default function RequestFriendsTab() {
const navigation = useNavigation<NavigationProp>();
 const { setTokens, signOut } = useAuth();

  // --- STATO ---
  const [requests, setRequests] = useState<IncomingRequestData[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // --- 1. FETCH RICHIESTE IN ARRIVO ---
  const fetchIncomingRequests = async (pageNumber: number, shouldRefresh: boolean = false) => {
    try {
      if (shouldRefresh) {
        setIsRefreshing(true);
      } else if (pageNumber > 1) {
        setIsFetchingMore(true);
      }

      // NOTA: Assumiamo che la rotta per le richieste IN ARRIVO sia '/friends/requests'
      // Verifica nel tuo backend se è questa o '/friends/incoming'
      const response = await fetchWithAuth(
        `/friends/pending?page=${pageNumber}&limit=20`,
        { method: 'GET' },
        { setTokens, signOut }
      );

      if (response.ok) {
        const data = await response.json();

        // Controllo fine dati
        if (data.length < 20) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        if (shouldRefresh || pageNumber === 1) {
          setRequests(data);
        } else {
          // Unione array evitando duplicati
          setRequests(prev => {
            const newIds = new Set(data.map((d: IncomingRequestData) => d.id));
            const filteredPrev = prev.filter(p => !newIds.has(p.id));
            return [...filteredPrev, ...data];
          });
        }
      } else {
        console.error("Errore fetch incoming requests");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingInitial(false);
      setIsFetchingMore(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchIncomingRequests(1, false);
  }, []);

  // --- 2. AZIONI (ACCETTA / RIFIUTA) ---

  const handleAccept = async (friendshipId: number) => {
    try {
      // Assumiamo metodo PATCH per aggiornare lo stato.
      // Alternativa: POST su /friends/{id}/accept
      const response = await fetchWithAuth(
        `/friends/${friendshipId}/accept`, //da modificare!!!!!!!!!!!!!!!!!!!!!
        {
          method: 'PATCH', // o PUT, dipende dal backend
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'ACCEPTED' })
        },
        { setTokens, signOut }
      );

      if (response.ok) {
        // Rimuovi dalla lista locale
        setRequests(prev => prev.filter(req => req.id !== friendshipId));//?? quindi la card la rimuove localmente in modo da non ricaricare più
        
      } else {
        Alert.alert("Errore", "Impossibile accettare la richiesta.");
      }
    } catch (error) {
      console.error("Errore accept:", error);
      Alert.alert("Errore", "Errore di connessione.");
    }
  };

  const handleDecline = async (friendshipId: number) => {

  
    try {
      const response = await fetchWithAuth(
        `/friends/${friendshipId}`,
        {
          method: 'DELETE',
        },
        { setTokens, signOut }
      );


      if (response.ok) {
        setRequests(prev => prev.filter(req => req.id !== friendshipId)); //rimozione locale
      } else {
        Alert.alert("Errore", "Impossibile rifiutare la richiesta.");
      }
    } catch (error) {
      console.error("Errore decline:", error);
    }
  };

  // --- 3. GESTORI LISTA ---

  const handleRefresh = () => {
    setPage(1);
    setHasMore(true);
    fetchIncomingRequests(1, true);
  };

  const handleLoadMore = () => {
    if (!isFetchingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchIncomingRequests(nextPage);
    }
  };

  const renderItem = ({ item }: { item: IncomingRequestData }) => (
    <FriendCard
      friendItem={{
        id: item.requester.id,
        username: item.requester.username,
        image: item.requester.profileImageUrl || "https://via.placeholder.com/150"
      }}
      type="request"
      onAccept={() => handleAccept(item.id)}
      onDecline={() => handleDecline(item.id)}
      
      onPressCard={() => navigation.navigate("FriendProfile", { userId: item.requester.id })}
    />
  );

  return (
      <View style={styles.container}>
      {isLoadingInitial ? (
        <ActivityIndicator size="large" color="#9966CC" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={requests}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#9966CC" />
          }
          
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          
          ListFooterComponent={
            isFetchingMore ? <ActivityIndicator size="small" color="#9966CC" style={{ marginVertical: 10 }} /> : null
          }
          ListEmptyComponent={
            <Text style={{ color: 'gray', textAlign: 'center', marginTop: 20 }}>Nessuna richiesta in arrivo.</Text>
          }
        />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingBottom: 30,
    marginTop: 10,
    gap: 10, // Spaziatura tra le card
  },
  // Rimosso stile 'friendsContainer' perché FlatList gestisce il layout tramite contentContainerStyle
});