import { motion } from "framer-motion";
import { Plus, Search, MessageSquare } from "lucide-react";

interface Conversation {
  id: string;
  title: string;
  preview: string;
  time: string;
  unread?: boolean;
}

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
}

const ConversationList = ({ conversations, activeId, onSelect, onNew }: ConversationListProps) => {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-2">
        <h1 className="text-2xl font-semibold text-gradient">Chats</h1>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onNew}
          className="w-8 h-8 rounded-full bg-accent flex items-center justify-center"
        >
          <Plus size={18} className="text-foreground" />
        </motion.button>
      </div>

      {/* Search */}
      <div className="px-5 py-3">
        <div className="glass-subtle rounded-xl flex items-center gap-2 px-3 py-2.5">
          <Search size={15} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto scrollbar-none px-2">
        {conversations.map((conv) => (
          <motion.button
            key={conv.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(conv.id)}
            className={`w-full text-left px-3 py-3 rounded-xl flex items-start gap-3 transition-colors mb-0.5 ${
              activeId === conv.id ? "bg-accent" : "hover:bg-accent/50"
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
              <MessageSquare size={16} className="text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-foreground truncate">{conv.title}</span>
                <span className="text-[10px] text-muted-foreground font-mono shrink-0 ml-2">{conv.time}</span>
              </div>
              <p className="text-[12px] text-muted-foreground truncate mt-0.5">{conv.preview}</p>
            </div>
            {conv.unread && (
              <div className="w-2 h-2 rounded-full bg-foreground/60 shrink-0 mt-2" />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
