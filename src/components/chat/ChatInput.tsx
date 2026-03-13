import { useState } from "react";
import { Send, Paperclip, Mic } from "lucide-react";
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
      <div className="glass-subtle rounded-2xl flex items-end gap-2 p-2">
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors shrink-0">
          <Paperclip size={18} />
        </button>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Message Nodum..."
          rows={1}
          className="flex-1 bg-transparent resize-none text-[14px] text-foreground placeholder:text-muted-foreground outline-none py-2 px-1 max-h-32 scrollbar-none"
        />
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors shrink-0">
          <Mic size={18} />
        </button>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className="p-2 rounded-xl bg-foreground/10 hover:bg-foreground/15 text-foreground transition-colors shrink-0 disabled:opacity-30"
        >
          <Send size={16} />
        </motion.button>
      </div>
    </div>
  );
};

export default ChatInput;
