# eurocloud

Create, list, inspect, destroy, and SSH into Hetzner and OVHcloud servers.

```bash
npm install -g eurocloud
eurocloud create --name my-app --provider hetzner
```

Or run without installing:

```bash
npx eurocloud --help
```

Docs: [valtterisa.github.io/eurocloud](https://valtterisa.github.io/eurocloud/)

## Auth

No login command. Set provider tokens in the environment or a `.env` file in the working directory.

Hetzner:

```bash
export HCLOUD_TOKEN=your-token
```

OVHcloud:

```bash
export OVH_APPLICATION_KEY=...
export OVH_APPLICATION_SECRET=...
export OVH_CONSUMER_KEY=...
export OVH_PROJECT_ID=...
```

## Commands

```bash
eurocloud create --name my-app --provider hetzner
eurocloud list --provider hetzner --json
eurocloud get my-app --provider hetzner
eurocloud ssh my-app --provider hetzner
eurocloud destroy my-app --provider hetzner
```

`--provider` is required (`hetzner` or `ovh`).
