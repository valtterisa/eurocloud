# eurocloud

Monorepo for the **eurocloud** CLI and its marketing site.

| Path | What |
|------|------|
| `packages/cli` | `eurocloud` command — Hetzner and OVHcloud servers |
| `apps/web` | Astro landing page and docs |

## Commands

```bash
pnpm install
pnpm dev      # CLI watch + Astro site
pnpm build
pnpm test     # CLI unit tests (no live cloud creates)
```

Live cloud tests (create a real server, then delete it):

```bash
pnpm --filter eurocloud test:live
```

Requires credentials in `packages/cli/.env`. See `.env.example` there.

## CLI

```bash
pnpm --filter eurocloud build
pnpm --filter eurocloud exec eurocloud --help
```

Docs: run `pnpm --filter @eurocloud/web dev` and open the local Astro URL.
