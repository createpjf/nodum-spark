import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { ArrowLeft, Bell, Mail, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/hooks/useSettings";
import { useT } from "@/i18n/LanguageContext";

export default function Notifications() {
  const navigate = useNavigate();
  const { settings, update } = useSettings();
  const { t } = useT();

  const rows = [
    { icon: Bell, label: t("pushNotifications"), desc: t("pushNotificationsDesc"), key: "pushNotifications" as const },
    { icon: Mail, label: t("emailNotifications"), desc: t("emailNotificationsDesc"), key: "emailNotifications" as const },
    { icon: Volume2, label: t("sound"), desc: t("soundDesc"), key: "soundEnabled" as const },
  ];

  return (
    <PageTransition className="h-screen w-screen max-w-full md:max-w-[600px] mx-auto overflow-y-auto bg-background fixed inset-0">
      <div className="flex items-center gap-3 px-4 safe-header pb-4 glass sticky top-0 z-10">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ArrowLeft size={22} className="text-foreground" />
        </motion.button>
        <h1 className="text-lg font-semibold text-foreground">{t("notifications")}</h1>
      </div>
      <div className="px-5 pb-10 pt-4 safe-bottom">
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {rows.map((row, i) => (
            <div
              key={row.key}
              className={`flex items-center gap-3 px-4 py-4 ${i < rows.length - 1 ? "border-b border-border" : ""}`}
            >
              <row.icon size={18} className="text-muted-foreground" />
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">{row.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{row.desc}</div>
              </div>
              <Switch
                checked={settings[row.key]}
                onCheckedChange={(val) => update(row.key, val)}
              />
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
