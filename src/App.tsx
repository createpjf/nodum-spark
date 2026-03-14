import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation, useNavigationType } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Subscription from "./pages/Subscription.tsx";
import Profile from "./pages/Profile.tsx";
import ProfileEdit from "./pages/ProfileEdit.tsx";
import Usage from "./pages/Usage.tsx";
import Capabilities from "./pages/Capabilities.tsx";
import SpeechLanguage from "./pages/SpeechLanguage.tsx";
import Notifications from "./pages/Notifications.tsx";
import Privacy from "./pages/Privacy.tsx";
import Credits from "./pages/Credits.tsx";
import NotFound from "./pages/NotFound.tsx";
import { LanguageProvider } from "./i18n/LanguageContext";
import { NavDirectionContext } from "@/hooks/useNavDirection";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  const navType = useNavigationType();
  const direction = navType === "POP" ? -1 : 1;

  return (
    <NavDirectionContext.Provider value={direction}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Index />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          <Route path="/usage" element={<Usage />} />
          <Route path="/capabilities" element={<Capabilities />} />
          <Route path="/speech-language" element={<SpeechLanguage />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/credits" element={<Credits />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </NavDirectionContext.Provider>
  );
};

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </LanguageProvider>
  </ThemeProvider>
);

export default App;
