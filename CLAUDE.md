# CLAUDE.md - read this first, in every session

## About us
- We are a team of 4-5 people from Mahanadi Coalfields Limited (MCL) at an
  IIM Sambalpur MDP. We are NOT programmers.
- Explain everything in plain English, in short sentences. If you must use a
  technical word, explain it in one line.
- We build ONE small web tool in phases. Only one Claude session works at a
  time. The Progress Log at the end of this file is our handover logbook.

## What we are building
- A tool with at most 3 pages: index.html (entry page), dashboard.html
  (dashboard) and at most one more page.
- Every record has location, urgency (Low / Medium / High) and status
  (Open / In progress / Resolved), plus the columns in "Our tool" below.
- All data is MADE UP. Never add real names, phone numbers, employee IDs or
  real MCL figures.

## Technical rules
1. Plain HTML, CSS and JavaScript only. Pages stay in the top folder; SQL
   files go in the database folder. No frameworks, no npm, no package.json,
   no build step.
2. Vercel publishes the site from the main branch. Use relative links only,
   e.g. href="dashboard.html".
3. Load Supabase from the jsDelivr CDN, then our settings, in this order:
     <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
     <script src="config.js"></script>
   Then create the client like this (do not call the variable "supabase"):
     const db = window.supabase.createClient(window.SUPABASE_URL,
                                              window.SUPABASE_PUBLISHABLE_KEY);
4. The Project URL and the publishable key live only in config.js. Never use
   or ask for a secret key, a service_role key or the database password.
5. For charts, load Chart.js from the jsDelivr CDN.
6. No login or sign-up. Anyone with the link can use the tool.
7. You may not be able to reach our database. Do NOT try to test the database
   connection. Write the code; we test it on the live website.
8. If anything fails, show a friendly message on the page that also includes
   the actual error text, so we can pass it on.
9. Every page must work well on a mobile phone: large buttons, readable text,
   no sideways scrolling. Use the same header and menu on every page.
10. Never delete config.js or CLAUDE.md.

## Database rules
- Our Data Keeper runs all SQL by pasting it into the Supabase SQL Editor.
  You cannot run SQL yourself.
- Give SQL as ONE block that runs in one go. Also save it in the database
  folder: 01-setup.sql, then 02-..., 03-... for later changes.
- One table. It must have: id uuid primary key default gen_random_uuid()
  and created_at timestamptz not null default now().
- Enable Row Level Security. Add policies that let the roles anon and
  authenticated SELECT, INSERT and UPDATE. No delete.
- Always include: grant select, insert, update on the table to anon,
  authenticated; (new Supabase projects need it, or the website gets
  "permission denied").
- Never drop a table or delete rows.
- Avoid changing the table after Phase 1. If a change is really needed, give
  one small block and explain it in one sentence.

## How to work with us
- Make one change at a time. Do not change parts that already work unless we
  ask.
- After each change, reply in 3 short bullets: what you changed and what we
  should test on the live website.
- Commit and push your work at every stopping point.

## Takeover and handover
- At the START of every session: read the Progress Log below and summarize it
  in 3 bullets (what exists, what works, what is next).
- At a "save point": add a new entry at the end of the Progress Log (phase,
  builder, what was built, what works, known problems, next step). Then
  commit and push.

## Our tool (filled in during Phase 1)
- Team: MCL MDP team
- Tool name: Daily Coal & OB Production Dashboard - Bhubaneswari OCP
- Problem: Track shift-wise and daily Coal & OB production, compare Actual vs Target, watch cumulative production and record why production fell short.
- Who records / who decides: Shift in-charge records each shift; the Project Officer / Manager reviews the dashboard.
- Table name and columns: production_log - id, created_at, log_date, shift (A/B/C), location, coal_target, coal_actual, ob_target, ob_actual, shortfall_reason, delay_hours, remarks, corrective_action, urgency, status. One row per date + shift (unique).
- Pages: index.html = entry page (also edits a record via ?id=...); dashboard.html = dashboard; records.html = list, edit and remove records

## Progress Log (newest entry at the bottom)
- Phase 0 (starter): placeholder index.html, config.js without settings and
  this CLAUDE.md. Next: Phase 1 - the table and the entry page.
- Phase 1 (Claude): built database/01-setup.sql (table production_log), index.html (shift entry form with live calculations, recent entries, status change), dashboard.html (period filter, KPI tiles, 6 charts, daily A+B+C tables with cumulative Target vs Actual, shortfall reasons summary and log), style.css and app.js (shared helpers). Works: code written but NOT tested on the live site. Known problems: config.js still has placeholders; Data Keeper must run 01-setup.sql first. Next: Data Keeper runs SQL, fills config.js, tests entry + dashboard on the live site.
- Sample data: added database/02-sample-data.sql (138 made-up rows, 16 Aug - 30 Sep 2026, remarks start with SAMPLE). Data Keeper runs it after 01-setup.sql.
- Phase 2 (Claude): full dashboard. dashboard.html now has filters (period, shift, Coal/OB), management summary, 10 KPI cards, shift-wise table, status icons (green 100%+, yellow 90-99.9%, red below 90%), 7 charts (shift bars, daily lines, cumulative lines, reason donut), MTD/YTD table, shortfall analysis, Export to Excel (SheetJS from jsDelivr, CSV fallback) and Print/Save as PDF. Added records.html (edit / remove), dark-light mode, shared header in app.js. "Remove" hides a record (column is_void) and does NOT delete it, because our rules forbid deleting. NEW SQL: database/03-add-remove-flag.sql - Data Keeper must run it once, or the pages show an error mentioning is_void. Tested only with fake data in a test browser, NOT on the live site. Next: run 03, test on live site.
- Settings: config.js filled with the Project URL and publishable key. Data Keeper has run SQL 01, 02 and 03 (138 sample rows confirmed). Next: test all three pages on the live site.
- Logo: header shows logo.jpg at the top right (hidden if the file is missing). The MCL logo file logo.jpg is in the top folder.
- Daily total option: index.html has an "Entry type" choice. "Whole day" splits one daily figure equally into shifts A, B and C (3 records, last shift takes rounding). Tested only with fake data.
- Classy look: style.css restyled (gold accent, refined header, soft cards and shadows, serif summary title, striped tables, pill status badges, smooth hover effects). Only looks changed, no features.
- Two levels: dashboard.html has a "View level" switch. Project Officer = full detail (as before). Area GM = big picture (performance at a glance, KPIs, shift table, cumulative charts, reasons donut, MTD/YTD, open High/Medium items needing attention). Link: dashboard.html?level=gm. It is only a view switch, NOT a security lock, because the tool has no login (rule 6).
