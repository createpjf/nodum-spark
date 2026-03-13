import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

const ChatBubble = ({ role, content, timestamp }: ChatBubbleProps) => {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div className={`max-w-[85%] flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-1 px-1">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles size={11} className="text-primary" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">Nodum</span>
          </div>
        )}
        <div
          className={`rounded-2xl px-4 py-3 text-[14px] leading-relaxed ${
            isUser
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-secondary text-foreground rounded-bl-md"
          }`}
        >
          <p>{content}</p>
        </div>
        {timestamp && (
          <span className="text-[10px] text-muted-foreground font-mono px-2">{timestamp}</span>
        )}
      </div>
    </motion.div>
  );
};

export default ChatBubble;
