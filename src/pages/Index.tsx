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

const starredProjects = [
  { id: "p1", name: "Research Assistant", desc: "AI-powered research tool" },
  { id: "p2", name: "Content Engine", desc: "Automated content pipeline" },
];

const Index = () => {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const activeConv = conversations.find((c) => c.id === activeChat);

  return (
    <div className="h-screen w-screen max-w-[430px] mx-auto overflow-hidden relative bg-background">
      {/* Sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-foreground/20 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute inset-y-0 left-0 w-[85%] z-50"
            >
              <ConversationList
                conversations={conversations}
                starredProjects={starredProjects}
                activeId={activeChat || ""}
                onSelect={(id) => {
                  setActiveChat(id);
                  setSidebarOpen(false);
                }}
                onNew={() => {
                  setActiveChat("new");
                  setSidebarOpen(false);
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main chat view */}
      <ChatView
        title={activeConv?.title || ""}
        hasMessages={!!activeChat && activeChat !== "new"}
        onMenuOpen={() => setSidebarOpen(true)}
        onBack={() => setActiveChat(null)}
      />
    </div>
  );
};

export default Index;
