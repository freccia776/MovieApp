import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SerieCard from './SerieCard';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types/types';
import { Ionicons } from '@expo/vector-icons';

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
type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const SerieSection: React.FC<SerieSectionProps> = ({ name, series, maxVisible = 9 }) => {
 const navigation = useNavigation<NavigationProp>();
  return (
    <View>
      <View style={styles.titleContainer}>
        <Ionicons name="tv-outline" size={24} color="#9966CC" style={styles.titleIcon} />
        <View style={styles.textContainer}>
          <Text style={styles.sezioneContainer}>{name}</Text>
          <View style={styles.underline} />
        </View>
      </View>
      <View style={styles.moviesContainer}>
        {series.slice(0, maxVisible).map((serie) => (  
          <SerieCard 
            key={serie.id} 
            serieItem={serie} 
            onPress={() => navigation.navigate("Content", { id: serie.id, type: "serie" })}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  titleIcon: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    marginRight: 20,
  },
  sezioneContainer: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#FFFFFF",
    paddingBottom: 5,
  },
  underline: {
    height: 2,
    backgroundColor: "#9966CC",
    width: '100%', // Ora occupa tutta la larghezza disponibile
  },
  moviesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    marginBottom: 30,
  },
});
export default SerieSection;
