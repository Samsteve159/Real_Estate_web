/*
 * DRAFT redesign of the Borrowing Capacity report — Manifest site branding.
 * Standalone: does NOT touch api/src/report.ts. Approved design gets ported.
 *
 * Changes vs live: navy → near-black #0a0a0b letterhead, site gold #c2a267,
 * white logo image, both directors' photos top-right (circular, gold ring),
 * warm neutrals in the body instead of the blue-grays.
 */
import { writeFileSync } from "node:fs";
import PDFDocument from "pdfkit";

const ROOT = "/Users/sameeriyer/Desktop/Claude Projects/AK";
const PUB = `${ROOT}/Fresh_Build/site-v2/public`;

/* Brand tokens — lifted from site-v2/src/index.css */
const BG = "#0a0a0b";        // letterhead, near-black
const GOLD = "#c2a267";      // site gold
const GOLD_DIM = "#9a7f4f";
const TEXT_ON_DARK = "#f5f5f6";
const MUTED_ON_DARK = "#a1a1aa";
const INK = "#141416";       // body ink on white
const MUTED = "#6b6b70";     // neutral gray (was blue-gray)
const LINE = "#e7e4dd";      // warm hairline (was blue-tinted)
const ZEBRA = "#f7f6f3";     // warm zebra row (was blue-tinted)

interface Data {
  name?: string;
  grossIncome?: number; monthlyExpenses?: number; monthlyDebts?: number; savings?: number;
  purchasePrice?: number; interestRate?: number; buyerType?: string;
  maxBorrow?: number; maxPurchase?: number; loanNeeded?: number; depositAmount?: number;
  lvr?: number; lmi?: number; stampDuty?: number; upfrontCosts?: number;
  monthlyRepayment?: number; canService?: boolean;
}

const BUYER_LABEL: Record<string, string> = { fhb: "First home buyer", ppr: "Next home", investor: "Investment" };
const aud = (n?: number) => (n == null || !Number.isFinite(n) ? "—" : "$" + Math.round(n).toLocaleString("en-AU"));

function circlePhoto(doc: PDFKit.PDFDocument, path: string, cx: number, cy: number, r: number) {
  doc.save();
  doc.circle(cx, cy, r).clip();
  // cover-crop, aligned to the top like the site's object-top headshots
  doc.image(path, cx - r, cy - r, { cover: [r * 2, r * 2], align: "center", valign: "top" });
  doc.restore();
  doc.circle(cx, cy, r).lineWidth(1.3).stroke(GOLD);
}

