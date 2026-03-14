import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Copy, RotateCcw, ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useT } from "@/i18n/LanguageContext";
import type { ContentBlock } from "./types";
import ThinkingBlock from "./blocks/ThinkingBlock";
import ToolUseBlock from "./blocks/ToolUseBlock";
import ToolResultBlock from "./blocks/ToolResultBlock";
import TextBlock from "./blocks/TextBlock";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content?: string;
  blocks?: ContentBlock[];
  timestamp?: string;
  index?: number;
  isStreaming?: boolean;
  skipEntrance?: boolean;
  onRetry?: () => void;
}

const ActionBtn = ({
  children,
  onClick,
  label,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  active?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={label}
    aria-label={label}
    className={`p-1.5 rounded-lg transition-colors ${
      active
        ? "text-primary bg-primary/10"
        : "text-muted-foreground hover:text-foreground hover:bg-accent"
    }`}
  >
    {children}
  </button>
);

const ChatBubble = ({ role, content, blocks, timestamp, index, isStreaming, skipEntrance, onRetry }: ChatBubbleProps) => {
  const { t } = useT();
  const isUser = role === "user";
  const staggerDelay = (index ?? 0) < 5 ? (index ?? 0) * 0.06 : 0;
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copyText = blocks
    ? blocks
        .filter((b): b is ContentBlock & { type: "text" } => b.type === "text")
        .map((b) => b.content)
        .join("\n")
    : content || "";

  const handleCopy = () => {
    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    setMenuOpen(false);
  };

  const handleLongPressStart = () => {
    longPressTimer.current = setTimeout(() => setMenuOpen(true), 500);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  const getRelativeTime = () => {
    if (!timestamp) return null;
    if (timestamp.includes("T")) {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    }
    if (/^\d{2}:\d{2}$/.test(timestamp)) {
      const [h, m] = timestamp.split(":").map(Number);
      const d = new Date();
      d.setHours(h, m, 0, 0);
      return formatDistanceToNow(d, { addSuffix: true });
    }
    return timestamp;
  };

  const showActions = (hovered || menuOpen) && !isStreaming;

  const renderBlocks = () => {
    if (!blocks || blocks.length === 0) return null;
    const lastBlock = blocks[blocks.length - 1];
    return blocks.map((block, i) => {
      const isLast = i === blocks.length - 1;
      const isActiveStreaming = isStreaming && isLast;
      switch (block.type) {
        case "thinking":
          return (
            <ThinkingBlock
              key={i}
              content={block.content}
              isStreaming={isActiveStreaming}
            />
          );
        case "tool_use":
          return (
            <ToolUseBlock
              key={i}
              label={block.label}
              status={block.status}
            />
          );
        case "tool_result":
          return (
            <ToolResultBlock
              key={i}
              title={block.title}
              count={block.count}
              items={block.items}
            />
          );
        case "text":
          return (
            <TextBlock
              key={i}
              content={block.content}
              isStreaming={isActiveStreaming}
            />
          );
      }
    });
  };

  return (
    <>
      {menuOpen && <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />}
      <motion.div
        initial={skipEntrance ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={skipEntrance ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1], delay: staggerDelay }}
        className={`flex ${isUser ? "justify-end" : "justify-start"} mb-5`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className={`max-w-[85%] min-w-0 flex flex-col gap-1 relative ${isUser ? "items-end" : "items-start"}`}>
          {!isUser && (
            <div className="flex items-center gap-2 mb-1 px-1">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles size={11} className="text-primary" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">FLock</span>
            </div>
          )}

          <div
            className={`rounded-2xl px-4 py-3 text-[14px] leading-relaxed relative overflow-hidden break-words max-w-full min-w-0 ${
              isUser
                ? "bg-primary text-primary-foreground rounded-br-md"
                : "bg-secondary text-foreground rounded-bl-md"
            }`}
            onTouchStart={handleLongPressStart}
            onTouchEnd={handleLongPressEnd}
            onContextMenu={(e) => {
              e.preventDefault();
              setMenuOpen(true);
            }}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap">{content}</p>
            ) : blocks && blocks.length > 0 ? (
              renderBlocks()
            ) : content ? (
              <TextBlock content={content} isStreaming={isStreaming} />
            ) : null}
          </div>

          {/* Action row — absolute to prevent layout shift */}
          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.14 }}
                className={`absolute -bottom-6 flex items-center gap-0.5 px-0.5 z-20 ${isUser ? "right-0" : "left-0"}`}
              >
                <ActionBtn onClick={handleCopy} label={t("copyMessage")}>
                  {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                </ActionBtn>
                {!isUser && onRetry && (
                  <ActionBtn
                    onClick={() => {
                      onRetry();
                      setMenuOpen(false);
                    }}
                    label={t("retry")}
                  >
                    <RotateCcw size={13} />
                  </ActionBtn>
                )}
                {!isUser && (
                  <>
                    <ActionBtn
                      onClick={() => setFeedback(feedback === "up" ? null : "up")}
                      label={t("goodResponse")}
                      active={feedback === "up"}
                    >
                      <ThumbsUp size={13} />
                    </ActionBtn>
                    <ActionBtn
                      onClick={() => setFeedback(feedback === "down" ? null : "down")}
                      label={t("badResponse")}
                      active={feedback === "down"}
                    >
                      <ThumbsDown size={13} />
                    </ActionBtn>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {timestamp && (
            <span className="text-[11px] text-muted-foreground/60 font-mono px-2">{getRelativeTime()}</span>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default ChatBubble;
