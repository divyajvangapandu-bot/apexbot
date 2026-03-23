import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, ThumbsUp, ThumbsDown, Plus, Clock, Settings, Mic, Paperclip, Image, ArrowDown } from "lucide-react";
import GatekeepingPopup from "@/components/GatekeepingPopup";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  feedback?: "up" | "down" | null;
}

interface ChatPageProps {
  userName: string;
  isSignedIn: boolean;
  onSignIn: () => void;
}

const SMART_ACTIONS = ["Summarise", "Explain", "Rewrite", "Simplify"];

const STANDARD_RESPONSES = [
  "Great question! Here's what I found:\\n\\nThis topic involves several important aspects worth exploring. Let me break it down:\\n\\n1. **Core Concept** — The fundamental principle revolves around efficiency and clarity\\n2. **Practical Application** — You can apply this directly to your workflow\\n3. **Key Insight** — The most impactful takeaway is understanding the bigger picture\\n\\nWould you like me to go deeper into any of these points?",
  "Here's a thorough analysis:\\n\\nAfter reviewing this from multiple angles, three main themes emerge:\\n\\n- **Clarity** — Simplifying complex ideas into actionable steps\\n- **Strategy** — Aligning your approach with long-term goals\\n- **Execution** — Turning insight into measurable results\\n\\nEach of these plays a crucial role in achieving the best outcome.",
  "Excellent question — let me provide a detailed response:\\n\\nThe short answer is that it depends on context, but here's a structured breakdown:\\n\\n**Overview**: This subject has evolved significantly in recent years\\n**Details**: Current best practices emphasise both speed and quality\\n**Recommendation**: Start with the fundamentals and iterate from there\\n\\nLet me know if you'd like specific examples or further detail.",
];

const ENHANCED_RESPONSES = [
  "Great question! Here's a **comprehensive deep-dive** powered by V10 enhanced intelligence:\\n\\n## Core Analysis\\n\\nThis topic spans multiple domains and requires a multi-layered understanding:\\n\\n### 1. Foundational Principles\\nThe fundamental concept rests on three pillars: **efficiency**, **scalability**, and **adaptability**.\\n\\n### 2. Practical Application\\n- **Data-driven decision making** — leveraging current trends\\n- **Iterative refinement** — building on feedback loops\\n- **Cross-domain synthesis** — drawing from adjacent fields\\n\\n### 3. Strategic Recommendations\\n\\n| Priority | Action | Impact |\\n|----------|--------|--------|\\n| High | Core fundamentals | Foundation |\\n| Medium | Feedback systems | Growth |\\n| Low | Advanced techniques | Edge |\\n\\n---\\n\\n💡 *Enhanced V10 response with deeper analysis.*\\n\\nWant me to explore any area further?",
  "Excellent — here's the **V10 enhanced analysis**:\\n\\n## Comprehensive Breakdown\\n\\n### Historical Context\\n1. **Foundation Era** — establishing core principles\\n2. **Optimisation Phase** — refining for efficiency\\n3. **Intelligence Age** — leveraging AI for insights\\n\\n### Current Best Practices\\n- **Contextual awareness** — full picture before acting\\n- **Adaptive systems** — evolving with needs\\n- **Human-centric design** — user at the centre\\n\\n### Actionable Framework\\n```\\nStep 1: Define the problem precisely\\nStep 2: Gather multi-source data\\nStep 3: Synthesise into strategy\\nStep 4: Execute with feedback loops\\nStep 5: Iterate on results\\n```\\n\\n---\\n\\n💡 *Enhanced V10 response with expanded depth.*\\n\\nWant me to dive deeper into any section?",
];

