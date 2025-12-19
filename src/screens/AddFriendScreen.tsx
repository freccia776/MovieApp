import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import FriendCard from '../components/FriendCard';


export function AddFriendScreen() {
    const url: string = "https://th.bing.com/th/id/R.2007a8338a993a9f448166ba9fdec16a?rik=qP04vUzQrby9RQ&riu=http%3a%2f%2fimages4.fanpop.com%2fimage%2fphotos%2f23300000%2fPatrick-Jane-patrick-jane-23388274-1280-720.jpg&ehk=Tk4ucXAtf7Ddoo3xVl33HSvvNWPIb8U2jM3laZsCUho%3d&risl=&pid=ImgRaw&r=0";
  
    function clearSearch() {
        setText("");
    }

    const navigation = useNavigation();
    const [text, setText] = React.useState<string>("");
    return (

        <SafeAreaView style={styles.safecontainer}>
            <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} >
                        <Ionicons name="arrow-back" size={28} color="#9966CC" />
                    </TouchableOpacity>
                    <View style={styles.inputContainer}>
                      
            
                      <TextInput
                        style={styles.input}
                        value={text}
                        onChangeText={setText}
                        placeholder="username"
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
                        onPress={() => Alert.alert("Richiesta inviata")}
                    >
                      <Ionicons name="send-outline" size={24} color="#9966CC" />
                    </TouchableOpacity>
                  </View>
            
            <View>
               
            </View>
            <View style={styles.container}>
                <Text style={styles.title}>Inviate:</Text>
                 <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                
                    <View style={styles.friendsContainer}>
                        <FriendCard friendItem={{ id: 1, username: "Patrick Jane", image: url }} type = "pending"/>
                        <FriendCard friendItem={{ id: 2, username: "Teresa Lisbon", image: url }} type = "pending"/>
                        <FriendCard friendItem={{ id: 3, username: "Kimball Cho", image: url }} type = "pending"/>
                        <FriendCard friendItem={{ id: 4, username: "Wayne Rigsby", image: url }} type = "pending"/>
                        <FriendCard friendItem={{ id: 5, username: "Grace Van Pelt", image: url }} type = "pending"/>
                        <FriendCard friendItem={{ id: 6, username: "Amanda", image: url }} type = "pending"/>
                    </View>
                </ScrollView>
                
            </View>
            
        </SafeAreaView>
    )


   


}
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