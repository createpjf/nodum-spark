import { motion } from "framer-motion";
import { MessageSquare, FolderOpen, Briefcase, Star, Plus, Sparkles, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Conversation {
  id: string;
  title: string;
  preview: string;
  time: string;
  unread?: boolean;
}

interface StarredProject {
  id: string;
  name: string;
  desc: string;
}

interface ConversationListProps {
  conversations: Conversation[];
  starredProjects: StarredProject[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
}

const navItems = [
  { icon: MessageSquare, label: "Chats" },
  { icon: FolderOpen, label: "Projects" },
];

const ConversationList = ({ conversations, starredProjects, activeId, onSelect, onNew }: ConversationListProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full glass-strong rounded-r-3xl">
      {/* Brand */}
      <div className="px-6 pt-14 pb-4">
        <h1 className="text-2xl font-bold text-foreground tracking-tight drop-shadow-sm">FLock Chat</h1>
      </div>

      {/* Nav items */}
      <div className="px-4 mb-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium text-foreground/80 hover:bg-[rgba(255,255,255,0.4)] transition-all"
          >
            <item.icon size={18} className="text-muted-foreground" />
            {item.label}
          </button>
        ))}
      </div>

      <div className="h-px bg-[rgba(255,255,255,0.4)] mx-5 my-2" />

      {/* Upgrade to Pro */}
      <div className="px-4 mb-2">
        <button
          onClick={() => navigate("/subscription")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium hover:bg-[rgba(55,115,255,0.08)] transition-all"
        >
          <Sparkles size={18} className="text-primary" />
          <span className="text-primary font-semibold">Upgrade to Pro</span>
        </button>
      </div>

      <div className="h-px bg-[rgba(255,255,255,0.4)] mx-5 my-2" />

      {/* Starred */}
      <div className="px-5 mb-1">
        <div className="flex items-center gap-1.5 mb-2">
          <Star size={12} className="text-muted-foreground" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Starred</span>
        </div>
        {starredProjects.map((p) => (
          <button key={p.id} className="w-full flex items-center gap-3 px-3 py-2 rounded-2xl text-sm hover:bg-[rgba(255,255,255,0.4)] transition-all">
            <Briefcase size={16} className="text-primary" />
            <span className="font-semibold text-foreground">{p.name}</span>
          </button>
        ))}
      </div>

      <div className="h-px bg-[rgba(255,255,255,0.4)] mx-5 my-2" />

      {/* Recents */}
      <div className="flex-1 overflow-y-auto scrollbar-none px-5">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2 block">Recents</span>
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`w-full text-left px-3 py-2.5 rounded-2xl text-sm transition-all mb-0.5 ${
              activeId === conv.id ? "bg-[rgba(255,255,255,0.5)] font-medium shadow-sm" : "hover:bg-[rgba(255,255,255,0.35)]"
            }`}
          >
            <span className="text-foreground">{conv.title}</span>
          </button>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="px-5 pb-8 pt-3 flex items-center justify-between border-t border-[rgba(255,255,255,0.4)]">
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full glass-subtle flex items-center justify-center">
            <User size={14} className="text-secondary-foreground" />
          </div>
          <span className="text-sm font-medium text-foreground">User</span>
        </button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onNew}
          className="w-10 h-10 rounded-full bg-primary/80 backdrop-blur-xl flex items-center justify-center shadow-lg border border-[rgba(255,255,255,0.3)]"
        >
          <Plus size={20} className="text-primary-foreground" />
        </motion.button>
      </div>
    </div>
  );
};

export default ConversationList;
