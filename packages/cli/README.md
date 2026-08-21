# eurocloud

Create, list, inspect, destroy, and SSH into Hetzner and OVHcloud servers.

```bash
npm install -g eurocloud
eurocloud create --name my-app
```

Or run without installing:

```bash
npx eurocloud --help
```

Docs: [valtterisa.github.io/eurocloud](https://valtterisa.github.io/eurocloud/)

## Auth

No login command. Set provider tokens in the environment or a `.env` file in the working directory.

Hetzner (default):

```bash
export HCLOUD_TOKEN=your-token
```

OVHcloud:

```bash
export EUROCLOUD_PROVIDER=ovh
export OVH_APPLICATION_KEY=...
export OVH_APPLICATION_SECRET=...
export OVH_CONSUMER_KEY=...
export OVH_PROJECT_ID=...
```

## Commands

```bash
eurocloud create --name my-app
eurocloud list --json
eurocloud get my-app
eurocloud ssh my-app
eurocloud destroy my-app
```

Switch clouds with `--provider ovh` or `--provider hetzner`.
