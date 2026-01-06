# Google Docs Integration Setup Guide

## ✅ What You Already Have

Your existing Google OAuth2 setup already supports Google Docs! Here's why:

### 1. **OAuth2 Client Configuration**
Your current OAuth2 client in `utils/googleAuth.js` uses a refresh token that you've already obtained. As long as your Google Console project is configured with the correct scopes, Google Docs will work immediately.

### 2. **APIs Already Available**
The `googleapis` npm package (already in your `package.json`) includes:
- Google Docs API v1
- Google Drive API v3

Both are needed for the Google Docs integration and don't require separate installations.

---

## 🔧 What You Need to Do in Google Console

### Step 1: Enable Google Docs API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your existing project (the one with Calendar and Gmail already set up)
3. Go to **APIs & Services** > **Library**
4. Search for **"Google Docs API"**
5. Click on it and press **Enable**
6. Do the same for **"Google Drive API"** (if not already enabled)

### Step 2: Verify OAuth Scopes
1. Go to **APIs & Services** > **OAuth consent screen**
2. Click **Edit App**
3. Go to **Scopes** section
4. Make sure these scopes are present (add if missing):
   - `https://www.googleapis.com/auth/documents`
   - `https://www.googleapis.com/auth/drive`
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/gmail.send`

### Step 3: Re-authorize if Needed
If you added new scopes, you may need to re-authenticate:
1. Delete your current `GOOGLE_REFRESH_TOKEN` from your `.env` file
2. Run the refresh token generator again (check your `scripts/getRefreshToken.js`)
3. Follow the OAuth flow to get a new refresh token
4. Update your `.env` with the new token

⚠️ **If you already have Calendar and Email working**, you likely already have the correct scopes. Test first before re-authorizing.

---

## 📝 Environment Variables

Your `.env` file already has everything needed. No new variables required:

```
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/oauth2callback
GOOGLE_REFRESH_TOKEN=your_refresh_token_here
```

The Google Docs integration uses these same credentials. ✅

---

## 🎯 API Endpoints Available

After setup, you can use these endpoints:

### Create Document
```bash
POST /api/docs/create
Body: {
  "title": "My Document",
  "content": "Initial content here"
}
```

### Read Document
```bash
GET /api/docs/read?documentId=YOUR_DOC_ID
```

### Append Content
```bash
POST /api/docs/append
Body: {
  "documentId": "YOUR_DOC_ID",
  "content": "New content to append"
}
```

### Replace Content
```bash
POST /api/docs/replace
Body: {
  "documentId": "YOUR_DOC_ID",
  "searchText": "old text",
  "replacementText": "new text"
}
```

### List Documents
```bash
GET /api/docs/list?limit=10
```

### Delete Document
```bash
DELETE /api/docs/delete?documentId=YOUR_DOC_ID
```

### Share Document
```bash
POST /api/docs/share
Body: {
  "documentId": "YOUR_DOC_ID",
  "email": "user@example.com",
  "role": "writer"  // or "reader", "commenter"
}
```

---

## 🤖 Bot Commands Available

The bot now understands these commands:

### Create a Document
```
"Create a document titled 'Meeting Notes' with the content about Q1 planning"
```

### Read a Document
```
"Read the document with ID 1BxiMVs0XRA5nFMoog2qNJvwpkQHu8z12LoKr6Tti-sQ"
```

### Append to Document
```
"Add to my document about project planning the following: 'Action items: 1. Review budget 2. Schedule team meeting'"
```

### Find and Replace
```
"In my project document, replace 'Q1' with 'Q1 2026'"
```

### List My Documents
```
"Show me my last 5 documents"
```

### Delete Document
```
"Delete the document with ID 1BxiMVs0XRA5nFMoog2qNJvwpkQHu8z12LoKr6Tti-sQ"
```

### Share Document
```
"Share my meeting notes document with john@company.com as an editor"
```

---

## 🧪 Testing

### Manual Test via API
```bash
curl -X POST http://localhost:3000/api/docs/create \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Doc","content":"Hello World"}'
```

### Via Bot Chat Interface
Go to `http://localhost:3000` and try:
- "Create a document called 'Test' with content 'Hello there'"
- "List my documents"

---

## ⚙️ How Text Formatting Works

The system handles text formatting intelligently:

1. **Paragraph Breaks**: AI properly formats content with `\n` characters
2. **Lists**: AI creates proper list formatting with bullet points
3. **Multiple Operations**: The bot can handle complex instructions like:
   - "Create a doc with the project proposal and then share it with team@company.com"
   - "Read my notes, then append the new action items I just mentioned"

---

## 🚀 Quick Start Checklist

- [ ] Enable Google Docs API in Google Cloud Console
- [ ] Enable Google Drive API in Google Cloud Console
- [ ] Verify OAuth scopes include `docs` and `drive` scopes
- [ ] Restart your server: `npm run dev`
- [ ] Test the bot with: "Create a document called Test with some sample content"
- [ ] Check if the document appears in your Google Drive
- [ ] Try other commands to verify all features work

---

## ❓ Common Issues

### Issue: "Unauthorized - insufficient permissions"
**Solution**: You need to add the `https://www.googleapis.com/auth/documents` scope and re-authenticate. Delete refresh token and run `getRefreshToken.js` again.

### Issue: "Document not found"
**Solution**: Make sure you're using the correct `documentId`. Get it from `docs.list` command output.

### Issue: "Operation timed out"
**Solution**: Large documents take longer. Increase the timeout in your fetch calls if needed.

---

## 📚 Additional Resources

- [Google Docs API Docs](https://developers.google.com/docs/api/reference/rest)
- [Google Drive API Docs](https://developers.google.com/drive/api/reference/rest)
- [OAuth 2.0 Scopes](https://developers.google.com/identity/protocols/oauth2/scopes)

---

**Summary**: Your system is ready for Google Docs! Just enable the APIs in Google Console and you're good to go. No new environment variables or refresh tokens needed (unless you're missing the scopes).
