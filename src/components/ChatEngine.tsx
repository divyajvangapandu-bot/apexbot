import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, ThumbsUp, ThumbsDown } from "lucide-react";

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

const MOCK_RESPONSES = [
  "Analyzing your query through the Apexbot Neural Core... Based on my deep-processing capabilities, here's what I've synthesized:\n\nYour question touches on a fascinating intersection of technology and human potential. The key insight is that modern AI systems like Apexbot are designed not just to answer questions, but to anticipate the deeper patterns behind them.\n\nHere are the critical takeaways:\n\n1. **Neural Pattern Recognition** — The query maps to 47 different knowledge domains\n2. **Synthesis Complete** — Cross-referenced 2.3M data points\n3. **Confidence Level** — 97.4% accuracy on primary response vector",
  "Processing through quantum analysis modules...\n\nThis is a compelling area of inquiry. Let me break it down with precision:\n\nThe answer lies in understanding the fundamental architecture of information flow. When you consider the underlying mechanics, three principles emerge:\n\n- **Principle Alpha**: Every complex system has a simple core\n- **Principle Beta**: Information density scales logarithmically\n- **Principle Gamma**: The observer shapes the observation\n\nApplying these to your specific context yields a clear path forward.",
  "Engaging full-spectrum analysis...\n\n```\nSYSTEM STATUS: DEEP THOUGHT MODE ACTIVATED\nPROCESSING CORES: 128/128 ONLINE\nMEMORY ALLOCATION: UNLIMITED\n```\n\nExcellent question. Here's my comprehensive analysis:\n\nThe intersection of your query with current technological trajectories suggests a paradigm shift is imminent. Historical data patterns from the last decade confirm that the trajectory you're asking about follows an exponential curve rather than linear progression.\n\n**Key Finding**: The inflection point arrives when three conditions are met simultaneously — and based on current indicators, we're closer than most realize.",
];

const ChatEngine = ({ userName }: ChatEngineProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Welcome to the Neural Core, **${userName}**. I am Apexbot — your gateway to god-tier intelligence. Ask me anything. I never say "I can't."`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
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
    }, 1500 + Math.random() * 1500);
  };

  const setFeedback = (msgId: string, type: "up" | "down") => {
    setMessages(prev =>
      prev.map(m => m.id === msgId ? { ...m, feedback: m.feedback === type ? null : type } : m)
    );
  };

  return (
    <div className="flex flex-col h-full">
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

              {/* Feedback - Power Check */}
              {msg.role === "assistant" && msg.id !== "welcome" && (
                <div className="flex items-center gap-3 mt-2 ml-2">
                  <span className="text-xs font-mono text-muted-foreground">Was this legendary?</span>
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
              <span className="hacker-loading animate-pulse-neon">Processing neural pathways...</span>
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
            placeholder="Ask anything... I never say 'I can't'"
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
      </div>
    </div>
  );
};

export default ChatEngine;
