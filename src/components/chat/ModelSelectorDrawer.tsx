import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Search, Lock, Check, X } from "lucide-react";

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
  { id: "gemini-3-pro", name: "Gemini 3 Pro", icon: "G", tags: ["Reasoning", "Vision"], pro: false },
  { id: "gemini-3-flash", name: "Gemini 3 Flash", icon: "G", tags: ["Fast", "Vision"], pro: false },
  { id: "gpt-5", name: "GPT-5", icon: "◆", tags: ["Reasoning", "Vision"], pro: true },
  { id: "claude-4", name: "Claude 4 Opus", icon: "◉", tags: ["Reasoning", "Long Context"], pro: true },
  { id: "llama-4", name: "Llama 4 Maverick", icon: "🦙", tags: ["Open Source"], pro: false },
  { id: "deepseek-r1", name: "DeepSeek R1", icon: "🔍", tags: ["Reasoning", "Math"], pro: true },
];

const imageModels: Model[] = [
  { id: "flux-1", name: "FLUX.1 Pro", icon: "🎨", tags: ["High Quality"], pro: false },
  { id: "dall-e-4", name: "DALL·E 4", icon: "◆", tags: ["Creative"], pro: true },
  { id: "imagen-3", name: "Imagen 3", icon: "G", tags: ["Photorealistic"], pro: false },
  { id: "midjourney", name: "Midjourney v7", icon: "💎", tags: ["Artistic"], pro: true },
];

const videoModels: Model[] = [
  { id: "veo-2", name: "Veo 2", icon: "G", tags: ["HD Video"], pro: true },
  { id: "sora-2", name: "Sora 2", icon: "◆", tags: ["Creative"], pro: true },
  { id: "kling", name: "Kling 2.0", icon: "🎬", tags: ["Fast"], pro: false },
];

const tabs = ["Text", "Image", "Video"] as const;
type Tab = typeof tabs[number];

interface ModelSelectorDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedModel: string;
  onSelectModel: (id: string, name: string) => void;
}

const ModelSelectorDrawer = ({ open, onClose, selectedModel, onSelectModel }: ModelSelectorDrawerProps) => {
  const [tab, setTab] = useState<Tab>("Text");
  const [search, setSearch] = useState("");

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
            className="absolute inset-0 glass-overlay z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 z-50 glass-strong rounded-t-3xl max-h-[75%] flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Header */}
            <div className="px-5 pb-3">
              <h3 className="text-lg font-bold text-foreground">Models</h3>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 px-5 pb-3">
              <button className="p-2 text-muted-foreground">
                <Star size={16} />
              </button>
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    tab === t ? "bg-primary/80 backdrop-blur-xl text-primary-foreground border border-[rgba(255,255,255,0.3)]" : "text-muted-foreground hover:bg-[rgba(255,255,255,0.4)]"
                  }`}
                >
                  {t}
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
                  placeholder="Search models..."
                  className="w-full px-3 py-2 rounded-xl glass-subtle text-foreground text-sm placeholder:text-muted-foreground outline-none"
                />
              </div>
            )}

            {/* Model list */}
            <div className="flex-1 overflow-y-auto scrollbar-none px-5 pb-6">
              {filtered.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    if (!model.pro) {
                      onSelectModel(model.id, model.name);
                      onClose();
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl mb-1 transition-all ${
                    selectedModel === model.id
                      ? "glass border-primary/30 shadow-md"
                      : "border border-transparent hover:bg-[rgba(255,255,255,0.35)]"
                  } ${model.pro ? "opacity-70" : ""}`}
                >
                  <div className="w-9 h-9 rounded-xl glass-subtle flex items-center justify-center text-sm font-bold text-foreground shrink-0">
                    {model.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">{model.name}</span>
                      {model.pro && <Lock size={12} className="text-muted-foreground" />}
                    </div>
                    {model.desc && <p className="text-xs text-muted-foreground">{model.desc}</p>}
                    {model.tags.length > 0 && (
                      <div className="flex gap-1.5 mt-1">
                        {model.tags.map((tag) => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full glass-subtle text-muted-foreground font-medium">
                            {tag}
                          </span>
                        ))}
                        {model.pro && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                            PRO
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  {selectedModel === model.id && (
                    <Check size={18} className="text-primary shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ModelSelectorDrawer;
