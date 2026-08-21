# eurocloud CLI

Create, list, inspect, destroy, and SSH into Hetzner and OVHcloud servers.

Full docs live in `apps/web` (`pnpm --filter @eurocloud/web dev`).

```bash
pnpm --filter eurocloud build
pnpm --filter eurocloud exec eurocloud --help
```

Credentials: copy `.env.example` to `.env`. Live tests (`pnpm --filter eurocloud test:live`) create a real server and then delete it.
