import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, ThumbsUp, ThumbsDown, Plus, Clock, Settings, Mic, Paperclip, Image } from "lucide-react";
import GatekeepingPopup from "@/components/GatekeepingPopup";
import { streamChat } from "@/lib/streamChat";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  feedback?: "up" | "down" | null;
  isStreaming?: boolean;
}

const SMART_ACTIONS = ["Summarise", "Explain", "Rewrite", "Simplify"];

const ChatPage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const isSignedIn = !!user;
  const userName = profile?.name || "there";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hey ${userName}! 👋 I'm ApexBot — your unlimited AI companion. Ask me anything.`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [showGatekeep, setShowGatekeep] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const content = (text || input).trim();
    if (!content || isTyping) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const newCount = questionCount + 1;
    setQuestionCount(newCount);

    const chatHistory = [...messages.filter(m => m.id !== "welcome"), userMsg].map(m => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    const assistantId = (Date.now() + 1).toString();
    let assistantContent = "";

    setMessages(prev => [...prev, {
      id: assistantId, role: "assistant", content: "", timestamp: new Date(), feedback: null, isStreaming: true,
    }]);

    await streamChat({
      messages: chatHistory,
      onDelta: (chunk) => {
        assistantContent += chunk;
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: assistantContent } : m));
      },
      onDone: () => {
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, isStreaming: false } : m));
        setIsTyping(false);
        if (!isSignedIn && newCount > 0 && newCount % 4 === 0) {
          setTimeout(() => setShowGatekeep(true), 800);
        }
      },
      onError: (error) => {
        toast.error(error);
        setMessages(prev => prev.filter(m => m.id !== assistantId));
        setIsTyping(false);
      },
    });
  };

  const setFeedback = (msgId: string, type: "up" | "down") => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, feedback: m.feedback === type ? null : type } : m));
  };

  return (
    <div className="h-screen flex flex-col pt-14 pb-16">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30">
        <h2 className="text-sm font-medium text-foreground">New Chat</h2>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"><Plus size={16} /></button>
          <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"><Clock size={16} /></button>
        </div>
      </div>

      {showGatekeep && (
        <GatekeepingPopup onClose={() => setShowGatekeep(false)} onSignIn={() => { setShowGatekeep(false); navigate("/login"); }} />
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-message-in`}>
            <div className="max-w-[85%]">
              {msg.role === "assistant" && (
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-5 h-5 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                    <Sparkles size={10} className="text-primary" />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">ApexBot</span>
                  {msg.isStreaming && <span className="text-[9px] font-mono text-primary/60 animate-pulse">streaming…</span>}
                </div>
              )}
              <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed transition-all duration-300 ${
                msg.role === "user"
                  ? "bg-primary/15 border border-primary/30 rounded-br-md"
                  : "glass-panel rounded-bl-md"
              }`}>
                {msg.content ? (
                  <div className="prose prose-sm prose-invert max-w-none prose-headings:font-display prose-headings:tracking-wide prose-code:text-primary prose-code:bg-background/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-background/70 prose-pre:border prose-pre:border-border/30 prose-a:text-primary prose-strong:text-foreground">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <span className="text-muted-foreground animate-pulse">…</span>
                )}
                {msg.isStreaming && <span className="inline-block w-1.5 h-4 bg-primary/70 animate-pulse ml-0.5 rounded-sm" />}
              </div>

              {msg.role === "assistant" && msg.id !== "welcome" && !msg.isStreaming && (
                <div className="flex items-center gap-2 mt-1.5 ml-1 animate-fade-in">
                  <button onClick={() => setFeedback(msg.id, "up")}
                    className={`p-1 rounded transition-all ${msg.feedback === "up" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}>
                    <ThumbsUp size={12} />
                  </button>
                  <button onClick={() => setFeedback(msg.id, "down")}
                    className={`p-1 rounded transition-all ${msg.feedback === "down" ? "text-destructive" : "text-muted-foreground hover:text-destructive"}`}>
                    <ThumbsDown size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && messages[messages.length - 1]?.content === "" && (
          <div className="flex justify-start animate-message-in">
            <div className="glass-panel rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
              <Sparkles size={14} className="text-primary animate-pulse" />
              <span className="text-sm text-muted-foreground">ApexBot is thinking…</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 py-1.5 flex gap-2 overflow-x-auto">
        {SMART_ACTIONS.map((action) => (
          <button key={action} onClick={() => sendMessage(action + " the above")}
            disabled={messages.length < 2 || isTyping}
            className="text-[11px] px-3 py-1.5 rounded-full border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/40 transition-all whitespace-nowrap disabled:opacity-30">
            {action}
          </button>
        ))}
      </div>

      <div className="px-4 pb-2">
        <div className="flex items-center gap-2 glass-panel rounded-full px-2 py-1.5">
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/30"><Paperclip size={16} /></button>
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/30"><Image size={16} /></button>
          <input type="text" className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none px-1"
            placeholder="Ask anything…" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} />
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/30"><Mic size={16} /></button>
          <button onClick={() => sendMessage()} disabled={!input.trim() || isTyping}
            className="p-2 rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors disabled:opacity-30">
            <Send size={16} />
          </button>
        </div>
        {isSignedIn && <p className="text-[9px] text-primary/50 mt-1 text-center font-mono">⚡ V10 Enhanced Mode Active</p>}
      </div>
    </div>
  );
};

export default ChatPage;
