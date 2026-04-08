import { Home, MessageSquare, Clock, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { path: "/home", icon: Home, label: "Home" },
  { path: "/chat", icon: MessageSquare, label: "Chat" },
  { path: "/history", icon: Clock, label: "History" },
  { path: "/profile", icon: User, label: "Profile" },
];

const playClick = () => {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = 500; osc.type = "sine"; gain.gain.value = 0.04;
    osc.start(); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    osc.stop(ctx.currentTime + 0.08);
  } catch {}
};

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-panel-strong rounded-none border-x-0 border-b-0">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button key={tab.path} onClick={() => { playClick(); navigate(tab.path); }}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all duration-200 active:scale-90 ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}>
              <tab.icon size={20} className={`transition-transform ${isActive ? "drop-shadow-[0_0_6px_hsl(var(--cyan-glow)/0.6)] scale-110" : "hover:scale-110"}`} />
              <span className={`text-[10px] font-medium tracking-wide ${isActive ? "text-primary" : ""}`}>{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-1 w-6 h-0.5 rounded-full bg-primary"
                  style={{ boxShadow: "0 0 8px hsl(var(--cyan-glow) / 0.6)" }} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
