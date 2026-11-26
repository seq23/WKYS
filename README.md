# SPRY / WKYS
The world moves fast. We keep you Spry.

Repository target: `seq23/WKYS`. Domain: `wekeepyouspry.com` (owner reports purchased). This bundle is a dependency-free static public site plus an internal operating kit. No credentials are included.

## Deploy
Use Cloudflare Pages (Git integration) and Google Apps Script. Follow [the complete configuration guide](docs/CLOUDFLARE-GOOGLE.md). Upload the archive contents to the repo root; remove obsolete Netlify configuration from the existing repo. Build command `npm run build`; publish `public`. Complete Google authorization, configure Cloudflare secrets, and verify an actual inquiry before launch. Provision business email separately.

## Local
Node 20+; no npm install needed. `npm run build && npm test`. Serve `public` via `python -m http.server 8000 --directory public`.

## What's implemented
Responsive brand site, FAQ, offer, Cloudflare Pages inquiry endpoint and Google Apps Script writer, thank-you page, local interactive assessment, illustrative portal with expandable guides, privacy draft, SEO files, build and static tests. Original CSS/SVG illustrations, no remote asset dependency. Internal docs excluded from publish output.

## Not live
The portal is explicitly a demo, not a secure client dashboard. Google Drive inquiry integration requires owner authorization and live verification. No live AI instructor, Stripe payment collection, Supabase integration, account creation, CRM, email delivery, or Boss OS runtime is connected. SQL is a reference migration, not applied or tested against a hosted database. The internal agent playbook is a specification, not an executing agent fleet. No DNS or deployment changes were made. The trademark clearance was reported by the owner, not independently verified.

## Internal operating kit
- `docs/MASTER-BLUEPRINT.md`: positioning, scope, commercial and operating model.
- `docs/CLIENT-KIT.md`: discovery, proposal, onboarding, blueprint, manual and acceptance templates.
- `docs/BOSS-OS.md`: agent roles, schemas, approval gates and implementation roadmap.
- `docs/LAUNCH.md`: prospecting and launch checklist.
- `supabase/schema.sql`: optional future portal foundation; requires independent review and testing.
- `CLAUDE.md`: implementation guardrails for Claude Code.
