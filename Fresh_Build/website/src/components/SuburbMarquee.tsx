const SUBURBS = [
  "Newport",
  "Yarraville",
  "Altona North",
  "Seddon",
  "Williamstown",
  "Spotswood",
  "South Kingsville",
];

export default function SuburbMarquee() {
  // Doubled list so the -50% translate loops seamlessly.
  const items = [...SUBURBS, ...SUBURBS];
  return (
    <div className="overflow-hidden border-y hairline bg-navy py-4 text-bone">
      <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap">
        {items.map((s, i) => (
          <div key={i} className="flex items-center gap-8">
            <span className="display text-2xl text-bone/90">{s}</span>
            <span className="text-amber">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
