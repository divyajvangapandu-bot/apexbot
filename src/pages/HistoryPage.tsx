import { useState } from "react";
import { Search, Pin, Trash2, Clock, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HistoryPage = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-14 pb-20 px-4">
      <div className="max-w-lg mx-auto pt-6">
        <h1 className="font-display text-xl tracking-wider text-foreground mb-4">Chat History</h1>

        <div className="flex items-center gap-2 glass-panel rounded-lg px-3 py-2 mb-6">
          <Search size={14} className="text-muted-foreground" />
          <input
            type="text"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            placeholder="Search conversations…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-col items-center justify-center py-16 text-center">
          <MessageSquare size={40} className="text-muted-foreground/30 mb-4" />
          <p className="text-sm text-muted-foreground mb-1">No conversations yet</p>
          <p className="text-xs text-muted-foreground/60 mb-5">Start a conversation right now!</p>
          <button onClick={() => navigate("/chat")}
            className="text-xs px-6 py-2.5 rounded-full bg-primary/15 border border-primary/30 text-primary hover:bg-primary/25 transition-all duration-200">
            Start Conversation
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
