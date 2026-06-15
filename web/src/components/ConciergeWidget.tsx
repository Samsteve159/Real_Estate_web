import { useEffect, useRef, useState } from "react";
import { streamChat, type ChatMessage } from "../lib/api";

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm Manifest's buyer concierge. Ask me about listings, suburbs, or budgets — e.g. \"3-beds under $1M near Newport\" — and I can book you an inspection.",
};

const SUGGESTIONS = [
  "3-bed houses under $1M",
  "What's Newport like?",
  "Anything near Williamstown beach?",
];

export default function ConciergeWidget({ inline = false }: { inline?: boolean }) {
  // Inline (iframe embed) mode renders the panel always-open and full-frame,
  // with no floating launcher.
  const [open, setOpen] = useState(inline);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [toolNote, setToolNote] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, toolNote, open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;
    setInput("");

    const history: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    // Show the user turn + an empty assistant turn we'll stream into.
    setMessages([...history, { role: "assistant", content: "" }]);
    setStreaming(true);

    await streamChat(history, (e) => {
      if (e.type === "token") {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            role: "assistant",
            content: next[next.length - 1].content + e.text,
          };
          return next;
        });
      } else if (e.type === "tool") {
        setToolNote(
          e.name === "search_listings" ? "Searching the listings…" : "Booking you in…",
        );
      } else if (e.type === "lead_captured") {
        setToolNote("✦ Lead captured — the agent will follow up");
        setTimeout(() => setToolNote(null), 2600);
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

  const panelClass = inline
    ? "flex h-full w-full flex-col overflow-hidden bg-bone"
    : "pop fixed bottom-[5.5rem] right-4 z-50 flex h-[min(34rem,75svh)] w-[calc(100vw-2rem)] max-w-[24rem] flex-col overflow-hidden rounded-2xl border hairline bg-bone shadow-[0_40px_80px_-20px_rgba(13,27,42,0.55)] sm:right-6 sm:w-[calc(100vw-3rem)]";

  return (
    <>
      {/* Launcher — hidden in inline embed mode */}
      {!inline && (
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Open buyer concierge"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-teal py-3.5 pl-4 pr-5 text-paper shadow-[0_20px_40px_-12px_rgba(31,122,110,0.7)] transition-transform hover:scale-105"
        >
          <span className="relative flex h-3 w-3">
            <span className="absolute h-3 w-3 animate-ping rounded-full bg-amber/80" />
            <span className="h-3 w-3 rounded-full bg-amber" />
          </span>
          <span className="text-sm font-semibold">
            <span className="sm:hidden">{open ? "Close" : "Concierge"}</span>
            <span className="hidden sm:inline">{open ? "Close" : "Ask the concierge"}</span>
          </span>
        </button>
      )}

      {/* Panel */}
      {(inline || open) && (
        <div className={panelClass}>
          {/* Header */}
          <div className="flex items-center gap-3 border-b hairline bg-navy px-5 py-4 text-bone">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal">
              <span className="display text-lg">M</span>
            </span>
            <div>
              <p className="text-sm font-semibold">Buyer Concierge</p>
              <p className="text-xs text-bone/60">Manifest Real Estate · live</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} content={m.content} streaming={streaming && i === messages.length - 1} />
            ))}
            {toolNote && (
              <p className="ml-1 text-xs italic text-teal">{toolNote}</p>
            )}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border hairline bg-paper px-3 py-1.5 text-xs text-muted transition-colors hover:border-teal hover:text-teal"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t hairline bg-paper px-3 py-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a listing or suburb…"
              className="flex-1 rounded-full border hairline bg-bone px-4 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-teal focus:outline-none"
            />
            <button
              type="submit"
              disabled={streaming || !input.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-teal text-paper transition-colors hover:bg-teal-bright disabled:opacity-40"
              aria-label="Send"
            >
              →
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function Bubble({
  role,
  content,
  streaming,
}: {
  role: "user" | "assistant";
  content: string;
  streaming: boolean;
}) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-sm bg-navy text-bone"
            : "rounded-bl-sm border hairline bg-paper text-ink"
        }`}
      >
        {content}
        {streaming && content === "" && (
          <span className="inline-flex gap-1">
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
      className="inline-block h-1.5 w-1.5 rounded-full bg-teal"
      style={{ animation: "blink 1s infinite", animationDelay: `${d}ms` }}
    />
  );
}
