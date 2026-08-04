import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useReveal } from "../lib/useReveal";
import { getVaultListingDetail, submitLead, type ListingDetail } from "../lib/api";

/*
 * One property, in full: gallery, price/meta, description, agent, enquiry
 * form. Reached by clicking a card on /listings or the homepage preview.
 * Mock ids resolve locally (see api.ts); everything else is live from
 * Vault RE via /api/vault/listings/:id.
 */

const STATUS_STYLES: Record<ListingDetail["status"], { bg: string; text: string }> = {
  "For Sale":    { bg: "rgba(194,162,103,0.15)", text: "var(--color-gold)" },
  "Under Offer": { bg: "rgba(0,57,112,0.25)",    text: "#5b9bd5" },
  "Sold":        { bg: "rgba(255,255,255,0.06)", text: "var(--color-muted)" },
};

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const ref = useReveal(0.06) as React.RefObject<HTMLElement>;
  const [listing, setListing] = useState<ListingDetail | null | undefined>(undefined); // undefined = loading
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    let active = true;
    setListing(undefined);
    setActiveImage(0);
    if (!id) {
      setListing(null);
      return;
    }
    getVaultListingDetail(id).then((result) => {
      if (active) setListing(result);
    });
    return () => { active = false; };
  }, [id]);

  if (listing === undefined) {
    return (
      <div style={{ background: "var(--color-bg)", paddingTop: "9rem", minHeight: "60vh" }}>
        <div className="max-w-6xl mx-auto px-6 py-20" style={{ color: "var(--color-dim)" }}>Loading…</div>
      </div>
    );
  }

  if (listing === null) {
    return (
      <div style={{ background: "var(--color-bg)", paddingTop: "9rem", minHeight: "60vh" }}>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p className="eyebrow mb-4">Not found</p>
          <h1 className="display mb-5" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "var(--color-text)" }}>
            This listing may have sold or been removed.
          </h1>
          <Link to="/listings" className="text-sm font-medium gold-underline pb-px" style={{ color: "var(--color-gold)" }}>
            ← Back to all listings
          </Link>
        </div>
      </div>
    );
  }

  const s = STATUS_STYLES[listing.status];
  const images = listing.images.length ? listing.images : [listing.imageUrl];

  return (
    <div style={{ background: "var(--color-bg)", paddingTop: "9rem" }}>
      <div ref={ref as React.RefObject<HTMLDivElement>} className="max-w-6xl mx-auto px-6 py-16">
        <Link
          to="/listings"
          className="reveal inline-flex items-center gap-2 text-sm font-medium gold-underline pb-px mb-8"
          style={{ color: "var(--color-muted)" }}
        >
          ← All listings
        </Link>

        {listing.isPlaceholder && (
          <div
            className="reveal mb-8 px-4 py-3 text-xs flex items-center gap-2 border"
            style={{ background: "rgba(194,162,103,0.06)", borderColor: "var(--color-line-gold)", color: "var(--color-dim)" }}
          >
            <span style={{ color: "var(--color-gold)" }}>◈</span>
            This is a placeholder listing. Full details load automatically once Vault RE is connected.
          </div>
        )}

        {/* Gallery */}
        <div className="reveal mb-10">
          <div className="border overflow-hidden" style={{ borderColor: "var(--color-line)", aspectRatio: "16/9" }}>
            <img
              src={images[activeImage]}
              alt={`${listing.address}, ${listing.suburb}`}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 mt-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setActiveImage(i)}
                  className="shrink-0 border overflow-hidden"
                  style={{
                    width: 88,
                    height: 66,
                    borderColor: i === activeImage ? "var(--color-gold)" : "var(--color-line)",
                    opacity: i === activeImage ? 1 : 0.6,
                  }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
          <div className="reveal">
            <div className="flex items-center gap-3 mb-4">
              <span
                className="px-3 py-1 text-xs font-semibold uppercase"
                style={{ background: s.bg, color: s.text, letterSpacing: "0.15em" }}
              >
                {listing.status}
              </span>
              <span className="text-xs" style={{ color: "var(--color-dim)" }}>{listing.propertyType}</span>
            </div>

            <h1 className="display mb-2" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "var(--color-text)" }}>
              {listing.address}
            </h1>
            <p className="text-base mb-6" style={{ color: "var(--color-muted)" }}>
              {listing.suburb}, {listing.state} {listing.postcode}
            </p>

            <p className="font-display font-semibold mb-8" style={{ color: "var(--color-gold)", fontSize: "1.6rem" }}>
              {listing.price}
            </p>

            <div
              className="flex flex-wrap gap-x-8 gap-y-3 text-sm mb-8 pb-8 border-b"
              style={{ borderColor: "var(--color-line)", color: "var(--color-text)" }}
            >
              <MetaItem label="Bedrooms" value={listing.bedrooms} />
              <MetaItem label="Bathrooms" value={listing.bathrooms} />
              <MetaItem label="Parking" value={listing.parking} />
              {listing.landSize && <MetaItem label="Land size" value={listing.landSize} />}
            </div>

            {listing.description && (
              <p style={{ color: "var(--color-muted)", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
                {listing.description}
              </p>
            )}

            {listing.agentName && (
              <div className="mt-10 p-6 border" style={{ borderColor: "var(--color-line)", background: "var(--color-surface)" }}>
                <p className="eyebrow mb-2">Listing agent</p>
                <p className="font-semibold" style={{ color: "var(--color-text)" }}>{listing.agentName}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-sm">
                  {listing.agentPhone && (
                    <a href={`tel:${listing.agentPhone}`} className="gold-underline pb-px" style={{ color: "var(--color-gold)" }}>
                      {listing.agentPhone}
                    </a>
                  )}
                  {listing.agentEmail && (
                    <a href={`mailto:${listing.agentEmail}`} className="gold-underline pb-px" style={{ color: "var(--color-gold)" }}>
                      {listing.agentEmail}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="reveal">
            <EnquiryForm listing={listing} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string | number }) {
  return (
    <span>
      <span style={{ color: "var(--color-dim)" }}>{label}: </span>
      <span className="font-semibold">{value}</span>
    </span>
  );
}

function EnquiryForm({ listing }: { listing: ListingDetail }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(`I'm interested in ${listing.address}, ${listing.suburb}.`);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErr("");
    try {
      await submitLead({
        source: "contact",
        intent: "listing-enquiry",
        name,
        email,
        phone,
        address: listing.address,
        suburb: listing.suburb,
        message,
      });
      setStatus("done");
    } catch (e) {
      setStatus("error");
      setErr(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  };

  if (status === "done") {
    return (
      <div className="p-6 border" style={{ borderColor: "var(--color-line-gold)", background: "var(--color-surface)" }}>
        <p className="text-sm" style={{ color: "var(--color-text)", lineHeight: 1.55 }}>
          <span style={{ color: "var(--color-gold)" }}>◆</span> Thanks {name.split(" ")[0] || "there"} — a RE representative will be in touch about this property shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="p-6 border flex flex-col gap-4" style={{ borderColor: "var(--color-line)", background: "var(--color-surface)" }}>
      <p className="font-display font-semibold" style={{ color: "var(--color-text)", fontSize: "1.05rem" }}>
        Enquire about this property
      </p>
      <input
        required
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="px-3 py-2.5 text-sm border bg-transparent"
        style={{ borderColor: "var(--color-line)", color: "var(--color-text)" }}
      />
      <input
        required
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-3 py-2.5 text-sm border bg-transparent"
        style={{ borderColor: "var(--color-line)", color: "var(--color-text)" }}
      />
      <input
        placeholder="Phone (optional)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="px-3 py-2.5 text-sm border bg-transparent"
        style={{ borderColor: "var(--color-line)", color: "var(--color-text)" }}
      />
      <textarea
        required
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="px-3 py-2.5 text-sm border bg-transparent resize-none"
        style={{ borderColor: "var(--color-line)", color: "var(--color-text)" }}
      />
      {status === "error" && <p className="text-xs" style={{ color: "#d98a80" }}>{err}</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="px-6 py-3 text-sm font-semibold transition-colors duration-200 disabled:opacity-60"
        style={{ background: "var(--color-gold)", color: "var(--color-bg)" }}
      >
        {status === "sending" ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
