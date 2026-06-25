import { Link } from "react-router-dom";

/*
 * ================================================================== *
 *  MotionHero
 *
 *  ASSET SWAP POINT, Akshay's footage:
 *    1. Place the video file at:  public/hero/hero.mp4
 *    2. Place a poster image at:  public/hero/hero-poster.jpg
 *    3. That's it, the <video> tag will pick them up automatically.
 *
 *  Until real footage is available, the component renders:
 *    - A CSS-animated gradient (dark navy → near-black with slow drift)
 *    - A subtle grain overlay for texture
 *    - The same layout & content as the final hero
 *
 *  prefers-reduced-motion: the ken-burns / drift animation is paused;
 *  the poster image (or static gradient) shows instead.
 * ================================================================== */

const HERO_VIDEO_SRC = "/hero/hero.mp4";       // swap point, see above
const HERO_POSTER   = "/hero/hero-poster.jpg"; // swap point, see above

export default function MotionHero() {
  return (
    <section
      className="relative flex items-end overflow-hidden"
      style={{ minHeight: "100svh" }}
      aria-label="Hero"
    >

      {/* === Background layer === */}
      <div className="absolute inset-0 z-0">

        {/*
          CSS animated gradient, active until real video is dropped in.
          When hero.mp4 exists, the <video> renders on top and covers this.
          This layer also acts as the poster fallback for prefers-reduced-motion.
        */}
        <div
          className="absolute inset-0 gradient-drift"
          style={{
            background: `
              radial-gradient(ellipse 80% 70% at 60% 40%, #0d1f35 0%, transparent 60%),
              radial-gradient(ellipse 60% 80% at 20% 70%, #0a1520 0%, transparent 55%),
              linear-gradient(160deg, #0a0a0b 0%, #0d1a28 40%, #0a0a0b 100%)
            `,
            backgroundSize: "200% 200%",
          }}
          aria-hidden="true"
        />

        {/* Subtle grain texture overlay, adds depth on black */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "180px",
            opacity: 0.6,
          }}
          aria-hidden="true"
        />

        {/* Real video, Akshay's footage. Renders over the gradient when present. */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.55 }} /* darken to keep text readable */
          src={HERO_VIDEO_SRC}
          poster={HERO_POSTER}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          onError={e => {
            // If the video file doesn't exist yet, hide the element gracefully.
            // The CSS gradient fallback remains visible underneath.
            (e.target as HTMLVideoElement).style.display = "none";
          }}
        />

        {/*
          Melbourne skyline, black & white.
          SWAP POINT: drop a real B&W photo at public/hero/melbourne-skyline.jpg
          and it replaces the SVG silhouette automatically (kept greyscale).
        */}
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: "62%",
            backgroundImage: `url("/hero/melbourne-skyline.svg")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center bottom",
            backgroundSize: "cover",
            opacity: 0.8,
          }}
          aria-hidden="true"
        />
        <img
          src="/hero/melbourne-skyline.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 w-full object-cover object-bottom"
          style={{ height: "62%", filter: "grayscale(1) contrast(1.1)", opacity: 0.8 }}
          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
        />

        {/* Gradient vignette, bottom-up fade to bg colour so text sits cleanly */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(to top, var(--color-bg) 0%, rgba(10,10,11,0.65) 30%, rgba(10,10,11,0.2) 60%, transparent 100%)
            `,
          }}
          aria-hidden="true"
        />
        {/* Left edge vignette, pulls the eye to the text */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, rgba(10,10,11,0.55) 0%, transparent 55%)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* === Hero content === */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-24 pt-36">

        {/* Gold eyebrow */}
        <p className="eyebrow mb-6 rise delay-100">
          Melbourne · First-home buyers &amp; early investors
        </p>

        {/* Headline */}
        <h1
          className="display rise delay-200 mb-6"
          style={{
            fontSize: "clamp(2.6rem, 6vw, 5.5rem)",
            maxWidth: "18ch",
            color: "var(--color-text)",
          }}
        >
          Buy your first home
          <br />
          with <span style={{ color: "var(--color-gold)" }}>your eyes open</span>.
        </h1>

        {/* Subheadline */}
        <p
          className="rise delay-350 mb-10"
          style={{
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            color: "var(--color-muted)",
            maxWidth: "46ch",
            lineHeight: 1.6,
          }}
        >
          Buying or selling property should feel exciting, not overwhelming. With the right agent beside you and broker-grade tools at your fingertips, every step is a confident one.
        </p>

        {/* Primary CTA */}
        <div className="rise delay-500 flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-20">
          <Link
            to="/tools/pre-buying"
            className="inline-flex items-center gap-2 px-7 py-4 text-sm font-semibold transition-colors duration-200"
            style={{
              background: "var(--color-gold)",
              color: "var(--color-bg)",
              letterSpacing: "0.06em",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--color-gold-bright)")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--color-gold)")}
          >
            See what you can afford
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 px-7 py-4 text-sm font-medium border transition-colors duration-200"
            style={{
              border: "1px solid var(--color-line)",
              color: "var(--color-muted)",
              letterSpacing: "0.04em",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = "var(--color-text)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = "var(--color-muted)";
              e.currentTarget.style.borderColor = "var(--color-line)";
            }}
          >
            Browse listings
          </Link>
        </div>
      </div>
    </section>
  );
}
