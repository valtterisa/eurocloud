---
title: Commands
description: Create, list, inspect, SSH into, and destroy cloud servers with eurocloud.
order: 3
---

Every data command accepts `--provider <name>` and `--json`.

## create

```bash
eurocloud create --name my-app
eurocloud create --name my-app --provider ovh
eurocloud create --name my-app --type cpx21 --image ubuntu-24.04 --location nbg1
eurocloud create --name my-app --ssh-key my-laptop --ssh-key 123456
```

`--name` is required. Other flags fall back to the provider defaults.

| Flag | Hetzner default | OVH default |
|------|-----------------|-------------|
| `--type` | `cpx11` | `b2-7` |
| `--image` | `ubuntu-24.04` | `Ubuntu 24.04` |
| `--location` | `nbg1` | `GRA11` |

`--ssh-key` is repeatable. OVH attaches the first key (the API accepts one).

## list

```bash
eurocloud list
eurocloud list --provider ovh
```

## get

Resolve by name or provider ID.

```bash
eurocloud get my-app
eurocloud get 42
```

## ssh

Opens a native session: `ssh <user>@<ipv4>`.

```bash
eurocloud ssh my-app
eurocloud ssh my-app --user ubuntu --port 22 --provider ovh
```

Hetzner default user is `root`. OVH default user is `ubuntu`.

`--json` prints connection details and does not spawn SSH (useful for agents).

## destroy

```bash
eurocloud destroy my-app
```
