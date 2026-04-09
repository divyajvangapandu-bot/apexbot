import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import apexbotLogo from "@/assets/apexbot-logo.jpeg";

const JoinPage = () => {
  const location = useLocation();
  const onboardingData = (location.state as any)?.onboardingData;

  const [name, setName] = useState(onboardingData?.name || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp, updateProfile } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setIsLoading(true);
    const { error } = await signUp(email, password, name.trim());
    if (error) {
      toast.error(error);
      setIsLoading(false);
      return;
    }
    if (onboardingData) {
      setTimeout(async () => {
        await updateProfile({
          name: onboardingData.name,
          dob: onboardingData.dob || null,
          purpose: onboardingData.mission || "",
        });
        setIsLoading(false);
        toast.success("Account created successfully! Welcome to ApexBot.");
        navigate("/home");
      }, 1200);
    } else {
      setIsLoading(false);
      toast.success("Account created successfully!");
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen nebula-gradient flex flex-col items-center justify-center px-6">
      <div className="fixed top-4 left-4 z-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      <img src={apexbotLogo} alt="ApexBot" className="w-12 h-12 rounded-xl border border-primary/30 mb-6 object-cover" />
      <h1 className="font-display text-2xl tracking-wider text-foreground mb-1">Create Account</h1>
      <p className="text-sm text-muted-foreground mb-8">Join ApexBot to unlock enhanced intelligence</p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3 mb-6">
        <input type="text" className="cyber-input" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} autoFocus />
        <input type="email" className="cyber-input" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" className="cyber-input" placeholder="Password (min 6 characters)" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit" className="cyber-button w-full py-3 text-sm" disabled={!name.trim() || !email.trim() || !password.trim() || isLoading}>
          {isLoading ? "Creating…" : "CREATE ACCOUNT"}
        </button>
      </form>
    </div>
  );
};

export default JoinPage;
