import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { STAGES, readinessScore } from "@manifest/core";
import { Screen, Eyebrow, H1, Body, Card, Label } from "../../src/components/ui";
import { useJourney } from "../../src/lib/journeyStore";
import { colors, radius, sp } from "../../src/theme";
import { BRAND } from "../../src/lib/config";

function stageStats(stageIndex: number, checklist: Record<string, { done: boolean }>) {
  const items = STAGES[stageIndex].items;
  const done = items.filter((i) => checklist[i.id]?.done).length;
  return { done, total: items.length, pct: items.length ? done / items.length : 0 };
}

export default function Journey() {
  const router = useRouter();
  const { progress } = useJourney();
  const readiness = readinessScore(progress);

  return (
    <Screen>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View>
          <Eyebrow>Good to see you</Eyebrow>
          <H1 style={{ marginTop: sp(1) }}>Your journey</H1>
        </View>
        <Text style={st.powered}>{BRAND.poweredBy}</Text>
      </View>

      {/* Readiness */}
      <Card gold style={{ flexDirection: "row", alignItems: "center", gap: sp(4) }}>
        <View style={st.score}>
          <Text style={st.scoreNum}>{readiness}</Text>
          <Text style={st.scorePct}>%</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={st.scoreTitle}>Buyer Readiness</Text>
          <Body style={{ fontSize: 13, marginTop: 2 }}>
            {readiness < 100
              ? "Complete your Get Ready steps to become offer-ready."
              : "You're offer-ready — nice work."}
          </Body>
          <View style={st.track}><View style={[st.fill, { width: `${readiness}%` }]} /></View>
        </View>
      </Card>

      <Label>The seven stages</Label>

      {STAGES.map((stage, i) => {
        const { done, total, pct } = stageStats(i, progress.checklist);
        const complete = done === total;
        return (
          <Pressable key={stage.id} onPress={() => router.push(`/stage/${stage.id}`)}>
            {({ pressed }) => (
              <View style={[st.stage, complete && st.stageDone, pressed && { opacity: 0.7 }]}>
                <View style={[st.num, complete && st.numDone]}>
                  {complete ? (
                    <Ionicons name="checkmark" size={16} color={colors.bg} />
                  ) : (
                    <Text style={st.numText}>{stage.n}</Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={st.stageTitle}>{stage.title}</Text>
                  <Text style={st.stageSub}>{complete ? "Complete" : `${done} of ${total} done`}</Text>
                  {!complete && done > 0 ? (
                    <View style={st.trackSm}><View style={[st.fillSm, { width: `${pct * 100}%` }]} /></View>
                  ) : null}
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.dim} />
              </View>
            )}
          </Pressable>
        );
      })}
    </Screen>
  );
}

const st = StyleSheet.create({
  powered: { color: colors.dim, fontSize: 9, letterSpacing: 1, textTransform: "uppercase", textAlign: "right", maxWidth: 90 },
  score: { width: 66, height: 66, borderRadius: 33, backgroundColor: colors.bg, borderColor: colors.gold, borderWidth: 3, alignItems: "center", justifyContent: "center", flexDirection: "row" },
  scoreNum: { color: colors.text, fontSize: 22, fontWeight: "800" },
  scorePct: { color: colors.gold, fontSize: 11, fontWeight: "700", marginTop: 4 },
  scoreTitle: { color: colors.text, fontSize: 16, fontWeight: "700" },
  track: { height: 5, borderRadius: 3, backgroundColor: colors.surface3, marginTop: sp(2.5), overflow: "hidden" },
  fill: { height: "100%", borderRadius: 3, backgroundColor: colors.gold },
  stage: { flexDirection: "row", alignItems: "center", gap: sp(3), backgroundColor: colors.surface, borderColor: colors.line, borderWidth: 1, borderRadius: radius.lg, padding: sp(3.5) },
  stageDone: { borderColor: colors.lineGold },
  num: { width: 30, height: 30, borderRadius: 9, backgroundColor: colors.surface3, alignItems: "center", justifyContent: "center" },
  numDone: { backgroundColor: colors.gold },
  numText: { color: colors.muted, fontSize: 14, fontWeight: "700" },
  stageTitle: { color: colors.text, fontSize: 15, fontWeight: "600" },
  stageSub: { color: colors.dim, fontSize: 12, marginTop: 1 },
  trackSm: { height: 4, borderRadius: 2, backgroundColor: colors.surface3, marginTop: sp(1.5), overflow: "hidden" },
  fillSm: { height: "100%", borderRadius: 2, backgroundColor: colors.goldDim },
});
