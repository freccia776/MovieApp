
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

interface Category{

    title: string;
    
}



const FilmCategory = ({ categoryItem } : { categoryItem: Category }) => {

    const handlePress = (value: string): void => {
        console.log(value);
    }


    return(

        <TouchableOpacity style={styles.categoryLayout} onPress={() => handlePress(categoryItem.title)}>
           <Text style = {styles.titleText}>{categoryItem.title}</Text>
        </TouchableOpacity>

    );

};


const styles = StyleSheet.create({

titleText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,      
},

categoryLayout: {
    



    backgroundColor: "#9966CC",
    borderRadius: 8,
    padding: 10,
    margin: 5,
    width: "90%", // Adatta la larghezza per il wrapping
    shadowColor: "#000",
    
    
}

});

export default FilmCategory;