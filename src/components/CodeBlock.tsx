import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  language: string;
  children: string;
}

const CodeBlock = ({ language, children }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-3 rounded-lg overflow-hidden border border-border/30">
      <div className="flex items-center justify-between px-4 py-2 bg-background/90 border-b border-border/30">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{language || "code"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors"
        >
          {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="bg-background/70 p-4 overflow-x-auto text-sm leading-relaxed">
        <code className={`language-${language}`}>{children}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
