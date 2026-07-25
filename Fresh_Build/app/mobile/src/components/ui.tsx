import React, { useMemo } from "react";
import {
  View, Text, TextInput, Pressable, ScrollView, StyleSheet,
  type ViewStyle, type TextStyle, type KeyboardTypeOptions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { radius, sp, type, useTheme, type ThemeColors } from "../theme";

/* ---- Layout ---- */
export function Screen({ children, scroll = true }: { children: React.ReactNode; scroll?: boolean }) {
  const { c } = useTheme();
  const body = scroll ? (
    <ScrollView
      style={{ flex: 1, width: "100%" }}
      contentContainerStyle={{ padding: sp(5), paddingBottom: sp(16), gap: sp(4), width: "100%", maxWidth: "100%" }}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={{ flex: 1, width: "100%", padding: sp(5), gap: sp(4) }}>{children}</View>
  );
  return <SafeAreaView style={{ flex: 1, width: "100%", backgroundColor: c.bg, overflow: "hidden" }} edges={["top", "left", "right"]}>{body}</SafeAreaView>;
}

/* ---- Type ---- */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  const { c } = useTheme();
  return <Text style={[type.eyebrow, { color: c.accent }]}>{children}</Text>;
}
export function H1({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  const { c } = useTheme();
  return <Text style={[type.h1, { color: c.text }, style]}>{children}</Text>;
}
export function H2({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  const { c } = useTheme();
  return <Text style={[type.h2, { color: c.text }, style]}>{children}</Text>;
}
export function H3({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  const { c } = useTheme();
  return <Text style={[type.h3, { color: c.text }, style]}>{children}</Text>;
}
export function Body({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  const { c } = useTheme();
  return <Text style={[type.body, { color: c.muted }, style]}>{children}</Text>;
}
export function Label({ children }: { children: React.ReactNode }) {
  const { c } = useTheme();
  return <Text style={[type.label, { color: c.dim }]}>{children}</Text>;
}
export function Gold({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  const { c } = useTheme();
  return <Text style={[{ color: c.accent }, style]}>{children}</Text>;
}

/* ---- Surfaces ---- */
export function Card({ children, style, accent }: { children: React.ReactNode; style?: ViewStyle; accent?: boolean }) {
  const { c } = useTheme();
  return (
    <View style={[
      { backgroundColor: accent ? c.accentWash : c.surface, borderColor: accent ? c.lineAccent : c.line, borderWidth: 1, borderRadius: radius.lg, padding: sp(4), gap: sp(2) },
      style,
    ]}>
      {children}
    </View>
  );
}

export function Divider() {
  const { c } = useTheme();
  return <View style={{ height: 1, backgroundColor: c.line, marginVertical: sp(1) }} />;
}

export function Pill({ children, tone = "accent" }: { children: React.ReactNode; tone?: "accent" | "muted" }) {
  const { c } = useTheme();
  return (
    <View style={{
      alignSelf: "flex-start", paddingHorizontal: sp(2.5), paddingVertical: sp(1), borderRadius: radius.sm, borderWidth: 1,
      backgroundColor: tone === "accent" ? c.accentWash : c.surface3,
      borderColor: tone === "accent" ? c.lineAccent : c.line,
    }}>
      <Text style={{ fontSize: 10, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase", color: tone === "accent" ? c.accent : c.muted }}>{children}</Text>
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
  const { c } = useTheme();
  return (
    <View style={{ gap: sp(2) }}>
      <Label>{label}</Label>
      <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: c.surface2, borderColor: c.line, borderWidth: 1, borderRadius: radius.md, paddingHorizontal: sp(3.5) }}>
        {prefix ? <Text style={{ color: c.dim, fontSize: 15, fontWeight: "600" }}>{prefix}</Text> : null}
        <TextInput
          style={{ flex: 1, color: c.text, fontSize: 16, paddingVertical: sp(3.5) }}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={c.dim}
          keyboardType={keyboardType}
          selectionColor={c.accent}
        />
        {suffix ? <Text style={{ color: c.dim, fontSize: 15, fontWeight: "600" }}>{suffix}</Text> : null}
      </View>
    </View>
  );
}

/* ---- Buttons ---- */
export function GoldButton({ title, onPress, disabled }: { title: string; onPress: () => void; disabled?: boolean }) {
  const { c } = useTheme();
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [
      { backgroundColor: c.accent, borderRadius: radius.md, paddingVertical: sp(4), alignItems: "center" },
      (pressed || disabled) && { opacity: 0.6 },
    ]}>
      <Text style={{ color: c.accentText, fontSize: 15, fontWeight: "700", letterSpacing: 0.3 }}>{title}</Text>
    </Pressable>
  );
}

export function GhostButton({ title, onPress }: { title: string; onPress: () => void }) {
  const { c } = useTheme();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [
      { borderColor: c.lineAccent, borderWidth: 1, borderRadius: radius.md, paddingVertical: sp(3.5), alignItems: "center" },
      pressed && { opacity: 0.6 },
    ]}>
      <Text style={{ color: c.accent, fontSize: 14, fontWeight: "600" }}>{title}</Text>
    </Pressable>
  );
}

/* ---- Stat ---- */
export function StatTile({ label, value, big }: { label: string; value: string; big?: boolean }) {
  const { c } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: c.surface, borderColor: c.line, borderWidth: 1, borderRadius: radius.lg, padding: sp(4), gap: sp(2) }}>
      <Label>{label}</Label>
      <Text style={{ color: c.text, fontSize: big ? 28 : 20, fontWeight: "700", letterSpacing: -0.3 }}>{value}</Text>
    </View>
  );
}

/* ---- Source note (trust) ---- */
export function SourceNote({ children }: { children: React.ReactNode }) {
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: "row", gap: sp(3), borderColor: c.lineAccent, borderWidth: 1, borderStyle: "dashed", borderRadius: radius.md, backgroundColor: c.accentWash, padding: sp(3.5) }}>
      <Text style={{ color: c.accent, fontSize: 10, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase", paddingTop: 2 }}>How</Text>
      <Text style={{ flex: 1, color: c.muted, fontSize: 12, lineHeight: 18 }}>{children}</Text>
    </View>
  );
}
