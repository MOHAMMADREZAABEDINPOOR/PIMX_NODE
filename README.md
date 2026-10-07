<div align="center">

<img src="assets/readme/hero.gif" width="1200" alt="PIMX NODE — rotating 3D geometry" />

**[English](README.md) · [فارسی](README.fa.md)**

<img src="assets/readme/identity.svg" width="1200" alt="web / English and Persian documentation" />

</div>

# PIMX NODE

A browser file-transfer workspace built around WebRTC data channels, a Node.js WebSocket signaling service and AES-GCM encryption of transferred chunks.

[GitHub](https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_NODE) · [PIMX / Profile](https://github.com/MOHAMMADREZAABEDINPOOR) · [Static artwork](assets/readme/hero.png)

## Features

- Create rooms and discover connected peers
- Transfer encrypted file chunks over RTCDataChannel
- English/Persian interface with theme preferences
- Node signaling server and optional Pages visitor endpoints

## Stack

| Tool | Version / source |
|---|---|
| React | `^19.0.1` |
| Vite | `^6.2.3` |
| TypeScript | `~5.8.2` |
| Express | `^4.21.2` |
| Motion | `^12.23.24` |
| Tailwind CSS | `^4.1.14` |

## Getting started

Node.js 22.12+ and the package manager declared in package.json. Install dependencies from the checked-in lockfile where available.

```bash
git clone https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_NODE.git
cd PIMX_NODE

npm ci
npm run dev
```

## Configuration

These names are found in the example configuration or source; not all are required. Check their defaults/usage in those files and supply secrets only in your local or hosting environment.

| Name | Role |
|---|---|
| `APP_URL` | Application setting; inspect its definition |
| `GEMINI_API_KEY` | Credential/connection setting; keep private |

Hosting bindings: `PIMX_VISITS`.

## Usage

Run the Node server, open the same room on two browsers, connect the peers and choose a file. Keep both tabs open until the transfer completes.

## Project structure

| Path | Role |
|---|---|
| [`assets/`](assets/) | Brand/media/README assets |
| [`functions/`](functions/) | Hosting API functions |
| [`src/`](src/) | Application source |
| [`index.html`](index.html) | Project entry/configuration file |
| [`metadata.json`](metadata.json) | Project entry/configuration file |
| [`package.json`](package.json) | Project entry/configuration file |
| [`tsconfig.json`](tsconfig.json) | Project entry/configuration file |
| [`wrangler.toml`](wrangler.toml) | Project entry/configuration file |

## Commands and checks

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

These commands are declared in package.json; the list is not a test execution report. Test commands may need a browser, service or prepared database.

## Deployment

Deploy the build according to its architecture: server-backed projects need a Node process; static Vite frontends can host dist. Pages functions, KV or D1 require separate configuration.

## Limitations

A static Pages deployment alone does not host the WebSocket signaling server. NAT/firewalls can prevent direct connectivity. Use HTTPS/WSS for hosted browser sessions and review encryption before sensitive use.

## Troubleshooting

- Missing packages: install dependencies using the project’s package manager.
- API/network failure: check the configured origin, provider and hosting bindings.
- Old assets: rebuild when a build script exists, then clear the browser cache.

## Contributing

Create a focused branch, verify the affected behavior and explain the change clearly. Keep private data, build outputs and local databases out of commits.

## License

No repository-level license file is included in this snapshot. Public visibility alone does not grant reuse rights; contact the repository owner for terms.

---

Part of **PIMX** · Documentation in English and Persian.
