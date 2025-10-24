# 🧩 Installing Private Packages from GitHub Packages

<span style="color:red;">
This project’s packages are hosted on <strong>GitHub Packages,</strong> not the public npm registry.  
To install them, you’ll need to authenticate with a GitHub token.
</span>

---

## 🔐 1. Generate a Personal Access Token (PAT)

1. Go to your [GitHub Developer Settings → Tokens (classic)](https://github.com/settings/tokens).  
2. Click **“Generate new token (classic)”** → choose **“Read:packages”** scope.  
   *(If you need to publish as well, also select “Write:packages” and “Delete:packages”)*  
3. Copy your token — it will look like this:
   ```
   ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

---

## ⚙️ 2. Configure `.npmrc`

You can set this globally (recommended) or per project.

### **Option A: Project-level (preferred)**
Create a file named `.npmrc` in the root of your project with:

```bash
@your-scope:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Then create a local environment variable (recommended for security):

**Windows (PowerShell):**
```bash
$env:GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

**macOS/Linux (bash/zsh):**
```bash
export GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### **Option B: Global setup**
Alternatively, you can set the token globally:
```bash
npm set //npm.pkg.github.com/:_authToken=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
npm set @your-scope:registry=https://npm.pkg.github.com/
```

---

## 📦 3. Install Packages

Once `.npmrc` is configured, you can install packages normally:
```bash
npm install @your-scope/your-package
```

---

## 🧰 Example `.npmrc`

If your GitHub org is `techy-org`, it should look like:

```bash
@techy-org:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

---

## 🚀 Notes

- Each developer must have their own GitHub token.  
- The token only needs **read:packages** permission for installing.  
- Never commit your token directly into `.npmrc`.  
- CI/CD pipelines can use repository or organization-level secrets (`GITHUB_TOKEN`).
