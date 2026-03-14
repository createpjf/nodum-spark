import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "@/hooks/useSettings";
import { useT } from "@/i18n/LanguageContext";

const languages = [
  { flag: "🇺🇸", name: "English", code: "EN" },
  { flag: "🇨🇳", name: "简体中文", code: "ZH-CN" },
  { flag: "🇭🇰", name: "繁體中文", code: "ZH-TW" },
  { flag: "🇰🇷", name: "한국어", code: "KO" },
];

export default function SpeechLanguage() {
  const navigate = useNavigate();
  const { settings, update } = useSettings();
  const { t } = useT();

  return (
    <PageTransition className="h-screen w-screen max-w-full md:max-w-[600px] mx-auto overflow-y-auto bg-background fixed inset-0">
      <div className="flex items-center gap-3 px-4 safe-header pb-4 glass sticky top-0 z-10">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ArrowLeft size={22} className="text-foreground" />
        </motion.button>
        <h1 className="text-lg font-semibold text-foreground">{t("language")}</h1>
      </div>
      <div className="px-5 pb-10 pt-4 safe-bottom">
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {languages.map((lang, i) => (
            <button
              key={lang.code}
              onClick={() => update("speechLanguage", lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-4 transition-colors ${i < languages.length - 1 ? "border-b border-border" : ""}`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="flex-1 text-left text-sm font-medium text-foreground">{lang.name}</span>
              <span className="text-xs text-muted-foreground mr-2">{lang.code}</span>
              {settings.speechLanguage === lang.code && <Check size={18} className="text-primary" />}
            </button>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
