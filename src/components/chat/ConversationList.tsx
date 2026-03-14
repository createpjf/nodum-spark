import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, FolderOpen, Briefcase, Star, Plus, Sparkles, User, Search, Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useT } from "@/i18n/LanguageContext";
import { useSettings } from "@/hooks/useSettings";
import ProjectsList from "./ProjectsList";

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
  onProjectSelect?: (project: { id: string; name: string }) => void;
}

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 380, damping: 26 } },
};

const ConversationList = ({ conversations, starredProjects, activeId, onSelect, onNew, onProjectSelect }: ConversationListProps) => {
  const navigate = useNavigate();
  const { t } = useT();
  const { settings } = useSettings();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"chats" | "projects">("chats");

  const filtered = search.trim()
    ? conversations.filter(
        (c) =>
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.preview.toLowerCase().includes(search.toLowerCase())
      )
    : conversations;

  return (
    <div className="flex flex-col h-full glass border-r-0">
      {/* Brand */}
      <div className="px-6 safe-header pb-3 pt-2">
        <svg className="h-7 w-auto text-foreground" viewBox="0 0 544 121" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="FLock.io">
          <path d="M50.952 0.047H17.778H0V17.848V40.987L17.778 58.745V40.987V17.848H50.952H68.73L50.952 0.047Z" fill="currentColor"/>
          <path d="M50.952 61.994H17.778H0V79.795V102.934L17.778 120.693V102.934V79.795H50.952H68.73L50.952 61.994Z" fill="currentColor"/>
          <path d="M193.595 110.291C169.65 110.291 154.977 90.621 154.977 69.336C154.977 48.052 169.65 28.382 193.595 28.382C217.54 28.382 232.213 48.052 232.213 69.336C232.213 90.621 217.54 110.291 193.595 110.291ZM193.595 97.546C206.822 97.546 214.265 86.033 214.265 69.379C214.265 52.725 206.865 41.212 193.595 41.212C180.325 41.212 173.095 52.555 173.095 69.379C173.095 86.202 180.496 97.546 193.595 97.546Z" fill="currentColor"/>
          <path d="M278.569 110.291C255.389 110.291 240.589 91.088 240.589 69.336C240.589 47.585 254.921 28.382 277.931 28.382C296.389 28.382 310.254 38.451 313.231 57.059H295.879C294.007 46.99 287.543 41.17 278.228 41.17C265.469 41.17 258.664 52.98 258.664 69.336C258.664 85.693 265.894 97.503 278.994 97.503C288.138 97.503 294.773 91.343 296.474 81.274H313.954C310.977 99.84 296.942 110.248 278.484 110.248L278.569 110.291Z" fill="currentColor"/>
          <path d="M339.743 67.637V108.718H322.561V0.087H339.743V62.453" fill="currentColor"/>
          <path d="M375.766 36.753L352.332 60.162L339.742 72.737L352.332 85.313L375.766 108.721H400.944L388.355 96.146L364.921 72.737L388.355 49.286L400.944 36.753H375.766Z" fill="currentColor"/>
          <path d="M409.121 108.716V91.085H427.41V108.716H409.121Z" fill="currentColor"/>
          <path d="M438.864 17.548V0.087H457.152V17.548H438.864ZM439.332 108.718V29.996H456.514V108.718H439.332Z" fill="currentColor"/>
          <path d="M505.382 110.291C481.437 110.291 466.764 90.621 466.764 69.336C466.764 48.052 481.437 28.382 505.382 28.382C529.327 28.382 544 48.052 544 69.336C544 90.621 529.327 110.291 505.382 110.291ZM505.382 97.546C518.609 97.546 526.052 86.033 526.052 69.379C526.052 52.725 518.652 41.212 505.382 41.212C492.113 41.212 484.882 52.555 484.882 69.379C484.882 86.202 492.283 97.546 505.382 97.546Z" fill="currentColor"/>
          <path d="M79.256 0H96.373L96.373 93.248H144.471V108.98H79.256V0Z" fill="currentColor"/>
        </svg>
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl glass-subtle">
          <Search size={14} className="text-muted-foreground shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={activeTab === "chats" ? t("searchConversations") : t("searchProjects")}
            className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
      </div>

      {/* Nav items (tab switcher) */}
      <div className="px-4 mb-2 space-y-1">
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ x: 2 }}
          onClick={() => { setActiveTab("chats"); setSearch(""); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            activeTab === "chats" ? "bg-accent text-foreground" : "text-foreground/80 hover:bg-accent"
          }`}
        >
          <MessageSquare size={18} className="text-muted-foreground" />
          {t("chats")}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ x: 2 }}
          onClick={() => { setActiveTab("projects"); setSearch(""); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            activeTab === "projects" ? "bg-accent text-foreground" : "text-foreground/80 hover:bg-accent"
          }`}
        >
          <FolderOpen size={18} className="text-muted-foreground" />
          {t("projects")}
        </motion.button>
      </div>

      <div className="h-px bg-secondary mx-4 my-1" />

      {/* Upgrade to Pro */}
      <div className="px-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate("/subscription")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/5 transition-colors"
        >
          <Sparkles size={18} className="text-primary" />
          <span className="text-primary font-semibold">{t("upgradeToPro")}</span>
        </motion.button>
      </div>

      <div className="h-px bg-secondary mx-4 my-1" />

      {activeTab === "chats" ? (
        <>
          {/* Starred */}
          <div className="px-4 mb-1">
            <div className="flex items-center gap-1.5 mb-2">
              <Star size={12} className="text-muted-foreground" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{t("starred")}</span>
            </div>
            <motion.div variants={listVariants} initial="hidden" animate="visible">
              {starredProjects.map((p) => (
                <motion.button
                  key={p.id}
                  variants={itemVariants}
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ x: 2 }}
                  onClick={() => onProjectSelect?.({ id: p.id, name: p.name })}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-accent transition-colors"
                >
                  <Briefcase size={16} className="text-primary" />
                  <span className="font-semibold text-foreground">{p.name}</span>
                </motion.button>
              ))}
            </motion.div>
          </div>

          <div className="h-px bg-secondary mx-4 my-2" />

          {/* Recents */}
          <div className="relative flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto scrollbar-none px-4">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2 block">{t("recents")}</span>
              <motion.div variants={listVariants} initial="hidden" animate="visible">
                {filtered.length === 0 && search.trim() && (
                  <p className="text-sm text-muted-foreground text-center py-8">{t("noResults")}</p>
                )}
                {filtered.map((conv) => (
                  <motion.button
                    key={conv.id}
                    variants={itemVariants}
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ x: 2 }}
                    onClick={() => onSelect(conv.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors mb-0.5 ${
                      activeId === conv.id ? "bg-accent font-medium" : "hover:bg-accent/60"
                    }`}
                  >
                    <span className="text-foreground block">{conv.title}</span>
                    {conv.preview && (
                      <span className="text-muted-foreground text-xs line-clamp-2 mt-0.5 leading-snug">
                        {conv.preview}
                      </span>
                    )}
                  </motion.button>
                ))}
              </motion.div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none bg-gradient-to-t from-foreground/[0.04] to-transparent" />
          </div>
        </>
      ) : (
        /* Projects view */
        <div className="relative flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto scrollbar-none px-4">
            <ProjectsList onSelect={(p) => onProjectSelect?.(p)} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none bg-gradient-to-t from-foreground/[0.04] to-transparent" />
        </div>
      )}

      {/* Bottom bar */}
      <div className="px-4 pb-3 pt-2">
        <div className="flex items-center justify-between">
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ x: 2 }}
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            aria-label={t("settings")}
          >
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <User size={16} className="text-secondary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-medium text-foreground">{t("user")}</span>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={(e) => { e.stopPropagation(); navigate("/credits"); }}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Coins size={12} />
                <span>{settings.creditBalance} {t("credits")}</span>
              </motion.button>
            </div>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.08 }}
            onClick={onNew}
            className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg"
            aria-label={t("sendMessage")}
          >
            <Plus size={22} className="text-primary-foreground" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ConversationList;
