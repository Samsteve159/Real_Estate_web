import { useState, useMemo } from "react";
import { View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import { Stack } from "expo-router";
import { assessPreBuying, type BuyerType } from "@manifest/core";
import { Screen, Eyebrow, H1, Body, Card, Label, StatTile, SourceNote, GoldButton } from "../../src/components/ui";
import { colors, radius, sp } from "../../src/theme";
import { aud } from "../../src/lib/format";

const BUYERS: { key: BuyerType; label: string }[] = [
  { key: "fhb", label: "First home" },
  { key: "ppr", label: "Live in" },
  { key: "investor", label: "Investor" },
];
const num = (s: string) => Number(s.replace(/[^0-9.]/g, "")) || 0;

function NumField({ label, value, set, prefix, suffix }: { label: string; value: string; set: (s: string) => void; prefix?: string; suffix?: string }) {
  return (
    <View style={{ flex: 1, gap: sp(2) }}>
      <Label>{label}</Label>
      <View style={bs.inputWrap}>
        {prefix ? <Text style={bs.affix}>{prefix}</Text> : null}
        <View style={{ flex: 1 }}>
          <TextInputField value={value} set={set} />
        </View>
        {suffix ? <Text style={bs.affix}>{suffix}</Text> : null}
      </View>
    </View>
  );
}

function TextInputField({ value, set }: { value: string; set: (s: string) => void }) {
  return (
    <TextInput
      value={value}
      onChangeText={set}
      keyboardType="numeric"
      placeholderTextColor={colors.dim}
      selectionColor={colors.gold}
      style={{ color: colors.text, fontSize: 16, paddingVertical: sp(3.5) }}
    />
  );
}

export default function Borrowing() {
  const [income, setIncome] = useState("95000");
  const [expenses, setExpenses] = useState("2000");
  const [debts, setDebts] = useState("300");
  const [savings, setSavings] = useState("120000");
  const [price, setPrice] = useState("700000");
  const [rate, setRate] = useState("6.2");
  const [buyerType, setBuyerType] = useState<BuyerType>("fhb");

  const r = useMemo(
    () =>
      assessPreBuying({
        grossIncome: num(income), monthlyExpenses: num(expenses), monthlyDebts: num(debts),
        savings: num(savings), purchasePrice: num(price), interestRate: num(rate), buyerType,
      }),
    [income, expenses, debts, savings, price, rate, buyerType]
  );

  return (
    <Screen>
      <Stack.Screen options={{ title: "Borrowing capacity" }} />
      <Eyebrow>Indicative</Eyebrow>
      <H1>Borrowing capacity</H1>
      <Body>A broker-grade estimate of what you could borrow and buy, and the cash you'd need up front.</Body>

      <Card style={{ gap: sp(3) }}>
        <View style={{ flexDirection: "row", gap: sp(3) }}>
          <NumField label="Gross income (yr)" value={income} set={setIncome} prefix="$" />
          <NumField label="Interest rate" value={rate} set={setRate} suffix="%" />
        </View>
        <View style={{ flexDirection: "row", gap: sp(3) }}>
          <NumField label="Monthly expenses" value={expenses} set={setExpenses} prefix="$" />
          <NumField label="Monthly debts" value={debts} set={setDebts} prefix="$" />
        </View>
        <View style={{ flexDirection: "row", gap: sp(3) }}>
          <NumField label="Savings" value={savings} set={setSavings} prefix="$" />
          <NumField label="Target price" value={price} set={setPrice} prefix="$" />
        </View>
        <View style={{ gap: sp(2) }}>
          <Label>Buyer type</Label>
          <View style={bs.seg}>
            {BUYERS.map((b) => (
              <Pressable key={b.key} onPress={() => setBuyerType(b.key)} style={[bs.segItem, buyerType === b.key && bs.segOn]}>
                <Text style={[bs.segText, buyerType === b.key && { color: colors.bg }]}>{b.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Card>

      <Card gold style={{ alignItems: "center", paddingVertical: sp(6) }}>
        <Label>You could borrow up to</Label>
        <Text style={bs.big}>{aud(r.maxBorrow)}</Text>
        <Text style={bs.sub}>Buying power ≈ {aud(r.maxPurchase)}</Text>
      </Card>

      <View style={{ flexDirection: "row", gap: sp(3) }}>
        <StatTile label="Deposit" value={aud(r.depositAmount)} />
        <StatTile label="Stamp duty" value={aud(r.stampDuty)} />
      </View>
      <View style={{ flexDirection: "row", gap: sp(3) }}>
        <StatTile label="Upfront costs" value={aud(r.upfrontCosts)} />
        <StatTile label="Monthly repay" value={aud(r.monthlyRepayment)} />
      </View>

      <Card style={{ borderColor: r.canService ? colors.lineGold : colors.line }}>
        <Text style={{ color: r.canService ? colors.good : colors.warn, fontWeight: "700" }}>
          {r.canService ? "✓ Serviceable at this price" : `Short by ${aud(r.cashShortfall)} in cash to complete`}
        </Text>
      </Card>

      <SourceNote>
        ATO 2024–25 tax brackets + 2% Medicare, APRA +3% serviceability buffer, 30-year term. Stamp duty exact (SRO VIC).
        Borrowing/LMI are indicative — a broker confirms your real number.
      </SourceNote>

      <GoldButton title="Email me my report" onPress={() => {}} />
    </Screen>
  );
}

const bs = StyleSheet.create({
  inputWrap: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surface2, borderColor: colors.line, borderWidth: 1, borderRadius: radius.md, paddingHorizontal: sp(3), gap: sp(1) },
  affix: { color: colors.dim, fontSize: 15, fontWeight: "600" },
  seg: { flexDirection: "row", backgroundColor: colors.surface2, borderRadius: radius.md, padding: 4, gap: 4 },
  segItem: { flex: 1, paddingVertical: sp(2.5), borderRadius: radius.sm, alignItems: "center" },
  segOn: { backgroundColor: colors.gold },
  segText: { color: colors.muted, fontSize: 13, fontWeight: "600" },
  big: { color: colors.text, fontSize: 38, fontWeight: "800", letterSpacing: -1, marginTop: sp(1) },
  sub: { color: colors.gold, fontSize: 13, fontWeight: "600", marginTop: sp(1) },
});
