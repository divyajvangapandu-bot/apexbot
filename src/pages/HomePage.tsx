import { useState, useEffect } from "react";
import { Search, PenTool, FileText, Languages, Lightbulb, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import apexbotLogo from "@/assets/apexbot-logo.jpeg";

const quickActions = [
  { icon: Search, label: "Smart Search", color: "text-primary" },
  { icon: PenTool, label: "Generate", color: "text-accent" },
  { icon: FileText, label: "Summarise", color: "text-primary" },
  { icon: Languages, label: "Translate", color: "text-accent" },
  { icon: Lightbulb, label: "Solve", color: "text-primary" },
];

interface ConvoSummary { id: string; title: string; updated_at: string; }

const playClick = () => {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = 600; osc.type = "sine"; gain.gain.value = 0.06;
    osc.start(); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.stop(ctx.currentTime + 0.1);
  } catch {}
};

const HomePage = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const isSignedIn = !!user;
  const [conversations, setConversations] = useState<ConvoSummary[]>([]);

  useEffect(() => {
    if (!isSignedIn || !user) return;
    supabase.from("conversations").select("id, title, updated_at").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(5)
      .then(({ data }) => { if (data) setConversations(data as ConvoSummary[]); });
  }, [isSignedIn, user]);

  const guestName = (() => { try { return JSON.parse(localStorage.getItem("guest_profile") || "{}")?.name; } catch { return null; } })();
  const displayName = profile?.name || guestName;

  return (
    <div className="min-h-screen pt-14 pb-20 px-4 nebula-gradient animate-page-enter">
      <div className="flex flex-col items-center justify-center pt-16 pb-12 text-center">
        <img src={apexbotLogo} alt="ApexBot" className="w-16 h-16 rounded-2xl border border-primary/30 mb-6 animate-glow-pulse object-cover" />
        <h1 className="font-display text-2xl md:text-3xl text-foreground mb-2 tracking-wide animate-fade-in-up">
          ApexBot <span className="neon-text-cyan">v10</span>
        </h1>
        <p className="text-muted-foreground text-sm mb-1">Think Faster. Go Beyond.</p>
        {displayName && <p className="text-xs text-primary/60 font-mono mb-8 animate-fade-in">Welcome back, {displayName}</p>}
        {!displayName && <div className="mb-8" />}

        <button onClick={() => { playClick(); navigate("/chat"); }} className="cyber-button text-base px-12 py-4 animate-glow-pulse hover-bounce mb-3">
          ASK APEX
        </button>
        <p className="text-xs text-muted-foreground">Start a conversation with limitless AI</p>
      </div>

      <div className="max-w-lg mx-auto mb-10">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 stagger-children">
          {quickActions.map((action) => (
            <button key={action.label} onClick={() => { playClick(); navigate("/chat"); }}
              className="flex flex-col items-center gap-2 min-w-[64px] p-3 rounded-xl hover:bg-muted/30 transition-all duration-200 group hover-bounce animate-slide-up active:scale-95">
              <div className="w-11 h-11 rounded-xl bg-card/60 border border-border/50 flex items-center justify-center group-hover:neon-border-cyan transition-all duration-200">
                <action.icon size={18} className={action.color} />
              </div>
              <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-lg mx-auto animate-fade-in">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-display tracking-widest text-muted-foreground">CONTINUE CONVERSATIONS</h2>
          <button onClick={() => { playClick(); navigate("/history"); }} className="text-[10px] text-primary hover:text-primary/80 transition-colors">View all</button>
        </div>

        {conversations.length > 0 ? (
          <div className="space-y-2 stagger-children">
            {conversations.map(c => (
              <button key={c.id} onClick={() => { playClick(); navigate("/chat"); }}
                className="w-full text-left p-3 rounded-lg glass-panel hover:neon-border-cyan transition-all duration-200 hover-bounce animate-slide-up active:scale-[0.98]">
                <p className="text-sm text-foreground truncate">{c.title}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(c.updated_at).toLocaleDateString()}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in-up">
            <MessageSquare size={32} className="text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground mb-1">No conversations yet</p>
            <p className="text-xs text-muted-foreground/70 mb-4">Start a conversation right now!</p>
            <button onClick={() => { playClick(); navigate("/chat"); }}
              className="text-xs px-6 py-2.5 rounded-full bg-primary/15 border border-primary/30 text-primary hover:bg-primary/25 transition-all duration-200 hover-bounce active:scale-95">
              Start Conversation
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
