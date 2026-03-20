import { Clock, MessageSquare, Trash2 } from "lucide-react";
import { useState } from "react";

interface SearchEntry {
  id: string;
  query: string;
  timestamp: Date;
}

const MOCK_HISTORY: SearchEntry[] = [
  { id: "1", query: "Quantum computing fundamentals", timestamp: new Date(Date.now() - 3600000) },
  { id: "2", query: "Neural network architecture patterns", timestamp: new Date(Date.now() - 7200000) },
  { id: "3", query: "Advanced cryptography methods", timestamp: new Date(Date.now() - 86400000) },
  { id: "4", query: "Space-time continuum theories", timestamp: new Date(Date.now() - 172800000) },
];

const BattleLog = () => {
  const [entries, setEntries] = useState<SearchEntry[]>(MOCK_HISTORY);

  const removeEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const timeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border/50">
        <h3 className="font-display text-sm tracking-widest neon-text-cyan flex items-center gap-2">
          <MessageSquare size={14} />
          BATTLE LOG
        </h3>
        <p className="text-xs text-muted-foreground font-mono mt-1">Recent neural queries</p>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {entries.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm font-mono">No entries yet.</p>
            <p className="text-muted-foreground text-xs mt-1">Your queries will appear here.</p>
          </div>
        )}
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="group flex items-start gap-2 p-2.5 rounded-md hover:bg-muted/30 transition-colors duration-200 cursor-pointer"
          >
            <Clock size={12} className="text-muted-foreground mt-1 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">{entry.query}</p>
              <p className="text-[10px] font-mono text-muted-foreground">{timeAgo(entry.timestamp)}</p>
            </div>
            <button
              onClick={() => removeEntry(entry.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-destructive"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BattleLog;
