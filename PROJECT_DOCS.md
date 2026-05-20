# IndiaPropertyTalk — Complete Project Documentation

> Last updated: May 2026  
> Maintained by: Kamesh Palanivel (mrvenkik@gmail.com)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Hosting & Deployment](#2-hosting--deployment)
3. [Database](#3-database)
4. [Authentication & OAuth](#4-authentication--oauth)
5. [Third-Party Services](#5-third-party-services)
6. [Environment Variables](#6-environment-variables)
7. [Repository & Git](#7-repository--git)
8. [Tech Stack](#8-tech-stack)
9. [Project Structure](#9-project-structure)
10. [Database Schema Summary](#10-database-schema-summary)
11. [Current Data Snapshot](#11-current-data-snapshot)
12. [Admin & User Access](#12-admin--user-access)
13. [DNS & Domain](#13-dns--domain)
14. [Email / SMTP](#14-email--smtp)
15. [Image Storage (Cloudinary)](#15-image-storage-cloudinary)
16. [Bot Protection (Cloudflare Turnstile)](#16-bot-protection-cloudflare-turnstile)
17. [SEO Configuration](#17-seo-configuration)
18. [Seed Scripts Reference](#18-seed-scripts-reference)
19. [Local Development Setup](#19-local-development-setup)
20. [Known Issues & Notes](#20-known-issues--notes)

---

## 1. Project Overview

| Field | Value |
|---|---|
| **Site name** | IndiaPropertyTalk |
| **Tagline** | Honest Property Discussions by Real Indians |
| **Production URL** | https://indiapropertytalk.com |
| **Purpose** | Indian real estate community forum — property reviews, ratings, discussions |
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Local path** | `C:\Projects\Forum` |

---

## 2. Hosting & Deployment

### Vercel

| Field | Value |
|---|---|
| **Platform** | Vercel (Hobby plan) |
| **Project name** | `forum` |
| **Project ID** | `prj_XZVvjrMq6MDU73XPMDXgIGFe5Lvg` |
| **Org / Team ID** | `team_VthUU2AUlWiavnDxPAx6tNVi` |
| **Org slug** | `mr-venki-s-projects` |
| **Dashboard** | https://vercel.com/mr-venki-s-projects/forum |
| **Vercel user ID** | `oMV9DBnjrWv6gwtfqLi2eDrJ` |
| **Deployment trigger** | Auto-deploy on every push to `master` branch |
| **Build command** | `next build` (default) |
| **Output directory** | `.next` (default) |
| **Node version** | Auto-detected from `package.json` |

### Deployment Flow

```
git push origin master
        ↓
GitHub webhook → Vercel
        ↓
Vercel builds (next build) — ~2-3 min
        ↓
Deployed to https://indiapropertytalk.com
```

> **Note:** Vercel env var changes require a **manual redeploy** to take effect  
> (Vercel Dashboard → Deployments → Redeploy)

### Local Development

```bash
cd C:\Projects\Forum
npm run dev          # starts on http://localhost:3000
```

---

## 3. Database

### Provider: Neon (Serverless PostgreSQL)

| Field | Value |
|---|---|
| **Provider** | Neon (neon.tech) |
| **Plan** | Free tier |
| **Region** | `us-east-1` (AWS) |
| **Project/Endpoint ID** | `ep-lucky-sea-aq2jyqsg` |
| **Database name** | `neondb` |
| **DB username** | `neondb_owner` |
| **DB password** | see `.env.local` → `DATABASE_URL` |
| **Dashboard** | https://console.neon.tech |
| **ORM** | Prisma 5.22 |
| **Schema file** | `prisma/schema.prisma` |

### Connection Strings

```
# Pooled (used by app in production — via PgBouncer)
DATABASE_URL=postgresql://neondb_owner:<PASSWORD>@ep-lucky-sea-aq2jyqsg-pooler.c-8.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require

# Direct (used by Prisma migrations and seed scripts)
DIRECT_URL=postgresql://neondb_owner:<PASSWORD>@ep-lucky-sea-aq2jyqsg.c-8.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require
```
> Full connection strings with password are in `.env.local` and Vercel environment variables.

> **Why two URLs?**  
> `DATABASE_URL` → pooled endpoint (PgBouncer) — used by the Next.js app at runtime  
> `DIRECT_URL` → direct connection — used by `prisma migrate` and seed scripts (migrations don't work through a pooler)

### Useful DB Commands

```bash
npx prisma studio          # visual DB browser at localhost:5555
npx prisma db push         # push schema changes without migration file
npx prisma migrate dev     # create and apply a migration
npx prisma generate        # regenerate Prisma client after schema change
node scripts/<file>.js     # run a seed script
```

---

## 4. Authentication & OAuth

### Provider: NextAuth.js v4

| Field | Value |
|---|---|
| **Library** | `next-auth` v4.24.11 |
| **Config file** | `src/lib/auth.ts` |
| **API route** | `src/app/api/auth/[...nextauth]/route.ts` |
| **Session strategy** | JWT |
| **Login page** | `/login` |
| **Error page** | `/login` |

### Google OAuth

| Field | Value |
|---|---|
| **Google Cloud project** | (same Google account as owner) |
| **Client ID** | see `.env.local` → `GOOGLE_CLIENT_ID` |
| **Client Secret** | see `.env.local` → `GOOGLE_CLIENT_SECRET` |
| **Console URL** | https://console.cloud.google.com → APIs & Services → Credentials |

#### Authorized Redirect URIs (must be set in Google Cloud Console)

```
https://indiapropertytalk.com/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```

#### Authorized JavaScript Origins

```
https://indiapropertytalk.com
http://localhost:3000
```

> **Common issue:** If you change the domain (www ↔ non-www), you must update  
> both the Google Cloud Console redirect URIs AND the `NEXTAUTH_URL` env var in Vercel.

### NextAuth Secret

```
NEXTAUTH_SECRET=india-property-forum-secret-key-change-in-production
```

> ⚠️ This should be changed to a strong random string in production.  
> Generate with: `openssl rand -base64 32`

### NEXTAUTH_URL

```
# Local
NEXTAUTH_URL=http://localhost:3000

# Production (Vercel env var)
NEXTAUTH_URL=https://indiapropertytalk.com
```

---

## 5. Third-Party Services

### Cloudinary (Image Storage)

| Field | Value |
|---|---|
| **Provider** | Cloudinary |
| **Cloud name** | `delcyrt05` |
| **API key** | see `.env.local` → `CLOUDINARY_API_KEY` |
| **API secret** | see `.env.local` → `CLOUDINARY_API_SECRET` |
| **Upload preset** | `property_forum` (unsigned upload) |
| **Folder** | `property-forum/topics` |
| **Dashboard** | https://cloudinary.com/console |
| **Max file size** | 5 MB |
| **Allowed formats** | JPEG, PNG, WebP |
| **Max files per topic** | 2 |

### Cloudflare Turnstile (Bot Protection)

| Field | Value |
|---|---|
| **Provider** | Cloudflare Turnstile |
| **Site key (public)** | `0x4AAAAAADRFgsXd0fCpHnbM` |
| **Secret key** | see `.env.local` → `TURNSTILE_SECRET_KEY` |
| **Dashboard** | https://dash.cloudflare.com → Turnstile |
| **Used on** | Login form (credentials sign-in) |
| **Dev behaviour** | Skipped automatically when `TURNSTILE_SECRET_KEY` is blank |

### SMTP Email

| Field | Value |
|---|---|
| **Provider** | Hostinger SMTP |
| **Host** | `smtp.hostinger.com` |
| **Port** | `465` (SSL) |
| **Username / From** | `notification@indiapropertytalk.com` |
| **Password** | see `.env.local` → `SMTP_PASS` |
| **Admin alert email** | `kesavarap@gmail.com` |
| **Used for** | Email OTP verification on registration |

---

## 6. Environment Variables

### Full `.env.local` (local development)

> ⚠️ `.env.local` is **not committed to git**. The actual values are stored securely.  
> Retrieve from Vercel dashboard or from the owner (kesavarap@gmail.com).

```env
# ── Database ─────────────────────────────────────────────────────────────────
DATABASE_URL="postgresql://neondb_owner:<DB_PASSWORD>@ep-lucky-sea-aq2jyqsg-pooler.c-8.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require"
DIRECT_URL="postgresql://neondb_owner:<DB_PASSWORD>@ep-lucky-sea-aq2jyqsg.c-8.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require"

# ── NextAuth ──────────────────────────────────────────────────────────────────
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<NEXTAUTH_SECRET>"

# ── Google OAuth ──────────────────────────────────────────────────────────────
GOOGLE_CLIENT_ID="<GOOGLE_CLIENT_ID>"
GOOGLE_CLIENT_SECRET="<GOOGLE_CLIENT_SECRET>"

# ── Cloudinary ────────────────────────────────────────────────────────────────
CLOUDINARY_CLOUD_NAME="delcyrt05"
CLOUDINARY_API_KEY="<CLOUDINARY_API_KEY>"
CLOUDINARY_API_SECRET="<CLOUDINARY_API_SECRET>"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="delcyrt05"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="property_forum"

# ── SMTP ──────────────────────────────────────────────────────────────────────
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT="465"
SMTP_USER="notification@indiapropertytalk.com"
SMTP_PASS="<SMTP_PASSWORD>"
SMTP_FROM="notification@indiapropertytalk.com"
ADMIN_ALERT_EMAIL="kesavarap@gmail.com"

# ── Cloudflare Turnstile ──────────────────────────────────────────────────────
NEXT_PUBLIC_TURNSTILE_SITE_KEY="0x4AAAAAADRFgsXd0fCpHnbM"
TURNSTILE_SECRET_KEY="<TURNSTILE_SECRET_KEY>"

# ── Site ──────────────────────────────────────────────────────────────────────
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="IndiaPropertyTalk"
```

### Vercel Production Env Vars (must match)

| Variable | Production Value |
|---|---|
| `DATABASE_URL` | pooled Neon URL (same as above) |
| `DIRECT_URL` | direct Neon URL (same as above) |
| `NEXTAUTH_URL` | `https://indiapropertytalk.com` |
| `NEXTAUTH_SECRET` | same as above |
| `GOOGLE_CLIENT_ID` | from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | from Google Cloud Console |
| `CLOUDINARY_CLOUD_NAME` | `delcyrt05` |
| `CLOUDINARY_API_KEY` | from Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | from Cloudinary dashboard |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `delcyrt05` |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | `property_forum` |
| `SMTP_HOST` | `smtp.hostinger.com` |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | `notification@indiapropertytalk.com` |
| `SMTP_PASS` | from Hostinger email panel |
| `SMTP_FROM` | `notification@indiapropertytalk.com` |
| `ADMIN_ALERT_EMAIL` | `kesavarap@gmail.com` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `0x4AAAAAADRFgsXd0fCpHnbM` |
| `TURNSTILE_SECRET_KEY` | from Cloudflare Turnstile dashboard |
| `NEXT_PUBLIC_SITE_URL` | `https://indiapropertytalk.com` |
| `NEXT_PUBLIC_SITE_NAME` | `IndiaPropertyTalk` |

---

## 7. Repository & Git

| Field | Value |
|---|---|
| **GitHub repo** | https://github.com/MrVenki/forum |
| **GitHub user** | MrVenki |
| **Default branch** | `master` |
| **Remote name** | `origin` |
| **Local path** | `C:\Projects\Forum` |

### Recent Commits (as of May 2026)

| Hash | Description |
|---|---|
| `b61e44a` | Add 13 verified Hyderabad villa/plot projects + 25 Hyderabad users |
| `66f1341` | Add 28 verified Bengaluru villa/plot projects across 4 corridors |
| `3cd3a60` | Add 21 verified Chennai villa & plot topics; add Urbanrise developer |
| `916f8ab` | Fix all-developer data quality: 31 deletions + 52 corrections |
| `64b8e37` | Fix crawl budget: noindex thin developer pages; shrink sitemap by 87 URLs |
| `a9b3331` | Fix hardcoded www canonical URLs; add tool pages to sitemap |
| `38298d7` | Fix www→non-www redirect; add Turnstile to CSP |

---

## 8. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js | 14.2.29 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | ^3.4.1 |
| UI Components | Radix UI | various |
| Animation | Framer Motion | ^11 |
| ORM | Prisma | 5.22.0 |
| Database | PostgreSQL (Neon) | serverless |
| Auth | NextAuth.js | 4.24.11 |
| Auth Adapter | @auth/prisma-adapter | ^2.7.4 |
| Forms | React Hook Form + Zod | ^7 / ^3 |
| Images | Cloudinary | ^2.5.1 |
| Image Optimisation | Sharp | ^0.33.5 |
| Icons | Lucide React | ^0.454.0 |
| Bot Protection | Cloudflare Turnstile | — |
| Email | Nodemailer | ^7 |
| Password Hashing | bcryptjs | ^2.4.3 |
| Slug generation | slugify | ^1.6.6 |
| Date formatting | date-fns | ^4 |
| Deployment | Vercel | Hobby plan |

---

## 9. Project Structure

```
C:\Projects\Forum\
├── prisma/
│   ├── schema.prisma           ← DB schema (single source of truth)
│   ├── seed.ts                 ← cities + initial data
│   ├── seed-content.ts         ← metro city apartment topics (batch 1)
│   ├── seed-content-2.ts       ← metro city topics (batch 2)
│   ├── seed-content-3.ts       ← topics (batch 3)
│   ├── seed-content-4.ts       ← topics (batch 4)
│   ├── seed-developers.ts      ← developer records
│   ├── seed-tier1.ts           ← tier-1 city topics
│   ├── seed-tier1-a.ts → f.ts  ← tier-1 topic batches (a–f)
│   └── fix-developers.ts       ← early developer data fixes
│
├── scripts/                    ← standalone Node.js seed/fix scripts
│   ├── seed-casagrand-gsquare.js
│   ├── seed-casagrand-gsquare-2.js
│   ├── fix-seed-1-incorrect-projects.js
│   ├── fix-casagrand-remaining.js
│   ├── fix-all-developers.js       ← bulk delete 31 fabricated topics
│   ├── fix-all-developers-part2.js ← city reassignments + address fixes
│   ├── seed-chennai-villas.js      ← 21 Chennai villa/plot topics
│   ├── seed-bengaluru-villas.js    ← 28 Bengaluru villa/plot topics
│   └── seed-hyderabad-villas.js    ← 13 Hyderabad villa/plot topics + 25 users
│
├── src/
│   ├── app/                    ← Next.js App Router pages
│   │   ├── page.tsx            ← Home page
│   │   ├── sitemap.ts          ← Dynamic XML sitemap
│   │   ├── robots.ts           ← robots.txt
│   │   ├── [city]/             ← City pages (/bengaluru, /hyderabad, etc.)
│   │   ├── [city]/[topic]/     ← Individual property discussion pages
│   │   ├── developer/[slug]/   ← Developer pages
│   │   ├── developers/         ← All developers listing
│   │   ├── cities/             ← All cities listing
│   │   ├── tools/              ← Calculator tools hub
│   │   │   ├── emi-calculator/
│   │   │   ├── stamp-duty-calculator/
│   │   │   ├── home-loan-eligibility/
│   │   │   └── rent-vs-buy/
│   │   ├── login/
│   │   ├── register/
│   │   ├── about/
│   │   ├── contact/
│   │   ├── privacy-policy/
│   │   ├── terms-of-use/
│   │   ├── disclaimer/
│   │   └── api/                ← API routes
│   │       ├── auth/[...nextauth]/
│   │       ├── topics/
│   │       ├── comments/
│   │       ├── upload/
│   │       └── indexnow/
│   │
│   └── lib/
│       ├── auth.ts             ← NextAuth config (Google + Credentials)
│       ├── prisma.ts           ← Prisma client singleton
│       ├── constants/
│       │   ├── config.ts       ← SITE_CONFIG, PROPERTY_TYPES, etc.
│       │   └── cities.ts       ← INDIAN_CITIES array (22 cities)
│       ├── features.ts         ← Feature flags
│       └── turnstile.ts        ← Cloudflare Turnstile verification
│
├── .env                        ← DB URLs only (committed — no secrets beyond DB)
├── .env.local                  ← All secrets (NOT committed to git)
├── .env.example                ← Template (committed, no real values)
├── .env.neon                   ← Vercel env template (auto-generated by Vercel CLI)
├── .vercel/project.json        ← Vercel project linkage
├── PROJECT_DOCS.md             ← This file
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 10. Database Schema Summary

### Core Models

| Model | Table | Purpose |
|---|---|---|
| `User` | `users` | Forum members |
| `City` | `cities` | 22 Indian cities |
| `Developer` | `developers` | 126 real estate developers |
| `Topic` | `topics` | Property discussion threads |
| `Comment` | `comments` | Replies on topics |
| `Rating` | `ratings` | 5-star property ratings |
| `CommentReaction` | `comment_reactions` | Like/helpful/etc on comments |
| `TopicSubscription` | `topic_subscriptions` | Topic watch/follow |

### Auth Models (NextAuth)

| Model | Table | Purpose |
|---|---|---|
| `Account` | `accounts` | OAuth provider accounts |
| `Session` | `sessions` | JWT sessions |
| `VerificationToken` | `verification_tokens` | Email OTP tokens |

### Enums

| Enum | Values |
|---|---|
| `UserRole` | `USER`, `MODERATOR`, `ADMIN` |
| `PropertyType` | `APARTMENT`, `VILLA`, `PLOT`, `COMMERCIAL`, `PENTHOUSE`, `INDEPENDENT_HOUSE`, `BUILDER_FLOOR` |
| `ConstructionStatus` | `ON_TRACK`, `DELAYED`, `STALLED`, `POSSESSION_DONE` |
| `CityTier` | `METRO`, `TIER1` |
| `FlairTag` | `OWNER`, `BUYER`, `RESEARCHER`, `NRI`, `BROKER` |
| `ReactionType` | `LIKE`, `HELPFUL`, `INFORMATIVE`, `DISLIKE` |

### Key Topic Fields

| Field | Type | Notes |
|---|---|---|
| `slug` | String | URL-safe unique identifier. Unique per `(cityId, slug)` |
| `propertyName` | String | Short official project name |
| `title` | String | Full discussion thread title |
| `description` | String | Forum discussion starter text |
| `metaTitle` | String | SEO `<title>` tag |
| `metaDesc` | String | SEO meta description |
| `priceMin` | Int? | Price in **rupees** (e.g. ₹87L = 8,700,000) |
| `priceMax` | Int? | Price in rupees |
| `isPublished` | Boolean | `true` = live; `false` = draft |
| `developerSlug` | String? | FK to Developer |
| `constructionStatus` | Enum | `ON_TRACK` \| `DELAYED` \| `STALLED` \| `POSSESSION_DONE` |

---

## 11. Current Data Snapshot

*(as of May 2026)*

### Totals

| Entity | Count |
|---|---|
| Users | 260 |
| Cities | 22 |
| Developers | 126 |
| Topics (total) | 433 |
| Topics (published) | 433 |
| Comments | 661 |

### Topics by City

| City | Topics |
|---|---|
| Bengaluru | 90 |
| Chennai | 73 |
| Hyderabad | 45 |
| Delhi | 37 |
| Kolkata | 33 |
| Mumbai | 32 |
| Pune | 14 |
| Ghaziabad | 10 |
| Ahmedabad | 9 |
| Jaipur | 9 |
| Kanpur | 8 |
| Surat | 8 |
| Bhopal | 8 |
| Patna | 7 |
| Ludhiana | 7 |
| Nagpur | 7 |
| Lucknow | 7 |
| Indore | 7 |
| Vadodara | 7 |
| Visakhapatnam | 6 |
| Agra | 5 |
| Nashik | 4 |

### Topics by Property Type

| Type | Count |
|---|---|
| APARTMENT | 341 |
| PLOT | 45 |
| VILLA | 44 |
| COMMERCIAL | 2 |
| PENTHOUSE | 1 |

### Cities by Tier

| Tier | Cities |
|---|---|
| METRO | Mumbai, Delhi, Bengaluru, Hyderabad, Chennai, Kolkata |
| TIER1 | Ahmedabad, Pune, Surat, Jaipur, Lucknow, Kanpur, Nagpur, Indore, Bhopal, Visakhapatnam, Patna, Vadodara, Ghaziabad, Ludhiana, Agra, Nashik |

---

## 12. Admin & User Access

### Admin Account

| Field | Value |
|---|---|
| **Name** | Kesav Kumar |
| **Email** | `kesavarap@gmail.com` |
| **User ID** | `cmp4aj9qs0000kyk0nilaouq2` |
| **Role** | `ADMIN` |
| **Login** | https://indiapropertytalk.com/login |

### Owner / Developer Account

| Field | Value |
|---|---|
| **Name** | Kamesh Palanivel |
| **Email** | `mrvenkik@gmail.com` |
| **User ID** | `cmp1329eu0000ym9q8pf9f1ln` |
| **Role** | `USER` (upgrade to ADMIN if needed via Prisma Studio) |

### Upgrade a user to ADMIN (Prisma Studio)

```bash
npx prisma studio
# Navigate to User table → find user → change role to ADMIN → Save
```

Or via script:
```js
await prisma.user.update({
  where: { email: 'your@email.com' },
  data: { role: 'ADMIN' }
})
```

---

## 13. DNS & Domain

| Field | Value |
|---|---|
| **Domain** | `indiapropertytalk.com` |
| **Canonical** | `https://indiapropertytalk.com` (non-www) |
| **www redirect** | `www.indiapropertytalk.com` → `indiapropertytalk.com` (301) |
| **DNS provider** | (managed via Vercel or domain registrar) |
| **SSL** | Auto-managed by Vercel (Let's Encrypt) |

> **Important:** The site was previously on `www.indiapropertytalk.com`. It was  
> migrated to non-www in May 2026. All canonical tags, sitemap, IndexNow,  
> and `NEXTAUTH_URL` now use the non-www version.

### IndexNow

- **API key file:** `public/<key>.txt` (served at `https://indiapropertytalk.com/<key>.txt`)
- **Host in submissions:** `indiapropertytalk.com` (not www)
- **API endpoint:** `src/app/api/indexnow/route.ts`

---

## 14. Email / SMTP

| Field | Value |
|---|---|
| **Provider** | Hostinger Email Hosting |
| **SMTP host** | `smtp.hostinger.com` |
| **Port** | `465` (SSL/TLS) |
| **Sender email** | `notification@indiapropertytalk.com` |
| **Password** | see `.env.local` → `SMTP_PASS` |
| **Webmail** | https://hpanel.hostinger.com |

Used for:
- Email OTP verification on user registration
- Admin alert emails (new registrations, flags, etc.) → `kesavarap@gmail.com`

---

## 15. Image Storage (Cloudinary)

| Field | Value |
|---|---|
| **Cloud name** | `delcyrt05` |
| **Upload preset** | `property_forum` (unsigned) |
| **Folder** | `property-forum/topics` |
| **Max size** | 5 MB per file |
| **Max files** | 2 per topic |
| **Formats** | JPEG, PNG, WebP |
| **Dashboard** | https://cloudinary.com/console |

Images are uploaded client-side (unsigned upload) using the public upload preset. No server-side upload proxy needed.

---

## 16. Bot Protection (Cloudflare Turnstile)

| Field | Value |
|---|---|
| **Provider** | Cloudflare Turnstile |
| **Site key** | `0x4AAAAAADRFgsXd0fCpHnbM` |
| **Secret key** | `0x4AAAAAADRFgiy3aC2XnA98mU9hdtgg9pc` |
| **Protected forms** | Login (credentials sign-in only) |
| **Dashboard** | https://dash.cloudflare.com → Turnstile |

In local dev, if `TURNSTILE_SECRET_KEY` is blank, verification is skipped automatically.

---

## 17. SEO Configuration

| Page | Canonical | Sitemap | Robots |
|---|---|---|---|
| Home | `https://indiapropertytalk.com` | ✓ priority 1.0 | index |
| City pages | `https://indiapropertytalk.com/{city}` | ✓ priority 0.9 | index |
| Topic pages | `https://indiapropertytalk.com/{city}/{topic}` | ✓ priority 0.8 | index |
| Developer pages (≥3 topics) | `https://indiapropertytalk.com/developer/{slug}` | ✓ priority 0.7 | index |
| Developer pages (<3 topics) | — | ✗ excluded | noindex |
| Tool pages | `https://indiapropertytalk.com/tools/...` | ✓ priority 0.7 | index |
| /developers | `https://indiapropertytalk.com/developers` | ✓ priority 0.8 | index |
| /cities | `https://indiapropertytalk.com/cities` | ✓ priority 0.8 | index |

**Sitemap:** `https://indiapropertytalk.com/sitemap.xml` (dynamic, revalidates every 1 hour)  
**Robots.txt:** `https://indiapropertytalk.com/robots.txt`

**Crawl budget rule:** Developer pages with fewer than 3 published topics are `noindex` (set via `generateMetadata`) and excluded from the sitemap. This prevents thin-content pages from diluting crawl quality.

---

## 18. Seed Scripts Reference

### Prisma seed scripts (`prisma/` folder — TypeScript, run via `npm run db:seed*`)

| Script | Description |
|---|---|
| `seed.ts` | Cities, initial developers, base data |
| `seed-content.ts` | Metro city apartment topics — batch 1 |
| `seed-content-2.ts` | Metro city topics — batch 2 |
| `seed-content-3/4.ts` | Topics — batches 3 & 4 |
| `seed-developers.ts` | Developer records |
| `seed-tier1.ts` + `a–f.ts` | Tier-1 city topics (Jaipur, Lucknow, etc.) |
| `fix-developers.ts` | Early developer data corrections |

### Node.js scripts (`scripts/` folder — plain JS, run via `node scripts/<name>.js`)

| Script | Description |
|---|---|
| `seed-casagrand-gsquare.js` | Casagrand + G Square Chennai/Bengaluru topics |
| `seed-casagrand-gsquare-2.js` | Additional Casagrand/G Square topics |
| `fix-seed-1-incorrect-projects.js` | Fix incorrect project names from initial seed |
| `fix-casagrand-remaining.js` | Fix remaining Casagrand data issues |
| `fix-all-developers.js` | Delete 31 fabricated topics across all developers |
| `fix-all-developers-part2.js` | City reassignments + address/type corrections (52 fixes) |
| `seed-chennai-villas.js` | 21 Chennai villa/plot topics (8 developers) |
| `seed-bengaluru-villas.js` | 28 Bengaluru villa/plot topics (4 corridors, Embassy Group new developer) |
| `seed-hyderabad-villas.js` | 13 Hyderabad villa/plot topics + 25 Hyderabad users (3 new developers) |

### How to run a script

```bash
cd C:\Projects\Forum
node scripts/seed-hyderabad-villas.js
```

Scripts are idempotent — re-running will skip already-existing slugs (no duplicates).

---

## 19. Local Development Setup

```bash
# 1. Clone
git clone https://github.com/MrVenki/forum.git
cd forum

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Fill in all values in .env.local (see Section 6)

# 4. Generate Prisma client
npx prisma generate

# 5. (First time) Push schema to DB
npx prisma db push

# 6. (Optional) Open Prisma Studio to browse DB
npx prisma studio

# 7. Start dev server
npm run dev
# → http://localhost:3000
```

---

## 20. Known Issues & Notes

### Google OAuth redirect URI
- **Issue:** After migrating from `www` to non-www in May 2026, Google login broke with  
  `redirect_uri_mismatch` error.
- **Fix:** Add `https://indiapropertytalk.com/api/auth/callback/google` to Google Cloud Console  
  Authorized Redirect URIs. Also ensure `NEXTAUTH_URL=https://indiapropertytalk.com` in Vercel.

### Prisma unique constraint `(cityId, slug)`
- Topics have a unique constraint on `(cityId, slug)` — not globally unique.
- When moving a topic to a different city via script, append a city suffix to the slug  
  (e.g., `sobha-aranya` → `sobha-aranya-blr`) to avoid P2002 errors.

### `constructionStatus` enum — valid values only
- Valid: `ON_TRACK`, `DELAYED`, `STALLED`, `POSSESSION_DONE`
- `COMPLETED` is **not** a valid value (will throw `PrismaClientValidationError`)

### `description` vs `content` field
- Topic model uses `description` for the discussion text — there is **no** `content` field.

### Vercel env var changes require redeploy
- Changing env vars in Vercel dashboard does not auto-redeploy. Trigger a manual redeploy  
  from Vercel Dashboard → Deployments → Redeploy Latest.

### Neon free tier limits
- Neon free tier: 0.5 GB storage, 1 compute unit, auto-suspend after 5 min inactivity.
- Cold start on first request after suspension adds ~1-2s latency.
- The pooled `DATABASE_URL` uses PgBouncer — this is why migrations need `DIRECT_URL`.

### `.env` vs `.env.local`
- `.env` is committed to git (only contains DB URLs — intentionally).
- `.env.local` is NOT committed to git — contains all secrets.
- `.env.example` is committed as a template.

---

*End of documentation*
