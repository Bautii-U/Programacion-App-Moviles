import { StyleSheet, View } from "react-native";
import { Contador } from "../components/Contador";

export default function contador() {

  return (
    <View style={styles.ViewStyles}>
        <Contador/>
    </View>
  );
}

const styles = StyleSheet.create({
  ViewStyles: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#a4c4daff"
  }

})


