import { useMemo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { STAGES, readinessScore } from "@manifest/core";
import { Screen, Eyebrow, H1, Body, Card, Label } from "../../src/components/ui";
import { useJourney } from "../../src/lib/journeyStore";
import { useTheme, radius, sp, type ThemeColors } from "../../src/theme";
import { BRAND } from "../../src/lib/config";

function stageStats(stageIndex: number, checklist: Record<string, { done: boolean }>) {
  const items = STAGES[stageIndex].items;
  const done = items.filter((i) => checklist[i.id]?.done).length;
  return { done, total: items.length, pct: items.length ? done / items.length : 0 };
}

export default function Journey() {
  const router = useRouter();
  const { c } = useTheme();
  const st = useMemo(() => makeStyles(c), [c]);
  const { progress } = useJourney();
  const readiness = readinessScore(progress);

  return (
    <Screen>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View style={{ flex: 1 }}>
          <Eyebrow>Your home journey</Eyebrow>
          <H1 style={{ marginTop: sp(1) }}>Welcome back</H1>
          <Body style={{ fontSize: 13, marginTop: sp(1) }}>{BRAND.promise}</Body>
        </View>
      </View>

      {/* Readiness */}
      <Card accent style={{ flexDirection: "row", alignItems: "center", gap: sp(4) }}>
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
                    <Ionicons name="checkmark" size={16} color={c.accentText} />
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
                <Ionicons name="chevron-forward" size={18} color={c.dim} />
              </View>
            )}
          </Pressable>
        );
      })}
    </Screen>
  );
}

const makeStyles = (c: ThemeColors) => StyleSheet.create({
  score: { width: 66, height: 66, borderRadius: 33, backgroundColor: c.bg, borderColor: c.accent, borderWidth: 3, alignItems: "center", justifyContent: "center", flexDirection: "row" },
  scoreNum: { color: c.text, fontSize: 22, fontWeight: "800" },
  scorePct: { color: c.accent, fontSize: 11, fontWeight: "700", marginTop: 4 },
  scoreTitle: { color: c.text, fontSize: 16, fontWeight: "700" },
  track: { height: 5, borderRadius: 3, backgroundColor: c.surface3, marginTop: sp(2.5), overflow: "hidden" },
  fill: { height: "100%", borderRadius: 3, backgroundColor: c.accent },
  stage: { flexDirection: "row", alignItems: "center", gap: sp(3), backgroundColor: c.surface, borderColor: c.line, borderWidth: 1, borderRadius: radius.lg, padding: sp(3.5) },
  stageDone: { borderColor: c.lineAccent },
  num: { width: 30, height: 30, borderRadius: 9, backgroundColor: c.surface3, alignItems: "center", justifyContent: "center" },
  numDone: { backgroundColor: c.accent },
  numText: { color: c.muted, fontSize: 14, fontWeight: "700" },
  stageTitle: { color: c.text, fontSize: 15, fontWeight: "600" },
  stageSub: { color: c.dim, fontSize: 12, marginTop: 1 },
  trackSm: { height: 4, borderRadius: 2, backgroundColor: c.surface3, marginTop: sp(1.5), overflow: "hidden" },
  fillSm: { height: "100%", borderRadius: 2, backgroundColor: c.accent },
});
