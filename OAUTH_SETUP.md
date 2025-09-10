# OAuth Setup Guide - Cosmic Journal

This guide walks you through setting up OAuth authentication for Google, Facebook, and Apple in your Cosmic Journal application using PocketBase.

## 🔧 **Prerequisites**

- PocketBase server running
- Admin access to PocketBase admin panel
- Developer accounts for each OAuth provider

## 📋 **OAuth Providers Setup**

### **1. Google OAuth Setup**

#### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API

#### Step 2: Configure OAuth Consent Screen

1. Navigate to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in required information:
   - App name: "Cosmic Journal"
   - User support email: Your email
   - Developer contact: Your email
4. Add scopes: `email`, `profile`, `openid`
5. Add test users (for development)

#### Step 3: Create OAuth Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Application type: "Web application"
4. Name: "Cosmic Journal Web Client"
5. Authorized redirect URIs:
   - `http://127.0.0.1:8090/api/oauth2/google/callback` (development)
   - `https://yourdomain.com/api/oauth2/google/callback` (production)
6. Copy Client ID and Client Secret

#### Step 4: Configure in PocketBase

1. Open PocketBase Admin Panel (`http://127.0.0.1:8090/_/`)
2. Go to Settings > Auth providers
3. Enable Google provider
4. Enter:
   - Client ID: Your Google Client ID
   - Client Secret: Your Google Client Secret
   - Redirect URL: `http://127.0.0.1:8090/api/oauth2/google/callback`

---

### **2. Facebook OAuth Setup**

#### Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "Create App"
3. Choose "Consumer" app type
4. Fill in app details:
   - App name: "Cosmic Journal"
   - App contact email: Your email
   - App purpose: "Other"

#### Step 2: Configure Facebook Login

1. In your app dashboard, go to "Products" > "Facebook Login"
2. Click "Set Up" on Facebook Login
3. Choose "Web" platform
4. Site URL: `http://127.0.0.1:8090` (development)
5. Valid OAuth Redirect URIs:
   - `http://127.0.0.1:8090/api/oauth2/facebook/callback`

#### Step 3: Get App Credentials

1. Go to Settings > Basic
2. Copy App ID and App Secret
3. Add your domain to "App Domains"

#### Step 4: Configure in PocketBase

1. Open PocketBase Admin Panel
2. Go to Settings > Auth providers
3. Enable Facebook provider
4. Enter:
   - Client ID: Your Facebook App ID
   - Client Secret: Your Facebook App Secret
   - Redirect URL: `http://127.0.0.1:8090/api/oauth2/facebook/callback`

---

### **3. Apple OAuth Setup**

#### Step 1: Create Apple Developer Account

1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Sign in with Apple ID
3. Enroll in Apple Developer Program ($99/year)

#### Step 2: Create App ID

1. Go to "Certificates, Identifiers & Profiles"
2. Click "Identifiers" > "+" > "App IDs"
3. Choose "App" type
4. Description: "Cosmic Journal"
5. Bundle ID: `com.yourcompany.cosmicjournal`
6. Enable "Sign In with Apple" capability

#### Step 3: Create Service ID

1. Go to "Identifiers" > "+" > "Services IDs"
2. Description: "Cosmic Journal Web"
3. Identifier: `com.yourcompany.cosmicjournal.web`
4. Enable "Sign In with Apple"
5. Configure domains:
   - Primary App ID: Select your App ID
   - Domains: `127.0.0.1` (development), `yourdomain.com` (production)
   - Return URLs: `http://127.0.0.1:8090/api/oauth2/apple/callback`

#### Step 4: Create Private Key

1. Go to "Keys" > "+"
2. Key Name: "Cosmic Journal Sign In Key"
3. Enable "Sign In with Apple"
4. Configure: Select your App ID
5. Download the .p8 file
6. Note the Key ID

#### Step 5: Generate Client Secret

Use this Node.js script to generate the client secret:

```javascript
const jwt = require("jsonwebtoken");
const fs = require("fs");

const teamId = "YOUR_TEAM_ID"; // Found in Apple Developer Account
const keyId = "YOUR_KEY_ID"; // From step 4
const privateKey = fs.readFileSync("path/to/your/key.p8");

const token = jwt.sign(
  {
    iss: teamId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400 * 180, // 6 months
    aud: "https://appleid.apple.com",
    sub: "com.yourcompany.cosmicjournal.web", // Your Service ID
  },
  privateKey,
  {
    algorithm: "ES256",
    keyid: keyId,
  }
);

console.log("Client Secret:", token);
```

