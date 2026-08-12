# DNS incident (2026-08-05) + Go-live runbook

Two documents in one, deliberately: the incident is *why* the runbook looks the
way it does. Read both before touching DNS for this domain again.

> ## ✅ EXECUTED 2026-08-12. The site is live.
>
> The runbook below was followed and worked. What actually happened:
>
> - **Pre-flight found four gaps the runbook had assumed away.** Most
>   importantly **certbot was not installed at all**, which would have failed
>   the SSL step minutes after the flip. Also fixed: `/api/stats` was publicly
>   readable, CORS was `*`, and nothing was backing up the leads database.
>   *Lesson: Phase 0 must verify tools exist, not assume them.*
> - **Order used:** remove `X-Robots-Tag` and reload → owner edited the single
>   root A record to `97.74.94.97` and deleted the second → certbot for both
>   hostnames with `--redirect` → verification.
> - **Result:** both hostnames on HTTPS (Let's Encrypt, expires 2026-11-10,
>   `certbot.timer` active), HTTP 301s to HTTPS, all sampled routes 200,
>   API/listings/valuation working, and lead #12 delivered the report PDF plus
>   both emails on the live domain.
> - **The pinned-verification rule proved itself again.** Post-flip checks
>   showed `/api/*` returning 404 HTML. That was a **stale DNS cache pointing
>   at the old Cloudflare IPs**, which now serve an error page. Testing pinned
>   to `97.74.94.97` showed everything healthy. Had the rule not been in the
>   runbook, that would have looked like a broken deploy and might have
>   triggered a needless rollback.
> - **`server_name` had to change from `_` to the real hostnames** before
>   certbot would patch the block. `default_server` was kept so the bare IP
>   still serves.
>
> **Rollback is now weak.** It depends on the abandoned Cloudflare zone still
> answering for the domain, which can stop at any time. Prefer fixing forward
> on the server. The old GoDaddy site-builder page is no longer served at the
> domain at all.

---

## Part 1 — Incident log: ~2h outage of the old site

### Timeline (times approx, AEST evening 2026-08-05)

