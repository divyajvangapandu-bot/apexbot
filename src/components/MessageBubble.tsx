import { useState } from "react";
import { ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, Zap } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  feedback?: "up" | "down" | null;
  quickAnswer?: string;
  deepAnswer?: string;
  isExpanded?: boolean;
}

interface MessageBubbleProps {
  msg: Message;
  onFeedback: (msgId: string, type: "up" | "down") => void;
  onToggleExpand: (msgId: string) => void;
  onUpgrade: (msgId: string) => void;
  isSignedIn: boolean;
}

const renderLine = (line: string, i: number) => {
  if (!line && line !== "") return <br key={i} />;
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
};

const MessageBubble = ({ msg, onFeedback, onToggleExpand, onUpgrade, isSignedIn }: MessageBubbleProps) => {
  const isUser = msg.role === "user";
  const isWelcome = msg.id === "welcome";
  const hasExpandable = msg.quickAnswer && msg.deepAnswer;
  const displayContent = hasExpandable
    ? (msg.isExpanded ? msg.deepAnswer! : msg.quickAnswer!)
    : msg.content;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] ${isUser ? "order-1" : ""}`}>
        <div className={`rounded-lg px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-primary/15 border border-primary/30 neon-border-cyan"
            : "glass-panel"
        }`}>
          {displayContent.split("\n").map((line, i) => renderLine(line, i))}
        </div>

        {/* Action bar for assistant messages */}
        {!isUser && !isWelcome && (
          <div className="flex items-center gap-2 mt-2 ml-2 flex-wrap">
            {/* Feedback */}
            <span className="text-xs font-mono text-muted-foreground">Helpful?</span>
            <button
              onClick={() => onFeedback(msg.id, "up")}
              className={`p-1.5 rounded transition-all duration-200 ${
                msg.feedback === "up" ? "text-primary neon-text-cyan" : "text-muted-foreground hover:text-primary"
              }`}
            >
              <ThumbsUp size={13} />
            </button>
            <button
              onClick={() => onFeedback(msg.id, "down")}
              className={`p-1.5 rounded transition-all duration-200 ${
                msg.feedback === "down" ? "text-destructive" : "text-muted-foreground hover:text-destructive"
              }`}
            >
              <ThumbsDown size={13} />
            </button>

            {/* Quick/Deep toggle */}
            {hasExpandable && (
              <button
                onClick={() => onToggleExpand(msg.id)}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-mono text-primary/70 hover:text-primary hover:bg-primary/10 transition-all"
              >
                {msg.isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                {msg.isExpanded ? "Quick Answer" : "Deep Answer"}
              </button>
            )}

            {/* Upgrade button (only for non-enhanced, non-expanded) */}
            {!hasExpandable && !isSignedIn && (
              <button
                onClick={() => onUpgrade(msg.id)}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-mono text-accent/70 hover:text-accent hover:bg-accent/10 transition-all"
              >
                <Zap size={12} />
                Upgrade Answer
              </button>
            )}
          </div>
        )}

        <span className="text-[10px] font-mono text-muted-foreground mt-1 block ml-2">
          {msg.timestamp.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
export type { Message };
