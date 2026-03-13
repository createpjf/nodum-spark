import { useState, useRef } from "react";
import { Send, Mic, Plus, File, Image, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface AttachedFile {
  name: string;
  type: "file" | "image";
}

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if ((!value.trim() && attachments.length === 0) || disabled) return;
    onSend(value.trim());
    setValue("");
    setAttachments([]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: "file" | "image") => {
    const files = e.target.files;
    if (!files) return;
    const newAttachments = Array.from(files).map((f) => ({ name: f.name, type }));
    setAttachments((prev) => [...prev, ...newAttachments]);
    e.target.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="px-4 pb-8 pt-2">
      {/* Attached files chips */}
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 mb-2 px-1"
          >
            {attachments.map((att, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium"
              >
                {att.type === "image" ? <Image size={12} /> : <File size={12} />}
                <span className="max-w-[120px] truncate">{att.name}</span>
                <button onClick={() => removeAttachment(i)} className="ml-0.5 hover:text-foreground">
                  <X size={12} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rounded-full border border-border bg-card flex items-center gap-1 px-2 py-1 shadow-sm">
        {/* Attachment button */}
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Plus size={18} />
            </motion.button>
          </PopoverTrigger>
          <PopoverContent align="start" side="top" className="w-48 p-2 rounded-xl">
            <button
              onClick={() => { fileRef.current?.click(); setPopoverOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-accent transition-colors text-foreground"
            >
              <File size={16} className="text-muted-foreground" />
              Upload File
            </button>
            <button
              onClick={() => { imageRef.current?.click(); setPopoverOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-accent transition-colors text-foreground"
            >
              <Image size={16} className="text-muted-foreground" />
              Upload Image
            </button>
          </PopoverContent>
        </Popover>

        <input ref={fileRef} type="file" className="hidden" onChange={(e) => handleFileSelect(e, "file")} multiple />
        <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e, "image")} multiple />

        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Chat with Nodum..."
          rows={1}
          className="flex-1 bg-transparent resize-none text-[14px] text-foreground placeholder:text-muted-foreground outline-none py-2.5 max-h-32 scrollbar-none"
        />
        {value.trim() || attachments.length > 0 ? (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={disabled}
            className="p-2 rounded-full bg-primary text-primary-foreground disabled:opacity-40"
          >
            <Send size={16} />
          </motion.button>
        ) : (
          <button className="p-2 text-muted-foreground">
            <Mic size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
