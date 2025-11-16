# KONEKTA AUTHENTICATION - GETTING STARTED CHECKLIST

## ✅ STATUS: ALL COMPONENTS BUILT & READY

Everything you need for authentication is complete. Follow these steps to get it running.

---

## 📋 PRE-SETUP CHECKLIST (Do These First)

### 1. Google OAuth Credentials ⚙️

- [ ] Go to https://console.cloud.google.com/
- [ ] Create new project "Konekta"
- [ ] Enable OAuth 2.0
- [ ] Go to Credentials → Create OAuth Client ID
- [ ] Add JavaScript origins:
  - `http://localhost:5173`
  - `http://localhost:5174`
  - `http://localhost:5175`
- [ ] Add authorized redirect URI:
  - `http://localhost:5000/api/auth/google/callback`
- [ ] Copy Client ID and Client Secret
- [ ] Keep these safe (don't share!)

### 2. Gmail Setup 📧

- [ ] Go to https://myaccount.google.com/
- [ ] Enable 2-Factor Authentication
- [ ] Go to Security → App passwords
- [ ] Select "Mail" and "Windows Computer"
- [ ] Generate 16-character password
- [ ] Copy this password (don't share!)

### 3. MongoDB 🗄️

- [ ] Choose one option:
  - **Option A:** Install MongoDB locally from https://www.mongodb.com/try/download/community
  - **Option B:** Use MongoDB Atlas (cloud) - Create free account at https://www.mongodb.com/cloud/atlas

---

## 🛠️ SETUP STEPS (Follow In Order)

### Step 1: Create .env Files

**Backend: `konekta-backend/.env`**

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/konekta
JWT_SECRET=generate_a_random_32_character_string_here_change_this
GOOGLE_CLIENT_ID=paste_google_client_id_here
GOOGLE_CLIENT_SECRET=paste_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=paste_16_char_app_password_here
CLIENT_URL=http://localhost:5173
OTP_EXPIRY=10
```

**Frontend: `Konekta/.env`**

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=paste_google_client_id_here
```

### Step 2: Start MongoDB

**If using local MongoDB:**

```bash
mongod
```

Leave this terminal running.

**If using MongoDB Atlas:**

- Verify connection string is in backend .env

### Step 3: Install Backend Dependencies

```bash
cd konekta-backend
npm install
```

### Step 4: Install Frontend Dependencies

```bash
cd ../Konekta
npm install
```

### Step 5: Start Backend Server

Open NEW terminal:

```bash
cd konekta-backend
npm run dev
```

You should see:

```
Server running on port 5000
Connected to MongoDB: mongodb://localhost:27017/konekta
```

### Step 6: Start Frontend Dev Server

Open ANOTHER NEW terminal:

```bash
cd Konekta
npm run dev
```

You should see:

```
Vite server is running at http://localhost:5173
```

---

## 🧪 TESTING AUTHENTICATION

### Test 1: Signup with Email

1. Open http://localhost:5173 in browser
2. Click "Get Started" button
3. Fill signup form:
   - First Name: John
   - Last Name: Doe
   - DOB: 2000-01-15
   - Phone: 9876543210
   - Email: test@example.com
   - Password: Test123
4. Click "Create Account"
5. You should see message: "📧 Check your email to verify your account"

### Test 2: Verify Email

1. Check your inbox for verification email
2. Click the verification link in the email
3. Link should take you to backend verification
4. Browser should redirect to login page

### Test 3: Login with Email

1. On login page, fill in:
   - Email: test@example.com
   - Password: Test123
2. Click "Log-In"
3. You should be logged in! ✅

### Test 4: Google OAuth

1. Go to `/login` page
2. Click "Sign in with Google"
3. Sign in with your Google account
4. You should be redirected back and logged in ✅

### Test 5: Protected Routes

Use Postman or Thunder Client to test API:

```bash
# Get your token first (from login response)

# Then test protected route:
GET http://localhost:5000/api/auth/me
Headers: Authorization: Bearer <your_token_here>

# Should return your user data
```

---

## 🐛 TROUBLESHOOTING

### "CORS error" or "Access to XMLHttpRequest blocked"

```
✓ Check VITE_API_URL in frontend .env
✓ Check CLIENT_URL in backend .env
✓ Both should match frontend and backend URLs
```

### "MongoDB connection failed"

```
✓ Is mongod running? Start it first
✓ Is MONGODB_URI correct in .env?
✓ For MongoDB Atlas, use full connection string
```

### "Email not sending"

```
✓ Is EMAIL_USER correct?
✓ Is EMAIL_PASSWORD the app-specific password (not Gmail password)?
✓ Did you enable 2FA on Gmail?
✓ Check backend console for error messages
```

### "Google OAuth redirect failed"

```
✓ Is GOOGLE_CLIENT_ID same in both .env files?
✓ Are redirect URIs configured in Google Console?
✓ Did you add http://localhost:5000/api/auth/google/callback?
```

### "Port 5000 already in use"

```
# Find and kill process:
netstat -ano | findstr :5000
taskkill /PID <process_id> /F

# Or use different port:
PORT=5001 npm run dev
```

### SignUp page shows placeholder text

```
✓ You might have the old version
✓ File has been restored, refresh browser (Ctrl+F5)
✓ Restart frontend dev server
```

---

## 📊 WHAT WORKS NOW

✅ **Signup**

- Email validation
- Password strength (min 6 chars)
- Phone validation (10 digits)
- User created in database
- Verification email sent

✅ **Email Verification**

- Click link in email
- Account marked as verified
- Can now login

✅ **Login**

- Email/password authentication
- Password comparison with bcrypt
- JWT token generated
- Token stored locally

✅ **Google OAuth**

- Sign in with Google account
- User created if new
- User found if existing
- Proper redirects

✅ **Protected Routes**

- Get user profile with token
- Update user profile
- 401 error if no token

---

## 📝 IMPORTANT NOTES

⚠️ **Security**

- Never commit .env file to git
- Never share JWT_SECRET
- Never share Google credentials
- Use app-specific password for Gmail, not main password

⚠️ **Development**

- MongoDB should be running in separate terminal
- Backend should be running in separate terminal
- Frontend runs in main terminal
- Keep all 3 running for development

⚠️ **Production**

- Change JWT_SECRET to random 32+ character string
- Use production MongoDB URI
- Update Google OAuth redirect URIs
- Use HTTPS instead of HTTP
- Set NODE_ENV=production

---

## 🎯 SUCCESS INDICATORS

You'll know everything is working when:

✅ Signup page loads without errors  
✅ Can fill form and submit  
✅ Receive verification email  
✅ Can verify email  
✅ Can login with credentials  
✅ Redirected to dashboard after login  
✅ Google OAuth button works  
✅ Can see user profile (protected route)

---

## 📞 QUICK COMMAND REFERENCE

```bash
# Start MongoDB
mongod

# Install backend
cd konekta-backend && npm install

# Install frontend
cd Konekta && npm install

# Start backend
cd konekta-backend && npm run dev

# Start frontend
cd Konekta && npm run dev

# Test API with curl
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123"}'
```

---

## 📚 File LOCATIONS

**All backend files:** `konekta-backend/`

```
- server.js (main server)
- models/User.js (database)
- controllers/authController.js (logic)
- routes/auth.js (endpoints)
- middleware/auth.js (protection)
- utils/mailer.js (emails)
- config/passportConfig.js (Google OAuth)
```

**All frontend files:** `Konekta/src/`

```
- pages/Auth/SignIn.jsx (signup)
- pages/Auth/Login.jsx (login)
- pages/Auth/GoogleCallback.jsx (OAuth)
- services/authService.js (API calls)
- router/AppRouter.jsx (routes)
```

---

## 🚀 NEXT STEPS (After Auth Works)

1. Create Onboarding page
2. Build Home Feed
3. Create Profile page
4. Add Create Post feature
5. Build Messenger
6. Implement Stories
7. Add real-time notifications

---

## ✅ YOU'RE ALL SET!

Everything is built and ready. Just:

1. ✅ Get credentials (Google + Gmail)
2. ✅ Fill .env files
3. ✅ Install dependencies
4. ✅ Start servers
5. ✅ Test authentication

**Happy building! 🎉**
