import { useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import HomePage from "./HomePage";
import ChatPage from "./ChatPage";
import ToolsPage from "./ToolsPage";
import HistoryPage from "./HistoryPage";
import ProfilePage from "./ProfilePage";
import SettingsPage from "./SettingsPage";
import JoinPage from "./JoinPage";
import LoginPage from "./LoginPage";
import OnboardingPage from "./OnboardingPage";

const Index = () => {
  const [userName, setUserName] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  const handleOnboardingComplete = (data: { name: string; dob: string; mission: string }) => {
    setUserName(data.name);
    setHasOnboarded(true);
  };

  const handleSignIn = (name?: string) => {
    setIsSignedIn(true);
    if (name) setUserName(name);
    setHasOnboarded(true);
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
    setUserName("");
    setHasOnboarded(false);
  };

  // If not onboarded, show onboarding
  if (!hasOnboarded) {
    return <OnboardingPage onComplete={handleOnboardingComplete} />;
  }

  return (
    <>
      <TopBar isSignedIn={isSignedIn} userName={userName} onSignOut={handleSignOut} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage userName={userName} isSignedIn={isSignedIn} onSignIn={() => handleSignIn()} />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/profile" element={<ProfilePage userName={userName} isSignedIn={isSignedIn} onSignOut={handleSignOut} />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/join" element={<JoinPage onSignIn={(name) => handleSignIn(name)} />} />
        <Route path="/login" element={<LoginPage onSignIn={(name) => handleSignIn(name)} />} />
      </Routes>
      <BottomNav />
    </>
  );
};

export default Index;
