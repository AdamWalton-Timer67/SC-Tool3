# QNAP TS-251+ (QTS 5.2.8.3359) deployment guide

This project runs in **free NAS mode**:

1. SvelteKit web app only
2. No Supabase / no paid backend dependencies

> Recommended: use QNAP **Container Station** with Docker Compose support.

## 1) Prepare environment variables

Copy `.env.example` to `.env` and set optional S3 values only if needed.

## 2) Build and run the web app

```bash
npm install
npm run build
npm run preview -- --host 0.0.0.0 --port 4173
```

## 3) Optional: run app in Docker on NAS

```bash
docker compose -f deploy/nas/docker-compose.yml up -d --build
```

The app is exposed on `4173`.

## 4) Reverse proxy / SSL (recommended)

Using QNAP reverse proxy (or Traefik/Nginx), map:

- `https://your-domain` -> `http://nas-ip:4173`

## Notes specific to TS-251+

- Keep container memory limits conservative (2–4 GB total if RAM is limited).
- Prefer SSD volume for better I/O.


## 5) Built-in test dataset

The app ships with a local in-memory mock dataset (`src/lib/mock-db.ts`) used by the Supabase compatibility layer.

It includes example records for:
- Wikelo rewards and ingredients
- Locations and location ingredient counts
- Organizations and members
- Suggestions

This allows functional UI testing on NAS without any external database service.


## 6) Rebuild data from the Google Sheet

Run:

```bash
npm run rebuild:sheet-db
```

The script fetches all visible tabs and merges entries in chronological order (oldest first, newest updates last) into `src/lib/mock-db.generated.json`.
Optional overrides:
- `SHEET_ID=<google_sheet_id>`
- `SHEET_DEFAULT_GID=<gid>` (used if tab discovery fails)
- `SHEET_GIDS=<gid1,gid2,...>` (skip html tab discovery and force exact gid list)

