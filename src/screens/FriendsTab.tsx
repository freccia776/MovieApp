import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FriendCard from '../components/FriendCard';

//NAVIGAZIONE
import { FriendsStackParamList } from '../types/types';
import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps , NativeStackNavigationProp} from '@react-navigation/native-stack';


//type FriendsTabProps = NativeStackScreenProps<FriendsStackParamList, 'FriendsMain'>;

type NavigationProp = NativeStackNavigationProp<FriendsStackParamList>;

export default function FriendsTab() {
  const url: string =
    "https://th.bing.com/th/id/R.2007a8338a993a9f448166ba9fdec16a?rik=qP04vUzQrby9RQ&riu=http%3a%2f%2fimages4.fanpop.com%2fimage%2fphotos%2f23300000%2fPatrick-Jane-patrick-jane-23388274-1280-720.jpg&ehk=Tk4ucXAtf7Ddoo3xVl33HSvvNWPIb8U2jM3laZsCUho%3d&risl=&pid=ImgRaw&r=0";

  const [text, setText] = React.useState<string>("");

  function clearSearch() {
    setText("");
  }

  const friends = [
    { id: 1, username: "Patrick Jane", image: url },
    { id: 2, username: "Teresa Lisbon", image: url },
    { id: 3, username: "Kimball Cho", image: url },
    {id: 4, username: "Wayne Rigsby", image: url },
    {id: 5, username: "Grace Van Pelt", image: url },
    { id: 6, username: "freccia.ziopera", image: url },
  ];

  const filteredFriends = friends.filter(friend =>
    friend.username.toLowerCase().includes(text.toLowerCase())
  );

  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.inputContainer}>
          <View style={styles.searchIcon}>
            <Ionicons name="search" size={22} color="#9966CC" />
          </View>

          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Cerca amici..."
            placeholderTextColor="#A0A0A0"
            returnKeyType="search"
          />

          {text !== "" && (
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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.friendsContainer}>
          {filteredFriends.map((friend, index) => (
            <FriendCard
              key={index}
              friendItem={friend}
              type = "friend"
            />
          ))}

          {filteredFriends.length === 0 && (
            <Text style={styles.noResultsText}>
              Nessun amico trovato
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
});