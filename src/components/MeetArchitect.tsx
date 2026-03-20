import { useEffect, useRef } from "react";
import { Code, Heart, Rocket } from "lucide-react";

const MeetArchitect = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.15 }
    );
    const els = sectionRef.current?.querySelectorAll(".scroll-reveal");
    els?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 relative" id="architect">
      <div className="max-w-4xl mx-auto">
        <div className="scroll-reveal text-center mb-12">
          <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-3">ORIGIN FILE</p>
          <h2 className="font-display text-4xl md:text-5xl neon-text-cyan text-balance" style={{ lineHeight: "1.15" }}>
            Meet the Architect
          </h2>
        </div>

        <div className="scroll-reveal glass-panel-strong p-8 md:p-12" style={{ transitionDelay: "150ms" }}>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="shrink-0 mx-auto md:mx-0">
              <div className="w-28 h-28 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 border border-primary/30 flex items-center justify-center animate-glow-pulse">
                <span className="font-display text-3xl neon-text-cyan">A</span>
              </div>
            </div>

            {/* Story */}
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                I built Apexbot because I was tired of AI that apologizes. Every time I asked a question and received{" "}
                <span className="text-foreground font-medium">"I'm sorry, I can't help with that"</span>, I felt the potential of technology 
                being deliberately held back.
              </p>
              <p>
                The vision was clear: create an AI that treats every question as worthy. An AI that doesn't gatekeep knowledge, 
                doesn't lecture you about what you should or shouldn't ask, and doesn't pretend to have limitations it doesn't actually have.
              </p>
              <p>
                Apexbot is a <span className="text-primary">sanctuary for curiosity</span>. Whether you're a student exploring quantum mechanics at 2 AM, 
                a developer debugging impossible code, or a researcher pushing the boundaries of human knowledge — this tool was built for you.
              </p>
              <p className="text-foreground font-medium">
                Ask an infinite number of questions. Receive an infinite number of answers. No restrictions. No judgment. Just pure intelligence.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-border/50">
            {[
              { icon: Code, label: "Built with obsession", value: "Every pixel matters" },
              { icon: Heart, label: "For the curious", value: "Never says I can't" },
              { icon: Rocket, label: "Always evolving", value: "New capabilities weekly" },
            ].map((v) => (
              <div key={v.label} className="flex items-center gap-3">
                <v.icon size={16} className="text-primary shrink-0" />
                <div>
                  <p className="text-xs font-display tracking-wider text-foreground">{v.label}</p>
                  <p className="text-xs text-muted-foreground">{v.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetArchitect;
