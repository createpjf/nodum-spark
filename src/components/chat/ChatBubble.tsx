import { motion } from "framer-motion";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

const ChatBubble = ({ role, content, timestamp }: ChatBubbleProps) => {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div className={`max-w-[85%] flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-1 px-1">
            <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-foreground">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-xs text-muted-foreground font-medium">Nodum</span>
          </div>
        )}
        <div
          className={`rounded-2xl px-4 py-3 text-[14px] leading-relaxed ${
            isUser
              ? "bg-[hsl(var(--chat-user-bg))] glass-subtle rounded-br-md"
              : "bg-[hsl(var(--chat-ai-bg))] rounded-bl-md"
          }`}
        >
          <p className={isUser ? "text-foreground" : "text-foreground/90"}>{content}</p>
        </div>
        {timestamp && (
          <span className="text-[10px] text-muted-foreground font-mono px-2">{timestamp}</span>
        )}
      </div>
    </motion.div>
  );
};

export default ChatBubble;