#### Step 6: Configure in PocketBase

1. Open PocketBase Admin Panel
2. Go to Settings > Auth providers
3. Enable Apple provider
4. Enter:
   - Client ID: Your Service ID (`com.yourcompany.cosmicjournal.web`)
   - Client Secret: Generated JWT token
   - Redirect URL: `http://127.0.0.1:8090/api/oauth2/apple/callback`

---

## 🔄 **OAuth Flow Explanation**

### **How OAuth Works in Your App**

1. **User Clicks OAuth Button**: User clicks "Login with Google/Facebook/Apple"
2. **Redirect to Provider**: User is redirected to the OAuth provider's login page
3. **User Authorizes**: User logs in and authorizes your app
4. **Callback to PocketBase**: Provider redirects back to PocketBase with authorization code
5. **Token Exchange**: PocketBase exchanges code for access token
6. **User Creation/Login**: PocketBase creates or logs in the user
7. **Redirect to App**: User is redirected back to your app (`/auth/callback`)
8. **Update Context**: Auth context is updated with user data
9. **Redirect to Dashboard**: User is redirected to the dashboard

### **Code Flow**

```typescript
// 1. User clicks OAuth button
const handleGoogleLogin = async () => {
  await loginWithGoogle(); // Redirects to Google
};

// 2. PocketBase handles OAuth flow
// 3. User returns to /auth/callback
// 4. Callback page processes the result
// 5. User is redirected to dashboard
```

---

## 🛠 **Environment Variables**

Add these to your `.env.local` file:

```env
# OAuth Configuration (for PocketBase)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

FACEBOOK_CLIENT_ID=your_facebook_app_id_here
FACEBOOK_CLIENT_SECRET=your_facebook_app_secret_here

APPLE_CLIENT_ID=your_apple_service_id_here
APPLE_CLIENT_SECRET=your_apple_private_key_here
```

**Note**: These are configured in PocketBase, not directly in your Next.js app.

---

## 🧪 **Testing OAuth**

### **Development Testing**

1. Start PocketBase: `./pocketbase serve`
2. Start Next.js: `npm run dev`
3. Go to `http://localhost:3000/login`
4. Click OAuth buttons to test

### **Production Testing**

1. Update all redirect URLs to use your production domain
2. Test each OAuth provider
3. Verify user data is properly stored in PocketBase

---

## 🔒 **Security Considerations**

### **Redirect URLs**

- Always use HTTPS in production
- Validate redirect URLs in your OAuth provider settings
- Never expose client secrets in frontend code

### **User Data**

- PocketBase automatically handles user creation
- OAuth providers return: email, name, profile picture
- Additional user data can be stored in PocketBase collections

### **Token Management**

- PocketBase handles access token refresh
- Tokens are stored securely in PocketBase
- No need to manage tokens in your frontend

---

## 🐛 **Troubleshooting**

### **Common Issues**

1. **"Invalid redirect URI"**

   - Check redirect URLs in OAuth provider settings
   - Ensure URLs match exactly (including trailing slashes)

2. **"Client ID not found"**

   - Verify client ID in PocketBase settings
   - Check for typos in configuration

3. **"User not created"**

   - Check PocketBase logs for errors
   - Verify OAuth provider is properly configured

4. **"Callback not working"**
   - Ensure `/auth/callback` page exists
   - Check PocketBase redirect URL configuration

### **Debug Steps**

1. Check browser network tab for OAuth requests
2. Check PocketBase logs: `./pocketbase serve --debug`
3. Verify OAuth provider settings
4. Test with different browsers/incognito mode

---

## 📚 **Additional Resources**

- [PocketBase OAuth Documentation](https://pocketbase.io/docs/authentication/#oauth2)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login/web)
- [Apple Sign In Documentation](https://developer.apple.com/sign-in-with-apple/)

---

## ✅ **Verification Checklist**

- [ ] Google OAuth configured and working
- [ ] Facebook OAuth configured and working
- [ ] Apple OAuth configured and working
- [ ] All redirect URLs properly set
- [ ] User data properly stored in PocketBase
- [ ] OAuth buttons working in login form
- [ ] Callback page handling redirects correctly
- [ ] Production URLs updated for deployment

---

**Need Help?** Check the troubleshooting section or refer to the PocketBase documentation for OAuth-specific issues.
