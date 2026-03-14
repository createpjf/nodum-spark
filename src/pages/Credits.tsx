import { useState } from "react";
import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { ArrowLeft, Coins, Check, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSettings } from "@/hooks/useSettings";
import { useT } from "@/i18n/LanguageContext";

const packages = [
  { id: "100", amount: 100, price: "$5" },
  { id: "500", amount: 500, price: "$20", popular: true },
  { id: "1000", amount: 1000, price: "$35", best: true },
  { id: "5000", amount: 5000, price: "$150" },
];

export default function Credits() {
  const navigate = useNavigate();
  const { settings, update } = useSettings();
  const { t } = useT();
  const [selected, setSelected] = useState("500");
  const [purchasing, setPurchasing] = useState(false);

  const handlePurchase = async () => {
    if (purchasing) return;
    const pkg = packages.find((p) => p.id === selected);
    if (!pkg) return;
    setPurchasing(true);
    // Simulate purchase delay
    await new Promise((r) => setTimeout(r, 800));
    update("creditBalance", settings.creditBalance + pkg.amount);
    toast(t("purchaseSuccess"));
    setPurchasing(false);
    navigate(-1);
  };

  return (
    <PageTransition className="h-screen w-screen max-w-full md:max-w-[600px] mx-auto overflow-y-auto bg-background fixed inset-0">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 safe-header pb-4 glass sticky top-0 z-10">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ArrowLeft size={22} className="text-foreground" />
        </motion.button>
        <h1 className="text-lg font-semibold text-foreground">{t("buyCredits")}</h1>
      </div>

      <div className="px-6 pb-10 pt-4 safe-bottom">
        {/* Balance card */}
        <div className="rounded-2xl border border-border bg-card px-5 py-6 mb-6 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Coins size={24} className="text-primary" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">{t("creditBalance")}</p>
          <p className="text-3xl font-bold text-foreground">{settings.creditBalance.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">{t("credits")}</p>
        </div>

        {/* Packages */}
        <div className="space-y-2 mb-6">
          {packages.map((pkg) => (
            <motion.button
              key={pkg.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelected(pkg.id)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl border transition-colors ${
                selected === pkg.id
                  ? "border-primary bg-accent"
                  : "border-border bg-card hover:bg-accent/50"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <Zap size={18} className="text-primary" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {pkg.amount.toLocaleString()} {t("credits")}
                  </span>
                  {pkg.popular && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                      {t("mostPopular")}
                    </span>
                  )}
                  {pkg.best && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold">
                      {t("bestValue")}
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{pkg.price} USD</span>
              </div>
              {selected === pkg.id && <Check size={18} className="text-primary shrink-0" />}
            </motion.button>
          ))}
        </div>

        {/* Purchase button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handlePurchase}
          disabled={purchasing}
          className="w-full py-3.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-[15px] shadow-lg transition-colors disabled:opacity-60"
        >
          {purchasing ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              {t("buyCredits")}
            </span>
          ) : (
            <>{t("buyCredits")} — {packages.find((p) => p.id === selected)?.price}</>
          )}
        </motion.button>

        {/* Description */}
        <p className="text-xs text-muted-foreground text-center mt-5 leading-relaxed px-4">
          {t("creditDesc")}
        </p>
      </div>
    </PageTransition>
  );
}
