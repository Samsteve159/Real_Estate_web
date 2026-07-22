import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../src/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTitleStyle: { color: colors.text, fontWeight: "700" },
        headerShadowVisible: false,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.line, height: 88, paddingTop: 8 },
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.dim,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Journey", tabBarIcon: ({ color, size }) => <Ionicons name="git-branch-outline" color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="tools"
        options={{ title: "Tools", tabBarIcon: ({ color, size }) => <Ionicons name="calculator-outline" color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="mentor"
        options={{ title: "Mentor", tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles-outline" color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="perks"
        options={{ title: "Perks", tabBarIcon: ({ color, size }) => <Ionicons name="pricetags-outline" color={color} size={size} /> }}
      />
    </Tabs>
  );
}
