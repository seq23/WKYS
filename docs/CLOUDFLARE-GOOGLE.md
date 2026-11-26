# Cloudflare Pages + Google Drive inquiry setup

## 1. Google Drive destination
1. In your intended Google account visit https://script.google.com/home and create a new standalone project named SPRY Inquiry Intake.
2. Replace the default Code.gs with the complete `google-apps-script/Code.gs` from this repo. Save.
3. Select `setupSpry` in the function selector and click Run. Authorize the script to create and edit your spreadsheet. It creates a private Google Sheet named SPRY — Private Client Inquiries (rerunning reuses it). Open the URL in the execution log.
4. Project Settings > Script Properties: copy the generated `SPRY_FORM_SECRET`. Do not share it or commit it. The sheet ID is also stored there.
5. Deploy > New deployment > Web app. Execute as **Me**; Who has access **Anyone** (anonymous access is required for Cloudflare's server request). If your Workspace policy prohibits this, stop; use a service-account-based Sheets API integration instead. The endpoint accepts writes only with the generated secret. The spreadsheet itself must remain private.
6. Copy the deployed URL ending in `/exec`, not `/dev`. Future code updates require updating the deployed version.

## 2. Cloudflare Pages
In Workers & Pages create a Pages project using Git integration, select seq23/WKYS, select the actual production branch, framework None, build command `npm run build`, output `public`, root repository, Node 22 (`NODE_VERSION=22` if needed). Functions live at repo root and are compiled by Pages. Do not use drag-and-drop static upload.
Under project Settings > Variables and Secrets (production), add:
- `GOOGLE_SCRIPT_URL`: deployed Google web app URL.
- `SPRY_FORM_SECRET`: encrypted secret, exact value from Script Properties.
Redeploy. Preview environments should not have production secrets unless intentionally enabled.
Under Custom domains add wekeepyouspry.com and www.wekeepyouspry.com. For the apex use the Cloudflare zone and registrar nameservers assigned by Cloudflare; preserve MX/TXT and existing records. Follow the project prompts and verify HTTPS. Configure www-to-apex redirect if desired.

## 3. Verify before launch
Open the actual public website, submit a uniquely identifiable test inquiry, verify it lands in the private spreadsheet exactly once, and verify that the thank-you page appears only after Google confirms receipt. Delete the test row afterward. Test failure by using a preview without secrets (it must not show success), and check mobile and desktop layouts. Enable Cloudflare rate limiting for POST /api/inquiry if available (e.g. 5 requests per IP per minute); honeypot and same-origin validation are not complete bot protection. Consider Turnstile before paid traffic. No emails are sent by this integration. Google Apps Script quotas apply. Do not log form bodies or secrets. Keep a retention policy and restrict access to staff who need inquiry data.

Local endpoint tests use mocked upstream responses, not a live Google account. A successful connector session in ChatGPT does not grant a deployed website permission to write to Google Drive; the owner authorization steps above are necessary.
