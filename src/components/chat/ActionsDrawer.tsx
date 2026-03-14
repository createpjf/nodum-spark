import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { File, Image, Camera, Wand2, Layers, Video, Maximize, X } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";

interface ActionsDrawerProps {
  open: boolean;
  onClose: () => void;
  onFileSelect: () => void;
  onImageSelect: () => void;
}

const actions = [
  { icon: File, labelKey: "attachFile", pro: false, key: "file" },
  { icon: Image, labelKey: "attachImage", pro: false, key: "image" },
  { icon: Camera, labelKey: "takePhoto", pro: false, key: "camera" },
  { icon: Wand2, labelKey: "editImage", pro: true, key: "edit" },
  { icon: Layers, labelKey: "combineImages", pro: true, key: "combine" },
  { icon: Video, labelKey: "createVideo", pro: false, key: "video" },
  { icon: Maximize, labelKey: "upscaleEnhance", pro: true, key: "upscale" },
];

const ActionsDrawer = ({ open, onClose, onFileSelect, onImageSelect }: ActionsDrawerProps) => {
  const { t } = useT();
  const [proToast, setProToast] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const handleAction = (key: string, isPro: boolean) => {
    if (isPro) {
      setProToast(true);
      setTimeout(() => setProToast(false), 2500);
      return;
    }
    if (key === "file") {
      onFileSelect();
    } else if (key === "image") {
      onImageSelect();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ willChange: "opacity" }}
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm z-50"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 400 }}
            style={{ willChange: "transform" }}
            className="absolute bottom-0 left-0 right-0 z-50 bg-card rounded-t-[var(--glass-radius)] border-t border-white/18 shadow-[0_-4px_32px_rgba(0,0,0,0.08)]"
            role="dialog"
            aria-modal="true"
            aria-label={t("actions")}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1" aria-hidden="true">
              <div className="w-10 h-1 rounded-full bg-foreground/15" />
            </div>

            <div className="px-5 pb-6">
              <h3 className="text-lg font-bold text-foreground mb-3">{t("actions")}</h3>

              {actions.map((action) => (
                <motion.button
                  key={action.key}
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ x: 2 }}
                  onClick={() => handleAction(action.key, action.pro)}
                  className={`w-full flex items-center gap-4 px-2 py-3.5 rounded-xl transition-colors ${
                    action.pro ? "opacity-50" : "hover:bg-accent"
                  }`}
                  aria-label={`${t(action.labelKey as any)}${action.pro ? ` (${t("proFeature")})` : ""}`}
                >
                  <action.icon size={20} className="text-foreground shrink-0" aria-hidden="true" />
                  <span className="text-sm font-medium text-foreground">{t(action.labelKey as any)}</span>
                  {action.pro && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold ml-1">
                      PRO
                    </span>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Pro upgrade toast */}
            <AnimatePresence>
              {proToast && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute bottom-full left-4 right-4 mb-3 bg-foreground text-background rounded-xl px-4 py-3 flex items-start justify-between gap-3 shadow-lg"
                  role="status"
                  aria-live="polite"
                >
                  <div>
                    <p className="text-sm font-semibold">{t("proFeature")}</p>
                    <p className="text-xs opacity-70 mt-0.5">{t("proFeatureDesc")}</p>
                  </div>
                  <button
                    onClick={() => setProToast(false)}
                    className="shrink-0 opacity-60 hover:opacity-100 transition-opacity mt-0.5"
                    aria-label={t("dismiss")}
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ActionsDrawer;
