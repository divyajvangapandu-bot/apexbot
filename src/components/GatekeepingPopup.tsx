import { Sparkles, X, Rocket, Star } from "lucide-react";

interface GatekeepingPopupProps {
  onClose: () => void;
  onSignIn: () => void;
}

const GatekeepingPopup = ({ onClose, onSignIn }: GatekeepingPopupProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 w-full max-w-sm mx-6 rounded-2xl overflow-hidden animate-fade-in-up">
        {/* Gradient top accent */}
        <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />

        <div className="bg-card border border-border/50 p-7 text-center">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <X size={16} />
          </button>

          {/* Icon cluster */}
          <div className="flex justify-center items-center gap-2 mb-5">
            <Star size={18} className="text-accent animate-pulse" />
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center">
              <Sparkles size={26} className="text-primary" />
            </div>
            <Rocket size={18} className="text-primary animate-pulse" />
          </div>

          <h2 className="font-display text-xl text-foreground mb-2">
            Want Legendary Answers?
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-5">
            Sign in to unlock <strong className="text-primary">V10 Enhanced Mode</strong> — deeper insights, richer formatting, and intelligent analysis powered by next-gen AI.
          </p>

          <button
            onClick={onSignIn}
            className="w-full py-3 rounded-lg text-sm font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-opacity mb-3"
          >
            Sign In for Enhanced Answers
          </button>
          <button
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            No thanks, I'll continue as guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default GatekeepingPopup;
