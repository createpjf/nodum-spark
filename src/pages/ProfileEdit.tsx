import { useState } from "react";
import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "@/hooks/useSettings";
import { toast } from "sonner";
import { useT } from "@/i18n/LanguageContext";

export default function ProfileEdit() {
  const navigate = useNavigate();
  const { settings, update } = useSettings();
  const { t } = useT();
  const [displayName, setDisplayName] = useState(settings.displayName || "");
  const [email, setEmail] = useState(settings.email || "");

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSave = () => {
    update("displayName", displayName);
    update("email", email);
    toast(t("profileUpdated"));
    navigate(-1);
  };

  return (
    <PageTransition className="h-screen w-screen max-w-full md:max-w-[600px] mx-auto overflow-y-auto bg-background fixed inset-0">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 safe-header pb-4 glass sticky top-0 z-10">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ArrowLeft size={22} className="text-foreground" />
        </motion.button>
        <h1 className="text-lg font-semibold text-foreground">{t("editProfile")}</h1>
      </div>

      <div className="px-5 pb-10 pt-4 safe-bottom">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-semibold">
            {initials || "?"}
          </div>
          <button
            className="mt-3 text-sm text-primary font-medium"
            onClick={() => toast(t("comingSoon"))}
          >
            {t("changePhoto")}
          </button>
        </div>

        {/* Form fields */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden px-4 py-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">{t("displayName")}</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">{t("email")}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="w-full py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-[15px] mt-6"
        >
          {t("save")}
        </button>
      </div>
    </PageTransition>
  );
}
