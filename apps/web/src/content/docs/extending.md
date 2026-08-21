---
title: Extending
description: Add a new cloud provider behind the same eurocloud commands.
order: 6
---

Providers live under `packages/cli/src/providers/`. Each one implements `CloudProvider` from `types.ts`.

## Contract

A provider must:

- expose `id` and `defaults` (`type`, `image`, `location`, `sshUser`)
- `listServers()`, `getServer(nameOrId)`, `createServer(input)`, `destroyServer(nameOrId)`
- return the shared `Server` shape (`id` as string, `provider` set)

Keep vendor HTTP, signing, and ID lookup inside that folder. Commands must not import Hetzner or OVH types.

## Register

Add a factory in `packages/cli/src/providers/registry.ts`:

```ts
const factories = {
  hetzner: () => createHetznerProvider(),
  ovh: () => createOvhProvider(),
  ovhcloud: () => createOvhProvider(),
};
```

`listProviderIds()` is what `--help` and `unknown_provider` errors show.

## Tests

Live tests in `packages/cli/tests/live` create a real `euro-test-*` server, then delete it. After adding a provider, include it in `liveProviders()` when its credentials are present.
