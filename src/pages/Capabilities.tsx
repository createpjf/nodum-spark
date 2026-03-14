import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { ArrowLeft, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useT } from "@/i18n/LanguageContext";

interface Model {
  name: string;
  icon: string;
  tags: string[];
  pro?: boolean;
}

const textModels: Model[] = [
  { name: "Auto", icon: "⚡", tags: [] },
  { name: "Gemini 3 Flash", icon: "/model-icons/gemini.svg", tags: ["Fast", "Vision"] },
  { name: "Gemini 3.1 Pro", icon: "/model-icons/gemini.svg", tags: ["Reasoning", "Vision"] },
  { name: "Qwen3.5 Max", icon: "/model-icons/qwen.svg", tags: ["Reasoning", "Long Context"] },
  { name: "GLM-5", icon: "/model-icons/zhipu.svg", tags: ["Reasoning", "Vision"] },
  { name: "Kimi-K2.5", icon: "/model-icons/kimi.svg", tags: ["Reasoning", "Fast"] },
  { name: "MiniMax-M2.5", icon: "/model-icons/minimax.svg", tags: ["Reasoning"] },
  { name: "Kimi-K2-thinking", icon: "/model-icons/kimi.svg", tags: ["Reasoning", "Thinking"], pro: true },
  { name: "DeepSeek-V3.2", icon: "/model-icons/deepseek.svg", tags: ["Reasoning", "Math"], pro: true },
];

const imageModels: Model[] = [
  { name: "Nano Banana Pro", icon: "🍌", tags: ["High Quality"] },
  { name: "Nano Banana 2", icon: "🍌", tags: ["Fast"] },
  { name: "Seedream 4.5", icon: "/model-icons/seedream.svg", tags: ["Creative", "Photorealistic"] },
];

const videoModels: Model[] = [
  { name: "Veo 3.1", icon: "/model-icons/veo.svg", tags: ["HD Video"], pro: true },
  { name: "Kling 3", icon: "/model-icons/kling.svg", tags: ["Fast", "HD Video"], pro: true },
  { name: "Seedance 2.0", icon: "/model-icons/seedream.svg", tags: ["Creative"], pro: true },
  { name: "Seedance 1.5 Pro", icon: "/model-icons/seedream.svg", tags: ["Fast"], pro: true },
];

interface ModelSectionProps {
  title: string;
  models: Model[];
}

function ModelSection({ title, models }: ModelSectionProps) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
        {title}
      </div>
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {models.map((model, i) => (
          <div
            key={model.name}
            className={`flex items-center gap-3 px-4 py-3${i < models.length - 1 ? " border-b border-border" : ""}`}
          >
            <span className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-sm overflow-hidden">
              {model.icon.startsWith("/") ? (
                <img src={model.icon} alt={model.name} className="w-5 h-5 object-contain" />
              ) : (
                model.icon
              )}
            </span>
            <span className="text-sm font-medium text-foreground flex-1">{model.name}</span>
            <div className="flex gap-1.5 items-center">
              {model.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground"
                >
                  {tag}
                </span>
              ))}
              {model.pro && <Lock size={14} className="text-muted-foreground" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Capabilities() {
  const navigate = useNavigate();
  const { t } = useT();

  return (
    <PageTransition className="h-screen w-screen max-w-full md:max-w-[600px] mx-auto overflow-y-auto bg-background fixed inset-0">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 safe-header pb-4 glass sticky top-0 z-10">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ArrowLeft size={22} className="text-foreground" />
        </motion.button>
        <h1 className="text-lg font-semibold text-foreground">{t("capabilities")}</h1>
      </div>

      <div className="px-5 pb-10 pt-4 safe-bottom">
        <div className="space-y-5">
          <ModelSection title={t("textModels")} models={textModels} />
          <ModelSection title={t("imageModels")} models={imageModels} />
          <ModelSection title={t("videoModels")} models={videoModels} />
        </div>
      </div>
    </PageTransition>
  );
}
