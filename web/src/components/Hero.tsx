import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="contours relative overflow-hidden border-b hairline">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-7">
          <p className="eyebrow rise text-teal" style={{ animationDelay: "0ms" }}>
            Melbourne's inner &amp; outer west
          </p>

          <h1 className="display mt-6 text-6xl text-ink sm:text-7xl md:text-8xl">
            <span className="rise block" style={{ animationDelay: "80ms" }}>
              Where dreams
            </span>
            <span className="rise block" style={{ animationDelay: "200ms" }}>
              meet <span className="italic text-terra">reality</span>.
            </span>
          </h1>

          <p
            className="rise mt-8 max-w-lg text-lg leading-relaxed text-muted"
            style={{ animationDelay: "320ms" }}
          >
            Two AI tools your average agency can't offer: an{" "}
            <span className="text-ink">instant home valuation</span> grounded in real
            local sales, and a <span className="text-ink">24/7 buyer concierge</span>{" "}
            that knows every listing on the books.
          </p>

          <div
            className="rise mt-10 flex flex-wrap items-center gap-4"
            style={{ animationDelay: "440ms" }}
          >
            <Link
              to="/valuation"
              className="group inline-flex items-center gap-3 rounded-full bg-navy px-7 py-4 text-paper transition-colors hover:bg-navy-soft"
            >
              <span className="font-semibold">Value my home in 30 seconds</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <a
              href="#listings"
              className="link-underline pb-1 text-ink"
            >
              or browse the listings
            </a>
          </div>
        </div>

        {/* Editorial stat card — gives the hero a confident right-hand anchor. */}
        <div
          className="rise md:col-span-5 md:pl-6"
          style={{ animationDelay: "520ms" }}
        >
          <div className="relative rounded-2xl border hairline bg-paper p-7 shadow-[0_30px_60px_-30px_rgba(13,27,42,0.35)]">
            <p className="eyebrow text-terra">The opportunity</p>
            <p className="display mt-4 text-5xl text-ink">87%</p>
            <p className="mt-1 text-sm text-muted">
              of agencies now use AI daily — yet almost none give buyers and sellers
              a tool like this.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-5 border-t hairline pt-6">
              <div>
                <p className="display text-3xl text-teal">7</p>
                <p className="eyebrow mt-1 text-muted">Service suburbs</p>
              </div>
              <div>
                <p className="display text-3xl text-teal">24/7</p>
                <p className="eyebrow mt-1 text-muted">Concierge</p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-muted">
              <span className="h-2 w-2 animate-pulse rounded-full bg-teal-bright" />
              Powered by Claude · indicative estimates only
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
