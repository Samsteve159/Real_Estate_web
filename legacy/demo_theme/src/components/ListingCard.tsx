import type { Listing } from "../lib/api";

const SPEC_ICONS: Record<string, string> = {
  beds: "◖",
  baths: "◗",
  cars: "▭",
};

export default function ListingCard({ listing, index }: { listing: Listing; index: number }) {
  return (
    <article className="group relative flex flex-col rounded-2xl border hairline bg-paper p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_50px_-28px_rgba(13,27,42,0.4)]">
      <div className="flex items-start justify-between">
        <span className="display text-5xl text-bone-deep transition-colors group-hover:text-teal-pale">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="eyebrow rounded-full bg-bone px-3 py-1.5 text-muted">
          {listing.type}
        </span>
      </div>

      <h3 className="display mt-4 text-2xl leading-tight text-ink">{listing.headline}</h3>
      <p className="mt-2 text-sm font-medium text-muted">{listing.address}</p>

      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted/90">{listing.blurb}</p>

      <div className="mt-5 flex flex-wrap gap-3 text-xs text-ink">
        <Spec label={`${listing.beds} bed`} icon={SPEC_ICONS.beds} />
        <Spec label={`${listing.baths} bath`} icon={SPEC_ICONS.baths} />
        <Spec label={`${listing.cars} car`} icon={SPEC_ICONS.cars} />
        {listing.landSize > 0 && <Spec label={`${listing.landSize}m²`} icon="▦" />}
      </div>

      <div className="mt-6 flex items-end justify-between border-t hairline pt-4">
        <div>
          <p className="eyebrow text-muted">Guide</p>
          <p className="font-display text-xl text-terra">{listing.price}</p>
        </div>
        <span className="eyebrow text-teal">{listing.suburb}</span>
      </div>
    </article>
  );
}

function Spec({ label, icon }: { label: string; icon: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border hairline px-2.5 py-1">
      <span className="text-teal">{icon}</span>
      {label}
    </span>
  );
}
