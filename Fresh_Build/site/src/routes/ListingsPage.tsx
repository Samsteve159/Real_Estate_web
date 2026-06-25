import { useReveal } from "../lib/useReveal";
import { MOCK_LISTINGS } from "../lib/mockListings";
import type { Listing } from "../lib/mockListings";
import { Link } from "react-router-dom";

export default function ListingsPage() {
  const ref = useReveal(0.1) as React.RefObject<HTMLElement>;

  return (
    <div style={{ background: "var(--color-bg)", paddingTop: "6rem" }}>
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="max-w-7xl mx-auto px-6 py-20"
      >
        <div className="reveal mb-12">
          <p className="eyebrow mb-4">Current listings</p>
          <h1
            className="display mb-5"
            style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "var(--color-text)" }}
          >
            Properties worth your time.
          </h1>
          <p style={{ color: "var(--color-muted)", maxWidth: "44ch", lineHeight: 1.65 }}>
            Carefully selected properties for first-home buyers and early investors. Real listings load once Vault RE is connected.
          </p>
        </div>

        {/* Placeholder notice */}
        <div
          className="reveal mb-10 px-4 py-3 text-xs flex items-center gap-2 border"
          style={{
            background: "rgba(194,162,103,0.06)",
            borderColor: "var(--color-line-gold)",
            color: "var(--color-dim)",
          }}
        >
          <span style={{ color: "var(--color-gold)" }}>◈</span>
          These are placeholder listings. Real properties load automatically via the Vault RE integration.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_LISTINGS.map((listing, i) => (
            <ListingCard key={listing.id} listing={listing} delay={i * 60} />
          ))}
        </div>

        {/* Appraisal CTA */}
        <div
          className="reveal mt-20 p-10 border flex flex-col items-start gap-6"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-line)" }}
        >
          <p className="eyebrow">Not seeing the right fit?</p>
          <h2
            className="display"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", color: "var(--color-text)", maxWidth: "30ch" }}
          >
            Tell us what you're looking for.
          </h2>
          <p style={{ color: "var(--color-muted)", maxWidth: "44ch", lineHeight: 1.65 }}>
            Akshay works with a wide network across Melbourne. A quick conversation might surface an off-market property that fits.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold transition-colors"
            style={{ background: "var(--color-gold)", color: "var(--color-bg)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--color-gold-bright)")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--color-gold)")}
          >
            Get in touch
          </Link>
        </div>
      </div>
    </div>
  );
}

function ListingCard({ listing, delay }: { listing: Listing; delay: number }) {
  const statusStyles: Record<Listing["status"], { bg: string; text: string }> = {
    "For Sale":    { bg: "rgba(194,162,103,0.15)", text: "var(--color-gold)" },
    "Under Offer": { bg: "rgba(0,57,112,0.25)",    text: "#5b9bd5" },
    "Sold":        { bg: "rgba(255,255,255,0.06)",  text: "var(--color-muted)" },
  };
  const s = statusStyles[listing.status];

  return (
    <article
      className="reveal card-lift group overflow-hidden border"
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-line)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
        <img
          src={listing.imageUrl}
          alt={`${listing.address}, ${listing.suburb}, placeholder`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-4 left-4">
          <span
            className="px-3 py-1 text-xs font-semibold uppercase"
            style={{ background: s.bg, color: s.text, backdropFilter: "blur(8px)", letterSpacing: "0.15em" }}
          >
            {listing.status}
          </span>
        </div>
      </div>
      <div className="p-6">
        <p className="font-semibold mb-1 text-sm" style={{ color: "var(--color-text)" }}>
          {listing.address}
        </p>
        <p className="text-sm mb-4" style={{ color: "var(--color-muted)" }}>
          {listing.suburb}, {listing.state} {listing.postcode}
        </p>
        <div
          className="flex gap-5 text-xs mb-4 pb-4 border-b"
          style={{ borderColor: "var(--color-line)", color: "var(--color-dim)" }}
        >
          <span>{listing.bedrooms} bd</span>
          <span>{listing.bathrooms} ba</span>
          <span>{listing.parking} pk</span>
          <span>{listing.propertyType}</span>
        </div>
        <p className="font-semibold" style={{ color: "var(--color-gold)" }}>{listing.price}</p>
      </div>
    </article>
  );
}
