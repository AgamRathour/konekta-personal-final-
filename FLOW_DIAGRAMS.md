# 📊 SYSTEM FLOW DIAGRAM

## 🔄 Complete Auth & Profile Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    KONEKTA AUTHENTICATION FLOW                       │
└─────────────────────────────────────────────────────────────────────┘

                              LANDING PAGE
                                  │
                                  ▼
                          ┌─────────────────┐
                          │  Login Button   │
                          └────────┬────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │ Enter Email Address  │
                        │ (e.g., user@test)   │
                        └──────────┬───────────┘
                                   │
                                   ▼
                        ╔═══════════════════════╗
                        ║  BACKEND CHECKS:      ║
                        ║ Does user exist?      ║
                        ╚═════════╤═════════════╝
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
             YES (EXISTS)              NO (NEW USER)
                    │                           │
                    ▼                           ▼
        ┌─────────────────────┐    ┌──────────────────────┐
        │ Load existing user  │    │ Create new user      │
        │ isNewUser = false   │    │ isNewUser = true     │
        └──────────┬──────────┘    └──────────┬───────────┘
                   │                          │
                   ▼                          ▼
        ┌─────────────────────┐    ┌──────────────────────┐
        │ Return to Frontend  │    │ Return to Frontend   │
        │ isNewUser=false     │    │ isNewUser=true       │
        └──────────┬──────────┘    └──────────┬───────────┘
                   │                          │
                   ▼                          ▼
        ┌─────────────────────┐    ┌──────────────────────┐
        │ SKIP ONBOARDING    │    │ SHOW ONBOARDING      │
        │ Go to /profile      │    │ Page 1: Interests    │
        │                     │    │ Page 2: Bio          │
        │                     │    │ Page 3: Frequency    │
        └──────────┬──────────┘    └──────────┬───────────┘
                   │                          │
                   ▼                          ▼
        ┌─────────────────────┐    ┌──────────────────────┐
        │ HOME FEED / PROFILE │    │ /profile-setup page  │
        │                     │    │ Setup username       │
        │                     │    │ Add profile pic      │
        │                     │    │ Add bio              │
        │                     │    │ Select more interests│
        └─────────────────────┘    └──────────┬───────────┘
                                              │
                                              ▼
                                   ┌──────────────────────┐
                                   │ Mark user as:        │
                                   │ isNewUser = false    │
                                   │ (Send to backend)    │
                                   └──────────┬───────────┘
                                              │
                                              ▼
                                   ┌──────────────────────┐
                                   │ HOME FEED / PROFILE  │
                                   └──────────────────────┘
```

---

## 🔐 Profile Isolation System

```
┌─────────────────────────────────────────────────────────────────────┐
│              PROFILE ISOLATION BY EMAIL (UNIQUE KEY)                │
└─────────────────────────────────────────────────────────────────────┘

                          DATABASE
                    ┌──────────────────┐
                    │  users.json      │
                    ├──────────────────┤
                    │ [                │
                    │  {               │
                    │  id: "1",        │
   User A ────────→ │  email:          │
   user.a@test      │    "user.a@test",│ ← UNIQUE
                    │  firstName:      │
                    │    "User",       │
                    │  lastName: "A",  │
                    │  bio: "I'm A",   │
                    │  interests: []   │
                    │  },              │
                    │  {               │
                    │  id: "2",        │
   User B ────────→ │  email:          │
   user.b@test      │    "user.b@test",│ ← UNIQUE
                    │  firstName:      │
                    │    "User",       │
                    │  lastName: "B",  │
                    │  bio: "I'm B",   │
                    │  interests: []   │
                    │  }               │
                    │ ]                │
                    └──────────────────┘

