import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  "Private & Secure",
  "Unlimited text generation",
  "1,000 image requests per day",
  "Edit images",
  "Combine images",
  "Upscale / enhance images",
  "Create and share characters",
  "Securely backup chat history",
  "Access the newest and most capable models",
  "1,000 credits (for Video or API)",
  "API access",
  "Priority support",
];

const Subscription = () => {
  const [plan, setPlan] = useState<"monthly" | "yearly">("monthly");
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen max-w-[430px] mx-auto overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-14 pb-4">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ArrowLeft size={22} className="text-foreground" />
        </motion.button>
        <h1 className="text-lg font-semibold text-foreground">Upgrade to FLock Pro</h1>
      </div>

      <div className="px-6 pb-10">
        {/* Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-full glass p-1">
            <button
              onClick={() => setPlan("monthly")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                plan === "monthly" ? "bg-[rgba(255,255,255,0.6)] text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setPlan("yearly")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                plan === "yearly" ? "bg-[rgba(255,255,255,0.6)] text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Price */}
        <h2 className="text-3xl font-bold text-foreground text-center mb-1">
          {plan === "monthly" ? "$18.00" : "$144.00"} USD / {plan === "monthly" ? "month" : "year"}
        </h2>
        <p className="text-sm text-muted-foreground text-center mb-8">
          {plan === "yearly" && "Save 33% — "}Prices shown in USD.
        </p>

        {/* Features */}
        <div className="glass rounded-2xl p-5 mb-6">
          <div className="space-y-3">
            {features.map((f) => (
              <div key={f} className="flex items-start gap-3">
                <Check size={18} className="text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subscribe button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-full bg-primary/80 backdrop-blur-xl text-primary-foreground font-semibold text-base shadow-lg border border-[rgba(255,255,255,0.3)]"
        >
          Subscribe
        </motion.button>

        {/* Legal links */}
        <div className="flex justify-center gap-6 mt-6">
          <button className="text-xs text-muted-foreground hover:text-foreground">Privacy Policy</button>
          <button className="text-xs text-muted-foreground hover:text-foreground">Terms of Service</button>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
