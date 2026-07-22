import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen, Eyebrow, H1, Body, Label } from "../../src/components/ui";
import { colors, radius, sp } from "../../src/theme";

type Perk = { title: string; sub: string; save: string; icon: keyof typeof Ionicons.glyphMap };

// Curated placeholders — real partners are seeded from Akshay's contacts (see knowledge/MONETIZATION.md).
const PERKS: Perk[] = [
  { title: "Building & Pest", sub: "Vetted VIC inspectors", save: "Save $110", icon: "home-outline" },
  { title: "Conveyancing", sub: "Fixed-fee settlement", save: "$300 flat", icon: "document-text-outline" },
  { title: "Mortgage broker", sub: "Free pre-approval review", save: "Free", icon: "business-outline" },
  { title: "Home insurance", sub: "First 2 months", save: "2 mo free", icon: "shield-checkmark-outline" },
  { title: "Utility connect", sub: "Power, gas, internet", save: "1-tap", icon: "flash-outline" },
];

export default function Perks() {
  return (
    <Screen>
      <Eyebrow>Members only</Eyebrow>
      <H1>Perks</H1>
      <Body>Real discounts on the services you need anyway — from a vetted partner network. Free with the app.</Body>

      {PERKS.map((p) => (
        <View key={p.title} style={ps.row}>
          <View style={ps.icon}><Ionicons name={p.icon} size={20} color={colors.gold} /></View>
          <View style={{ flex: 1 }}>
            <Text style={ps.title}>{p.title}</Text>
            <Text style={ps.sub}>{p.sub}</Text>
          </View>
          <View style={ps.save}><Text style={ps.saveText}>{p.save}</Text></View>
        </View>
      ))}

      <View style={ps.note}>
        <Ionicons name="information-circle-outline" size={16} color={colors.dim} />
        <Text style={ps.noteText}>Sample offers. Real partners are being onboarded — the buyer saves more than we earn.</Text>
      </View>

      <Label>★ Free with the app</Label>
    </Screen>
  );
}

const ps = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: sp(3), backgroundColor: colors.surface, borderColor: colors.line, borderWidth: 1, borderRadius: radius.lg, padding: sp(3.5) },
  icon: { width: 40, height: 40, borderRadius: 10, backgroundColor: colors.surface3, alignItems: "center", justifyContent: "center" },
  title: { color: colors.text, fontSize: 15, fontWeight: "600" },
  sub: { color: colors.dim, fontSize: 12, marginTop: 1 },
  save: { backgroundColor: colors.gold, borderRadius: radius.sm, paddingHorizontal: sp(2.5), paddingVertical: sp(1.5) },
  saveText: { color: colors.bg, fontSize: 12, fontWeight: "800" },
  note: { flexDirection: "row", gap: sp(2), alignItems: "flex-start", marginTop: sp(2) },
  noteText: { color: colors.dim, fontSize: 12, flex: 1, lineHeight: 17 },
});
