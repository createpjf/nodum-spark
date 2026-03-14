import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface ThinkingBlockProps {
  content: string;
  isStreaming?: boolean;
}

const ThinkingBlock = ({ content, isStreaming }: ThinkingBlockProps) => {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!isStreaming && content) {
      setCollapsed(true);
    }
  }, [isStreaming]);

  const summary = content.split("\n")[0].slice(0, 60) + (content.length > 60 ? "..." : "");

  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-1.5 text-[12px] text-primary/70 hover:text-primary transition-colors group max-w-full"
      >
        <motion.div
          animate={{ rotate: collapsed ? 0 : 90 }}
          transition={{ duration: 0.15 }}
        >
          <ChevronRight size={12} />
        </motion.div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
          <circle cx="12" cy="12" r="3" fill="currentColor" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line
              key={angle}
              x1="12"
              y1="3"
              x2="12"
              y2="1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              transform={`rotate(${angle} 12 12)`}
            />
          ))}
        </svg>
        <span className="select-none truncate min-w-0">
          {collapsed ? summary : "Thinking..."}
        </span>
        {isStreaming && !collapsed && (
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="inline-block w-1.5 h-1.5 rounded-full bg-primary/50"
          />
        )}
      </button>
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-[12px] text-muted-foreground/70 leading-relaxed mt-1 ml-[30px] whitespace-pre-wrap">
              {content}
              {isStreaming && (
                <span className="inline-block w-[2px] h-[12px] bg-primary/40 ml-0.5 align-middle animate-pulse" />
              )}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThinkingBlock;
