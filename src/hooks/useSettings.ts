import { useSyncExternalStore, useCallback } from "react";

export interface Settings {
  displayName: string;
  email: string;
  speechLanguage: string;
  pushNotifications: boolean;
  emailNotifications: boolean;
  soundEnabled: boolean;
  dataCollection: boolean;
  chatHistorySaving: boolean;
  analyticsEnabled: boolean;
  creditBalance: number;
  webSearchEnabled: boolean;
}

const STORAGE_KEY = "flock-settings";

const defaults: Settings = {
  displayName: "User",
  email: "user@example.com",
  speechLanguage: "EN",
  pushNotifications: true,
  emailNotifications: false,
  soundEnabled: true,
  dataCollection: true,
  chatHistorySaving: true,
  analyticsEnabled: true,
  creditBalance: 0,
  webSearchEnabled: false,
};

function load(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch {
    return defaults;
  }
}

// Shared in-memory snapshot — all subscribers see the same object
let snapshot = load();
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  return snapshot;
}

function setField<K extends keyof Settings>(key: K, value: Settings[K]) {
  const next = { ...snapshot, [key]: value };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  snapshot = next;
  listeners.forEach((cb) => cb());
}

export function useSettings() {
  const settings = useSyncExternalStore(subscribe, getSnapshot);

  const update = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setField(key, value);
  }, []);

  return { settings, update };
}
