# 🎬 STEP-BY-STEP WALKTHROUGH & VISUAL GUIDE

## 📺 Complete Visual Walkthrough

### SETUP PHASE (5 minutes)

#### Step 1: Open Terminal 1
```
Location: c:\Users\LOQ\Desktop\DESKTOP\konekta-personal-final-\konekta-backend
Command: npm run dev
Expected: "Server running on http://localhost:5000"
```

#### Step 2: Open Terminal 2 (New Terminal Window)
```
Location: c:\Users\LOQ\Desktop\DESKTOP\konekta-personal-final-\Konekta
Command: npm run dev
Expected: "Local: http://localhost:5173"
```

#### Step 3: Open Browser
```
URL: http://localhost:5173
Expected: See Konekta landing page with "Login" button
```

---

## 🧪 TEST SCENARIO 1: NEW USER JOURNEY (10 minutes)

### Expected Screens:

```
Screen 1: Landing Page
┌─────────────────────────────────┐
│  KONEKTA                        │
│                                 │
│  [Login Button] [Sign Up Button]│
└─────────────────────────────────┘

Click: [Login Button]
↓
↓

Screen 2: Login Page
┌─────────────────────────────────┐
│  Welcome Back                   │
│                                 │
│  Email: [____________]          │
│         ▼ (no errors)           │
│                                 │
│  [Login Button]                 │
└─────────────────────────────────┘

Enter: testuser@test
Click: [Login Button]
↓
↓

Screen 3: Onboarding - Step 1
┌─────────────────────────────────┐
│  What are you interested in?    │
│                                 │
│  [ ] Music     [ ] Gaming       │
│  [ ] Sports    [ ] Photography  │
│  [ ] Art       [ ] Tech         │
│  [etc...]                       │
│                                 │
│  [Back] [Next] [Skip]           │
└─────────────────────────────────┘

✅ Select at least 2 interests
Click: [Next]
↓
↓

Screen 4: Onboarding - Step 2
┌─────────────────────────────────┐
│  Tell us about yourself         │
│                                 │
│  Username: [____________]       │
│  Bio: [_____________________]   │
│                                 │
│  [Back] [Next] [Skip]           │
└─────────────────────────────────┘

✅ Fill in username and bio (optional)
Click: [Next]
↓
↓

Screen 5: Onboarding - Step 3
┌─────────────────────────────────┐
│  How will you use Konekta?      │
│                                 │
│  ○ Casual User                  │
│  ● Regular User                 │
│  ○ Very Active                  │
│                                 │
│  [Back] [Continue]              │
└─────────────────────────────────┘

✅ Select frequency (auto-selected)
Click: [Continue]
↓
↓

Screen 6: Profile Setup
┌─────────────────────────────────┐
│  Complete Your Profile          │
│                                 │
│  Username: testuser             │
│  Full Name: [____________]      │
│  College: [____________]        │
│  Year: [____]                   │
│                                 │
│  [Save Profile]                 │
└─────────────────────────────────┘

✅ Fill in details
Click: [Save Profile]
↓
↓

Screen 7: Home Feed / Profile (SUCCESS! ✅)
┌─────────────────────────────────┐
│  ✅ SUCCESSFULLY CREATED PROFILE│
│                                 │
│  Your Profile:                  │
│  Username: testuser             │
│  Email: testuser@test           │
│  Interests: [selected ones]     │
│                                 │
│  [Posts feed here]              │
└─────────────────────────────────┘

✅ TEST 1 PASSED: New user created successfully
✅ Saw onboarding (because isNewUser=true)
✅ Profile created
✅ Landing on home feed
```

---

## 🔄 TEST SCENARIO 2: RETURNING USER (5 minutes)

### Expected Flow:

