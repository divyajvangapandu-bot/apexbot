import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Sparkles, ThumbsUp, ThumbsDown, Plus, Clock, Paperclip, Image as ImageIcon, X, Wrench, Mic, Square } from "lucide-react";
import GatekeepingPopup from "@/components/GatekeepingPopup";
import ToolsPopup from "@/components/ToolsPopup";
import { streamChat, generateImage } from "@/lib/streamChat";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "@/components/CodeBlock";
import MermaidDiagram from "@/components/MermaidDiagram";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  feedback?: "up" | "down" | null;
  isStreaming?: boolean;
  imageUrl?: string;
  attachments?: { type: "image"; dataUrl: string; name: string }[];
}

const SUGGESTION_POOL = [
  "What's trending in tech today?",
  "Help me write a professional email",
  "Explain quantum computing simply",
  "Give me 5 creative project ideas",
  "What are the best productivity tips?",
  "Help me with my homework",
  "Summarize the latest world news",
  "Give me fun facts about space",
  "How do I start learning to code?",
  "Suggest healthy meal ideas for the week",
  "What's a good book to read this month?",
  "Help me plan a weekend trip",
  "Explain how AI works in simple terms",
  "Give me ideas for a school project",
  "What are some interesting science experiments?",
  "Help me prepare for a job interview",
  "Teach me something new today",
  "What's happening in sports right now?",
  "Give me tips for better sleep",
  "Help me brainstorm a business idea",
  "What are the top movies of this year?",
  "Explain climate change in simple words",
  "Give me 3 motivational quotes",
  "How can I improve my writing skills?",
  "What's a fun fact about history?",
  "Help me with a math problem",
  "Suggest weekend activities for families",
  "Tell me about a cool invention",
  "How do I stay focused while studying?",
  "Give me quick workout ideas",
];

function getRandomSuggestions(): string[] {
  const shuffled = [...SUGGESTION_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4);
}

const playClick = () => {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = 600; osc.type = "sine"; gain.gain.value = 0.06;
    osc.start(); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.stop(ctx.currentTime + 0.1);
  } catch {}
};

