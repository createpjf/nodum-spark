import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ChevronDown } from "lucide-react";

interface ToolResultBlockProps {
  title: string;
  count: number;
  items: { id: string; label: string }[];
}

const ToolResultBlock = ({ title, count, items }: ToolResultBlockProps) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="my-2"
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-left group"
      >
        <div className="flex items-center gap-2">
          <MessageCircle size={14} className="text-muted-foreground" />
          <span className="text-[13px] text-muted-foreground font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground/60">{count} results</span>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.15 }}
          >
            <ChevronDown size={12} className="text-muted-foreground/40" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-1.5 rounded-xl border border-border/40 overflow-hidden">
              {items.map((item, i) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-2.5 px-3 py-2.5 hover:bg-accent/50 transition-colors cursor-pointer ${
                    i < items.length - 1 ? "border-b border-border/20" : ""
                  }`}
                >
                  <MessageCircle size={13} className="text-muted-foreground/50 shrink-0" />
                  <span className="text-[13px] text-foreground/80 truncate">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ToolResultBlock;
