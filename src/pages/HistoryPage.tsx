import { useState } from "react";
import { Search, Pin, Trash2, Clock, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ChatItem {
  id: string;
  title: string;
  time: string;
  pinned: boolean;
}

const INITIAL_CHATS: ChatItem[] = [
  { id: "1", title: "Quantum computing fundamentals", time: "2h ago", pinned: true },
  { id: "2", title: "Neural network architecture patterns", time: "5h ago", pinned: false },
  { id: "3", title: "Advanced cryptography methods", time: "1d ago", pinned: false },
  { id: "4", title: "Space-time continuum theories", time: "2d ago", pinned: false },
  { id: "5", title: "React performance optimisation", time: "3d ago", pinned: true },
  { id: "6", title: "Machine learning model training", time: "5d ago", pinned: false },
];

const HistoryPage = () => {
  const [chats, setChats] = useState<ChatItem[]>(INITIAL_CHATS);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = chats.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));
  const pinned = filtered.filter(c => c.pinned);
  const unpinned = filtered.filter(c => !c.pinned);

  const togglePin = (id: string) => {
    setChats(prev => prev.map(c => c.id === id ? { ...c, pinned: !c.pinned } : c));
  };

  const deleteChat = (id: string) => {
    setChats(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen pt-14 pb-20 px-4">
      <div className="max-w-lg mx-auto pt-6">
        <h1 className="font-display text-xl tracking-wider text-foreground mb-4">Chat History</h1>

        {/* Search */}
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

        {/* Pinned */}
        {pinned.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[10px] font-display tracking-[0.2em] text-muted-foreground mb-2.5 flex items-center gap-1.5">
              <Pin size={10} /> PINNED
            </h2>
            <div className="space-y-1.5">
              {pinned.map((chat) => (
                <ChatRow key={chat.id} chat={chat} onPin={togglePin} onDelete={deleteChat} onOpen={() => navigate("/chat")} />
              ))}
            </div>
          </div>
        )}

        {/* All */}
        <div>
          <h2 className="text-[10px] font-display tracking-[0.2em] text-muted-foreground mb-2.5">RECENT</h2>
          <div className="space-y-1.5">
            {unpinned.map((chat) => (
              <ChatRow key={chat.id} chat={chat} onPin={togglePin} onDelete={deleteChat} onOpen={() => navigate("/chat")} />
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No conversations found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatRow = ({ chat, onPin, onDelete, onOpen }: { chat: ChatItem; onPin: (id: string) => void; onDelete: (id: string) => void; onOpen: () => void }) => (
  <div className="group flex items-center gap-3 p-3 rounded-lg glass-panel hover:neon-border-cyan transition-all duration-200 cursor-pointer" onClick={onOpen}>
    <MessageSquare size={14} className="text-primary shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-sm text-foreground truncate">{chat.title}</p>
      <div className="flex items-center gap-1 text-muted-foreground">
        <Clock size={9} />
        <span className="text-[10px] font-mono">{chat.time}</span>
      </div>
    </div>
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
      <button onClick={() => onPin(chat.id)} className={`p-1.5 rounded text-muted-foreground hover:text-primary transition-colors ${chat.pinned ? "text-primary" : ""}`}>
        <Pin size={12} />
      </button>
      <button onClick={() => onDelete(chat.id)} className="p-1.5 rounded text-muted-foreground hover:text-destructive transition-colors">
        <Trash2 size={12} />
      </button>
    </div>
  </div>
);

export default HistoryPage;
