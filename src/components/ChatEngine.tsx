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
}

const FREE_QUESTION_LIMIT = 4;

const MOCK_RESPONSES = [
  "Great question! Here's what I found:\n\nThis topic involves several important aspects worth exploring. Let me break it down:\n\n1. **Core Concept** — The fundamental principle revolves around efficiency and clarity\n2. **Practical Application** — You can apply this directly to your workflow\n3. **Key Insight** — The most impactful takeaway is understanding the bigger picture\n\nWould you like me to go deeper into any of these points?",
  "Here's a thorough analysis:\n\nAfter reviewing this from multiple angles, three main themes emerge:\n\n- **Clarity** — Simplifying complex ideas into actionable steps\n- **Strategy** — Aligning your approach with long-term goals\n- **Execution** — Turning insight into measurable results\n\nEach of these plays a crucial role in achieving the best outcome.",
  "Excellent question — let me provide a detailed response:\n\nThe short answer is that it depends on context, but here's a structured breakdown:\n\n**Overview**: This subject has evolved significantly in recent years\n**Details**: Current best practices emphasise both speed and quality\n**Recommendation**: Start with the fundamentals and iterate from there\n\nLet me know if you'd like specific examples or further detail.",
];

const ChatEngine = ({ userName }: ChatEngineProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hi **${userName}**, welcome to Apexbot AI Assistant! Ask me anything — I'm here to help.`,
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

  const sendMessage = () => {
    if (!input.trim() || isTyping) return;

    // Check limit before sending
    if (questionCount >= FREE_QUESTION_LIMIT) {
      setShowGatekeep(true);
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setQuestionCount(prev => prev + 1);

    // Simulate AI response
    setTimeout(() => {
      const response = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        feedback: null,
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);

      // Show popup after the 4th answer is delivered
      if (questionCount + 1 >= FREE_QUESTION_LIMIT) {
        setTimeout(() => setShowGatekeep(true), 1000);
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
            // TODO: integrate real auth
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

      {/* Input */}
      <div className="p-4 border-t border-border/50">
        <div className="flex gap-2">
          <input
            type="text"
            className="cyber-input flex-1"
            placeholder="Ask me anything..."
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
        <p className="text-[10px] text-muted-foreground mt-2 text-center font-mono">
          {questionCount}/{FREE_QUESTION_LIMIT} free questions used
        </p>
      </div>
    </div>
  );
};

export default ChatEngine;