```
Current State: Already logged in as testuser@test

Action: Click [Logout]
↓

Screen 1: Back to Landing Page
┌─────────────────────────────────┐
│  KONEKTA                        │
│  (logged out)                   │
│  [Login Button]                 │
└─────────────────────────────────┘

Click: [Login Button]
↓
↓

Screen 2: Login Page
┌─────────────────────────────────┐
│  Welcome Back                   │
│  Email: [____________]          │
└─────────────────────────────────┘

Enter: testuser@test (SAME EMAIL)
Click: [Login Button]
↓
↓

⚠️ IMPORTANT: What happens next?

EXPECTED BEHAVIOR:
┌─────────────────────────────────┐
│  ✅ SKIPS ONBOARDING            │
│  ✅ Goes directly to PROFILE    │
│  ✅ Shows saved data            │
└─────────────────────────────────┘

ACTUAL SCREEN:
┌─────────────────────────────────┐
│  Your Profile                   │
│  Username: testuser             │
│  Email: testuser@test           │
│  Interests: [saved from before] │
│  Bio: [saved from before]       │
│                                 │
│  [Posts]                        │
└─────────────────────────────────┘

✅ TEST 2 PASSED:
  ✅ Did NOT show onboarding
  ✅ Went directly to profile
  ✅ Saved data intact
  ✅ No confusion!
```

---

## 👥 TEST SCENARIO 3: MULTIPLE USERS (Isolation Test) (10 minutes)

### Expected Behavior:

```
Current: Logged in as testuser@test

Action: Click [Logout]
↓

Action: Click [Login]
Enter: anotheruser@test (DIFFERENT EMAIL)
↓

Screen: Onboarding (appears because NEW user)
↓
✅ Completes onboarding with different interests

Screen: Profile Setup
↓
✅ Sets username: anotheruser_cool
✅ Sets different interests: [Sports, Travel]
↓

Result Profile:
┌─────────────────────────────────┐
│  Profile for anotheruser@test   │
│  Username: anotheruser_cool     │
│  Interests: [Sports, Travel]    │
│  Email: anotheruser@test        │
│                                 │
│  ✅ DIFFERENT from testuser    │
│  ✅ No mixed data              │
│  ✅ Complete isolation         │
└─────────────────────────────────┘

KEY VERIFICATION:
┌─────────────────────────────────┐
│ ✅ Logged in as: anotheruser@test
│ ✅ NOT seeing: testuser's data
│ ✅ Profile shows: anotheruser data
│ ✅ Interests: [Sports, Travel]
│ ✅ NO CONFUSION!
└─────────────────────────────────┘

Switch back to testuser:
Action: Logout
Action: Login with: testuser@test
↓

Result:
┌─────────────────────────────────┐
│ ✅ Back to testuser's profile
│ ✅ Still has original interests
│ ✅ Still has original username
│ ✅ COMPLETE ISOLATION WORKS!
└─────────────────────────────────┘

✅ TEST 3 PASSED: Profile isolation guaranteed
```

---

## 🔐 TEST SCENARIO 4: Email Validation (5 minutes)

### Test Valid Emails:

```
Test 1: user@test
┌─────────────────────────────────┐
│  Email: [user@test________]     │
│                                 │
│  ✅ GREEN - Valid email         │
│  ✅ Allows submission            │
└─────────────────────────────────┘

Test 2: a@b
┌─────────────────────────────────┐
│  Email: [a@b____________]       │
│  ❌ RED - Too short (3 chars)   │
│                                 │
│  Minimum: 6 characters         │
└─────────────────────────────────┘

Test 3: abc@def
┌─────────────────────────────────┐
│  Email: [abc@def_______]        │
│                                 │
│  ✅ GREEN - Valid (6 chars)      │
│  ✅ Allows submission            │
└─────────────────────────────────┘
```

### Test Invalid Emails:

```
Test 1: abcd (no @)
┌─────────────────────────────────┐
│  Email: [abcd__________]        │
│  ❌ RED - Invalid email format  │
│                                 │
│  Must contain: @               │
└─────────────────────────────────┘

Test 2: test (no @)
┌─────────────────────────────────┐
│  Email: [test__________]        │
│  ❌ RED - Invalid email format  │
│                                 │
│  Must contain: @               │
└─────────────────────────────────┘

Test 3: @domain (missing prefix)
┌─────────────────────────────────┐
│  Email: [@domain_______]        │
│  ❌ RED - Too short             │
│                                 │
│  Minimum: 6 characters         │
└─────────────────────────────────┘

✅ TEST 4 PASSED: Email validation working correctly
```

