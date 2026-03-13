import { motion } from "framer-motion";
import { ArrowLeft, User, Mail, Bell, Shield, Moon, LogOut, ChevronRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const menuSections = [
  {
    title: "Account",
    items: [
      { icon: User, label: "Edit Profile", action: "profile" },
      { icon: Mail, label: "Email & Notifications", action: "email" },
      { icon: Shield, label: "Privacy & Security", action: "privacy" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: Moon, label: "Appearance", action: "appearance" },
      { icon: Bell, label: "Notifications", action: "notifications" },
    ],
  },
];

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen max-w-[430px] mx-auto overflow-y-auto bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-14 pb-4">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ArrowLeft size={22} className="text-foreground" />
        </motion.button>
        <h1 className="text-lg font-semibold text-foreground">Profile</h1>
      </div>

      <div className="px-5 pb-10">
        {/* Avatar + Name */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-3">
            <span className="text-2xl font-bold text-secondary-foreground">U</span>
          </div>
          <h2 className="text-xl font-bold text-foreground">User</h2>
          <p className="text-sm text-muted-foreground">user@example.com</p>
        </div>

        {/* Pro upsell */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/subscription")}
          className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl bg-primary/5 border border-primary/20 mb-6"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles size={20} className="text-primary" />
          </div>
          <div className="flex-1 text-left">
            <span className="font-semibold text-sm text-foreground">Upgrade to Pro</span>
            <p className="text-xs text-muted-foreground">Unlock all models and features</p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground" />
        </motion.button>

        {/* Menu sections */}
        {menuSections.map((section) => (
          <div key={section.title} className="mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-1 mb-2">
              {section.title}
            </h3>
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              {section.items.map((item, i) => (
                <button
                  key={item.action}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-accent transition-colors ${
                    i < section.items.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <item.icon size={18} className="text-muted-foreground" />
                  <span className="flex-1 text-left text-sm font-medium text-foreground">{item.label}</span>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Sign out */}
        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-destructive/20 text-destructive text-sm font-medium mt-4 hover:bg-destructive/5 transition-colors">
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
