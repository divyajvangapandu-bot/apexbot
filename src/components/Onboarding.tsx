import { useState, useEffect, useCallback } from "react";

interface OnboardingData {
  name: string;
  dob: string;
  mission: string;
}

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
}

const STEPS = [
  { key: "name", label: "IDENTITY VERIFICATION", prompt: "What is your callsign, Agent?", placeholder: "Enter your name...", type: "text" },
  { key: "dob", label: "TEMPORAL COORDINATES", prompt: "When did you enter this timeline?", placeholder: "", type: "date" },
  { key: "mission", label: "MISSION DIRECTIVE", prompt: "What is your primary AI mission?", placeholder: "Describe your quest...", type: "textarea" },
] as const;

const HackerText = ({ text, isActive }: { text: string; isActive: boolean }) => {
  const [display, setDisplay] = useState("");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

  useEffect(() => {
    if (!isActive) return;
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(
        text.split("").map((char, i) => {
          if (i < iteration) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );
      iteration += 1 / 2;
      if (iteration >= text.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [text, isActive]);

  return <span>{display || text}</span>;
};

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(-1); // -1 = boot sequence
  const [data, setData] = useState<OnboardingData>({ name: "", dob: "", mission: "" });
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const bootSequence = [
    "> Initializing Apexbot Neural Core...",
    "> Loading quantum processing modules...",
    "> Establishing secure neural link...",
    "> Calibrating visual synthesis engine...",
    "> All systems operational.",
    "> IDENTITY CHECK REQUIRED.",
  ];

  useEffect(() => {
    if (step !== -1) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootSequence.length) {
        const line = bootSequence[i];
        if (line) {
          setBootLines(prev => [...prev, line]);
        }
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsTransitioning(true);
          setTimeout(() => {
            setStep(0);
            setIsTransitioning(false);
          }, 500);
        }, 800);
      }
    }, 400);
    return () => clearInterval(interval);
  }, [step]);

  const handleNext = useCallback(() => {
    const currentKey = STEPS[step]?.key;
    if (currentKey && !data[currentKey as keyof OnboardingData]) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      if (step < STEPS.length - 1) {
        setStep(s => s + 1);
      } else {
        onComplete(data);
      }
      setIsTransitioning(false);
    }, 500);
  }, [step, data, onComplete]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  };

  const currentStep = STEPS[step];
  const progress = step >= 0 ? ((step + 1) / STEPS.length) * 100 : 0;

  return (
    <div className="fixed inset-0 nebula-gradient flex items-center justify-center overflow-hidden scanline-overlay">
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, hsl(185 100% 50% / 0.3), transparent 70%)",
          animation: "floatOrb 8s ease-in-out infinite",
        }}
      />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, hsl(270 80% 60% / 0.3), transparent 70%)",
          animation: "floatOrb 10s ease-in-out infinite reverse",
        }}
      />

      <div className={`w-full max-w-lg px-6 transition-all duration-500 ${isTransitioning ? "opacity-0 scale-95 blur-sm" : "opacity-100 scale-100 blur-0"}`}>
        
        {/* Boot sequence */}
        {step === -1 && (
          <div className="glass-panel p-8">
            <h2 className="font-display text-xl neon-text-cyan mb-6 tracking-widest">APEXBOT v1.0</h2>
            <div className="space-y-2 font-mono text-sm">
              {bootLines.map((line, i) => (
                <div key={i} className="animate-fade-in-up text-muted-foreground" style={{ animationDelay: `${i * 0.05}s` }}>
                  {line.includes("REQUIRED") ? (
                    <span className="neon-text-cyan font-bold">{line}</span>
                  ) : line.includes("operational") ? (
                    <span className="text-green-400">{line}</span>
                  ) : (
                    line
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Onboarding steps */}
        {step >= 0 && currentStep && (
          <div className="space-y-8">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between font-mono text-xs text-muted-foreground tracking-widest">
                <span>STEP {step + 1}/{STEPS.length}</span>
                <span>{currentStep.label}</span>
              </div>
              <div className="h-0.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, hsl(185 100% 50%), hsl(270 80% 60%))",
                    boxShadow: "0 0 10px hsl(185 100% 50% / 0.5)",
                  }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="glass-panel-strong p-8 animate-fade-in-up">
              <h2 className="font-display text-2xl md:text-3xl animate-pulse-neon mb-2 leading-tight" style={{ lineHeight: "1.2" }}>
                <HackerText text={currentStep.prompt} isActive={!isTransitioning} />
              </h2>
              <p className="text-muted-foreground text-sm font-mono mb-8 tracking-wide">
                {currentStep.label}
              </p>

              {currentStep.type === "textarea" ? (
                <textarea
                  className="cyber-input min-h-[120px] resize-none"
                  placeholder={currentStep.placeholder}
                  value={data[currentStep.key as keyof OnboardingData]}
                  onChange={e => setData(d => ({ ...d, [currentStep.key]: e.target.value }))}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
              ) : (
                <input
                  type={currentStep.type}
                  className="cyber-input"
                  placeholder={currentStep.placeholder}
                  value={data[currentStep.key as keyof OnboardingData]}
                  onChange={e => setData(d => ({ ...d, [currentStep.key]: e.target.value }))}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
              )}

              <div className="flex justify-between items-center mt-6">
                <span className="text-xs font-mono text-muted-foreground">
                  Press Enter to continue
                </span>
                <button
                  onClick={handleNext}
                  disabled={!data[currentStep.key as keyof OnboardingData]}
                  className="cyber-button disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {step === STEPS.length - 1 ? "INITIALIZE" : "NEXT →"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
