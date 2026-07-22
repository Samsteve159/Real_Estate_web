import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { JourneyProgress } from "@manifest/core";

const KEY = "manifest.journey.v1";

const empty: JourneyProgress = { currentStage: 1, checklist: {}, updatedAt: new Date().toISOString() };

type Ctx = {
  progress: JourneyProgress;
  ready: boolean;
  toggleItem: (id: string) => void;
  setDue: (id: string, dueDate?: string) => void;
  setCurrentStage: (n: number) => void;
  reset: () => void;
};

const JourneyContext = createContext<Ctx | null>(null);

export function JourneyProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<JourneyProgress>(empty);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) setProgress(JSON.parse(raw));
      } catch {
        // ignore — start fresh
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const persist = useCallback((next: JourneyProgress) => {
    next.updatedAt = new Date().toISOString();
    setProgress(next);
    AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const toggleItem = useCallback((id: string) => {
    setProgress((p) => {
      const cur = p.checklist[id]?.done ?? false;
      const next: JourneyProgress = {
        ...p,
        checklist: {
          ...p.checklist,
          [id]: {
            ...p.checklist[id],
            done: !cur,
            completedAt: !cur ? new Date().toISOString() : undefined,
          },
        },
        updatedAt: new Date().toISOString(),
      };
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const setDue = useCallback((id: string, dueDate?: string) => {
    setProgress((p) => {
      const next: JourneyProgress = {
        ...p,
        checklist: { ...p.checklist, [id]: { ...(p.checklist[id] ?? { done: false }), dueDate } },
        updatedAt: new Date().toISOString(),
      };
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const setCurrentStage = useCallback((n: number) => persist({ ...progress, currentStage: n }), [progress, persist]);
  const reset = useCallback(() => persist({ ...empty, updatedAt: new Date().toISOString() }), [persist]);

  return (
    <JourneyContext.Provider value={{ progress, ready, toggleItem, setDue, setCurrentStage, reset }}>
      {children}
    </JourneyContext.Provider>
  );
}

export function useJourney(): Ctx {
  const ctx = useContext(JourneyContext);
  if (!ctx) throw new Error("useJourney must be used within JourneyProvider");
  return ctx;
}
