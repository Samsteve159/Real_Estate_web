/*
 * Enquiry notification email (Resend). Every lead — valuation, contact form,
 * concierge capture, the "email me my report" CTA — currently gets saved to
 * SQLite and nothing else; nobody is told. This closes that gap.
 *
 * Gracefully no-ops when RESEND_API_KEY isn't set, the same pattern vault.ts
 * uses: build the whole pipeline now, switch it on the moment the account
 * exists. Sign up free at resend.com (3,000 emails/mo free), then set:
 *   RESEND_API_KEY        — from the Resend dashboard
 *   LEADS_NOTIFY_EMAIL     — where enquiries should land, e.g. admin@manifestre.com.au
 *   MAIL_FROM              — optional; defaults to Resend's shared onboarding@resend.dev
 *                             sender (works with no DNS setup). Swap to an
 *                             address on manifestre.com.au once SPF/DKIM are
 *                             added to the domain (see PROJECT_TRACKER.md).
 */
import { Resend } from "resend";
import type { LeadInput } from "./leads.js";

const apiKey = () => process.env.RESEND_API_KEY ?? "";
const notifyTo = () => process.env.LEADS_NOTIFY_EMAIL ?? "";
const fromAddress = () => process.env.MAIL_FROM || "Manifest Real Estate <onboarding@resend.dev>";

export function emailConfigured(): boolean {
  return Boolean(apiKey());
}

let client: Resend | null = null;
function resend(): Resend {
  if (!client) client = new Resend(apiKey());
  return client;
}

export interface NotifiedLead extends LeadInput {
  leadId: number;
}

/** Notify Manifest of a new enquiry, and (best-effort) auto-reply to the enquirer. Never throws. */
export async function notifyNewLead(lead: NotifiedLead): Promise<void> {
  if (!emailConfigured()) {
    console.log(
      `[email] RESEND_API_KEY not set — lead #${lead.leadId} (${lead.source}/${lead.intent ?? ""}) saved but no email sent`,
    );
    return;
  }
  await Promise.allSettled([sendAdminNotification(lead), sendAutoReply(lead)]);
}

async function sendAdminNotification(lead: NotifiedLead): Promise<void> {
  const to = notifyTo();
  if (!to) {
    console.warn("[email] LEADS_NOTIFY_EMAIL not set — skipping admin notification");
    return;
  }
  try {
    await resend().emails.send({
      from: fromAddress(),
      to,
      replyTo: lead.email || undefined,
      subject: `New ${lead.source} enquiry${lead.intent ? ` — ${lead.intent}` : ""} — ${lead.name ?? "unnamed"}`,
      html: adminEmailHtml(lead),
    });
  } catch (err) {
    console.error("[email] admin notification failed", err);
  }
}

async function sendAutoReply(lead: NotifiedLead): Promise<void> {
  if (!lead.email) return;
  try {
    if (lead.intent === "report") {
      await resend().emails.send({
        from: fromAddress(),
        to: lead.email,
        subject: "Your Borrowing Capacity report — Manifest Real Estate",
        html: reportEmailHtml(lead),
      });
    } else {
      await resend().emails.send({
        from: fromAddress(),
        to: lead.email,
        subject: "Thanks for reaching out — Manifest Real Estate",
        html: autoReplyHtml(lead),
      });
    }
  } catch (err) {
    console.error("[email] auto-reply failed", err);
  }
}

/* ---- Templates (inline styles only — most email clients strip <style> blocks) ---- */

const GOLD = "#c2a267";
const INK = "#12181f";

function shell(title: string, bodyHtml: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f6f5f1;font-family:Helvetica,Arial,sans-serif;color:${INK};">
    <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
      <p style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${GOLD};font-weight:700;margin:0 0 8px;">Manifest Real Estate</p>
      <h1 style="font-size:20px;margin:0 0 20px;">${escapeHtml(title)}</h1>
      ${bodyHtml}
      <p style="font-size:12px;color:#6b7885;margin-top:32px;border-top:1px solid #dfddd5;padding-top:16px;">manifestre.com.au</p>
    </div>
  </body></html>`;
}

function row(label: string, value?: string | number | null): string {
  if (value == null || value === "") return "";
  return `<tr><td style="padding:6px 0;color:#6b7885;font-size:13px;width:140px;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:6px 0;font-size:13px;font-weight:600;">${escapeHtml(String(value))}</td></tr>`;
}

function adminEmailHtml(lead: NotifiedLead): string {
  const estimate =
    lead.estimateLow != null && lead.estimateHigh != null
      ? `$${lead.estimateLow.toLocaleString()} – $${lead.estimateHigh.toLocaleString()}`
      : undefined;
  const rows = [
    row("Name", lead.name),
    row("Email", lead.email),
    row("Phone", lead.phone),
    row("Source", lead.source),
    row("Intent", lead.intent),
    row("Suburb", lead.suburb),
    row("Address", lead.address),
    row("Est. range", estimate),
  ].join("");
  const message = lead.message
    ? `<p style="font-size:13px;line-height:1.6;background:#fff;border:1px solid #dfddd5;padding:14px;margin-top:16px;white-space:pre-wrap;">${escapeHtml(lead.message)}</p>`
    : "";
  return shell(`New enquiry — #${lead.leadId}`, `<table style="width:100%;border-collapse:collapse;">${rows}</table>${message}`);
}

function autoReplyHtml(lead: NotifiedLead): string {
  const firstName = (lead.name ?? "").split(" ")[0] || "there";
  return shell(
    "Thanks for reaching out",
    `<p style="font-size:14px;line-height:1.6;">Hi ${escapeHtml(firstName)},</p>
     <p style="font-size:14px;line-height:1.6;">Thanks for getting in touch with Manifest Real Estate. AK will personally review your enquiry and get back to you shortly.</p>
     <p style="font-size:14px;line-height:1.6;">In the meantime, feel free to browse our <a href="https://manifestre.com.au/listings" style="color:${GOLD};">current listings</a>.</p>`,
  );
}

function reportEmailHtml(lead: NotifiedLead): string {
  const firstName = (lead.name ?? "").split(" ")[0] || "there";
  return shell(
    "Your Borrowing Capacity report",
    `<p style="font-size:14px;line-height:1.6;">Hi ${escapeHtml(firstName)},</p>
     <p style="font-size:14px;line-height:1.6;">Here's the summary you requested:</p>
     <p style="font-size:13px;line-height:1.7;background:#fff;border:1px solid #dfddd5;padding:16px;white-space:pre-wrap;">${escapeHtml(lead.message ?? "")}</p>
     <p style="font-size:12px;color:#6b7885;line-height:1.6;">This is an indicative estimate, not a loan offer. Speak to a licensed mortgage broker before committing.</p>`,
  );
}

function escapeHtml(s: string): string {
  const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return s.replace(/[&<>"']/g, (c) => map[c]);
}
