import { useState } from "react";
import { Menu, X, Zap, LogIn, LogOut } from "lucide-react";
import BattleLog from "./BattleLog";
import ChatEngine from "./ChatEngine";

interface DashboardProps {
  userName: string;
  isSignedIn: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
}

const Dashboard = ({ userName, isSignedIn, onSignIn, onSignOut }: DashboardProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-14 border-b border-border/50 flex items-center justify-between px-4 glass-panel rounded-none border-x-0 border-t-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-primary" />
            <span className="font-display text-sm tracking-widest neon-text-cyan">APEXBOT AI</span>
            <span className="text-[10px] font-mono text-muted-foreground hidden sm:inline bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">V10</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted-foreground hidden sm:block">{userName}</span>
          <div className="w-7 h-7 rounded-md bg-primary/15 border border-primary/30 flex items-center justify-center">
            <span className="text-xs font-display text-primary">{userName[0]?.toUpperCase()}</span>
          </div>
          {isSignedIn ? (
            <button
              onClick={onSignOut}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-muted/50"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          ) : (
            <button
              onClick={onSignIn}
              className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors px-2 py-1.5 rounded-md hover:bg-primary/10 border border-primary/30"
            >
              <LogIn size={14} />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden relative">
        <aside className={`
          absolute md:relative z-10 h-full w-72 border-r border-border/50 bg-background
          transition-transform duration-300 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-0 md:border-0 md:overflow-hidden"}
        `}>
          <div className="w-72">
            <BattleLog />
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="absolute inset-0 bg-background/60 backdrop-blur-sm z-[5] md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 flex flex-col min-w-0">
          <ChatEngine userName={userName} isSignedIn={isSignedIn} onSignIn={onSignIn} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
