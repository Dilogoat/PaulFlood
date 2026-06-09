# Security Audit — E-Prime (Issue #26)

Audit date: 2026-06-08  
Reference: `docs/E_PRIME_PLAN.md` §8 Security Checklist

| Item | Status | Notes |
|------|--------|-------|
| bcrypt password storage | ✅ | `lib/auth/password.ts` compares against `ADMIN_PASSWORD_HASH` |
| Per-session signed tokens with expiry | ✅ | iron-session with 8h `maxAge` in `lib/auth/session.ts` |
| Secure cookie only over HTTPS | ✅ | `secure` when `NEXT_PUBLIC_SITE_URL` is `https://` |
| Middleware validates session | ✅ | `middleware.ts` on `/admin/*` and `/api/admin/*` |
| Every server action calls `requireAdmin()` | ✅ | All mutations in `app/(admin)/admin/actions.ts` |
| Admin API routes authenticated | ✅ | Upload route checks `isAdminLoggedIn()` |
| Upload type/size validation | ✅ | jpeg/png/webp/gif, max 5MB in `app/api/admin/media/upload/route.ts` |
| Sanitized filenames | ✅ | `safeFileName()` strips unsafe characters |
| No path traversal on upload | ✅ | Files written under `public/uploads/{year}/` only |
| CSRF — SameSite cookies | ✅ | `sameSite: "lax"` on session cookie |
| CSRF — origin check on mutations | ⚠️ | Rely on SameSite + POST forms; add origin check if exposing JSON APIs |
| Rate limit `/admin` at proxy | 📋 | Documented in `docs/DEPLOY.md` — configure at reverse proxy |
| Secrets only in env | ✅ | `.env` gitignored; `.env.example` has placeholders |
| Postgres credentials not committed | ✅ | Connection string via `DATABASE_URL` only |
| `next/image` remote patterns restricted | ✅ | No `remotePatterns` configured — local `/uploads` paths only |

## Recommendations before public launch

1. Set a strong `SESSION_SECRET` (32+ random bytes) in production.
2. Escape `$` as `\$` in `.env` for bcrypt hashes (Next.js env expansion).
3. Enable HTTPS and rate limiting on `/admin` and `/api/auth` at the reverse proxy.
4. Optional: IP allowlist for `/admin` on self-hosted deployments.
5. Schedule Postgres dumps and `public/uploads/` backups (see `docs/DEPLOY.md`).
