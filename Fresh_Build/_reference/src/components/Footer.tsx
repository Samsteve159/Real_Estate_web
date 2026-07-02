import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t hairline bg-navy text-bone">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-teal-pale">Manifest Real Estate</p>
            <p className="display mt-3 max-w-md text-4xl leading-tight text-bone">
              Where dreams meet <span className="italic text-amber">reality</span>.
            </p>
          </div>
          <div className="flex flex-wrap gap-12 text-sm">
            <div>
              <p className="eyebrow mb-3 text-bone/50">Tools</p>
              <ul className="space-y-2 text-bone/80">
                <li>
                  <Link to="/valuation" className="hover:text-amber">
                    Instant valuation
                  </Link>
                </li>
                <li>
                  <a href="/#listings" className="hover:text-amber">
                    Browse listings
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-3 text-bone/50">Inner west</p>
              <ul className="space-y-2 text-bone/80">
                <li>Newport · Yarraville</li>
                <li>Altona North · Seddon</li>
                <li>Williamstown · Spotswood</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t border-bone/15 pt-6 text-xs text-bone/45 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Manifest Real Estate — companion demo.</p>
          <p>Valuations are indicative estimates, not formal appraisals.</p>
        </div>
      </div>
    </footer>
  );
}
