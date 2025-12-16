# Troubleshooting Guide

Common issues and solutions for NordicCode.

---

## 🔐 Authentication Issues

### "Invalid credentials" when logging in
**Cause:** The user doesn't exist in the database or password is wrong.

**Solution:**
1. Re-seed the database:
   ```bash
   node seeder -d
   node seeder -i
   ```
2. Use the correct test credentials:
   | Email | Password | Role |
   |-------|----------|------|
   | `admin@gmail.com` | `123456` | Admin |
   | `publisher@gmail.com` | `123456` | Publisher |
   | `user@gmail.com` | `123456` | User |

---

### "Too many login attempts, try again after 15 minutes"
**Cause:** Rate limiter triggered after 50 failed attempts.

**Solution:**
- Wait 15 minutes, OR
- Restart the server (clears rate limit memory), OR
- Temporarily increase limit in `middleware/security.js`:
  ```javascript
  max: 100, // Increase this value
  ```

---

## 🖼️ UI Issues

### Details modal doesn't open after pagination
**Cause:** Global `bootcampsData` wasn't updated when loading from cache.

**Solution:** Already fixed in `public/js/app.js`. Ensure this line exists in the cache block:
```javascript
bootcampsData = cached.data;  // IMPORTANT: Update global state
```

---

### Images appear duplicated across cards
**Cause:** The `photo` field in `finland_bootcamps.json` had duplicate values.

**Solution:** Each bootcamp must have a unique `photo` filename. Verify in `_data/finland_bootcamps.json`.

---

### Inline styles blocked (CSP error in console)
**Cause:** Content Security Policy too strict.

**Solution:** In `middleware/security.js`, ensure `'unsafe-inline'` is in `scriptSrc` and `styleSrc`:
```javascript
scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
styleSrc: ["'self'", "'unsafe-inline'", "https:"],
```

---

## 🗄️ Database Issues

### "Bootcamp not found in local data"
**Cause:** Frontend cache out of sync with current page data.

**Solution:** Fixed via event delegation and cache sync. Force refresh (Ctrl+Shift+R) if issue persists.

---

### Seeder fails or data missing
**Cause:** Wrong JSON file being loaded, or MongoDB connection issue.

**Solution:**
1. Check `seeder.js` loads the correct files:
   ```javascript
   fs.readFileSync(`${__dirname}/_data/finland_bootcamps.json`, "utf-8")
   ```
2. Verify `MONGO_URI` in `config/config.env` is correct.
3. Run seeder again:
   ```bash
   node seeder -d && node seeder -i
   ```

---

## ⚡ Performance Issues

### Images loading slowly
**Cause:** Large image files (5-7MB each).

**Solution:** Optimize images using sharp:
```bash
npm install sharp
node optimize_images.js
```
Target size: < 100KB per image.

---

## 🌐 Deployment Issues (Render)

### Login works locally but not on Render
**Cause:** Database seeded locally but Render uses same MongoDB Atlas.

**Solution:** Seeding locally updates the Atlas database that Render uses. Just re-seed:
```bash
node seeder -d && node seeder -i
```

---

## 📞 Still Stuck?

1. Check browser DevTools Console (F12) for errors
2. Check server terminal for stack traces
3. Verify `.env` variables are set correctly
4. Try a fresh `npm install`
