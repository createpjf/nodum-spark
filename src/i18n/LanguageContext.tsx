import { createContext, useContext, useCallback, useMemo } from "react";
import { translations } from "./translations";
import { useSettings } from "@/hooks/useSettings";

interface LanguageContextValue {
  lang: string;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "EN",
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const lang = settings.speechLanguage;

  const t = useCallback(
    (key: string): string => {
      return translations[lang]?.[key] ?? translations["EN"]?.[key] ?? key;
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, t }), [lang, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useT() {
  return useContext(LanguageContext);
}
