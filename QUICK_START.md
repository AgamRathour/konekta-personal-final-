# 🚀 QUICK START GUIDE - 3 SIMPLE STEPS

## ✅ Step 1: Install Backend Dependencies (DONE)
```bash
cd konekta-backend
npm install  ✅ ALREADY INSTALLED
```

## ✅ Step 2: Start Backend Server
```bash
cd konekta-backend
npm run dev
```
**Terminal should show:**
```
Server running on http://localhost:5000
```

## ✅ Step 3: Start Frontend Dev Server (New terminal)
```bash
cd Konekta
npm run dev
```
**Terminal should show:**
```
Local:   http://localhost:5173
```

---

## 🧪 IMMEDIATE TEST (No MongoDB Needed!)

The app uses **mock database** (JSON file) by default - no MongoDB setup required yet!

### Test the flow:

1. **Frontend:** http://localhost:5173
2. Click **"Login"**
3. Enter any email like: `testuser@test`
4. ✅ Should see **Onboarding page**
5. Select interests → Continue
6. Fill profile info → Done
7. ✅ See your **profile/feed**

### Test with different user:

1. Click **Logout** (or clear localStorage)
2. Click **"Login"**
3. Enter different email: `anotheruser@test`
4. ✅ Should see **onboarding again** (new user)
5. Complete setup
6. ✅ Different profile created!

### Test returning user:

1. Click **Logout**
2. Login with **first email again**: `testuser@test`
3. ✅ Should **SKIP onboarding** 
4. ✅ Go **directly to profile**

---

## 📊 What's Working

| Feature | Status | How to Test |
|---------|--------|-----------|
| Email login (any format) | ✅ Working | Enter `abc@test` |
| Auto-user creation | ✅ Working | New email auto-creates profile |
| Onboarding for new users | ✅ Working | First login shows onboarding |
| Skip onboarding for returning users | ✅ Working | Second login skips it |
| Profile isolation | ✅ Working | Different emails = different profiles |
| Mock database storage | ✅ Working | Data persists locally in JSON |

---

## ⚡ MongoDB Setup (Optional - Later)

When you're ready for real database:

### Option 1: Local MongoDB
1. Download from https://www.mongodb.com/try/download/community
2. Install & start MongoDB
3. Update `.env`: `MONGODB_URI=mongodb://localhost:27017/konekta`

### Option 2: MongoDB Atlas (Cloud)
1. Create free account: https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Copy connection string
4. Update `.env`: `MONGODB_URI=your_atlas_connection_string`

Then restart backend - it will automatically use MongoDB!

---

## 🐛 Troubleshooting

### "Address already in use" error on port 5000?
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### "Cannot find module" error?
```bash
# Reinstall dependencies
cd konekta-backend
npm install
```

### Localhost won't load?
- Make sure both servers are running
- Backend: http://localhost:5000
- Frontend: http://localhost:5173
- Check terminal for errors

---

## 📝 Key Changes Made

1. ✅ **Email Validation** - Now accepts `user@test` format
2. ✅ **OTP Removed** - Direct login without codes
3. ✅ **Auto-Signup** - Login automatically creates user
4. ✅ **Smart Routing** - First login → Onboarding, Second login → Profile
5. ✅ **User Isolation** - Each email = unique profile

---

## 🎉 You're Ready!

1. Open 2 terminals
2. Terminal 1: `cd konekta-backend && npm run dev`
3. Terminal 2: `cd Konekta && npm run dev`
4. Open http://localhost:5173 in browser
5. Test with emails like: `user1@test`, `user2@test`, etc.

**Enjoy!** 🚀
