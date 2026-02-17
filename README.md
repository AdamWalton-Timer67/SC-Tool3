# Star Citizen Emporium Tracker

Thank you to the community for appreciating the tool and providing lots of feedback on it, whether through Suggestions, email, or social media!

<img width="3344" height="1666" alt="image" src="https://github.com/user-attachments/assets/53d0a9e7-bbb8-4bd5-b279-039e538b0107" />

<img width="3344" height="1666" alt="image" src="https://github.com/user-attachments/assets/68b974a7-fdb3-46be-9129-07b450f055c5" />

### Installation

```bash
npm install
```

### Développement local

```bash
npm run dev
```

- Application: http://localhost:5173

## 📦 Tech

- **Frontend**: SvelteKit 5, TailwindCSS 4
- **Backend**: Local mock database (JSON/in-memory)
- **Deployment**: Self-hosted (QNAP NAS / Docker)

- **Supabase/S3 are not required at runtime** (NAS local-only mode).
- **Analytics removed** from frontend runtime.
- User/session features are limited to local-mode behavior.
- A built-in in-memory mock database now includes sample rewards, ingredients, locations, organizations, and suggestions for testing.

Read the full NAS guide in [`NAS_QNAP_DEPLOYMENT.md`](NAS_QNAP_DEPLOYMENT.md).

## 🔐 Local NAS authentication

- Login is enabled in local mode (no Supabase required).
- New signups are created as **pending** and cannot sign in until approved by an admin.
- Default local admin account (change after first login):
  - Email: `local@test.lan`
  - Password: `admin123`
- Admin approval APIs:
  - `GET /api/admin/users/pending`
  - `POST /api/admin/users/:id/approve`

## i18n

The application was designed to be FR/EN only.
However, it was initially intended for FR only, hence the absence of advanced i18n tools such as svelte-i18n.

## NAS migration (QNAP TS-251+ / QTS 5.2.8)

This repository is now prepared for a NAS self-hosted deployment:

- **Runs fully locally on NAS** (no Supabase, no S3).
- **Analytics were removed** from the frontend code.

Read the full NAS guide in [`NAS_QNAP_DEPLOYMENT.md`](NAS_QNAP_DEPLOYMENT.md).