async function build(data: Data): Promise<Buffer> {
  const doc = new PDFDocument({ size: "A4", margin: 0 });
  const chunks: Buffer[] = [];
  doc.on("data", (c: Buffer) => chunks.push(c));
  const done = new Promise<Buffer>((res) => doc.on("end", () => res(Buffer.concat(chunks))));

  const W = doc.page.width;
  const M = 56;
  const contentW = W - M * 2;

  /* ---- Letterhead: near-black, site gold ---- */
  doc.rect(0, 0, W, 148).fill(BG);

  // White badge logo, top-left
  doc.image(`${PUB}/manifest-logo-white.png`, M, 26, { height: 44 });

  // Directors, top-right: circular headshots with gold rings + names
  const r = 21;
  const cxAk = W - M - r;            // Akshay rightmost
  const cxRi = cxAk - r * 2 - 12;    // Rishi to his left
  const cy = 46;
  circlePhoto(doc, `${PUB}/rishi-vohra.jpg`, cxRi, cy, r);
  circlePhoto(doc, `${PUB}/akshay-kapoor.jpg`, cxAk, cy, r);
  doc.font("Helvetica").fontSize(6).fillColor(MUTED_ON_DARK);
  doc.text("Rishi Vohra", cxRi - 34, cy + r + 5, { width: 68, align: "center" });
  doc.text("Akshay Kapoor", cxAk - 34, cy + r + 5, { width: 68, align: "center" });
  doc.fontSize(5.6).fillColor(GOLD_DIM);
  doc.text("DIRECTOR", cxRi - 34, cy + r + 13, { width: 68, align: "center", characterSpacing: 1 });
  doc.text("DIRECTOR", cxAk - 34, cy + r + 13, { width: 68, align: "center", characterSpacing: 1 });

  doc.fillColor(TEXT_ON_DARK).font("Helvetica-Bold").fontSize(21)
    .text("Borrowing Capacity Report", M, 92);
  doc.font("Helvetica").fontSize(9.5).fillColor(MUTED_ON_DARK)
    .text(
      `Prepared for ${data.name || "you"}  ·  ${new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}`,
      M, 120,
    );

  doc.rect(0, 148, W, 3).fill(GOLD);

  let y = 190;

  /* ---- Headline figure ---- */
  doc.fillColor(GOLD_DIM).font("Helvetica-Bold").fontSize(8)
    .text("INDICATIVE BORROWING POWER", M, y, { characterSpacing: 1.6 });
  y += 16;
  doc.fillColor(INK).font("Helvetica-Bold").fontSize(32).text(aud(data.maxBorrow), M, y);
  y += 40;
  doc.fillColor(MUTED).font("Helvetica").fontSize(9.5)
    .text(`Suggesting a maximum purchase price of about ${aud(data.maxPurchase)}, including your savings.`, M, y, { width: contentW });
  y += 34;

  /* ---- Verdict banner ---- */
  if (data.canService != null && data.purchasePrice) {
    const ok = data.canService;
    const bg = ok ? "#f2f0ea" : "#f7efe9";
    const fg = ok ? "#4d5c3f" : "#8a4a33";
    const msg = ok
      ? `On these numbers, a purchase at ${aud(data.purchasePrice)} looks serviceable.`
      : `On these numbers, a purchase at ${aud(data.purchasePrice)} looks like a stretch.`;
    doc.roundedRect(M, y, contentW, 40, 2).fill(bg);
    doc.rect(M, y, 3, 40).fill(GOLD);
    doc.fillColor(fg).font("Helvetica-Bold").fontSize(10).text(msg, M + 16, y + 15, { width: contentW - 32 });
    y += 60;
  }

  /* ---- Tables ---- */
  y = section(doc, "YOUR TARGET PURCHASE", M, y, contentW);
  y = table(doc, [
    ["Purchase price", aud(data.purchasePrice)],
    ["Loan required", aud(data.loanNeeded)],
    ["Deposit applied", aud(data.depositAmount)],
    ["Loan-to-value ratio (LVR)", data.lvr != null ? `${data.lvr.toFixed(1)}%` : "—"],
    ["Lenders mortgage insurance", data.lmi ? aud(data.lmi) : "Not applicable"],
    ["Stamp duty", aud(data.stampDuty)],
    ["Upfront costs (duty + fees)", aud(data.upfrontCosts)],
    ["Estimated repayment", data.monthlyRepayment != null ? `${aud(data.monthlyRepayment)} / month` : "—"],
  ], M, y, contentW, true);

  y += 24;
  y = section(doc, "WHAT WE BASED THIS ON", M, y, contentW);
  y = table(doc, [
    ["Gross annual income", aud(data.grossIncome)],
    ["Living expenses", data.monthlyExpenses != null ? `${aud(data.monthlyExpenses)} / month` : "—"],
    ["Other debt repayments", data.monthlyDebts != null ? `${aud(data.monthlyDebts)} / month` : "—"],
    ["Savings available", aud(data.savings)],
    ["Interest rate", data.interestRate != null ? `${data.interestRate}%` : "—"],
    ["Buyer type", data.buyerType ? (BUYER_LABEL[data.buyerType] ?? data.buyerType) : "—"],
  ], M, y, contentW, false);

  /* ---- Footer ---- */
  const footY = doc.page.height - 118;
  doc.rect(M, footY, contentW, 1).fill(LINE);
  doc.fillColor(MUTED).font("Helvetica").fontSize(7.6)
    .text(
      "Borrowing power, LMI and repayments are indicative only. Every lender assesses income, expenses and " +
        "serviceability differently, and this is not a loan offer, a pre-approval, or financial advice. Stamp duty " +
        "follows the current SRO Victoria schedule. Serviceability is tested at your rate plus the 3% APRA buffer. " +
        "Speak to a licensed mortgage broker before committing.",
      M, footY + 14, { width: contentW, lineGap: 1.5 },
    );
  doc.fillColor(GOLD_DIM).font("Helvetica-Bold").fontSize(8)
    .text("MANIFEST REAL ESTATE", M, doc.page.height - 42, { characterSpacing: 1.4 });
  doc.fillColor(MUTED).font("Helvetica").fontSize(8)
    .text("admin@manifestre.com.au  ·  manifestre.com.au", M, doc.page.height - 42, { width: contentW, align: "right" });

  doc.end();
  return done;
}

function section(doc: PDFKit.PDFDocument, label: string, x: number, y: number, w: number): number {
  doc.fillColor(GOLD_DIM).font("Helvetica-Bold").fontSize(8).text(label, x, y, { characterSpacing: 1.4 });
  doc.rect(x, y + 14, w, 1).fill(GOLD);
  return y + 24;
}

function table(doc: PDFKit.PDFDocument, rows: [string, string][], x: number, y: number, w: number, emphasise: boolean): number {
  const rowH = 22;
  rows.forEach(([label, value], i) => {
    const ry = y + i * rowH;
    if (i % 2 === 1) doc.rect(x, ry - 4, w, rowH).fill(ZEBRA);
    doc.fillColor(MUTED).font("Helvetica").fontSize(9.5).text(label, x + 8, ry, { width: w * 0.6 });
    doc.fillColor(INK).font(emphasise ? "Helvetica-Bold" : "Helvetica").fontSize(9.5)
      .text(value, x, ry, { width: w - 8, align: "right" });
  });
  return y + rows.length * rowH;
}

const out = process.argv[2];
const pdf = await build({
  name: "Priya Raman",
  grossIncome: 132000, monthlyExpenses: 3200, monthlyDebts: 450, savings: 145000,
  purchasePrice: 820000, interestRate: 6.24, buyerType: "fhb",
  maxBorrow: 712400, maxPurchase: 831900, loanNeeded: 703500, depositAmount: 116500,
  lvr: 85.8, lmi: 14320, stampDuty: 43070, upfrontCosts: 46590,
  monthlyRepayment: 4318, canService: true,
});
writeFileSync(out, pdf);
console.log(`${out} ${pdf.length} bytes header=${pdf.subarray(0, 5).toString()}`);
