import React from 'react';
import { View, Text, StyleSheet, ScrollView} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavigatorFriends from '../navigation/NavigatorFriends';
export default function FriendsScreen() {

  return (
    <SafeAreaView style={styles.container}>
         <View style={styles.contentWrapper}>               
                <NavigatorFriends />
              </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
   
  },
   contentWrapper: {
    flex: 1, // Permette al contenuto di espandersi
    
  },
});