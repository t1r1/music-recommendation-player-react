"use client";
// marks this file as a client component so we can use state, context, hooks

import React, { createContext, useContext, useMemo, useState } from "react";

/**
 * describes a single mood configuration
 * this comes from the api and drives the ui
 */
type MoodConfig = {
  key: string; // unique mood id (e.g. "sad", "happy")
  label: string; // text shown in the ui
  gradient: string; // tailwind gradient classes
};

/**
 * describes the full mood payload returned by the api
 * moods is an array so we can render it easily with .map()
 */
type MoodMaps = {
  moods: MoodConfig[];
};

/**
 * this is the shape of the data exposed through react context
 */
type MoodContextValue = {
  moodMaps: MoodMaps; // all mood configurations
  currentMood: string; // currently selected mood key
  setCurrentMood: (mood: string) => void; // updates selected mood
};

/**
 * create the context container
 * default value is null so we can detect misuse
 */
const MoodContext = createContext<MoodContextValue | null>(null);

/**
 * provider component
 * receives mood maps from the server and stores them in client state
 */
export function MoodProvider({
  initialMoodMaps,
  children,
}: {
  initialMoodMaps: MoodMaps; // server-fetched mood data
  children: React.ReactNode; // app content wrapped by the provider
}) {
  // choose a default mood (first available or fallback)
  const defaultMood = initialMoodMaps.moods[0]?.key ?? "joy";

  // store mood maps once; they are treated as static config
  const [moodMaps] = useState<MoodMaps>(initialMoodMaps);

  // store the currently selected mood
  const [currentMood, setCurrentMood] = useState<string>("");

  // memoize the context value to avoid unnecessary re-renders
  const value = useMemo(
    () => ({ moodMaps, currentMood, setCurrentMood }),
    [moodMaps, currentMood],
  );

  // expose mood data and state to all children
  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
}

/**
 * custom hook to consume mood context
 * ensures it is used inside the provider
 */
export function useMood() {
  const ctx = useContext(MoodContext);

  // fail fast if the hook is used outside the provider
  if (!ctx) throw new Error("useMood must be used within MoodProvider");

  return ctx;
}
