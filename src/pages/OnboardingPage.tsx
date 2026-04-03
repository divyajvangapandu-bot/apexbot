import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const PURPOSE_OPTIONS = [
  "Research & Learning",
  "Creative Writing & Content",
  "Coding & Development",
  "Business & Productivity",
  "Data Analysis & Insights",
  "General Q&A",
];

const OnboardingPage = () => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ name: "", dob: "", mission: "" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const navigate = useNavigate();
  const { signUp, signIn, updateProfile, user } = useAuth();

  // Steps: 0=Name, 1=DOB, 2=Purpose, 3=Auth (email/password)
  const totalSteps = 4;

  const handleNext = () => {
    if (step === 0 && !data.name.trim()) return;
    if (step === 1 && !data.dob) return;
    if (step === 2 && !data.mission) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setStep(s => s + 1);
      setIsTransitioning(false);
    }, 350);
  };

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) return;
    setIsSubmitting(true);

    if (mode === "signup") {
      const { error } = await signUp(email, password, data.name);
      if (error) {
        toast.error(error);
        setIsSubmitting(false);
        return;
      }
      // After signup, update profile with onboarding data
      // Small delay to let the trigger create the profile
      setTimeout(async () => {
        await updateProfile({ name: data.name, dob: data.dob || null, purpose: data.mission });
        setIsSubmitting(false);
        toast.success("Account created! Please check your email to verify.");
        navigate("/home");
      }, 1000);
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error);
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
      navigate("/home");
    }
  };

  const progress = ((step + 1) / totalSteps) * 100;
  const stepLabels = ["Your Name", "Date of Birth", "Your Purpose", "Create Account"];

  return (
    <div className="fixed inset-0 nebula-gradient flex items-center justify-center px-6">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, hsl(var(--cyan-glow) / 0.3), transparent 70%)", animation: "floatOrb 8s ease-in-out infinite" }}
      />

      <div className={`w-full max-w-lg transition-all duration-350 ${isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
        <div className="mb-8 space-y-2">
          <div className="flex justify-between text-xs font-mono text-muted-foreground">
            <span>Step {step + 1} of {totalSteps}</span>
            <span>{stepLabels[step]}</span>
          </div>
          <div className="h-0.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, hsl(var(--cyan-glow)), hsl(var(--purple-glow)))",
            }} />
          </div>
        </div>

        <div className="glass-panel-strong p-8 animate-fade-in-up">
          {step === 0 && (
            <>
              <h2 className="font-display text-2xl text-foreground mb-2">What's your name?</h2>
              <p className="text-muted-foreground text-sm mb-6">Let us know what to call you.</p>
              <input type="text" className="cyber-input" placeholder="Enter your name" value={data.name}
                onChange={e => setData(d => ({ ...d, name: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && handleNext()} autoFocus />
            </>
          )}
          {step === 1 && (
            <>
              <h2 className="font-display text-2xl text-foreground mb-2">When were you born?</h2>
              <p className="text-muted-foreground text-sm mb-6">Helps us personalise your experience.</p>
              <input type="date" className="cyber-input" value={data.dob}
                onChange={e => setData(d => ({ ...d, dob: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && handleNext()} autoFocus />
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="font-display text-2xl text-foreground mb-2">What will you use ApexBot for?</h2>
              <p className="text-muted-foreground text-sm mb-6">Choose your primary purpose.</p>
              <div className="grid grid-cols-1 gap-2">
                {PURPOSE_OPTIONS.map(option => (
                  <button key={option} onClick={() => setData(d => ({ ...d, mission: option }))}
                    className={`text-left px-4 py-3 rounded-lg border text-sm transition-all duration-200 ${
                      data.mission === option
                        ? "border-primary bg-primary/10 text-primary neon-border-cyan"
                        : "border-border/50 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}>{option}</button>
                ))}
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <h2 className="font-display text-2xl text-foreground mb-2">
                {mode === "signup" ? "Create Your Account" : "Welcome Back"}
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                {mode === "signup" ? "Sign up to save your profile and unlock enhanced AI." : "Log in to continue where you left off."}
              </p>
              <div className="space-y-3">
                <input type="email" className="cyber-input" placeholder="Email address" value={email}
                  onChange={e => setEmail(e.target.value)} autoFocus />
                <input type="password" className="cyber-input" placeholder="Password (min 6 characters)" value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAuth()} />
              </div>
              <button onClick={handleAuth} disabled={!email.trim() || !password.trim() || isSubmitting}
                className="cyber-button w-full mt-5 py-3 text-sm disabled:opacity-30">
                {isSubmitting ? "Please wait…" : mode === "signup" ? "CREATE ACCOUNT" : "LOG IN"}
              </button>
              <p className="text-xs text-muted-foreground text-center mt-4">
                {mode === "signup" ? (
                  <>Already have an account? <button onClick={() => setMode("login")} className="text-primary hover:text-primary/80">Log in</button></>
                ) : (
                  <>New here? <button onClick={() => setMode("signup")} className="text-primary hover:text-primary/80">Create account</button></>
                )}
              </p>
              <button onClick={() => navigate("/home")} className="text-xs text-muted-foreground/60 hover:text-muted-foreground w-full text-center mt-3 transition-colors">
                Continue as guest
              </button>
            </>
          )}

          {step < 3 && (
            <div className="flex justify-between items-center mt-8">
              {step > 0 ? (
                <button onClick={() => { setIsTransitioning(true); setTimeout(() => { setStep(s => s - 1); setIsTransitioning(false); }, 350); }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Back</button>
              ) : (
                <button onClick={() => navigate("/")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Back</button>
              )}
              <button onClick={handleNext}
                disabled={(step === 0 && !data.name.trim()) || (step === 1 && !data.dob) || (step === 2 && !data.mission)}
                className="cyber-button disabled:opacity-30 disabled:cursor-not-allowed">
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
