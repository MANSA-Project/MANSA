# MANSA — Developer Guide

> The practical guide for every developer working on this project.
> Read this once thoroughly. Refer back whenever you need it.
>
> **Last updated:** 2026-02-22 | **Stack:** Vanilla JS + Vite + Firebase + Azure

---

## Table of Contents

1. [First Time Setup](#1-first-time-setup)
2. [Daily Workflow](#2-daily-workflow)
3. [Terminal Commands Reference](#3-terminal-commands-reference)
4. [Git & Branching System](#4-git--branching-system)
5. [Commit Message Reference](#5-commit-message-reference)
6. [Project File Structure](#6-project-file-structure)
7. [Import Aliases](#7-import-aliases)
8. [Environment Variables](#8-environment-variables)
9. [Firebase Emulator](#9-firebase-emulator)
10. [Code Standards (Quick Reference)](#10-code-standards-quick-reference)
11. [Common Scenarios](#11-common-scenarios)
12. [Troubleshooting](#12-troubleshooting)
13. [Commit Strategy — When & What to Commit](#13-commit-strategy--when--what-to-commit)
14. [Files You Must Never Commit](#14-files-you-must-never-commit)

---

## 1. First Time Setup

Do this once when you clone the project for the first time.

### Prerequisites

Install these before anything else:

| Tool             | Version           | Download                                               |
| ---------------- | ----------------- | ------------------------------------------------------ |
| **Node.js**      | v20+ (we use v24) | [nodejs.org](https://nodejs.org)                       |
| **Git**          | Latest            | [git-scm.com](https://git-scm.com)                     |
| **VS Code**      | Latest            | [code.visualstudio.com](https://code.visualstudio.com) |
| **Firebase CLI** | v15+              | Installed in Step 5 below                              |

### Step-by-Step Setup

**Step 1 — Clone the repo**

```bash
git clone https://github.com/MANSA-Project/MANSA.git
cd MANSA
```

**Step 2 — Check your Node version**

```bash
node --version
# Should show v20.x.x or higher (v24.13.1 recommended)
```

If your Node version is too old, use [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm):

```bash
# With fnm:
fnm use    # reads .nvmrc automatically
```

**Step 3 — Install dependencies**

```bash
npm install
```

**Step 4 — Create your `.env.development` file**

```bash
# Copy the template
copy .env.example .env.development
```

Then open `.env.development` and fill in the Firebase credentials.
Get them from: **Firebase Console → Project Settings → Your Apps → mansa-project-40eb0**

The file is gitignored — never commit it.

**Step 5 — Install Firebase CLI (globally)**

```bash
npm install -g firebase-tools
firebase --version   # should show 15.x.x
```

**Step 6 — Login to Firebase**

```bash
firebase login
# Opens browser → sign in with Google account
```

**Step 7 — Install VS Code extensions**

Open VS Code in the project folder:

```bash
code .
```

VS Code will show a popup: "Install recommended extensions?" → click **Install All**.
These are defined in `.vscode/extensions.json` and include ESLint, Prettier, and RTL support.

**Step 8 — Verify everything works**

```bash
npm run lint    # should output: 0 errors
```

Open two terminals side by side:

```bash
# Terminal 1 — start Firebase Emulator
firebase emulators:start

# Terminal 2 — start dev server
npm run dev
```

Open browser at `http://localhost:3000` — app should load.
Open `http://localhost:4000` — Emulator UI should load.

**You're set up.**

---

## 2. Daily Workflow

Every day you work on the project, follow this order:

```
1. Pull latest changes from develop
2. Create or switch to your feature branch
3. Start Firebase Emulator (if working on anything Firebase-related)
4. Start dev server
5. Write code
6. Lint + format before committing
7. Commit with a proper message
8. Push and open PR
```

**In commands:**

```bash
# 1. Update develop
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/your-task-name

# 3. Start emulator (separate terminal — keep it running)
firebase emulators:start

# 4. Start dev server (separate terminal)
npm run dev

# 5. Write code...

# 6. Before committing
npm run lint
npm run format

# 7. Commit
git add .
git commit -m "feat(scope): what you did"

# 8. Push
git push origin feature/your-task-name
# Then open a Pull Request on GitHub: feature/... → develop
```

---

## 3. Terminal Commands Reference

### Development

| Command                                          | What it does                                                                  |
| ------------------------------------------------ | ----------------------------------------------------------------------------- |
| `npm install`                                    | Install all dependencies (run after cloning, or after `package.json` changes) |
| `npm run dev`                                    | Start dev server at `localhost:3000`                                          |
| `firebase emulators:start`                       | Start Firebase Emulator (Firestore:8080, Auth:9099, UI:4000)                  |
| `firebase emulators:start --only firestore,auth` | Start only Firestore and Auth emulators                                       |

### Code Quality

| Command                | What it does                            |
| ---------------------- | --------------------------------------- |
| `npm run lint`         | Check JS files for errors (ESLint)      |
| `npm run lint:fix`     | Auto-fix fixable lint errors            |
| `npm run format`       | Format all files with Prettier          |
| `npm run format:check` | Check formatting without changing files |

### Build & Test

| Command                              | What it does                                 |
| ------------------------------------ | -------------------------------------------- |
| `npm run build`                      | Build production bundle → outputs to `dist/` |
| `npm run preview`                    | Preview the production build locally         |
| `npm run test`                       | Run tests in watch mode (Vitest)             |
| `npm run test:run`                   | Run tests once and exit — use for CI         |
| `npm run test -- --run`              | Alias: same as `test:run`                    |
| `npm run test -- --reporter=verbose` | Run tests with full output per test          |
| `npm run test:ui`                    | Open Vitest visual UI in browser             |
| `npm run test:coverage`              | Run tests with coverage report               |
| `npm run analyze`                    | Visualize bundle size breakdown              |

### Security & Audit

| Command         | What it does                                     |
| --------------- | ------------------------------------------------ |
| `npm audit`     | Check for known vulnerabilities in dependencies  |
| `npm audit fix` | Auto-fix safe vulnerabilities                    |
| `npm outdated`  | List packages that have newer versions available |

### Git — Status & Inspection

| Command                           | What it does                                                 |
| --------------------------------- | ------------------------------------------------------------ |
| `git status`                      | Show staged, unstaged, and untracked files                   |
| `git diff`                        | Show unstaged changes (what changed but not yet `git add`ed) |
| `git diff --staged`               | Show staged changes (what will go into the next commit)      |
| `git log --oneline -10`           | See last 10 commits (short)                                  |
| `git log --oneline --graph --all` | Visual branch tree                                           |
| `git show <commit>`               | See full diff of a specific commit                           |
| `git blame <file>`                | See who last changed each line of a file                     |
| `git remote -v`                   | Show remote URLs                                             |

### Git — Branching

| Command                                 | What it does                          |
| --------------------------------------- | ------------------------------------- |
| `git branch`                            | List local branches                   |
| `git branch -a`                         | List all branches (local + remote)    |
| `git checkout -b feature/name`          | Create and switch to a new branch     |
| `git checkout -`                        | Switch back to the previous branch    |
| `git branch -d feature/name`            | Delete a local branch (after merging) |
| `git push origin --delete feature/name` | Delete remote branch                  |

### Git — Staging & Committing

| Command                            | What it does                                                 |
| ---------------------------------- | ------------------------------------------------------------ |
| `git add .`                        | Stage all changed files                                      |
| `git add <file>`                   | Stage a specific file only                                   |
| `git add -p`                       | Interactively stage chunks (review before staging)           |
| `git restore --staged <file>`      | Unstage a file (keeps changes on disk)                       |
| `git restore <file>`               | Discard unstaged changes to a file                           |
| `git commit -m "type(scope): msg"` | Commit with message                                          |
| `git commit --amend --no-edit`     | Add staged changes to the last commit (don't change message) |
| `git commit --amend -m "new msg"`  | Fix last commit message (before push only)                   |

### Git — Syncing

| Command                           | What it does                             |
| --------------------------------- | ---------------------------------------- |
| `git fetch origin`                | Download remote changes without merging  |
| `git pull origin develop`         | Pull latest develop into current branch  |
| `git pull --rebase`               | Pull with rebase (keeps cleaner history) |
| `git push origin feature/name`    | Push branch to remote                    |
| `git push -u origin feature/name` | Push and set upstream (first push only)  |

### Git — Fixing Mistakes

| Command                    | What it does                                             |
| -------------------------- | -------------------------------------------------------- |
| `git reset HEAD~1`         | Undo last commit, keep changes staged                    |
| `git reset --hard HEAD~1`  | Undo last commit AND discard changes (⚠️ destructive)    |
| `git revert <commit>`      | Create a new commit that undoes a specific commit (safe) |
| `git stash`                | Temporarily save uncommitted changes                     |
| `git stash pop`            | Restore last stash                                       |
| `git stash list`           | See all stashes                                          |
| `git cherry-pick <commit>` | Apply a specific commit from another branch              |

### Git — Releases

| Command                                     | What it does                         |
| ------------------------------------------- | ------------------------------------ |
| `git tag v0.1.0`                            | Create a lightweight tag             |
| `git tag -a v0.1.0 -m "V0.1 Alpha release"` | Create an annotated tag with message |
| `git push origin v0.1.0`                    | Push a specific tag to remote        |
| `git push origin --tags`                    | Push all tags to remote              |

---

## 4. Git & Branching System

### Branch Structure

```
main
 └── develop
      ├── feature/phase-6-state-management
      ├── feature/university-view
      ├── fix/router-404-redirect
      ├── chore/update-firebase-sdk
      └── docs/update-agent-context
```

| Branch      | Purpose                               | Who merges here            |
| ----------- | ------------------------------------- | -------------------------- |
| `main`      | Production. Deployment triggers here. | Only from `develop` via PR |
| `develop`   | Integration. CI runs on every push.   | Feature branches via PR    |
| `feature/*` | One branch per feature or task        | Your work goes here        |
| `fix/*`     | Bug fixes                             | Your work goes here        |
| `chore/*`   | Dependencies, tooling, config changes | Your work goes here        |
| `docs/*`    | Documentation only changes            | Your work goes here        |

### Branch Naming Rules

Always use lowercase and hyphens. Be specific:

```bash
# ✅ Good branch names
feature/phase-6-state-management
feature/home-view-rendering
fix/cache-not-clearing-after-write
fix/router-404-missing
chore/update-firebase-to-v10-14
docs/update-developer-guide
refactor/university-service-cleanup

# ❌ Bad branch names
myBranch
fix123
ahmed-work
update
wip
```

### PR Rules

- Never push directly to `main` or `develop`
- Every PR must pass CI (lint + build) before merging
- At least one review before merging to `develop` (if team > 1 person)
- Squash merge for feature/fix/chore branches — keeps history clean
- Merge commit for `develop → main` — preserves the full release history

### Writing a Pull Request

**Title** — same format as a commit message:

```
feat(router): add hash-based SPA routing
fix(cache): resolve stale data after admin write
chore(deps): upgrade firebase to v10.14.1
```

**Description** — use this template every time:

```markdown
## What this PR does

<!-- One paragraph — what changed and why -->

## Changes

- feat(router): add hash-based SPA routing with param support
- fix(router): handle unknown routes with 404 redirect
- test(router): add 12 tests covering all route scenarios

## How to test

<!-- Steps a reviewer should follow to verify the change -->

1. Start the dev server: `npm run dev`
2. Navigate to `/#/university/123` — should render UniversityView
3. Navigate to `/#/unknown` — should redirect to home

## Screenshots (if UI changed)

<!-- Paste before/after screenshots if the PR affects the UI -->

## Checklist

- [ ] `npm run lint` passes (0 errors)
- [ ] `npm run test:run` passes
- [ ] No `.env.*` files committed
- [ ] No `console.log` left in code
```

### Opening a PR (step by step)

```bash
# 1. Make sure your branch is pushed
git push origin feature/your-branch-name

# 2. Go to GitHub → your repo → "Pull requests" → "New pull request"
# 3. base: develop ← compare: feature/your-branch-name
# 4. Fill in title + description using the template above
# 5. Assign yourself as assignee
# 6. Click "Create pull request"
```

### Merging a PR

**Merging `feature/* → develop`:**

- Use **Squash and merge** — all commits from the branch become one clean commit on develop
- The commit message on GitHub should still match the format: `feat(scope): description`

**Merging `develop → main` (release):**

- Use **Create a merge commit** — preserves the full develop history
- Tag the merge commit with a version: `git tag -a v0.1.0 -m "V0.1 Alpha"`

### After your PR is merged

```bash
# Delete your local branch
git branch -d feature/your-branch-name

# Delete the remote branch (GitHub does this automatically if configured)
git push origin --delete feature/your-branch-name

# Switch back to develop and pull the merged changes
git checkout develop
git pull origin develop
```

## 5. Commit Message Reference

We use **Conventional Commits**. This is enforced automatically by Husky — bad messages will be rejected before the commit goes through.

### Format

```
<type>(<scope>): <short description>
```

- Type and scope: lowercase
- Description: present tense, no period at the end
- Max 72 characters total

### Types

| Type       | When to use                            | Example                                               |
| ---------- | -------------------------------------- | ----------------------------------------------------- |
| `feat`     | Adding new functionality               | `feat(router): add hash-based SPA routing`            |
| `fix`      | Fixing a bug                           | `fix(cache): clear stale entries after admin write`   |
| `docs`     | Documentation changes only             | `docs(guide): update first-time setup steps`          |
| `style`    | Formatting only (no logic change)      | `style(navbar): fix inconsistent spacing`             |
| `refactor` | Code change with no bug fix or feature | `refactor(state): simplify subscribe return type`     |
| `perf`     | Performance improvement                | `perf(subjects): reduce Firestore reads by 60%`       |
| `test`     | Adding or updating tests               | `test(validators): add edge cases for username check` |
| `chore`    | Dependency updates, tooling            | `chore(deps): upgrade firebase to v10.14.1`           |
| `ci`       | CI/CD workflow changes                 | `ci: add lint step to deploy workflow`                |
| `build`    | Build config changes                   | `build(vite): add manual chunk for firebase SDK`      |
| `revert`   | Reverting a previous commit            | `revert: feat(router): add hash-based SPA routing`    |

### Scopes

Use these scopes consistently:

| Scope         | What it covers                     |
| ------------- | ---------------------------------- |
| `auth`        | Authentication flows               |
| `router`      | SPA routing system                 |
| `cache`       | Caching layer                      |
| `db`          | Firestore / database               |
| `ui`          | General UI, layout                 |
| `i18n`        | Translations, language switching   |
| `pwa`         | PWA, service worker, manifest      |
| `admin`       | Admin panel                        |
| `deps`        | Package dependencies               |
| `ci`          | CI/CD pipelines                    |
| `config`      | Config files (env, vite, firebase) |
| `quiz`        | Quiz/challenge feature (V0.5+)     |
| `leaderboard` | Leaderboard feature (V0.5+)        |

### Full Examples

```bash
# Adding a new feature
git commit -m "feat(router): add hash-based SPA routing with param extraction"

# Fixing a bug
git commit -m "fix(cache): resolve stale data after admin creates new faculty"

  # Updating dependencies
git commit -m "chore(deps): upgrade firebase sdk from v10.7.2 to v10.14.1"

# Documentation update
git commit -m "docs(agent-context): add Azure storage decision to tech stack table"

# Refactor (same behavior, cleaner code)
git commit -m "refactor(state): replace manual listener array with Map for O(1) lookup"

# Performance fix
git commit -m "perf(universities): add 30min cache to reduce daily Firestore reads"

# Style only (no logic change)
git commit -m "style: format all files with prettier after config update"

# Multiple changes in same commit — use body (separate with blank line)
git commit -m "feat(state): add reactive state system

- Implemented getState, setState, subscribe
- Added initial state keys: language, theme, isLoading, currentRoute, currentUser
- Subscribe returns cleanup function to prevent memory leaks"
```

### Emergency Skip (use sparingly)

```bash
# Bypass Husky hooks — only in genuine emergencies
git commit --no-verify -m "your message"
```

---

## 6. Project File Structure

```
MANSA/
│
├── 📄 .editorconfig            ← editor consistency (indentation, line endings)
├── 📄 .env.development         ← ⚠️ gitignored — your local secrets
├── 📄 .env.example             ← committed template — copy to .env.development
├── 📄 .env.production          ← ⚠️ gitignored — production secrets
├── 📄 eslint.config.js          ← ESLint flat config (rules, plugins, globals — uses `globals` pkg)
├── 📄 .gitattributes           ← line endings, binary file handling
├── 📄 .gitignore               ← what Git ignores
├── 📄 .nvmrc                   ← Node version: 24.13.1
├── 📄 .prettierrc.cjs          ← Prettier formatting rules
├── 📄 .prettierignore          ← files Prettier skips
├── 📄 commitlint.config.cjs    ← allowed commit types/scopes
├── 📄 firebase.json            ← emulator ports (Firestore:8080, Auth:9099)
├── 📄 package.json             ← dependencies + scripts
├── 📄 vite.config.js           ← build config, aliases, PWA plugin
│
├── 📁 .github/
│   └── workflows/              ← CI/CD YAML files (Phase 15)
│
├── 📁 .husky/
│   ├── pre-commit              ← runs lint-staged before every commit
│   └── commit-msg              ← validates commit message format
│
├── 📁 .vscode/
│   ├── extensions.json         ← recommended extensions (auto-prompt on open)
│   └── settings.json           ← format on save, ESLint, RTL support
│
├── 📁 docs/
│   ├── AGENT_CONTEXT.md        ← project overview for AI agents
│   ├── DEVELOPER_GUIDE.md      ← this file
│   ├── TECHNICAL_STANDARDS.md  ← detailed coding patterns and rules
│   └── PLAN AND TASKS/
│       ├── V0.1_Professional_Tasks_FINAL.md  ← master V0.1 plan
│       ├── V0.1_Execution_Tasks.md           ← detailed task list (Phases 6–17)
│       └── V0.5_Professional_Tasks.md        ← V0.5 reference
│
├── index.html                  ← SPA shell (Phase 9) — Vite entry point (project root)
│
├── 📁 public/                  ← static assets only (copied as-is to dist/)
│   ├── manifest.json           ← PWA manifest (Phase 14)
│   ├── offline.html            ← offline fallback (Phase 14)
│   └── assets/
│       └── icons/              ← PWA icons (72px → 512px)
│
└── 📁 src/
    ├── 📁 css/
    │   ├── base/               ← reset, variables, typography, layout
    │   ├── components/         ← navbar, card, button, form, modal
    │   └── pages/              ← home, subject, admin
    │
    └── 📁 js/
        ├── 📁 config/
        │   ├── constants.js    ✅ all static constants (limits, regex, keys)
        │   ├── env.js          ✅ single source of all env vars — use ENV.* everywhere
        │   ├── firebase.js     ✅ Firebase init (db + auth only, no Storage)
        │   ├── i18n.js         ← Phase 6 Task 6.6: t() function, setLanguage()
        │   ├── routes.js       ← Phase 7: all route registrations
        │   └── translations/
        │       ├── ar.js       ✅ Arabic strings
        │       └── en.js       ✅ English strings
        │
        ├── 📁 core/
        │   ├── eventBus.js     ← Phase 6 Task 6.0: component communication (Pub/Sub)
        │   ├── router.js       ← Phase 7: hash router
        │   └── state.js        ← Phase 6 Task 6.1: reactive state store
        │
        ├── 📁 components/
        │   ├── navbar.js       ← Phase 12
        │   └── breadcrumb.js   ← Phase 12
        │
        ├── 📁 pages/
        │   ├── home-view.js           ← Phase 11
        │   ├── university-view.js     ← Phase 11
        │   ├── faculty-view.js        ← Phase 11
        │   ├── department-view.js     ← Phase 11
        │   ├── subject-view.js        ← Phase 11
        │   └── admin-view.js          ← Phase 16
        │
        ├── 📁 services/
        │   ├── university-service.js  ← Phase 8
        │   ├── faculty-service.js     ← Phase 8
        │   ├── department-service.js  ← Phase 8
        │   ├── subject-service.js     ← Phase 8
        │   └── azure-storage-service.js ← Phase 8
        │
        ├── 📁 utils/
        │   ├── cache.js        ← Phase 8: Firestore read cache
        │   ├── helpers.js      ← Phase 6: debounce, $(), setLoading()
        │   ├── logger.js       ← Phase 6: Logger.info/warn/error/debug
        │   ├── storage.js      ← Phase 6: localStorage wrapper
        │   └── validators.js   ← Phase 6: isValidEmail, isValidFileSize, etc.
        │
        └── main.js             ← Phase 9: app entry point
```

---

## 7. Import Aliases

Never use relative paths. Always use these aliases:

```javascript
// ✅ Always
import { ENV } from '@config/env.js';
import { Logger } from '@utils/logger.js';
import { db } from '@config/firebase.js';
import { renderNavbar } from '@components/navbar.js';
import { getAllUniversities } from '@js/services/university-service.js';

// ❌ Never
import { ENV } from '../../config/env.js';
import { Logger } from '../utils/logger.js';
```

| Alias         | Maps to              |
| ------------- | -------------------- |
| `@`           | `src/`               |
| `@js`         | `src/js/`            |
| `@css`        | `src/css/`           |
| `@config`     | `src/js/config/`     |
| `@utils`      | `src/js/utils/`      |
| `@components` | `src/js/components/` |
| `@features`   | `src/js/features/`   |

---

## 8. Environment Variables

### The rule: Never use `import.meta.env` directly — always go through `ENV`

```javascript
// ✅ Correct
import { ENV } from '@config/env.js';
const projectId = ENV.firebase.projectId;
const isEmulator = ENV.useEmulator;
const groqKey = ENV.ai.groqApiKey;

// ❌ Wrong
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
```

### Key ENV properties

```javascript
ENV.firebase.apiKey; // Firebase config
ENV.firebase.projectId;
ENV.azure.storageAccount; // Azure Blob Storage
ENV.azure.containerName;
ENV.azure.sasToken;
ENV.ai.groqApiKey; // Groq AI (V1.0+)
ENV.ai.geminiApiKey; // Google Gemini (V1.0+)
ENV.useEmulator; // true in dev, false in prod
ENV.isDev; // true when NODE_ENV=development
ENV.isProd; // true when NODE_ENV=production
ENV.features.aiChat; // feature flag: boolean
ENV.features.leaderboard; // feature flag: boolean
```

### Adding a new variable

1. Add to `.env.example` with a clear comment
2. Add to `.env.development` with your real/test value
3. Add to `.env.production` and GitHub Secrets
4. Add to `ENV` object in `src/js/config/env.js`
5. Never use it anywhere except through `ENV.*`

---

## 9. Firebase Emulator

### What it is

A local copy of Firestore and Auth that runs on your machine. The admin panel writes data here during development — it never touches the real Firebase database.

### Starting it

```bash
firebase emulators:start
```

### Ports

| Service     | Port | URL                                  |
| ----------- | ---- | ------------------------------------ |
| Firestore   | 8080 | `localhost:8080`                     |
| Auth        | 9099 | `localhost:9099`                     |
| Emulator UI | 4000 | `localhost:4000` ← browser dashboard |

### The Emulator UI (`localhost:4000`)

Open this in your browser while developing. It shows:

- All Firestore collections and documents
- All Firebase Auth users
- Real-time updates as you write data

### How it connects

`firebase.js` auto-connects to the emulator when `.env.development` has `VITE_USE_EMULATOR=true`. You don't need to do anything — just make sure the emulator is running before `npm run dev`.

### Reset emulator data

```bash
# Stop emulator (Ctrl+C), then restart:
firebase emulators:start

# Data clears on every restart — this is expected
# To persist data between restarts, use --export-on-exit and --import flags:
firebase emulators:start --export-on-exit=./emulator-data --import=./emulator-data
```

---

## 10. Code Standards (Quick Reference)

Full details in `docs/TECHNICAL_STANDARDS.md`. Quick rules:

### JavaScript

```javascript
// Use const by default, let only when value changes, never var
const user = await getUser(id);
let retries = 0;

// Async/await — never .then() chains
const data = await fetchData();

// Error handling — always try/catch in async functions
try {
  const result = await someFirestoreCall();
  return result;
} catch (error) {
  Logger.error('Failed to fetch data', error);
  return []; // safe default — never crash the UI
}

// Logging — never console.log()
Logger.debug('...'); // dev only
Logger.info('...'); // dev only
Logger.warn('...'); // dev only
Logger.error('...'); // always shown (even in production)
```

### Firebase

```javascript
// Always through the service layer — never call Firestore from views
import { getAllUniversities } from '@js/services/university-service.js';
const universities = await getAllUniversities(); // ✅

// Never call Firestore in a view directly
const snapshot = await getDocs(collection(db, 'universities')); // ❌ in views

// Soft delete only — never deleteDoc()
await updateDoc(ref, { isActive: false }); // ✅
await deleteDoc(ref); // ❌
```

### i18n

```javascript
// Always through t() — never hardcode strings
element.textContent = t('common.loading'); // ✅
element.textContent = 'جاري التحميل...'; // ❌
element.textContent = 'Loading...'; // ❌

// Key format: feature.component.element
t('nav.home'); // ✅
t('auth.form.submit'); // ✅
t('navHome'); // ❌ — flat keys not allowed
```

---

## 11. Common Scenarios

### Starting a new task

```bash
git checkout develop
git pull origin develop
git checkout -b feature/phase-6-state-management
# → write code
npm run lint
npm run format
git add .
git commit -m "feat(state): add reactive state store with subscribe/unsubscribe"
git push origin feature/phase-6-state-management
# → open PR on GitHub: feature/... → develop
```

### Fixing a bug on develop

```bash
git checkout develop
git pull origin develop
git checkout -b fix/cache-not-clearing-after-write
# → fix the bug
npm run lint
git add .
git commit -m "fix(cache): clear university cache after admin creates new entry"
git push origin fix/cache-not-clearing-after-write
# → open PR
```

### Pulling in latest changes while working on your branch

```bash
git fetch origin
git rebase origin/develop
# resolve conflicts if any, then git rebase --continue
```

### Updating a dependency

```bash
npm install firebase@latest
git add package.json package-lock.json
git commit -m "chore(deps): upgrade firebase to v10.14.1"
```

### Checking if build passes before pushing

```bash
npm run lint && npm run build
# If both pass, you're good to push
```

### Viewing Emulator data

1. Make sure `firebase emulators:start` is running
2. Open `http://localhost:4000` in your browser
3. Click "Firestore" to see collections
4. Click "Authentication" to see users

### Resetting stuck emulator

```bash
# If emulator hangs or port is busy:
# Windows:
netstat -ano | findstr :8080
taskkill /PID <the-PID> /F

# Then restart:
firebase emulators:start
```

---

## 12. Troubleshooting

### `npm install` fails

```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules
npm install
```

### `npm run lint` shows errors

```bash
npm run lint:fix  # auto-fix what it can
# Remaining errors need manual fixing — read the error message carefully
```

### Port 3000 already in use

```bash
# Find and kill the process (Windows):
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or just use a different port:
npm run dev -- --port 3001
```

### Firebase Emulator won't start (port busy)

```bash
netstat -ano | findstr :8080
taskkill /PID <PID> /F
firebase emulators:start
```

### App not connecting to Emulator

Check these in order:

1. Is `VITE_USE_EMULATOR=true` in `.env.development`? ✓
2. Is the emulator running? (`firebase emulators:start`) ✓
3. Did you restart `npm run dev` after changing `.env.development`? ✓
4. Check browser console for `[MANSA] 🔧 Firebase Emulator connected` message ✓

### Commit rejected by Husky

```bash
# Your commit message doesn't match Conventional Commits format
# Check the format:
# <type>(<scope>): <description>
# Example:
git commit -m "feat(router): add 404 fallback redirect"
```

### `git push` rejected ("non-fast-forward")

```bash
# Someone else pushed to your branch (unlikely) or you need to rebase
git pull --rebase origin feature/your-branch
git push origin feature/your-branch
```

### VS Code not showing ESLint errors

1. Make sure ESLint extension is installed (check `.vscode/extensions.json`)
2. Check bottom-left of VS Code — look for ESLint status
3. Open Command Palette → "ESLint: Restart ESLint Server"

---

_For deep technical patterns and architecture decisions, see `docs/TECHNICAL_STANDARDS.md`._
_For project overview and database schema, see `docs/AGENT_CONTEXT.md`._

---

## 13. Commit Strategy — When & What to Commit

### The rule: One logical unit per commit

A commit should answer the question: **"What problem does this solve?"** in one sentence.
If you need "and" to describe it, split it into two commits.

```
✅ "Add cache layer to university service (30min TTL)"
✅ "Fix router not redirecting on 404"
❌ "Add cache layer and fix router and update translations" ← three commits
```

### When to commit

| Situation                                  | Commit?                                  |
| ------------------------------------------ | ---------------------------------------- |
| A feature/function is fully working        | ✅ Commit now                            |
| A bug is fixed and tested                  | ✅ Commit now                            |
| A file is created and complete             | ✅ Commit now                            |
| You're about to switch to a different task | ✅ Commit first                          |
| End of work session                        | ✅ Always commit before stopping         |
| Code is broken / half-done                 | ❌ Never commit broken code              |
| You've only changed whitespace / comments  | ⚠️ Only if intentional (`style:` commit) |
| You're mid-task and nothing works yet      | ❌ Wait until it works                   |

### Commit size guide

**Too small — don't do this:**

```bash
git commit -m "add opening brace"
git commit -m "fix typo"
git commit -m "wip"
```

**Too big — don't do this:**

```bash
# One commit with 47 files changed across 6 different features
git commit -m "build the entire router system and views and CSS and everything"
```

**Just right:**

```bash
# One complete util file
git commit -m "feat(logger): add structured Logger with dev/prod log levels"

# One complete service file
git commit -m "feat(db): add university-service with cache and soft delete"

# One bug fix
git commit -m "fix(router): redirect to home on unknown route instead of blank screen"

# Related group of small fixes in same area
git commit -m "fix(config): correct Azure env key names and add VITE_USE_EMULATOR"
```

### What to commit together (grouping rules)

✅ **Group these together:**

- A new file + its test file
- A service file + the types/constants it introduces
- A CSS file + the HTML it styles (same component)
- A docs update + the code change it documents

❌ **Don't group these:**

- Two unrelated bug fixes
- A new feature + a refactor of an existing feature
- Frontend changes + backend config changes
- Multiple complete phases in one commit

### Pre-commit checklist

Before every `git commit`, run:

```bash
npm run lint      # must show 0 errors
npm run format    # formats everything automatically
git diff --staged # review exactly what you're committing
```

### Bad habits to avoid

```bash
# ❌ Never force push to develop or main
git push --force origin develop

# ❌ Never commit with --no-verify unless it's a genuine emergency
git commit --no-verify -m "bypass checks"

# ❌ Never commit secrets, even "temporarily"
git add .env.development

# ❌ Never commit "fix" commits to fix your own broken commits
# (use git commit --amend instead, before pushing)
git commit -m "fix the fix of the fix"

# ✅ Instead, amend the last commit if not yet pushed
git add .
git commit --amend --no-edit
```

---

## 14. Files You Must Never Commit

These files are **gitignored** for a reason. If you accidentally stage one, unstage it immediately.

### 🔴 Secrets — will compromise security if committed

| File                     | Why                                                    |
| ------------------------ | ------------------------------------------------------ |
| `.env.development`       | Contains your real Firebase API keys for development   |
| `.env.production`        | Contains production Firebase keys and Azure SAS tokens |
| `*.env.local`            | Any local env file                                     |
| `serviceAccountKey.json` | Firebase Admin SDK key (never put in repo)             |

**If you accidentally committed secrets:**

```bash
# Remove from last commit (before push)
git rm --cached .env.development
git commit --amend --no-edit

# If already pushed: rotate ALL credentials immediately
# Then contact team lead
```

### 🟡 Build output — generated files, not source

| File/Folder      | Why                                                  |
| ---------------- | ---------------------------------------------------- |
| `dist/`          | Production build output — regenerated on every build |
| `node_modules/`  | 747+ packages — installed from package.json          |
| `.firebase/`     | Firebase CLI cache                                   |
| `emulator-data/` | Local emulator data snapshots                        |

### 🟢 OS and editor noise — not project files

| File                       | Why                                                          |
| -------------------------- | ------------------------------------------------------------ |
| `.DS_Store`                | macOS folder metadata                                        |
| `Thumbs.db`                | Windows thumbnail cache                                      |
| `*.log`                    | Log files                                                    |
| `.vscode/*.code-workspace` | Personal workspace settings (not the shared `settings.json`) |

### Checking what you're about to commit

Always do this before `git add .`:

```bash
git status
# Review every file in the list
# If you see .env.development or dist/ — stop and find out why

git diff --staged
# Review the actual content being committed line by line
```

### Unstaging a file you accidentally staged

```bash
git restore --staged .env.development
# The file stays on disk but is removed from the commit
```
