/* ================================================================== *
 *  The 7-stage buyer journey — typed domain model + canonical data.
 *
 *  Pure data. The app renders progress/checklists/reminders from this;
 *  the source of truth for the copy is `knowledge/JOURNEY.md`.
 * ================================================================== */

/** Capabilities an item can carry (drives the icon / action in the UI). */
export type ItemKind =
  | "calc"      // opens a calculator
  | "check"     // a checklist toggle
  | "data"      // needs property/gov data
  | "partner"   // routes to a partner (discount)
  | "ai"        // AI mentor assist
  | "human"     // one tap to a Manifest expert
  | "info";     // informational step

export interface JourneyItem {
  id: string;
  label: string;
  kinds: ItemKind[];
  /** Optional deep-link target, e.g. a tool route id. */
  target?: string;
}

export interface JourneyStage {
  n: number;
  id: string;
  title: string;
  /** The buyer's question this stage answers. */
  want: string;
  items: JourneyItem[];
}

/** Per-user progress, persisted locally (see ARCHITECTURE.md). */
export interface ChecklistState {
  [itemId: string]: {
    done: boolean;
    /** ISO date for a reminder, if the buyer set one. */
    dueDate?: string;
    completedAt?: string;
  };
}

export interface JourneyProgress {
  currentStage: number;
  checklist: ChecklistState;
  updatedAt: string;
}

const item = (id: string, label: string, kinds: ItemKind[], target?: string): JourneyItem =>
  ({ id, label, kinds, target });

export const STAGES: JourneyStage[] = [
  {
    n: 1, id: "get-ready", title: "Get Ready",
    want: "Can I afford it — and what's my budget?",
    items: [
      item("borrowing", "Borrowing capacity", ["calc"], "borrowing"),
      item("deposit", "Deposit calculator", ["calc"], "deposit"),
      item("stamp-duty", "Stamp duty (VIC)", ["calc"], "stamp-duty"),
      item("budget", "Budget planner", ["calc"], "budget"),
      item("savings", "Savings tracker", ["calc", "check"], "savings"),
      item("grants", "Grants & concessions check", ["calc"], "grants"),
      item("broker", "Connect to a broker", ["partner", "human"]),
      item("readiness", "Buyer Readiness Score", ["info"]),
    ],
  },
  {
    n: 2, id: "find-a-property", title: "Find a Property",
    want: "Is this the right one — and is it fairly priced?",
    items: [
      item("inspection", "Inspection checklist", ["check"]),
      item("questions", "Questions to ask the agent", ["check", "ai"]),
      item("comps", "Comparable sales", ["data", "ai"]),
      item("suburb-score", "Suburb score", ["data"]),
      item("schools", "School catchments", ["data"]),
      item("overlays-flood", "Flood / fire overlays", ["data"]),
      item("overlays-dev", "Development overlays", ["data"]),
      item("yield", "Estimated rental yield", ["calc"], "rental"),
      item("resale", "Estimated resale value", ["ai", "data"]),
    ],
  },
  {
    n: 3, id: "before-offer", title: "Before You Offer",
    want: "How do I not overpay or get burned?",
    items: [
      item("offer-strategy", "Offer strategy", ["ai"]),
      item("auction-strategy", "Auction strategy", ["ai"]),
      item("offer-range", "Recommended offer range", ["ai", "data"]),
      item("due-diligence", "Due-diligence checklist", ["check"]),
      item("building-booking", "Building inspection booking", ["partner"]),
      item("pest-booking", "Pest inspection booking", ["partner"]),
      item("conveyancer", "Conveyancer selection", ["partner", "human"]),
      item("finance-clause", "Finance-clause explanation", ["ai"]),
    ],
  },
  {
    n: 4, id: "under-contract", title: "Under Contract",
    want: "Am I on track to settlement?",
    items: [
      item("contract-signed", "Contract signed", ["check"]),
      item("deposit-paid", "Deposit paid", ["check"]),
      item("finance-approved", "Finance approved", ["check"]),
      item("building-complete", "Building inspection complete", ["check"]),
      item("pest-complete", "Pest inspection complete", ["check"]),
      item("s32-reviewed", "Section 32 reviewed", ["check", "ai"]),
      item("settlement-booked", "Settlement booked", ["check"]),
      item("utilities", "Utilities organised", ["check", "partner"]),
      item("insurance", "Insurance arranged", ["check", "partner"]),
    ],
  },
  {
    n: 5, id: "final-inspection", title: "Final Inspection",
    want: "Is the home as promised?",
    items: [
      item("appliances", "Appliances working", ["check"]),
      item("heating", "Heating / cooling", ["check"]),
      item("hot-water", "Hot water", ["check"]),
      item("lights", "Lights", ["check"]),
      item("garage", "Garage door", ["check"]),
      item("keys", "Keys", ["check"]),
      item("damage", "No damage since inspection", ["check"]),
      item("fixtures", "Fixtures included (per contract)", ["check"]),
      item("photos", "Photos uploaded", ["check"]),
    ],
  },
  {
    n: 6, id: "settlement", title: "Settlement",
    want: "Getting the keys.",
    items: [
      item("settlement-status", "Settlement status", ["check"]),
      item("bank-updates", "Bank updates", ["info"]),
      item("conveyancer-updates", "Conveyancer updates", ["human"]),
      item("key-collection", "Collection of keys", ["check"]),
      item("utility-transfers", "Utility transfers", ["partner"]),
    ],
  },
  {
    n: 7, id: "after-settlement", title: "After Settlement",
    want: "I've moved in — now what?",
    items: [
      item("address-council", "Address change — council rates", ["check"]),
      item("address-water", "Address change — water authority", ["check"]),
      item("address-insurance", "Address change — insurance", ["check"]),
      item("maintenance", "Maintenance schedule", ["check"]),
      item("value-tracker", "Property value tracker", ["data"]),
      item("refinance", "Refinance / equity check", ["partner"]),
    ],
  },
];

/** 0–100 readiness score from completed Stage-1 items. */
export function readinessScore(progress: JourneyProgress): number {
  const stage1 = STAGES[0].items.filter((i) => i.kinds.includes("calc") || i.kinds.includes("check"));
  if (stage1.length === 0) return 0;
  const done = stage1.filter((i) => progress.checklist[i.id]?.done).length;
  return Math.round((done / stage1.length) * 100);
}
