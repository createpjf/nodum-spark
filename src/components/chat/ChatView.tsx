import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ChevronDown, EyeOff, Eye } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";
import { useSettings } from "@/hooks/useSettings";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import ModelSelectorDrawer from "./ModelSelectorDrawer";
import SettingsDrawer from "./SettingsDrawer";
import ActionsDrawer from "./ActionsDrawer";
import type { Message, ContentBlock } from "./types";

interface ChatViewProps {
  title: string;
  hasMessages: boolean;
  onMenuOpen: () => void;
  onBack: () => void;
  onNewChat?: () => void;
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    blocks: [{ type: "text", content: "Hey! I'm your FLock.io AI assistant. I can help you with research, writing, coding, analysis, and creative tasks. What would you like to explore?" }],
    timestamp: "09:41",
  },
  {
    id: "2",
    role: "user",
    blocks: [{ type: "text", content: "Help me understand how transformer architectures work in modern LLMs" }],
    timestamp: "09:42",
  },
  {
    id: "3",
    role: "assistant",
    blocks: [
      { type: "thinking", content: "用户想了解 transformer 架构在现代 LLM 中的工作原理。我需要从核心组件讲起：自注意力机制、多头注意力、前馈网络和位置编码，并给出代码示例。" },
      { type: "text", content: `Great question! Transformer architectures are the backbone of modern large language models.

## Core Components

1. **Self-Attention Mechanism** — The model weighs every token against every other token, computing relevance scores across the full sequence
2. **Multi-Head Attention** — Runs multiple parallel attention operations to capture different relationship types
3. **Feed-Forward Networks** — Process attention outputs through dense layers with non-linear activations
4. **Positional Encoding** — Encodes sequence order since transformers process all tokens simultaneously

### Implementation Example

\`\`\`python
import torch
import torch.nn as nn

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model: int, num_heads: int):
        super().__init__()
        self.d_k = d_model // num_heads
        self.num_heads = num_heads
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)

    def forward(self, x):
        Q, K, V = self.W_q(x), self.W_k(x), self.W_v(x)
        scores = (Q @ K.transpose(-2, -1)) / (self.d_k ** 0.5)
        return torch.softmax(scores, dim=-1) @ V
\`\`\`

Want me to dive deeper into any of these components?` },
    ],
    timestamp: "09:42",
  },
];

