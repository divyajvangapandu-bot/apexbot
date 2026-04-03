import { useState } from "react";
import { Zap, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setIsLoading(true);
    const { error } = await signIn(email, password);
    setIsLoading(false);
    if (error) {
      toast.error(error);
      return;
    }
    navigate("/home");
  };

  return (
    <div className="min-h-screen nebula-gradient flex flex-col items-center justify-center px-6">
      <div className="fixed top-4 left-4 z-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6">
        <Zap size={22} className="text-primary" />
      </div>
      <h1 className="font-display text-2xl tracking-wider text-foreground mb-1">Log In</h1>
      <p className="text-sm text-muted-foreground mb-8">Welcome back to ApexBot</p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3 mb-6">
        <input type="email" className="cyber-input" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} autoFocus />
        <input type="password" className="cyber-input" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit" className="cyber-button w-full py-3 text-sm" disabled={!email.trim() || !password.trim() || isLoading}>
          {isLoading ? "Logging in…" : "LOG IN"}
        </button>
      </form>

      <p className="text-xs text-muted-foreground">
        New to ApexBot?{" "}
        <button onClick={() => navigate("/join")} className="text-primary hover:text-primary/80 transition-colors">Create account</button>
      </p>
    </div>
  );
};

export default LoginPage;
