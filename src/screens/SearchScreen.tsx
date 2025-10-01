
import React, { useState }from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView} from 'react-native';
import FilmCategory from "../components/FilmCategory"

export default function SearchScreen() {
  
  const [text, setText] = useState<string>('');
  const [search, setNoSearch] = useState<boolean>(false); // stato per gestire la ricerca
  
  const handleSubmit = (): void => { //funzione per inviare il testo
    console.log('Testo inviato:', text);
    setText('');
  };

  const handleChange = (value: string): void => { //funzione per aggiornare il testo
    setText(value);
  };


  //CATEGORIE
  const categories = [
    {id :1 , title: "Azione"},
    {id :2 , title: "Avventura"},  
    {id :3 , title: "Commedia"},
    {id :4 , title: "Drammatico"},
    {id :5 , title: "Fantascienza"},
    {id :6 , title: "Horror"},
    {id :7 , title: "Romantico"},
    {id :8 , title: "Thriller"},
    {id :9 , title: "Animazione"},
    {id :10 , title: "Documentario"},
   
  ];


  return (
    <View style={styles.container}>
       <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={handleChange}
          placeholder="Scrivi qualcosa..."
        />
        <TouchableOpacity style={styles.buttoninput} onPress={handleSubmit}>
          <Text style={styles.buttontext}>Invia</Text>
        </TouchableOpacity>
      </View>

      <View style = {styles.categoryContainer}>
        <ScrollView style={{ width: "100%" }} contentContainerStyle={{ alignItems: 'center' }}>
          {categories.slice(0, categories.length).map((category) => (
            <FilmCategory key={category.id} categoryItem={category} />

          ))}

        </ScrollView>
      </View>
      

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    
  },
  input: {
    flex: 1,
    borderColor: '#9966CC',
    borderWidth: 1,
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 5,
    marginRight: 10,
  },

  buttoninput: {
    backgroundColor: '#9966CC',
    borderRadius: 5,
    borderWidth: 1,
    padding: 10,
    height: 40,
    width: 70,
    alignItems: 'center',
  },


  buttontext:{
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  categoryContainer: {
    marginTop: "2%",
    marginBottom: "12%",
    alignItems: 'center',
    width: "100%",
  
    
  },
});