// Streaming scenarios with thinking, optional tool use, and text
const streamingScenarios = [
  {
    thinking: "分析用户的问题，需要从性能优化的角度来回答。重点讲 memoization、code splitting 和 state colocation 这几个关键策略。",
    tools: null,
    text: `Here's a breakdown of the key best practices:

## Performance Optimization

- **Memoization** — Use \`React.memo\`, \`useMemo\`, and \`useCallback\` strategically to avoid unnecessary re-renders
- **Code splitting** — Lazy load routes and heavy components with \`React.lazy\` and \`Suspense\`
- **State colocation** — Keep state as close to where it's used as possible

> Premature optimization is the root of all evil. Profile first, then optimize.

\`\`\`typescript
// Before: re-renders on every parent update
const List = ({ items }: { items: string[] }) => (
  <ul>{items.map(item => <li key={item}>{item}</li>)}</ul>
);

// After: only re-renders when items change
const List = React.memo(({ items }: { items: string[] }) => (
  <ul>{items.map(item => <li key={item}>{item}</li>)}</ul>
));
\`\`\``,
    followUps: ["Show me a real profiling example", "What about server-side rendering?", "When should I use Zustand vs Redux?"],
  },
  {
    thinking: "这个问题需要对比不同的 API 方案。让我搜索一下相关对话来提供更准确的信息。",
    tools: {
      name: "conversation_search",
      label: "Looking for relevant chats...",
      results: [
        { id: "r1", label: "API 设计最佳实践" },
        { id: "r2", label: "GraphQL vs REST 对比" },
        { id: "r3", label: "WebSocket 实时通信方案" },
        { id: "r4", label: "微服务架构设计" },
      ],
    },
    text: `Great follow-up! Here's a comparison of the main API approaches:

| Approach | Latency | Scalability | Best For |
|----------|---------|-------------|----------|
| REST | Low | High | CRUD operations |
| GraphQL | Medium | Medium | Flexible data queries |
| WebSocket | Very Low | Medium | Real-time data |
| gRPC | Very Low | High | Microservices |

**Bottom line**: REST is the safe default for most APIs. GraphQL shines when clients need flexible data shapes. Use WebSockets or gRPC for real-time/high-performance requirements.

Which scenario are you building for?`,
    followUps: ["Compare REST vs GraphQL in practice", "How do I handle auth in a REST API?", "What's the best caching strategy?"],
  },
  {
    thinking: "让我搜索用户之前关于 AI 和 transformer 的讨论，整合记忆中的相关信息来给出更个性化的回答。",
    tools: {
      name: "memory_search",
      label: "Searching memory...",
      results: [
        { id: "m1", label: "Transformer 架构笔记" },
        { id: "m2", label: "注意力机制的数学推导" },
        { id: "m3", label: "LLM 训练流程讨论" },
      ],
    },
    text: `The relationship between these concepts is fundamental to modern AI:

## Key Ideas

1. **Attention is all you need** — The title of the original transformer paper, and it's true: the attention mechanism is what makes these models powerful
2. **Context window** — The maximum number of tokens the model can consider at once (e.g., 200k for Claude)
3. **Emergent capabilities** — Abilities that appear at scale that weren't explicitly trained for

\`\`\`python
# Simplified scaled dot-product attention
def attention(Q, K, V):
    d_k = Q.shape[-1]
    scores = (Q @ K.T) / math.sqrt(d_k)  # Scale to prevent vanishing gradients
    weights = softmax(scores)             # Convert to probabilities
    return weights @ V                    # Weighted sum of values
\`\`\`

Want me to explain how this connects to the broader training process?`,
    followUps: ["What is the computational cost of attention?", "How does BERT differ from GPT?", "Explain positional encoding"],
  },
];

