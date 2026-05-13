# Nameframe

Version: `2.1`  
Authors: `Harsh Bhardwaj | Aryan Chauhan | Saumya Aggarwal`

Nameframe helps event teams create, personalize, and deliver certificates at scale with predictable operational behavior. It reduces manual coordination across template editing, participant imports, winner handling, and email delivery.

## Business Value

- Faster certificate turnaround for events with large participant lists.
- Better organizer control through event-level settings and template roles.
- Lower delivery risk via queueing, retries, and provider fallback.
- Clear verification-ready structure (code generation + issue records) for auditability.

## Core Capabilities

- Event creation with metadata, template binding, and positional template support.
- Participant import using preview-then-confirm to prevent bad writes.
- Certificate rendering pipeline with shared typed render input.
- Delivery queue pipeline with retries and provider fallback.
- Dashboard and admin analytics surfaces for operational visibility.

## Reliability and Fallbacks

- Provider fallback for email transport: primary provider failure can fail over to alternate provider logic.
- Queue-first bulk delivery with chunk processing and retry passes.
- Final sweep behavior to reduce stranded pending sends.
- Backward-compatible template fallback when role-specific template is not present.

## Tech Stack

- Next.js 15 (App Router), React 19, TypeScript
- Prisma + PostgreSQL
- Clerk auth
- Cloudinary uploads
- Recharts analytics

## Quick Start

```bash
npm install
npm run dev
```

Create `.env.local` with required keys (DB, Clerk, Cloudinary, email providers, and `DEV_PASS` for admin-gated analytics route).

## Current Scope Notes

- Verification endpoint and QR experience are intentionally staged for a later slice.
- UI polish is ongoing; functionality and data integrity are prioritized.

## Documentation

- Architecture and interview guide: [Architecture.md](/D:/Coding/CertMint/nameframe/Architecture.md)

---

Share any missing org/contact/repo details and I will add them in one pass.