LOGIN FLOW:
    
    User A logins with "user.a@test"
         ↓
    Backend: WHERE email = "user.a@test" 
    Returns: User A's full profile
         ↓
    Frontend: localStorage = User A's data
         ↓
    Profile Page: Shows ONLY User A's info
    (Can't access User B's data)
    
    ---
    
    User B logins with "user.b@test"
         ↓
    Backend: WHERE email = "user.b@test"
    Returns: User B's full profile
         ↓
    Frontend: localStorage = User B's data
         ↓
    Profile Page: Shows ONLY User B's info
    (Can't access User A's data)

ISOLATION GUARANTEES:
    ✅ Each email is unique in database
    ✅ Login queries by email (guaranteed unique result)
    ✅ Frontend stores only current user's email
    ✅ Frontend can only see logged-in user's profile
    ✅ No cross-user data access possible
```

---

## 📱 Frontend State Management

```
┌─────────────────────────────────────────────────────────────────────┐
│           FRONTEND localStorage (Current User Storage)               │
└─────────────────────────────────────────────────────────────────────┘

When User A logs in:
┌─────────────────────────────────────────┐
│ localStorage.setItem({                  │
│   "konekta_user": {                     │
│     id: "1",                            │
│     email: "user.a@test",  ← KEY!       │
│     firstName: "User",                  │
│     lastName: "A",                      │
│     bio: "I'm User A",                  │
│     interests: ["Music", "Gaming"],     │
│     isNewUser: false,                   │
│     ...                                 │
│   }                                     │
│ })                                      │
└─────────────────────────────────────────┘

When User B logs in:
┌─────────────────────────────────────────┐
│ localStorage.setItem({                  │
│   "konekta_user": {                     │
│     id: "2",                            │
│     email: "user.b@test",  ← DIFFERENT! │
│     firstName: "User",                  │
│     lastName: "B",                      │
│     bio: "I'm User B",                  │
│     interests: ["Sports"],              │
│     isNewUser: false,                   │
│     ...                                 │
│   }                                     │
│ })                                      │
└─────────────────────────────────────────┘

PROFILE PAGE ALWAYS SHOWS:
    let currentUser = JSON.parse(
      localStorage.getItem("konekta_user")
    )
    
    Show profile of: currentUser.email
    ↓
    User A sees: user.a@test profile
    User B sees: user.b@test profile
    No confusion! ✅
```

---

## 🎯 Email Validation Rules

```
┌─────────────────────────────────────────────────────────────────────┐
│                  NEW EMAIL VALIDATION RULES                          │
└─────────────────────────────────────────────────────────────────────┘

Rule: email.includes("@") AND email.length > 5

VALID ✅                    INVALID ❌
────────────────────────────────────────────
a@test (6 chars)            a@b (5 chars)
user@test (9 chars)         a@ (2 chars)
x@y.com (7 chars)           test (no @)
alice@bob (9 chars)         abcd (no @)
anything@anything (18)      @test (no prefix)
x@x (3 chars) ❌            
                           
MINIMUM: 6 characters with @ symbol
Examples:
    ✅ a@test
    ✅ abc@def
    ✅ user123@anything
    ✅ any.email@domain
    
    ❌ abcd (needs @)
    ❌ a@b (too short)
    ❌ text (needs @)
```

---

## 🔄 isNewUser Flag Behavior

```
┌─────────────────────────────────────────────────────────────────────┐
│                    isNewUser FLAG TRACKING                           │
└─────────────────────────────────────────────────────────────────────┘

Timeline for User A (user.a@test):

TIME 1 - First Login:
    Backend: CREATE user
    ┌──────────────────┐
    │ isNewUser: true  │ ← Signals "show onboarding"
    └──────────────────┘
    ↓
    Frontend: Receive isNewUser=true
    ↓
    Redirect to: /onboarding
    
TIME 2 - Complete Onboarding:
    Frontend: Save profile + mark as done
    Backend: UPDATE user
    ┌──────────────────────┐
    │ isNewUser: false     │ ← "Onboarding complete"
    │ interests: [selected]│
    └──────────────────────┘
    ↓
    Redirect to: /profile-setup or /feed
    
