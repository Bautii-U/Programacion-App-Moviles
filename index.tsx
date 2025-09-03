import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type CardProps = { label: string };

function Card ({label}: CardProps) {
  const [active, setActive] = useState(false);

  const backgroundColor = active ? "#252440" : "#e5e7eb";  //esto es asi -> "true : false"
  const textColor = active ? "#ffffff" : "#111827";

  return (
      <Pressable
        onPress={() => setActive(p => !p)}
        style={({pressed}) => [styles.card, {backgroundColor, opacity: pressed ? 0.8 : 1}]}
      >
        <Text style={[styles.cardText, {color: textColor}]}> {label} </Text>
      </Pressable>
  );
}

export default function Index() {
  const items = [
    { id: "1", label: "Primera" },
    { id: "2", label: "Segunda" },
    { id: "3", label: "Tercerta" },
    { id: "4", label: "Cuarta" },
    { id: "5", label: "Quinta" }
  ]

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Tarjetas </Text>

      <View style={styles.list}>
        {items.map((item) => ( <Card key={item.id} label={item.label} />))}
      </View>
    </View>
  );

}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#a4c4daff", justifyContent: "center" },
  title: { fontSize: 25, fontWeight: "600", marginBottom: 30, color: "#122b61ff", textAlign: "center"  },
  list: { gap: 12 },
  card: {
    height: 100,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  cardText: { fontSize: 18, fontWeight: "500" },
});
