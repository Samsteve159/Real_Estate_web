import React from "react";
import {
  View, Text, TextInput, Pressable, ScrollView, StyleSheet,
  type ViewStyle, type TextStyle, type KeyboardTypeOptions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radius, sp, type } from "../theme";

/* ---- Layout ---- */
export function Screen({ children, scroll = true }: { children: React.ReactNode; scroll?: boolean }) {
  const body = scroll ? (
    <ScrollView
      contentContainerStyle={{ padding: sp(5), paddingBottom: sp(16), gap: sp(4) }}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={{ flex: 1, padding: sp(5), gap: sp(4) }}>{children}</View>
  );
  return <SafeAreaView style={s.screen} edges={["top", "left", "right"]}>{body}</SafeAreaView>;
}

/* ---- Type ---- */
export const Eyebrow = ({ children }: { children: React.ReactNode }) => <Text style={type.eyebrow}>{children}</Text>;
export const H1 = ({ children, style }: { children: React.ReactNode; style?: TextStyle }) => <Text style={[type.h1, style]}>{children}</Text>;
export const H2 = ({ children, style }: { children: React.ReactNode; style?: TextStyle }) => <Text style={[type.h2, style]}>{children}</Text>;
export const H3 = ({ children, style }: { children: React.ReactNode; style?: TextStyle }) => <Text style={[type.h3, style]}>{children}</Text>;
export const Body = ({ children, style }: { children: React.ReactNode; style?: TextStyle }) => <Text style={[type.body, style]}>{children}</Text>;
export const Label = ({ children }: { children: React.ReactNode }) => <Text style={type.label}>{children}</Text>;
export const Gold = ({ children, style }: { children: React.ReactNode; style?: TextStyle }) => <Text style={[{ color: colors.gold }, style]}>{children}</Text>;

/* ---- Surfaces ---- */
export function Card({ children, style, gold }: { children: React.ReactNode; style?: ViewStyle; gold?: boolean }) {
  return <View style={[s.card, gold && s.cardGold, style]}>{children}</View>;
}

export const Divider = () => <View style={s.divider} />;

export function Pill({ children, tone = "gold" }: { children: React.ReactNode; tone?: "gold" | "muted" }) {
  return (
    <View style={[s.pill, tone === "gold" ? s.pillGold : s.pillMuted]}>
      <Text style={[s.pillText, { color: tone === "gold" ? colors.gold : colors.muted }]}>{children}</Text>
    </View>
  );
}

/* ---- Inputs ---- */
export function Field({
  label, value, onChangeText, placeholder, keyboardType = "default", prefix, suffix,
}: {
  label: string; value: string; onChangeText: (t: string) => void; placeholder?: string;
  keyboardType?: KeyboardTypeOptions; prefix?: string; suffix?: string;
}) {
  return (
    <View style={{ gap: sp(2) }}>
      <Label>{label}</Label>
      <View style={s.inputWrap}>
        {prefix ? <Text style={s.affix}>{prefix}</Text> : null}
        <TextInput
          style={s.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.dim}
          keyboardType={keyboardType}
          selectionColor={colors.gold}
        />
        {suffix ? <Text style={s.affix}>{suffix}</Text> : null}
      </View>
    </View>
  );
}

/* ---- Buttons ---- */
export function GoldButton({ title, onPress, disabled }: { title: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [s.gold, (pressed || disabled) && { opacity: 0.6 }]}>
      <Text style={s.goldText}>{title}</Text>
    </Pressable>
  );
}

export function GhostButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.ghost, pressed && { opacity: 0.6 }]}>
      <Text style={s.ghostText}>{title}</Text>
    </Pressable>
  );
}

/* ---- Stat ---- */
export function StatTile({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return (
    <View style={[s.card, { flex: 1 }]}>
      <Label>{label}</Label>
      <Text style={[s.statVal, big && { fontSize: 28 }]}>{value}</Text>
    </View>
  );
}

/* ---- Source note (trust) ---- */
export function SourceNote({ children }: { children: React.ReactNode }) {
  return (
    <View style={s.source}>
      <Text style={s.sourceKey}>How</Text>
      <Text style={s.sourceText}>{children}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  card: { backgroundColor: colors.surface, borderColor: colors.line, borderWidth: 1, borderRadius: radius.lg, padding: sp(4), gap: sp(2) },
  cardGold: { borderColor: colors.lineGold, backgroundColor: colors.goldWash },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: sp(1) },
  pill: { alignSelf: "flex-start", paddingHorizontal: sp(2.5), paddingVertical: sp(1), borderRadius: radius.sm, borderWidth: 1 },
  pillGold: { backgroundColor: colors.goldWash, borderColor: colors.lineGold },
  pillMuted: { backgroundColor: colors.surface3, borderColor: colors.line },
  pillText: { fontSize: 10, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase" },
  inputWrap: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderColor: colors.line, borderWidth: 1, borderRadius: radius.md, paddingHorizontal: sp(3.5) },
  input: { flex: 1, color: colors.text, fontSize: 16, paddingVertical: sp(3.5) },
  affix: { color: colors.dim, fontSize: 15, fontWeight: "600" },
  gold: { backgroundColor: colors.gold, borderRadius: radius.md, paddingVertical: sp(4), alignItems: "center" },
  goldText: { color: colors.bg, fontSize: 15, fontWeight: "700", letterSpacing: 0.3 },
  ghost: { borderColor: colors.lineGold, borderWidth: 1, borderRadius: radius.md, paddingVertical: sp(3.5), alignItems: "center" },
  ghostText: { color: colors.gold, fontSize: 14, fontWeight: "600" },
  statVal: { color: colors.text, fontSize: 20, fontWeight: "700", letterSpacing: -0.3 },
  source: { flexDirection: "row", gap: sp(3), borderColor: colors.lineGold, borderWidth: 1, borderStyle: "dashed", borderRadius: radius.md, backgroundColor: colors.goldWash, padding: sp(3.5) },
  sourceKey: { color: colors.gold, fontSize: 10, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase", paddingTop: 2 },
  sourceText: { flex: 1, color: colors.muted, fontSize: 12, lineHeight: 18 },
});
