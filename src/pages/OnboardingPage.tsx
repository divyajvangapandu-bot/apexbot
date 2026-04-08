import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Zap, ArrowLeft, Check } from "lucide-react";

const PURPOSE_OPTIONS = [
  "Research & Learning",
  "Creative Writing & Content",
  "Coding & Development",
  "Business & Productivity",
  "Data Analysis & Insights",
  "General Q&A",
];

const playClick = () => {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    osc.type = "sine";
    gain.gain.value = 0.08;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.stop(ctx.currentTime + 0.12);
  } catch {}
};

const OnboardingPage = () => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ name: "", dob: "", missions: [] as string[] });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  const totalSteps = 4;

  const handleNext = () => {
    if (step === 0 && !data.name.trim()) return;
    if (step === 1 && !data.dob) return;
    if (step === 2 && data.missions.length === 0) return;
    playClick();
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(s => s + 1);
      setIsTransitioning(false);
    }, 350);
  };

  const toggleMission = (option: string) => {
    playClick();
    setData(d => ({
      ...d,
      missions: d.missions.includes(option)
        ? d.missions.filter(m => m !== option)
        : [...d.missions, option],
    }));
  };

  const handleContinueAsGuest = () => {
    playClick();
    localStorage.setItem("guest_profile", JSON.stringify({ ...data, mission: data.missions.join(", ") }));
    navigate("/home");
  };

  const goBack = () => {
    playClick();
    setIsTransitioning(true);
    setTimeout(() => { setStep(s => s - 1); setIsTransitioning(false); }, 350);
  };

  const progress = ((step + 1) / totalSteps) * 100;
  const stepLabels = ["Your Name", "Date of Birth", "Your Purpose", "Get Started"];

  return (
    <div className="fixed inset-0 nebula-gradient flex items-center justify-center px-6 overflow-hidden">
      {/* Background particles */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, hsl(var(--cyan-glow) / 0.3), transparent 70%)", animation: "floatOrb 8s ease-in-out infinite" }} />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full opacity-8"
        style={{ background: "radial-gradient(circle, hsl(var(--purple-glow) / 0.2), transparent 70%)", animation: "floatOrb 12s ease-in-out infinite reverse" }} />

      <div className={`w-full max-w-lg transition-all duration-350 ${isTransitioning ? "opacity-0 scale-95 translate-y-4" : "opacity-100 scale-100 translate-y-0"}`}>
        {/* Progress */}
        <div className="mb-8 space-y-2 animate-fade-in">
          <div className="flex justify-between text-xs font-mono text-muted-foreground">
            <span>Step {step + 1} of {totalSteps}</span>
            <span>{stepLabels[step]}</span>
          </div>
          <div className="h-0.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, hsl(var(--cyan-glow)), hsl(var(--purple-glow)))",
              boxShadow: "0 0 10px hsl(var(--cyan-glow) / 0.5)",
            }} />
          </div>
        </div>

        <div className="glass-panel-strong p-8 animate-slide-up">
          {step === 0 && (
            <div className="animate-fade-in-up">
              <h2 className="font-display text-2xl text-foreground mb-2">What's your name?</h2>
              <p className="text-muted-foreground text-sm mb-6">Let us know what to call you.</p>
              <input type="text" className="cyber-input" placeholder="Enter your name" value={data.name}
                onChange={e => setData(d => ({ ...d, name: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && handleNext()} autoFocus />
            </div>
          )}

          {step === 1 && (
            <div className="animate-fade-in-up">
              <h2 className="font-display text-2xl text-foreground mb-2">When were you born?</h2>
              <p className="text-muted-foreground text-sm mb-6">Helps us personalise your experience.</p>
              <input type="date" className="cyber-input" value={data.dob}
                onChange={e => setData(d => ({ ...d, dob: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && handleNext()} autoFocus />
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in-up">
              <h2 className="font-display text-2xl text-foreground mb-2">What will you use ApexBot for?</h2>
              <p className="text-muted-foreground text-sm mb-6">Choose one or more options.</p>
              <div className="grid grid-cols-1 gap-2 stagger-children">
                {PURPOSE_OPTIONS.map(option => {
                  const selected = data.missions.includes(option);
                  return (
                    <button key={option} onClick={() => toggleMission(option)}
                      className={`text-left px-4 py-3 rounded-lg border text-sm transition-all duration-200 flex items-center justify-between hover-bounce animate-slide-up ${
                        selected
                          ? "border-primary bg-primary/10 text-primary neon-border-cyan"
                          : "border-border/50 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}>
                      <span>{option}</span>
                      {selected && <Check size={16} className="text-primary animate-btn-tap" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in-up">
              <h2 className="font-display text-2xl text-foreground mb-3 text-center">You're all set, {data.name}!</h2>
              <p className="text-muted-foreground text-sm mb-8 text-center">How would you like to continue?</p>
              <div className="space-y-3">
                <button onClick={() => { playClick(); navigate("/join", { state: { onboardingData: { ...data, mission: data.missions.join(", ") } } }); }}
                  className="w-full group relative overflow-hidden rounded-xl border-2 border-primary/40 p-5 text-left transition-all duration-300 hover:border-primary hover:shadow-[0_0_25px_hsl(var(--cyan-glow)/0.2)] hover-bounce animate-slide-up"
                  style={{ background: "linear-gradient(135deg, hsl(var(--cyan-glow) / 0.08), hsl(var(--purple-glow) / 0.08))" }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer" />
                  <div className="relative flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center shrink-0 animate-glow-pulse">
                      <Shield size={22} className="text-primary" />
                    </div>
                    <div>
                      <span className="font-display text-base text-foreground tracking-wide">Create an Account</span>
                      <p className="text-xs text-muted-foreground mt-0.5">Unlock the full ApexBot experience</p>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); playClick(); navigate("/why-account"); }}
                    className="relative mt-3 text-[11px] text-primary hover:text-primary/80 transition-colors font-medium">
                    Why create an account?
                  </button>
                </button>

                <button onClick={handleContinueAsGuest}
                  className="w-full group relative overflow-hidden rounded-xl border border-border/50 p-5 text-left transition-all duration-300 hover:border-muted-foreground/40 hover:bg-muted/20 hover-bounce animate-slide-up"
                  style={{ animationDelay: "100ms" }}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted/30 border border-border/50 flex items-center justify-center shrink-0">
                      <Zap size={22} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                    <div>
                      <span className="font-display text-base text-foreground tracking-wide">Continue as Guest</span>
                      <p className="text-xs text-muted-foreground mt-0.5">Jump right in — no sign-up needed</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {step < 3 && (
            <div className="flex justify-between items-center mt-8">
              {step > 0 ? (
                <button onClick={goBack} className="text-sm text-muted-foreground hover:text-foreground transition-colors hover-bounce">← Back</button>
              ) : (
                <button onClick={() => { playClick(); navigate("/"); }} className="text-sm text-muted-foreground hover:text-foreground transition-colors hover-bounce">← Back</button>
              )}
              <button onClick={handleNext}
                disabled={(step === 0 && !data.name.trim()) || (step === 1 && !data.dob) || (step === 2 && data.missions.length === 0)}
                className="cyber-button disabled:opacity-30 disabled:cursor-not-allowed">
                Continue
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="mt-6">
              <button onClick={goBack} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 hover-bounce">
                <ArrowLeft size={14} /> Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
