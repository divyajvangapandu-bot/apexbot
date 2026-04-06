import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  themeVariables: {
    primaryColor: "#00e5ff",
    primaryTextColor: "#e8e6f0",
    primaryBorderColor: "#00e5ff",
    lineColor: "#7c3aed",
    secondaryColor: "#7c3aed",
    tertiaryColor: "hsl(230, 25%, 10%)",
  },
});

let mermaidCounter = 0;

const MermaidDiagram = ({ code }: { code: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState(false);
  const idRef = useRef(`mermaid-${++mermaidCounter}-${Date.now()}`);

  useEffect(() => {
    let cancelled = false;
    const render = async () => {
      try {
        const { svg: renderedSvg } = await mermaid.render(idRef.current, code.trim());
        if (!cancelled) setSvg(renderedSvg);
      } catch {
        if (!cancelled) setError(true);
      }
    };
    render();
    return () => { cancelled = true; };
  }, [code]);

  if (error) {
    return (
      <pre className="bg-background/70 border border-border/30 rounded-lg p-4 overflow-x-auto text-xs text-muted-foreground">
        <code>{code}</code>
      </pre>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-3 p-4 bg-background/50 rounded-lg border border-border/30 overflow-x-auto [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default MermaidDiagram;
