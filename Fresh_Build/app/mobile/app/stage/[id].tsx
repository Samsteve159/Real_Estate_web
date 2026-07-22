import { View, Text, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { STAGES, type ItemKind } from "@manifest/core";
import { Screen, Eyebrow, H1, Body, Pill } from "../../src/components/ui";
import { useJourney } from "../../src/lib/journeyStore";
import { colors, radius, sp } from "../../src/theme";

const TOOL_ROUTES = new Set(["stamp-duty", "borrowing", "rental"]);

const KIND_LABEL: Partial<Record<ItemKind, string>> = {
  calc: "Tool", data: "Data", partner: "Perk", ai: "Mentor", human: "Talk to us",
};

export default function StageDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { progress, toggleItem } = useJourney();
  const stage = STAGES.find((s) => s.id === id);

  if (!stage) {
    return <Screen><Body>Stage not found.</Body></Screen>;
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: `Stage ${stage.n}` }} />
      <Eyebrow>Stage {stage.n} of 7</Eyebrow>
      <H1>{stage.title}</H1>
      <Body style={{ fontStyle: "italic", color: colors.gold }}>“{stage.want}”</Body>

      <View style={{ gap: sp(2.5), marginTop: sp(2) }}>
        {stage.items.map((item) => {
          const done = progress.checklist[item.id]?.done ?? false;
          const tool = item.kinds.includes("calc") && item.target && TOOL_ROUTES.has(item.target);
          const tag = item.kinds.map((k) => KIND_LABEL[k]).find(Boolean);
          return (
            <View key={item.id} style={[cs.row, done && cs.rowDone]}>
              <Pressable onPress={() => toggleItem(item.id)} hitSlop={8} style={[cs.check, done && cs.checkDone]}>
                {done ? <Ionicons name="checkmark" size={15} color={colors.bg} /> : null}
              </Pressable>
              <Pressable
                style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: sp(2) }}
                onPress={() => (tool ? router.push(`/tools/${item.target}`) : toggleItem(item.id))}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[cs.label, done && cs.labelDone]}>{item.label}</Text>
                </View>
                {tag ? <Pill tone={item.kinds.includes("partner") ? "gold" : "muted"}>{tag}</Pill> : null}
                {tool ? <Ionicons name="chevron-forward" size={16} color={colors.gold} /> : null}
              </Pressable>
            </View>
          );
        })}
      </View>

      <Text style={cs.hint}>Tap the circle to tick an item. Tools open when you tap the row.</Text>
    </Screen>
  );
}

const cs = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: sp(3), backgroundColor: colors.surface, borderColor: colors.line, borderWidth: 1, borderRadius: radius.md, padding: sp(3.5) },
  rowDone: { borderColor: colors.lineGold, backgroundColor: colors.goldWash },
  check: { width: 26, height: 26, borderRadius: 13, borderColor: colors.dim, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  checkDone: { backgroundColor: colors.gold, borderColor: colors.gold },
  label: { color: colors.text, fontSize: 15, fontWeight: "500" },
  labelDone: { color: colors.muted, textDecorationLine: "line-through" },
  hint: { color: colors.dim, fontSize: 12, marginTop: sp(3), textAlign: "center" },
});
