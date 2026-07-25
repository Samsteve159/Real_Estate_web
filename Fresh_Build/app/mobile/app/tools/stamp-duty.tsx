import { useState, useMemo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { calculateDuty, type BuyerType } from "@manifest/core";
import { Screen, Eyebrow, H1, Body, Card, Label, StatTile, SourceNote, GoldButton } from "../../src/components/ui";
import { useTheme, radius, sp, type ThemeColors } from "../../src/theme";
import { aud } from "../../src/lib/format";

const BUYERS: { key: BuyerType; label: string }[] = [
  { key: "fhb", label: "First home" },
  { key: "ppr", label: "Live in" },
  { key: "investor", label: "Investor" },
];

const num = (s: string) => Number(s.replace(/[^0-9.]/g, "")) || 0;

export default function StampDuty() {
  const { c } = useTheme();
  const ss = useMemo(() => makeStyles(c), [c]);
  const [value, setValue] = useState("650,000");
  const [buyerType, setBuyerType] = useState<BuyerType>("fhb");
  const [foreign, setForeign] = useState(false);

  const result = useMemo(
    () => calculateDuty({ dutiableValue: num(value), buyerType, foreignPurchaser: foreign }),
    [value, buyerType, foreign]
  );

  return (
    <Screen>
      <Stack.Screen options={{ title: "Stamp duty" }} />
      <Eyebrow>VIC · Exact · SRO</Eyebrow>
      <H1>Stamp duty</H1>
      <Body>Victorian land transfer duty, calculated to the dollar from the SRO schedule.</Body>

      <Card style={{ gap: sp(3.5) }}>
        <View style={{ gap: sp(2) }}>
          <Label>Purchase price</Label>
          <View style={ss.inputWrap}>
            <Text style={ss.affix}>$</Text>
            <Text style={ss.inputText}>{value || "0"}</Text>
          </View>
          <View style={{ flexDirection: "row", gap: sp(2), flexWrap: "wrap" }}>
            {["550,000", "650,000", "750,000", "850,000", "1,000,000"].map((p) => (
              <Pressable key={p} onPress={() => setValue(p)} style={[ss.preset, value === p && ss.presetOn]}>
                <Text style={[ss.presetText, value === p && { color: c.accentText }]}>${p}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ gap: sp(2) }}>
          <Label>Buyer type</Label>
          <View style={ss.seg}>
            {BUYERS.map((b) => (
              <Pressable key={b.key} onPress={() => setBuyerType(b.key)} style={[ss.segItem, buyerType === b.key && ss.segOn]}>
                <Text style={[ss.segText, buyerType === b.key && { color: c.accentText }]}>{b.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable onPress={() => setForeign((f) => !f)} style={ss.toggle}>
          <View style={[ss.box, foreign && ss.boxOn]}>{foreign ? <Text style={{ color: c.accentText, fontWeight: "800" }}>✓</Text> : null}</View>
          <Text style={{ color: c.muted, fontSize: 14 }}>Foreign purchaser (+8%)</Text>
        </Pressable>
      </Card>

      <Card accent style={{ alignItems: "center", paddingVertical: sp(6) }}>
        <Label>Total duty payable</Label>
        <Text style={ss.big}>{aud(result.totalPayable)}</Text>
        {result.saving > 0 ? <Text style={ss.saving}>You save {aud(result.saving)} vs the general rate</Text> : null}
      </Card>

      <View style={{ flexDirection: "row", gap: sp(3) }}>
        <StatTile label="General rate" value={aud(result.generalDuty)} />
        <StatTile label="Concession duty" value={aud(result.duty)} />
        {result.foreignDuty > 0 ? <StatTile label="Foreign duty" value={aud(result.foreignDuty)} /> : null}
      </View>

      <SourceNote>{result.basis} Rates: State Revenue Office Victoria (sro.vic.gov.au).</SourceNote>

      <GoldButton title="Talk to a real expert" onPress={() => {}} />
    </Screen>
  );
}

const makeStyles = (c: ThemeColors) => StyleSheet.create({
  inputWrap: { flexDirection: "row", alignItems: "center", backgroundColor: c.surface2, borderColor: c.line, borderWidth: 1, borderRadius: radius.md, paddingHorizontal: sp(3.5), paddingVertical: sp(3.5), gap: sp(1) },
  affix: { color: c.accent, fontSize: 18, fontWeight: "700" },
  inputText: { color: c.text, fontSize: 22, fontWeight: "700" },
  preset: { paddingHorizontal: sp(3), paddingVertical: sp(2), borderRadius: radius.sm, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface2 },
  presetOn: { backgroundColor: c.accent, borderColor: c.accent },
  presetText: { color: c.muted, fontSize: 12, fontWeight: "600" },
  seg: { flexDirection: "row", backgroundColor: c.surface2, borderRadius: radius.md, padding: 4, gap: 4 },
  segItem: { flex: 1, paddingVertical: sp(2.5), borderRadius: radius.sm, alignItems: "center" },
  segOn: { backgroundColor: c.accent },
  segText: { color: c.muted, fontSize: 13, fontWeight: "600" },
  toggle: { flexDirection: "row", alignItems: "center", gap: sp(2.5) },
  box: { width: 24, height: 24, borderRadius: 6, borderColor: c.dim, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  boxOn: { backgroundColor: c.accent, borderColor: c.accent },
  big: { color: c.text, fontSize: 40, fontWeight: "800", letterSpacing: -1, marginTop: sp(1) },
  saving: { color: c.accent, fontSize: 13, fontWeight: "600", marginTop: sp(1) },
});
