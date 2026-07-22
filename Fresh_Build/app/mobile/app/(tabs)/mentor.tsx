import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen, Eyebrow, H1, Body, Card, Label, GhostButton } from "../../src/components/ui";
import { colors, radius, sp } from "../../src/theme";

const PROMPTS = [
  "Is this property overpriced?",
  "Explain this contract clause.",
  "What should I ask at the inspection?",
  "Summarise this building report.",
  "What risks do you see?",
];

export default function Mentor() {
  return (
    <Screen>
      <Eyebrow>Your buyer's advocate</Eyebrow>
      <H1>AI mentor</H1>
      <Body>The questions you're too nervous to ask the seller's agent — answered, with the source behind every claim.</Body>

      <Card gold style={{ gap: sp(3), alignItems: "flex-start" }}>
        <View style={ms.badge}><Ionicons name="sparkles-outline" size={18} color={colors.gold} /></View>
        <Text style={ms.headline}>Grounded answers, one tap to a human</Text>
        <Body style={{ fontSize: 13 }}>
          Wiring up to the Manifest concierge next — streaming replies that cite comparable sales, overlays and the SRO,
          with a hand-off to a real Manifest expert for the big calls.
        </Body>
        <Label>Coming in the next build</Label>
      </Card>

      <Label>What you'll be able to ask</Label>
      {PROMPTS.map((p) => (
        <View key={p} style={ms.prompt}>
          <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.gold} />
          <Text style={ms.promptText}>{p}</Text>
        </View>
      ))}

      <GhostButton title="Talk to a Manifest expert" onPress={() => {}} />
      <Text style={ms.disc}>General information, not financial or legal advice.</Text>
    </Screen>
  );
}

const ms = StyleSheet.create({
  badge: { width: 40, height: 40, borderRadius: 10, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", borderColor: colors.lineGold, borderWidth: 1 },
  headline: { color: colors.text, fontSize: 17, fontWeight: "700" },
  prompt: { flexDirection: "row", alignItems: "center", gap: sp(2.5), backgroundColor: colors.surface, borderColor: colors.line, borderWidth: 1, borderRadius: radius.md, padding: sp(3.5) },
  promptText: { color: colors.muted, fontSize: 14, flex: 1 },
  disc: { color: colors.dim, fontSize: 11, textAlign: "center" },
});
