import { motion } from "framer-motion";
import {
  X, Info, User, CreditCard, BarChart3, Zap,
  Palette, Volume2, Bell, Shield, Vibrate, LogOut, ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const Profile = () => {
  const navigate = useNavigate();
  const [haptic, setHaptic] = useState(true);

  const sections = [
    {
      items: [
        { icon: User, label: "Profile", value: "" },
        { icon: CreditCard, label: "Billing", value: "Free" },
        { icon: BarChart3, label: "Usage", value: "" },
      ],
    },
    {
      items: [
        { icon: Zap, label: "Capabilities", value: "" },
      ],
    },
    {
      items: [
        { icon: Palette, label: "Appearance", value: "System" },
        { icon: Volume2, label: "Speech language", value: "EN" },
        { icon: Bell, label: "Notifications", value: "" },
        { icon: Shield, label: "Privacy", value: "" },
      ],
    },
  ];

  return (
    <div className="h-screen w-screen max-w-[430px] mx-auto overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-14 pb-3">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="p-2 -ml-2">
          <X size={22} className="text-foreground" />
        </motion.button>
        <h1 className="text-lg font-semibold text-foreground">Settings</h1>
        <button className="p-2 -mr-2">
          <Info size={20} className="text-muted-foreground" />
        </button>
      </div>

      <div className="px-5 pb-10">
        {/* Email field */}
        <div className="mb-5 rounded-2xl glass-subtle px-4 py-3">
          <span className="text-sm text-foreground">user@example.com</span>
        </div>

        {/* Sections */}
        {sections.map((section, si) => (
          <div key={si} className="mb-3 rounded-2xl glass overflow-hidden">
            {section.items.map((item, i) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-[rgba(255,255,255,0.3)] transition-all ${
                  i < section.items.length - 1 ? "border-b border-[rgba(255,255,255,0.3)]" : ""
                }`}
              >
                <item.icon size={18} className="text-muted-foreground" />
                <span className="flex-1 text-left text-sm font-medium text-foreground">{item.label}</span>
                {item.value && (
                  <span className="text-sm text-muted-foreground mr-1">{item.value}</span>
                )}
                <ChevronRight size={16} className="text-muted-foreground" />
              </button>
            ))}
          </div>
        ))}

        {/* Haptic feedback */}
        <div className="mb-3 rounded-2xl glass overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Vibrate size={18} className="text-muted-foreground" />
            <span className="flex-1 text-sm font-medium text-foreground">Haptic feedback</span>
            <Switch checked={haptic} onCheckedChange={setHaptic} />
          </div>
        </div>

        <div className="h-px bg-[rgba(255,255,255,0.4)] my-4" />

        {/* Log out */}
        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl glass text-destructive text-sm font-medium hover:bg-[rgba(255,100,100,0.1)] transition-all">
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </div>
  );
};

export default Profile;
