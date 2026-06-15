import ConciergeWidget from "../components/ConciergeWidget";

/**
 * Chrome-less concierge for iframe embedding — renders the chat panel inline,
 * always-open, filling the iframe (the host sets a fixed iframe height).
 */
export default function EmbedConcierge() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-bone">
      <ConciergeWidget inline />
    </div>
  );
}
