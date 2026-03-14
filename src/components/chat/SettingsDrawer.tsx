import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Upload, X, FileText, Check, Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useT } from "@/i18n/LanguageContext";

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  webEnabled: boolean;
  onWebToggle: (v: boolean) => void;
}

const SettingsDrawer = ({ open, onClose, webEnabled, onWebToggle }: SettingsDrawerProps) => {
  const { t } = useT();

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const [savedInstructions, setSavedInstructions] = useState("");
  const [draft, setDraft] = useState("");
  const [files, setFiles] = useState<{ name: string; content: string }[]>([]);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasContent = draft || files.length > 0;
  const isDirty = draft !== savedInstructions || files.length > 0;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;
    Array.from(selected).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result;
        if (typeof text === "string") {
          setFiles((prev) => {
            if (prev.some((f) => f.name === file.name)) return prev;
            return [...prev, { name: file.name, content: text }];
          });
        }
      };
      reader.readAsText(file);
    });
    e.target.value = "";
    setEditing(true);
  };

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const handleSave = () => {
    setSavedInstructions(draft);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleClear = () => {
    setDraft("");
    setFiles([]);
    setSavedInstructions("");
    setEditing(false);
  };

  const startEditing = () => {
    setDraft(savedInstructions);
    setEditing(true);
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
            aria-label={t("settings")}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1" aria-hidden="true">
              <div className="w-10 h-1 rounded-full bg-foreground/15" />
            </div>

            <div className="px-5 pb-6">
              <h3 className="text-lg font-bold text-foreground mb-4">{t("settings")}</h3>

              {/* Web Search */}
              <div className="rounded-xl border border-border bg-secondary p-4 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="web-search-toggle" className="font-semibold text-sm text-foreground cursor-pointer">
                      {t("webSearch")}
                    </Label>
                    <Info size={14} className="text-muted-foreground" aria-hidden="true" />
                  </div>
                  <Switch
                    id="web-search-toggle"
                    checked={webEnabled}
                    onCheckedChange={onWebToggle}
                    aria-label={t("enableWebSearch")}
                  />
                </div>
                <AnimatePresence>
                  {webEnabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs text-muted-foreground mt-2">
                        {t("webSearchDesc")}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Instructions */}
              <button
                type="button"
                onClick={startEditing}
                className="w-full rounded-xl border border-border bg-secondary p-4 mb-3 text-left hover:bg-accent transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-sm text-foreground block">{t("instructions")}</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {savedInstructions
                        ? savedInstructions.split("\n")[0].slice(0, 50) + (savedInstructions.length > 50 ? "..." : "")
                        : t("instructionsPlaceholder")}
                    </p>
                  </div>
                  <Plus size={18} className="text-muted-foreground shrink-0" />
                </div>
              </button>

              {/* Instructions Editor */}
              <AnimatePresence>
                {editing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-xl border border-border bg-secondary p-4 mb-3 space-y-2">
                      <textarea
                        autoFocus
                        rows={5}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder={t("instructionsInput")}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary/40"
                      />

                      {/* Uploaded files */}
                      {files.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {files.map((f) => (
                            <span
                              key={f.name}
                              className="inline-flex items-center gap-1 text-[11px] bg-background border border-border rounded-md px-2 py-1 text-foreground/70"
                            >
                              <FileText size={11} className="shrink-0" />
                              <span className="truncate max-w-[120px]">{f.name}</span>
                              <button
                                type="button"
                                onClick={() => removeFile(f.name)}
                                className="text-muted-foreground hover:text-destructive ml-0.5"
                              >
                                <X size={10} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-accent"
                          >
                            <Upload size={12} />
                            {t("uploadMd")}
                          </button>
                          {(draft || files.length > 0) && (
                            <button
                              type="button"
                              onClick={handleClear}
                              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors px-2 py-1 rounded-md hover:bg-accent"
                            >
                              <X size={12} />
                              {t("clear")}
                            </button>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={handleSave}
                          disabled={!draft && files.length === 0}
                          className="text-xs font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-1 rounded-lg transition-colors"
                        >
                          {t("save")}
                        </button>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".md,.txt"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsDrawer;
