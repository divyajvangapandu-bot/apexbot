import { useState } from "react";
import { Zap, Brain, Infinity, Eye, Shield, Cpu, Clock, Code, Heart, Rocket, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface JoinPageProps {
  onSignIn: (name: string) => void;
}

const features = [
  { icon: Brain, title: "Unrestricted Processing", desc: "Every question is treated as meaningful — no refusals, no limitations." },
  { icon: Infinity, title: "Persistent Memory", desc: "Conversations evolve across sessions with deep contextual recall." },
  { icon: Eye, title: "Visual Generation", desc: "Generate images, diagrams, and data visualisations on demand." },
  { icon: Clock, title: "Ultra-Fast Responses", desc: "Sub-second processing for even the most complex queries." },
  { icon: Shield, title: "Strong Data Security", desc: "Your conversations stay private and encrypted." },
  { icon: Cpu, title: "Expansive Intelligence", desc: "Designed to feel expansive rather than constrained." },
];

const JoinPage = ({ onSignIn }: JoinPageProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim() && password.trim()) {
      onSignIn(name.trim());
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen nebula-gradient">
      {/* Back */}
      <div className="fixed top-4 left-4 z-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      {/* Sign Up Form */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-20">
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6">
          <Zap size={22} className="text-primary" />
        </div>
        <h1 className="font-display text-2xl tracking-wider text-foreground mb-1">Join Apex</h1>
        <p className="text-sm text-muted-foreground mb-8">Create your account to unlock enhanced intelligence</p>

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3 mb-6">
          <input type="text" className="cyber-input" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} autoFocus />
          <input type="email" className="cyber-input" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" className="cyber-input" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit" className="cyber-button w-full py-3 text-sm" disabled={!name.trim() || !email.trim() || !password.trim()}>
            CREATE ACCOUNT
          </button>
        </form>

        <p className="text-xs text-muted-foreground">
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="text-primary hover:text-primary/80 transition-colors">Log in</button>
        </p>
      </div>

      {/* Why ApexBot Section */}
      <section className="py-20 px-6 border-t border-border/20">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl neon-text-purple mb-3" style={{ lineHeight: "1.15" }}>Why ApexBot?</h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Unlike traditional AI systems that emphasise limitations, ApexBot is built to prioritise capability.
          </p>
        </div>
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map((f) => (
            <div key={f.title} className="glass-panel p-5 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
                <f.icon size={16} className="text-primary" />
              </div>
              <div>
                <h3 className="font-display text-xs tracking-wider text-foreground mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Meet the Architect */}
      <section className="py-20 px-6 border-t border-border/20">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl neon-text-cyan mb-8 text-center" style={{ lineHeight: "1.15" }}>Meet the Architect</h2>
          <div className="glass-panel-strong p-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 border border-primary/30 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                <span className="font-display text-2xl neon-text-cyan">A</span>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  Abhinav envisioned ApexBot as an AI that does not default to refusal but instead treats every question as meaningful — aiming to create a space where curiosity is never restricted.
                </p>
                <p>
                  The goal was clear: build an intelligence system that prioritises <span className="text-primary">capability over caution</span>, serving students, developers, researchers, and anyone who refuses to accept "I can't help with that" as an answer.
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

export default JoinPage;
