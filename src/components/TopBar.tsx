import { useState } from "react";
import { Zap, Settings, LogIn, LogOut, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import SignOutConfirmDialog from "./SignOutConfirmDialog";

const TopBar = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    localStorage.removeItem("guest_profile");
    setShowSignOutConfirm(false);
    navigate("/");
  };

  const displayName = profile?.name || user?.email?.split("@")[0] || "Guest";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 glass-panel-strong rounded-none border-x-0 border-t-0">
        <div className="flex items-center justify-between h-14 px-4 max-w-5xl mx-auto">
          <button onClick={() => navigate("/home")} className="flex items-center gap-2">
            <Zap size={18} className="text-primary" />
            <span className="font-display text-sm tracking-widest neon-text-cyan">APEXBOT</span>
            <span className="text-[10px] font-mono text-muted-foreground bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">V10</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => navigate("/about")}
              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-muted/50"
              title="About ApexBot & The Architect"
            >
              <Info size={14} />
              <span className="hidden sm:inline">About</span>
            </button>

            {user ? (
              <>
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-muted/50"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                    <span className="text-[10px] font-display text-primary">{displayName[0]?.toUpperCase()}</span>
                  </div>
                  <span className="hidden sm:inline">{displayName}</span>
                </button>
                <button
                  onClick={() => setShowSignOutConfirm(true)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-muted/50"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/join")}
                className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors px-3 py-1.5 rounded-md hover:bg-primary/10 border border-primary/30"
              >
                <LogIn size={14} />
                <span>Create Account</span>
              </button>
            )}
            <button
              onClick={() => navigate("/settings")}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <Settings size={16} />
            </button>
          </div>
        </div>
      </header>

      <SignOutConfirmDialog
        open={showSignOutConfirm}
        onCancel={() => setShowSignOutConfirm(false)}
        onConfirm={handleSignOut}
      />
    </>
  );
};

export default TopBar;
