import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ConversationList from "@/components/chat/ConversationList";
import ChatView from "@/components/chat/ChatView";

const conversations = [
  { id: "1", title: "Transformer Architectures", preview: "Help me understand how transformer...", time: "09:42", unread: true },
  { id: "2", title: "Content Strategy Q4", preview: "Let's map out the content calendar for...", time: "Yesterday" },
  { id: "3", title: "React Performance", preview: "What are the best practices for memo...", time: "Mon" },
  { id: "4", title: "API Design Patterns", preview: "Compare REST vs GraphQL for our use...", time: "Mar 8" },
  { id: "5", title: "Brand Voice Guide", preview: "Draft a brand voice document that...", time: "Mar 5" },
  { id: "6", title: "Database Schema Review", preview: "Review this PostgreSQL schema and...", time: "Mar 2" },
];

const Index = () => {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const activeConv = conversations.find((c) => c.id === activeChat);

  return (
    <div className="h-screen w-screen max-w-[430px] mx-auto overflow-hidden relative bg-background">
      {/* Environment blur bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-background to-background pointer-events-none" />

      <AnimatePresence mode="wait">
        {!activeChat ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full relative z-10"
          >
            <ConversationList
              conversations={conversations}
              activeId=""
              onSelect={(id) => setActiveChat(id)}
              onNew={() => {}}
            />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="h-full relative z-10"
          >
            <ChatView
              title={activeConv?.title || "New Chat"}
              onBack={() => setActiveChat(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
