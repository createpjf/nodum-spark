import { useState } from "react";
import { Send, Mic } from "lucide-react";
import { motion } from "framer-motion";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
  };

  return (
    <div className="px-4 pb-8 pt-2">
      <div className="rounded-full border border-border bg-card flex items-center gap-1 px-4 py-1 shadow-sm">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Chat with Nodum..."
          rows={1}
          className="flex-1 bg-transparent resize-none text-[14px] text-foreground placeholder:text-muted-foreground outline-none py-2.5 max-h-32 scrollbar-none"
        />
        {value.trim() ? (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={disabled}
            className="p-2 rounded-full bg-primary text-primary-foreground disabled:opacity-40"
          >
            <Send size={16} />
          </motion.button>
        ) : (
          <button className="p-2 text-muted-foreground">
            <Mic size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
