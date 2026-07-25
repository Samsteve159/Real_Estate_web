import { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen, Eyebrow, H1, Body, Label } from "../../src/components/ui";
import { useTheme, radius, sp, type ThemeColors } from "../../src/theme";

type Perk = { title: string; sub: string; save: string; icon: keyof typeof Ionicons.glyphMap };

// Curated placeholders — real partners + real discounts are seeded from AK's
// network (see knowledge/MONETIZATION.md). Target: ~15–20% member savings.
const PERKS: Perk[] = [
  { title: "Mortgage broker", sub: "Free pre-approval review", save: "Free", icon: "business-outline" },
  { title: "Conveyancer", sub: "Contract check + settlement", save: "Save 15%", icon: "document-text-outline" },
  { title: "Building & pest", sub: "Vetted VIC inspectors", save: "Save 20%", icon: "home-outline" },
  { title: "Home insurance", sub: "Cover from settlement", save: "Save 15%", icon: "shield-checkmark-outline" },
  { title: "Utility connection", sub: "Power, gas, internet", save: "1-tap", icon: "flash-outline" },
  { title: "Removalists", sub: "Booked for moving day", save: "Save 15%", icon: "cube-outline" },
];

export default function Perks() {
  const { c } = useTheme();
  const ps = useMemo(() => makeStyles(c), [c]);
  return (
    <Screen>
      <Eyebrow>Members only</Eyebrow>
      <H1>Your savings</H1>
      <Body>We line up the whole ecosystem for you — vetted professionals at member rates, so you save on every step. Free with the app.</Body>

      {PERKS.map((p) => (
        <View key={p.title} style={ps.row}>
          <View style={ps.icon}><Ionicons name={p.icon} size={20} color={c.accent} /></View>
          <View style={{ flex: 1 }}>
            <Text style={ps.title}>{p.title}</Text>
            <Text style={ps.sub}>{p.sub}</Text>
          </View>
          <View style={ps.save}><Text style={ps.saveText}>{p.save}</Text></View>
        </View>
      ))}

      <View style={ps.note}>
        <Ionicons name="information-circle-outline" size={16} color={c.dim} />
        <Text style={ps.noteText}>Sample offers. Real partners are being onboarded — the buyer saves more than we earn.</Text>
      </View>

      <Label>★ Free with the app</Label>
    </Screen>
  );
}

const makeStyles = (c: ThemeColors) => StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: sp(3), backgroundColor: c.surface, borderColor: c.line, borderWidth: 1, borderRadius: radius.lg, padding: sp(3.5) },
  icon: { width: 40, height: 40, borderRadius: 10, backgroundColor: c.surface3, alignItems: "center", justifyContent: "center" },
  title: { color: c.text, fontSize: 15, fontWeight: "600" },
  sub: { color: c.dim, fontSize: 12, marginTop: 1 },
  save: { backgroundColor: c.accent, borderRadius: radius.sm, paddingHorizontal: sp(2.5), paddingVertical: sp(1.5) },
  saveText: { color: c.accentText, fontSize: 12, fontWeight: "800" },
  note: { flexDirection: "row", gap: sp(2), alignItems: "flex-start", marginTop: sp(2) },
  noteText: { color: c.dim, fontSize: 12, flex: 1, lineHeight: 17 },
});
