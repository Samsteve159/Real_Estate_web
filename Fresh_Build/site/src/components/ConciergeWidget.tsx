import { useEffect, useRef, useState } from "react";
import { streamChat, type ChatMessage } from "../lib/api";

/* ------------------------------------------------------------------ *
 *  Floating AI Buyer Concierge.
 *  Fixed bottom-right launcher + popup panel, present on every page.
 *  Opens on click, or when any element dispatches the
 *  "manifest:open-concierge" window event (used by the Tools menu).
 * ------------------------------------------------------------------ */

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Hi, I'm Manifest's buyer concierge. Ask me about current listings, what a suburb is like, or your budget, e.g. \"3-bed houses under $1M near Newport\", and I can book you an inspection.",
};

const SUGGESTIONS = ["3-bed houses under $1M", "What's Newport like?", "Book an inspection"];

export default function ConciergeWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [toolNote, setToolNote] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Let other components (Tools menu) open the bot.
  useEffect(() => {
    const openIt = () => setOpen(true);
    window.addEventListener("manifest:open-concierge", openIt);
    return () => window.removeEventListener("manifest:open-concierge", openIt);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, toolNote, open]);

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
    <>
      {/* Panel */}
      {open && (
        <div
          className="fixed z-50 flex flex-col overflow-hidden border shadow-2xl"
          style={{
            bottom: "5.5rem",
            right: "1.5rem",
            width: "min(24rem, calc(100vw - 2rem))",
            height: "min(32rem, calc(100svh - 9rem))",
            background: "var(--color-surface)",
            borderColor: "var(--color-line)",
            boxShadow: "0 30px 70px -20px rgba(0,0,0,0.7)",
            animation: "concierge-in 0.28s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b" style={{ borderColor: "var(--color-line)", background: "var(--color-surface-2)" }}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute h-2.5 w-2.5 rounded-full" style={{ background: "var(--color-gold)", opacity: 0.5, animation: "ping 1.8s cubic-bezier(0,0,0.2,1) infinite" }} />
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--color-gold)" }} />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>Buyer Concierge</p>
              <p className="text-xs" style={{ color: "var(--color-dim)" }}>Manifest Real Estate · live</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close concierge" className="p-1 text-lg leading-none" style={{ color: "var(--color-muted)" }}>×</button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
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
                    className="px-3 py-1.5 text-xs transition-colors"
                    style={{ background: "var(--color-bg)", color: "var(--color-muted)", border: "1px solid var(--color-line)" }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Composer */}
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2 px-3 py-3 border-t" style={{ borderColor: "var(--color-line)", background: "var(--color-surface-2)" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a listing or suburb…"
              className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none border"
              style={{ color: "var(--color-text)", borderColor: "var(--color-line)", background: "var(--color-bg)" }}
            />
            <button
              type="submit"
              disabled={streaming || !input.trim()}
              className="h-10 w-10 flex items-center justify-center text-lg font-semibold transition-colors disabled:opacity-40 shrink-0"
              style={{ background: "var(--color-gold)", color: "var(--color-bg)" }}
              aria-label="Send"
            >→</button>
          </form>
        </div>
      )}

      {/* Launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close buyer concierge" : "Open buyer concierge"}
        className="fixed z-50 flex items-center gap-2.5 transition-transform hover:scale-105"
        style={{
          bottom: "1.5rem",
          right: "1.5rem",
          background: "var(--color-gold)",
          color: "var(--color-bg)",
          padding: "0.85rem 1.25rem",
          borderRadius: "999px",
          boxShadow: "0 16px 36px -10px rgba(194,162,103,0.55)",
        }}
      >
        {open ? (
          <span className="text-base leading-none font-semibold">Close</span>
        ) : (
          <>
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute h-2.5 w-2.5 rounded-full" style={{ background: "var(--color-bg)", opacity: 0.45, animation: "ping 1.8s cubic-bezier(0,0,0.2,1) infinite" }} />
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--color-bg)" }} />
            </span>
            <span className="text-sm font-semibold">Ask the concierge</span>
          </>
        )}
      </button>

      <style>{`
        @keyframes concierge-in { from { opacity: 0; transform: translateY(16px) scale(0.98); } to { opacity: 1; transform: none; } }
        @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
        @keyframes blink { 0%, 100% { opacity: 0.25; } 50% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          @keyframes concierge-in { from {} to {} }
          @keyframes ping { from {} to {} }
          @keyframes blink { from {} to {} }
        }
      `}</style>
    </>
  );
}

function Bubble({ role, content, typing }: { role: "user" | "assistant"; content: string; typing: boolean }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className="max-w-[88%] whitespace-pre-wrap px-3.5 py-2.5 text-sm"
        style={{
          lineHeight: 1.55,
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
  return <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "var(--color-gold)", animation: "blink 1s infinite", animationDelay: `${d}ms` }} />;
}
