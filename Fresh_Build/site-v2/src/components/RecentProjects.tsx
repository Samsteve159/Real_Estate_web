import { useReveal } from "../lib/useReveal";

/* ------------------------------------------------------------------ *
 *  RecentProjects — a "Recent Projects" showcase strip for the
 *  Development Projects and Commercial Leasing pages.
 *
 *  HIDDEN FOR NOW. Akshay will refresh this roughly every two months;
 *  until then only the live Listings should surface. Flip SHOW to true
 *  (and fill `projects`) when there's real content to show.
 * ------------------------------------------------------------------ */

const SHOW = false;

export interface RecentProject {
  name: string;
  location: string;
  detail: string;
  image?: string;
}

interface Props {
  eyebrow?: string;
  heading?: string;
  projects?: RecentProject[];
}

export default function RecentProjects({
  eyebrow = "Recent projects",
  heading = "A selection of our recent work.",
  projects = [],
}: Props) {
  const ref = useReveal(0.08) as React.RefObject<HTMLElement>;

  if (!SHOW || projects.length === 0) return null;

  return (
    <section
      ref={ref as React.RefObject<HTMLDivElement>}
      className="border-t"
      style={{ borderColor: "var(--color-line)", background: "var(--color-bg)" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-20">
        <p className="reveal eyebrow mb-4">{eyebrow}</p>
        <h2 className="reveal display mb-12" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", color: "var(--color-text)", maxWidth: "24ch" }}>
          {heading}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "var(--color-line)" }}>
          {projects.map((p, i) => (
            <article key={p.name} className="reveal flex flex-col" style={{ background: "var(--color-surface)", transitionDelay: `${i * 60}ms` }}>
              {p.image && (
                <div className="aspect-[4/3] w-full overflow-hidden" style={{ borderBottom: "1px solid var(--color-line)" }}>
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-7">
                <h3 className="font-display font-semibold mb-2" style={{ color: "var(--color-text)", fontSize: "1.1rem" }}>{p.name}</h3>
                <p className="eyebrow mb-3" style={{ color: "var(--color-gold)" }}>{p.location}</p>
                <p className="text-sm" style={{ color: "var(--color-muted)", lineHeight: 1.6 }}>{p.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
