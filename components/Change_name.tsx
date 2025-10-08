import React, { useEffect, useState } from "react";
import {Modal, View, Text, TextInput, Pressable, StyleSheet} from "react-native";

type Props = {
  visible: boolean;
  initialName: string;
  onCancel: () => void;
  onSave: (newName: string) => void;
};

export function ChangeNameModal({ visible, initialName, onCancel, onSave }: Props) {
  const [value, setValue] = useState(initialName);

  useEffect(() => {
    if (visible) setValue(initialName);
  }, [visible, initialName]);

  const handleSave = () => {
    const trimmed = value.trim();
    if (trimmed.length === 0) return onCancel();
    onSave(trimmed);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
        <View style={styles.backdrop}>
          <View style={styles.card}>

            <Text style={styles.title}> Cambiar nombre </Text>
            <Text style={styles.label}> Nombre y apellido </Text>

            <TextInput
              value={value}
              onChangeText={setValue}
              placeholder="Ejemplo: Ana Pérez"
              style={styles.input}
              returnKeyType="done"
              autoCapitalize="words"
            />

            <View style={styles.row}>
              <Pressable onPress={onCancel} style={[styles.btn, styles.btnGhost]}>
                <Text style={[styles.btnText, styles.btnGhostText]}> Cancelar </Text>
              </Pressable>

              <Pressable onPress={handleSave} style={[styles.btn, styles.btnPrimary]}>
                <Text style={[styles.btnText, styles.btnPrimaryText]}> Guardar </Text>
              </Pressable>

            </View>
          </View>
        </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    width: "100%",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    gap: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  title: { fontSize: 18, fontWeight: "700" },
  label: { fontSize: 14, opacity: 0.8 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  row: { flexDirection: "row", gap: 10, justifyContent: "flex-end", marginTop: 8 },
  btn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
  btnGhost: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#ddd" },
  btnGhostText: { color: "#333" },
  btnPrimary: { backgroundColor: "#135069ff" },
  btnPrimaryText: { color: "white" },
  btnText: { fontSize: 15, fontWeight: "600" },
});
