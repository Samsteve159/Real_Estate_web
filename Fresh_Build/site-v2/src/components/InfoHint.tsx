import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ *
 *  InfoHint — a small ⓘ icon next to a field label. On hover (desktop)
 *  or tap (mobile) it reveals a one-line plain-language explanation of
 *  the term, so buyers who don't know the jargon get instant clarity.
 *  The revealed meaning is itself led by the ⓘ glyph.
 * ------------------------------------------------------------------ */

export default function InfoHint({ text }: { text: string }) {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false); // tap-to-keep-open on touch
  const ref = useRef<HTMLSpanElement>(null);

  const open = hovered || pinned;

  // Close a tapped-open hint when the user taps elsewhere.
  useEffect(() => {
    if (!pinned) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setPinned(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [pinned]);

  return (
    <span ref={ref} className="relative inline-flex align-middle" style={{ lineHeight: 0 }}>
      <button
        type="button"
        aria-label={`What this means: ${text}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        onClick={(e) => {
          e.preventDefault();
          setPinned((p) => !p);
        }}
        className="inline-flex items-center justify-center transition-colors"
        style={{ color: open ? "var(--color-gold)" : "var(--color-muted)", cursor: "help" }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="8" cy="4.6" r="0.95" fill="currentColor" />
          <path d="M8 7v4.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <span
          role="tooltip"
          className="absolute z-50 text-xs font-normal"
          style={{
            top: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            width: "max-content",
            maxWidth: "240px",
            padding: "8px 10px",
            background: "var(--color-surface-2, #161618)",
            border: "1px solid var(--color-line-gold, rgba(194,162,103,0.4))",
            borderRadius: "2px",
            color: "var(--color-text)",
            lineHeight: 1.45,
            letterSpacing: "0.005em",
            textTransform: "none",
            boxShadow: "0 14px 36px -12px rgba(0,0,0,0.75)",
            pointerEvents: "none",
            whiteSpace: "normal",
          }}
        >
          <span style={{ color: "var(--color-gold)", fontWeight: 600, marginRight: "5px" }}>ⓘ</span>
          {text}
        </span>
      )}
    </span>
  );
}