const ChatView = ({ title, hasMessages, onMenuOpen, onNewChat }: ChatViewProps) => {
  const { t } = useT();
  const { settings, update: updateSettings } = useSettings();

  const starterPrompts = [
    { emoji: "\u270F\uFE0F", label: t("helpWrite"), prompt: "Help me write a concise product announcement for " },
    { emoji: "\uD83D\uDCBB", label: t("debugCode"), prompt: t("writeFunction") },
    { emoji: "\u2728", label: t("brainstormIdeas"), prompt: t("creativeIdeas") },
    { emoji: "\uD83D\uDCDA", label: t("helpLearn"), prompt: t("explainTransformers") },
  ];
  const [messages, setMessages] = useState<Message[]>(hasMessages ? initialMessages : []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingBlocks, setStreamingBlocks] = useState<ContentBlock[]>([]);
  const [selectedModel, setSelectedModel] = useState("gemini-3-pro");
  const [selectedModelName, setSelectedModelName] = useState("Gemini 3 Pro");
  const [modelDrawerOpen, setModelDrawerOpen] = useState(false);
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);
  const [actionsDrawerOpen, setActionsDrawerOpen] = useState(false);
  const openDrawer = (drawer: "model" | "settings" | "actions") => {
    setModelDrawerOpen(drawer === "model");
    setSettingsDrawerOpen(drawer === "settings");
    setActionsDrawerOpen(drawer === "actions");
  };
  const webEnabled = settings.webSearchEnabled;
  const setWebEnabled = useCallback((v: boolean) => updateSettings("webSearchEnabled", v), [updateSettings]);
  const [incognito, setIncognitoRaw] = useState(false);
  const [incognitoBanner, setIncognitoBanner] = useState(false);
  const [followUps, setFollowUps] = useState<string[]>([]);

  const bannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setIncognito = useCallback((v: boolean) => {
    setIncognitoRaw(v);
    setIncognitoBanner(true);
    if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
    bannerTimerRef.current = setTimeout(() => setIncognitoBanner(false), 2500);
  }, []);
  const [inputPrefill, setInputPrefill] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const stopRef = useRef(false);
  const activeTimersRef = useRef<Set<ReturnType<typeof setTimeout | typeof setInterval>>>(new Set());
  const justFinishedRef = useRef(false);
  const hasAnimatedRef = useRef(false);

  // Track timers for cleanup on unmount / stop
  const trackTimeout = (fn: () => void, ms: number) => {
    const id = setTimeout(() => { activeTimersRef.current.delete(id); fn(); }, ms);
    activeTimersRef.current.add(id);
    return id;
  };
  const trackInterval = (fn: () => void, ms: number) => {
    const id = setInterval(fn, ms);
    activeTimersRef.current.add(id);
    return id;
  };
  const clearAllTimers = () => {
    activeTimersRef.current.forEach((id) => { clearTimeout(id); clearInterval(id); });
    activeTimersRef.current.clear();
  };

  // Cleanup all streaming timers on unmount
  useEffect(() => () => clearAllTimers(), []);

  // Entrance animation config — only plays once on first mount
  const entrance = (delay: number) =>
    hasAnimatedRef.current
      ? {}
      : {
          initial: { opacity: 0, y: 10 } as const,
          animate: { opacity: 1, y: 0 } as const,
          transition: { delay, duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
        };

  // Mark entrance as done after first render
  useEffect(() => {
    const t = setTimeout(() => { hasAnimatedRef.current = true; }, 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setMessages(hasMessages ? initialMessages : []);
    setStreamingBlocks([]);
    setIsGenerating(false);
    setFollowUps([]);
  }, [hasMessages]);

  const scrollPending = useRef(false);
  useEffect(() => {
    if (!scrollPending.current) {
      scrollPending.current = true;
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
        scrollPending.current = false;
      });
    }
  }, [messages, streamingBlocks, followUps]);

  // Cmd+K / Ctrl+K → new chat
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onNewChat?.();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onNewChat]);

  const handleSend = useCallback(
    (content: string) => {
      if (isGenerating) return;

      setFollowUps([]);

      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        blocks: [{ type: "text", content }],
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsGenerating(true);
      setStreamingBlocks([]);
      stopRef.current = false;

      const scenario = streamingScenarios[Math.floor(Math.random() * streamingScenarios.length)];
      const allBlocks: ContentBlock[] = [];
      let phase = 0; // 0=thinking, 1=tool_use, 2=tool_result, 3=text
      let charIndex = 0;

      const finalize = () => {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          blocks: [...allBlocks],
          timestamp: new Date().toISOString(),
        };
        // All updates batch in React 18 — no flicker
        justFinishedRef.current = true;
        setMessages((prev) => [...prev, aiMsg]);
        setStreamingBlocks([]);
        setIsGenerating(false);
        setTimeout(() => {
          setFollowUps(scenario.followUps);
        }, 300);
      };

      const stopEarly = () => {
        if (allBlocks.length > 0) {
          const aiMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            blocks: [...allBlocks],
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, aiMsg]);
        }
        setStreamingBlocks([]);
        setIsGenerating(false);
      };

      // Start after brief pause
      clearAllTimers();
      trackTimeout(() => {
        // Phase 0: Stream thinking
        phase = 0;
        charIndex = 0;
        const thinkingText = scenario.thinking;

        const thinkingInterval = trackInterval(() => {
          if (stopRef.current) {
            clearInterval(thinkingInterval);
            activeTimersRef.current.delete(thinkingInterval);
            stopEarly();
            return;
          }

          const chunk = Math.floor(Math.random() * 3) + 2;
          charIndex = Math.min(charIndex + chunk, thinkingText.length);
          const thinkingBlock: ContentBlock = { type: "thinking", content: thinkingText.slice(0, charIndex) };
          setStreamingBlocks([thinkingBlock]);

          if (charIndex >= thinkingText.length) {
            clearInterval(thinkingInterval);
            activeTimersRef.current.delete(thinkingInterval);
            allBlocks.push({ type: "thinking", content: thinkingText });

            // Phase 1-2: Tool use (if scenario has tools)
            if (scenario.tools) {
              const toolBlock: ContentBlock = { type: "tool_use", toolName: scenario.tools.name, status: "running", label: scenario.tools.label };
              allBlocks.push(toolBlock);
              setStreamingBlocks([...allBlocks]);

              // After delay, show tool results
              trackTimeout(() => {
                if (stopRef.current) { stopEarly(); return; }

                // Update tool_use to done
                allBlocks[allBlocks.length - 1] = { ...toolBlock, status: "done" };
                const resultBlock: ContentBlock = {
                  type: "tool_result",
                  toolName: scenario.tools!.name,
                  title: "Relevant chats",
                  count: scenario.tools!.results.length,
                  items: scenario.tools!.results,
                };
                allBlocks.push(resultBlock);
                setStreamingBlocks([...allBlocks]);

                // Phase 3: Stream text after short pause
                trackTimeout(() => startTextStreaming(), 400);
              }, 1200);
            } else {
              // Skip to text streaming
              trackTimeout(() => startTextStreaming(), 200);
            }
          }
        }, 22);

        const startTextStreaming = () => {
          charIndex = 0;
          const fullText = scenario.text;

          const textInterval = trackInterval(() => {
            if (stopRef.current) {
              clearInterval(textInterval);
              activeTimersRef.current.delete(textInterval);
              // Save partial text
              const partial = fullText.slice(0, charIndex);
              if (partial.trim()) {
                allBlocks.push({ type: "text", content: partial });
              }
              stopEarly();
              return;
            }

            const chunk = Math.floor(Math.random() * 4) + 2;
            charIndex = Math.min(charIndex + chunk, fullText.length);
            const textBlock: ContentBlock = { type: "text", content: fullText.slice(0, charIndex) };
            setStreamingBlocks([...allBlocks, textBlock]);

            if (charIndex >= fullText.length) {
              clearInterval(textInterval);
              activeTimersRef.current.delete(textInterval);
              allBlocks.push({ type: "text", content: fullText });
              finalize();
            }
          }, 40);
        };
      }, 400);
    },
    [isGenerating]
  );

  const handleStop = useCallback(() => {
    stopRef.current = true;
    clearAllTimers();
  }, []);

  const handleRetry = useCallback(() => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUserMsg) return;
    const userContent = lastUserMsg.blocks.find((b) => b.type === "text");
    if (!userContent || userContent.type !== "text") return;
    setMessages((prev) => {
      const lastAssistantIdx = [...prev].map((m, i) => (m.role === "assistant" ? i : -1)).filter((i) => i !== -1).pop();
      if (lastAssistantIdx !== undefined) return prev.slice(0, lastAssistantIdx);
      return prev;
    });
    setFollowUps([]);
    setTimeout(() => handleSend(userContent.content), 50);
  }, [messages, handleSend]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return t("greetingMorning");
    if (h < 17) return t("greetingAfternoon");
    return t("greetingEvening");
  };

  const lastAssistantIndex = messages.map((m, i) => (m.role === "assistant" ? i : -1)).filter((i) => i !== -1).pop();

  // Helper to get text content for user messages
  const getUserContent = (msg: Message) => {
    const textBlock = msg.blocks.find((b) => b.type === "text");
    return textBlock && textBlock.type === "text" ? textBlock.content : "";
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <motion.div {...entrance(0)} className="grid grid-cols-[44px_1fr_44px] items-center px-4 safe-header pb-3 glass sticky top-0 z-30">
        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.04 }}
          onClick={onMenuOpen}
          className="p-2.5 -ml-2 self-center"
          aria-label={t("openMenu")}
        >
          <Menu size={22} className="text-foreground" />
        </motion.button>

        <div className="flex flex-col items-center self-center">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => openDrawer("model")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-subtle"
            aria-label={t("selectModel")}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={selectedModelName}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="text-[13px] font-semibold text-foreground"
              >
                {selectedModelName}
              </motion.span>
            </AnimatePresence>
            <motion.div
              animate={{ rotate: modelDrawerOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={14} className="text-muted-foreground" />
            </motion.div>
          </motion.button>
        </div>

        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.04 }}
          onClick={() => setIncognito(!incognito)}
          className={`w-8 h-8 rounded-full flex items-center justify-center self-center justify-self-end transition-colors ${
            incognito ? "bg-primary/10" : "border border-border"
          }`}
          aria-label={incognito ? t("incognitoDisable") : t("incognitoEnable")}
          title={incognito ? t("incognitoOn") : t("incognitoEnable")}
          aria-pressed={incognito}
        >
          <AnimatePresence mode="wait" initial={false}>
            {incognito ? (
              <motion.div
                key="eye-off"
                initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.5, opacity: 0, rotate: 20 }}
                transition={{ duration: 0.18 }}
              >
                <EyeOff size={18} className="text-primary" />
              </motion.div>
            ) : (
              <motion.div
                key="eye"
                initial={{ scale: 0.5, opacity: 0, rotate: 20 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.5, opacity: 0, rotate: -20 }}
                transition={{ duration: 0.18 }}
              >
                <Eye size={18} className="text-muted-foreground" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* Content */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence>
          {incognitoBanner && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute top-2 left-0 right-0 z-20 flex justify-center pointer-events-none"
            >
              <div className="flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-card/80 backdrop-blur-md border border-border/60 shadow-sm">
                <EyeOff size={12} className="text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground font-medium">{incognito ? t("incognitoOn") : t("incognitoOff")}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait" initial={false}>
          {messages.length === 0 && !isGenerating && incognito ? (
            <motion.div
              key="incognito"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute inset-0 flex flex-col items-center justify-center px-6 bg-foreground/5"
            >
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 400, damping: 24 }}
                className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-6"
              >
                <EyeOff size={28} className="text-muted-foreground" />
              </motion.div>
              <p className="text-sm text-muted-foreground text-center max-w-[280px] md:max-w-[360px] leading-relaxed">
                {t("incognitoDesc").split(" ").map((word, i) => (
                  <span
                    key={i}
                    className="inline-block mr-[0.3em]"
                    style={{
                      animation: "word-reveal 0.35s cubic-bezier(0.22,1,0.36,1) both",
                      animationDelay: `${300 + i * 60}ms`,
                    }}
                  >
                    {word}
                  </span>
                ))}
              </p>
            </motion.div>
          ) : messages.length === 0 && !isGenerating ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute inset-0 flex flex-col justify-end px-6 pb-8"
            >
              <div className="flex-1" />
              <div>
                <p className="text-base text-muted-foreground mb-1">
                  {`${greeting()},`.split(" ").map((word, i) => (
                    <span
                      key={i}
                      className="inline-block mr-[0.3em]"
                      style={{
                        animation: "word-reveal 0.4s cubic-bezier(0.22,1,0.36,1) both",
                        animationDelay: `${i * 150}ms`,
                      }}
                    >
                      {word}
                    </span>
                  ))}
                </p>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {t("whereToStart").split(" ").map((word, i) => (
                    <span
                      key={i}
                      className="inline-block mr-[0.3em]"
                      style={{
                        animation: "word-reveal 0.35s cubic-bezier(0.22,1,0.36,1) both",
                        animationDelay: `${400 + i * 100}ms`,
                      }}
                    >
                      {word}
                    </span>
                  ))}
                </h2>
              </div>

              {/* Starter prompt pills */}
              <div className="flex flex-col gap-2 items-start">
                {starterPrompts.map((sp, i) => (
                  <button
                    key={sp.label}
                    style={{
                      animation: "pill-reveal 0.3s cubic-bezier(0.22,1,0.36,1) both",
                      animationDelay: `${1000 + i * 70}ms`,
                    }}
                    onClick={() => setInputPrefill(sp.prompt)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-secondary hover:bg-accent active:scale-[0.96] transition-all text-left"
                  >
                    <span className="text-[15px]">{sp.emoji}</span>
                    <span className="text-[13px] font-medium text-foreground">{sp.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="messages"
              ref={scrollRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 overflow-y-auto overflow-x-hidden scrollbar-none px-4 py-4 pb-32"
            >
              {messages.map((msg, index) => {
                // Skip entrance animation for message that just finished streaming
                const skip = justFinishedRef.current && index === messages.length - 1 && msg.role === "assistant";
                if (skip) justFinishedRef.current = false;
                return (
                  <ChatBubble
                    key={msg.id}
                    role={msg.role}
                    content={msg.role === "user" ? getUserContent(msg) : undefined}
                    blocks={msg.role === "assistant" ? msg.blocks : undefined}
                    timestamp={msg.timestamp}
                    index={index}
                    skipEntrance={skip}
                    onRetry={
                      msg.role === "assistant" && index === lastAssistantIndex && !isGenerating
                        ? handleRetry
                        : undefined
                    }
                  />
                );
              })}

              {/* Streaming message */}
              {isGenerating && streamingBlocks.length === 0 && <TypingIndicator />}
              {streamingBlocks.length > 0 && (
                <ChatBubble
                  role="assistant"
                  blocks={streamingBlocks}
                  index={messages.length}
                  isStreaming={true}
                />
              )}

              {/* Follow-up suggestions */}
              <AnimatePresence>
                {followUps.length > 0 && !isGenerating && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="mt-6 mb-4 overflow-hidden pl-1"
                  >
                    <div className="flex flex-col gap-2 pt-1">
                      <p className="text-[11px] text-muted-foreground font-medium px-1 uppercase tracking-wide">
                        {t("followUp")}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {followUps.map((q, i) => (
                          <motion.button
                            key={q}
                            initial={{ opacity: 0, scale: 0.88 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.06, type: "spring", stiffness: 400, damping: 28 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setFollowUps([]);
                              handleSend(q);
                            }}
                            className="text-[12px] px-3 py-1.5 rounded-full bg-secondary hover:bg-accent border border-border/60 text-foreground/80 transition-colors text-left"
                          >
                            {q}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-auto pb-2">
        <motion.div {...entrance(0.3)}>
          <ChatInput
            onSend={handleSend}
            onStop={handleStop}
            disabled={isGenerating}
            onActionsOpen={() => openDrawer("actions")}
            onSettingsOpen={() => openDrawer("settings")}
            webEnabled={webEnabled}
            onWebToggle={setWebEnabled}
            prefill={inputPrefill}
            onPrefillConsumed={() => setInputPrefill("")}
          />
        </motion.div>
        <p className="text-[10px] text-muted-foreground text-center py-1">Powered by FLock API Platform</p>
      </div>

      {/* Hidden file inputs */}
      <input ref={fileRef} type="file" className="hidden" multiple />
      <input ref={imageRef} type="file" accept="image/*" className="hidden" multiple />

      {/* Drawers */}
      <ModelSelectorDrawer
        open={modelDrawerOpen}
        onClose={() => setModelDrawerOpen(false)}
        selectedModel={selectedModel}
        onSelectModel={(id, name) => {
          setSelectedModel(id);
          setSelectedModelName(name);
        }}
      />
      <SettingsDrawer
        open={settingsDrawerOpen}
        onClose={() => setSettingsDrawerOpen(false)}
        webEnabled={webEnabled}
        onWebToggle={setWebEnabled}
      />
      <ActionsDrawer
        open={actionsDrawerOpen}
        onClose={() => setActionsDrawerOpen(false)}
        onFileSelect={() => fileRef.current?.click()}
        onImageSelect={() => imageRef.current?.click()}
      />
    </div>
  );
};

export default ChatView;
