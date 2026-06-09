# Legacy v0 Prototype

The original SQLite-based prototype is frozen on:

- **Branch:** `legacy/v0`
- **Tag:** `v0-prototype`

To inspect or run the prototype:

```bash
git checkout legacy/v0
npm install
cp .env.example .env
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Do not develop new features on `legacy/v0`. All E-Prime work happens on `main`.
