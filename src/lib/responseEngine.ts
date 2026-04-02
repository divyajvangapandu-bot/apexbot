// Adaptive Response Engine for ApexBot V10
// Generates context-aware responses based on query complexity and intent

type QueryComplexity = "simple" | "intermediate" | "complex";
type QueryIntent = "math" | "definition" | "factual" | "howto" | "analysis" | "creative" | "code" | "general";

interface ResponseConfig {
  complexity: QueryComplexity;
  intent: QueryIntent;
  enhanced: boolean;
}

function detectComplexity(query: string): QueryComplexity {
  const words = query.trim().split(/\s+/).length;
  const q = query.toLowerCase();

  // Simple: math, single-word lookups, yes/no questions, short factual
  if (q.match(/^\d[\d\s+\-*/().^%]+\d$|^what is \d/)) return "simple";
  if (words <= 5 && (q.startsWith("what is") || q.startsWith("define") || q.startsWith("who is") || q.startsWith("when "))) return "simple";
  if (words <= 3) return "simple";

  // Complex: long queries, "explain in detail", "compare", "analyze", multi-part
  if (words >= 20) return "complex";
  if (q.includes("explain in detail") || q.includes("compare") || q.includes("analyze") || q.includes("analyse")) return "complex";
  if (q.includes("pros and cons") || q.includes("step by step") || q.includes("in depth")) return "complex";
  if ((q.match(/\band\b/g) || []).length >= 2) return "complex";

  return "intermediate";
}

function detectIntent(query: string): QueryIntent {
  const q = query.toLowerCase();
  if (q.match(/[\d]+\s*[+\-*/^%]\s*[\d]+/) || q.match(/calculate|solve|equation|math/)) return "math";
  if (q.match(/^(define|what is|what are|meaning of|what does .* mean)/)) return "definition";
  if (q.match(/^(who|when|where|how many|how much|how old|how tall|how far)/)) return "factual";
  if (q.match(/how (to|do|can|should)|steps to|guide|tutorial/)) return "howto";
  if (q.match(/code|program|function|script|bug|error|syntax|api|html|css|javascript|python|react/)) return "code";
  if (q.match(/write|create|generate|story|poem|essay|email|letter/)) return "creative";
  if (q.match(/explain|compare|analy[sz]e|evaluate|discuss|why|impact|difference/)) return "analysis";
  return "general";
}

// Simple answer generators based on intent
const simpleAnswers: Record<string, (q: string) => string> = {
  math: (q) => {
    try {
      const expr = q.replace(/[^0-9+\-*/().^ ]/g, "").trim();
      if (expr) {
        const result = Function(`"use strict"; return (${expr.replace(/\^/g, "**")})`)();
        return `**${q.trim()}** = **${result}**`;
      }
    } catch { /* fall through */ }
    return `That's a mathematical expression. For precise calculations, I'd compute this step by step — but as a quick reference, try breaking it into smaller parts.`;
  },
  definition: (q) => {
    const term = q.replace(/^(define|what is|what are|meaning of)\s*/i, "").replace(/[?.!]/g, "").trim();
    return `**${term.charAt(0).toUpperCase() + term.slice(1)}** refers to a concept or entity in its respective domain. For the most accurate and current definition, I'd recommend checking a specialised source, but in general terms, it relates to the core principles and characteristics that define it within its context.`;
  },
  factual: (q) => `Based on widely known information, here's a direct answer to your question. For the most current data, I'd recommend verifying with an up-to-date source.`,
  general: (q) => `Quick answer: This is a straightforward topic. The key point is understanding the core idea and applying it directly.`,
};

function generateSimpleResponse(query: string, intent: QueryIntent): string {
  const generator = simpleAnswers[intent] || simpleAnswers.general;
  return generator(query);
}

function generateIntermediateResponse(query: string, intent: QueryIntent, enhanced: boolean): string {
  const q = query.toLowerCase();

  if (intent === "howto") {
    const topic = query.replace(/^how (to|do|can|should)\s*/i, "").replace(/[?.!]/g, "").trim();
    const base = `Here's how to **${topic}**:\n\n1. **Start with the basics** — understand the core requirements and prerequisites\n2. **Follow a structured approach** — break it into manageable steps\n3. **Practice and refine** — iteration leads to mastery\n\nThe most effective method depends on your specific context and experience level.`;
    if (enhanced) {
      return base + `\n\n### Pro Tips\n- Research current best practices before starting\n- Set measurable milestones to track progress\n- Learn from others who've done it successfully\n- Document your process for future reference\n\n💡 *Enhanced insight: The difference between good and great execution often comes down to preparation and consistency.*`;
    }
    return base;
  }

  if (intent === "code") {
    const base = `Here's a practical approach to your coding question:\n\nThe key principle is writing **clean, maintainable code** that solves the specific problem. Focus on:\n\n- **Clarity** — readable code is maintainable code\n- **Efficiency** — optimise for the actual bottleneck\n- **Testing** — verify your solution handles edge cases`;
    if (enhanced) {
      return base + `\n\n### Implementation Strategy\n\`\`\`\n1. Define inputs and expected outputs\n2. Write the core logic\n3. Handle edge cases and errors\n4. Optimise if performance matters\n5. Add tests and documentation\n\`\`\`\n\n💡 *Enhanced: Consider design patterns that match your use case — sometimes the right architecture matters more than the right algorithm.*`;
    }
    return base;
  }

  if (intent === "creative") {
    return `Here's a creative approach tailored to your request:\n\nThe best creative output comes from understanding the **audience**, **purpose**, and **tone** you're aiming for. I'd focus on:\n\n- **Clarity of message** — what's the core idea?\n- **Engaging structure** — hook the reader early\n- **Authentic voice** — let the content feel natural and purposeful`;
  }

  // General intermediate
  const base = `Here's a clear breakdown:\n\nThis topic has a few important dimensions worth understanding:\n\n- **Core idea** — ${getContextualPoint(q, 1)}\n- **Practical angle** — ${getContextualPoint(q, 2)}\n- **Key takeaway** — ${getContextualPoint(q, 3)}`;
  if (enhanced) {
    return base + `\n\n### Deeper Insight\nWhen you look at this from a broader perspective, the real value comes from understanding how these elements interact. Context matters — what works in one scenario may need adaptation in another.\n\n💡 *Enhanced analysis with contextual depth.*`;
  }
  return base;
}

