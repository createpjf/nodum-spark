import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const TypingIndicator = () => (
  <div className="flex justify-start mb-4">
    <div className="flex items-center gap-2 px-1">
      <div className="w-5 h-5 rounded-full glass flex items-center justify-center">
        <Sparkles size={11} className="text-primary" />
      </div>
      <div className="flex gap-1 glass-subtle rounded-full px-3 py-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  </div>
);

export default TypingIndicator;