const ChatPage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const isSignedIn = !!user;
  const userName = profile?.name || (() => { try { return JSON.parse(localStorage.getItem("guest_profile") || "{}")?.name || "there"; } catch { return "there"; } })();

  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", content: `Hey ${userName}! 👋 I'm ApexBot V10 — your world-class AI companion. I can answer questions, generate code, create diagrams, generate images, and more. Ask me anything.`, timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [showGatekeep, setShowGatekeep] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<{ type: "image"; dataUrl: string; name: string }[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [suggestions] = useState(() => getRandomSuggestions());
  const [sendAnimating, setSendAnimating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const conversationIdRef = useRef<string | null>(null);

  const showSuggestions = messages.length === 1 && messages[0].id === "welcome";

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Save conversation to DB for signed-in users after each assistant reply
  const saveConversation = useCallback(async (msgs: Message[]) => {
    if (!isSignedIn || !user) return;
    const realMsgs = msgs.filter(m => m.id !== "welcome");
    if (realMsgs.length === 0) return;

    const title = realMsgs.find(m => m.role === "user")?.content.slice(0, 60) || "New Chat";
    const payload = realMsgs.map(m => ({ role: m.role, content: m.content, timestamp: m.timestamp }));

    if (conversationIdRef.current) {
      await supabase.from("conversations").update({ messages: payload as any, title, updated_at: new Date().toISOString() }).eq("id", conversationIdRef.current);
    } else {
      const { data } = await supabase.from("conversations").insert({ user_id: user.id, title, messages: payload as any }).select("id").single();
      if (data) conversationIdRef.current = data.id;
    }
  }, [isSignedIn, user]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => { setPendingAttachments(prev => [...prev, { type: "image", dataUrl: reader.result as string, name: file.name }]); };
        reader.readAsDataURL(file);
      } else { toast.error("Only image files are supported currently."); }
    });
    e.target.value = "";
  }, []);

  const removeAttachment = (index: number) => { setPendingAttachments(prev => prev.filter((_, i) => i !== index)); };

  const toggleRecording = async () => {
    if (isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        if (audioBlob.size < 1000) { toast.error("Recording too short."); return; }
        toast.info("Transcribing your voice...");
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");
        try {
          const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/transcribe`, {
            method: "POST",
            headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
            body: formData,
          });
          const data = await resp.json();
          if (data.transcript) { setInput(prev => (prev ? prev + " " : "") + data.transcript); toast.success("Voice captured!"); }
          else { toast.error(data.error || "Could not transcribe audio."); }
        } catch { toast.error("Failed to transcribe."); }
      };
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      toast.info("🎙️ Recording... Click again to stop.");
    } catch { toast.error("Microphone access denied."); }
  };

  const sendMessage = async (text?: string) => {
    const content = (text || input).trim();
    if ((!content && pendingAttachments.length === 0) || isTyping) return;
    playClick();
    setSendAnimating(true);
    setTimeout(() => setSendAnimating(false), 600);

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: content || "(image attached)", timestamp: new Date(), attachments: pendingAttachments.length > 0 ? [...pendingAttachments] : undefined };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setPendingAttachments([]);
    setIsTyping(true);
    const newCount = questionCount + 1;
    setQuestionCount(newCount);

    const isImageRequest = /\b(generate|create|draw|make|design|paint|sketch)\b.*\b(image|picture|photo|illustration|artwork|visual|icon|logo)\b/i.test(content) || /\b(image|picture|photo)\b.*\b(of|showing|with)\b/i.test(content);

    if (isImageRequest) {
      const assistantId = (Date.now() + 1).toString();
      const withStreaming = [...newMessages, { id: assistantId, role: "assistant" as const, content: "🎨 Generating image...", timestamp: new Date(), isStreaming: true }];
      setMessages(withStreaming);
      const result = await generateImage(content);
      const finalMsgs = withStreaming.map(m => m.id === assistantId ? { ...m, content: result.error ? "Sorry, image generation failed." : (result.text || "Here's your generated image:"), imageUrl: result.imageUrl, isStreaming: false } : m);
      setMessages(finalMsgs);
      setIsTyping(false);
      saveConversation(finalMsgs);
      if (!isSignedIn && newCount > 0 && newCount % 4 === 0) setTimeout(() => setShowGatekeep(true), 800);
      return;
    }

    const chatHistory = [...messages.filter(m => m.id !== "welcome"), userMsg].map(m => ({ role: m.role as "user" | "assistant", content: m.content }));
    const assistantId = (Date.now() + 1).toString();
    let assistantContent = "";
    const withAssistant = [...newMessages, { id: assistantId, role: "assistant" as const, content: "", timestamp: new Date(), feedback: null, isStreaming: true }];
    setMessages(withAssistant);

    await streamChat({
      messages: chatHistory,
      onDelta: (chunk) => {
        assistantContent += chunk;
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: assistantContent } : m));
      },
      onDone: () => {
        const imageMatch = assistantContent.match(/\[IMAGE_GEN:\s*(.+?)\]/);
        if (imageMatch) {
          const imagePrompt = imageMatch[1];
          const textContent = assistantContent.replace(/\[IMAGE_GEN:\s*.+?\]/, "").trim();
          setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: textContent || "Generating image...", isStreaming: true } : m));
          generateImage(imagePrompt).then(result => {
            setMessages(prev => {
              const final = prev.map(m => m.id === assistantId ? { ...m, content: textContent || (result.text || "Here's your generated image:"), imageUrl: result.imageUrl, isStreaming: false } : m);
              saveConversation(final);
              return final;
            });
          });
        } else {
          setMessages(prev => {
            const final = prev.map(m => m.id === assistantId ? { ...m, isStreaming: false } : m);
            saveConversation(final);
            return final;
          });
        }
        setIsTyping(false);
        if (!isSignedIn && newCount > 0 && newCount % 4 === 0) setTimeout(() => setShowGatekeep(true), 800);
      },
      onError: (error) => { toast.error(error); setMessages(prev => prev.filter(m => m.id !== assistantId)); setIsTyping(false); },
    });
  };

  const setFeedback = (msgId: string, type: "up" | "down") => {
    playClick();
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, feedback: m.feedback === type ? null : type } : m));
  };

  const renderMarkdown = (content: string) => (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
      code({ className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || "");
        const codeStr = String(children).replace(/\n$/, "");
        if (match) {
          if (match[1] === "mermaid") return <MermaidDiagram code={codeStr} />;
          return <CodeBlock language={match[1]}>{codeStr}</CodeBlock>;
        }
        return <code className="text-primary bg-background/50 px-1.5 py-0.5 rounded text-[13px] font-mono" {...props}>{children}</code>;
      },
      a({ href, children }) { return <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors">{children}</a>; },
    }}>{content}</ReactMarkdown>
  );

  return (
    <div className="h-screen flex flex-col pt-14 pb-16 animate-page-enter">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30">
        <h2 className="text-sm font-medium text-foreground">New Chat</h2>
        <div className="flex items-center gap-1">
          <button onClick={() => { playClick(); }} className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all active:scale-90"><Plus size={16} /></button>
          <button onClick={() => { playClick(); navigate("/history"); }} className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all active:scale-90"><Clock size={16} /></button>
        </div>
      </div>

      {showGatekeep && <GatekeepingPopup onClose={() => setShowGatekeep(false)} onSignIn={() => { setShowGatekeep(false); navigate("/login"); }} />}
      <ToolsPopup open={showTools} onClose={() => setShowTools(false)} onSelectTool={(label) => { setInput(prev => prev ? `${label}: ${prev}` : `${label}: `); }} />

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-message-in`}>
            <div className="max-w-[85%]">
              {msg.role === "assistant" && (
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-5 h-5 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                    <Sparkles size={10} className="text-primary" />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">ApexBot V10</span>
                  {msg.isStreaming && <span className="text-[9px] font-mono text-primary/60 animate-pulse">streaming…</span>}
                </div>
              )}
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="flex gap-2 mb-2 flex-wrap justify-end">
                  {msg.attachments.map((att, i) => <img key={i} src={att.dataUrl} alt={att.name} className="w-24 h-24 object-cover rounded-lg border border-border/30" />)}
                </div>
              )}
              <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed transition-all duration-300 ${msg.role === "user" ? "bg-primary/15 border border-primary/30 rounded-br-md" : "glass-panel rounded-bl-md"}`}>
                {msg.content ? (
                  <div className="prose prose-sm prose-invert max-w-none prose-headings:font-display prose-headings:tracking-wide prose-pre:bg-transparent prose-pre:p-0 prose-pre:border-0 prose-a:text-primary prose-strong:text-foreground prose-code:before:content-none prose-code:after:content-none">
                    {msg.role === "assistant" ? renderMarkdown(msg.content) : msg.content}
                  </div>
                ) : <span className="text-muted-foreground animate-pulse">…</span>}
                {msg.isStreaming && <span className="inline-block w-1.5 h-4 bg-primary/70 animate-pulse ml-0.5 rounded-sm" />}
              </div>
              {msg.imageUrl && (
                <div className="mt-3 rounded-xl overflow-hidden border border-border/30 animate-fade-in">
                  <img src={msg.imageUrl} alt="AI Generated" className="w-full max-w-md rounded-xl" />
                </div>
              )}
              {msg.role === "assistant" && msg.id !== "welcome" && !msg.isStreaming && (
                <div className="flex items-center gap-2 mt-1.5 ml-1 animate-fade-in">
                  <button onClick={() => setFeedback(msg.id, "up")} className={`p-1 rounded transition-all active:scale-125 ${msg.feedback === "up" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}>
                    <ThumbsUp size={12} />
                  </button>
                  <button onClick={() => setFeedback(msg.id, "down")} className={`p-1 rounded transition-all active:scale-125 ${msg.feedback === "down" ? "text-destructive" : "text-muted-foreground hover:text-destructive"}`}>
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

      {/* Suggestion chips — random each refresh */}
      {showSuggestions && (
        <div className="px-4 py-2 grid grid-cols-2 gap-2">
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => sendMessage(s)}
              className="text-left px-3 py-2.5 rounded-xl glass-panel hover:neon-border-cyan transition-all duration-200 active:scale-95 group animate-chip-pop"
              style={{ animationDelay: `${i * 100}ms` }}>
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors leading-tight line-clamp-2">{s}</span>
            </button>
          ))}
        </div>
      )}

      {/* Tools button */}
      <div className="px-4 py-1.5 flex items-center justify-center">
        <button onClick={() => { playClick(); setShowTools(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel hover:neon-border-cyan transition-all duration-200 active:scale-95 group hover-bounce">
          <Wrench size={14} className="text-primary group-hover:rotate-12 transition-transform" />
          <span className="text-[11px] font-display tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">ApexBot Intelligence Tools</span>
        </button>
      </div>

      {/* Attachments */}
      {pendingAttachments.length > 0 && (
        <div className="px-4 py-2 flex gap-2 overflow-x-auto">
          {pendingAttachments.map((att, i) => (
            <div key={i} className="relative group animate-chip-pop">
              <img src={att.dataUrl} alt={att.name} className="w-16 h-16 object-cover rounded-lg border border-border/30" />
              <button onClick={() => removeAttachment(i)} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <X size={10} className="text-destructive-foreground" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="px-4 pb-2">
        <div className="flex items-center gap-2 glass-panel rounded-full px-2 py-1.5">
          <input ref={fileInputRef} type="file" className="hidden" accept="*/*" onChange={handleFileSelect} />
          <input ref={imageInputRef} type="file" className="hidden" accept="image/*" capture="environment" onChange={handleFileSelect} />
          <button onClick={() => { playClick(); fileInputRef.current?.click(); }} className="p-2 text-muted-foreground hover:text-foreground transition-all rounded-full hover:bg-muted/30 active:scale-90">
            <Paperclip size={16} />
          </button>
          <button onClick={() => { playClick(); imageInputRef.current?.click(); }} className="p-2 text-muted-foreground hover:text-foreground transition-all rounded-full hover:bg-muted/30 active:scale-90">
            <ImageIcon size={16} />
          </button>
          <button onClick={() => { playClick(); toggleRecording(); }}
            className={`p-2 rounded-full transition-all active:scale-90 ${isRecording ? "text-destructive bg-destructive/15 animate-pulse" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"}`}>
            {isRecording ? <Square size={16} /> : <Mic size={16} />}
          </button>
          <input type="text" className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none px-1"
            placeholder="Ask anything…" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} />
          <button onClick={() => sendMessage()} disabled={(!input.trim() && pendingAttachments.length === 0) || isTyping}
            className={`p-2 rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-all disabled:opacity-30 active:scale-90 ${sendAnimating ? "animate-send-pulse" : ""}`}>
            <Send size={16} />
          </button>
        </div>
        {isSignedIn && <p className="text-[9px] text-primary/50 mt-1 text-center font-mono">⚡ V10 Enhanced Mode Active — Real-time Intelligence</p>}
      </div>
    </div>
  );
};

export default ChatPage;
