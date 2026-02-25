# MANSA — Agent Context Document

> **Read this first before touching any code.**
> This document tells you everything you need to know about the MANSA project.
> Last updated: 2026-02-22

---

## 1. What is MANSA?

MANSA (منصة تعليمية عالمية) is an **educational web platform** for university students.

**Core concept:** Students browse their university → faculty → department → subjects. Each subject has a question bank (MCQ + essay) and a **timed challenge mode** with a competitive leaderboard. An AI assistant helps students study.

**Target users:** University students — primarily Egyptian at launch, designed to scale globally.

**Current state:** V0.1 Alpha underway. Foundation (configuration, tooling, Firebase) is done. Application UI/logic not started yet.

---

## 2. Tech Stack

| Layer        | Technology                         | Why                                                                 |
| ------------ | ---------------------------------- | ------------------------------------------------------------------- |
| Frontend     | Vanilla JS + Vite 5                | No framework overhead; SPA via hash router                          |
| Database     | Firebase Firestore                 | Free tier, real-time, no server needed                              |
| Auth         | Firebase Authentication            | Email/Password; social logins in V0.5+                              |
| File Storage | Azure Blob Storage                 | **All** uploads — images, PDFs, videos, books (no Firebase Storage) |
| Hosting      | Azure Static Web Apps              | Free tier, CI/CD built-in                                           |
| CI/CD        | GitHub Actions                     | Auto-deploy to Azure on push to main                                |
| Dev Tools    | ESLint + Prettier + Husky + Vitest | Code quality enforcement                                            |
| i18n         | Custom `t()` function              | Arabic (RTL) + English (LTR)                                        |

**Important:** There is **no backend server**. Firebase handles auth + data. **Azure handles ALL file storage and hosting.** Firebase Storage is not used.

---

## 3. Project Roadmap

### V0.1 (Alpha — Current)

**Goal:** Working foundation with browseable university/faculty/department/subject hierarchy.

What V0.1 includes:

- ✅ Static content browsing (no login required)
- ✅ Firebase + Azure infrastructure
- ✅ SPA router (hash-based)
- ✅ Bilingual UI (Arabic RTL + English LTR)
- ✅ PWA (installable, offline-capable)
- ✅ Admin panel (dev-only, writes to emulator)
- ✅ CI/CD pipeline to Azure

What V0.1 does NOT include:

- ❌ User accounts / authentication UI
- ❌ Quiz/challenge system
- ❌ Leaderboards
- ❌ File uploads
- ❌ AI assistant
- ❌ Posts/community

### V0.5 (Beta)

- Firebase Authentication UI (register, login, profile)
- Quiz engine: MCQ + essay questions
- Challenge mode with timer
- Leaderboard (subject-level rankings)
- User profiles + badge system
- Batch Leader dashboard + student verification
- File uploads (summaries as PDF to Azure)
- Posts & community moderation

### V1.0+

- AI study assistant (Groq LLM + Gemini vision)
- Advanced analytics
- Multi-university expansion
- Mobile app (PWA matured)

---

## 4. User Roles

| Role                 | How obtained                 | What they can do                              |
| -------------------- | ---------------------------- | --------------------------------------------- |
| **Guest**            | Just visit the site          | Read all public content                       |
| **Student**          | Self-register via email      | Take challenges, appear on leaderboard        |
| **Verified Student** | Approved by Batch Leader     | Post content (pending moderation)             |
| **Batch Leader**     | Promoted by Admin            | Verify students, moderate posts for ONE batch |
| **Admin**            | Manual Firebase custom claim | Full access: manage structure, promote users  |

A **Batch** = one department + one academic year (e.g., "CS Department 2024 - Year 2").

Custom claim `admin: true` is set manually in Firebase Console or via Admin SDK.
Batch Leader scope is stored in `users/{uid}.departmentId` + `users/{uid}.studyYear`.

---

## 5. Firestore Database Schema

