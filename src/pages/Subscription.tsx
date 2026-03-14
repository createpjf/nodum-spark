import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useT } from "@/i18n/LanguageContext";

const Subscription = () => {
  const [plan, setPlan] = useState<"monthly" | "yearly">("monthly");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [legalDialog, setLegalDialog] = useState<"privacy" | "terms" | null>(null);
  const navigate = useNavigate();
  const { t } = useT();

  const features = [
    t("featurePrivate"),
    t("featureUnlimitedText"),
    t("featureImageRequests"),
    t("featureEditImages"),
    t("featureCombineImages"),
    t("featureUpscale"),
    t("featureCharacters"),
    t("featureBackup"),
    t("featureModels"),
    t("featureCredits"),
    t("featureApi"),
    t("featurePriority"),
  ];

  return (
    <PageTransition className="h-screen w-screen max-w-full md:max-w-[600px] mx-auto overflow-y-auto bg-background fixed inset-0">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 safe-header pb-4 glass sticky top-0 z-10">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ArrowLeft size={22} className="text-foreground" />
        </motion.button>
        <h1 className="text-lg font-semibold text-foreground">{t("upgradeTitle")}</h1>
      </div>

      <div className="px-6 pb-10 pt-4 safe-bottom">
        {/* Toggle */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex rounded-full bg-secondary p-1 relative">
            <button
              onClick={() => setPlan("monthly")}
              className={`relative z-10 px-5 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                plan === "monthly" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {t("monthly")}
            </button>
            <button
              onClick={() => setPlan("yearly")}
              className={`relative z-10 px-5 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                plan === "yearly" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {t("yearly")}
            </button>
            <motion.div
              className="absolute top-1 bottom-1 rounded-full bg-card shadow-sm"
              animate={{ left: plan === "monthly" ? "4px" : "calc(50% - 0px)" }}
              style={{ width: "calc(50% - 4px)" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          </div>
        </div>

        {/* Price */}
        <AnimatePresence mode="wait">
          <motion.div
            key={plan}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-foreground text-center mb-0.5">
              {plan === "monthly" ? t("priceMonthly") : t("priceYearly")} USD / {t(plan === "monthly" ? "perMonth" : "perYear")}
            </h2>
            <p className="text-xs text-muted-foreground text-center mb-6">
              {plan === "yearly" && t("savePercent")}{t("pricesInUsd")}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Features */}
        <div className="space-y-2.5 mb-6">
          {features.map((f) => (
            <div key={f} className="flex items-start gap-2.5">
              <Check size={15} className="text-primary shrink-0 mt-0.5" />
              <span className="text-[13px] text-foreground leading-snug">{f}</span>
            </div>
          ))}
        </div>

        {/* Subscribe button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setConfirmOpen(true)}
          className="w-full py-3.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-[15px] shadow-lg transition-colors"
        >
          {t("subscribe")}
        </motion.button>

        {/* Legal links */}
        <div className="flex justify-center gap-6 mt-5">
          <button onClick={() => setLegalDialog("privacy")} className="text-[11px] text-muted-foreground hover:text-foreground py-2">{t("privacyPolicy")}</button>
          <button onClick={() => setLegalDialog("terms")} className="text-[11px] text-muted-foreground hover:text-foreground py-2">{t("termsOfService")}</button>
        </div>
      </div>

      {/* Subscribe confirmation */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="max-w-xs rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmSubscription")}</AlertDialogTitle>
            <AlertDialogDescription>
              {plan === "monthly" ? t("confirmSubscribeMonthly") : t("confirmSubscribeYearly")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={subscribing}>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              disabled={subscribing}
              onClick={async (e) => {
                e.preventDefault();
                setSubscribing(true);
                await new Promise((r) => setTimeout(r, 800));
                setSubscribing(false);
                setConfirmOpen(false);
                toast(t("subscribedSuccess"));
                navigate(-1);
              }}
            >
              {subscribing ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                  {t("confirm")}
                </span>
              ) : (
                t("confirm")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Legal dialogs */}
      <Dialog open={legalDialog !== null} onOpenChange={(open) => !open && setLegalDialog(null)}>
        <DialogContent className="max-w-md rounded-2xl max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{legalDialog === "privacy" ? t("privacyPolicy") : t("termsOfService")}</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
            {legalDialog === "privacy" ? (
              <>
                <p>{t("legalLastUpdated")}</p>
                <p>{t("legalPrivacyIntro")}</p>
                <p><strong>{t("legalInfoCollection")}</strong><br />{t("legalInfoCollectionDesc")}</p>
                <p><strong>{t("legalUseOfData")}</strong><br />{t("legalUseOfDataDesc")}</p>
                <p><strong>{t("legalDataSecurity")}</strong><br />{t("legalDataSecurityDesc")}</p>
                <p><strong>{t("legalContactUs")}</strong><br />{t("legalPrivacyContact")}</p>
              </>
            ) : (
              <>
                <p>{t("legalLastUpdated")}</p>
                <p>{t("legalTermsIntro")}</p>
                <p><strong>{t("legalAccounts")}</strong><br />{t("legalAccountsDesc")}</p>
                <p><strong>{t("legalSubscriptions")}</strong><br />{t("legalSubscriptionsDesc")}</p>
                <p><strong>{t("legalContent")}</strong><br />{t("legalContentDesc")}</p>
                <p><strong>{t("legalTermination")}</strong><br />{t("legalTerminationDesc")}</p>
                <p><strong>{t("legalContactUs")}</strong><br />{t("legalTermsContact")}</p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
};

export default Subscription;
