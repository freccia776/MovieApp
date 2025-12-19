import React from 'react';
import { View, Text, StyleSheet, ScrollView} from 'react-native';
import FriendCard from '../components/FriendCard';

export default function RequestFriendsTab() {
  const url: string = "https://th.bing.com/th/id/R.2007a8338a993a9f448166ba9fdec16a?rik=qP04vUzQrby9RQ&riu=http%3a%2f%2fimages4.fanpop.com%2fimage%2fphotos%2f23300000%2fPatrick-Jane-patrick-jane-23388274-1280-720.jpg&ehk=Tk4ucXAtf7Ddoo3xVl33HSvvNWPIb8U2jM3laZsCUho%3d&risl=&pid=ImgRaw&r=0";
  //AGGHIUNGERE FUNZIONE ONPRESS ON ACCEPT ECC.
  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        <View style={styles.friendsContainer}>
          <FriendCard friendItem={{ id: 1, username: "Patrick Jane", image: url }} type= "request"/>
          <FriendCard friendItem={{ id: 2, username: "Teresa Lisbon", image: url }} type= "request"/>
          <FriendCard friendItem={{ id: 3, username: "Kimball Cho", image: url }} type= "request"/>
          <FriendCard friendItem={{ id: 4, username: "Wayne Rigsby", image: url }} type= "request"/>
          <FriendCard friendItem={{ id: 5, username: "Grace Van Pelt", image: url }} type= "request"/>
          <FriendCard friendItem={{ id: 6, username: "Amanda", image: url }} type= "request"/>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 25,
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