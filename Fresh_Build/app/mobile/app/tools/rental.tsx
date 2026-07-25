import { useState, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { assessRental } from "@manifest/core";
import { Screen, Eyebrow, H1, Body, Card, Label, StatTile, SourceNote, Field } from "../../src/components/ui";
import { useTheme, sp } from "../../src/theme";
import { aud, pct } from "../../src/lib/format";

const num = (s: string) => Number(s.replace(/[^0-9.]/g, "")) || 0;

export default function Rental() {
  const { c } = useTheme();
  const [price, setPrice] = useState("700000");
  const [rent, setRent] = useState("550");
  const [loan, setLoan] = useState("560000");
  const [rate, setRate] = useState("6.2");
  const [rates, setRates] = useState("1800");
  const [insurance, setInsurance] = useState("1200");

  const r = useMemo(
    () =>
      assessRental({
        purchasePrice: num(price), weeklyRent: num(rent), loanAmount: num(loan),
        interestRate: num(rate) / 100, councilRates: num(rates), insurance: num(insurance),
        maintenance: 1500, strata: 0, managementPct: 0.07, vacancyWeeks: 2,
      }),
    [price, rent, loan, rate, rates, insurance]
  );

  const gearColor = r.geared === "positive" ? c.good : r.geared === "negative" ? c.warn : c.muted;

  return (
    <Screen>
      <Stack.Screen options={{ title: "Rental yield" }} />
      <Eyebrow>Investor lens</Eyebrow>
      <H1>Rental yield & cash-flow</H1>
      <Body>Gross and net yield, plus the weekly cash-flow after costs (interest-only lens).</Body>

      <Card style={{ gap: sp(3) }}>
        <View style={{ flexDirection: "row", gap: sp(3) }}>
          <View style={{ flex: 1 }}><Field label="Price" value={price} onChangeText={setPrice} prefix="$" keyboardType="numeric" /></View>
          <View style={{ flex: 1 }}><Field label="Weekly rent" value={rent} onChangeText={setRent} prefix="$" keyboardType="numeric" /></View>
        </View>
        <View style={{ flexDirection: "row", gap: sp(3) }}>
          <View style={{ flex: 1 }}><Field label="Loan" value={loan} onChangeText={setLoan} prefix="$" keyboardType="numeric" /></View>
          <View style={{ flex: 1 }}><Field label="Rate" value={rate} onChangeText={setRate} suffix="%" keyboardType="numeric" /></View>
        </View>
        <View style={{ flexDirection: "row", gap: sp(3) }}>
          <View style={{ flex: 1 }}><Field label="Council rates" value={rates} onChangeText={setRates} prefix="$" keyboardType="numeric" /></View>
          <View style={{ flex: 1 }}><Field label="Insurance" value={insurance} onChangeText={setInsurance} prefix="$" keyboardType="numeric" /></View>
        </View>
      </Card>

      <View style={{ flexDirection: "row", gap: sp(3) }}>
        <StatTile label="Gross yield" value={pct(r.grossYield)} />
        <StatTile label="Net yield" value={pct(r.netYield)} />
      </View>

      <Card accent style={{ alignItems: "center", paddingVertical: sp(5) }}>
        <Label>Weekly cash-flow</Label>
        <Text style={[styles.big, { color: gearColor }]}>{aud(r.weeklyCashflow)}</Text>
        <Text style={{ color: c.muted, fontSize: 13, textTransform: "capitalize" }}>{r.geared}ly geared</Text>
      </Card>

      <View style={{ flexDirection: "row", gap: sp(3) }}>
        <StatTile label="Annual rent" value={aud(r.grossAnnualRent)} />
        <StatTile label="Annual cash-flow" value={aud(r.annualCashflow)} />
      </View>

      <SourceNote>
        Interest-only lens, 7% management, 2 weeks vacancy, $1,500 maintenance assumed. Adjust inputs for your scenario.
        Indicative — not tax or financial advice.
      </SourceNote>
    </Screen>
  );
}

const styles = StyleSheet.create({
  big: { fontSize: 36, fontWeight: "800", letterSpacing: -1, marginTop: sp(1) },
});
