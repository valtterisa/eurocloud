---
title: Authentication
description: Configure Hetzner and OVHcloud credentials for eurocloud using environment variables.
order: 2
---

eurocloud does not use a login command. Paste provider credentials into the environment or a `.env` file in the working directory.

Choose a provider with `--provider` on every command (`hetzner` or `ovh`).

## Hetzner

1. Open the [Hetzner Console](https://console.hetzner.cloud/).
2. Create a **Read & Write** API token (Security → API Tokens).
3. Set:

```bash
export HCLOUD_TOKEN=your-token
```

`EUROCLOUD_TOKEN` is used if `HCLOUD_TOKEN` is unset.

```bash
eurocloud list --provider hetzner
```

## OVHcloud

eurocloud talks to the [Public Cloud instance API](https://api.eu.ovhcloud.com/console/?section=%2Fcloud&branch=v1#get-/cloud/project/-serviceName-/instance).

1. Create keys at [eu.api.ovh.com/createToken](https://eu.api.ovh.com/createToken/) with GET/POST/DELETE on `/cloud/project/*`.
2. Set:

```bash
export OVH_APPLICATION_KEY=...
export OVH_APPLICATION_SECRET=...
export OVH_CONSUMER_KEY=...
export OVH_PROJECT_ID=your-public-cloud-project-id
```

Optional: `OVH_ENDPOINT=ovh-eu` (`ovh-us`, `ovh-ca`, or a full API URL).

```bash
eurocloud list --provider ovh
```

## `.env` file

You can keep the same variables in a `.env` file next to where you run the CLI. Do not commit that file.
