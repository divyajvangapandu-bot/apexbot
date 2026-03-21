import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, ThumbsUp, ThumbsDown } from "lucide-react";
import GatekeepingPopup from "./GatekeepingPopup";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  feedback?: "up" | "down" | null;
}

interface ChatEngineProps {
  userName: string;
  isSignedIn: boolean;
  onSignIn: () => void;
}

const STANDARD_RESPONSES = [
  "Great question! Here's what I found:\n\nThis topic involves several important aspects worth exploring. Let me break it down:\n\n1. **Core Concept** — The fundamental principle revolves around efficiency and clarity\n2. **Practical Application** — You can apply this directly to your workflow\n3. **Key Insight** — The most impactful takeaway is understanding the bigger picture\n\nWould you like me to go deeper into any of these points?",
  "Here's a thorough analysis:\n\nAfter reviewing this from multiple angles, three main themes emerge:\n\n- **Clarity** — Simplifying complex ideas into actionable steps\n- **Strategy** — Aligning your approach with long-term goals\n- **Execution** — Turning insight into measurable results\n\nEach of these plays a crucial role in achieving the best outcome.",
  "Excellent question — let me provide a detailed response:\n\nThe short answer is that it depends on context, but here's a structured breakdown:\n\n**Overview**: This subject has evolved significantly in recent years\n**Details**: Current best practices emphasise both speed and quality\n**Recommendation**: Start with the fundamentals and iterate from there\n\nLet me know if you'd like specific examples or further detail.",
];

const ENHANCED_RESPONSES = [
  "Great question! Here's a **comprehensive deep-dive** powered by V10 enhanced intelligence:\n\n## Core Analysis\n\nThis topic spans multiple domains and requires a multi-layered understanding. Let me walk you through each dimension:\n\n### 1. Foundational Principles\nThe fundamental concept here rests on three pillars: **efficiency**, **scalability**, and **adaptability**. Each of these feeds into the next, creating a self-reinforcing system of continuous improvement.\n\n### 2. Practical Application & Real-World Context\nIn today's landscape, the most effective approach combines:\n- **Data-driven decision making** — leveraging current trends and patterns\n- **Iterative refinement** — building on feedback loops for precision\n- **Cross-domain synthesis** — drawing insights from adjacent fields\n\n### 3. Strategic Recommendations\nBased on current best practices and emerging trends:\n\n| Priority | Action | Expected Impact |\n|----------|--------|-----------------|\n| High | Start with core fundamentals | Foundation for growth |\n| Medium | Integrate feedback systems | Continuous improvement |\n| Low | Explore advanced techniques | Long-term differentiation |\n\n### 4. Key Takeaway\nThe most important insight is that **context drives everything**. A solution that works in one setting may need significant adaptation in another.\n\n---\n\n💡 *Enhanced response — Sign-in unlocked deeper analysis and structured formatting.*\n\nWould you like me to explore any of these areas in even greater depth?",
  "Excellent — let me provide the **V10 enhanced analysis** you deserve:\n\n## Comprehensive Breakdown\n\nThis is a nuanced topic that benefits from examining it through multiple lenses.\n\n### Historical Context\nUnderstanding where we've been is crucial for knowing where we're going. The evolution of this field has been marked by three major shifts:\n1. **The Foundation Era** — establishing core principles and frameworks\n2. **The Optimisation Phase** — refining processes for maximum efficiency\n3. **The Intelligence Age** — leveraging AI and data for unprecedented insights\n\n### Current State of the Art\nToday's best practitioners are focusing on:\n- **Contextual awareness** — understanding the full picture before acting\n- **Adaptive systems** — building solutions that evolve with changing needs\n- **Human-centric design** — keeping the end user at the center of every decision\n\n### Actionable Framework\n```\nStep 1: Define the problem with precision\nStep 2: Gather data from multiple sources\nStep 3: Synthesise insights into a clear strategy\nStep 4: Execute with built-in feedback loops\nStep 5: Iterate based on real-world results\n```\n\n### Forward-Looking Perspective\nThe trends point toward even greater integration of **real-time data**, **predictive analytics**, and **personalised approaches**. Early adopters of these methods are seeing 3-5x improvements in outcomes.\n\n---\n\n💡 *Enhanced V10 response with expanded depth and structured analysis.*\n\nWant me to dive deeper into any specific section?",
];

