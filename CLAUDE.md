# CLAUDE.md

Project guidance for Claude Code. Keep this file lean — it loads into every session.

## Product

Masjid (mosque) accounting and treasury platform. Treasurers and committees record
incoming donations and view a dashboard showing revenue across streams. The core job is
to record every donation accurately and keep restricted Islamic funds separate from
general income.

Every donation carries **two independent labels**:

1. **Donation type** — the Islamic category of the money:
   `zakat`, `sadaqah`, `lillah`, `zakat_al_fitr` (fitrana), `fidya`, `kaffarah`,
   `waqf`, `general`. Gift Aid is tracked as a flag on a donation, not a type.
2. **Cause** — the purpose the money was given for (e.g. roof repair, Ramadan iftar,
   hardship fund, youth programme). Causes are created by the mosque and have an
   optional target amount and deadline.

A donation record always has a `donation_type` and may reference a `cause_id`.

## Non-negotiable domain rules

- **Never commingle funds.** Restricted donation types (especially `zakat`,
  `zakat_al_fitr`, `fidya`, `kaffarah`, `waqf`) must never be mixed with `general`
  income in balances, reporting, or transfers. Each type maintains its own balance.
- **Some types have eligibility/usage constraints** (e.g. zakat may only be disbursed to
  eligible recipients). Do not write logic that silently moves money between types.
- **A cause may restrict which donation types it accepts.** Respect the cause's allowed
  types when recording a donation against it.
- **Uncategorised handling.** If a donation arrives without a clear type (e.g. a bank
  transfer referencing only "Ramadan donation"), record it as `uncategorised`, flag it,
  and **exclude it from reported balances** until a treasurer classifies it.
- **Money is stored as integer minor units (pence), never floats.** All amounts in the
  DB, API, and calculations are integers. Format to pounds only at the display layer.
  Currency is GBP unless a mosque sets otherwise.

## Stack & architecture

- **Frontend:** Next.js (App Router). Treasurer dashboard, intake forms, cause pages.
- **Backend:** FastAPI (Python). REST API for donations, causes, balances, reporting,
  and bulk import.
- **Data flow:** Next.js calls the FastAPI API; FastAPI owns all money logic and
  validation. Do not duplicate fund/balance rules in the frontend — the backend is the
  source of truth. The frontend may format and display only.
- Donations aggregate into (a) per-type balances and (b) per-cause progress
  (raised vs. target). Dashboard charts derive from these aggregates.

## Conventions

- **Backend:** Pydantic models for all request/response schemas; validate donation_type
  and cause constraints in the service layer, not the route handler. Type-hint
  everything. Money fields are `int` (pence) named like `amount_pence`.
- **Frontend:** TypeScript, Server Components by default; Client Components only where
  interactivity is needed. Keep API calls in a typed client module, not inline in
  components. Format currency with a single shared helper.
- **API shape:** JSON, snake_case on the backend; the frontend client maps to camelCase
  if needed. Return explicit error objects for validation failures (e.g. donation type
  not allowed for cause).
- Never trust client-supplied balances or totals — recompute on the server.

## Commands

- Frontend dev: `cd frontend && npm run dev`
- Frontend typecheck: `cd frontend && npx tsc --noEmit`
- Frontend lint: `cd frontend && npm run lint`
- Backend dev: `cd backend && /usr/bin/python3 -m uvicorn app.main:app --reload`
- Backend tests: `cd backend && /usr/bin/python3 -m pytest`
- Backend lint: `cd backend && /usr/bin/python3 -m ruff check .`
- Seed demo data: `cd backend && /usr/bin/python3 -m app.seed_demo`

> Note: system Python is `/usr/bin/python3` (3.10). `python3` on PATH resolves to 3.14 (no deps installed there).

## Hackathon scope

In scope: manual donation intake with type + cause, bulk import from a bank statement
(CSV) with uncategorised flagging, per-type balances, per-cause progress, and the
treasurer dashboard. Stub or defer: live payment-processor integration, real Gift Aid
HMRC submission, multi-mosque tenancy, auth beyond a simple session. Frame anything
deferred as a future extension rather than building it now.

## Demo flow (keep this working)

A donor gives £100 zakat, £20 sadaqah, £10 zakat al-fitr → dashboard shows three
separate type balances. A treasurer then uploads a bank transfer referenced "Ramadan
donation" with no type → it appears as **uncategorised** and is excluded from balances
until classified. Three causes (Roof Repair £10,000, Ramadan Iftar £5,000, Hardship
Fund £7,500) show raised-vs-target progress as donations land against them.
