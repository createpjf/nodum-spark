import { motion } from "framer-motion";
import { MessageSquare, FolderOpen, Box, Code, Briefcase, Star, Plus } from "lucide-react";

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
  { icon: Box, label: "Artifacts" },
  { icon: Code, label: "Code" },
];

const ConversationList = ({ conversations, starredProjects, activeId, onSelect, onNew }: ConversationListProps) => {
  return (
    <div className="flex flex-col h-full bg-background border-r border-border">
      {/* Brand */}
      <div className="px-6 pt-14 pb-4">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Nodum</h1>
      </div>

      {/* Nav items */}
      <div className="px-4 mb-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/80 hover:bg-accent transition-colors"
          >
            <item.icon size={18} className="text-muted-foreground" />
            {item.label}
          </button>
        ))}
      </div>

      <div className="h-px bg-border mx-5 my-2" />

      {/* Starred */}
      <div className="px-5 mb-1">
        <div className="flex items-center gap-1.5 mb-2">
          <Star size={12} className="text-muted-foreground" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Starred</span>
        </div>
        {starredProjects.map((p) => (
          <button key={p.id} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-accent transition-colors">
            <Briefcase size={16} className="text-primary" />
            <span className="font-semibold text-foreground">{p.name}</span>
          </button>
        ))}
      </div>

      <div className="h-px bg-border mx-5 my-2" />

      {/* Recents */}
      <div className="flex-1 overflow-y-auto scrollbar-none px-5">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2 block">Recents</span>
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors mb-0.5 ${
              activeId === conv.id ? "bg-accent font-medium" : "hover:bg-accent/60"
            }`}
          >
            <span className="text-foreground">{conv.title}</span>
          </button>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="px-5 pb-8 pt-3 flex items-center justify-between border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-xs font-semibold text-secondary-foreground">U</span>
          </div>
          <span className="text-sm font-medium text-foreground">User</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onNew}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg"
        >
          <Plus size={20} className="text-primary-foreground" />
        </motion.button>
      </div>
    </div>
  );
};

export default ConversationList;
