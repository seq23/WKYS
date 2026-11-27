# SPRY / WKYS
The world moves fast. We keep you Spry.

Repository target: `seq23/WKYS`. Domain: `wekeepyouspry.com` (owner reports purchased). This repo is a dependency-free static public site, its Pages Functions and SQL. No credentials are included.

## Deploy
Use Cloudflare Pages (Git integration) and Google Apps Script. Follow [the complete configuration guide](docs/CLOUDFLARE-GOOGLE.md). Upload the archive contents to the repo root; remove obsolete Netlify configuration from the existing repo. Build command `npm run build`; publish `public`. Complete Google authorization, configure Cloudflare secrets, and verify an actual inquiry before launch. Provision business email separately.

## Local
Node 20+; no npm install needed. `npm run build && npm test`. Serve `public` via `python -m http.server 8000 --directory public`.

## What's implemented
Responsive brand site, FAQ, offer, Cloudflare Pages inquiry endpoint and Google Apps Script writer, thank-you page, local interactive assessment, illustrative portal with expandable guides, privacy draft, SEO files, build and static tests. Original CSS/SVG illustrations, no remote asset dependency. Internal docs excluded from publish output.

## Not live
The portal is explicitly a demo, not a secure client dashboard. Google Drive inquiry integration requires owner authorization and live verification. No live AI instructor, Stripe payment collection, Supabase integration, account creation, CRM, email delivery, or Boss OS runtime is connected. SQL is a reference migration, not applied or tested against a hosted database. The internal agent playbook is a specification, not an executing agent fleet. No DNS or deployment changes were made. The trademark clearance was reported by the owner, not independently verified.

## Operating docs
- Commercial plan, backlog and security notes (blueprint, client kit, Boss OS spec, launch playbook, portal runbooks, the 26 Nov 2026 handoff) live in the Boss OS `wkys` brain (private), not in this public repo.
- `supabase/schema.sql`: optional future portal foundation; requires independent review and testing.
- `CLAUDE.md`: implementation guardrails for Claude Code.
