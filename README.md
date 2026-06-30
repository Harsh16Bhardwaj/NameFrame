<p align="center">
  <img src="./public/nameframelogo.png" alt="NameFrame logo" width="96" />
</p>

<h1 align="center">NameFrame</h1>

<p align="center">
  Professional certificate generation, participant management, and email delivery for event teams.
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs" />
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=fff" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=fff" />
</p>

NameFrame helps organizers create certificate templates, import participants, generate personalized certificates, verify issued certificates, and deliver certificates through a queue-backed mailing pipeline.

## Project Status

This project is under active refactor. The current focus is making the certificate editor, delivery pipeline, data model, and free/pro feature boundaries predictable enough for production deployment.

For the current deployment, use https://name-frame.vercel.app/.

## Core Features

- Event creation with organizer metadata and certificate settings
- Certificate template upload and role-based template binding
- Participant import with preview and validation before database writes
- Winner/position support for first, second, and third place certificates
- On-demand certificate generation with Cloudinary-backed output
- Unique verification codes and public certificate verification routes
- Single-send, bulk-send, and scheduled-send delivery flows
- Queue-backed delivery with retry tracking and per-participant status
- Nodemailer-first email provider flow with Resend fallback support
- Admin and dashboard analytics for events, participants, and delivery activity
- Free/pro-ready schema with user roles, plan records, and queue tiers

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 15 App Router |
| UI | React 19, Tailwind CSS, Framer Motion, Lucide Icons |
| Auth | Clerk |
| Database | PostgreSQL |
| ORM | Prisma 7 |
| Storage / media | Cloudinary |
| Email | Nodemailer, Resend fallback |
| Analytics UI | Recharts |
| Imports | XLSX, PapaParse |

## Architecture Overview

NameFrame is built around the data model first:

- `Event` stores event metadata, email content, scheduling state, and template links.
- `Participant` stores recipient identity, participation state, delivery state, and verification fields.
- `CertificateTemplate` stores uploaded template metadata and editor configuration.
- `DeliveryQueueEvent` represents a batch or scheduled send job.
- `DeliveryQueueItem` stores per-participant delivery progress.
- `DeliveryAttempt` stores individual provider attempts for auditability.
- `SmtpCredentialPool` stores encrypted SMTP credentials for Nodemailer delivery.

The certificate send flow is:

1. Load the event, participant, and selected certificate template.
2. Generate or reuse certificate verification data.
3. Build a certificate URL from the active template and participant data.
4. Fetch the generated certificate bytes for attachment.
5. Compose the event email.
6. Send through Nodemailer first.
7. Fall back to Resend if the primary provider fails.
8. Update queue item, attempt, and participant delivery state.

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- Clerk application
- Cloudinary account
- SMTP account for Nodemailer delivery
- Optional Resend account for fallback delivery

### Install

```bash
npm install
```

### Configure Environment

Create `.env` or `.env.local` in the project root.

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
CLERK_WEBHOOK_SECRET="whsec_..."

CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

APP_CREDENTIAL_ENCRYPTION_KEY="use-a-long-stable-random-secret"
NODEMAILER_FROM="NameFrame <your-sender@example.com>"

RESEND_API_KEY="re_..."
RESEND_FROM="NameFrame <noreply@example.com>"

CRON_SECRET="use-a-private-cron-secret"
DEV_PASS="use-a-private-admin-dev-password"
```

`APP_CREDENTIAL_ENCRYPTION_KEY` must stay stable. SMTP passwords are encrypted with this key before being stored in the database. If the key changes, previously saved SMTP credentials cannot be decrypted.

## SMTP Credentials

Certificate delivery uses the `SmtpCredentialPool` table. Do not hardcode SMTP passwords in UI or delivery code.

Credentials are saved through:

```http
POST /api/admin/smtp-credentials
```

Example body:

```json
{
  "credentials": [
    {
      "label": "Primary Gmail",
      "host": "smtp.gmail.com",
      "port": 465,
      "username": "your-email@gmail.com",
      "password": "your-app-password",
      "secure": true,
      "sendLimit": 400,
      "active": true
    }
  ]
}
```

For Gmail, use an app password. A normal account password will usually fail.

## Development

```bash
npm run dev
```

The app runs with Turbopack in development.

## Production Build

```bash
npm run build
```

The build script runs:

```bash
prisma generate && next build
```

Start the production server locally:

```bash
npm run start
```

## Deployment Notes

Vercel deployment requires the same environment variables listed above.

Recommended Vercel setup:

- Add `DATABASE_URL` and `DIRECT_URL` from the production database.
- Add Clerk production keys and webhook secret.
- Add Cloudinary credentials.
- Add `APP_CREDENTIAL_ENCRYPTION_KEY` before saving SMTP credentials.
- Add `NODEMAILER_FROM` for the certificate sender identity.
- Add `CRON_SECRET` if using the delivery cron endpoint.
- Keep `npm run build` as the build command.

The current `next.config.ts` skips TypeScript and ESLint validation during build. This allows deployment while the refactor is in progress, but type and lint issues should be cleaned up before treating the app as production-stable.

## Useful Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page |
| `/dashboard` | Organizer dashboard |
| `/events` | Event list |
| `/events/[eventId]` | Event management, certificate preview, participant actions |
| `/create` | Event creation |
| `/participants` | Participant overview |
| `/templates` | Certificate templates |
| `/verify` | Public certificate verification |
| `/download/[eventID]` | Certificate download experience |

## API Highlights

| Endpoint | Purpose |
| --- | --- |
| `POST /api/events` | Create events |
| `GET /api/events/[eventId]` | Fetch event details |
| `POST /api/events/[eventId]/import-participants/preview` | Preview participant import |
| `POST /api/events/[eventId]/import-participants/confirm` | Commit participant import |
| `POST /api/send-email/single` | Send one participant certificate |
| `POST /api/send-email/bulk` | Queue or process bulk certificate delivery |
| `POST /api/send-email/schedule` | Schedule certificate delivery |
| `GET /api/verify/[code]` | Verify certificate by code |
| `POST /api/admin/smtp-credentials` | Save encrypted SMTP credentials |
| `POST /api/cron/delivery/process` | Process scheduled or pending delivery queue work |

## Current Caveats

- The project is actively being refactored, so some UI and architecture boundaries are still being cleaned up.
- Build currently ignores TypeScript and ESLint errors through `next.config.ts`.
- Generated Prisma client files may change after `prisma generate`.
- Certificate generation and delivery depend on valid Cloudinary, database, and email-provider configuration.
- Queue processing requires either a pro-triggered immediate tick or a cron call to the delivery processor.

## Authors

- Harsh Bhardwaj
- Aryan Chauhan
- Saumya Aggarwal

## License

Private project. All rights reserved unless a license is added.
