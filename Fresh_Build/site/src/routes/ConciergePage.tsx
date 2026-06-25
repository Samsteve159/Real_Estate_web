import { useEffect, useRef, useState } from "react";
import { streamChat, type ChatMessage } from "../lib/api";

/* ------------------------------------------------------------------ *
 *  AI Buyer Concierge, full-page chat over /api/chat (SSE).
 *  The backend runs tool-use (search_listings, capture_lead) over the
 *  current listing book and records leads. Listings are mock until
 *  Vault RE is wired; the concierge swaps over with no UI change.
 * ------------------------------------------------------------------ */

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Hi, I'm Manifest's buyer concierge. Ask me about current listings, what a suburb's like, or your budget, e.g. \"3-bed houses under $1M near Newport\", and I can book you an inspection.",
};

const SUGGESTIONS = [
  "3-bed houses under $1M",
  "What's Newport like?",
  "Anything near Williamstown?",
  "I'd like to book an inspection",
];

export default function ConciergePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [toolNote, setToolNote] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, toolNote]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;
    setInput("");

    const history: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setStreaming(true);

    await streamChat(history, (e) => {
      if (e.type === "token") {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: next[next.length - 1].content + e.text };
          return next;
        });
      } else if (e.type === "tool") {
        setToolNote(e.name === "search_listings" ? "Searching the listings…" : "Booking you in…");
      } else if (e.type === "lead_captured") {
        setToolNote("◆ Booked in, Akshay will follow up");
        setTimeout(() => setToolNote(null), 2800);
      } else if (e.type === "done") {
        setStreaming(false);
        setToolNote(null);
      } else if (e.type === "error") {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: e.message };
          return next;
        });
        setStreaming(false);
        setToolNote(null);
      }
    });
  }

  return (
    <div style={{ background: "var(--color-bg)", paddingTop: "6rem" }}>
      <div className="max-w-3xl mx-auto px-6 pt-10 pb-6">
        <p className="eyebrow mb-4">AI Buyer Concierge</p>
        <h1 className="display mb-4" style={{ fontSize: "clamp(1.9rem, 4vw, 2.8rem)", color: "var(--color-text)" }}>
          A broker in your pocket.
        </h1>
        <p style={{ color: "var(--color-muted)", maxWidth: "52ch", lineHeight: 1.65 }}>
          Ask anything about buying with Manifest. The concierge searches our real listings, talks you
          through the suburbs, and can book an inspection on the spot. Grounded only in current stock,
          it never invents a property.
        </p>
      </div>

      {/* Chat shell */}
      <div className="max-w-3xl mx-auto px-6 pb-24">
        <div
          className="flex flex-col overflow-hidden border"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-line)", height: "min(60vh, 38rem)" }}
        >
          {/* Header strip */}
          <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: "var(--color-line)", background: "var(--color-surface-2)" }}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute h-2.5 w-2.5 rounded-full" style={{ background: "var(--color-gold)", opacity: 0.5, animation: "ping 1.8s cubic-bezier(0,0,0.2,1) infinite" }} />
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--color-gold)" }} />
            </span>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>Buyer Concierge</p>
              <p className="text-xs" style={{ color: "var(--color-dim)" }}>Manifest Real Estate · live</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 flex flex-col gap-4">
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} content={m.content} typing={streaming && i === messages.length - 1} />
            ))}
            {toolNote && <p className="text-xs italic ml-1" style={{ color: "var(--color-gold)" }}>{toolNote}</p>}

            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="px-3.5 py-2 text-xs transition-colors"
                    style={{ background: "var(--color-bg)", color: "var(--color-muted)", border: "1px solid var(--color-line)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-line-gold)"; e.currentTarget.style.color = "var(--color-gold)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-line)"; e.currentTarget.style.color = "var(--color-muted)"; }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex items-center gap-3 px-3 sm:px-4 py-3 border-t"
            style={{ borderColor: "var(--color-line)", background: "var(--color-surface-2)" }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a listing, a suburb, or your budget…"
              className="flex-1 px-4 py-3 text-sm bg-transparent outline-none border"
              style={{ color: "var(--color-text)", borderColor: "var(--color-line)", background: "var(--color-bg)" }}
            />
            <button
              type="submit"
              disabled={streaming || !input.trim()}
              className="h-11 w-11 flex items-center justify-center text-lg font-semibold transition-colors disabled:opacity-40"
              style={{ background: "var(--color-gold)", color: "var(--color-bg)" }}
              aria-label="Send"
            >
              →
            </button>
          </form>
        </div>

        <p className="text-xs mt-4" style={{ color: "var(--color-dim)" }}>
          The concierge only discusses Manifest's current listings. For a home valuation, use the{" "}
          <a href="/tools/valuation" className="gold-underline" style={{ color: "var(--color-gold)" }}>instant valuation tool</a>.
        </p>
      </div>

      <style>{`
        @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
        @keyframes blink { 0%, 100% { opacity: 0.25; } 50% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          @keyframes ping { from {} to {} }
          @keyframes blink { from {} to {} }
        }
      `}</style>
    </div>
  );
}

function Bubble({ role, content, typing }: { role: "user" | "assistant"; content: string; typing: boolean }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className="max-w-[85%] whitespace-pre-wrap px-4 py-2.5 text-sm"
        style={{
          lineHeight: 1.6,
          background: isUser ? "var(--color-gold)" : "var(--color-bg)",
          color: isUser ? "var(--color-bg)" : "var(--color-text)",
          border: isUser ? "none" : "1px solid var(--color-line)",
          borderRadius: isUser ? "10px 10px 2px 10px" : "10px 10px 10px 2px",
        }}
      >
        {content}
        {typing && content === "" && (
          <span className="inline-flex gap-1 items-center" style={{ height: "1.1em" }}>
            <Dot /> <Dot d={150} /> <Dot d={300} />
          </span>
        )}
      </div>
    </div>
  );
}

function Dot({ d = 0 }: { d?: number }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 rounded-full"
      style={{ background: "var(--color-gold)", animation: "blink 1s infinite", animationDelay: `${d}ms` }}
    />
  );
}