```
universities/{universityId}
  ├── nameAr: string
  ├── nameEn: string
  ├── country: string
  ├── city: string
  ├── logoUrl: string
  └── isActive: boolean

faculties/{facultyId}
  ├── universityId: string     ← ref to universities
  ├── nameAr: string
  ├── nameEn: string
  └── isActive: boolean

departments/{departmentId}
  ├── facultyId: string        ← ref to faculties
  ├── nameAr: string
  ├── nameEn: string
  └── isActive: boolean

subjects/{subjectId}
  ├── departmentId: string     ← ref to departments
  ├── nameAr: string
  ├── nameEn: string
  ├── year: number             ← study year 1-4
  ├── semester: number         ← 1 or 2
  ├── description: string
  └── isActive: boolean

─── V0.5+ Collections ─────────────────────────────────────

batches/{batchId}
  ├── departmentId: string
  ├── facultyId: string        ← denormalized for fast queries
  ├── academicYear: number     ← e.g. 2024
  ├── studyYear: number        ← 1, 2, 3, or 4
  ├── leaderId: string         ← ref to users
  ├── name: string
  └── isActive: boolean

users/{userId}
  ├── email: string
  ├── displayName: string      ← shown publicly (non-unique)
  ├── username: string         ← unique @handle (lowercase)
  ├── universityId: string
  ├── facultyId: string
  ├── departmentId: string
  ├── studyYear: number
  ├── role: 'student' | 'batch_leader' | 'admin'
  ├── isVerified: boolean      ← set by Batch Leader
  ├── photoUrl: string
  ├── points: number
  ├── challengesTaken: number
  └── createdAt: timestamp

usernames/{username}            ← enforces uniqueness
  └── uid: string

questions/{questionId}
  ├── subjectId: string
  ├── type: 'mcq' | 'essay'
  ├── textAr: string
  ├── textEn: string
  ├── options: array            ← MCQ only
  ├── correctIndex: number      ← MCQ only
  ├── difficulty: 1|2|3
  └── isActive: boolean

challenges/{challengeId}
  ├── userId: string
  ├── subjectId: string
  ├── score: number            ← 0-100
  ├── correctAnswers: number
  ├── timeTaken: number        ← seconds
  └── completedAt: timestamp

leaderboard/{subjectId}/entries/{userId}
  ├── userId: string
  ├── displayName: string
  ├── score: number            ← personal best
  ├── rank: number             ← pre-computed
  └── updatedAt: timestamp

posts/{postId}
  ├── authorId: string
  ├── departmentId: string
  ├── content: string
  ├── status: 'pending' | 'approved' | 'rejected'
  └── createdAt: timestamp
```

**Why leaderboard is a subcollection and NOT an array:**
An embedded array can't answer "what is MY rank?" if you're outside top 10. Subcollection can query any user's rank and scale to any size.

---

## 6. Firestore Security Rules (Current — V0.1)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /universities/{doc} { allow read: if true; allow write: if false; }
    match /faculties/{doc}    { allow read: if true; allow write: if false; }
    match /departments/{doc}  { allow read: if true; allow write: if false; }
    match /subjects/{doc}     { allow read: if true; allow write: if false; }
    // V0.5: add write rules here after auth is implemented
  }
}
```

**V0.1 admin writes go to the Firebase Emulator only (not production).**
The Emulator has no rules — admin panel writes freely in development.
Production data is seeded manually via Firebase Console.

---

## 7. File Structure

```
MANSA/
├── .editorconfig                 ← consistent editor settings across team
├── .env.development              ← ⚠️ gitignored — real dev Firebase credentials
├── .env.example                  ← committed — template with all variables documented
├── .env.production               ← ⚠️ gitignored — real prod credentials (GitHub Secrets in CI)
├── eslint.config.js              ← ESLint flat config (rules, plugins, globals — uses `globals` pkg)
├── .gitattributes                ← line endings, binary file handling
├── .gitignore                    ← ignores node_modules, dist, .env.* (not .env.example)
├── .github/
│   └── workflows/                ← CI/CD YAML files (to be created Phase 15)
├── .husky/
│   ├── commit-msg                ← runs commitlint on every commit
│   └── pre-commit                ← runs lint-staged on staged files
├── .nvmrc                        ← Node version: 24.13.1
├── .prettierrc.cjs               ← Prettier formatting rules
├── .prettierignore               ← files Prettier skips
├── .vscode/
│   ├── extensions.json           ← recommended VS Code extensions for team
│   └── settings.json             ← format on save, ESLint, RTL editor support
├── commitlint.config.cjs         ← allowed commit types/scopes
├── firebase.json                 ← Firebase Emulator ports (Firestore:8080 Auth:9099 — no Storage emulator)
├── package.json                  ← name:mansa, type:module, all scripts
├── index.html                    ← SPA shell (Phase 9) — Vite entry point (project root)
├── vite.config.js                ← Vite build config, PWA plugin, import aliases
├── docs/
│   ├── AGENT_CONTEXT.md          ← THIS FILE
│   └── PLAN AND TASKS/
│       ├── V0.1_Professional_Tasks_FINAL.md ← MASTER PLAN — read this for V0.1 tasks
│       └── V0.5_Professional_Tasks.md       ← V0.5 plan reference
├── public/                       ← static assets only (fonts, icons, images → copied as-is to dist/)
└── src/
    ├── css/                      ← empty — to be filled Phase 10
    │   ├── base/                 ← reset.css, variables.css, typography.css, layout.css
    │   ├── components/           ← navbar.css, card.css, button.css, etc.
    │   └── pages/                ← home.css, admin.css, etc.
    ├── data/                     ← static data files (future)
    └── js/
        ├── components/           ← empty — Phase 12 (navbar.js, breadcrumb.js)
        ├── config/
        │   ├── constants.js      ✅ all app constants
        │   ├── env.js            ✅ single source of all env vars
        │   ├── firebase.js       ✅ Firebase init (Firestore + Auth only) + Emulator connect
        │   ├── i18n.js           ← to create Phase 6 Task 6.6 (must exist before Phase 9)
        │   ├── routes.js         ← to create Phase 7
        │   └── translations/
        │       ├── ar.js         ✅ full Arabic strings
        │       └── en.js         ✅ full English strings
        ├── core/                 ← empty — Phase 6 + 7
        │   ├── eventBus.js       ← to create Phase 6 Task 6.0 (component communication — Pub/Sub)
        │   ├── router.js         ← to create Phase 7 (hash-based SPA router)
        │   └── state.js          ← to create Phase 6 Task 6.1 (reactive state store)
        ├── features/             ← empty — V0.5
        ├── pages/                ← empty — Phase 11 (views per route)
        ├── services/             ← empty — Phase 8 (Firestore CRUD + azure-storage-service.js)
        ├── utils/                ← empty — Phase 6
        │   ├── cache.js          ← to create Phase 8 (Firebase quota management)
        │   ├── helpers.js        ← to create Phase 6
        │   ├── logger.js         ← to create Phase 6
        │   ├── storage.js        ← to create Phase 6 (localStorage wrapper)
        │   └── validators.js     ← to create Phase 6
        └── main.js               ← to create Phase 9 (app entry point)
