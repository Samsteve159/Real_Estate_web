import { Link } from "react-router-dom";
import { useReveal } from "../lib/useReveal";
import { MOCK_LISTINGS } from "../lib/mockListings";
import type { Listing } from "../lib/mockListings";

/*
 * Shows the first 6 mock listings as image-dominant cards.
 * PLACEHOLDER NOTE: All data and images are mock.
 * Replace MOCK_LISTINGS with Vault RE API data when Akshay's key is in place.
 */

const STATUS_STYLES: Record<Listing["status"], { bg: string; text: string }> = {
  "For Sale":    { bg: "rgba(194,162,103,0.15)", text: "var(--color-gold)" },
  "Under Offer": { bg: "rgba(0,57,112,0.25)",    text: "#5b9bd5" },
  "Sold":        { bg: "rgba(255,255,255,0.06)",  text: "var(--color-muted)" },
};

export default function ListingsPreview() {
  const ref = useReveal(0.1) as React.RefObject<HTMLElement>;

  return (
    <section
      ref={ref as React.RefObject<HTMLDivElement>}
      className="section-pad"
      style={{ background: "var(--color-surface)" }}
      id="listings"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Section header */}
        <div className="reveal flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <p className="eyebrow mb-4">Current listings</p>
            <h2
              className="display"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "var(--color-text)" }}
            >
              Properties worth knowing about.
            </h2>
          </div>
          <div>
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 text-sm font-medium gold-underline pb-px"
              style={{ color: "var(--color-muted)" }}
            >
              View all listings
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>

        {/* Placeholder data notice */}
        <div
          className="reveal mb-10 px-4 py-3 text-xs flex items-center gap-2 border rounded-none"
          style={{
            background: "rgba(194,162,103,0.06)",
            borderColor: "var(--color-line-gold)",
            color: "var(--color-dim)",
          }}
        >
          <span style={{ color: "var(--color-gold)" }}>◈</span>
          Placeholder listings, real properties load automatically once the Vault RE connection is set up.
        </div>

        {/* Listings grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_LISTINGS.map((listing, i) => (
            <ListingCard key={listing.id} listing={listing} delay={i * 60} />
          ))}
        </div>

        {/* Vault RE CTA band */}
        <div
          className="reveal mt-14 p-8 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          style={{ borderColor: "var(--color-line)", background: "var(--color-surface-2)" }}
        >
          <div>
            <p className="eyebrow mb-2">Thinking of selling?</p>
            <p style={{ color: "var(--color-muted)", maxWidth: "44ch", fontSize: "0.95rem", lineHeight: 1.6 }}>
              See an indicative value on your home in seconds, then sell with someone who shows you the numbers behind every move.
            </p>
          </div>
          <Link
            to="/tools/valuation"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-colors duration-200"
            style={{ background: "var(--color-gold)", color: "var(--color-bg)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--color-gold-bright)")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--color-gold)")}
          >
            Sell with us
          </Link>
        </div>
      </div>
    </section>
  );
}

function ListingCard({ listing, delay }: { listing: Listing; delay: number }) {
  const statusStyle = STATUS_STYLES[listing.status];

  return (
    <article
      className="reveal card-lift group overflow-hidden border"
      style={{
        background: "var(--color-bg)",
        borderColor: "var(--color-line)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
        <img
          src={listing.imageUrl}
          alt={`${listing.address}, ${listing.suburb}, placeholder image`}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {/* Status badge */}
        <div className="absolute top-4 left-4">
          <span
            className="px-3 py-1 text-xs font-semibold uppercase tracking-widest"
            style={{
              background: statusStyle.bg,
              color: statusStyle.text,
              backdropFilter: "blur(8px)",
              letterSpacing: "0.15em",
            }}
          >
            {listing.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p
          className="font-semibold mb-1"
          style={{ color: "var(--color-text)", fontSize: "0.95rem" }}
        >
          {listing.address}
        </p>
        <p className="text-sm mb-5" style={{ color: "var(--color-muted)" }}>
          {listing.suburb}, {listing.state} {listing.postcode}
        </p>

        {/* Meta row */}
        <div
          className="flex items-center gap-5 text-xs mb-5 pb-5 border-b"
          style={{ borderColor: "var(--color-line)", color: "var(--color-dim)" }}
        >
          <span className="flex items-center gap-1.5">
            <BedIcon /> {listing.bedrooms}
          </span>
          <span className="flex items-center gap-1.5">
            <BathIcon /> {listing.bathrooms}
          </span>
          <span className="flex items-center gap-1.5">
            <CarIcon /> {listing.parking}
          </span>
          <span>{listing.propertyType}</span>
        </div>

        {/* Price */}
        <p
          className="font-semibold text-lg"
          style={{ color: "var(--color-gold)", letterSpacing: "-0.01em" }}
        >
          {listing.price}
        </p>
      </div>
    </article>
  );
}

/* Minimal icon set, no external dependency */
function BedIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-label="Bedrooms">
      <rect x="1" y="6" width="12" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M1 6V4a1 1 0 011-1h10a1 1 0 011 1v2" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="3" y="4" width="3" height="2" rx="0.5" stroke="currentColor" strokeWidth="1"/>
      <rect x="8" y="4" width="3" height="2" rx="0.5" stroke="currentColor" strokeWidth="1"/>
    </svg>
  );
}
function BathIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-label="Bathrooms">
      <path d="M2 7h10v2a4 4 0 01-4 4H6a4 4 0 01-4-4V7z" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M4 7V3a1.5 1.5 0 013 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}
function CarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-label="Parking">
      <rect x="1" y="5" width="12" height="7" rx="1" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M1 8h12" stroke="currentColor" strokeWidth="1"/>
      <circle cx="3.5" cy="12" r="1" fill="currentColor"/>
      <circle cx="10.5" cy="12" r="1" fill="currentColor"/>
      <path d="M3 5l1.5-3h5L11 5" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  );
}
