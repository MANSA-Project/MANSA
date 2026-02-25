# MANSA — Commands Reference

> Quick reference for every CLI tool used in this project.
> All `npm run *` commands are run from the project root.

---

## Table of Contents

1. [npm Scripts](#1-npm-scripts)
2. [Vite](#2-vite)
3. [ESLint](#3-eslint)
4. [Prettier](#4-prettier)
5. [Vitest](#5-vitest)
6. [Firebase CLI](#6-firebase-cli)
7. [Git](#7-git)
8. [Commitlint & Husky](#8-commitlint--husky)
9. [Node & npm General](#9-node--npm-general)

---

## 1. npm Scripts

These are the shortcuts defined in `package.json → scripts`. Always prefer these over raw CLI calls.

| Command                 | What it does                                                          |
| ----------------------- | --------------------------------------------------------------------- |
| `npm run dev`           | Start the Vite dev server at `localhost:3000` with HMR                |
| `npm run build`         | Build for production → outputs to `dist/`                             |
| `npm run preview`       | Serve the `dist/` folder locally (test the production build)          |
| `npm run lint`          | Check `src/js/` and `tests/` for ESLint errors                        |
| `npm run lint:fix`      | Same as lint but auto-fixes fixable errors                            |
| `npm run format`        | Auto-format all `.js .css .html .json .md` files with Prettier        |
| `npm run format:check`  | Check formatting without writing changes (useful in CI)               |
| `npm run test`          | Run Vitest in **watch mode** (re-runs on file change — for local dev) |
| `npm run test:run`      | Run Vitest **once** and exit (use this in CI / pre-push checks)       |
| `npm run test:ui`       | Open the Vitest browser UI dashboard                                  |
| `npm run test:coverage` | Run tests and generate a coverage report                              |
| `npm run analyze`       | Build and open an interactive bundle size visualizer                  |
| `npm run lighthouse`    | Run Lighthouse CI audit against the production build                  |

---

## 2. Vite

Vite is the build tool. The npm scripts wrap these commands — use the npm scripts unless you need a specific flag.

### Dev server

```bash
# Start dev server (default port 3000, set by VITE_PORT in .env.development)
npx vite

# Start on a specific port
npx vite --port 4000

# Start without opening the browser
npx vite --no-open

# Start in a specific mode (loads .env.staging)
npx vite --mode staging
```

### Build

```bash
# Production build (reads .env.production)
npx vite build

# Build in a specific mode
npx vite build --mode staging

# Build and watch for changes (useful for library development)
npx vite build --watch
```

### Preview (serve the dist/ folder)

```bash
# Serve dist/ at localhost:4173
npx vite preview

# Serve on a custom port
npx vite preview --port 5000
```

### Other Vite commands

```bash
# Print Vite version
npx vite --version

# Optimize pre-bundled dependencies manually
npx vite optimize

# Print resolved config (useful for debugging)
npx vite --debug
```

### Environment files loaded by Vite

| File               | When loaded                              |
| ------------------ | ---------------------------------------- |
| `.env`             | Always                                   |
| `.env.local`       | Always (gitignored — personal overrides) |
| `.env.development` | `npm run dev`                            |
| `.env.production`  | `npm run build`                          |
| `.env.[mode]`      | When `--mode [mode]` is passed           |

> Only variables prefixed with `VITE_` are exposed to client-side code via `import.meta.env.VITE_*`.

---

## 3. ESLint

Linter for JavaScript. Config is in `eslint.config.js` (flat config format).

```bash
# Lint src/js/ and tests/ (same as npm run lint)
cross-env ESLINT_USE_FLAT_CONFIG=true npx eslint src/js tests

# Lint a single file
cross-env ESLINT_USE_FLAT_CONFIG=true npx eslint src/js/config/constants.js

# Lint and auto-fix
cross-env ESLINT_USE_FLAT_CONFIG=true npx eslint src/js tests --fix

# Show all rules that are active (debug)
cross-env ESLINT_USE_FLAT_CONFIG=true npx eslint --print-config src/js/config/constants.js

# Lint silently — only print errors, not warnings
cross-env ESLINT_USE_FLAT_CONFIG=true npx eslint src/js tests --quiet

# Output as JSON (useful for editor integrations)
cross-env ESLINT_USE_FLAT_CONFIG=true npx eslint src/js --format json
```

> **Note:** `cross-env ESLINT_USE_FLAT_CONFIG=true` is required because ESLint v8 doesn't enable flat config by default. The `npm run lint` script handles this automatically.

---

## 4. Prettier

Code formatter. Config is in `.prettierrc.cjs`. Prettier formats style only — ESLint handles logic.

```bash
# Format everything (same as npm run format)
npx prettier --write "**/*.{js,css,html,json,md}"

# Format a single file
npx prettier --write src/js/config/constants.js

# Check formatting without writing (same as npm run format:check)
npx prettier --check "**/*.{js,css,html,json,md}"

# Show what Prettier would output for a file (no write)
npx prettier src/js/config/constants.js

# Check if a file needs formatting (exit 1 if yes)
npx prettier --check src/js/config/constants.js
```

---

## 5. Vitest

Unit test runner. Config lives inside `vite.config.js → test`.

```bash
# Watch mode — re-runs tests on change (same as npm run test)
npx vitest

# Run once and exit — use this in CI (same as npm run test:run)
npx vitest run

# Run a specific test file
npx vitest run tests/config/constants.test.js

# Run tests matching a pattern (test name or file path)
npx vitest run --grep "ERROR_KEYS"

# Open the browser UI
npx vitest --ui

# Generate coverage report
npx vitest --coverage

# Run in verbose mode (shows each test name)
npx vitest run --reporter=verbose

# Run in a specific environment
npx vitest run --environment node
```

---

## 6. Firebase CLI

Used for deploying and running local emulators. Requires `firebase-tools` installed globally.

```bash
# Install Firebase CLI globally (one-time)
npm install -g firebase-tools

# Log in to Firebase
firebase login

# Check current project
firebase projects:list

# Switch active project
firebase use <project-id>
```

### Emulators

```bash
# Start all emulators defined in firebase.json
firebase emulators:start

# Start only specific emulators
firebase emulators:start --only firestore,auth

# Start emulators and load data from a previous export
firebase emulators:start --import ./emulator-data

# Export emulator data to a folder (useful between sessions)
firebase emulators:export ./emulator-data

# Start emulators with the UI on a specific port
firebase emulators:start --ui-port 4001
```

### Deployment

```bash
# Deploy everything (hosting + firestore rules)
firebase deploy

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Deploy only Firebase Hosting
firebase deploy --only hosting

# Preview hosting deploy (no real deploy — shows a temp URL)
firebase hosting:channel:deploy preview-branch
```

---

## 7. Git

### Daily workflow

```bash
# Check what changed
git status
git diff                    # unstaged changes
git diff --staged           # staged changes

# Stage changes
git add .                   # stage everything
git add src/js/config/      # stage a folder
git add -p                  # interactive stage (chunk by chunk)

# Commit (Husky will validate the message format — see §8)
git commit -m "feat(auth): add Google sign-in"

# Push current branch to remote
git push
git push -u origin feature/my-feature   # first push of a new branch
```

### Branches

```bash
# List branches
git branch                  # local
git branch -r               # remote
git branch -a               # all

# Create and switch to a new branch
git checkout -b feature/my-feature

# Switch to an existing branch
git checkout main
git switch main             # modern syntax

# Delete a branch (local)
git branch -d feature/done
git branch -D feature/done  # force delete (unmerged)

# Delete a remote branch
git push origin --delete feature/done

# Rename current branch
git branch -m new-name
```

### Syncing

```bash
# Fetch remote changes without merging
git fetch origin

# Pull (fetch + merge)
git pull

# Pull with rebase (cleaner history)
git pull --rebase

# Push and set upstream in one command
git push -u origin feature/my-feature
```

### Viewing history

```bash
# One-line log
git log --oneline

# Graphical branch log
git log --oneline --graph --all

# Show last N commits
git log --oneline -10

# Show changes in a specific commit
git show <commit-hash>

# Show who changed each line
git blame src/js/config/constants.js
```

### Undoing changes

```bash
# Discard unstaged changes in a file
git checkout -- src/js/config/constants.js
git restore src/js/config/constants.js     # modern syntax

# Unstage a file (keep changes)
git reset HEAD src/js/config/constants.js
git restore --staged src/js/config/constants.js  # modern syntax

# Undo last commit (keep changes staged)
git reset --soft HEAD~1

# Undo last commit (keep changes unstaged)
git reset HEAD~1

# Undo last commit and DISCARD all changes (⚠️ destructive)
git reset --hard HEAD~1

# Revert a commit by creating a new undo-commit (safe for shared branches)
git revert <commit-hash>

# Stash uncommitted work temporarily
git stash
git stash pop              # restore
git stash list             # see all stashes
git stash drop stash@{0}   # delete a specific stash
```

### Merging and rebasing

```bash
# Merge a branch into current branch
git merge feature/my-feature

# Rebase current branch onto main
git rebase main

# Interactive rebase (squash/edit last N commits)
git rebase -i HEAD~3

# Abort a merge or rebase in progress
git merge --abort
git rebase --abort

# Cherry-pick a specific commit
git cherry-pick <commit-hash>
```

### Tags

```bash
# List tags
git tag

# Create an annotated tag (for releases)
git tag -a v0.1.0 -m "Initial release"

# Push tags to remote
git push origin --tags

# Delete a tag
git tag -d v0.1.0
git push origin --delete v0.1.0
```

---

## 8. Commitlint & Husky

### Commit message format

This project enforces **Conventional Commits** via `commitlint.config.cjs`. Every commit message must follow:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Allowed types:**

| Type       | When to use                            |
| ---------- | -------------------------------------- |
| `feat`     | New feature                            |
| `fix`      | Bug fix                                |
| `docs`     | Documentation changes only             |
| `style`    | Formatting only (no logic change)      |
| `refactor` | Code restructure (no feature / no fix) |
| `perf`     | Performance improvement                |
| `test`     | Adding or updating tests               |
| `chore`    | Maintenance tasks (deps, config)       |
| `ci`       | CI/CD pipeline changes                 |
| `build`    | Build system changes                   |
| `revert`   | Revert a previous commit               |

**Examples:**

```bash
git commit -m "feat(auth): add Google sign-in support"
git commit -m "fix(quiz): resolve timer freezing on mobile"
git commit -m "docs(readme): update setup instructions"
git commit -m "chore(deps): upgrade firebase to 10.14.1"
git commit -m "test(constants): add edge cases for ERROR_KEYS"
```

**Rules enforced:**

- Type must be lowercase
- Description max 72 characters
- No period at end of description
- Body and footer must have a blank line before them

### Husky hooks

Husky runs automatically on git operations — no manual invocation needed.

| Hook         | Trigger                         | What it runs                                       |
| ------------ | ------------------------------- | -------------------------------------------------- |
| `pre-commit` | Before every `git commit`       | `lint-staged` (lints + formats only changed files) |
| `commit-msg` | After typing the commit message | `commitlint` (validates message format)            |

```bash
# Reinstall Husky hooks (e.g. after a fresh clone)
npm run prepare

# Skip hooks for a one-off commit (⚠️ use sparingly)
git commit --no-verify -m "wip: temporary skip"

# Manually test commitlint against a message
echo "feat(auth): add login" | npx commitlint

# Check what lint-staged would run
npx lint-staged --dry-run
```

---

## 9. Node & npm General

```bash
# Check versions
node --version
npm --version

# Install all dependencies (after a fresh clone)
npm install

# Install a production dependency
npm install firebase

# Install a dev dependency
npm install --save-dev vitest

# Remove a dependency
npm uninstall some-package

# Update all dependencies to latest allowed by semver ranges
npm update

# Check for outdated packages
npm outdated

# Check for security vulnerabilities
npm audit

# Auto-fix audit issues
npm audit fix

# List installed top-level packages
npm list --depth=0

# Run any local binary without npx
./node_modules/.bin/vite --version
```

---

> **Tip:** If you ever forget a command, run `npx <tool> --help` for the full option list.
> Example: `npx vite --help`, `npx eslint --help`, `npx vitest --help`
