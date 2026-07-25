import { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen, Eyebrow, H1, Body, Card, Label, GhostButton } from "../../src/components/ui";
import { useTheme, radius, sp, type ThemeColors } from "../../src/theme";

const PROMPTS = [
  "Is this property overpriced?",
  "Explain this contract clause.",
  "What should I ask at the inspection?",
  "Summarise this building report.",
  "What are my next steps?",
];

export default function Guide() {
  const { c } = useTheme();
  const ms = useMemo(() => makeStyles(c), [c]);
  return (
    <Screen>
      <Eyebrow>Your guide</Eyebrow>
      <H1>Ask anything</H1>
      <Body>The questions you're not sure who to ask — answered in plain English, with the source behind every claim, and a real person one tap away for the big calls.</Body>

      <Card accent style={{ gap: sp(3), alignItems: "flex-start" }}>
        <View style={ms.badge}><Ionicons name="sparkles-outline" size={18} color={c.accent} /></View>
        <Text style={ms.headline}>Grounded answers, backed by real experts</Text>
        <Body style={{ fontSize: 13 }}>
          Connecting to the live guide next — plain-English replies that cite comparable sales,
          overlays and official sources, with a hand-off to a real expert whenever it matters.
        </Body>
        <Label>Coming in the next build</Label>
      </Card>

      <Label>What you'll be able to ask</Label>
      {PROMPTS.map((p) => (
        <View key={p} style={ms.prompt}>
          <Ionicons name="chatbubble-ellipses-outline" size={16} color={c.accent} />
          <Text style={ms.promptText}>{p}</Text>
        </View>
      ))}

      <GhostButton title="Talk to a real expert" onPress={() => {}} />
      <Text style={ms.disc}>General information, not financial or legal advice.</Text>
    </Screen>
  );
}

const makeStyles = (c: ThemeColors) => StyleSheet.create({
  badge: { width: 40, height: 40, borderRadius: 10, backgroundColor: c.surface, alignItems: "center", justifyContent: "center", borderColor: c.lineAccent, borderWidth: 1 },
  headline: { color: c.text, fontSize: 17, fontWeight: "700" },
  prompt: { flexDirection: "row", alignItems: "center", gap: sp(2.5), backgroundColor: c.surface, borderColor: c.line, borderWidth: 1, borderRadius: radius.md, padding: sp(3.5) },
  promptText: { color: c.muted, fontSize: 14, flex: 1 },
  disc: { color: c.dim, fontSize: 11, textAlign: "center" },
});
