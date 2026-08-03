/*
 * Borrowing Capacity report — branded PDF, generated per user.
 *
 * PDFKit rather than headless Chrome on purpose: the production box is 1 vCPU /
 * 2 GB, where Puppeteer would be a ~300 MB resident browser per render. PDFKit
 * draws directly, costs a few MB, and renders in milliseconds.
 *
 * Design follows Fresh_Build/Assets/sample-borrowing-capacity-report.html:
 * navy letterhead, gold rule, figure table, indicative-only disclaimer.
 * Helvetica (a PDF built-in) stands in for Raleway so we ship no font binaries.
 */
import PDFDocument from "pdfkit";

const NAVY = "#003970";
const NAVY_DEEP = "#002a52";
const GOLD = "#b8924f";
const INK = "#1c2430";
const MUTED = "#5a6675";
const LINE = "#e4e8ee";

export interface BorrowingReportData {
  name?: string;
  /* Inputs */
  grossIncome?: number;
  monthlyExpenses?: number;
  monthlyDebts?: number;
  savings?: number;
  purchasePrice?: number;
  interestRate?: number; // percent, e.g. 6.2
  buyerType?: string;    // 'fhb' | 'ppr' | 'investor'
  /* Results */
  maxBorrow?: number;
  maxPurchase?: number;
  loanNeeded?: number;
  depositAmount?: number;
  lvr?: number;
  lmi?: number;
  stampDuty?: number;
  upfrontCosts?: number;
  monthlyRepayment?: number;
  canService?: boolean;
}

const BUYER_LABEL: Record<string, string> = {
  fhb: "First home buyer",
  ppr: "Next home",
  investor: "Investment",
};

function aud(n?: number): string {
  if (n == null || !Number.isFinite(n)) return "—";
  return "$" + Math.round(n).toLocaleString("en-AU");
}

