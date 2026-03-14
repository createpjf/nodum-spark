import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

interface ToolUseBlockProps {
  label: string;
  status: "running" | "done";
}

const ToolUseBlock = ({ label, status }: ToolUseBlockProps) => {
  return (
    <div className="flex items-center gap-2 py-1.5 mb-1">
      <MessageCircle size={14} className="text-muted-foreground shrink-0" />
      <span className="text-[13px] text-muted-foreground">{label}</span>
      {status === "running" && (
        <div className="flex items-center gap-1 ml-0.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="w-1 h-1 rounded-full bg-muted-foreground/50"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ToolUseBlock;
