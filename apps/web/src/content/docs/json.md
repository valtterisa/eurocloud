---
title: JSON and agents
description: Stable JSON output for scripts and AI agents.
order: 5
---

Pass `--json` on create, list, get, destroy, and ssh. Errors also print as JSON when `--json` is set.

## Server object

```json
{
  "id": "42",
  "name": "my-app",
  "status": "running",
  "type": "cpx11",
  "image": "ubuntu-24.04",
  "location": "nbg1",
  "ipv4": "203.0.113.10",
  "ipv6": "2a01:4f8:0:1::1",
  "created": "2026-08-21T08:00:00+00:00",
  "provider": "hetzner"
}
```

`id` is always a string so OVH UUIDs and Hetzner numeric IDs share one shape.

## create

Same fields plus `root_password` (Hetzner, or `null`).

## destroy

```json
{
  "id": "42",
  "name": "my-app",
  "provider": "hetzner",
  "destroyed": true
}
```

## ssh --json

Does not open a session:

```json
{
  "id": "42",
  "name": "my-app",
  "provider": "hetzner",
  "user": "root",
  "host": "203.0.113.10",
  "port": 22,
  "command": "ssh -p 22 root@203.0.113.10"
}
```

## Errors

```json
{
  "error": {
    "code": "missing_token",
    "message": "Missing API token. Set HCLOUD_TOKEN in your environment or a .env file."
  }
}
```
