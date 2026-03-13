import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ChevronDown, Sparkles, EyeOff, Eye } from "lucide-react";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import ModelSelectorDrawer from "./ModelSelectorDrawer";
import SettingsDrawer from "./SettingsDrawer";
import ActionsDrawer from "./ActionsDrawer";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatViewProps {
  title: string;
  hasMessages: boolean;
  onMenuOpen: () => void;
  onBack: () => void;
}

const initialMessages: Message[] = [
  { id: "1", role: "assistant", content: "Hey! I'm FLock Chat, your AI assistant. I can help you with research, writing, coding, analysis, and creative tasks. What would you like to explore?", timestamp: "09:41" },
  { id: "2", role: "user", content: "Help me understand how transformer architectures work in modern LLMs", timestamp: "09:42" },
  { id: "3", role: "assistant", content: "Great question! Transformer architectures are the backbone of modern large language models. Here's a breakdown:\n\n• Self-Attention Mechanism — allows the model to weigh the importance of different words in a sequence relative to each other\n\n• Multi-Head Attention — runs multiple attention operations in parallel, capturing different types of relationships\n\n• Feed-Forward Networks — process the attention outputs through dense layers\n\n• Positional Encoding — since transformers process all tokens simultaneously, positional info is added to maintain sequence order\n\nWant me to dive deeper into any of these components?", timestamp: "09:42" },
];

const aiResponses = [
  "That's an interesting perspective. Let me think about this more carefully and provide a thorough analysis...",
  "I can help with that! Here are some key considerations to keep in mind as we work through this together.",
  "Great follow-up question. The relationship between these concepts is nuanced — let me break it down step by step.",
];

const ChatView = ({ title, hasMessages, onMenuOpen }: ChatViewProps) => {
  const [messages, setMessages] = useState<Message[]>(hasMessages ? initialMessages : []);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gemini-3-pro");
  const [selectedModelName, setSelectedModelName] = useState("Gemini 3 Pro");
  const [modelDrawerOpen, setModelDrawerOpen] = useState(false);
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);
  const [actionsDrawerOpen, setActionsDrawerOpen] = useState(false);
  const [webEnabled, setWebEnabled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMessages(hasMessages ? initialMessages : []);
  }, [hasMessages]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = (content: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-14 pb-3">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onMenuOpen} className="p-2 -ml-2">
          <Menu size={22} className="text-foreground" />
        </motion.button>
        <div className="flex flex-col items-center">
          <button
            onClick={() => setModelDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary"
          >
            <span className="text-[13px] font-semibold text-foreground">{selectedModelName}</span>
            <ChevronDown size={14} className="text-muted-foreground" />
          </button>
          {incognito && (
            <span className="text-[11px] text-muted-foreground mt-0.5">Incognito chat</span>
          )}
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIncognito(!incognito)}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            incognito ? "bg-primary/10" : "bg-secondary"
          }`}
        >
          {incognito ? (
            <EyeOff size={18} className="text-primary" />
          ) : (
            <Eye size={18} className="text-muted-foreground" />
          )}
        </motion.button>
      </div>

      {/* Content */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
            <Sparkles size={28} className="text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-1">{greeting()},</h2>
          <p className="text-muted-foreground text-center">How can I help you today?</p>
        </div>
      ) : (
        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-none px-4 py-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <ChatBubble key={msg.id} role={msg.role} content={msg.content} timestamp={msg.timestamp} />
            ))}
          </AnimatePresence>
          {isTyping && <TypingIndicator />}
        </div>
      )}

      <ChatInput
        onSend={handleSend}
        disabled={isTyping}
        onActionsOpen={() => setActionsDrawerOpen(true)}
        onSettingsOpen={() => setSettingsDrawerOpen(true)}
        webEnabled={webEnabled}
      />

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
