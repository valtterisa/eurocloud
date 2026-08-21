---
title: Install
description: Install the eurocloud CLI with pnpm and run it from your terminal.
order: 1
---

eurocloud is a Node.js 18+ CLI. Install it from the monorepo or link the built package.

## From this repository

```bash
git clone https://github.com/your-org/eurocloud
cd eurocloud
pnpm install
pnpm --filter eurocloud build
pnpm --filter eurocloud exec eurocloud --help
```

Then:

```bash
eurocloud --help
```

## Requirements

- Node.js 18 or newer
- An API token for [Hetzner Cloud](/docs/auth) and/or [OVHcloud](/docs/auth)
- OpenSSH on your PATH if you use `eurocloud ssh`

## Next

Set credentials in [Authentication](/docs/auth), then create a server with [Commands](/docs/commands).
