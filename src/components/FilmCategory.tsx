
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

        <TouchableOpacity 
            style={styles.categoryLayout} 
            onPress={() => handlePress(categoryItem.title)}
        >
           <Text style = {styles.titleText}>{categoryItem.title}</Text>
        </TouchableOpacity>

    );

};

const styles = StyleSheet.create({
    categoryLayout: {
        backgroundColor: "rgba(153, 102, 204, 0.15)", // Viola trasparente
        borderRadius: 12,
        padding: 16,
        marginVertical: 6,
        marginHorizontal: 20,
        width: "90%",
        alignSelf: "center",
        borderWidth: 1,
        borderColor: "rgba(153, 102, 204, 0.3)",
        shadowColor: "#9966CC",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        // Effetto di hover per interazione
        transform: [{ scale: 1 }],
    },
    titleText: {
        fontSize: 18,
        color: "#FFFFFF",
        fontWeight: "600",
        textAlign: "center",
        letterSpacing: 0.5,
    },
});


export default FilmCategory;