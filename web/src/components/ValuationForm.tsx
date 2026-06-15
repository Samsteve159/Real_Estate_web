import { useEffect, useState } from "react";
import { getSuburbs, type Suburb, type ValuationRequest } from "../lib/api";

const TYPES = ["House", "Townhouse", "Apartment"];

interface Props {
  onSubmit: (req: ValuationRequest) => void;
  loading: boolean;
}

export default function ValuationForm({ onSubmit, loading }: Props) {
  const [suburbs, setSuburbs] = useState<Suburb[]>([]);
  const [suburb, setSuburb] = useState("");
  const [street, setStreet] = useState("");
  const [type, setType] = useState("House");
  const [beds, setBeds] = useState(3);
  const [baths, setBaths] = useState(1);
  const [cars, setCars] = useState(1);
  const [landSize, setLandSize] = useState("");

  useEffect(() => {
    getSuburbs().then((s) => {
      setSuburbs(s);
      setSuburb(s[0]?.name ?? "");
    });
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!suburb) return;
    onSubmit({
      suburb,
      street: street.trim() || undefined,
      type,
      beds,
      baths,
      cars,
      landSize: landSize ? Number(landSize) : undefined,
    });
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border hairline bg-paper p-5 sm:p-9">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Suburb" full={false}>
          <select
            value={suburb}
            onChange={(e) => setSuburb(e.target.value)}
            className="control"
          >
            {suburbs.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name} {s.postcode}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Street (optional)" full={false}>
          <input
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="14 Maddox Road"
            className="control"
          />
        </Field>
      </div>

      <div className="mt-6">
        <span className="eyebrow text-muted">Property type</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                type === t
                  ? "border-teal bg-teal text-paper"
                  : "hairline text-muted hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2.5 sm:gap-4">
        <Stepper label="Beds" value={beds} set={setBeds} min={0} max={8} />
        <Stepper label="Baths" value={baths} set={setBaths} min={1} max={6} />
        <Stepper label="Cars" value={cars} set={setCars} min={0} max={6} />
      </div>

      <div className="mt-6">
        <Field label="Land size m² (optional)" full>
          <input
            value={landSize}
            onChange={(e) => setLandSize(e.target.value.replace(/[^\d]/g, ""))}
            inputMode="numeric"
            placeholder="372"
            className="control"
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={loading || !suburb}
        className="mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-navy py-4 font-semibold text-paper transition-colors hover:bg-navy-soft disabled:opacity-50"
      >
        {loading ? (
          <>
            <span className="h-2 w-2 animate-ping rounded-full bg-amber" />
            Reading the comps…
          </>
        ) : (
          <>Get my indicative estimate →</>
        )}
      </button>
      <p className="mt-3 text-center text-xs text-muted">
        Claude analyses recently-sold comparables. Indicative only — not a formal
        appraisal.
      </p>

      <style>{`
        .control {
          width: 100%;
          border-radius: 0.6rem;
          border: 1px solid var(--color-line);
          background: var(--color-bone);
          padding: 0.7rem 0.85rem;
          font-size: 0.95rem;
          color: var(--color-ink);
          outline: none;
          transition: border-color .15s, box-shadow .15s;
        }
        .control:focus {
          border-color: var(--color-teal);
          box-shadow: 0 0 0 3px rgba(31,122,110,.15);
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full: boolean;
}) {
  return (
    <label className={`block ${full ? "w-full" : ""}`}>
      <span className="eyebrow text-muted">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function Stepper({
  label,
  value,
  set,
  min,
  max,
}: {
  label: string;
  value: number;
  set: (n: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div>
      <span className="eyebrow text-muted">{label}</span>
      <div className="mt-2 flex items-center justify-between rounded-lg border hairline bg-bone px-2 py-1.5">
        <button
          type="button"
          onClick={() => set(Math.max(min, value - 1))}
          className="h-7 w-7 rounded-md text-lg text-muted transition-colors hover:bg-bone-deep hover:text-ink"
        >
          −
        </button>
        <span className="display text-xl text-ink">{value}</span>
        <button
          type="button"
          onClick={() => set(Math.min(max, value + 1))}
          className="h-7 w-7 rounded-md text-lg text-muted transition-colors hover:bg-bone-deep hover:text-ink"
        >
          +
        </button>
      </div>
    </div>
  );
}
