# SC-Tool3 deployment guide (current method)

This is the **current, recommended deployment path** for SC-Tool3.
It reflects the repo’s MariaDB-first runtime and the NAS Docker Compose workflow.

---

## Architecture (what runs in production)

The deployed stack consists of:

1. **`sc-tool3-web`** (SvelteKit app, built from `deploy/nas/Dockerfile`)
2. **`mariadb`** (local MariaDB 11 container)
3. **Persistent volumes/storage**
   - MariaDB data volume: `sc-tool3-mariadb-data`
   - Uploaded files bind mount: `static/uploads` -> `/app/static/uploads`

Key behavior:

- Runtime data/auth is backed by **MariaDB**.
- No Supabase or S3 credentials are required for this local/NAS mode.
- App service depends on MariaDB health before startup.

---

## 1) Requirements

- QNAP with Container Station (or any Docker host)
- Docker + Docker Compose v2 available on host
- This repository on disk
- A `.env` file at repository root (next to `package.json`)

---

## 2) Configure environment variables

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

At minimum, set:

```env
MARIADB_HOST=mariadb
MARIADB_PORT=3306
MARIADB_USER=wikelo
MARIADB_PASSWORD=change-me
MARIADB_DATABASE=wikelo
MARIADB_ROOT_PASSWORD=change-root-password

ORIGIN=http://<your-nas-ip-or-domain>:4173
PUBLIC_OAUTH_REDIRECT_URL=http://<your-nas-ip-or-domain>:4173
```

Notes:

- `MARIADB_HOST` should remain `mariadb` when using the bundled compose stack.
- `ORIGIN` should match the URL users actually open.
- Auth provider toggles (`PUBLIC_ENABLE_*`) can stay `false` unless intentionally enabled.

---

## 3) Deploy with the wrapper script (recommended)

From repo root:

```bash
bash ./deploy/nas/compose.sh up -d --build
```

Why this is preferred:

- Uses `deploy/nas/docker-compose.yml`
- Automatically reads root `.env`
- Defaults `DOCKER_BUILDKIT=0` for better compatibility with QNAP Container Station
- Prints targeted recovery hints for known NAS Docker metadata failures

Stop stack:

```bash
bash ./deploy/nas/compose.sh down --remove-orphans
```

---

## 4) Initialize database schema (first deployment only)

After containers are healthy, import auth/account schema:

```bash
docker exec -i sc-tool3-mariadb mariadb -uroot -p"$MARIADB_ROOT_PASSWORD" "$MARIADB_DATABASE" < MARIADB_AUTH_SCHEMA.sql
```

What this creates:

- `auth_users`
- `profiles`
- `user_roles`
- default local admin account (`local@test.lan` / `admin123`)

### About rewards/ingredients/requirements schema

The app expects tables such as `rewards`, `ingredients`, `locations`, `reward_ingredients`, and `reputation_requirements` to exist and be populated. Ensure your MariaDB dataset includes them before opening production.

The app also runs schema compatibility adjustments (e.g. add-missing-columns for rewards/ingredients/requirements) via server code when wikelo endpoints are requested.

---

## 5) Verify deployment health

### A. Container status

```bash
docker compose -f deploy/nas/docker-compose.yml --env-file .env ps
```

Expect both `sc-tool3-mariadb` and `sc-tool3-web` to be `Up` / healthy.

### B. Verify app responds

```bash
curl -I http://127.0.0.1:4173
```

Expect HTTP 200/3xx.

### C. Verify MariaDB connectivity from app perspective

```bash
curl -s http://127.0.0.1:4173/api/wikelo/rewards | head
```

If this returns JSON data (or at least not a DB configuration error), app↔DB path is functioning.

### D. Verify user account records exist

```bash
docker exec -i sc-tool3-mariadb mariadb -u"$MARIADB_USER" -p"$MARIADB_PASSWORD" "$MARIADB_DATABASE" -e "SELECT id,email,approved,created_at FROM auth_users LIMIT 10;"
```

### E. Verify rewards/requirements data exists

```bash
docker exec -i sc-tool3-mariadb mariadb -u"$MARIADB_USER" -p"$MARIADB_PASSWORD" "$MARIADB_DATABASE" -e "SELECT COUNT(*) AS rewards_count FROM rewards; SELECT COUNT(*) AS requirements_count FROM reputation_requirements;"
```

---

## 6) Reverse proxy / CSRF-safe configuration

If published behind QNAP reverse proxy / Nginx / Traefik:

- Route public URL to `http://<nas-ip>:4173`
- Ensure proxy forwards:
  - `X-Forwarded-Host`
  - `X-Forwarded-Proto`
  - `X-Forwarded-Port`
- Keep `.env` `ORIGIN` aligned with the public URL

The compose service already sets SvelteKit forwarded-header trust env vars.

---

## 7) Updates / redeploys

For normal updates:

```bash
git pull
bash ./deploy/nas/compose.sh down --remove-orphans
bash ./deploy/nas/compose.sh up -d --build
```

Recommended post-update checks:

```bash
docker compose -f deploy/nas/docker-compose.yml --env-file .env ps
curl -I http://127.0.0.1:4173
```

---

## 8) Backup strategy

Back up both:

1. **Database volume** (`sc-tool3-mariadb-data`)
2. **Uploads directory** (`static/uploads`)

Without both, you risk losing accounts/data and uploaded files.

---

## 9) Known NAS Docker issues and recovery

### Error: `failed to register layer ... overlay2/.../link: no such file or directory`

```bash
bash ./deploy/nas/compose.sh down --remove-orphans
docker builder prune -af
docker system prune -af
# restart Container Station (or reboot NAS)
bash ./deploy/nas/compose.sh up -d --build
```

### Error: `mkdir .../lib/docker/containers/<id>: no such file or directory`

1. Stop Container Station in QTS App Center.
2. Verify Docker data-root parent exists (commonly):
   - `/share/CACHEDEV1_DATA/Public2/Container/container-station-data/lib/docker`
3. Start Container Station again.
4. Re-run deployment:

```bash
bash ./deploy/nas/compose.sh up -d --build
```

If persistent, reboot NAS; last resort is Container Station reinstall.

---

## 10) Local auth behavior (important)

- Signup creates users as **pending approval**.
- Pending users cannot sign in until approved.
- Default local admin account is seeded by `MARIADB_AUTH_SCHEMA.sql`.

Admin APIs:

- `GET /api/admin/users/pending`
- `POST /api/admin/users/:id/approve`

---

## 11) Quick command reference

```bash
# start/rebuild
bash ./deploy/nas/compose.sh up -d --build

# stop
bash ./deploy/nas/compose.sh down --remove-orphans

# logs
docker compose -f deploy/nas/docker-compose.yml --env-file .env logs -f sc-tool3-web

# db shell
docker exec -it sc-tool3-mariadb mariadb -u"$MARIADB_USER" -p"$MARIADB_PASSWORD" "$MARIADB_DATABASE"
```

---

If you need a hardened production variant (external MariaDB host, automated backups, SSL termination, and health monitoring), use this guide as baseline and layer those controls on top.
