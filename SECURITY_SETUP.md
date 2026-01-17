# Security Setup Instructions

## ⚠️ IMPORTANT: Never commit sensitive files to Git!

This project contains example configuration files that need to be customized with your actual credentials.

## Setup Steps

### Backend Configuration

1. **Firebase Service Account Key**
   ```bash
   cd Backend
   cp serviceAccountKey.example.json serviceAccountKey.json
   ```
   Then edit `serviceAccountKey.json` with your actual Firebase credentials from the Firebase Console.

2. **Environment Variables**
   ```bash
   cd Backend
   cp .env.example .env
   ```
   Then edit `.env` with your actual API keys and configuration.

### Frontend Configuration

1. **Environment Variables**
   ```bash
   cd Frontend
   cp .env.example .env
   ```
   Then edit `.env` with your actual Firebase and API configuration.

## Files That Should NEVER Be Committed

- ✅ Already ignored by `.gitignore`:
  - `serviceAccountKey.json` - Firebase credentials
  - `.env` files - API keys and secrets
  - `db.sqlite3` - Database file
  - `__pycache__/` - Python cache
  - `node_modules/` - Dependencies
  - `build/` & `dist/` - Build outputs
  - `.expo/` - Expo cache

## What Happened to Your Git Repository?

If you've already committed sensitive files, they have been removed from tracking. However, they may still exist in your Git history. To completely remove them:

### Option 1: Remove from history (recommended if repository is private or not yet pushed)
```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch Backend/serviceAccountKey.json" \
  --prune-empty --tag-name-filter cat -- --all
```

### Option 2: If already pushed to GitHub (CRITICAL)
1. **Revoke all credentials** in Firebase Console immediately
2. Generate new Firebase service account keys
3. Update your local `serviceAccountKey.json` with new credentials
4. Consider the old credentials compromised

## Best Practices

1. ✅ Always use `.env.example` or `.example.json` files for templates
2. ✅ Add sensitive files to `.gitignore` BEFORE creating them
3. ✅ Never hardcode API keys or secrets in source code
4. ✅ Regularly rotate credentials
5. ✅ Use environment variables for configuration

## Questions?

Check the `.gitignore` file to see what's being excluded from version control.
