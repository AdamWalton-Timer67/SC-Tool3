# QNAP TS-251+ (QTS 5.2.8.3359) deployment guide (local-only mode)

This project now runs fully on NAS equipment using:

1. The SvelteKit web app
2. MariaDB for users, rewards, ingredients, requirements, and admin CRUD
3. Local file uploads written into `static/uploads/*`

> Recommended: use QNAP **Container Station** with Docker Compose support.

## 1) Prepare environment variables

Copy `.env.example` to `.env` and set only what you need for your LAN deployment:

- `PUBLIC_OAUTH_REDIRECT_URL` (if you expose auth provider redirects)
- auth provider toggles (`PUBLIC_ENABLE_*`) as desired

No Supabase or S3 credentials are required in this local-only deployment mode.

Required MariaDB variables:

- `MARIADB_HOST` (`mariadb` when using the bundled Docker Compose stack)
- `MARIADB_PORT` (default `3306`)
- `MARIADB_USER`
- `MARIADB_PASSWORD`
- `MARIADB_DATABASE`


### Example (NAS LAN with bundled MariaDB container)

```env
MARIADB_HOST=mariadb
MARIADB_PORT=3306
MARIADB_USER=wikelo
MARIADB_PASSWORD=change-me
MARIADB_DATABASE=wikelo
MARIADB_ROOT_PASSWORD=change-root-password

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

The NAS deployment now uses a dedicated image build (`deploy/nas/Dockerfile`) instead of bind-mounting the source tree into a generic Node container. This makes installs deterministic and avoids host/container dependency drift.

### Build and run

From the repository root:

```bash
docker compose -f deploy/nas/docker-compose.yml --env-file .env up -d --build
```

Or from inside `deploy/nas` (use an absolute env path to avoid path resolution issues in Container Station):

```bash
docker compose --env-file /share/Container/sc-tool3/.env up -d --build
```

The app is exposed on `4173` and includes a container healthcheck.

This Compose stack also runs a local `mariadb` service with a persistent volume (`sc-tool3-mariadb-data`) so the web app does not need to reach a LAN database IP.

### Initialize MariaDB schema (first run)

After containers are up, import the auth schema into the MariaDB container:

```bash
docker exec -i sc-tool3-mariadb mariadb -uroot -p"$MARIADB_ROOT_PASSWORD" "$MARIADB_DATABASE" < MARIADB_AUTH_SCHEMA.sql
```

### Why this fixes the Rollup musl error

- The old setup used `node:20-alpine` + a mounted `node_modules` volume, which could leave optional native dependencies in a broken state between rebuilds.
- The new setup builds everything in-image on Debian (`node:20-bookworm-slim`) using `npm ci --include=optional`, so Rollup optional packages are resolved consistently at build time.
- Runtime only mounts `static/uploads` for persistent local uploads.

### Clean rebuild commands (recommended after migration)

```bash
# from repo root
docker compose -f deploy/nas/docker-compose.yml down --remove-orphans
docker image rm sc-tool3-web:nas 2>/dev/null || true
docker compose -f deploy/nas/docker-compose.yml up -d --build
```

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
