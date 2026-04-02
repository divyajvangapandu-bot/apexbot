import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";
import GatekeepingPopup from "./GatekeepingPopup";
import MessageBubble, { type Message } from "./MessageBubble";
import { generateResponse, generateDeepExpansion, generateUpgradedAnswer, detectComplexity } from "@/lib/responseEngine";

interface ChatEngineProps {
  userName: string;
  isSignedIn: boolean;
  onSignIn: () => void;
}

const ChatEngine = ({ userName, isSignedIn, onSignIn }: ChatEngineProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Welcome **${userName}**! 👋 I'm ApexBot AI Assistant — your unlimited knowledge companion. Ask me anything, as many times as you like. No limits, no restrictions.`,
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

    const query = input.trim();
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const newCount = questionCount + 1;
    setQuestionCount(newCount);

    // Adaptive delay based on complexity
    const complexity = detectComplexity(query);
    const delay = complexity === "simple" ? 400 + Math.random() * 300
      : complexity === "intermediate" ? 800 + Math.random() * 600
      : 1200 + Math.random() * 800;

    setTimeout(() => {
      const response = generateResponse(query, isSignedIn);

      // For intermediate+ queries, provide quick/deep versions
      const hasExpandable = complexity !== "simple" && !isSignedIn;
      const quickAnswer = hasExpandable ? response : undefined;
      const deepAnswer = hasExpandable ? generateDeepExpansion(response, query) : undefined;

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        feedback: null,
        quickAnswer,
        deepAnswer,
        isExpanded: false,
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);

      // Show optional popup every 4th question (only if not signed in)
      if (!isSignedIn && newCount > 0 && newCount % 4 === 0) {
        setTimeout(() => setShowGatekeep(true), 800);
      }
    }, delay);
  };

  const setFeedback = (msgId: string, type: "up" | "down") => {
    setMessages(prev =>
      prev.map(m => m.id === msgId ? { ...m, feedback: m.feedback === type ? null : type } : m)
    );
  };

  const toggleExpand = (msgId: string) => {
    setMessages(prev =>
      prev.map(m => m.id === msgId ? { ...m, isExpanded: !m.isExpanded } : m)
    );
  };

  const upgradeAnswer = (msgId: string) => {
    setMessages(prev =>
      prev.map(m => {
        if (m.id !== msgId) return m;
        // Find the user query that preceded this answer
        const idx = prev.findIndex(msg => msg.id === msgId);
        const userQuery = idx > 0 ? prev[idx - 1].content : "";
        const upgraded = generateUpgradedAnswer(userQuery);
        return { ...m, content: upgraded, quickAnswer: m.content, deepAnswer: upgraded, isExpanded: true };
      })
    );
  };

  return (
    <div className="flex flex-col h-full relative">
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
          <MessageBubble
            key={msg.id}
            msg={msg}
            onFeedback={setFeedback}
            onToggleExpand={toggleExpand}
            onUpgrade={upgradeAnswer}
            isSignedIn={isSignedIn}
          />
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
