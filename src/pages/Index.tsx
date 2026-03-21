import { useState, useEffect } from "react";
import Onboarding from "@/components/Onboarding";
import Dashboard from "@/components/Dashboard";
import WhyApexbot from "@/components/WhyApexbot";
import MeetArchitect from "@/components/MeetArchitect";
import { Zap, ChevronDown, ArrowUp } from "lucide-react";

type AppView = "onboarding" | "dashboard" | "landing";

const LandingHero = ({ onLaunch }: { onLaunch: () => void }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <>
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center relative nebula-gradient px-6 scanline-overlay">
        {/* Orbs */}
        <div className="absolute top-20 right-20 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, hsl(185 100% 50% / 0.4), transparent 70%)", animation: "floatOrb 8s ease-in-out infinite" }}
        />
        <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full opacity-8"
          style={{ background: "radial-gradient(circle, hsl(270 80% 60% / 0.3), transparent 70%)", animation: "floatOrb 12s ease-in-out infinite reverse" }}
        />

        <div className={`text-center max-w-3xl relative z-10 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Zap size={28} className="text-primary" />
            <span className="font-display text-lg tracking-[0.4em] neon-text-cyan">APEXBOT AI ASSISTANT</span>
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl text-foreground mb-6 text-balance" style={{ lineHeight: "1.05" }}>
            God-Tier<br />
            <span className="neon-text-purple">Intelligence</span>
          </h1>
          
          <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            The AI that never says "I can't." Unlimited questions. Unfiltered answers. Built for digital superheroes.
          </p>

          <button onClick={onLaunch} className="cyber-button text-base px-10 py-4 animate-glow-pulse">
            INITIALIZE NEURAL LINK
          </button>

          <p className="text-xs font-mono text-muted-foreground mt-4">No restrictions. No judgment. Just intelligence.</p>
        </div>

        <a href="#why" className="absolute bottom-8 text-muted-foreground hover:text-primary transition-colors">
          <ChevronDown size={24} className="animate-bounce" />
        </a>
      </section>

      {/* Why Apexbot */}
      <WhyApexbot />

      {/* Meet Architect */}
      <MeetArchitect />

      {/* Footer CTA */}
      <section className="py-20 px-6 text-center nebula-gradient border-t border-border/30">
        <div className="max-w-xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl neon-text-cyan mb-4 text-balance" style={{ lineHeight: "1.15" }}>
            Ready to ascend?
          </h2>
          <p className="text-muted-foreground mb-8">Join the ranks of digital superheroes using Apexbot.</p>
          <button onClick={onLaunch} className="cyber-button px-10 py-4">
            LAUNCH APEXBOT
          </button>
        </div>
      </section>

      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 p-3 glass-panel hover:neon-border-cyan transition-all z-30"
      >
        <ArrowUp size={16} className="text-primary" />
      </button>
    </>
  );
};

const Index = () => {
  const [view, setView] = useState<AppView>("landing");
  const [userName, setUserName] = useState("");
  const [dashReady, setDashReady] = useState(false);

  const handleLaunch = () => setView("onboarding");

  const handleOnboardingComplete = (data: { name: string; dob: string; mission: string }) => {
    setUserName(data.name);
    // Brief flash before dashboard
    setDashReady(false);
    setTimeout(() => {
      setView("dashboard");
      setTimeout(() => setDashReady(true), 50);
    }, 300);
  };

  if (view === "onboarding") return <Onboarding onComplete={handleOnboardingComplete} />;

  if (view === "dashboard") {
    return (
      <div className={`transition-all duration-700 ${dashReady ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
           style={{ filter: dashReady ? "blur(0)" : "blur(10px) brightness(1.5)" }}>
        <Dashboard userName={userName} />
      </div>
    );
  }

  return <LandingHero onLaunch={handleLaunch} />;
};

export default Index;
