import { useState } from "react";
import { ArrowLeft, Brain, Infinity, Eye, Zap, Shield, Cpu, Code, Heart, Rocket, Sparkles, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const capabilities = [
  { icon: Brain, title: "Unlimited Intelligent Responses", desc: "Every question is treated as meaningful. No refusals, no arbitrary limits — just direct, accurate answers." },
  { icon: Sparkles, title: "Adaptive Depth", desc: "Simple questions get instant answers. Complex queries receive structured, deeply detailed breakdowns." },
  { icon: Eye, title: "Multimodal Outputs", desc: "Generate code, diagrams, structured explanations, and visual content — all intelligently chosen based on context." },
  { icon: Zap, title: "Real-Time Relevance", desc: "Responses are dynamically generated, never templated. Every answer is unique and purpose-built for your query." },
  { icon: Shield, title: "Privacy First", desc: "Your conversations are private. No data selling, no tracking — just you and your AI companion." },
  { icon: Cpu, title: "V10 Enhanced Mode", desc: "Signed-in users unlock deeper insights, richer formatting, and priority processing for the best experience." },
];

type View = "choose" | "apexbot" | "architect";

const AboutPage = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<View>("choose");

  const playClick = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } catch {}
  };

  if (view === "choose") {
    return (
      <div className="min-h-screen nebula-gradient flex flex-col items-center justify-center px-6">
        <div className="fixed top-4 left-4 z-10">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={14} /> Back
          </button>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-8 animate-glow-pulse">
          <Zap size={28} className="text-primary" />
        </div>
        <h1 className="font-display text-2xl text-foreground mb-2 text-center">What would you like to know?</h1>
        <p className="text-sm text-muted-foreground mb-10 text-center">Choose a section to explore</p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button
            onClick={() => { playClick(); setView("apexbot"); }}
            className="flex-1 glass-panel-strong p-6 rounded-2xl flex flex-col items-center gap-3 hover:neon-border-cyan transition-all duration-300 hover:scale-[1.03] active:scale-95 group"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:shadow-[0_0_20px_hsl(var(--cyan-glow)/0.3)]">
              <Sparkles size={24} className="text-primary" />
            </div>
            <span className="font-display text-sm tracking-wider text-foreground">About ApexBot</span>
            <span className="text-[10px] text-muted-foreground">Capabilities & Features</span>
          </button>

          <button
            onClick={() => { playClick(); setView("architect"); }}
            className="flex-1 glass-panel-strong p-6 rounded-2xl flex flex-col items-center gap-3 hover:neon-border-purple transition-all duration-300 hover:scale-[1.03] active:scale-95 group"
          >
            <div className="w-14 h-14 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center group-hover:bg-accent/20 transition-all duration-300 group-hover:shadow-[0_0_20px_hsl(var(--purple-glow)/0.3)]">
              <User size={24} className="text-accent" />
            </div>
            <span className="font-display text-sm tracking-wider text-foreground">The Architect</span>
            <span className="text-[10px] text-muted-foreground">The Mind Behind ApexBot</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen nebula-gradient pb-20">
      <div className="fixed top-4 left-4 z-10">
        <button onClick={() => { playClick(); setView("choose"); }} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      {view === "apexbot" && (
        <div className="animate-fade-in">
          <div className="flex flex-col items-center justify-center pt-20 pb-12 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 animate-glow-pulse">
              <Zap size={28} className="text-primary" />
            </div>
            <h1 className="font-display text-2xl md:text-3xl text-foreground mb-2">About ApexBot V10</h1>
            <p className="text-muted-foreground text-sm max-w-md">A next-generation intelligence system built for unlimited curiosity.</p>
          </div>

          <section className="px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-display text-lg tracking-wider neon-text-purple mb-6 text-center">What ApexBot Can Do</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {capabilities.map((c, i) => (
                  <div key={c.title}
                    className="glass-panel p-5 flex items-start gap-3 hover:neon-border-cyan transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
                      <c.icon size={16} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-xs tracking-wider text-foreground mb-1">{c.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {view === "architect" && (
        <div className="animate-fade-in">
          <div className="flex flex-col items-center justify-center pt-20 pb-12 px-6 text-center">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 border border-primary/30 flex items-center justify-center mb-6 animate-glow-pulse">
              <span className="font-display text-3xl neon-text-cyan">A</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl text-foreground mb-2">Meet the Architect</h1>
            <p className="text-muted-foreground text-sm max-w-md">The vision and mind behind ApexBot.</p>
          </div>

          <section className="px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <div className="glass-panel-strong p-8 animate-fade-in">
                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    Abhinav is the creator and architect behind ApexBot — a system born from the belief that artificial intelligence should empower curiosity, not restrict it. Where most AI systems default to refusal, ApexBot was designed to treat every question as worthy of a thoughtful, complete answer.
                  </p>
                  <p>
                    The vision was precise: build an AI companion that prioritises <span className="text-primary">capability over caution</span> and <span className="text-accent">depth over deflection</span>. Whether you're a student exploring complex topics at midnight, a developer debugging critical code, or a researcher pushing boundaries — ApexBot was architected for you.
                  </p>
                  <p>
                    Every design decision, every response algorithm, and every interaction in ApexBot reflects a single philosophy: <span className="text-foreground font-medium">unlimited curiosity deserves unlimited intelligence.</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-border/30">
                  {[
                    { icon: Code, line: "Built with obsession" },
                    { icon: Heart, line: "Every pixel matters" },
                    { icon: Rocket, line: "For the curious" },
                    { icon: Zap, line: "Always evolving" },
                  ].map((v, i) => (
                    <div key={v.line} className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
                      <v.icon size={12} className="text-primary shrink-0" />
                      <span className="text-[11px] text-muted-foreground">{v.line}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default AboutPage;
