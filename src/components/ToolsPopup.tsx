import { X, Search, BookOpen, CheckCircle, PenTool, RefreshCw, Type, SpellCheck, FileText, StickyNote, ListTodo, Mail, Languages, ArrowDownToLine, Calculator, Code, Brain } from "lucide-react";

const categories = [
  {
    title: "AI Utilities",
    tools: [
      { icon: Search, label: "Smart Search" },
      { icon: BookOpen, label: "Deep Research" },
      { icon: CheckCircle, label: "Fact Checking" },
    ],
  },
  {
    title: "Content Tools",
    tools: [
      { icon: PenTool, label: "Text Generation" },
      { icon: RefreshCw, label: "Rewriting" },
      { icon: Type, label: "Tone Adjustment" },
      { icon: SpellCheck, label: "Grammar Fix" },
    ],
  },
  {
    title: "Productivity",
    tools: [
      { icon: FileText, label: "Summarisation" },
      { icon: StickyNote, label: "Notes Generation" },
      { icon: ListTodo, label: "Task Planning" },
      { icon: Mail, label: "Email Writing" },
    ],
  },
  {
    title: "Language & Problem Solving",
    tools: [
      { icon: Languages, label: "Translation" },
      { icon: ArrowDownToLine, label: "Simplification" },
      { icon: Calculator, label: "Math Solver" },
      { icon: Code, label: "Code Helper" },
      { icon: Brain, label: "Logical Analysis" },
    ],
  },
];

interface ToolsPopupProps {
  open: boolean;
  onClose: () => void;
  onSelectTool: (label: string) => void;
}

const ToolsPopup = ({ open, onClose, onSelectTool }: ToolsPopupProps) => {
  if (!open) return null;

  const playClick = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 660;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg max-h-[80vh] overflow-y-auto glass-panel-strong rounded-2xl p-5 animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-base tracking-wider text-foreground">ApexBot Intelligence Tools</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5">
          {categories.map((cat) => (
            <div key={cat.title}>
              <h3 className="text-[10px] font-display tracking-[0.2em] text-muted-foreground mb-2.5">{cat.title.toUpperCase()}</h3>
              <div className="grid grid-cols-2 gap-2">
                {cat.tools.map((tool) => (
                  <button
                    key={tool.label}
                    onClick={() => {
                      playClick();
                      onSelectTool(tool.label);
                      onClose();
                    }}
                    className="flex items-center gap-3 p-3 rounded-xl glass-panel hover:neon-border-cyan transition-all duration-200 text-left group active:scale-95"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0 group-hover:shadow-[0_0_12px_hsl(var(--cyan-glow)/0.2)]">
                      <tool.icon size={16} className="text-primary" />
                    </div>
                    <span className="text-xs text-foreground">{tool.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToolsPopup;
