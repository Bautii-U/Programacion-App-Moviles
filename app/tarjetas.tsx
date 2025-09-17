import { Card } from "../components/Card";
import { StyleSheet, View} from "react-native";

export default function tarjetas() {

  return (
    <View style={styles.container}>
    
      <View style={styles.container}>
        <Card title="Primera"/>
        <Card title="Segunda"/>
        <Card title="Tercera"/>
      </View>
      
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#a4c4daff", justifyContent: "center", alignItems: "center"},
  list: { gap: 12 },
  card: {
    height: 100,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    margin: 50
  },
  cardText: { fontSize: 18, fontWeight: "500" },
});


