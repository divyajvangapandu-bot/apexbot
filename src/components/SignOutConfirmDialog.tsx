import { AlertTriangle, X } from "lucide-react";

interface SignOutConfirmDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const SignOutConfirmDialog = ({ open, onCancel, onConfirm }: SignOutConfirmDialogProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-md" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm mx-6 rounded-2xl overflow-hidden animate-fade-in-up">
        <div className="h-1 bg-gradient-to-r from-destructive/80 via-accent to-destructive/80" />
        <div className="bg-card border border-border/50 p-7 text-center">
          <button onClick={onCancel} className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
            <X size={16} />
          </button>

          <div className="w-14 h-14 rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center mx-auto mb-5">
            <AlertTriangle size={24} className="text-destructive" />
          </div>

          <h2 className="font-display text-lg text-foreground mb-2">Remove Account from ApexBot?</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            Removing your account will end your current session and delete your saved profile from this device. You'll need to create a new account to access your enhanced experience again.
          </p>

          <div className="space-y-2.5">
            <button
              onClick={onConfirm}
              className="w-full py-3 rounded-lg text-sm font-semibold bg-destructive/90 text-destructive-foreground hover:bg-destructive transition-colors"
            >
              Yes, Remove My Account
            </button>
            <button
              onClick={onCancel}
              className="w-full py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignOutConfirmDialog;
