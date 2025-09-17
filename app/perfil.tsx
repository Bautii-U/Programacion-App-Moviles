import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { ChangeNameModal } from "../components/Change_name";

export default function Perfil() {
  const [name, setName] = useState("Nombre Apellido");
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Perfil</Text>
        <Text style={styles.name}>{name}</Text>

        <Pressable onPress={() => setOpen(true)} style={styles.button}>
          <Text style={styles.buttonText}>Cambiar nombre</Text>
        </Pressable>
      </View>

      <ChangeNameModal
        visible={open}
        initialName={name}
        onCancel={() => setOpen(false)}
        onSave={(newName: string) => {
          setName(newName);
          setOpen(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#a4c4daff", justifyContent: "center", alignItems: "center" },
  card: {
    width: "88%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  title: { fontSize: 18, fontWeight: "400", opacity: 0.8 },
  name: { fontSize: 22, fontWeight: "700" },
  button: {
    marginTop: 8,
    backgroundColor: "#135e7eff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: { color: "white", fontSize: 15, fontWeight: "600" },
});


