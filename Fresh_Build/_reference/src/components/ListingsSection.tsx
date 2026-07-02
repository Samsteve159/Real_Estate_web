import { useEffect, useState } from "react";
import { getListings, type Listing } from "../lib/api";
import ListingCard from "./ListingCard";

export default function ListingsSection() {
  const [listings, setListings] = useState<Listing[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getListings()
      .then(setListings)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <section id="listings" className="mx-auto max-w-7xl scroll-mt-20 px-6 py-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-terra">On the market</p>
          <h2 className="display mt-3 text-5xl text-ink sm:text-6xl">
            Currently for sale
          </h2>
        </div>
        <p className="max-w-sm text-sm text-muted">
          A live snapshot across the inner west. Ask the concierge for anything
          specific — it searches these in real time.
        </p>
      </div>

      {error && (
        <p className="mt-12 rounded-xl border hairline bg-paper p-6 text-sm text-terra">
          Couldn't load listings: {error}. Is the API running on :8787?
        </p>
      )}

      {!listings && !error && (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-2xl border hairline bg-paper/60"
            />
          ))}
        </div>
      )}

      {listings && (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((l, i) => (
            <ListingCard key={l.id} listing={l} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
