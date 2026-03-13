import { motion, AnimatePresence } from "framer-motion";
import { Info, ChevronDown } from "lucide-react";

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  webEnabled: boolean;
  onWebToggle: (v: boolean) => void;
}

const SettingsDrawer = ({ open, onClose, webEnabled, onWebToggle }: SettingsDrawerProps) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 glass-overlay z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 z-50 glass-strong rounded-t-3xl"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            <div className="px-5 pb-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Settings</h3>

              {/* Web Search */}
              <div className="rounded-2xl glass-subtle p-4 mb-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground">Web Enabled</span>
                    <Info size={14} className="text-muted-foreground" />
                  </div>
                  <button
                    onClick={() => onWebToggle(!webEnabled)}
                    className={`relative w-12 h-7 rounded-full transition-colors ${
                      webEnabled ? "bg-primary/80" : "bg-[rgba(0,0,0,0.1)]"
                    }`}
                  >
                    <motion.div
                      animate={{ x: webEnabled ? 20 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>

                {webEnabled && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-medium">Search Provider</p>
                    <label className="flex items-center gap-3 text-sm text-foreground">
                      <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      </div>
                      Google (best results)
                    </label>
                    <label className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-5 h-5 rounded-full border-2 border-[rgba(0,0,0,0.15)]" />
                      Bing
                    </label>
                  </div>
                )}
              </div>

              {/* System Prompts */}
              <div className="rounded-2xl glass-subtle p-4 mb-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-foreground">System Prompts</span>
                  <button className="text-xs font-medium text-primary">+ Add</button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Control the AI's behavior with custom system prompts.
                </p>
              </div>

              {/* Advanced Settings */}
              <button className="w-full rounded-2xl glass-subtle p-4 flex items-center justify-between">
                <span className="font-semibold text-sm text-foreground">Advanced Settings</span>
                <ChevronDown size={16} className="text-muted-foreground" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsDrawer;
