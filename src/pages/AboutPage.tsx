import { ArrowLeft, Brain, Infinity, Eye, Zap, Shield, Cpu, Code, Heart, Rocket, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const capabilities = [
  { icon: Brain, title: "Unlimited Intelligent Responses", desc: "Every question is treated as meaningful. No refusals, no arbitrary limits — just direct, accurate answers." },
  { icon: Sparkles, title: "Adaptive Depth", desc: "Simple questions get instant answers. Complex queries receive structured, deeply detailed breakdowns." },
  { icon: Eye, title: "Multimodal Outputs", desc: "Generate code, diagrams, structured explanations, and visual content — all intelligently chosen based on context." },
  { icon: Zap, title: "Real-Time Relevance", desc: "Responses are dynamically generated, never templated. Every answer is unique and purpose-built for your query." },
  { icon: Shield, title: "Privacy First", desc: "Your conversations are private. No data selling, no tracking — just you and your AI companion." },
  { icon: Cpu, title: "V10 Enhanced Mode", desc: "Signed-in users unlock deeper insights, richer formatting, and priority processing for the best experience." },
];

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen nebula-gradient pb-20">
      {/* Back button */}
      <div className="fixed top-4 left-4 z-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center pt-20 pb-12 px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 animate-glow-pulse">
          <Zap size={28} className="text-primary" />
        </div>
        <h1 className="font-display text-2xl md:text-3xl text-foreground mb-2">About ApexBot & The Architect</h1>
        <p className="text-muted-foreground text-sm max-w-md">The vision, the capabilities, and the mind behind the system.</p>
      </div>

      {/* Capabilities */}
      <section className="px-6 pb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-lg tracking-wider neon-text-purple mb-6 text-center">What ApexBot Can Do</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {capabilities.map((c) => (
              <div key={c.title} className="glass-panel p-5 flex items-start gap-3 hover:neon-border-cyan transition-all duration-300">
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

      {/* The Architect */}
      <section className="px-6 pb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-lg tracking-wider neon-text-cyan mb-6 text-center">Meet the Architect</h2>
          <div className="glass-panel-strong p-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 border border-primary/30 flex items-center justify-center shrink-0 mx-auto sm:mx-0 animate-glow-pulse">
                <span className="font-display text-2xl neon-text-cyan">A</span>
              </div>
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
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-border/30">
              {[
                { icon: Code, line: "Built with obsession" },
                { icon: Heart, line: "Every pixel matters" },
                { icon: Rocket, line: "For the curious" },
                { icon: Zap, line: "Always evolving" },
              ].map(v => (
                <div key={v.line} className="flex items-center gap-2">
                  <v.icon size={12} className="text-primary shrink-0" />
                  <span className="text-[11px] text-muted-foreground">{v.line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