```

---

## 8. Import Aliases (Vite)

Always use these instead of relative paths:

| Alias         | Resolves to           |
| ------------- | --------------------- |
| `@`           | `./src`               |
| `@js`         | `./src/js`            |
| `@css`        | `./src/css`           |
| `@config`     | `./src/js/config`     |
| `@utils`      | `./src/js/utils`      |
| `@components` | `./src/js/components` |
| `@features`   | `./src/js/features`   |

Example: `import { ENV } from '@config/env.js';`

---

## 9. Environment Variables

All env vars are accessed **only** through `src/js/config/env.js`. Never use `import.meta.env` directly anywhere else.

```javascript
import { ENV } from '@config/env.js';

ENV.firebase.apiKey; // Firebase config
ENV.azure.storageAccount; // Azure Blob Storage
ENV.ai.groqApiKey; // Groq AI key
ENV.ai.geminiApiKey; // Gemini key
ENV.useEmulator; // true in dev, false in prod
ENV.isDev / ENV.isProd; // runtime mode
ENV.features.aiChat; // feature flag booleans
```

**Key variables in `.env.development`:**

- `VITE_USE_EMULATOR=true` — connects to local Firebase Emulator (critical for dev)
- `VITE_FIREBASE_*` — real project credentials (mansa-project-40eb0)

**Key variables in `.env.production`:**

- `VITE_USE_EMULATOR=false` — always false in production
- All Firebase + Azure credentials are also added as **GitHub Secrets** for CI/CD

---

## 10. Firebase Emulator

**Why:** In V0.1 there's no auth, so we can't use role-based Firestore rules. The emulator runs locally with no security rules — the admin panel can write freely during development.

**Start the emulator:**

```bash
firebase emulators:start
```

**Ports:**

- Firestore: `localhost:8080`
- Auth: `localhost:9099`
- Emulator UI: `localhost:4000` (browser dashboard)

> ⚠️ **No Storage emulator** — Firebase Storage is NOT used. All file uploads go to Azure Blob Storage.

**firebase.js** auto-connects to the emulator when `VITE_USE_EMULATOR=true`.
In production, it connects to the real Firebase project.

---

## 11. Coding Conventions

### Commit Messages (Conventional Commits)

```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, perf, test, chore, ci, build, revert
Scope: auth, quiz, db, ui, router, i18n, pwa, ci, deps (use kebab-case)

Examples:
  feat(auth): add email verification flow
  fix(quiz): resolve timer not stopping on answer select
  chore(deps): upgrade firebase to v10.14.1
