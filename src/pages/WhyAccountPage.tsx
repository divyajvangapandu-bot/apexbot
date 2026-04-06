import { ArrowLeft, Brain, Save, Shield, Star, Sparkles, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const benefits = [
  {
    icon: Brain,
    title: "Enhanced AI Responses",
    description: "Signed-in users receive V10 Enhanced answers — deeper analysis, richer formatting, and more intelligent context-awareness for every question.",
  },
  {
    icon: Save,
    title: "Saved Profile & Preferences",
    description: "Your name, preferences, and purpose are remembered across sessions. No need to set things up again every time you visit.",
  },
  {
    icon: Sparkles,
    title: "No Interruptions",
    description: "Guest users see occasional sign-in suggestions. With an account, you get a seamless, uninterrupted experience from start to finish.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is protected with enterprise-grade security. Only you can access your profile and conversation history.",
  },
  {
    icon: Star,
    title: "Priority Experience",
    description: "Account holders are the first to access new features, improved models, and exclusive capabilities as ApexBot evolves.",
  },
];

const WhyAccountPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen nebula-gradient px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft size={14} /> Back
        </button>

        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 border border-primary/30 flex items-center justify-center mx-auto mb-5">
            <Zap size={28} className="text-primary" />
          </div>
          <h1 className="font-display text-3xl text-foreground mb-3">Why Create an Account?</h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
            ApexBot works great as a guest — but with an account, you unlock the full potential of V10 intelligence.
          </p>
        </div>

        <div className="space-y-4 mb-10">
          {benefits.map((benefit, i) => (
            <div key={i} className="glass-panel-strong p-5 rounded-xl animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <benefit.icon size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-sm text-foreground mb-1">{benefit.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center space-y-3">
          <button onClick={() => navigate("/join")}
            className="cyber-button px-10 py-3 text-sm">
            Create Your Account
          </button>
          <p className="text-[10px] text-muted-foreground/50 font-mono">Free forever · No credit card required</p>
        </div>
      </div>
    </div>
  );
};

export default WhyAccountPage;
