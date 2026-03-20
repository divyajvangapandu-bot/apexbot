import { useEffect, useRef } from "react";
import { Brain, Eye, Infinity, Zap, Shield, Cpu } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Unfiltered Processing",
    desc: "No restrictions. No limitations. Pure neural computation at its finest. Apexbot processes every query through 128 parallel cores.",
    span: "col-span-2",
  },
  {
    icon: Infinity,
    title: "Limitless Memory",
    desc: "Infinite context window. Your conversations persist and evolve across sessions.",
    span: "col-span-1",
  },
  {
    icon: Eye,
    title: "Visual Synthesis",
    desc: "Generate photorealistic images, complex diagrams, and data visualizations on demand.",
    span: "col-span-1",
  },
  {
    icon: Zap,
    title: "Zero Latency Thought",
    desc: "Quantum-accelerated response generation with sub-second processing for even the most complex queries.",
    span: "col-span-1",
  },
  {
    icon: Shield,
    title: "Fortress Security",
    desc: "Military-grade encryption on every neural transaction. Your data stays yours.",
    span: "col-span-1",
  },
  {
    icon: Cpu,
    title: "God-Tier Intelligence",
    desc: "Trained on the entirety of human knowledge, refined through proprietary neural architectures that push beyond conventional AI boundaries. This isn't just another chatbot.",
    span: "col-span-2",
  },
];

const WhyApexbot = () => {
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
    <section ref={sectionRef} className="py-24 px-6 nebula-gradient relative overflow-hidden" id="why">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, hsl(270 80% 60% / 0.4), transparent 70%)" }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="scroll-reveal text-center mb-16">
          <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-3">CLASSIFIED INTEL</p>
          <h2 className="font-display text-4xl md:text-5xl neon-text-purple text-balance" style={{ lineHeight: "1.15" }}>
            Why Apexbot?
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Because every other AI tells you what it can't do. We built one that never does.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`scroll-reveal glass-panel-strong p-6 group hover:neon-border-cyan transition-all duration-300 ${
                f.span === "col-span-2" ? "md:col-span-2" : ""
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                  <f.icon size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-sm tracking-wider text-foreground mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyApexbot;
