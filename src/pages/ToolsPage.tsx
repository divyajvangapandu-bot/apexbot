import { Search, BookOpen, CheckCircle, PenTool, RefreshCw, Type, Spell, FileText, StickyNote, ListTodo, Mail, Languages, ArrowDownToLine, Calculator, Code, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
      { icon: Spell, label: "Grammar Fix" },
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
    title: "Language",
    tools: [
      { icon: Languages, label: "Translation" },
      { icon: ArrowDownToLine, label: "Simplification" },
    ],
  },
  {
    title: "Problem Solving",
    tools: [
      { icon: Calculator, label: "Math Solver" },
      { icon: Code, label: "Code Helper" },
      { icon: Brain, label: "Logical Analysis" },
    ],
  },
];

const ToolsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-14 pb-20 px-4">
      <div className="max-w-lg mx-auto pt-6">
        <h1 className="font-display text-xl tracking-wider text-foreground mb-1">Tools</h1>
        <p className="text-xs text-muted-foreground mb-6">Structured capabilities at your fingertips</p>

        <div className="space-y-6">
          {categories.map((cat) => (
            <div key={cat.title}>
              <h2 className="text-[10px] font-display tracking-[0.2em] text-muted-foreground mb-2.5">{cat.title.toUpperCase()}</h2>
              <div className="grid grid-cols-2 gap-2">
                {cat.tools.map((tool) => (
                  <button
                    key={tool.label}
                    onClick={() => navigate("/chat")}
                    className="flex items-center gap-3 p-3 rounded-lg glass-panel hover:neon-border-cyan transition-all duration-200 text-left group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
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

export default ToolsPage;
