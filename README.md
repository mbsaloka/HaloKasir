# Halo Kasir

Halo Kasir is a Next.js 16 App Router POS/CRM app backed by Neon Postgres, Drizzle ORM, and Better Auth.

## Environment

Copy `.env.example` to `.env.local` and fill in your Neon connection string:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DB?sslmode=require"
BETTER_AUTH_SECRET="replace-with-a-long-random-secret"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

For Vercel production, set `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to your canonical `https://...` domain, then redeploy so the client-side `NEXT_PUBLIC_APP_URL` is rebuilt. If you also use preview, branch, or alternate custom domains, add them to `BETTER_AUTH_TRUSTED_ORIGINS` as a comma-separated list.

## Database

Generate and apply schema changes:

```bash
pnpm db:generate
pnpm db:migrate
```

For development, you can also push the schema directly:

```bash
pnpm db:push
```

Seed the database with users, products, members, purchases, sales transactions, charts, and account history:

```bash
pnpm db:seed
```

Seeded login:

```text
admin@halokasir.local
password1234
```

## Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).
