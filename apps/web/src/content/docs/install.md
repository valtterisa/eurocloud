---
title: Install
description: Install the eurocloud CLI from npm and run it from your terminal.
order: 1
---

eurocloud is a Node.js 18+ CLI published as [`eurocloud`](https://www.npmjs.com/package/eurocloud) on npm.

## npm

```bash
npm install -g eurocloud
eurocloud --help
eurocloud create --name my-app
```

Run once without a global install:

```bash
npx eurocloud --help
```

pnpm and yarn work the same way:

```bash
pnpm add -g eurocloud
yarn global add eurocloud
```

## Requirements

- Node.js 18 or newer
- An API token for [Hetzner Cloud](./auth) and/or [OVHcloud](./auth)
- OpenSSH on your PATH if you use `eurocloud ssh`

## From source

Contributors can build the workspace package:

```bash
git clone https://github.com/valtterisa/eurocloud
cd eurocloud
pnpm install
pnpm --filter eurocloud build
pnpm --filter eurocloud exec eurocloud --help
```

## Next

Set credentials in [Authentication](./auth), then create a server with [Commands](./commands).
