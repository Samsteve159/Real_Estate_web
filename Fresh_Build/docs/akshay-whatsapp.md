# WhatsApp to Akshay — domain + Vault RE (one message)

Casual heads-up for Akshay that also carries the Vault RE email for him to send.
Fill the **[bracketed]** bits before sending. Copy from the line below.

---

Oi Akshay 👋 couple of quick things for the new Manifest website —

**1) Domain** — what's the web address we're using? Basically what people type to find us. Is it **manifestre.com.au**, or did we grab a new/different one? Just need the exact spelling so the new site points to the right place. (Website's the office; the domain's the sign above the door 😄)

**2) Vault RE** — the new site can pull our listings straight from Vault RE, so when you create a listing in the CRM it shows up on the website automatically. To switch that on, Vault needs to give us API access — and it has to come from your account since you've got the login. Could you flick the email below to **api@vaultre.com.au**? Just fill in the [brackets] first 🙏

— — — copy/paste to Vault RE — — —

**Subject:** API access request — Manifest Real Estate website integration

Hi VaultRE team,

We're Manifest Real Estate (account: **[our agency / office name]**). We're building a new website that will display our current listings, pulled live from our VaultRE account.

Could you help us get set up with API access? Specifically:
1. How we get an **API key + access token** so our developer can read our listings (sales & rentals) via the API.
2. Whether there's any **cost or plan requirement** for API access on our current subscription.
3. Whether you'd recommend the **REST API** or an **outgoing XML feed** to keep a third-party website in sync.
4. Any **rate limits**, a test/sandbox environment, or onboarding steps we should know about.

Our developer will handle the technical side against your docs (docs.api.vaultre.com.au). Happy to provide anything you need to authorise access.

Account: **[Manifest Real Estate — full registered name]** · **[office / account ID]**
Contact: **Akshay [surname]**, **[role]** · **[phone]** · **[email]** · ABN **[ABN]**

Thanks!
Akshay

— — — end — — —

No rush on either mate 🙏

---

### Notes for us (not part of the message)
- Once Vault replies with the API key + access token, store them **server-side only** (in the API worker's secrets, like `ANTHROPIC_API_KEY`) — never in the browser.
- Build against: https://docs.api.vaultre.com.au/ (Swagger: https://docs.api.vaultre.com.au/swagger/index.html).
