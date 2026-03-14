import { useState, useEffect, useRef } from "react";
import { Send, Plus, SlidersHorizontal, File, Image, X, Square, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "@/i18n/LanguageContext";

interface AttachedFile {
  name: string;
  type: "file" | "image";
}

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  disabled?: boolean;
  onActionsOpen: () => void;
  onSettingsOpen: () => void;
  webEnabled?: boolean;
  onWebToggle?: (enabled: boolean) => void;
  prefill?: string;
  onPrefillConsumed?: () => void;
}

const ChatInput = ({
  onSend,
  onStop,
  disabled,
  onActionsOpen,
  onSettingsOpen,
  webEnabled,
  onWebToggle,
  prefill,
  onPrefillConsumed,
}: ChatInputProps) => {
  const { t } = useT();
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (prefill) {
      setValue(prefill);
      onPrefillConsumed?.();
      // Focus + move cursor to end after prefill
      requestAnimationFrame(() => {
        const el = textareaRef.current;
        if (el) {
          el.focus();
          el.setSelectionRange(prefill.length, prefill.length);
        }
      });
    }
  }, [prefill]);

  const handleSend = () => {
    if ((!value.trim() && attachments.length === 0) || disabled) return;
    onSend(value.trim());
    setValue("");
    setAttachments([]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const hasContent = value.trim() || attachments.length > 0;

  return (
    <div className="px-4 pt-2 pb-1">
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium"
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
      <motion.div
        animate={{
          boxShadow: focused
            ? "0 0 0 2px hsl(var(--primary) / 0.35), 0 2px 12px hsl(var(--primary) / 0.12)"
            : "0 0 0 1px hsl(var(--border)), 0 1px 3px hsl(var(--foreground) / 0.04)",
        }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="rounded-[var(--glass-radius)] glass overflow-hidden"
      >
        <div className="flex items-center gap-1 px-2 py-1">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={t("askAnything")}
            rows={1}
            disabled={disabled}
            className="flex-1 bg-transparent resize-none text-[14px] text-foreground placeholder:text-muted-foreground outline-none py-2.5 px-2 max-h-32 scrollbar-none disabled:opacity-60"
          />
        </div>

        {/* Bottom toolbar */}
        <div className="flex items-center justify-between px-2 pb-2">
          <div className="flex items-center gap-0.5">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onActionsOpen}
              disabled={disabled}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-40"
              aria-label={t("attachFiles")}
              title={t("attachFiles")}
            >
              <Plus size={18} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onSettingsOpen}
              disabled={disabled}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-40"
              aria-label={t("chatSettings")}
              title={t("chatSettings")}
            >
              <SlidersHorizontal size={16} />
            </motion.button>
            {/* Web Search toggle — always visible */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onWebToggle?.(!webEnabled)}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                webEnabled
                  ? "text-primary bg-primary/10 hover:bg-primary/15"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
              aria-label={webEnabled ? t("disableWebSearch") : t("enableWebSearch")}
              title={webEnabled ? t("webSearchOn") : t("webSearchOff")}
            >
              <Globe size={16} />
              <AnimatePresence initial={false}>
                {webEnabled && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-[11px] font-semibold overflow-hidden whitespace-nowrap"
                  >
                    {t("web")}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Right side: Stop or Send button */}
          <AnimatePresence mode="wait" initial={false}>
            {disabled ? (
              <motion.button
                key="stop"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                whileTap={{ scale: 0.88 }}
                whileHover={{ scale: 1.06 }}
                onClick={onStop}
                className="p-2 rounded-lg bg-foreground/10 text-foreground hover:bg-foreground/15 transition-colors"
                aria-label={t("stopGenerating")}
                title={t("stopGenerating")}
              >
                <Square size={16} />
              </motion.button>
            ) : hasContent ? (
              <motion.button
                key="send"
                initial={{ scale: 0, opacity: 0, rotate: -45 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0, rotate: 45 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                whileTap={{ scale: 0.88 }}
                whileHover={{ scale: 1.06 }}
                onClick={handleSend}
                className="p-2 rounded-lg bg-primary text-primary-foreground"
                aria-label={t("sendMessage")}
              >
                <Send size={16} />
              </motion.button>
            ) : (
              <motion.div key="spacer" initial={false} className="w-9 shrink-0" />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatInput;
