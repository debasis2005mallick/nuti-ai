# 🚀 Deploy NutriScan AI to GitHub Pages — Step-by-Step

## Problem: 404 After Deploying?

The most common causes and their fixes:

### Fix 1 — `.nojekyll` File (ALREADY DONE ✅)
GitHub Pages runs Jekyll by default which **ignores** JS module folders. The `.nojekyll` file at the root disables this.

### Fix 2 — Git is Not Installed
The error showed `git is not recognized`. Install Git first:
👉 Download: https://git-scm.com/download/win — install with defaults.

---

## 📋 Complete Deployment Checklist

### Step 1: Open Git Bash or PowerShell in your project folder
Right-click inside `c:\Users\BVP\Desktop\hackathon\` → "Open Git Bash here"

### Step 2: Initialize, add all files, and push

```bash
git init
git add .
git commit -m "NutriScan AI v1.0 - Hackathon Submission"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nutriscan-ai.git
git push -u origin main
```

> ⚠️ Replace `YOUR_USERNAME` with your actual GitHub username!
> Create the repo at https://github.com/new first (name it `nutriscan-ai`, keep it Public, DON'T add README).

### Step 3: Enable GitHub Pages
1. Go to your repo on GitHub
2. Click **Settings** (top tabs)
3. Scroll to **Pages** (left sidebar)
4. Under **Source** → Select **Deploy from a branch**
5. Branch: `main` / Folder: `/ (root)`
6. Click **Save**

### Step 4: Wait 60–90 seconds, then open:
```
https://YOUR_USERNAME.github.io/nutriscan-ai/
```

---

## ✅ Verification Checklist Before Pushing

Run this in Git Bash to verify all critical files are included:

```bash
git status
# You should see these files staged:
# .nojekyll          ← CRITICAL: Must be present!
# .gitignore
# index.html
# styles/main.css
# styles/components.css
# styles/desktop.css
# styles/mobile.css
# js/app.js
# js/config.js
# js/state.js
# js/services/aiVisionService.js
# js/services/onlineNutritionService.js
# ... all other js/ files
```

---

## 🔧 Still Getting 404?

| Symptom | Root Cause | Fix |
|---|---|---|
| `404` on the main URL | Pages not enabled or wrong branch | Re-check Settings → Pages → Branch = `main` |
| Main page loads but JS errors | Missing `.nojekyll` | Verify `.nojekyll` is in the root of the repo |
| Blank white page | JS module import error | Open DevTools (F12) → Console tab → share the red error |
| Images broken | Old `assets/` path | Already fixed to use Unsplash CDN URLs ✅ |
| 404 on CSS/JS files | Wrong base path | All paths are relative (`./styles/`) — should work automatically |

---

## 🏠 Running Locally (No Git Needed)

If you just want to test locally right now:

```bash
# Option A: Python (built-in)
python -m http.server 8080
# Open http://localhost:8080

# Option B: Node.js
npx serve .
# Open the URL it shows
```

> ⚠️ Do NOT just double-click `index.html` — ES modules won't load from `file://` URLs in Chrome/Edge. Use a local server.
