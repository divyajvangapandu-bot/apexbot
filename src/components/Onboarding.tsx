import { useState } from "react";

interface OnboardingData {
  name: string;
  dob: string;
  mission: string;
}

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
}

const PURPOSE_OPTIONS = [
  "Research & Learning",
  "Creative Writing & Content",
  "Coding & Development",
  "Business & Productivity",
  "Data Analysis & Insights",
  "General Q&A",
];

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({ name: "", dob: "", mission: "" });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNext = () => {
    if (step === 0 && !data.name.trim()) return;
    if (step === 1 && !data.dob) return;
    if (step === 2 && !data.mission) return;

    setIsTransitioning(true);
    setTimeout(() => {
      if (step < 2) {
        setStep(s => s + 1);
      } else {
        onComplete(data);
      }
      setIsTransitioning(false);
    }, 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleNext();
    }
  };

  const progress = ((step + 1) / 3) * 100;

  return (
    <div className="fixed inset-0 nebula-gradient flex items-center justify-center overflow-hidden px-6">
      {/* Subtle background orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, hsl(var(--cyan-glow) / 0.3), transparent 70%)", animation: "floatOrb 8s ease-in-out infinite" }}
      />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, hsl(var(--purple-glow) / 0.3), transparent 70%)", animation: "floatOrb 10s ease-in-out infinite reverse" }}
      />

      <div className={`w-full max-w-lg transition-all duration-400 ${isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
        {/* Progress */}
        <div className="mb-8 space-y-2">
          <div className="flex justify-between text-xs font-mono text-muted-foreground tracking-wide">
            <span>Step {step + 1} of 3</span>
            <span>{step === 0 ? "Your Name" : step === 1 ? "Date of Birth" : "Your Purpose"}</span>
          </div>
          <div className="h-0.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, hsl(var(--cyan-glow)), hsl(var(--purple-glow)))",
                boxShadow: "0 0 10px hsl(var(--cyan-glow) / 0.5)",
              }}
            />
          </div>
        </div>

        <div className="glass-panel-strong p-8 animate-fade-in-up">
          {/* Step 0: Name */}
          {step === 0 && (
            <>
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">What's your name?</h2>
              <p className="text-muted-foreground text-sm mb-6">Let us know what to call you.</p>
              <input
                type="text"
                className="cyber-input"
                placeholder="Enter your name"
                value={data.name}
                onChange={e => setData(d => ({ ...d, name: e.target.value }))}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </>
          )}

          {/* Step 1: DOB */}
          {step === 1 && (
            <>
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">When were you born?</h2>
              <p className="text-muted-foreground text-sm mb-6">Your date of birth helps us personalise your experience.</p>
              <input
                type="date"
                className="cyber-input"
                value={data.dob}
                onChange={e => setData(d => ({ ...d, dob: e.target.value }))}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </>
          )}

          {/* Step 2: Purpose */}
          {step === 2 && (
            <>
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">What will you use Apexbot for?</h2>
              <p className="text-muted-foreground text-sm mb-6">Choose your primary purpose.</p>
              <div className="grid grid-cols-1 gap-2">
                {PURPOSE_OPTIONS.map(option => (
                  <button
                    key={option}
                    onClick={() => setData(d => ({ ...d, mission: option }))}
                    className={`text-left px-4 py-3 rounded-lg border text-sm transition-all duration-200 ${
                      data.mission === option
                        ? "border-primary bg-primary/10 text-primary neon-border-cyan"
                        : "border-border/50 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            {step > 0 ? (
              <button
                onClick={() => { setIsTransitioning(true); setTimeout(() => { setStep(s => s - 1); setIsTransitioning(false); }, 400); }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back
              </button>
            ) : <span />}
            <button
              onClick={handleNext}
              disabled={
                (step === 0 && !data.name.trim()) ||
                (step === 1 && !data.dob) ||
                (step === 2 && !data.mission)
              }
              className="cyber-button disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {step === 2 ? "Get Started" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
