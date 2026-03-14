import { motion } from "framer-motion";
import { Briefcase, Users, Clock } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";

interface Project {
  id: string;
  name: string;
  desc: string;
  members: number;
  lastActive: string;
}

interface ProjectsListProps {
  onSelect: (project: { id: string; name: string }) => void;
}

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 380, damping: 26 } },
};

function ProjectsList({ onSelect }: ProjectsListProps) {
  const { t } = useT();

  const projects: Project[] = [
    { id: "p1", name: t("researchAssistant"), desc: t("researchAssistantDesc"), members: 3, lastActive: "2h ago" },
    { id: "p2", name: t("contentEngine"), desc: t("contentEngineDesc"), members: 5, lastActive: "1d ago" },
    { id: "p3", name: t("codeReviewBot"), desc: t("codeReviewBotDesc"), members: 2, lastActive: "3d ago" },
    { id: "p4", name: t("dataPipeline"), desc: t("dataPipelineDesc"), members: 4, lastActive: "1w ago" },
  ];

  return (
    <motion.div
      variants={listVariants}
      initial="hidden"
      animate="visible"
    >
      {projects.map((project) => (
        <motion.button
          key={project.id}
          variants={itemVariants}
          whileTap={{ scale: 0.97 }}
          whileHover={{ x: 2 }}
          className="w-full text-left px-3 py-3 rounded-xl hover:bg-accent/60 transition-colors mb-1"
          onClick={() => onSelect({ id: project.id, name: project.name })}
        >
          <div className="flex items-center gap-2">
            <Briefcase size={14} className="text-primary" />
            <span className="text-sm font-semibold text-foreground">{project.name}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{project.desc}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="flex items-center gap-1">
              <Users size={11} className="text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground">{project.members}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} className="text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground">{project.lastActive}</span>
            </span>
          </div>
        </motion.button>
      ))}
    </motion.div>
  );
}

export default ProjectsList;
