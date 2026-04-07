import { Search, PenTool, FileText, Languages, Lightbulb, MessageSquare, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const quickActions = [
  { icon: Search, label: "Smart Search", color: "text-primary" },
  { icon: PenTool, label: "Generate", color: "text-accent" },
  { icon: FileText, label: "Summarise", color: "text-primary" },
  { icon: Languages, label: "Translate", color: "text-accent" },
  { icon: Lightbulb, label: "Solve", color: "text-primary" },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  return (
    <div className="min-h-screen pt-14 pb-20 px-4 nebula-gradient">
      <div className="flex flex-col items-center justify-center pt-16 pb-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 animate-glow-pulse">
          <Zap size={28} className="text-primary" />
        </div>
        <h1 className="font-display text-2xl md:text-3xl text-foreground mb-2 tracking-wide">
          ApexBot <span className="neon-text-cyan">v10</span>
        </h1>
        <p className="text-muted-foreground text-sm mb-1">Think Faster. Go Beyond.</p>
        {profile?.name && <p className="text-xs text-primary/60 font-mono mb-8">Welcome back, {profile.name}</p>}
        {!profile?.name && <div className="mb-8" />}

        <button onClick={() => navigate("/chat")} className="cyber-button text-base px-12 py-4 animate-glow-pulse mb-3">
          ASK APEX
        </button>
        <p className="text-xs text-muted-foreground">Start a conversation with limitless AI</p>
      </div>

      <div className="max-w-lg mx-auto mb-10">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
          {quickActions.map((action) => (
            <button key={action.label} onClick={() => navigate("/chat")}
              className="flex flex-col items-center gap-2 min-w-[64px] p-3 rounded-xl hover:bg-muted/30 transition-all duration-200 group">
              <div className="w-11 h-11 rounded-xl bg-card/60 border border-border/50 flex items-center justify-center group-hover:neon-border-cyan transition-all duration-200">
                <action.icon size={18} className={action.color} />
              </div>
              <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-display tracking-widest text-muted-foreground">CONTINUE CONVERSATIONS</h2>
          <button onClick={() => navigate("/history")} className="text-[10px] text-primary hover:text-primary/80 transition-colors">View all</button>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <MessageSquare size={32} className="text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground mb-1">No conversations yet</p>
          <p className="text-xs text-muted-foreground/70 mb-4">Start a conversation right now!</p>
          <button onClick={() => navigate("/chat")}
            className="text-xs px-6 py-2.5 rounded-full bg-primary/15 border border-primary/30 text-primary hover:bg-primary/25 transition-all duration-200">
            Start Conversation
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
