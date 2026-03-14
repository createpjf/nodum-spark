import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Search, Lock, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useT } from "@/i18n/LanguageContext";

interface Model {
  id: string;
  name: string;
  desc?: string;
  icon: string;
  tags: string[];
  pro?: boolean;
}

const textModels: Model[] = [
  { id: "auto", name: "Auto", desc: "Selects the best model based on prompt", icon: "⚡", tags: [] },
  { id: "gemini-3-flash", name: "Gemini 3 Flash", icon: "/model-icons/gemini.svg", tags: ["Fast", "Vision"], pro: false },
  { id: "gemini-3.1-pro", name: "Gemini 3.1 Pro", icon: "/model-icons/gemini.svg", tags: ["Reasoning", "Vision"], pro: false },
  { id: "qwen3.5-max", name: "Qwen3.5 Max", icon: "/model-icons/qwen.svg", tags: ["Reasoning", "Long Context"], pro: false },
  { id: "glm-5", name: "GLM-5", icon: "/model-icons/zhipu.svg", tags: ["Reasoning", "Vision"], pro: false },
  { id: "kimi-k2.5", name: "Kimi-K2.5", icon: "/model-icons/kimi.svg", tags: ["Reasoning", "Fast"], pro: false },
  { id: "minimax-m2.5", name: "MiniMax-M2.5", icon: "/model-icons/minimax.svg", tags: ["Reasoning"], pro: false },
  { id: "kimi-k2-thinking", name: "Kimi-K2-thinking", icon: "/model-icons/kimi.svg", tags: ["Reasoning", "Thinking"], pro: true },
  { id: "deepseek-v3.2", name: "DeepSeek-V3.2", icon: "/model-icons/deepseek.svg", tags: ["Reasoning", "Math"], pro: true },
];

const imageModels: Model[] = [
  { id: "nano-banana-pro", name: "Nano Banana Pro", icon: "🍌", tags: ["High Quality"], pro: false },
  { id: "nano-banana-2", name: "Nano Banana 2", icon: "🍌", tags: ["Fast"], pro: false },
  { id: "seedream-4.5", name: "Seedream 4.5", icon: "/model-icons/seedream.svg", tags: ["Creative", "Photorealistic"], pro: false },
];

const videoModels: Model[] = [
  { id: "veo-3.1", name: "Veo 3.1", icon: "/model-icons/veo.svg", tags: ["HD Video"], pro: true },
  { id: "kling-3", name: "Kling 3", icon: "/model-icons/kling.svg", tags: ["Fast", "HD Video"], pro: true },
  { id: "seedance-2.0", name: "Seedance 2.0", icon: "/model-icons/seedream.svg", tags: ["Creative"], pro: true },
  { id: "seedance-1.5-pro", name: "Seedance 1.5 Pro", icon: "/model-icons/seedream.svg", tags: ["Fast"], pro: true },
];

const tabs = ["Text", "Image", "Video"] as const;
type Tab = typeof tabs[number];

interface ModelSelectorDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedModel: string;
  onSelectModel: (id: string, name: string) => void;
}

const tabLabelKeys: Record<Tab, string> = { Text: "text", Image: "image", Video: "video" };

const ModelSelectorDrawer = ({ open, onClose, selectedModel, onSelectModel }: ModelSelectorDrawerProps) => {
  const { t } = useT();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("Text");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const models = tab === "Text" ? textModels : tab === "Image" ? imageModels : videoModels;
  const filtered = search ? models.filter((m) => m.name.toLowerCase().includes(search.toLowerCase())) : models;

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
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 400 }}
            style={{ willChange: "transform" }}
            className="absolute bottom-0 left-0 right-0 z-50 bg-card rounded-t-[var(--glass-radius)] h-[75%] flex flex-col border-t border-white/18 shadow-[0_-4px_32px_rgba(0,0,0,0.08)]"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-foreground/15" />
            </div>

            {/* Header */}
            <div className="px-5 pb-3">
              <h3 className="text-lg font-bold text-foreground">{t("models")}</h3>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 px-5 pb-3">
              <button className="p-2 text-muted-foreground">
                <Star size={16} />
              </button>
              {tabs.map((tabItem) => (
                <button
                  key={tabItem}
                  onClick={() => setTab(tabItem)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    tab === tabItem ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {t(tabLabelKeys[tabItem] as any)}
                </button>
              ))}
              <button
                onClick={() => setSearch(search ? "" : " ")}
                className="ml-auto p-2 text-muted-foreground"
              >
                <Search size={16} />
              </button>
            </div>

            {search !== "" && (
              <div className="px-5 pb-3">
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("searchModels")}
                  className="w-full px-3 py-2 rounded-lg bg-accent text-foreground text-sm placeholder:text-muted-foreground outline-none border border-border"
                />
              </div>
            )}

            {/* Model list */}
            <div className="flex-1 overflow-y-auto scrollbar-none px-5 pb-6">
              <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
              {filtered.map((model) => (
                <motion.button
                  key={model.id}
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ x: 2 }}
                  onClick={() => {
                    if (!model.pro) {
                      onSelectModel(model.id, model.name);
                      onClose();
                    } else {
                      toast(t("proModelHint"));
                      onClose();
                      navigate("/subscription");
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 h-[68px] rounded-xl mb-1 transition-colors ${
                    selectedModel === model.id
                      ? "border-2 border-primary bg-accent"
                      : "border border-transparent hover:bg-accent"
                  } ${model.pro ? "opacity-70" : ""}`}
                >
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-sm font-bold text-foreground shrink-0 overflow-hidden">
                    {model.icon.startsWith("/") ? (
                      <img src={model.icon} alt={model.name} className="w-6 h-6 object-contain" />
                    ) : (
                      model.icon
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground truncate">{model.name}</span>
                      {model.pro && <Lock size={12} className="text-muted-foreground shrink-0" />}
                    </div>
                    <div className="flex gap-1.5 mt-1 items-center min-h-[18px]">
                      {model.desc && model.tags.length === 0 && (
                        <p className="text-xs text-muted-foreground truncate">{model.desc}</p>
                      )}
                      {model.tags.map((tag) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium">
                          {tag}
                        </span>
                      ))}
                      {model.pro && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                          PRO
                        </span>
                      )}
                    </div>
                  </div>
                  {selectedModel === model.id && (
                    <Check size={18} className="text-primary shrink-0" />
                  )}
                </motion.button>
              ))}
              </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ModelSelectorDrawer;
