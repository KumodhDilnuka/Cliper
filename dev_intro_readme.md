# Developer Guidelines

## 🚨 Important Git Workflow Rules

### 🔒 `main` Branch (PROTECTED)

* Contains **production-ready, fully tested code**
* ❌ **NO direct commits**
* ❌ **NO direct pushes**
* ✅ **ONLY the Project Lead merges to `main`**

---

### 🧪 `dev` Branch (INTEGRATION)

* Used for integrating approved features
* ❌ **NO direct commits to `dev`**
* ✅ Changes must come **only via Pull Requests (PRs)**
* ✅ PRs must be reviewed and tested

---

## ✅ Correct Development Workflow (MANDATORY)

### 1️⃣ Create a personal branch from `dev`

```bash
# Make sure dev is up to date
git fetch origin
git checkout dev
git pull origin dev

# Create and switch to your own branch
git checkout -b feature/your-feature-name
```

✅ You now work **ONLY** on this branch.

---

### 2️⃣ Do your work & test locally

* Implement your feature or fix
* Test thoroughly
* Make sure there are **no errors or warnings**

```bash
git add .
git commit -m "feat: short description of change"
```

---

### 3️⃣ Push your branch to GitHub

```bash
git push origin feature/your-feature-name
```

---

### 4️⃣ Create a Pull Request (PR) → `dev`

On GitHub:

* **Base branch:** `dev`
* **Compare branch:** `feature/your-feature-name`

PR must include:

* What was changed
* How to test it
* Screenshots (if UI-related)

---

### 5️⃣ PR Review & Merge (Controlled)

* ✅ Code review required
* ✅ Must be bug-free
* ✅ CI/CD checks must pass
* ❌ No self-merging without approval

➡️ Once approved, the PR is merged **into `dev`**

---

## 👑 Release Workflow (PROJECT LEAD ONLY)

⚠️ **Only the Project Lead performs these steps**

```
git checkout dev
git pull origin dev

git checkout main
git pull origin main
git merge dev
git push origin main
```

🚀 This is the **official release to production**

---

## ❌ What NOT to Do

* ❌ Do NOT commit directly to `main`
* ❌ Do NOT push directly to `main`
* ❌ Do NOT commit directly to `dev`
* ❌ Do NOT merge your own PR without approval
* ❌ Do NOT push broken or untested code

---

## ✔️ Checklist Before Creating a PR

* [ ] Code tested locally
* [ ] No console errors or warnings
* [ ] No syntax errors
* [ ] Dependencies installed correctly
* [ ] Coding standards followed
* [ ] No sensitive data committed (`.env`, API keys, secrets)
* [ ] Changes documented if needed

---

## 📛 Branch Naming Convention

```
feature/feature-name        # New feature
bugfix/bug-description      # Bug fix
hotfix/critical-issue       # Urgent fix
refactor/code-section       # Refactoring
docs/documentation-update   # Documentation
```

---

## 🔄 Git Commands Quick Reference

```bash
# Check current branch
git branch

# Switch to dev
git checkout dev

# Create feature branch from dev
git checkout -b feature/my-feature

# Stage & commit
git add .
git commit -m "feat: description"

# Push feature branch
git push origin feature/my-feature
```

---

## 🎯 Development Flow Diagram

```
main (Production)
  ↑
  ├── Lead-only merge
  ↓
dev (Integration)
  ↑
  ├── PR + Review required
  ↓
feature / bugfix branches
```

---

### ⚡ Final Reminder

* `dev` is for **approved, tested code only**
* `main` is for **production releases only**
* Always work in **your own branch**
* One feature or fix per branch
* When in doubt — **ASK before merging**

---
**Last Updated**: 2026-03-03