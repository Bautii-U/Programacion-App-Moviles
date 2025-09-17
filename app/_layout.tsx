import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      
      <Tabs.Screen
        name="index"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="contador"
        options={{
          title: "Contador",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "calculator" : "calculator-outline"} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tarjetas"
        options={{
          title: "Tarjetas",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "card" : "card-outline"} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="galeria"
        options={{
          title: "Galeria",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "images" : "images-outline"} size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}