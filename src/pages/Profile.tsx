import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import {
  X, Info, User, CreditCard, BarChart3, Zap,
  Palette, Languages, Bell, Shield, Vibrate, LogOut, ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useSettings } from "@/hooks/useSettings";
import { useT } from "@/i18n/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Profile = () => {
  const navigate = useNavigate();
  const [haptic, setHaptic] = useState(true);
  const [infoOpen, setInfoOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { settings } = useSettings();
  const { t } = useT();

  const themeLabel = theme === "dark" ? t("dark") : theme === "light" ? t("light") : t("system");
  const cycleTheme = () => {
    if (theme === "system") setTheme("light");
    else if (theme === "light") setTheme("dark");
    else setTheme("system");
  };

  const sections: { items: { icon?: typeof User; label: string; value: string; onClick?: () => void }[] }[] = [
    {
      items: [
        { icon: User, label: t("profile"), value: "", onClick: () => navigate("/profile/edit") },
        { icon: CreditCard, label: t("billing"), value: t("free"), onClick: () => navigate("/subscription") },
        { icon: BarChart3, label: t("usage"), value: "", onClick: () => navigate("/usage") },
      ],
    },
    {
      items: [
        { icon: Zap, label: t("capabilities"), value: "", onClick: () => navigate("/capabilities") },
      ],
    },
    {
      items: [
        { icon: Palette, label: t("appearance"), value: themeLabel, onClick: cycleTheme },
        { icon: Languages, label: t("language"), value: settings.speechLanguage, onClick: () => navigate("/speech-language") },
        { icon: Bell, label: t("notifications"), value: "", onClick: () => navigate("/notifications") },
        { icon: Shield, label: t("privacy"), value: "", onClick: () => navigate("/privacy") },
      ],
    },
  ];

  return (
    <PageTransition className="h-screen w-screen max-w-full md:max-w-[600px] mx-auto overflow-y-auto bg-background fixed inset-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 safe-header pb-3 glass sticky top-0 z-10">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="p-2 -ml-2">
          <X size={22} className="text-foreground" />
        </motion.button>
        <h1 className="text-lg font-semibold text-foreground">{t("settings")}</h1>
        <button className="p-2 -mr-2" onClick={() => setInfoOpen(true)}>
          <Info size={20} className="text-muted-foreground" />
        </button>
      </div>

      <div className="px-5 pb-10 pt-4 safe-bottom">
        {/* Email field */}
        <div className="mb-5 rounded-xl bg-secondary px-4 py-3">
          <span className="text-sm text-foreground">{settings.email}</span>
        </div>

        {/* Sections */}
        {sections.map((section, si) => (
          <div key={si} className="mb-3 rounded-2xl border border-border bg-card overflow-hidden">
            {section.items.map((item, i) => (
              <button
                key={item.label}
                onClick={item.onClick}
                className={`w-full flex items-center gap-3 px-4 py-4 hover:bg-accent transition-colors ${
                  i < section.items.length - 1 ? "border-b border-border" : ""
                }`}
              >
                {item.icon && <item.icon size={18} className="text-muted-foreground" />}
                <span className="flex-1 text-left text-sm font-medium text-foreground">{item.label}</span>
                {item.value && (
                  <span className="text-sm text-muted-foreground mr-1">{item.value}</span>
                )}
                <ChevronRight size={16} className="text-muted-foreground" />
              </button>
            ))}
          </div>
        ))}

        {/* Haptic feedback */}
        <div className="mb-3 rounded-2xl border border-border bg-card overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-4">
            <Vibrate size={18} className="text-muted-foreground" />
            <span className="flex-1 text-sm font-medium text-foreground">{t("hapticFeedback")}</span>
            <Switch checked={haptic} onCheckedChange={setHaptic} />
          </div>
        </div>

        <Separator className="my-4" />

        {/* Log out */}
        <button
          onClick={() => { toast(t("loggedOut")); navigate("/"); }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-destructive/20 text-destructive text-sm font-medium hover:bg-destructive/5 transition-colors"
        >
          <LogOut size={16} />
          {t("logOut")}
        </button>
      </div>

      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogContent className="max-w-xs rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center">FLock</DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-2 pb-2">
            <p className="text-sm text-muted-foreground">Version 1.0.0</p>
            <p className="text-xs text-muted-foreground">{t("builtWith")}</p>
            <p className="text-xs text-muted-foreground">&copy; 2026 FLock.io</p>
          </div>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
};

export default Profile;
