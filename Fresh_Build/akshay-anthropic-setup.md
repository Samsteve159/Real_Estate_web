# For Akshay — set up the Claude (Anthropic) account

This is the account that powers the AI features on the new website (valuation,
the chat concierge, the newsletter). It's pay-as-you-go — you only pay for what's
used, and we put a hard monthly cap on it so it can never overspend.

**Takes ~10 minutes. You'll need:** an email (use a Manifest email if you have one,
so the business owns it), your phone, and a debit/credit card.

---

## Step 1 — Create the account
1. Go to **console.anthropic.com**
2. Click **Sign up**.
3. Use the **Manifest email** (or yours), set a password, and verify the email +
   phone number when asked.
4. If it asks for an organisation/company name, enter **Manifest Real Estate**.

## Step 2 — Add a payment method
1. Once logged in, find **Billing** (or "Plans & Billing") in the left menu or
   settings.
2. Click **Add payment method** and enter the card.
3. If it asks you to **buy credits** to start, add a small amount like **$20** —
   that's plenty to begin; it tops up as needed later.

## Step 3 — Set a spending limit (important — this is the safety cap)
1. In **Billing** / **Limits**, look for a **monthly spend limit** (or "usage
   limit").
2. Set it to **$200**. (Our whole monthly budget is $500 and AI is expected to be
   well under this — the cap just guarantees no surprises.)
3. Save.

## Step 4 — Create the key Sameer needs
1. Go to **API Keys** (left menu).
2. Click **Create Key**.
3. Name it **Manifest Website** and create it.
4. It shows a long secret code starting with `sk-ant-...`. **Copy it now** — it's
   only shown once.

## Step 5 — Send the key to Sameer (treat it like a password)
- Send the `sk-ant-...` code to **Sameer directly** (private message), not in a
  group chat or anywhere public.
- Think of it like the keys to the office — anyone who has it can run up the bill,
  so keep it private. If it ever leaks, we just delete it and make a new one in 10
  seconds.

## Step 6 — Keep the login
- Save the **email + password** for this account somewhere safe (it's Manifest's
  account). You won't need to log in day-to-day; Sameer handles the technical side
  from here.

---

That's it. Once Sameer has the key, the AI features run on Manifest's own account,
billed to Manifest, capped at $200/month.

> *Notes for us:* swap this key into the API worker's server-side secrets (never
> the browser). Confirm the spend cap is set before any public link is shared.
> Replace the existing dev key in `.env` with this once received.
