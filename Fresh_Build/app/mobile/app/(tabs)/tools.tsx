import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen, Eyebrow, H1, Body, Label, Pill } from "../../src/components/ui";
import { colors, radius, sp } from "../../src/theme";

type Tool = { title: string; sub: string; icon: keyof typeof Ionicons.glyphMap; route?: string };

const LIVE: Tool[] = [
  { title: "Stamp duty", sub: "VIC · exact from SRO", icon: "document-text-outline", route: "/tools/stamp-duty" },
  { title: "Borrowing capacity", sub: "What you can borrow & buy", icon: "trending-up-outline", route: "/tools/borrowing" },
  { title: "Rental yield", sub: "Yield & weekly cash-flow", icon: "home-outline", route: "/tools/rental" },
];

const COMING: Tool[] = [
  { title: "Deposit calculator", sub: "Deposit vs LVR & LMI", icon: "wallet-outline" },
  { title: "Budget planner", sub: "Sustainable purchase price", icon: "pie-chart-outline" },
  { title: "Savings tracker", sub: "Goal + progress", icon: "flag-outline" },
  { title: "Grants & concessions", sub: "FHOG + duty concession", icon: "gift-outline" },
  { title: "LMI calculator", sub: "Premium by LVR band", icon: "shield-outline" },
  { title: "Equity & cash at settlement", sub: "Usable equity + cash needed", icon: "cash-outline" },
];

export default function Tools() {
  const router = useRouter();
  return (
    <Screen>
      <Eyebrow>Broker-grade</Eyebrow>
      <H1>Tools</H1>
      <Body>Deterministic calculators — every number shows its working and its source.</Body>

      <Label>Ready to use</Label>
      {LIVE.map((t) => (
        <Pressable key={t.title} onPress={() => t.route && router.push(t.route as any)}>
          {({ pressed }) => (
            <View style={[ts.row, pressed && { opacity: 0.7 }]}>
              <View style={ts.icon}><Ionicons name={t.icon} size={20} color={colors.gold} /></View>
              <View style={{ flex: 1 }}>
                <Text style={ts.title}>{t.title}</Text>
                <Text style={ts.sub}>{t.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.dim} />
            </View>
          )}
        </Pressable>
      ))}

      <Label>Coming next</Label>
      {COMING.map((t) => (
        <View key={t.title} style={[ts.row, { opacity: 0.6 }]}>
          <View style={ts.icon}><Ionicons name={t.icon} size={20} color={colors.dim} /></View>
          <View style={{ flex: 1 }}>
            <Text style={ts.title}>{t.title}</Text>
            <Text style={ts.sub}>{t.sub}</Text>
          </View>
          <Pill tone="muted">Soon</Pill>
        </View>
      ))}
    </Screen>
  );
}

const ts = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: sp(3), backgroundColor: colors.surface, borderColor: colors.line, borderWidth: 1, borderRadius: radius.lg, padding: sp(3.5) },
  icon: { width: 40, height: 40, borderRadius: 10, backgroundColor: colors.surface3, alignItems: "center", justifyContent: "center" },
  title: { color: colors.text, fontSize: 15, fontWeight: "600" },
  sub: { color: colors.dim, fontSize: 12, marginTop: 1 },
});
