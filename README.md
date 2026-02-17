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
- Supabase Studio http://127.0.0.1:54323

### Arrêter Supabase

```bash
npm run supabase:stop
```

## 📝 Migrations

### create

```bash
supabase migration new {migration_name}
```

### apply 

```bash
npm run supabase:reset
```

### deploy

```bash
supabase db push
```

## 📦 Tech

- **Frontend**: SvelteKit 5, TailwindCSS 4
- **Backend**: Supabase (Auth + Database)
- **Deployment**: Self-hosted (QNAP NAS / Docker)

## Context

This application is a side project I worked on in my spare time.
My application is offline because it depends on two services: Supabase (database/authentication) and Amazon S3 (image storage). There is a whole range of admin tools for managing rewards and ingredients, so the images are stored online like all the other data.
My latest feature was to add the reputation system required in 4.5.0. But, victim of its own success, the application's traffic means it now needs to start paying for Supabase (around $25 per month) and use a better image caching system so as not to call Amazon S3 too regularly, as I had a $100 bill in December due to traffic. (and not the amount of data).
The problem isn't really the money, but the lack of time to develop the technical stack and, above all, to update the data related to the various SC updates. There is currently a suggestion system in place to allow the community to report issues and changes.
Due to a lack of personal time, I am making this repo open-source to allow anyone who wants to update, deploy, and improve it to do so.

## i18n

The application was designed to be FR/EN only.
However, it was initially intended for FR only, hence the absence of advanced i18n tools such as svelte-i18n.

## NAS migration (QNAP TS-251+ / QTS 5.2.8)

This repository is now prepared for a NAS self-hosted deployment:

- **Supabase remains supported**, but should be self-hosted locally on the NAS (Container Station / Docker).
- **Analytics were removed** from the frontend code.

Read the full NAS guide in [`NAS_QNAP_DEPLOYMENT.md`](NAS_QNAP_DEPLOYMENT.md).
