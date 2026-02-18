# MariaDB Backup & Restore

This project now relies on MariaDB as the primary runtime data store.

## Quick Backup (full database)

```bash
mysqldump \
  --single-transaction \
  --routines \
  --triggers \
  --events \
  -h "$MARIADB_HOST" \
  -u "$MARIADB_USER" \
  -p"$MARIADB_PASSWORD" \
  "$MARIADB_DATABASE" > "backup-$(date +%F-%H%M%S).sql"
```

## Compressed Backup

```bash
mysqldump \
  --single-transaction \
  --routines \
  --triggers \
  --events \
  -h "$MARIADB_HOST" \
  -u "$MARIADB_USER" \
  -p"$MARIADB_PASSWORD" \
  "$MARIADB_DATABASE" | gzip > "backup-$(date +%F-%H%M%S).sql.gz"
```

## Restore

```bash
mysql \
  -h "$MARIADB_HOST" \
  -u "$MARIADB_USER" \
  -p"$MARIADB_PASSWORD" \
  "$MARIADB_DATABASE" < backup-YYYY-MM-DD-HHMMSS.sql
```

If your backup is gzipped:

```bash
gunzip -c backup-YYYY-MM-DD-HHMMSS.sql.gz | mysql \
  -h "$MARIADB_HOST" \
  -u "$MARIADB_USER" \
  -p"$MARIADB_PASSWORD" \
  "$MARIADB_DATABASE"
```

## Recommended Schedule

- Hourly: compressed full backup, keep 48 hours
- Daily: compressed full backup, keep 30 days
- Weekly: compressed full backup, keep 12 weeks

Use cron/systemd timers and periodically test restore in a staging DB.