/** Renders the report and resolves to a PDF buffer. */
export async function buildBorrowingReportPdf(data: BorrowingReportData): Promise<Buffer> {
  const doc = new PDFDocument({ size: "A4", margin: 0 });
  const chunks: Buffer[] = [];
  doc.on("data", (c: Buffer) => chunks.push(c));
  const done = new Promise<Buffer>((resolve) => doc.on("end", () => resolve(Buffer.concat(chunks))));

  const W = doc.page.width;
  const M = 56; // content margin
  const contentW = W - M * 2;

  /* ---- Letterhead ---- */
  doc.rect(0, 0, W, 148).fill(NAVY_DEEP);
  doc.rect(0, 0, W, 148).fillOpacity(0.35).fill(NAVY).fillOpacity(1);

  doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(15)
    .text("MANIFEST", M, 40, { characterSpacing: 3 });
  doc.font("Helvetica").fontSize(6.5).fillColor(GOLD)
    .text("REAL ESTATE", M, 60, { characterSpacing: 4.6 });

  doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(21)
    .text("Borrowing Capacity Report", M, 88);
  doc.font("Helvetica").fontSize(9.5).fillColor("#c9d4e2")
    .text(
      `Prepared for ${data.name || "you"}  ·  ${new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}`,
      M,
      116,
    );

  // Gold rule under the letterhead
  doc.rect(0, 148, W, 3).fill(GOLD);

  let y = 190;

  /* ---- Headline figure ---- */
  doc.fillColor(MUTED).font("Helvetica").fontSize(8)
    .text("INDICATIVE BORROWING POWER", M, y, { characterSpacing: 1.6 });
  y += 16;
  doc.fillColor(NAVY).font("Helvetica-Bold").fontSize(32).text(aud(data.maxBorrow), M, y);
  y += 40;
  doc.fillColor(MUTED).font("Helvetica").fontSize(9.5)
    .text(`Suggesting a maximum purchase price of about ${aud(data.maxPurchase)}, including your savings.`, M, y, { width: contentW });
  y += 34;

  /* ---- Verdict banner ---- */
  if (data.canService != null && data.purchasePrice) {
    const ok = data.canService;
    const bg = ok ? "#eef6f1" : "#fdf3f1";
    const fg = ok ? "#2b6249" : "#9c3b30";
    const msg = ok
      ? `On these numbers, a purchase at ${aud(data.purchasePrice)} looks serviceable.`
      : `On these numbers, a purchase at ${aud(data.purchasePrice)} looks like a stretch.`;
    doc.roundedRect(M, y, contentW, 40, 2).fill(bg);
    doc.fillColor(fg).font("Helvetica-Bold").fontSize(10).text(msg, M + 16, y + 15, { width: contentW - 32 });
    y += 60;
  }

  /* ---- Figures table ---- */
  y = section(doc, "YOUR TARGET PURCHASE", M, y, contentW);
  const rows: [string, string][] = [
    ["Purchase price", aud(data.purchasePrice)],
    ["Loan required", aud(data.loanNeeded)],
    ["Deposit applied", aud(data.depositAmount)],
    ["Loan-to-value ratio (LVR)", data.lvr != null ? `${data.lvr.toFixed(1)}%` : "—"],
    ["Lenders mortgage insurance", data.lmi ? aud(data.lmi) : "Not applicable"],
    ["Stamp duty", aud(data.stampDuty)],
    ["Upfront costs (duty + fees)", aud(data.upfrontCosts)],
    ["Estimated repayment", data.monthlyRepayment != null ? `${aud(data.monthlyRepayment)} / month` : "—"],
  ];
  y = table(doc, rows, M, y, contentW, true);

  y += 24;
  y = section(doc, "WHAT WE BASED THIS ON", M, y, contentW);
  const inputs: [string, string][] = [
    ["Gross annual income", aud(data.grossIncome)],
    ["Living expenses", data.monthlyExpenses != null ? `${aud(data.monthlyExpenses)} / month` : "—"],
    ["Other debt repayments", data.monthlyDebts != null ? `${aud(data.monthlyDebts)} / month` : "—"],
    ["Savings available", aud(data.savings)],
    ["Interest rate", data.interestRate != null ? `${data.interestRate}%` : "—"],
    ["Buyer type", data.buyerType ? (BUYER_LABEL[data.buyerType] ?? data.buyerType) : "—"],
  ];
  y = table(doc, inputs, M, y, contentW, false);

  /* ---- Disclaimer + footer, pinned to the bottom ---- */
  const footY = doc.page.height - 118;
  doc.rect(M, footY, contentW, 1).fill(LINE);
  doc.fillColor(MUTED).font("Helvetica").fontSize(7.6)
    .text(
      "Borrowing power, LMI and repayments are indicative only. Every lender assesses income, expenses and " +
        "serviceability differently, and this is not a loan offer, a pre-approval, or financial advice. Stamp duty " +
        "follows the current SRO Victoria schedule. Serviceability is tested at your rate plus the 3% APRA buffer. " +
        "Speak to a licensed mortgage broker before committing.",
      M,
      footY + 14,
      { width: contentW, lineGap: 1.5 },
    );
  doc.fillColor(NAVY).font("Helvetica-Bold").fontSize(8)
    .text("Manifest Real Estate", M, doc.page.height - 42);
  doc.fillColor(MUTED).font("Helvetica").fontSize(8)
    .text("admin@manifestre.com.au  ·  manifestre.com.au", M, doc.page.height - 42, {
      width: contentW,
      align: "right",
    });

  doc.end();
  return done;
}

function section(doc: PDFKit.PDFDocument, label: string, x: number, y: number, w: number): number {
  doc.fillColor(NAVY).font("Helvetica-Bold").fontSize(8).text(label, x, y, { characterSpacing: 1.4 });
  doc.rect(x, y + 14, w, 1).fill(GOLD);
  return y + 24;
}

/** Two-column label/value rows. `emphasise` bolds the values. */
function table(
  doc: PDFKit.PDFDocument,
  rows: [string, string][],
  x: number,
  y: number,
  w: number,
  emphasise: boolean,
): number {
  const rowH = 22;
  rows.forEach(([label, value], i) => {
    const ry = y + i * rowH;
    if (i % 2 === 1) doc.rect(x, ry - 4, w, rowH).fill("#f7f9fb");
    doc.fillColor(MUTED).font("Helvetica").fontSize(9.5).text(label, x + 8, ry, { width: w * 0.6 });
    doc
      .fillColor(INK)
      .font(emphasise ? "Helvetica-Bold" : "Helvetica")
      .fontSize(9.5)
      .text(value, x, ry, { width: w - 8, align: "right" });
  });
  return y + rows.length * rowH;
}
