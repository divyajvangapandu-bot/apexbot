import { User, Edit3, SlidersHorizontal, Bell, LogOut, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const isSignedIn = !!user;
  const userName = profile?.name || "Guest";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen pt-14 pb-20 px-4">
      <div className="max-w-lg mx-auto pt-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mb-4 animate-glow-pulse">
            <span className="font-display text-2xl text-primary">{userName[0]?.toUpperCase() || "?"}</span>
          </div>
          <h1 className="font-display text-lg tracking-wider text-foreground">{userName}</h1>
          {isSignedIn && <p className="text-xs text-primary font-mono mt-1">⚡ V10 Enhanced</p>}
          {!isSignedIn && <p className="text-xs text-muted-foreground font-mono mt-1">Guest Mode</p>}
          {profile?.purpose && <p className="text-[10px] text-muted-foreground mt-1">{profile.purpose}</p>}
        </div>

        <div className="space-y-1.5 mb-10">
          {[
            { icon: Edit3, label: "Edit Profile", action: () => {} },
            { icon: SlidersHorizontal, label: "Preferences", action: () => navigate("/settings") },
            { icon: Bell, label: "Notifications", action: () => {} },
          ].map((item) => (
            <button key={item.label} onClick={item.action}
              className="w-full flex items-center gap-3 p-4 rounded-lg glass-panel hover:neon-border-cyan transition-all duration-200 text-left">
              <item.icon size={16} className="text-primary" />
              <span className="text-sm text-foreground">{item.label}</span>
            </button>
          ))}
        </div>

        {isSignedIn ? (
          <button onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut size={16} /><span className="text-sm font-medium">Log Out</span>
          </button>
        ) : (
          <button onClick={() => navigate("/login")}
            className="w-full cyber-button flex items-center justify-center gap-2 py-4">
            <LogIn size={16} /><span>Sign In for Enhanced Mode</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
