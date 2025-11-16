# 📂 FILE STRUCTURE - WHERE EVERYTHING IS

## Frontend Files (Konekta/)

```
Konekta/
├── .env                          ← NEEDS YOUR VALUES
├── .env.example                  ← Reference template
├── package.json                  ← Dependencies (already has react-router, vite)
├── index.html                    ← Entry point
├── vite.config.js               ← Vite config (tailwind configured)
├── tailwind.config.js           ← Tailwind CSS
├── src/
│   ├── App.jsx                  ✅ Uses AppRouter
│   ├── main.jsx                 ✅ Entry point
│   ├── pages/
│   │   ├── Landing/
│   │   │   └── Landing.jsx      ✅ Home page with hero
│   │   ├── Auth/
│   │   │   ├── SignIn.jsx       ✅ RESTORED - Signup form (230 lines)
│   │   │   │   - Form: firstName, lastName, DOB, phone, email, password
│   │   │   │   - Validation before submit
│   │   │   │   - Password toggle eye 👁️
│   │   │   │   - Error messages
│   │   │   │   - Google OAuth button
│   │   │   │
│   │   │   ├── Login.jsx        ✅ Login form (225 lines)
│   │   │   │   - Email & password fields
│   │   │   │   - Password toggle
│   │   │   │   - Info message support
│   │   │   │   - Google OAuth button
│   │   │   │   - "Forgot password" link
│   │   │   │
│   │   │   └── GoogleCallback.jsx ✅ OAuth redirect handler (110 lines)
│   │   │       - Processes Google redirect
│   │   │       - Extracts auth code
│   │   │       - Calls backend callback
│   │   │       - Redirects to onboarding/home
│   │   │
│   │   ├── Profile/
│   │   ├── Chat/
│   │   ├── Feed/
│   │   ├── Notifications/
│   │   └── Settings/
│   │
│   ├── components/
│   │   ├── ActivityPanel/
│   │   ├── Common/
│   │   ├── FeedCard/
│   │   ├── Navbar/
│   │   ├── PostModal/
│   │   ├── Sidebar/
│   │   └── Stories/
│   │
│   ├── services/
│   │   ├── authService.js      ✅ API integration (256 lines)
│   │   │   - signIn(userData)
│   │   │   - login(email, password)
│   │   │   - googleAuth()
│   │   │   - handleGoogleCallback(code)
│   │   │   - sendOTP(email)
│   │   │   - verifyOTP(email, otp)
│   │   │   - verifyEmail(token)
│   │   │   - getCurrentUser()
│   │   │
│   │   ├── postService.js
│   │   ├── notificationService.js
│   │   ├── storyService.js
│   │   ├── userService.js
│   │   └── apiClient.js
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── PostContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── UserContext.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useFetch.js
│   │   └── useTheme.js
│   │
│   ├── router/
│   │   └── AppRouter.jsx       ✅ All routes configured (28 lines)
│   │       - "/" → Landing
│   │       - "/signup" → SignIn
│   │       - "/login" → Login
│   │       - "/auth/google/callback" → GoogleCallback
│   │
│   ├── styles/
│   │   ├── Chat.css
│   │   ├── Feed.css
│   │   ├── globals.css
│   │   ├── Profile.css
│   │   ├── Settings.css
│   │   └── theme.css
│   │
│   └── utils/
│       ├── constants.js
│       ├── formatDate.js
│       └── validators.js
│
├── public/
├── assets/
│   ├── fonts/
│   ├── icons/
│   └── images/
│       └── img2.jpeg           ✅ Hero image
```

---

## Backend Files (konekta-backend/)

```
konekta-backend/
├── .env                        ← NEEDS YOUR VALUES (create from .env.example)
├── .env.example                ← Template with all variables
├── package.json                ✅ Dependencies configured
├── server.js                   ✅ Express server (80 lines)
│   - Connects to MongoDB
│   - Sets up middleware
│   - Initializes Passport
│   - Listens on port 5000
│
├── models/
│   └── User.js                ✅ MongoDB schema (250+ lines)
│       Fields:
│       - firstName, lastName
│       - email (unique), password
│       - phone (10-digit), dateOfBirth
│       - gender, authProvider, googleId
│       - profilePicture, interests[]
│       - bio, college, year
│       - isVerified, verificationToken
│       - otp, otpExpires
│       - isActive, lastLogin
│
│       Methods:
│       - matchPassword() - bcrypt comparison
│       - generateVerificationToken() - 24-hour token
│       - generateOTP() - 6-digit code (10-min)
│       - verifyOTP() - validate code
│
├── controllers/
│   └── authController.js      ✅ 8 functions (250+ lines)
│       1. signup
│          - Email validation
│          - Create user
│          - Hash password
│          - Send verification email
│
│       2. login
│          - Find user
│          - Compare password (bcrypt)
│          - Generate JWT
│
│       3. googleAuth
│          - Handle OAuth callback
│          - Create/find user
│          - Generate JWT
│
│       4. verifyEmail
│          - Validate token
│          - Mark user as verified
│
│       5. sendOTP
│          - Generate 6-digit OTP
│          - Send via email
│          - Set 10-minute expiry
│
│       6. verifyOTP
│          - Validate OTP
│          - Check expiry
│          - Mark verified
│
│       7. getCurrentUser
│          - Return authenticated user
│          - Protected route
│
│       8. updateProfile
│          - Update user fields
│          - Protected route
│
├── routes/
│   └── auth.js                ✅ 9 endpoints (120 lines)
│       PUBLIC:
│       - POST /signup         → authController.signup
│       - POST /login          → authController.login
│       - POST /verify-email   → authController.verifyEmail
│       - POST /send-otp       → authController.sendOTP
│       - POST /verify-otp     → authController.verifyOTP
│       - GET /google          → Passport Google login
│       - GET /google/callback → authController.googleAuth
│
│       PROTECTED:
│       - GET /me              → authController.getCurrentUser
│       - PUT /profile         → authController.updateProfile
│
├── middleware/
│   ├── auth.js               ✅ JWT protection (25 lines)
│   │   - Extract Bearer token
│   │   - Verify JWT signature
│   │   - Add user to req.user
│   │
│   └── errorHandler.js       ✅ Error handling (40 lines)
│       - Validation errors
│       - JWT errors
│       - Mongoose errors
│       - Generic errors
│
├── config/
│   └── passportConfig.js     ✅ Google OAuth (50 lines)
│       - Google Strategy setup
│       - User lookup/creation
│       - JWT attachment
│
└── utils/
    └── mailer.js             ✅ Email service (100 lines)
        - Nodemailer config
        - sendVerificationEmail()
        - sendOTPEmail()
        - sendWelcomeEmail()
```

