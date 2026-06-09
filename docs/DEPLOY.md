# Deployment Guide — Paul Flood Heritage (E-Prime)

Self-hosted deployment for Next.js 15 + PostgreSQL. Supersedes `docs/DEPLOY_LOCAL_PROXY.md` for the E-prime stack.

## Prerequisites

- Node.js 24.16+ and npm 11+
- PostgreSQL 16 (local, Docker, or managed)
- Reverse proxy with TLS (Caddy, nginx, Traefik)
- Optional: NO-IP or static DNS for home hosting

## 1. Environment

Copy `.env.example` to `.env` and set:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `ADMIN_USERNAME` | Admin login username |
| `ADMIN_PASSWORD_HASH` | bcrypt hash from `npm run hash-password -- "your-password"` |
| `SESSION_SECRET` | 32+ random characters for session signing |
| `NEXT_PUBLIC_SITE_URL` | Public URL (e.g. `https://paulflood.example`) |
| `STORAGE_LOCAL_PATH` | Upload storage path (default `./storage/uploads`) |

**bcrypt in `.env`:** Escape each `$` as `\$` — Next.js expands `$` in env values.

## 2. Database setup

```bash
docker compose up -d          # local Postgres
npm ci
npm run db:generate
npx prisma migrate deploy
npm run import:csv            # seed research data
```

## 3. Build and run

```bash
npm run build
npm run start -- -p 3000
```

Bind to localhost only; let the reverse proxy handle public traffic:

```bash
HOSTNAME=127.0.0.1 npm run start -- -p 3000
```

## 4. Reverse proxy

- Terminate TLS at the proxy.
- Forward `https://your-host` → `http://127.0.0.1:3000`.
- Redirect HTTP → HTTPS.
- Set `client_max_body_size` (or equivalent) to at least 6MB for media uploads.
- Rate-limit `/admin` and `/api/auth` (e.g. 10 req/min per IP).

### Caddy example

```caddy
paulflood.example {
  reverse_proxy 127.0.0.1:3000
}
```

## 5. DNS (NO-IP / dynamic IP)

- Point hostname to your public WAN IP.
- Run the NO-IP update client on the host or router.
- Set `NEXT_PUBLIC_SITE_URL` to the HTTPS hostname.

## 6. Backups

Back up nightly (or before each content change):

1. **PostgreSQL** — `pg_dump`:
   ```bash
   pg_dump "$DATABASE_URL" -Fc -f backups/paulflood-$(date +%F).dump
   ```
2. **Media** — `public/uploads/` and `storage/uploads/`
3. **Env** — store `.env` securely off-machine (not in git)

Keep at least one off-machine copy.

## 7. Restore drill

1. Stop the app.
2. Restore database: `pg_restore -d paulflood --clean backups/paulflood-YYYY-MM-DD.dump`
3. Restore upload directories.
4. Start app and verify:
   - `/` — stats render
   - `/winners` — table loads
   - `/media` — images display
   - `/admin` — login works

## 8. Production checklist

- [ ] Strong admin password and `SESSION_SECRET`
- [ ] HTTPS enabled
- [ ] Proxy rate limits on admin routes
- [ ] Backups scheduled and restore tested
- [ ] `docs/SECURITY.md` items reviewed
- [ ] V1 Definition of Done (`docs/E_PRIME_PLAN.md` §2) signed off
