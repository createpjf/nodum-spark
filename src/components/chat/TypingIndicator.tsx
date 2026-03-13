import { motion } from "framer-motion";

const TypingIndicator = () => (
  <div className="flex justify-start mb-4">
    <div className="flex items-center gap-2 px-1">
      <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-foreground">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="flex gap-1">
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
