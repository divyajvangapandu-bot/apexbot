import { useState } from "react";
import { User, Edit3, SlidersHorizontal, LogOut, LogIn, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const PURPOSE_OPTIONS = [
  "Learning & Education",
  "Work & Productivity",
  "Coding & Development",
  "Creative Writing",
  "Research & Analysis",
  "General Knowledge",
  "Fun & Entertainment",
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, profile, signOut, updateProfile } = useAuth();
  const isSignedIn = !!user;
  const userName = profile?.name || "Guest";

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile?.name || "");
  const [editPurpose, setEditPurpose] = useState(profile?.purpose || "");

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleSave = async () => {
    if (!editName.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    await updateProfile({ name: editName.trim(), purpose: editPurpose });
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  const startEditing = () => {
    setEditName(profile?.name || "");
    setEditPurpose(profile?.purpose || "");
    setIsEditing(true);
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
          {profile?.purpose && !isEditing && <p className="text-[10px] text-muted-foreground mt-1">{profile.purpose}</p>}
        </div>

        {isEditing ? (
          <div className="glass-panel rounded-xl p-5 mb-10 space-y-4 animate-fade-in">
            <h3 className="text-sm font-display tracking-wider text-foreground mb-2">Edit Profile</h3>
            <div>
              <label className="text-[11px] text-muted-foreground font-mono mb-1 block">Name</label>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full bg-background/50 border border-border/50 rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 transition-colors"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground font-mono mb-1 block">Purpose</label>
              <div className="grid grid-cols-2 gap-2">
                {PURPOSE_OPTIONS.map(p => (
                  <button
                    key={p}
                    onClick={() => setEditPurpose(p)}
                    className={`px-3 py-2 rounded-lg text-xs text-left transition-all duration-200 ${
                      editPurpose === p
                        ? "bg-primary/20 border border-primary/40 text-primary"
                        : "glass-panel hover:neon-border-cyan text-muted-foreground"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={handleSave} className="flex-1 cyber-button flex items-center justify-center gap-2 py-3">
                <Save size={14} /><span className="text-sm">Save</span>
              </button>
              <button onClick={() => setIsEditing(false)} className="px-4 py-3 rounded-lg border border-border/30 text-muted-foreground hover:text-foreground transition-colors">
                <X size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5 mb-10">
            {isSignedIn && (
              <button onClick={startEditing}
                className="w-full flex items-center gap-3 p-4 rounded-lg glass-panel hover:neon-border-cyan transition-all duration-200 text-left">
                <Edit3 size={16} className="text-primary" />
                <div>
                  <span className="text-sm text-foreground">Edit Profile</span>
                  <p className="text-[10px] text-muted-foreground">Update your name and AI purpose</p>
                </div>
              </button>
            )}
            <button onClick={() => navigate("/settings")}
              className="w-full flex items-center gap-3 p-4 rounded-lg glass-panel hover:neon-border-cyan transition-all duration-200 text-left">
              <SlidersHorizontal size={16} className="text-primary" />
              <div>
                <span className="text-sm text-foreground">Preferences</span>
                <p className="text-[10px] text-muted-foreground">Customize your experience</p>
              </div>
            </button>
          </div>
        )}

        {isSignedIn ? (
          <button onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut size={16} /><span className="text-sm font-medium">Log Out</span>
          </button>
        ) : (
          <div className="space-y-3">
            <button onClick={() => navigate("/join")}
              className="w-full cyber-button flex items-center justify-center gap-2 py-4">
              <LogIn size={16} /><span>Create an Account</span>
            </button>
            <p className="text-center text-[11px] text-muted-foreground">
              Already have an account?{" "}
              <button onClick={() => navigate("/login")} className="text-primary hover:underline">Sign In</button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
