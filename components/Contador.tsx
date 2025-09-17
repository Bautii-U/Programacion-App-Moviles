import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";


export function Contador(){
    const [contador, setContador] = useState(0);


    const incrementar = () =>{
        setContador(prev => prev + 1);
    }
    const decrecer = () =>{
        setContador(prev => prev - 1);
    }

    return (
        <View style={styles.ViewStyle}>
            <Text style={styles.TextStyle}>Contador: {contador}</Text>
            <Pressable onPress={incrementar} style={styles.incrementar}>
                <Text>Incrementar</Text>
            </Pressable>
            <Pressable onPress={decrecer} style={styles.decrecer}>
                <Text>Decrecer</Text>
            </Pressable>
        </View>
    )
}


const styles = StyleSheet.create({
    ViewStyle: {
        justifyContent: "center",
    },
    incrementar: {
        backgroundColor: "green",
        margin: 5,
        padding: 10,
        borderRadius: 4,
        width: 150,
    },
    decrecer: {
        backgroundColor: "red",
        margin: 5,
        padding: 10,
        borderRadius: 4
    },
    TextStyle: {
        textAlign: "center",
        fontWeight: "300",
        fontSize: 25,
        padding : 10
    }
})


