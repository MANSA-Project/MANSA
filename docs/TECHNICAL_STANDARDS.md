# MANSA — Technical Standards & Developer Reference

> **What this file is:** The technical bible for MANSA development.
> Covers coding standards, architecture patterns, tool configs, and future-proofing rules.
> **Every agent and developer must read this before writing a single line of code.**
> Related: `docs/AGENT_CONTEXT.md` (project overview) | `docs/PLAN AND TASKS/V0.1_Execution_Tasks.md` (task list)

---

## 1. Module System

MANSA uses **native ES Modules** (`"type": "module"` in `package.json`). This means:

```javascript
// ✅ Always use ES Module syntax
import { ENV } from '@config/env.js';
export function myFunction() {}
export default myClass;

// ❌ Never use CommonJS
const env = require('./env.js');
module.exports = { ... };
```

**Rules:**

- Always include the `.js` extension in import paths
- Use **named exports** for utilities and services
- Use **default exports** for translation files (`ar.js`, `en.js`) and views
- One export style per file — don't mix default + named exports unless intentional

**Exception:** Config files that need `require()` (commitlint, prettier, eslint) use `.cjs` extension — this is intentional and the only case where CommonJS is allowed.

---

## 2. Import Aliases (Mandatory)

Never use relative paths. Always use aliases defined in `vite.config.js`:

```javascript
// ✅ Always use aliases
import { ENV } from '@config/env.js';
import { Logger } from '@utils/logger.js';
import { db } from '@config/firebase.js';
import { renderNavbar } from '@components/navbar.js';

// ❌ Never use relative paths
import { ENV } from '../../config/env.js';
import { Logger } from '../utils/logger.js';
```

| Alias         | Physical path        |
| ------------- | -------------------- |
| `@`           | `src/`               |
| `@js`         | `src/js/`            |
| `@css`        | `src/css/`           |
| `@config`     | `src/js/config/`     |
| `@utils`      | `src/js/utils/`      |
| `@components` | `src/js/components/` |
| `@features`   | `src/js/features/`   |

---

## 3. JavaScript Coding Style

### Variables

```javascript
// ✅ const for everything that doesn't change
const MAX_RETRIES = 3;
const user = await getUser(id);

// ✅ let only when the value actually changes
let retries = 0;
while (retries < MAX_RETRIES) {
  retries++;
}

// ❌ Never use var
var name = 'Ahmed'; // forbidden
```

### Functions

```javascript
// ✅ Named function declarations for top-level exported functions
export function getAllUniversities() {}
export async function getUser(id) {}

// ✅ Arrow functions for callbacks, handlers, inline
const filtered = items.filter(item => item.isActive);
element.addEventListener('click', e => handleClick(e));

// ✅ Async/await — never .then()/.catch() chains
const data = await fetchData();

// ❌ Avoid promise chains
fetchData()
  .then(d => process(d))
  .catch(e => handle(e)); // discouraged
```

### Naming Conventions

```javascript
// Variables, functions: camelCase
const userName = 'Ahmed';
function getUserProfile() {}

// Constants (module-level, never change): UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Classes: PascalCase
class UserService {}

// Files: kebab-case
// university-service.js  home-view.js  back-button.js

// Custom events (for DOM): kebab-case with 'mansa:' prefix
document.dispatchEvent(new CustomEvent('mansa:language-changed', { detail: { lang } }));

// CSS classes: kebab-case (also see CSS section)
// .university-card  .nav-link  .btn-primary
```

### Destructuring

```javascript
// ✅ Destructure where it improves readability
const { nameAr, nameEn, isActive } = university;
const [first, ...rest] = items;

// ✅ Default values in destructuring
function renderCard({ title = '', imageUrl = '', onClick = null } = {}) {}

// ❌ Don't over-destructure nested objects — makes code hard to follow
const {
  a: {
    b: { c },
  },
} = obj; // avoid
```

### Template Literals

```javascript
// ✅ Use template literals for strings with variables
const msg = `Welcome, ${user.displayName}!`;
const url = `/#/university/${universityId}`;

