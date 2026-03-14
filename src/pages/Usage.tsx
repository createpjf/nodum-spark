import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { ArrowLeft, Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "@/hooks/useSettings";
import { useT } from "@/i18n/LanguageContext";

interface StatCardProps {
  label: string;
  value: string;
  percent: number;
}

function barColor(percent: number) {
  if (percent >= 75) return "bg-destructive";
  if (percent >= 50) return "bg-[hsl(40,60%,55%)]";
  return "bg-primary";
}

function StatCard({ label, value, percent }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden px-4 py-4">
      <div className="text-sm font-medium text-foreground">{label}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{value}</div>
      <div className="mt-3 h-2 rounded-full bg-secondary overflow-hidden">
        <div className={`h-full rounded-full ${barColor(percent)}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export default function Usage() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { t } = useT();

  return (
    <PageTransition className="h-screen w-screen max-w-full md:max-w-[600px] mx-auto overflow-y-auto bg-background fixed inset-0">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 safe-header pb-4 glass sticky top-0 z-10">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ArrowLeft size={22} className="text-foreground" />
        </motion.button>
        <h1 className="text-lg font-semibold text-foreground">{t("usage")}</h1>
      </div>

      <div className="px-5 pb-10 pt-4 safe-bottom">
        {/* Stat cards */}
        <div className="space-y-3">
          <StatCard label={t("messagesSent")} value="1,247 / 5,000" percent={25} />
          <StatCard label={t("imagesGenerated")} value="89 / 200" percent={44.5} />
          <StatCard label={t("creditsUsed")} value={`${settings.creditBalance.toLocaleString()} ${t("creditsRemaining")}`} percent={Math.min(100, (settings.creditBalance / 1000) * 100)} />
        </div>

        {/* Credit balance card */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden px-4 py-4 mt-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">{t("creditBalance")}</span>
            </div>
            <span className="text-primary font-semibold">{settings.creditBalance.toLocaleString()}</span>
          </div>
          <button
            onClick={() => navigate("/credits")}
            className="text-sm text-primary font-medium mt-3"
          >
            {t("buyCredits")}
          </button>
        </div>

        {/* Current Plan */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden px-4 py-4 mt-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">{t("currentPlan")}</span>
            <span className="text-primary font-semibold">{t("free")}</span>
          </div>
          <button
            onClick={() => navigate("/subscription")}
            className="text-sm text-primary font-medium mt-3"
          >
            {t("upgradeToPro")}
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
