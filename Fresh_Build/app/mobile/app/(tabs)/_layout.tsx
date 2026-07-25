import { Tabs } from "expo-router";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../src/theme";

function ThemeToggle() {
  const { isDark, toggle, c } = useTheme();
  return (
    <Pressable onPress={toggle} hitSlop={12} style={{ marginRight: 16 }}>
      <Ionicons name={isDark ? "sunny-outline" : "moon-outline"} size={22} color={c.accent} />
    </Pressable>
  );
}

export default function TabsLayout() {
  const { c } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: c.bg },
        headerTitleStyle: { color: c.text, fontWeight: "700" },
        headerShadowVisible: false,
        headerRight: () => <ThemeToggle />,
        tabBarStyle: { backgroundColor: c.surface, borderTopColor: c.line, height: 88, paddingTop: 8 },
        tabBarActiveTintColor: c.accent,
        tabBarInactiveTintColor: c.dim,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        sceneStyle: { backgroundColor: c.bg },
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
        options={{ title: "Guide", tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles-outline" color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="perks"
        options={{ title: "Perks", tabBarIcon: ({ color, size }) => <Ionicons name="pricetags-outline" color={color} size={size} /> }}
      />
    </Tabs>
  );
}
