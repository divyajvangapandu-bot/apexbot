import { Zap } from "lucide-react";

interface GatekeepingPopupProps {
  onClose: () => void;
  onSignIn: () => void;
}

const GatekeepingPopup = ({ onClose, onSignIn }: GatekeepingPopupProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred background overlay */}
      <div className="absolute inset-0 bg-background/70 backdrop-blur-md" onClick={onClose} />

      {/* Popup card */}
      <div className="relative z-10 w-full max-w-md mx-6 glass-panel-strong p-8 text-center animate-fade-in-up">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Zap size={28} className="text-primary" />
          </div>
        </div>

        <h2 className="font-display text-2xl md:text-3xl text-foreground mb-3" style={{ lineHeight: "1.2" }}>
          Want more from Apexbot?
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
          You've used your free questions. Sign in to unlock unlimited access to Apexbot AI Assistant and keep the conversation going.
        </p>

        <button onClick={onSignIn} className="cyber-button w-full py-3 text-sm mb-3 animate-glow-pulse">
          Sign In to Continue
        </button>
        <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          Maybe later
        </button>
      </div>
    </div>
  );
};

export default GatekeepingPopup;