```

Husky enforces this — bad commit messages are rejected.

### i18n Keys

Use **nested dot notation**: `feature.component.element`

```javascript
t('nav.home'); // ✅
t('auth.form.submit'); // ✅
t('nav_home'); // ❌ flat keys are wrong
```

Never hardcode user-visible strings. All UI text goes through `t()`.

### File Naming

- JS files: `kebab-case.js`
- CSS files: `kebab-case.css`
- Components: `navbar.js`, `breadcrumb.js`
- Services: `university-service.js`, `faculty-service.js`
- Views: `home-view.js`, `university-view.js`

### Constants

Never use "magic numbers". Use `constants.js`:

```javascript
import { MAX_FILE_SIZE, POSTS_PER_PAGE } from '@config/constants.js';
```

---

## 12. Critical Rules (Read Before Writing Code)

1. **Never access `import.meta.env` outside `env.js`** — everything goes through `ENV.*`
2. **Never write to Firestore production from admin panel** — use Emulator for all dev writes
3. **Never commit `.env.development` or `.env.production`** — they're gitignored for a reason
4. **Never use flat i18n keys** — always nested objects + dot notation
5. **Always use import aliases** — never relative paths like `../../config/env.js`
6. **All Firebase reads must go through `cache.js`** — services layer caches results to protect the 50K reads/day free limit
7. **The `leaderboard` uses subcollections** (`entries/{userId}`) — NEVER use embedded arrays
8. **Admin panel is dev-only** — in Phase 16, only register the `/admin` route when `ENV.isDev === true`

---

## 13. Running the Project

```bash
# Install dependencies
npm install

# Start Firebase Emulator (in separate terminal — do this first in dev)
firebase emulators:start

# Start dev server
npm run dev          # runs on localhost:3000

# Lint
npm run lint         # check only
npm run lint:fix     # auto-fix

# Format
npm run format       # fix all files
npm run format:check # check only

# Build for production
npm run build        # outputs to dist/

# Tests
npm run test:run     # run once and exit (use this in CI and for quick checks)
npm run test         # run in watch mode (use during active development)
npm run test:ui      # Vitest with UI

# Bundle analysis
npm run analyze
```

---

## 14. Current Build Status (as of 2026-02-22)

| Check               | Status                                  |
| ------------------- | --------------------------------------- |
| `npm run lint`      | ✅ 0 errors                             |
| `npm run test:run`  | ✅ 24/24 passed                         |
| `npm run build`     | ✅ Passes — outputs to dist/index.html  |
| Firebase connection | ✅ Configured (Emulator + real project) |
| Emulator            | ✅ Configured and ready to start        |

---

## 15. Phase Progress

| Phase | Description                                                                  | Status                              |
| ----- | ---------------------------------------------------------------------------- | ----------------------------------- |
| 1     | Git setup                                                                    | ✅ Complete                         |
| 2     | Project structure + package.json                                             | ✅ Complete                         |
| 3     | Dev tools (ESLint, Prettier, Husky)                                          | ✅ Complete                         |
| 4     | Firebase setup + Emulator                                                    | ✅ Complete                         |
| 5     | Azure Blob Storage                                                           | ⏭️ Skipped to V0.5                  |
| **6** | **Core JS utilities (state, storage, validators, helpers, logger, i18n.js)** | **⬅️ Next**                         |
| 7     | Router system (router.js + routes.js)                                        | ⬜                                  |
| 8     | Services layer + cache.js                                                    | ⬜                                  |
| 9     | HTML shell + main.js entry point                                             | ⬜                                  |
| 10    | CSS foundation (reset, variables, typography, layout)                        | ⬜                                  |
| 11    | Views (home, university, faculty, department, subject)                       | ⬜                                  |
| 12    | Navigation components (navbar, breadcrumb)                                   | ⬜                                  |
| 13    | Apply t() in all views and components                                        | ⬜ (i18n.js engine done in Phase 6) |
| 14    | PWA (manifest, service worker, icons)                                        | ⬜                                  |
| 15    | CI/CD (GitHub Actions + Azure deploy)                                        | ⬜                                  |
| 16    | Admin panel (dev-only CRUD)                                                  | ⬜                                  |
| 17    | Testing + Launch                                                             | ⬜                                  |

---

## 16. Key Files to Read First

To understand the project quickly, read these files in order:

1. `docs/AGENT_CONTEXT.md` ← you're here
2. `docs/PLAN AND TASKS/V0.1_Professional_Tasks_FINAL.md` ← master task list
3. `src/js/config/env.js` ← how env vars are structured
4. `src/js/config/constants.js` ← all constants
5. `src/js/config/firebase.js` ← Firebase init
6. `src/js/config/translations/ar.js` ← i18n key structure

---

## 17. Repo & External Resources

- **GitHub:** `https://github.com/MANSA-Project/MANSA`
- **Firebase project:** `mansa-project-40eb0`
- **Firebase Console:** `https://console.firebase.google.com/project/mansa-project-40eb0`
- **Azure hosting:** `https://mansa.azurestaticapps.net` (to be deployed)
- **Firestore region:** `europe-west1`
- **Firebase Auth:** Email/Password enabled
- **Node version:** 24.13.1 (see `.nvmrc`)
