import { Home, MessageSquare, Wrench, Clock, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/chat", icon: MessageSquare, label: "Chat" },
  { path: "/tools", icon: Wrench, label: "Tools" },
  { path: "/history", icon: Clock, label: "History" },
  { path: "/profile", icon: User, label: "Profile" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide on auth pages
  if (["/join", "/login", "/onboarding"].includes(location.pathname)) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-panel-strong rounded-none border-x-0 border-b-0">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon size={20} className={isActive ? "drop-shadow-[0_0_6px_hsl(var(--cyan-glow)/0.6)]" : ""} />
              <span className={`text-[10px] font-medium tracking-wide ${isActive ? "text-primary" : ""}`}>
                {tab.label}
              </span>
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
