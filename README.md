# We Keep You Spry (WKYS)
The world moves fast. We keep you Spry.

Repository target: `seq23/WKYS`. Domain: `wekeepyouspry.com` (owner reports purchased). This repo is a dependency-free static public site, its Pages Functions and SQL. No credentials are included.

## Deploy
The Pages project `wkys` is Direct Upload, so a push alone deploys nothing. `.github/workflows/deploy.yml` builds `public/` and uploads it with `functions/`: a pull request gets a branch preview (`https://<branch>.wkys-ejt.pages.dev`, read back by `scripts/check-live.mjs`), and main deploys production only after the build and every test pass. A finished Search Loop run on main also deploys. Rollback: re-promote an earlier deployment in Cloudflare Pages. Inquiries still go through `/api/inquiry` to the Google Apps Script ([configuration guide](docs/CLOUDFLARE-GOOGLE.md)).

## Local
Node 20+; no npm install needed. `npm run build && npm test`. Serve with `npx wrangler pages dev public` (clean URLs, `_headers` and functions as Pages serves them).

## Where things live
- `site/data.mjs`: the name, the three offers and their prices, and each hand-written page's title and description. A price changes only here.
- `site/pages/*.mjs`: the 15 landing pages (niche, offer and question pages), rendered by `site/render.mjs`.
- Root `*.html`: hand-written pages; `<!--@head-->`, `<!--@header-->`, `<!--@offers-->`, `<!--@inquiry-->`, `<!--@footer-->` and `<!--@price:…-->` are filled at build. Home sections 02–04 are frozen (pinned by `scripts/check-pages.mjs`).
- `questions/`: pages written by the search loop (`search-loop.config.json`, `.github/workflows/search-loop.yml`).
- `assets/clarity.js`: the Microsoft Clarity loader and its project id (home and landing pages only).

## What's implemented
Responsive brand site, FAQ, offer, Cloudflare Pages inquiry endpoint and Google Apps Script writer, thank-you page, local interactive assessment, illustrative portal with expandable guides, privacy draft, SEO files, build and static tests. Original CSS/SVG illustrations, no remote asset dependency. Internal docs excluded from publish output.

## Not live
The portal is explicitly a demo, not a secure client dashboard. Google Drive inquiry integration requires owner authorization and live verification. No live AI instructor, Stripe payment collection, Supabase integration, account creation, CRM, email delivery, or Boss OS runtime is connected. SQL is a reference migration, not applied or tested against a hosted database. The internal agent playbook is a specification, not an executing agent fleet. No DNS or deployment changes were made. The trademark clearance was reported by the owner, not independently verified.

## Operating docs
- Commercial plan, backlog and security notes (blueprint, client kit, Boss OS spec, launch playbook, portal runbooks, the 26 Nov 2026 handoff) live in the Boss OS `wkys` brain (private), not in this public repo.
- `supabase/schema.sql`: optional future portal foundation; requires independent review and testing.
- `CLAUDE.md`: implementation guardrails for Claude Code.
