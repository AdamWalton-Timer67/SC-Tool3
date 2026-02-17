# QNAP TS-251+ (QTS 5.2.8.3359) deployment guide (local-only mode)

This project now runs fully on NAS equipment **without Supabase and without S3**:

1. The SvelteKit web app
2. Local JSON/in-memory data layer (`src/lib/mock-db.ts`)
3. Local file uploads written into `static/uploads/*`

> Recommended: use QNAP **Container Station** with Docker Compose support.

## 1) Prepare environment variables

Copy `.env.example` to `.env` and set only what you need for your LAN deployment:

- `PUBLIC_OAUTH_REDIRECT_URL` (if you expose auth provider redirects)
- auth provider toggles (`PUBLIC_ENABLE_*`) as desired

No Supabase or S3 credentials are required in this local-only deployment mode.

### Example (NAS LAN)

```env
PUBLIC_ENABLE_DISCORD_AUTH=false
PUBLIC_ENABLE_TWITCH_AUTH=false
PUBLIC_ENABLE_GOOGLE_AUTH=false
PUBLIC_SHOW_FULL_LOCATION_DETAILS=false
PUBLIC_OAUTH_REDIRECT_URL=http://192.168.1.20:4173
```

## 2) Build and run the web app

```bash
npm install
npm run build
npm run preview -- --host 0.0.0.0 --port 4173
```

## 3) Optional: run app in Docker on NAS

A compose file is included at `deploy/nas/docker-compose.yml`.

```bash
docker compose -f deploy/nas/docker-compose.yml up -d --build
```

The app will be exposed on `4173`.

## 4) Reverse proxy / SSL (recommended)

Using QNAP reverse proxy (or Traefik/Nginx), map:

- `https://your-domain` -> `http://nas-ip:4173`
- Ensure `PUBLIC_OAUTH_REDIRECT_URL` matches your public URL if auth is enabled.

## Local uploads on NAS

Image uploads are stored locally at runtime under:

- `static/uploads/images/*`

For persistence across container recreations, mount `static/uploads` to a NAS volume.


## Local login + admin approval flow

- Default local admin:
  - Email: `local@test.lan`
  - Password: `admin123`
- New accounts created from the signup dialog are stored as `approved: false`.
- Admin must approve accounts before first login using:
  - `GET /api/admin/users/pending`
  - `POST /api/admin/users/:id/approve`

## Notes specific to TS-251+

- Keep container memory limits conservative (2–4 GB total if RAM is limited).
- Use an SSD-backed volume for better responsiveness.
- Back up your NAS volume containing app code and `static/uploads` regularly.