const ChatPage = ({ userName, isSignedIn, onSignIn }: ChatPageProps) => {
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

  const sendMessage = (text?: string) => {
    const content = (text || input).trim();
    if (!content || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const newCount = questionCount + 1;
    setQuestionCount(newCount);

    setTimeout(() => {
      const responses = isSignedIn ? ENHANCED_RESPONSES : STANDARD_RESPONSES;
      const response = responses[Math.floor(Math.random() * responses.length)];
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        feedback: null,
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);

      if (!isSignedIn && newCount > 0 && newCount % 4 === 0) {
        setTimeout(() => setShowGatekeep(true), 800);
      }
    }, 1200 + Math.random() * 1000);
  };

  const setFeedback = (msgId: string, type: "up" | "down") => {
    setMessages(prev =>
      prev.map(m => m.id === msgId ? { ...m, feedback: m.feedback === type ? null : type } : m)
    );
  };

  return (
    <div className="h-screen flex flex-col pt-14 pb-16">
      {/* Chat header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30">
        <h2 className="text-sm font-medium text-foreground">New Chat</h2>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors">
            <Plus size={16} />
          </button>
          <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors">
            <Clock size={16} />
          </button>
          <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors">
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Gatekeeping popup */}
      {showGatekeep && (
        <GatekeepingPopup
          onClose={() => setShowGatekeep(false)}
          onSignIn={() => { onSignIn(); setShowGatekeep(false); }}
        />
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] ${msg.role === "user" ? "" : ""}`}>
              {msg.role === "assistant" && (
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-5 h-5 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                    <Sparkles size={10} className="text-primary" />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">ApexBot</span>
                </div>
              )}
              <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary/15 border border-primary/30 rounded-br-md"
                  : "glass-panel rounded-bl-md"
              }`}>
                {msg.content.split("\n").map((line, i) => {
                  if (line.startsWith("```")) return <div key={i} className="font-mono text-xs text-primary/80 bg-background/50 rounded p-2 my-1">{line.replace(/```/g, "")}</div>;
                  if (line.startsWith("## ")) return <h3 key={i} className="font-display text-sm text-foreground mt-3 mb-1">{line.replace("## ", "")}</h3>;
                  if (line.startsWith("### ")) return <h4 key={i} className="font-display text-xs text-foreground/90 mt-2 mb-1">{line.replace("### ", "")}</h4>;
                  if (line.startsWith("| ")) return <p key={i} className="font-mono text-xs text-muted-foreground">{line}</p>;
                  if (line.startsWith("---")) return <hr key={i} className="border-border/30 my-3" />;
                  if (line.startsWith("💡")) return <p key={i} className="text-xs text-primary/70 italic mt-2">{line}</p>;
                  if (line.startsWith("- **")) {
                    const parts = line.replace("- ", "").split("**");
                    return <p key={i} className="ml-2">• <strong className="text-primary">{parts[1]}</strong>{parts[2]}</p>;
                  }
                  if (line.match(/^\d\./)) {
                    const parts = line.split("**");
                    if (parts.length > 1) return <p key={i} className="ml-2">{parts[0]}<strong className="text-primary">{parts[1]}</strong>{parts[2]}</p>;
                  }
                  return line ? <p key={i}>{line.replace(/\*\*/g, "")}</p> : <br key={i} />;
                })}
              </div>

              {msg.role === "assistant" && msg.id !== "welcome" && (
                <div className="flex items-center gap-2 mt-1.5 ml-1">
                  <button
                    onClick={() => setFeedback(msg.id, "up")}
                    className={`p-1 rounded transition-all hover-vibrate ${
                      msg.feedback === "up" ? "text-primary" : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    <ThumbsUp size={12} />
                  </button>
                  <button
                    onClick={() => setFeedback(msg.id, "down")}
                    className={`p-1 rounded transition-all hover-vibrate ${
                      msg.feedback === "down" ? "text-destructive" : "text-muted-foreground hover:text-destructive"
                    }`}
                  >
                    <ThumbsDown size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
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

      {/* Smart Actions */}
      <div className="px-4 py-1.5 flex gap-2 overflow-x-auto">
        {SMART_ACTIONS.map((action) => (
          <button
            key={action}
            onClick={() => sendMessage(action + " the above")}
            disabled={messages.length < 2 || isTyping}
            className="text-[11px] px-3 py-1.5 rounded-full border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/40 transition-all whitespace-nowrap disabled:opacity-30"
          >
            {action}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 pb-2">
        <div className="flex items-center gap-2 glass-panel rounded-full px-2 py-1.5">
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/30">
            <Paperclip size={16} />
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/30">
            <Image size={16} />
          </button>
          <input
            type="text"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none px-1"
            placeholder="Ask anything…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
          />
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/30">
            <Mic size={16} />
          </button>
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            className="p-2 rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors disabled:opacity-30"
          >
            <Send size={16} />
          </button>
        </div>
        {isSignedIn && (
          <p className="text-[9px] text-primary/50 mt-1 text-center font-mono">⚡ V10 Enhanced Mode Active</p>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
