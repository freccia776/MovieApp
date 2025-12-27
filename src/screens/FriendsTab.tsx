import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FriendCard, { FriendCardType } from '../components/FriendCard';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchWithAuth } from '../api/fetchWithAuth';
import { useCallback } from 'react';
import { useEffect } from 'react';
//NAVIGAZIONE
import { FriendsStackParamList } from '../types/types';
import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps , NativeStackNavigationProp} from '@react-navigation/native-stack';


//type FriendsTabProps = NativeStackScreenProps<FriendsStackParamList, 'FriendsMain'>;

type NavigationProp = NativeStackNavigationProp<FriendsStackParamList>;
// Interfaccia per i dati che arrivano dal backend (GET /api/friends)
interface FriendData {
  id: number;
  username: string;
  profileImageUrl?: string | null;
}


export default function FriendsTab() {
   const navigation = useNavigation<NavigationProp>();
  const { setTokens, signOut } = useAuth();

  const [friends, setFriends] = useState<FriendData[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<FriendData[]>([]);
  const [searchText, setSearchText] = useState("");
  
  const [isLoading, setIsLoading] = useState(true);  //sta caricando??
  const [isRefreshing, setIsRefreshing] = useState(false);  //si sta refreshando??
  const [isLoadingMore, setIsLoadingMore] = useState(false);  //sta caricando altro?
  const [page, setPage] = useState(1);  //indica la pagina.
  const [hasMore, setHasMore] = useState(true);  //Il backend ha ancora amici da mandarmi?

  // --- FUNZIONE PER SCARICARE GLI AMICI ---
  // Memoizziamo con useCallback per poterla usare nelle dipendenze senza loop
  const fetchFriends = useCallback(async (pageNumber: number, shouldRefresh: boolean = false) => {
    try {
      if (shouldRefresh) setHasMore(true); //“"Dimentica tutto quello che hai scaricato finora e ricomincia da capo 
      1
      const response = await fetchWithAuth(
        `/friends?page=${pageNumber}&limit=20`, 
        { method: 'GET' }, 
        { setTokens, signOut }
      );

      if (response.ok) {
        const newFriends: FriendData[] = await response.json();

        if (newFriends.length < 20) {
          setHasMore(false); 
        }

        if (shouldRefresh) {
          setFriends(newFriends); 
          setFilteredFriends(newFriends);
        } else {
          setFriends(prev => {
            const combined = [...prev, ...newFriends];
            const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
            // Aggiorniamo filteredFriends SOLO se non stiamo cercando
            // Se c'è una ricerca attiva, l'utente non deve vedere spuntare nuovi amici non filtrati
            if (searchText === "") {
               setFilteredFriends(unique);
            }
            return unique;
          });
        }
      }
    } catch (error) {
      console.error("Errore caricamento amici:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  }, [setTokens, signOut, searchText]); // Aggiunto searchText alle dipendenze per la logica di filtro

  // --- EFFETTO INIZIALE (SOLO AL MONTAGGIO) ---
  // Sostituito useFocusEffect con useEffect con dipendenze vuote [].
  // Questo viene eseguito UNA SOLA VOLTA quando apri l'app o carichi la schermata per la prima volta.
  // Se cambi tab e torni indietro, NON viene eseguito di nuovo.
  useEffect(() => {
    fetchFriends(1, true);
  }, []); // <--- Array vuoto: esegui solo al mount!


  // --- GESTIONE RICERCA ---
  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text) {
      const filtered = friends.filter(friend =>
        friend.username.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredFriends(filtered);
    } else {
      setFilteredFriends(friends);
    }
  };

  const clearSearch = () => {
    setSearchText("");
    setFilteredFriends(friends);
  };

  // --- AZIONI UTENTE ---
  const onRefresh = () => {
    setIsRefreshing(true);
    setPage(1);
    // Qui forziamo il refresh esplicito (l'utente tira giù)
    fetchFriends(1, true);
  };

  const onLoadMore = () => {
    if (!isLoadingMore && hasMore && searchText === "") {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchFriends(nextPage, false);
    }
  };

  const renderFriendItem = ({ item }: { item: FriendData }) => (
    <FriendCard
      friendItem={{
        id: item.id,
        username: item.username,
        image: item.profileImageUrl || '' 
      }}
      type="friend"
      onPressCard={() => navigation.navigate("FriendProfile", { userId: item.id })}
    />
  );
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.inputContainer}>
          <View style={styles.searchIcon}>
            <Ionicons name="search" size={22} color="#9966CC" />
          </View>

          <TextInput
            style={styles.input}
            value={searchText}
            onChangeText={handleSearch}
            placeholder="Cerca amici..."
            placeholderTextColor="#A0A0A0"
            returnKeyType="search"
          />

          {searchText !== "" && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearSearch}
            >
              <Ionicons name="close-circle" size={20} color="#9966CC" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate("AddFriend")}
        >
          <Ionicons name="person-add-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

   {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#9966CC" />
        </View>
      ) : (
        <FlatList
          style={styles.flatList} // <--- 1. Assegna flex: 1 alla FlatList
          data={filteredFriends}
          renderItem={renderFriendItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#9966CC"
              colors={["#9966CC"]}
              progressBackgroundColor={"#2D2D2D"}
            />
          }
          
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.5} 
          ListFooterComponent={
            isLoadingMore ? <ActivityIndicator size="small" color="#9966CC" style={{ margin: 20 }} /> : null
          }
          
          ListEmptyComponent={
            <Text style={styles.noResultsText}>
              {searchText ? "Nessun amico trovato." : "Non hai ancora aggiunto amici."}
            </Text>
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
    paddingTop: 10,
  
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderWidth: 1,
    borderColor: 'rgba(153, 102, 204, 0.3)',
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  addButton: {
    backgroundColor: 'rgba(153, 102, 204, 0.2)',
    padding: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(153, 102, 204, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 50,
  },
   flatList: {
    flex: 1, // Occupa tutto lo spazio disponibile sotto l'header
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  noResultsText: {
    color: '#A0A0A0', 
    marginTop: 50,
    fontSize: 16,
    textAlign: 'center',
  },
});
/*const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    paddingTop: 10,
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
    padding: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(153, 102, 204, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 50,
    shadowColor: "#9966CC",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  friendsContainer: {
    alignItems: 'center',
    gap: 10,
  },
  noResultsText: {
    color: '#A0A0A0', 
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
}); */
