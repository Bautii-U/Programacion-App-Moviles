import { StyleSheet, Text, View, Pressable} from 'react-native';
import { useState } from "react";

export function Card(props: {title: string}){
    const [isSelected , setSelection] = useState(false);

    const changeColor = () => {
        setSelection(!isSelected)
    }

    return(
        <View style={[styles.card, { backgroundColor: isSelected ? "#0eabe9ff" : "#0e3c50ff" }]}>
            <Pressable style={styles.PressableStyle} onPress={changeColor}>
                <Text style={[styles.cardText, { color: isSelected ? "black" : "white" }]}> {props.title} </Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    card:{
        width: 300,
        height: 70,
        margin: 10,
        borderRadius: 10,
    },
    PressableStyle:{
        flex: 1,
        padding: 15,
        textAlign:  "center"
    },
    cardText:{
        textAlign:"center",
        color: "black",
        fontSize: 24,
        fontWeight: "300"
    }
})