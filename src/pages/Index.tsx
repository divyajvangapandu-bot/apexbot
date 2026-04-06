import { Routes, Route } from "react-router-dom";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import WelcomePage from "./WelcomePage";
import HomePage from "./HomePage";
import ChatPage from "./ChatPage";
import ToolsPage from "./ToolsPage";
import HistoryPage from "./HistoryPage";
import ProfilePage from "./ProfilePage";
import SettingsPage from "./SettingsPage";
import JoinPage from "./JoinPage";
import LoginPage from "./LoginPage";
import OnboardingPage from "./OnboardingPage";
import AboutPage from "./AboutPage";
import WhyAccountPage from "./WhyAccountPage";

const Index = () => {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/join" element={<JoinPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/why-account" element={<WhyAccountPage />} />

      <Route path="/home" element={<><TopBar /><HomePage /><BottomNav /></>} />
      <Route path="/chat" element={<><TopBar /><ChatPage /><BottomNav /></>} />
      <Route path="/tools" element={<><TopBar /><ToolsPage /><BottomNav /></>} />
      <Route path="/history" element={<><TopBar /><HistoryPage /><BottomNav /></>} />
      <Route path="/profile" element={<><TopBar /><ProfilePage /><BottomNav /></>} />
      <Route path="/settings" element={<><TopBar /><SettingsPage /><BottomNav /></>} />
    </Routes>
  );
};

export default Index;
