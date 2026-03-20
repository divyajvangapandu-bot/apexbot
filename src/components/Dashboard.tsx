import { useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import BattleLog from "./BattleLog";
import ChatEngine from "./ChatEngine";

interface DashboardProps {
  userName: string;
}

const Dashboard = ({ userName }: DashboardProps) => {
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
            <span className="font-display text-sm tracking-widest neon-text-cyan">APEXBOT</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground hidden sm:block">Agent: {userName}</span>
          <div className="w-7 h-7 rounded-md bg-primary/15 border border-primary/30 flex items-center justify-center">
            <span className="text-xs font-display text-primary">{userName[0]?.toUpperCase()}</span>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <aside className={`
          absolute md:relative z-10 h-full w-72 border-r border-border/50 bg-background
          transition-transform duration-300 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-0 md:border-0 md:overflow-hidden"}
        `}>
          <div className="w-72">
            <BattleLog />
          </div>
        </aside>

        {/* Overlay on mobile */}
        {sidebarOpen && (
          <div
            className="absolute inset-0 bg-background/60 backdrop-blur-sm z-[5] md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Chat */}
        <main className="flex-1 flex flex-col min-w-0">
          <ChatEngine userName={userName} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
