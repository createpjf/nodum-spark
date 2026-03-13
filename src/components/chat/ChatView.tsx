import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, MoreHorizontal } from "lucide-react";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatViewProps {
  title: string;
  onBack: () => void;
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hey! I'm Nodum, your AI assistant. I can help you with research, writing, coding, analysis, and creative tasks. What would you like to explore?",
    timestamp: "09:41",
  },
  {
    id: "2",
    role: "user",
    content: "Help me understand how transformer architectures work in modern LLMs",
    timestamp: "09:42",
  },
  {
    id: "3",
    role: "assistant",
    content: "Great question! Transformer architectures are the backbone of modern large language models. Here's a breakdown:\n\n• Self-Attention Mechanism — allows the model to weigh the importance of different words in a sequence relative to each other\n\n• Multi-Head Attention — runs multiple attention operations in parallel, capturing different types of relationships\n\n• Feed-Forward Networks — process the attention outputs through dense layers\n\n• Positional Encoding — since transformers process all tokens simultaneously, positional info is added to maintain sequence order\n\nWant me to dive deeper into any of these components?",
    timestamp: "09:42",
  },
];

const aiResponses = [
  "That's an interesting perspective. Let me think about this more carefully and provide a thorough analysis...",
  "I can help with that! Here are some key considerations to keep in mind as we work through this together.",
  "Great follow-up question. The relationship between these concepts is nuanced — let me break it down step by step.",
  "I've analyzed this from multiple angles. Here's what I think would work best for your specific situation.",
];

const ChatView = ({ title, onBack }: ChatViewProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
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

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="glass-subtle flex items-center justify-between px-2 pt-14 pb-3 z-10">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onBack} className="p-2">
          <ChevronLeft size={22} className="text-foreground" />
        </motion.button>
        <div className="flex flex-col items-center">
          <span className="text-[14px] font-medium text-foreground">{title}</span>
          <span className="text-[10px] text-muted-foreground font-mono">nodum-4o · online</span>
        </div>
        <button className="p-2">
          <MoreHorizontal size={20} className="text-muted-foreground" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-none px-4 py-4">
        <div className="flex justify-center mb-6">
          <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-3 py-1 rounded-full">Today</span>
        </div>
        <AnimatePresence>
          {messages.map((msg) => (
            <ChatBubble key={msg.id} role={msg.role} content={msg.content} timestamp={msg.timestamp} />
          ))}
        </AnimatePresence>
        {isTyping && <TypingIndicator />}
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={isTyping} />
    </div>
  );
};

export default ChatView;
