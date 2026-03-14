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
  const [activeProject, setActiveProject] = useState<{ id: string; name: string } | null>(null);
  const activeConv = conversations.find((c) => c.id === activeChat);

  return (
    <motion.div
      initial={false}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
      transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
      className="h-screen w-screen max-w-full md:max-w-[600px] mx-auto overflow-hidden relative bg-background"
    >
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
              transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
              className="absolute inset-y-0 left-0 w-[78%] z-50 overflow-hidden"
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
                onProjectSelect={(project) => {
                  setActiveProject(project);
                  setActiveChat("new");
                  setSidebarOpen(false);
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main chat view */}
      <motion.div
        animate={sidebarOpen
          ? { scale: 0.92, x: "12%", borderRadius: "20px", opacity: 0.85 }
          : { scale: 1, x: "0%", borderRadius: "0px", opacity: 1 }}
        transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
        className="absolute inset-0 overflow-hidden bg-background"
        style={{ transformOrigin: "left center", willChange: "transform" }}
      >
        <ChatView
          title={activeConv?.title || (activeProject?.name ? `${activeProject.name}` : "")}
          hasMessages={!!activeChat && activeChat !== "new"}
          onMenuOpen={() => setSidebarOpen(true)}
          onBack={() => setActiveChat(null)}
          onNewChat={() => {
            setActiveChat("new");
            setSidebarOpen(false);
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Index;
