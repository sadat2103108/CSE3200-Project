# Fix: Insufficient Authentication Scopes Error

## Problem
You got this error: `Request had insufficient authentication scopes`

This means your current `GOOGLE_REFRESH_TOKEN` doesn't have permission to access Google Docs.

## Solution: Re-authorize with Correct Scopes

### Step 1: Delete Old Token
In your `.env` file, comment out or delete this line:
```
# GOOGLE_REFRESH_TOKEN=old_token_here
```

### Step 2: Run the Updated Script
The `scripts/getRefreshToken.js` has been updated with the correct scopes. Run it:

```bash
# From the server directory
node scripts/getRefreshToken.js
```

### Step 3: Authorize in Browser
1. A browser window should automatically open
2. If not, copy the URL from the console and open it manually
3. Sign in with your Google account
4. Click "Allow" to grant permissions for:
   - Gmail (send emails)
   - Google Calendar (manage events)
   - Google Docs (create/edit documents) ✅ NEW
   - Google Drive (manage files) ✅ NEW

### Step 4: Copy New Token
After authorization, the console will show:
```
✅ TOKENS RECEIVED:
{ refresh_token: 'YOUR_NEW_TOKEN_HERE', ... }

👉 Copy this into your .env:
GOOGLE_REFRESH_TOKEN=YOUR_NEW_TOKEN_HERE
```

### Step 5: Update .env
Paste the new token into your `.env` file:
```env
GOOGLE_REFRESH_TOKEN=YOUR_NEW_TOKEN_HERE
```

### Step 6: Restart Server
```bash
npm run dev
```

### Step 7: Test Again
Try creating a Google Doc via the bot:
- Web: `http://localhost:3000` → "Create a document called Test"
- Or Telegram: Send "Create a document called Test"

---

## What Changed?

**Old scopes** (getRefreshToken.js):
```javascript
const SCOPES = [
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/calendar"
];
```

**New scopes** (updated):
```javascript
const SCOPES = [
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/documents",  // ✅ Added
  "https://www.googleapis.com/auth/drive"       // ✅ Added
];
```

---

## ⏱️ Time Estimate
- **2-3 minutes** if browser auto-opens
- **3-5 minutes** if you copy URL manually

---

## 🆘 If It Still Doesn't Work

1. **Check .env is saved** - Make sure you saved the `.env` file
2. **Verify token is pasted** - Copy the full token, not just partial
3. **Restart server completely** - Kill and restart `npm run dev`
4. **Clear old tokens** - If you've run this multiple times, ensure only ONE `GOOGLE_REFRESH_TOKEN` line in `.env`

---

Once done, all Google Docs features should work! 🎉
