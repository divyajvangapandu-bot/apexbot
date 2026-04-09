import { Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import apexbotLogo from "@/assets/apexbot-logo.jpeg";

const WelcomePage = () => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  const handleGetStarted = () => {
    if (loading) return;
    // Authenticated user with complete profile → go straight to home
    if (user && profile && profile.name && profile.purpose) {
      navigate("/home");
    } else if (user) {
      // Authenticated but incomplete profile → home anyway (they already have account)
      navigate("/home");
    } else {
      // Guest / new user → onboarding
      navigate("/onboarding");
    }
  };

  return (
    <div className="fixed inset-0 nebula-gradient flex flex-col items-center justify-center px-6 overflow-hidden">
      <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, hsl(var(--cyan-glow) / 0.4), transparent 70%)", animation: "floatOrb 8s ease-in-out infinite" }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, hsl(var(--purple-glow) / 0.4), transparent 70%)", animation: "floatOrb 10s ease-in-out infinite reverse" }} />

      <div className="relative z-10 flex flex-col items-center text-center animate-fade-in-up">
        <img src={apexbotLogo} alt="ApexBot AI" className="w-20 h-20 rounded-2xl border border-primary/30 mb-8 animate-glow-pulse object-cover" />
        <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2 tracking-wide">
          ApexBot <span className="neon-text-cyan">AI</span> Assistant
        </h1>
        <p className="text-muted-foreground text-sm mb-2">Think Faster. Go Beyond.</p>
        <p className="text-muted-foreground/60 text-xs max-w-xs mb-12">
          Your unlimited, next-generation AI companion — precise, powerful, and built for the curious.
        </p>
        <button onClick={handleGetStarted} disabled={loading}
          className="cyber-button text-base px-14 py-4 animate-glow-pulse hover-bounce disabled:opacity-50">
          {loading ? "Loading…" : "GET STARTED"}
        </button>
        <p className="text-[10px] text-muted-foreground/50 mt-6 font-mono tracking-wider">V10 SUPER-INTELLIGENCE SYSTEM</p>
        <p className="text-[9px] text-muted-foreground/30 mt-3 font-mono tracking-widest">Powered by BrainBox</p>
      </div>
    </div>
  );
};

export default WelcomePage;