function generateComplexResponse(query: string, intent: QueryIntent, enhanced: boolean): string {
  const q = query.toLowerCase();

  if (!enhanced) {
    return `## Detailed Analysis\n\nThis is a multi-layered topic that benefits from a structured approach.\n\n### Key Dimensions\n\n**1. Foundational Understanding**\n${getContextualPoint(q, 1)}. This forms the basis for everything that follows.\n\n**2. Practical Considerations**\n${getContextualPoint(q, 2)}. Real-world application requires balancing multiple factors.\n\n**3. Strategic Perspective**\n${getContextualPoint(q, 3)}. The long-term view often reveals insights that short-term thinking misses.\n\n### Summary\nThe most effective approach combines foundational knowledge with practical experience and strategic thinking. Each element reinforces the others.\n\nWant me to go deeper into any specific aspect?`;
  }

  return `## Comprehensive V10 Analysis\n\nLet me provide an in-depth exploration of this topic.\n\n### 1. Context & Background\n${getContextualPoint(q, 1)}. Understanding the broader context is essential before diving into specifics. The landscape has evolved significantly, and current best practices reflect lessons learned from years of iteration.\n\n### 2. Core Principles\nAt its foundation, this topic rests on several interconnected principles:\n- **Precision** — getting the details right matters more than speed\n- **Adaptability** — solutions must evolve with changing conditions\n- **Evidence-based reasoning** — decisions grounded in data outperform intuition alone\n\n### 3. Practical Framework\n\`\`\`\nPhase 1: Research and understand the problem space\nPhase 2: Identify key variables and constraints\nPhase 3: Develop and test your approach\nPhase 4: Iterate based on real feedback\nPhase 5: Optimise and scale what works\n\`\`\`\n\n### 4. Advanced Considerations\n${getContextualPoint(q, 2)}. When you move beyond the basics, the differentiating factor is often **depth of understanding** combined with **speed of execution**.\n\n### 5. Forward-Looking Perspective\nThe trends point toward greater integration of technology, data-driven approaches, and personalised solutions. ${getContextualPoint(q, 3)}.\n\n---\n\n💡 *V10 Enhanced — comprehensive analysis with structured depth and actionable frameworks.*\n\nWould you like me to expand on any section or explore a related angle?`;
}

function getContextualPoint(query: string, variant: number): string {
  const q = query.toLowerCase();

  // Try to extract meaningful context from the query
  const keywords = q.split(/\s+/).filter(w => w.length > 3 && !["what", "how", "the", "this", "that", "with", "from", "about", "which", "would", "should", "could", "does", "have", "been", "more", "most", "than", "into", "your", "their", "they", "when", "where", "will", "also", "each", "very", "some", "many"].includes(w));

  const points: Record<number, string[]> = {
    1: [
      "The fundamental principle here is understanding the relationship between inputs and outcomes",
      "At its core, this comes down to clarity of purpose and alignment of approach",
      "The starting point is always a solid understanding of the underlying mechanics",
    ],
    2: [
      "In practice, the most effective solutions balance simplicity with thoroughness",
      "Real-world application shows that iterative improvement outperforms trying to get it perfect the first time",
      "The practical reality often differs from theory — adaptability is key",
    ],
    3: [
      "The most impactful insight is that consistency and feedback loops drive long-term success",
      "What separates good from great is attention to the details that others overlook",
      "The key differentiator is applying knowledge with precision and purpose",
    ],
  };

  const options = points[variant] || points[1];
  // Use query length as a simple hash to vary responses
  const idx = (query.length + variant) % options.length;
  return options[idx];
}

// Deep/expanded version of an answer
export function generateDeepExpansion(originalAnswer: string, query: string): string {
  const complexity = detectComplexity(query);
  if (complexity === "simple") {
    return generateIntermediateResponse(query, detectIntent(query), true);
  }
  return generateComplexResponse(query, detectIntent(query), true);
}

// Upgrade an answer to enhanced quality
export function generateUpgradedAnswer(query: string): string {
  const intent = detectIntent(query);
  const complexity = detectComplexity(query);
  if (complexity === "simple") {
    return generateIntermediateResponse(query, intent, true);
  }
  return generateComplexResponse(query, intent, true);
}

export function generateResponse(query: string, isSignedIn: boolean): string {
  const complexity = detectComplexity(query);
  const intent = detectIntent(query);

  switch (complexity) {
    case "simple":
      return generateSimpleResponse(query, intent);
    case "intermediate":
      return generateIntermediateResponse(query, intent, isSignedIn);
    case "complex":
      return generateComplexResponse(query, intent, isSignedIn);
    default:
      return generateIntermediateResponse(query, intent, isSignedIn);
  }
}

export { detectComplexity, detectIntent };
export type { QueryComplexity, QueryIntent };
