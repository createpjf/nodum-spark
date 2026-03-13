import { useState } from "react";
import { Send, Mic, Plus, SlidersHorizontal, File, Image, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AttachedFile {
  name: string;
  type: "file" | "image";
}

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  onActionsOpen: () => void;
  onSettingsOpen: () => void;
  webEnabled?: boolean;
}

const ChatInput = ({ onSend, disabled, onActionsOpen, onSettingsOpen, webEnabled }: ChatInputProps) => {
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);

  const handleSend = () => {
    if ((!value.trim() && attachments.length === 0) || disabled) return;
    onSend(value.trim());
    setValue("");
    setAttachments([]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="px-4 pb-8 pt-2">
      {/* Attached files chips */}
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 mb-2 px-1"
          >
            {attachments.map((att, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-subtle text-foreground text-xs font-medium"
              >
                {att.type === "image" ? <Image size={12} /> : <File size={12} />}
                <span className="max-w-[120px] truncate">{att.name}</span>
                <button onClick={() => removeAttachment(i)} className="ml-0.5 hover:text-foreground">
                  <X size={12} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div className="rounded-2xl glass overflow-hidden">
        <div className="flex items-center gap-1 px-2 py-1">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask anything..."
            rows={1}
            className="flex-1 bg-transparent resize-none text-[14px] text-foreground placeholder:text-muted-foreground outline-none py-2.5 px-2 max-h-32 scrollbar-none"
          />
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Mic size={18} />
          </button>
        </div>

        {/* Bottom toolbar */}
        <div className="flex items-center justify-between px-2 pb-2">
          <div className="flex items-center gap-1">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onActionsOpen}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-[rgba(255,255,255,0.4)] transition-all"
            >
              <Plus size={18} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onSettingsOpen}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-[rgba(255,255,255,0.4)] transition-all"
            >
              <SlidersHorizontal size={16} />
            </motion.button>
            {webEnabled && (
              <span className="text-[10px] px-2 py-1 rounded-full glass-subtle text-primary font-semibold">
                Web
              </span>
            )}
          </div>

          {value.trim() || attachments.length > 0 ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              disabled={disabled}
              className="p-2 rounded-xl bg-primary/80 backdrop-blur-xl text-primary-foreground disabled:opacity-40 border border-[rgba(255,255,255,0.3)]"
            >
              <Send size={16} />
            </motion.button>
          ) : (
            <div className="w-9" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
