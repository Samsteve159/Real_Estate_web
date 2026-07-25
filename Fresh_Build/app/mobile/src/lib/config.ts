import { Platform } from "react-native";

/**
 * Base URL for the backend (valuation, guide chat, leads).
 * Override at build/run time with EXPO_PUBLIC_API_BASE.
 *
 * Dev defaults: iOS simulator reaches the host via localhost; the Android
 * emulator reaches the host loopback via 10.0.2.2.
 */
const devDefault =
  Platform.OS === "android" ? "http://10.0.2.2:8787/api" : "http://localhost:8787/api";

export const API_BASE = process.env.EXPO_PUBLIC_API_BASE ?? devDefault;

/**
 * Brand — WORKING PLACEHOLDER only. Final name is TBD with AK; the app is a
 * neutral, agent-distributed platform (NOT "Manifest", NOT "powered by Manifest").
 * Positioning: a trusted companion / second brain for the whole home-buying journey.
 */
export const BRAND = {
  name: "Homebuyer",
  tagline: "Your trusted home-buying companion",
  promise: "One place that remembers your whole journey.",
};
