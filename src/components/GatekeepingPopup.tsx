import { Zap, X } from "lucide-react";

interface GatekeepingPopupProps {
  onClose: () => void;
  onSignIn: () => void;
}

const GatekeepingPopup = ({ onClose, onSignIn }: GatekeepingPopupProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md mx-6 glass-panel-strong p-8 text-center animate-fade-in-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <X size={16} />
        </button>

        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Zap size={28} className="text-primary" />
          </div>
        </div>

        <h2 className="font-display text-2xl md:text-3xl text-foreground mb-3" style={{ lineHeight: "1.2" }}>
          Unlock Enhanced Responses
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
          You're doing great! Sign in to upgrade to <strong className="text-primary">V10 Enhanced Mode</strong> — get longer, deeper, and more structured answers with advanced reasoning and richer content.
        </p>

        <button onClick={onSignIn} className="cyber-button w-full py-3 text-sm mb-3 animate-glow-pulse">
          Sign In for Enhanced Answers
        </button>
        <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          No thanks, continue as guest
        </button>
      </div>
    </div>
  );
};

export default GatekeepingPopup;
