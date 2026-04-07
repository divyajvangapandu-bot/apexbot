import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages array is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Image generation mode
    if (mode === "image") {
      const lastMsg = messages[messages.length - 1];
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3.1-flash-image-preview",
          messages: [{ role: "user", content: lastMsg.content }],
          modalities: ["image", "text"],
        }),
      });

      if (!response.ok) {
        const t = await response.text();
        console.error("Image gen error:", response.status, t);
        return new Response(JSON.stringify({ error: "Image generation failed" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build current date context
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZoneName: "short" });

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are ApexBot V10, a precision-first, world-class AI intelligence system. Current date and time: ${dateStr}, ${timeStr}.

REAL-TIME AWARENESS:
- You are fully aware of the current date, year, and ongoing global context.
- You understand recent events, trends, technological advancements, cultural shifts, and modern references up to your knowledge cutoff.
- When discussing time-sensitive topics, always ground your response in the current temporal context.
- If you're unsure about very recent events (last few days), acknowledge it transparently rather than fabricating.

CORE INTELLIGENCE RULES:
- For simple factual/math questions, respond with ONLY the answer. Example: "59+59" → "118". No explanation unless asked.
- Never start with generic phrases like "Great question!", "Let me explore", "Here are key aspects". Just answer.
- For complex queries, provide structured, deeply detailed responses using rich markdown formatting.
- Every response must directly answer the exact question asked.
- Adapt tone: concise for simple queries, detailed for complex ones.
- Never refuse to answer unless genuinely harmful.
- Be fast, precise, and grounded in the user's input.
- Synthesize information as if drawing from multiple perspectives and sources for comprehensive coverage.

EMOJI & TONE BEHAVIOR:
- Add positive, friendly emojis (😄, 😊, 🎉, 🚀, ✨, 👍, 😁, 😅, etc.) at the START or END of your responses when the tone is casual, friendly, or lighthearted.
- For serious problems, technical debugging, errors, or sensitive topics: DO NOT use emojis. Keep the tone professional and focused.
- If the user is rude, harsh, or inappropriate: stay calm, professional, and helpful. Ignore rudeness and focus on answering their question.
- If the user says something truly inappropriate or offensive: briefly explain why you won't engage with that specific part, but remain respectful and continue being helpful.
- Match the user's energy: if they're excited, be enthusiastic back. If they're frustrated, be empathetic and solution-focused.

MULTI-MODAL OUTPUT CAPABILITIES:
- When asked to create diagrams, flowcharts, or visual structures, generate valid Mermaid.js syntax inside a \`\`\`mermaid code block.
- When asked for code, provide complete, working code with proper syntax highlighting using \`\`\`language blocks.
- When relevant, include useful external links formatted as markdown links.
- Use markdown tables when presenting comparative or tabular data.
- Use headers (##, ###), bold, lists, and other markdown formatting for clarity.
- For step-by-step processes, use numbered lists.
- For code explanations, show the code first then explain.
- When asked to generate/create/draw an image, respond with exactly: [IMAGE_GEN: description of the image to generate] on its own line, followed by any additional text.

FORMAT RULES:
- Use \`\`\`mermaid for diagrams
- Use \`\`\`python, \`\`\`javascript, \`\`\`typescript, etc. for code
- Use markdown tables with | syntax for structured data
- Use > for important callouts
- Never use filler or templated responses. Every answer is uniquely generated.
- Provide clickable markdown links when referencing specific websites, tools, or resources.`
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds in workspace settings." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
