---
title: Providers
description: How eurocloud maps Hetzner and OVHcloud into one command surface.
order: 4
---

Commands call a `CloudProvider` interface. Pass `--provider` on every command. OVHcloud is registered as `ovh` (alias `ovhcloud`).

```bash
eurocloud list --provider hetzner
eurocloud list --provider ovh
```

Unknown names fail with `unknown_provider` and list the available providers.

## Hetzner

- API: `https://api.hetzner.cloud/v1`
- Auth: bearer token (`HCLOUD_TOKEN`)
- IDs may be numeric; eurocloud exposes them as strings in JSON
- Create without an SSH key returns a `root_password`

## OVHcloud

- API: `GET/POST/DELETE /cloud/project/{serviceName}/instance`
- Auth: application key, application secret, consumer key (signed `$1$` SHA1 headers)
- `--type` and `--image` accept a UUID or a name (`b2-7`, `Ubuntu 24.04`)
- Default region is `GRA11`

See [Authentication](./auth) for env vars.

## Adding another cloud

Implement `CloudProvider` in `packages/cli/src/providers/<name>/` and register a factory in `registry.ts`. See [Extending](./extending).