| When | What |
|---|---|
| ~19:25 | Nameservers switched Cloudflare → GoDaddy (`ns21/ns22.domaincontrol.com`) to escape an unrecoverable Cloudflare account. Zone re-entered by hand. |
| ~19:40 | Root `A` records entered as `13.248.243.5` / `76.223.105.230` (GoDaddy site-builder) — **the wrong origin** (see root cause). |
| ~20:05 | Post-switch verification declared the site working — **false positive** (see contributing factor). |
| ~22:00 | Owner reports https://www.manifestre.com.au down. Diagnosis: direct hits to the builder IPs return **404 on http and TLS failure on https**. |
| ~22:15 | Stopgap applied: root `A` → `104.21.96.143` / `172.67.182.46` (Cloudflare's proxy IPs). Old site back within ~30 min for everyone. Verified correctly this time (`--resolve` pinned to the new values: www = HTTP 200, real content, valid TLS). |
| Throughout | **Email was never affected** — MX/SPF/Resend rows were correct the whole time. |

### Root cause

The old site's origin was **assumed**, not proven. The "Websites + Marketing"
venture (`manifestre.godaddysites.com`) sitting in the Manifest GoDaddy account
looked like the old site's home; it is actually an **unused free-plan draft
that 404s**. The real old site (WordPress, per all project history) lives at an
**unknown host**, and was only ever reachable through Cloudflare's proxy. Its
true origin IP was hidden by the proxy and was never discovered.

### Contributing factor — the false-positive verification

The post-switch check ran `curl -L https://manifestre.com.au` **through the
system resolver**, which still had the old Cloudflare answers cached (1h TTL),
so it validated the *old* path and returned 200. The one test that told the
truth — `curl --resolve manifestre.com.au:443:13.248.243.5` returning
**HTTP 000** — was dismissed as a redirect quirk instead of being investigated.

### The rules this writes in stone

1. **Never assume an origin.** Before repointing a domain, prove where the
   current site is served from (fetch it via the proposed new records with
   `--resolve` and confirm real content, not just a status code).
2. **Verify cutovers only with `--resolve` pinned to the NEW values.** The
   system resolver lies for up to a full TTL. A `-L` redirect chain silently
   falls back to the resolver for follow-up hosts — pin every hostname in the
   chain or don't trust the result.
3. **HTTP 000 is a finding, not noise.** Investigate until explained.
4. **Verify content, not just status codes** (`grep` for real page content).

### Current fragile state (as of this writing)

The old site now rides on Cloudflare's **abandoned but still-active** zone: our
GoDaddy DNS answers with Cloudflare's proxy IPs, and Cloudflare still
recognises the domain and proxies to the real (unknown) origin with valid TLS.
**Cloudflare purges moved-away free zones — typically days, up to ~a week.**
When that happens the old site goes down again with **no rollback target**,
because nobody knows the true origin. Hence: **go-live is time-sensitive.**
If more runway is ever needed, the origin could be hunted via passive-DNS
history services — uncertain and slow; treat as a last resort.

---

## Part 2 — Go-live runbook (the real cutover to the VPS)

**Precondition: Akshay's explicit sign-off.** Do not start without it.
Total elapsed time when done right: ~15 minutes.

### Phase 0 — Server prep (do BEFORE touching DNS; zero visitor impact)

On the VPS (`ssh -i ~/.ssh/manifest_vps manifest@97.74.94.97`):

1. nginx `server_name` must cover `manifestre.com.au www.manifestre.com.au`
   (it currently serves by IP/default).
2. **Remove the `X-Robots-Tag: noindex` header** from the nginx config — it
   was correct for the staging box and is **catastrophic for production**
   (Google will drop the live site). This is the single easiest thing to
   forget.
3. Confirm port 80 serves the site (needed for the Let's Encrypt challenge)
   and `certbot` + the nginx plugin are installed (`certbot --version`).
4. Fresh deploy: latest `main` pulled, site built + rsynced, `manifest-api`
   active, `/api/health` 200.
5. Sanity-check the site by Host header before any DNS change:
   `curl -H "Host: manifestre.com.au" http://97.74.94.97/` → must return the
   new site's HTML.

### Phase 1 — The flip (GoDaddy → domain → DNS tab)

Edit the two root `A` records (pencil icon):

| From (stopgap) | To |
|---|---|
| `104.21.96.143` | `97.74.94.97` |
| `172.67.182.46` | `97.74.94.97` → **delete this second row** (one A record is enough; two identical rows are pointless) |

Touch nothing else. `www` is a CNAME to the root and follows automatically.
**Do not touch MX, TXT, CNAME, SRV, or the Resend rows.**

### Phase 2 — SSL, immediately after the flip (~3 min)

Let's Encrypt validates with fresh DNS lookups against the authoritative
nameservers, so this works the moment the flip is saved — no waiting for
propagation:

```
sudo certbot --nginx -d manifestre.com.au -d www.manifestre.com.au \
  --redirect -m admin@manifestre.com.au --agree-tos --no-eff-email
```

Then `sudo nginx -t && sudo systemctl reload nginx`. Auto-renewal: confirm
`systemctl list-timers | grep certbot`.

Why the hurry: the old site (via Cloudflare) served HTTPS, so returning
browsers will demand HTTPS. Every minute between the flip and the cert is a
minute where fresh-DNS visitors get a TLS error. Users still on cached DNS see
the old site meanwhile — the transition is seamless if Phase 2 is fast.

### Phase 3 — Verification (the lesson applied)

All checks pinned with `--resolve` to **97.74.94.97** — never the bare
resolver:

```
curl --resolve manifestre.com.au:443:97.74.94.97     https://manifestre.com.au      # 200/301, NEW site content
curl --resolve www.manifestre.com.au:443:97.74.94.97 https://www.manifestre.com.au  # 200, NEW site content
```

- `grep` the HTML for something only the new site has (e.g. `Conviction` or a
  Vite asset hash) — content, not status codes.
- `https://manifestre.com.au/api/health` → 200 (again via `--resolve`).
- Listings load real Vault data; concierge streams; a test lead → email
  arrives at `admin@manifestre.com.au`.
- Confirm the `X-Robots-Tag` header is **gone**:
  `curl -sI --resolve manifestre.com.au:443:97.74.94.97 https://manifestre.com.au | grep -i robots` → empty.
- MX/Resend rows unchanged: `dig @ns21.domaincontrol.com MX manifestre.com.au`.

### Phase 4 — Aftercare

- Watch `journalctl -u manifest-api -f` for the first real traffic.
- Keep the Cloudflare IPs (`104.21.96.143` / `172.67.182.46`) written down —
  they are the **only rollback**, and only for as long as Cloudflare hasn't
  purged the zone. If purged, there is no way back to the old site; fix
  forward on the VPS.
- Update `CLAUDE.md`, `PROJECT_TRACKER.md`, memory: site LIVE.
- Retire the GitHub Pages preview note; consider `new.manifestre.com.au` for
  future staging.

### Rollback (only while the Cloudflare zone survives)

Revert the root `A` record(s) to `104.21.96.143` + `172.67.182.46`. Recovery
within ~30 min. **This door closes permanently when Cloudflare purges the
zone.**