const ChatEngine = ({ userName, isSignedIn, onSignIn }: ChatEngineProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Welcome **${userName}**! 👋 I'm Apexbot AI Assistant — your unlimited knowledge companion. Ask me anything, as many times as you like. No limits, no restrictions.`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [showGatekeep, setShowGatekeep] = useState(false);
  const [popupShownCount, setPopupShownCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const newCount = questionCount + 1;
    setQuestionCount(newCount);

    // Simulate AI response
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

      // Show optional popup every 4th question (only if not signed in)
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
    <div className="flex flex-col h-full relative">
      {/* Gatekeeping popup */}
      {showGatekeep && (
        <GatekeepingPopup
          onClose={() => setShowGatekeep(false)}
          onSignIn={() => {
            onSignIn();
            setShowGatekeep(false);
          }}
        />
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] ${msg.role === "user" ? "order-1" : ""}`}>
              <div className={`rounded-lg px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary/15 border border-primary/30 neon-border-cyan"
                  : "glass-panel"
              }`}>
                {msg.content.split("\n").map((line, i) => {
                  if (line.startsWith("```")) return <div key={i} className="font-mono text-xs text-primary/80 bg-background/50 rounded p-2 my-1">{line.replace(/```/g, "")}</div>;
                  if (line.startsWith("## ")) return <h3 key={i} className="font-display text-base text-foreground mt-3 mb-1">{line.replace("## ", "")}</h3>;
                  if (line.startsWith("### ")) return <h4 key={i} className="font-display text-sm text-foreground/90 mt-2 mb-1">{line.replace("### ", "")}</h4>;
                  if (line.startsWith("| ")) return <p key={i} className="font-mono text-xs text-muted-foreground">{line}</p>;
                  if (line.startsWith("---")) return <hr key={i} className="border-border/30 my-3" />;
                  if (line.startsWith("💡")) return <p key={i} className="text-xs text-primary/70 italic mt-2">{line}</p>;
                  if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="font-semibold text-primary">{line.replace(/\*\*/g, "")}</p>;
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

              {/* Feedback */}
              {msg.role === "assistant" && msg.id !== "welcome" && (
                <div className="flex items-center gap-3 mt-2 ml-2">
                  <span className="text-xs font-mono text-muted-foreground">Helpful?</span>
                  <button
                    onClick={() => setFeedback(msg.id, "up")}
                    className={`p-1.5 rounded transition-all duration-200 hover-vibrate ${
                      msg.feedback === "up" ? "text-primary neon-text-cyan" : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    <ThumbsUp size={14} />
                  </button>
                  <button
                    onClick={() => setFeedback(msg.id, "down")}
                    className={`p-1.5 rounded transition-all duration-200 hover-vibrate ${
                      msg.feedback === "down" ? "text-destructive" : "text-muted-foreground hover:text-destructive"
                    }`}
                  >
                    <ThumbsDown size={14} />
                  </button>
                </div>
              )}

              <span className="text-[10px] font-mono text-muted-foreground mt-1 block ml-2">
                {msg.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="glass-panel px-4 py-3 flex items-center gap-2">
              <Sparkles size={14} className="text-primary animate-pulse" />
              <span className="text-sm text-muted-foreground animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input — no question counter */}
      <div className="p-4 border-t border-border/50">
        <div className="flex gap-2">
          <input
            type="text"
            className="cyber-input flex-1"
            placeholder="Ask me anything — unlimited questions..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className="cyber-button px-4 disabled:opacity-30"
          >
            <Send size={18} />
          </button>
        </div>
        {isSignedIn && (
          <p className="text-[10px] text-primary/60 mt-2 text-center font-mono">
            ⚡ V10 Enhanced Mode Active
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatEngine;
