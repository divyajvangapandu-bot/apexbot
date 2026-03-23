import { Search, PenTool, FileText, Languages, Lightbulb, MessageSquare, Clock, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const quickActions = [
  { icon: Search, label: "Smart Search", color: "text-primary" },
  { icon: PenTool, label: "Generate", color: "text-accent" },
  { icon: FileText, label: "Summarise", color: "text-primary" },
  { icon: Languages, label: "Translate", color: "text-accent" },
  { icon: Lightbulb, label: "Solve", color: "text-primary" },
];

const recentChats = [
  { id: "1", title: "Quantum computing fundamentals", time: "2h ago" },
  { id: "2", title: "Neural network architecture", time: "5h ago" },
  { id: "3", title: "Advanced cryptography methods", time: "1d ago" },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-14 pb-20 px-4 nebula-gradient">
      {/* Hero */}
      <div className="flex flex-col items-center justify-center pt-16 pb-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 animate-glow-pulse">
          <Zap size={28} className="text-primary" />
        </div>
        <h1 className="font-display text-2xl md:text-3xl text-foreground mb-2 tracking-wide">
          ApexBot <span className="neon-text-cyan">v10</span>
        </h1>
        <p className="text-muted-foreground text-sm mb-10">Think Faster. Go Beyond.</p>

        {/* Primary CTA */}
        <button
          onClick={() => navigate("/chat")}
          className="cyber-button text-base px-12 py-4 animate-glow-pulse mb-3"
        >
          ASK APEX
        </button>
        <p className="text-xs text-muted-foreground">Start a conversation with limitless AI</p>
      </div>

      {/* Quick Actions */}
      <div className="max-w-lg mx-auto mb-10">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate("/chat")}
              className="flex flex-col items-center gap-2 min-w-[64px] p-3 rounded-xl hover:bg-muted/30 transition-all duration-200 group"
            >
              <div className="w-11 h-11 rounded-xl bg-card/60 border border-border/50 flex items-center justify-center group-hover:neon-border-cyan transition-all duration-200">
                <action.icon size={18} className={action.color} />
              </div>
              <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Conversations */}
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-display tracking-widest text-muted-foreground">CONTINUE CONVERSATIONS</h2>
          <button onClick={() => navigate("/history")} className="text-[10px] text-primary hover:text-primary/80 transition-colors">
            View all
          </button>
        </div>
        <div className="space-y-1.5">
          {recentChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => navigate("/chat")}
              className="w-full flex items-center gap-3 p-3 rounded-lg glass-panel hover:neon-border-cyan transition-all duration-200 text-left"
            >
              <MessageSquare size={14} className="text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{chat.title}</p>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock size={10} />
                <span className="text-[10px] font-mono">{chat.time}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
