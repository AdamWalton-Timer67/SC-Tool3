# QNAP TS-251+ (QTS 5.2.8.3359) deployment guide

This project can run fully on a NAS by self-hosting:

1. The SvelteKit web app
2. A local Supabase stack (Auth + Postgres + Storage)

> Recommended: use QNAP **Container Station** with Docker Compose support.

## 1) Prepare environment variables

Copy `.env.example` to `.env` and set:

- `PUBLIC_SUPABASE_URL` to your NAS local Supabase API endpoint
- `PUBLIC_SUPABASE_ANON_KEY` from your self-hosted Supabase instance
- `SUPABASE_SERVICE_ROLE_KEY` from your self-hosted Supabase instance
- S3-compatible values if you keep object storage external (or point to local S3-compatible service)

### Example (NAS LAN)

```env
PUBLIC_SUPABASE_URL=http://192.168.1.20:8000
PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
PUBLIC_OAUTH_REDIRECT_URL=http://192.168.1.20:4173
```

## 2) Run Supabase locally on NAS

On the NAS (or from a remote shell against the NAS Docker engine):

```bash
supabase start
supabase status
```

Use the resulting URL/keys in `.env`.

## 3) Build and run the web app

```bash
npm install
npm run build
npm run preview -- --host 0.0.0.0 --port 4173
```

## 4) Optional: run app in Docker on NAS

A compose file is included at `deploy/nas/docker-compose.yml`.

```bash
docker compose -f deploy/nas/docker-compose.yml up -d --build
```

The app will be exposed on `4173` and should point to your NAS Supabase URL.

## 5) Reverse proxy / SSL (recommended)

Using QNAP reverse proxy (or Traefik/Nginx), map:

- `https://your-domain` -> `http://nas-ip:4173`
- Ensure `PUBLIC_OAUTH_REDIRECT_URL` matches your public URL.

## Notes specific to TS-251+

- Keep container memory limits conservative (2–4 GB total if RAM is limited).
- Prefer SSD volume for Postgres/Supabase data for better performance.
- Regularly back up Supabase/Postgres volumes.
