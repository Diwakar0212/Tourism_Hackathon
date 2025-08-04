# 🔧 Environment Setup Guide for SafeSolo

## What is Environment Setup?

Environment setup refers to configuring the **API keys, credentials, and configuration variables** that your SafeSolo platform needs to connect to external services like Firebase, Google Maps, payment processing, etc.

Think of it like giving your app the "passwords" and "addresses" it needs to talk to other services.

## 📋 Quick Setup Checklist

### ✅ **Step 1: Frontend Environment (.env.local)**
1. Copy `.env.example` to `.env.local` in your main project folder
2. Fill in the values from the services below

### ✅ **Step 2: Backend Environment (.env)**
1. Copy `backend/.env.example` to `backend/.env`
2. Fill in the values from the services below

---

## 🔑 Required API Keys & Services

### 1. **Firebase** (Authentication & Database) - **REQUIRED**
**What it does:** User login, registration, and data storage
**How to get it:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing
3. Go to Project Settings > General > Your apps
4. Copy the config values to your `.env.local`

```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

### 2. **Google Maps API** (Location Services) - **IMPORTANT**
**What it does:** Maps, location sharing, directions
**How to get it:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API
3. Create credentials > API Key
4. Add to both frontend and backend env files

```
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...
GOOGLE_MAPS_API_KEY=AIzaSy...
```

### 3. **Stripe** (Payment Processing) - **OPTIONAL**
**What it does:** Handle booking payments securely
**How to get it:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get your test keys from Developers > API Keys
3. Add to env files

```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### 4. **OpenAI** (AI Features) - **OPTIONAL**
**What it does:** AI trip planning and recommendations
**How to get it:**
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create API key
3. Add to backend env

```
OPENAI_API_KEY=sk-...
```

### 5. **Twilio** (SMS Notifications) - **OPTIONAL**
**What it does:** Send SMS alerts for emergencies
**How to get it:**
1. Go to [Twilio Console](https://console.twilio.com/)
2. Get Account SID, Auth Token, and phone number
3. Add to backend env

```
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
```

---

## 🚀 **Minimum Setup to Get Started**

**For basic functionality, you only need:**

1. **Firebase** (for user accounts)
2. **Google Maps** (for location features)

The other services are optional and can be added later!

---

## 📁 **File Structure After Setup**

```
Tourism_Hackathon/
├── .env.local                 ← Frontend environment variables
├── .env.example              ← Template file (don't edit)
└── backend/
    ├── .env                  ← Backend environment variables  
    └── .env.example          ← Template file (don't edit)
```

---

## ⚡ **Quick Start Commands**

After setting up your environment files:

```powershell
# Install backend dependencies
cd backend
npm install

# Start backend server
npm run dev

# In a new terminal, start frontend
cd ..
npm run dev
```

---

## 🔒 **Security Notes**

- ✅ **DO** add `.env` and `.env.local` to `.gitignore`
- ✅ **DO** use test/development keys initially
- ❌ **DON'T** commit API keys to Git
- ❌ **DON'T** share your private keys

---

## 🆘 **Need Help?**

If you're stuck on any service setup:
1. **Firebase:** Most important - focus on this first
2. **Google Maps:** Second priority for location features
3. **Others:** Can be added later as needed

**The app will work with just Firebase + Google Maps configured!**
