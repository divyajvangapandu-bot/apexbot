import { useState, useEffect } from "react";
import { Search, MessageSquare, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface ConvoSummary { id: string; title: string; updated_at: string; }

const HistoryPage = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const isSignedIn = !!user;
  const [conversations, setConversations] = useState<ConvoSummary[]>([]);

  useEffect(() => {
    if (!isSignedIn || !user) return;
    supabase.from("conversations").select("id, title, updated_at").eq("user_id", user.id).order("updated_at", { ascending: false })
      .then(({ data }) => { if (data) setConversations(data as ConvoSummary[]); });
  }, [isSignedIn, user]);

  const filtered = conversations.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

  const deleteConvo = async (id: string) => {
    await supabase.from("conversations").delete().eq("id", id);
    setConversations(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen pt-14 pb-20 px-4 animate-page-enter">
      <div className="max-w-lg mx-auto pt-6">
        <h1 className="font-display text-xl tracking-wider text-foreground mb-4 animate-fade-in-up">Chat History</h1>
        <div className="flex items-center gap-2 glass-panel rounded-lg px-3 py-2 mb-6 animate-slide-up">
          <Search size={14} className="text-muted-foreground" />
          <input type="text" className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            placeholder="Search conversations…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {filtered.length > 0 ? (
          <div className="space-y-2 stagger-children">
            {filtered.map(c => (
              <div key={c.id} className="flex items-center gap-2 p-3 rounded-lg glass-panel hover:neon-border-cyan transition-all duration-200 animate-slide-up">
                <button onClick={() => navigate("/chat")} className="flex-1 text-left hover-bounce">
                  <p className="text-sm text-foreground truncate">{c.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(c.updated_at).toLocaleDateString()}</p>
                </button>
                <button onClick={() => deleteConvo(c.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors active:scale-90">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in-up">
            <MessageSquare size={40} className="text-muted-foreground/30 mb-4" />
            <p className="text-sm text-muted-foreground mb-1">No conversations yet</p>
            <p className="text-xs text-muted-foreground/60 mb-5">Start a conversation right now!</p>
            <button onClick={() => navigate("/chat")}
              className="text-xs px-6 py-2.5 rounded-full bg-primary/15 border border-primary/30 text-primary hover:bg-primary/25 transition-all duration-200 hover-bounce active:scale-95">
              Start Conversation
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