---

## 📱 UI/UX Verification Checklist

### During Tests:

- [ ] **Theme Toggle Works**
  - Click sun/moon icon in corner
  - Dark mode ↔ Light mode
  - Should persist on reload

- [ ] **Error Messages Display**
  - Try invalid email
  - Should see red error message
  - Clear when user fixes

- [ ] **Loading States**
  - Submit form
  - Should see loading spinner
  - Then success/error

- [ ] **Navigation**
  - "Back" buttons work
  - Redirects happen correctly
  - URL changes appropriately

- [ ] **Form Validation**
  - Empty fields show errors
  - Valid input clears errors
  - Submit blocked until valid

---

## 🔍 Developer Console Checks

### Open Developer Tools: F12

### Check Network Tab:
```
Monitor API calls:
- POST /api/auth/login
  Should return: { user: {..., isNewUser: true/false} }
  
Look for:
✅ 201/200 status (success)
✅ user object with email
✅ isNewUser flag
❌ Avoid 404, 500 errors
```

### Check Console Tab:
```
Should NOT see:
❌ Red error messages
❌ Failed to fetch
❌ Undefined is not a function

Should see:
✅ Clean console
✅ Maybe some warnings (ok)
✅ Login/logout messages (optional)
```

### Check localStorage:
```
F12 → Application → Local Storage → localhost:5173

Should contain:
✅ konekta_user: { email, firstName, lastName, isNewUser, ... }
✅ konekta_isLoggedIn: "true"
✅ konekta_theme: "dark" or "light"

Verify:
✅ konekta_user.email matches logged-in user
✅ konekta_user.isNewUser = false for returning user
✅ konekta_user.isNewUser = true for new user
```

---

## ⏱️ Estimated Total Test Time

| Scenario | Duration | Status |
|----------|----------|--------|
| Setup | 5 min | Quick |
| Test 1 (New User) | 10 min | Complete |
| Test 2 (Returning User) | 5 min | Quick |
| Test 3 (Multiple Users) | 10 min | Complete |
| Test 4 (Email Validation) | 5 min | Quick |
| Console Checks | 5 min | Technical |
| **TOTAL** | **40 min** | ✅ Complete |

---

## ✅ Final Verification

After all tests, check:

- [ ] New users see onboarding
- [ ] Returning users skip onboarding
- [ ] Different emails = different profiles
- [ ] Email validation works correctly
- [ ] No errors in console
- [ ] No errors in backend terminal
- [ ] Data persists after logout/login
- [ ] Theme preference saves

---

## 🚨 If Something Goes Wrong

### Symptom 1: "User not found" error
```
Cause: Backend not running
Solution: Start backend in Terminal 1
  cd konekta-backend
  npm run dev
```

### Symptom 2: Blank white page
```
Cause: Frontend not loading
Solution: Check Terminal 2 for errors
  npm run dev should show no errors
  Try http://localhost:5173
```

### Symptom 3: Shows onboarding every login
```
Cause: isNewUser flag not updating
Solution: Check onboarding saves isNewUser=false
  Check browser console for API errors
  Check backend terminal for errors
```

### Symptom 4: Different user seeing same profile
```
Cause: localStorage not clearing
Solution: Clear browser data
  F12 → Application → Clear Storage → Clear All
  Then logout and login again
```

---

## 🎉 Success Criteria

**You'll know everything is working when:**

✅ First login → Shows onboarding  
✅ Second login with same email → Skips onboarding  
✅ Different email → Shows different profile  
✅ Email validation accepts `user@test` format  
✅ Email validation rejects `abcd` format  
✅ No error messages in console  
✅ Backend shows user creation logs  
✅ Data persists after logout/login  

---

**You're ready to test!** 🚀

Start the servers, follow the scenarios above, and verify everything works.

**Enjoy!** 🎉
