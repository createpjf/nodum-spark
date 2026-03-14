import { motion } from "framer-motion";
import { useNavDirection } from "@/hooks/useNavDirection";

const PageTransition = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const direction = useNavDirection();
  const isForward = direction > 0;

  return (
    <motion.div
      initial={{ x: isForward ? "100%" : "-30%", opacity: isForward ? 1 : 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{
        x: isForward ? "-30%" : "100%",
        opacity: isForward ? 0 : 1,
        transition: { duration: 0.15 },
      }}
      transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
      style={{ willChange: "transform" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
