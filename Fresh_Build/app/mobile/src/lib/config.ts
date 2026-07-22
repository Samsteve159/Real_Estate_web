import { Platform } from "react-native";

/**
 * Base URL for the Manifest `api/` backend (valuation, mentor chat, leads).
 * Override at build/run time with EXPO_PUBLIC_API_BASE.
 *
 * Dev defaults: iOS simulator can reach the host via localhost; the Android
 * emulator reaches the host loopback via 10.0.2.2.
 */
const devDefault =
  Platform.OS === "android" ? "http://10.0.2.2:8787/api" : "http://localhost:8787/api";

export const API_BASE = process.env.EXPO_PUBLIC_API_BASE ?? devDefault;

/** Brand — working name until Akshay locks it (see knowledge/BRAND.md). */
export const BRAND = {
  name: "Manifest Buyer",
  tagline: "Your personal buyer, in your pocket",
  poweredBy: "Powered by Manifest Real Estate",
};
