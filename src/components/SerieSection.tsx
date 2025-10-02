import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SerieCard from './SerieCard';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types';


interface Serie{
  id: number;
  name: string;
  image: string;


}

interface SerieSectionProps {
  name?: string;
  series: Serie[];
  maxVisible?: number;
}


//sto dicendo a questo script che è la home e quindi avrà i seguenti parametri assegnati nel type
//type NavigationProp = NativeStackNavigationProp<StackParamList, 'HomeTab'>; 
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SerieSection: React.FC<SerieSectionProps> = ({ name, series, maxVisible = 9 }) => {
 const navigation = useNavigation<NavigationProp>();
  return (
        <View>
          <Text style={styles.sezioneContainer}>{name}</Text> 
          <View style={styles.moviesContainer}>
          {series.slice(0, maxVisible).map((serie) => (  
              <SerieCard 
              key={serie.id} 
              serieItem={serie} 
              onPress={() => navigation.navigate("Content", { id: serie.id, type: "serie" })} //per un film siamo in MovieSection
              />
            ))}
          </View>
        </View>
      
  );
};


const styles = StyleSheet.create({
 
  scrollContainer: {
    flexGrow: 1, 
  },
  

  moviesContainer: {
    flexDirection: "row", // Allinea le schede in orizzontale
    flexWrap: "wrap", // Permette il wrapping delle MovieCard
    //justifyContent: "space-between", // Spaziatura tra le schede
    paddingHorizontal: 10,
    marginBottom: 30,
    //justifyContent: "center",
  },

  sezioneContainer: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 20,
  },

  

});
export default SerieSection;
