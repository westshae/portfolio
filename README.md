## ProperHabit

A minimal habit tracking app built with Next.js, Drizzle ORM, and PostgreSQL. Track two kinds of habits:

- **Simple habits**: binary done/not-done per day
- **Growth habits**: tasks with an impressiveness score (1–3) that award points when completed

Includes Google Sign-In, weekly summaries, and a clean UI with Tailwind CSS.

### Tech stack

- **Framework**: Next.js 15, React 19
- **Styling**: Tailwind CSS 4
- **Auth**: NextAuth (Google provider)
- **Database**: PostgreSQL + Drizzle ORM (`postgres-js` driver)
- **State**: Zustand

### Prerequisites

- Node.js 20+
- Yarn (recommended; a `yarn.lock` is present)
- A PostgreSQL database

### Quick start

1) Install dependencies

```bash
yarn install
```

2) Configure environment

Create a `.env.local` at the project root based on the .example.env

3) Prepare the database (Drizzle)

```bash
# Generate SQL from the schema and apply it
yarn db:apply

# Optional: inspect schema/data in a UI
yarn db:studio
```

You can also run a quick connection test:

```bash
node scripts/test-db-connection.js
```

4) Run the app

```bash
yarn dev
```

Visit `http://localhost:3000` and sign in with Google.

### Available scripts

- `yarn dev` – start Next.js dev server (Turbopack)
- `yarn build` – production build
- `yarn start` – start production server
- `yarn lint` – run linting
- `yarn db:generate` – generate SQL migrations from Drizzle schema
- `yarn db:migrate` – run pending SQL migrations
- `yarn db:push` – push schema changes (safe for early dev)
- `yarn db:studio` – open Drizzle Studio (web UI)
- `yarn db:apply` – convenience: `generate` then `push`

### Project structure

```text
src/
  app/               # Next.js App Router
    api/             # REST endpoints
    (pages)          # UI routes (e.g., habits, profile, summary)
  components/        # UI components
  lib/
    db/              # Drizzle config and schema
    auth.ts          # NextAuth configuration
  store/             # Zustand store
  types/             # Shared types
drizzle/             # Generated SQL and snapshots
public/              # PWA assets, icons, service worker
```

### API overview (selected)

- `GET /api/summaries` – weekly summary (simple habits avg/day, growth points avg/day, most skipped habits)
- `GET/POST /api/habits/simple` – list/create simple habits
- `PUT/DELETE /api/habits/simple/[id]` – update/delete a simple habit
- `GET/POST /api/habits/impressiveness` – list/create growth habits
- `PUT/DELETE /api/habits/impressiveness/[id]` – update/delete a growth habit
- `PUT /api/habits/impressiveness/[id]/entries` – toggle a specific day’s completion
- `GET/PUT /api/profile` – fetch/update profile

All endpoints require an authenticated session. Sign in with Google.

### Environment notes

- `DATABASE_URL` is used by both the app and Drizzle Kit (`drizzle.config.ts`).
- `NEXTAUTH_SECRET` should be a strong random string (e.g., `openssl rand -base64 32`).
- In production, set `NEXTAUTH_URL` to your public URL.

### Deployment

Deploy on your platform of choice (e.g., Vercel, Fly.io). Ensure the following env vars are set in your hosting provider:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

Run `yarn build` during the build phase and `yarn start` to serve.

### Troubleshooting

- Auth callback mismatch: verify the Google OAuth redirect URI matches your `NEXTAUTH_URL`.
- DB errors: check `DATABASE_URL` and apply schema with `yarn db:apply`.
- Windows + OpenSSL: if you don’t have OpenSSL, generate a secret at `https://generate-secret.vercel.app/32`.