---

## Documentation Files (Root)

```
konekta-personal-final-/
├── WHAT_I_DID.md              ✅ This explains what was done
├── AUTHENTICATION_SUMMARY.md  ✅ Complete auth system overview
├── GETTING_STARTED.md         ✅ Step-by-step setup guide
├── README.md                  ← Project readme
```

---

## Key Connections

### Frontend → Backend Communication

```
SignIn.jsx
    ↓
handleSignUp()
    ↓
authService.signIn(formData)
    ↓
fetch POST /api/auth/signup
    ↓
authController.signup()
    ↓
User.create() → MongoDB
```

### Login Flow

```
Login.jsx
    ↓
handleLogin()
    ↓
authService.login(email, password)
    ↓
fetch POST /api/auth/login
    ↓
authController.login()
    ↓
User.findOne().matchPassword()
    ↓
JWT token generated
    ↓
Stored in localStorage
```

### Google OAuth Flow

```
SignIn/Login.jsx
    ↓
handleGoogleSignUp/Login()
    ↓
authService.googleAuth()
    ↓
Opens Google login
    ↓
User signs in
    ↓
Google redirects to /auth/google/callback?code=xxx
    ↓
GoogleCallback.jsx
    ↓
authService.handleGoogleCallback(code)
    ↓
fetch POST /api/auth/google/callback
    ↓
authController.googleAuth()
    ↓
Passport validates code
    ↓
User created or found
    ↓
JWT token generated
```

---

## Environment Variables Location

### Frontend (.env)

```
Konekta/.env
```

### Backend (.env)

```
konekta-backend/.env
```

---

## Database Structure

```
MongoDB: konekta
    └── Collection: users
        Documents:
        {
          _id: ObjectId,
          firstName: string,
          lastName: string,
          email: string (unique),
          password: string (hashed),
          phone: string (10 digits),
          dateOfBirth: Date,
          gender: string,
          authProvider: "email" | "google",
          googleId: string (if OAuth),
          isVerified: boolean,
          verificationToken: string,
          verificationTokenExpires: Date,
          otp: string,
          otpExpires: Date,
          interests: [string],
          bio: string,
          college: string,
          year: string,
          profilePicture: string,
          isActive: boolean,
          lastLogin: Date,
          createdAt: Date,
          updatedAt: Date
        }
```

---

## Ports

| Service      | Port  | URL                       |
| ------------ | ----- | ------------------------- |
| Frontend Dev | 5173  | http://localhost:5173     |
| Backend API  | 5000  | http://localhost:5000     |
| MongoDB      | 27017 | mongodb://localhost:27017 |

---

## Important: What Needs Your Action

1. **Google OAuth Credentials**

   - Location to enter: Backend `.env` and Frontend `.env`
   - Variables: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

2. **Gmail Credentials**

   - Location to enter: Backend `.env`
   - Variables: `EMAIL_USER`, `EMAIL_PASSWORD`

3. **MongoDB Connection**

   - Location to enter: Backend `.env`
   - Variable: `MONGODB_URI`

4. **JWT Secret**
   - Location to enter: Backend `.env`
   - Variable: `JWT_SECRET` (32+ character random string)

---

## File Sizes

| File               | Size       | Status |
| ------------------ | ---------- | ------ |
| SignIn.jsx         | 230 lines  | ✅     |
| Login.jsx          | 225 lines  | ✅     |
| GoogleCallback.jsx | 110 lines  | ✅     |
| authService.js     | 256 lines  | ✅     |
| User.js            | 250+ lines | ✅     |
| authController.js  | 250+ lines | ✅     |
| auth.js routes     | 120 lines  | ✅     |
| server.js          | 80 lines   | ✅     |

---

## All Systems Status

| System           | Status   | Files   |
| ---------------- | -------- | ------- |
| Frontend UI      | ✅ Ready | 3 pages |
| Frontend Service | ✅ Ready | 1 file  |
| Frontend Router  | ✅ Ready | 1 file  |
| Backend Server   | ✅ Ready | 1 file  |
| Database Model   | ✅ Ready | 1 file  |
| Auth Logic       | ✅ Ready | 1 file  |
| API Routes       | ✅ Ready | 1 file  |
| Middleware       | ✅ Ready | 2 files |
| OAuth Config     | ✅ Ready | 1 file  |
| Email Service    | ✅ Ready | 1 file  |
| Documentation    | ✅ Ready | 3 files |

---

**Everything is in place! Start with GETTING_STARTED.md**
