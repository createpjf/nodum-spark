import { motion, AnimatePresence } from "framer-motion";
import { File, Image, Camera, Wand2, Layers, Video, Maximize } from "lucide-react";

interface ActionsDrawerProps {
  open: boolean;
  onClose: () => void;
  onFileSelect: () => void;
  onImageSelect: () => void;
}

const actions = [
  { icon: File, label: "Attach file", pro: false, key: "file" },
  { icon: Image, label: "Attach image from library", pro: false, key: "image" },
  { icon: Camera, label: "Take a photo", pro: false, key: "camera" },
  { icon: Wand2, label: "Edit image", pro: true, key: "edit" },
  { icon: Layers, label: "Combine images", pro: true, key: "combine" },
  { icon: Video, label: "Create video with image", pro: false, key: "video" },
  { icon: Maximize, label: "Upscale & enhance", pro: true, key: "upscale" },
];

const ActionsDrawer = ({ open, onClose, onFileSelect, onImageSelect }: ActionsDrawerProps) => {
  const handleAction = (key: string) => {
    if (key === "file") {
      onFileSelect();
    } else if (key === "image") {
      onImageSelect();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-foreground/30 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl border-t border-border"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            <div className="px-5 pb-6">
              <h3 className="text-lg font-bold text-foreground mb-3">Actions</h3>

              {actions.map((action) => (
                <button
                  key={action.key}
                  onClick={() => !action.pro && handleAction(action.key)}
                  className={`w-full flex items-center gap-4 px-2 py-3.5 rounded-xl transition-colors ${
                    action.pro ? "opacity-50" : "hover:bg-accent"
                  }`}
                >
                  <action.icon size={20} className="text-foreground shrink-0" />
                  <span className="text-sm font-medium text-foreground">{action.label}</span>
                  {action.pro && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold ml-1">
                      PRO
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ActionsDrawer;