// ❌ Avoid string concatenation
const msg = 'Welcome, ' + user.displayName + '!'; // discouraged
```

---

## 4. Error Handling

### The pattern: Try/Catch + Logger + Graceful fallback

```javascript
// ✅ Standard error handling pattern
async function getAllUniversities() {
  try {
    return await withCache('universities:all', 30 * 60 * 1000, async () => {
      const snapshot = await getDocs(collection(db, 'universities'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    });
  } catch (error) {
    Logger.error('Failed to fetch universities', error);
    return []; // Always return a safe default — never let the UI crash
  }
}
```

### Rules:

- Every `async` function that touches Firebase, network, or localStorage must have try/catch
- Always log the error with `Logger.error(message, error)`
- Always return a **safe default** (empty array, null, false) — never let errors crash the UI
- Never `throw` from service functions — they are the last line of defense
- Views can show error states but must handle them gracefully (never a blank white screen)

---

## 5. Firebase Usage Patterns

### The only correct way to read data:

```javascript
// ✅ Always through the service layer + cache
import { getAllUniversities } from '@js/services/university-service.js';
const universities = await getAllUniversities();

// ❌ Never call Firestore directly from views or components
import { db } from '@config/firebase.js';
const snapshot = await getDocs(collection(db, 'universities')); // forbidden in views
```

### The only correct way to write data (V0.1):

- Only from the admin panel (which only runs in dev against the Emulator)
- Through the service layer functions (`createUniversity(data)`)
- Always soft-delete (`isActive: false`) — never `deleteDoc()`

### Firestore query patterns:

```javascript
// ✅ Always filter inactive items
const q = query(collection(db, 'universities'), where('isActive', '==', true), orderBy('nameAr', 'asc'));

// ✅ Limit queries — never fetch unbounded collections
const q = query(collection(db, 'leaderboard', subjectId, 'entries'), orderBy('rank', 'asc'), limit(10));
```

### Firebase free tier limits (Spark plan) — memorize these:

| Operation         | Daily free limit             |
| ----------------- | ---------------------------- |
| Firestore reads   | 50,000                       |
| Firestore writes  | 20,000                       |
| Firestore deletes | 20,000                       |
| Storage           | 5GB stored, 1GB/day download |
| Auth              | Unlimited                    |

**This is why `cache.js` is not optional.** Without caching, 50 users browsing breaks the daily limit in hours.

---

## 6. Cache Layer Usage

```javascript
import { withCache, clearCache } from '@utils/cache.js';

// ✅ Correct pattern — wrap every Firestore read
async function getAllUniversities() {
  return withCache(
    'universities:all', // cache key — must be unique and descriptive
    30 * 60 * 1000, // TTL: 30 minutes in milliseconds
    async () => {
      // fetch function — called only if cache miss
      const snapshot = await getDocs(collection(db, 'universities'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  );
}

// ✅ Always clear cache after writes
async function createUniversity(data) {
  await addDoc(collection(db, 'universities'), { ...data, isActive: true });
  clearCache('universities:all'); // ← mandatory after every write
}
```

**Cache key naming convention:**

```
{collection}:all                    → universities:all
{collection}:by:{parentId}          → faculties:by:cu-2024
{collection}:item:{id}              → departments:item:cs-dept
{collection}:{subjectId}:entries    → leaderboard:math-101:entries
```

---

## 7. State Management

```javascript
import { getState, setState, subscribe } from '@js/core/state.js';

// Read state
const lang = getState('language');

// Write state (notifies all subscribers)
setState('language', 'en');

// Subscribe + auto-cleanup pattern (mandatory)
const unsubscribe = subscribe('language', newLang => {
  updateUI(newLang);
});

// Call unsubscribe() when component is removed from DOM
// ✅ Clean up — prevents memory leaks
unsubscribe();
```

**Global state keys:**
| Key | Type | Default | Purpose |
|---|---|---|---|
| `language` | `'ar'` \| `'en'` | `'ar'` | Current UI language |
| `theme` | string | `'default'` | UI theme (V0.5+) |
| `isLoading` | boolean | `false` | Global loading indicator |
| `currentRoute` | string | `'/'` | Current URL path |
| `currentUser` | object \| null | `null` | Logged-in user (V0.5+) |

---

## 8. i18n (Translations) Usage

All user-visible text must go through `t()`. No exceptions.

```javascript
import { t, setLanguage, getCurrentLanguage } from '@config/i18n.js';

// ✅ Basic usage — dot notation keys
const label = t('nav.home'); // → 'الرئيسية' or 'Home'
const error = t('errors.network'); // → error message in current language

// ✅ With variable interpolation
const msg = t('auth.welcome', { name: user.displayName });
// ar.js: 'auth.welcome': 'أهلاً {name}!'
// → 'أهلاً Ahmed!'

// ✅ Switch language
await setLanguage('en');
// This: saves to localStorage, updates state, reloads translations

// ❌ Never hardcode any user-visible strings
element.textContent = 'Loading...'; // forbidden
element.textContent = 'جاري التحميل...'; // also forbidden
element.textContent = t('common.loading'); // ✅ correct
```

**Key naming convention: `feature.component.element`**

```
nav.home
auth.login
auth.form.submit
quiz.result.score
errors.network
common.loading
common.retry
```

**RTL/LTR switching:**

```javascript
// When setLanguage() is called, also update the HTML element:
document.documentElement.lang = lang;
document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
```

---

## 9. CSS Architecture

### Structure

```
src/css/
├── base/
│   ├── reset.css       ← browser reset, box-sizing
│   ├── variables.css   ← ALL CSS custom properties
│   ├── typography.css  ← fonts, headings, body text
│   └── layout.css      ← container, grid, flex utilities
├── components/
│   ├── navbar.css
│   ├── card.css
│   ├── button.css
│   ├── form.css
│   ├── modal.css
│   └── toast.css
└── pages/
    ├── home.css
    ├── subject.css
    └── admin.css
```

### Naming convention: BEM-inspired, kebab-case

```css
/* Block */
.university-card {
}

/* Element (part of block) */
.university-card__logo {
}
.university-card__title {
}
.university-card__meta {
}

/* Modifier (variation) */
.university-card--featured {
}
.btn--primary {
}
.btn--disabled {
}

/* State (JS-controlled) */
.is-loading {
}
.is-active {
}
.is-hidden {
}
```

### Always use CSS variables — never hardcode values

```css
/* ✅ Correct */
.university-card {
  padding: var(--spacing-md);
  background: var(--color-bg-card);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-normal);
}

/* ❌ Wrong — hardcoded values break theme system */
.university-card {
  padding: 16px;
  background: #ffffff;
  border-radius: 8px;
}
```

### RTL-aware CSS — use logical properties

```css
/* ✅ Logical properties — work in both RTL and LTR */
.nav-item {
  margin-inline-start: var(--spacing-sm); /* left in LTR, right in RTL */
  padding-inline: var(--spacing-md);
  border-inline-start: 2px solid var(--color-primary);
}

/* ❌ Directional properties — break in RTL */
.nav-item {
  margin-left: 8px; /* ignored in RTL */
  padding: 0 16px;
  border-left: 2px solid;
}
```

### Responsive design — mobile first

```css
/* ✅ Mobile first */
.grid {
  display: grid;
  grid-template-columns: 1fr; /* single column on mobile */
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## 10. HTML Writing Standards

```html
<!-- ✅ Use semantic HTML -->
<nav id="navbar" aria-label="Main navigation">
  <main id="app" role="main">
    <article class="university-card">
      <section class="universities-grid">
        <!-- ✅ Data attributes for JS hooks — never use CSS classes for JS -->
        <button data-action="language-switch" data-lang="en">English</button>
        <div data-id="${university.id}" class="university-card">
          <!-- ✅ ARIA labels for accessibility -->
          <button aria-label="Switch to English" data-action="language-switch">EN</button>
          <nav aria-label="breadcrumb">
            <ol>
              ...
            </ol>
          </nav>

          <!-- ✅ Loading state pattern -->
          <div id="loading" class="loading-overlay" style="display:none" aria-hidden="true">
            <div class="spinner" role="status" aria-label="Loading..."></div>
          </div>
        </div>
      </section>
    </article>
  </main>
</nav>
```

**Rules:**

- Never use `id` for styling — only for JS targeting and ARIA
- Use `data-*` attributes for JS hooks — never use CSS class names as JS selectors
- Every interactive element needs an accessible label (`aria-label` or associated `<label>`)
- Never put inline `style=""` except for `display:none` on the loading overlay
- Never put inline `<script>` or `<style>` in HTML files

---

## 11. View Rendering Pattern

Every view follows this exact pattern:

```javascript
// src/js/pages/example-view.js

import { t } from '@config/i18n.js';
import { Logger } from '@utils/logger.js';
import { setLoading } from '@utils/helpers.js';
import { renderBreadcrumb } from '@components/breadcrumb.js';
import { getSomeData } from '@js/services/some-service.js';

export async function renderExampleView({ id } = {}) {
  const app = document.getElementById('app');
  if (!app) return;

  // 1. Show loading state
  setLoading(true);

  // 2. Render static structure immediately
  app.innerHTML = `
    <section class="example-view">
      <div id="breadcrumb-container"></div>
      <div id="content-container" aria-live="polite">
        <!-- dynamic content goes here -->
      </div>
    </section>
  `;

  // 3. Render breadcrumb
  renderBreadcrumb([
    { label: t('nav.home'), url: '/' },
    { label: t('example.title'), url: null },
  ]);

  // 4. Fetch data
  try {
    const data = await getSomeData(id);
    const contentEl = document.getElementById('content-container');
    contentEl.innerHTML = renderContentHTML(data);
    attachEventListeners(contentEl, data);
  } catch (error) {
    Logger.error('renderExampleView: failed to load data', error);
    document.getElementById('content-container').innerHTML = `
      <div class="error-state">
        <p>${t('errors.generic')}</p>
        <button data-action="retry">${t('common.retry')}</button>
      </div>
    `;
  } finally {
    // 5. Always hide loading
    setLoading(false);
  }
}

// Helper: pure function that returns HTML string
function renderContentHTML(data) {
  return `<div class="...">${t('...')}</div>`;
}

// Helper: attaches event listeners after DOM is rendered
function attachEventListeners(container, data) {
  container.addEventListener('click', e => {
    if (e.target.dataset.action === 'retry') {
      renderExampleView({ id: data.id });
    }
  });
}
```

**Rules:**

- Always check `document.getElementById('app')` exists before rendering
- Use `aria-live="polite"` on dynamically updated containers (accessibility)
- Use event delegation — one listener on the container, not one per element
- Loading hide (`setLoading(false)`) goes in `finally` — always runs even on error
- Return HTML strings from pure helper functions — don't build DOM with JavaScript

---

## 12. Git Workflow

### Branches

```
main         ← production only, deployment triggers on push here
develop      ← integration branch, CI runs on push here
feature/*    ← one branch per feature/task
fix/*        ← bug fixes
chore/*      ← tooling, dependencies, docs
```

### Branch naming

```bash
feature/phase-6-state-management
feature/university-view
fix/router-404-redirect
chore/update-firebase-sdk
docs/update-agent-context
```

### Commit format (Conventional Commits — enforced by Husky)

```
<type>(<scope>): <short description>

Types:   feat, fix, docs, style, refactor, perf, test, chore, ci, build, revert
Scope:   auth, quiz, db, ui, router, i18n, pwa, ci, deps, admin, cache
```

```bash
# ✅ Valid examples
git commit -m "feat(router): add hash-based SPA routing"
git commit -m "fix(cache): clear faculty cache after department update"
git commit -m "chore(deps): upgrade firebase to v10.14.1"
git commit -m "docs(agent): update AGENT_CONTEXT with phase 6 status"

# ❌ Invalid — will be rejected by commitlint
git commit -m "fixed stuff"
git commit -m "WIP"
git commit -m "Update"
```

### Workflow

```bash
# Start new work
git checkout develop
git pull origin develop
git checkout -b feature/my-feature

# After work is done
npm run lint        # must pass
npm run format      # run formatter
git add .
git commit -m "feat(scope): description"
git push origin feature/my-feature
# Open PR: feature/my-feature → develop
# CI runs lint + build
# Merge after CI passes
```

---

## 13. Tool Configuration Summary

### ESLint (`.eslintrc.cjs`)

- `no-unused-vars` → error
- `no-console` → error (use `Logger` instead)
- `no-var` → error
- `prefer-const` → error
- `eqeqeq` → error (must use `===`)
- `import/no-unresolved` → error (checks all imports exist)

### Prettier (`.prettierrc.cjs`)

- Single quotes
- No semicolons
- 2-space indentation
- 100 char line width
- Trailing commas in multi-line
- Arrow parentheses: avoid when only one param

### Lint-staged (in `package.json`)

Runs on every `git commit`:

- `*.js` files → ESLint fix → Prettier format
- `*.css`, `*.html` files → Prettier format
- `*.json`, `*.md` files → Prettier format

### Vite aliases (in `vite.config.js`)

Already covered in Section 2.

### Firebase (`firebase.json`)

- Firestore emulator: port 8080
- Auth emulator: port 9099
- Storage emulator: port 9199
- Emulator UI: port 4000 (auto-detected)
- `singleProjectMode: true` → connects to `mansa-project-40eb0` automatically

---

## 14. Logging Standards

```javascript
import { Logger } from '@utils/logger.js';

// Debug — only appears in development
Logger.debug('Router: initialized', { routes: routes.size });

// Info — appears in development, traces normal flow
Logger.info('User navigated to', path);

// Warn — something unexpected but not broken
Logger.warn('Cache miss for key', cacheKey);

// Error — something broken, always logged
Logger.error('Firebase read failed', { collection: 'universities', error });
```

**Rules:**

- `Logger.debug` → internal state, values during development
- `Logger.info` → significant events (page loads, language switches, user actions)
- `Logger.warn` → performance issues, cache misses, deprecated usage
- `Logger.error` → any caught exception, any failed operation
- In production: only `error` logs are shown. Everything else is silenced automatically
- Never pass user passwords, tokens, or API keys to Logger

---

## 15. Performance Rules

### Firebase quota protection

1. Every Firestore read goes through `cache.js`
2. Cache TTLs from `V0.1_Execution_Tasks.md` are not suggestions — they are requirements
3. After admin writes: always call `clearCache(key)`
4. Never `querySnapshot.forEach` inside a loop — batch reads at the top of each function

### Bundle size

- Vite code-splits automatically — don't fight it
- Use dynamic imports for routes: `const { renderView } = await import('./view.js')`
- Firebase SDK is already in its own chunk via `vite.config.js` `manualChunks`
- Never import all of Firebase — only import what you use:
  ```javascript
  // ✅ Tree-shakeable imports
  import { getFirestore, collection, getDocs } from 'firebase/firestore';
  // ❌ Never import the full SDK
  import firebase from 'firebase';
  ```

### Loading performance

- Use `setLoading(true)` before any async operation visible to users
- Show skeleton content immediately — never a blank `#app`
- Apply translations before the router starts — no flash of untranslated text

---

## 16. Security Rules

### Never do these:

```javascript
// ❌ Never expose API keys in code
const apiKey = 'AIzaSyDVIQAl...'; // hardcoded — will end up in git

// ❌ Never use import.meta.env directly
const key = import.meta.env.VITE_FIREBASE_API_KEY; // goes through ENV instead

// ❌ Never store sensitive data in localStorage
localStorage.setItem('password', userPassword); // never

// ❌ Never write to Firebase production in V0.1 from admin panel
// The admin panel only runs against the emulator
```

### Always do these:

- All env vars through `ENV` from `@config/env.js`
- All admin writes go through `VITE_USE_EMULATOR=true` (dev emulator)
- Validate all user inputs with `validators.js` before any Firebase write
- Firestore production rules: `allow write: if false` for V0.1 — no exceptions

---

## 17. Accessibility Standards

Every UI component must meet these minimums:

```html
<!-- Navigation: landmark roles -->
<nav aria-label="Main navigation">
  <main role="main">
    <aside aria-label="Sidebar">
      <!-- Interactive elements: always have a label -->
      <button aria-label="Switch to English">EN</button>
      <input id="email" type="email" aria-describedby="email-error" />
      <span id="email-error" role="alert" aria-live="polite">Invalid email</span>

      <!-- Images: always have alt text -->
      <img src="logo.png" alt="MANSA logo" />
      <img src="decorative.png" alt="" role="presentation" />
      <!-- decorative: empty alt -->

      <!-- Keyboard navigation: tab order must be logical -->
      <!-- Never use tabindex > 0 — it breaks natural tab order -->
    </aside>
  </main>
</nav>
```

**RTL accessibility note:** When the user switches to Arabic, update `<html dir="rtl">`. Screen readers use this to announce text direction correctly.

---

## 18. V0.5 Considerations While Writing V0.1

Even in V0.1, write code that won't require a full rewrite for V0.5. Specifically:

### Authentication guard (V0.5 will add this)

```javascript
// V0.1: admin route is dev-only by env check
// V0.5: will add: if (!currentUser || currentUser.role !== 'admin') navigate('/')
// Write the route registration guard so V0.5 just adds one line:
if (ENV.isDev) {
  route('/admin', async () => { ... });
}
// In V0.5, this becomes:
// route('/admin', authGuard('admin', async () => { ... }));
```

### Navigation (V0.5 will add login/profile links)

```javascript
// V0.1: navbar has logo + language switcher only
// V0.5: will add: login button, user avatar, logout
// Design navbar HTML so login section area exists but is empty:
// <div class="navbar__auth" id="navbar-auth"><!-- V0.5 --></div>
```

### User-specific data (V0.5 will add this)

```javascript
// V0.1: leaderboard shows all users (no "my rank" feature)
// V0.5: will add current user's rank, highlighted entry
// Design leaderboard render function with optional currentUserId param:
function renderLeaderboard(entries, currentUserId = null) {
  // V0.1: currentUserId is always null
  // V0.5: currentUserId will be populated from auth state
}
```

### Database writes from client (V0.5)

```javascript
// V0.1 rules: write: if false
// V0.5 rules will add:
//   allow write: if request.auth != null && request.auth.token.admin == true;
// When you write V0.5 security rules, leave the commented-out block from the plan:
// match /universities/{doc} { allow read: if true; allow write: if false; }
// V0.5: allow write: if request.auth.token.admin == true;
```

---

## 19. Future Versions — What's Coming

### V0.5 (Beta) — will require additions to:

- `state.js` → add `currentUser` key, computed `isAuthenticated`
- `router.js` → add `authGuard(role, handler)` wrapper
- `routes.js` → wrap protected routes with `authGuard`
- `navbar.js` → add login/logout/profile section
- All views → handle authenticated vs. guest state
- `firebase.js` → already ready for Auth (exported `auth`)
- New: `auth-service.js`, `user-service.js`, `challenge-service.js`, `leaderboard-service.js`

### V1.0 — AI Integration

- `ENV.ai.groqApiKey` and `ENV.ai.geminiApiKey` already in `env.js`
- `API_ENDPOINTS.GROQ` and `API_ENDPOINTS.GEMINI` already in `constants.js`
- Plan: move AI calls to Firebase Cloud Functions (proxy) — never call AI APIs directly from browser in production (exposes keys)

### Localization expansion

- `i18n.js` is designed to `import()` any language file dynamically
- Adding a new language = create `src/js/config/translations/fr.js` + add to language list
- No architectural changes needed

---

## 20. Dev Environment Setup Checklist

For any new developer or agent to get started:

```bash
# 1. Clone repo
git clone https://github.com/MANSA-Project/MANSA.git
cd MANSA

# 2. Check Node version
node --version  # should be v24.x (see .nvmrc)

# 3. Install dependencies
npm install

# 4. Create .env.development
# Copy .env.example → .env.development
# Fill in Firebase credentials (get from project owner)
# Set VITE_USE_EMULATOR=true

# 5. Login to Firebase
firebase login  # opens browser

# 6. Start emulator (in terminal 1)
firebase emulators:start

# 7. Start dev server (in terminal 2)
npm run dev
# → opens http://localhost:3000
# → emulator UI at http://localhost:4000

# 8. Verify setup
npm run lint    # should output: 0 errors
```

**Expected result:** Browser opens at `localhost:3000` with an empty page (index.html is currently empty — Phase 9 creates it). No errors in console. Firebase Emulator UI accessible at `localhost:4000`.
