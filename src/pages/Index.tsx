import { Routes, Route } from "react-router-dom";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import WelcomePage from "./WelcomePage";
import HomePage from "./HomePage";
import ChatPage from "./ChatPage";

import HistoryPage from "./HistoryPage";
import ProfilePage from "./ProfilePage";
import SettingsPage from "./SettingsPage";
import JoinPage from "./JoinPage";
import LoginPage from "./LoginPage";
import OnboardingPage from "./OnboardingPage";
import AboutPage from "./AboutPage";
import WhyAccountPage from "./WhyAccountPage";

const BrainBoxFooter = () => (
  <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none flex justify-center pb-[68px]">
    <span className="text-[9px] font-mono text-muted-foreground/40 tracking-widest">Powered by BrainBox</span>
  </div>
);

const Index = () => {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/join" element={<JoinPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/about" element={<><TopBar /><AboutPage /><BottomNav /><BrainBoxFooter /></>} />
      <Route path="/why-account" element={<WhyAccountPage />} />

      <Route path="/home" element={<><TopBar /><HomePage /><BottomNav /><BrainBoxFooter /></>} />
      <Route path="/chat" element={<><TopBar /><ChatPage /><BottomNav /><BrainBoxFooter /></>} />
      
      <Route path="/history" element={<><TopBar /><HistoryPage /><BottomNav /><BrainBoxFooter /></>} />
      <Route path="/profile" element={<><TopBar /><ProfilePage /><BottomNav /><BrainBoxFooter /></>} />
      <Route path="/settings" element={<><TopBar /><SettingsPage /><BottomNav /><BrainBoxFooter /></>} />
    </Routes>
  );
};

export default Index;
