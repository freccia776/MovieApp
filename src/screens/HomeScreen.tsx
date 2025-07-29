import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import NavigatorType from '../navigation/NavigatorType';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>

      <View style = {styles.topContainer}>
        <Text style = {styles.nameApp}>Nome App</Text>
        <NavigatorType/>
      </View>
      

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },

  topContainer:{

    flex: 1,
    marginTop: 30,
    gap: 10,
    
  },

  nameApp: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: "sans-serif",
    fontWeight: "bold",
  },

  


});