TIME 3 - Second Login (same email):
    Backend: LOAD user
    ┌──────────────────────┐
    │ isNewUser: false     │ ← "Don't show onboarding"
    │ interests: [saved]   │
    │ bio: [saved]         │
    └──────────────────────┘
    ↓
    Frontend: Receive isNewUser=false
    ↓
    Skip onboarding, go directly to: /profile
    
TIME 4 - Subsequent Logins:
    Same as TIME 3
    Always: isNewUser=false (once set)
    Always: Skip onboarding
    Always: Show saved profile
```

---

## 🎬 Scene-by-Scene Example

```
┌─────────────────────────────────────────────────────────────────────┐
│           COMPLETE EXAMPLE: USER A & USER B SEPARATE PROFILES       │
└─────────────────────────────────────────────────────────────────────┘

SCENE 1: Create User A
─────────────────────
Alice: Opens app → Clicks Login
Alice: Types "alice@test"
Backend: User not found → Create alice@test (isNewUser=true)
Alice: Sees Onboarding
Alice: Selects: Music, Gaming
Alice: Sets username: alice_cool
Alice: Sets bio: "Love music!"
Backend: Update alice@test (isNewUser=false)
Alice: Lands on /profile
Alice: Sees profile:
    ├─ Username: alice_cool
    ├─ Bio: Love music!
    ├─ Interests: [Music, Gaming]
    └─ Posts: (none yet)

SCENE 2: Create User B (Different Email)
─────────────────────────────────────────
Bob: Opens app (different window) → Clicks Login
Bob: Types "bob@test"
Backend: User not found → Create bob@test (isNewUser=true)
Bob: Sees Onboarding
Bob: Selects: Sports, Travel
Bob: Sets username: bob_athlete
Bob: Sets bio: "Adventurer!"
Backend: Update bob@test (isNewUser=false)
Bob: Lands on /profile
Bob: Sees profile:
    ├─ Username: bob_athlete
    ├─ Bio: Adventurer!
    ├─ Interests: [Sports, Travel]
    └─ Posts: (none yet)

ISOLATION VERIFICATION:
─────────────────────
✅ Alice can't see Bob's profile (different email)
✅ Bob can't see Alice's profile (different email)
✅ Each has their own data

SCENE 3: Alice Logs Back In
──────────────────────────
Alice: Logs out
Alice: Clicks Login
Alice: Types "alice@test"
Backend: User found → Load alice@test (isNewUser=false)
Alice: SKIPS Onboarding
Alice: Directly to /profile
Alice: Sees saved profile:
    ├─ Username: alice_cool
    ├─ Bio: Love music!
    ├─ Interests: [Music, Gaming]
    └─ (Same data as before)

✅ No re-onboarding
✅ Saved data intact
✅ Seamless experience
```

---

## ✨ Key Points Summary

```
┌─────────────────────────────────────────────────────────────────────┐
│                        KEY GUARANTEES                                │
└─────────────────────────────────────────────────────────────────────┘

1. PROFILE ISOLATION
   ✅ Email is unique key in database
   ✅ Login queries by email (guaranteed single result)
   ✅ Frontend stores only current user's email
   ✅ Two different emails = Two completely separate profiles
   ✅ NO WAY to access another user's profile

2. FIRST-TIME ONBOARDING ONLY
   ✅ New user gets isNewUser=true
   ✅ After onboarding: isNewUser=false
   ✅ Never shows onboarding again
   ✅ Can't accidentally re-onboard

3. FLEXIBLE EMAIL
   ✅ Just need @ symbol
   ✅ Just need 6+ characters
   ✅ No strict domain validation
   ✅ Examples: user@test, a@b, anything@anything

4. DATA PERSISTENCE
   ✅ Logout & login with same email
   ✅ All saved data appears
   ✅ No data loss

5. NO OTP/VERIFICATION
   ✅ Direct access after login
   ✅ No email verification codes
   ✅ Simple & fast
```

This is your complete visual guide! Print it if helpful! 🎉
