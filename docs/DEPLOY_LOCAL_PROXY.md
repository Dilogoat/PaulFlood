# Local PC Deployment (Proxy + NO-IP)

## 1) Run Application
1. Copy `.env.example` to `.env`.
2. Set strong values for `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`.
3. Install dependencies.
4. Run migrations and seed:
   - `npm run db:generate`
   - `npm run db:migrate`
   - `npm run db:seed`
5. Start app on local interface only:
   - `npm run build`
   - `npm run start -- -p 3000`

## 2) Reverse Proxy Requirements
- Terminate TLS at the proxy.
- Forward `https://your-noip-host` traffic to `http://127.0.0.1:3000`.
- Enforce HTTP to HTTPS redirect.
- Set upload limit to expected media size.
- Add basic request rate limiting for `/admin`.

## 3) DNS (NO-IP)
- Point NO-IP hostname to your public WAN IP.
- Configure automatic IP update client on your local machine/router.

## 4) Security Hardening
- Keep `/admin` protected by credentials.
- Optional: add IP allowlist at proxy for `/admin`.
- Rotate `ADMIN_SESSION_SECRET` if compromise is suspected.
- Use strong unique admin password.

## 5) Backups
- Backup files:
  - `prisma/dev.db`
  - `public/uploads/`
- Schedule nightly backup task.
- Keep at least one off-machine copy.

## 6) Restore Drill
- Restore `dev.db` and `public/uploads`.
- Start app and validate:
  - `/winners`
  - `/media`
  - `/sources`
