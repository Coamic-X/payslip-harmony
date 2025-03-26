
# Firebase Setup Instructions

This application uses Firebase for authentication and database functionality. To set it up properly, follow these steps:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication with Email/Password as the sign-in method
4. Create a Firestore database in production mode
5. Get your Firebase configuration values:
   - Click on Project Settings (gear icon)
   - Scroll down to "Your apps" section and select the web app (or create one)
   - Copy the configuration object

6. Replace the placeholder values in `src/config/firebase.ts` with your actual Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

7. Update Firestore security rules in the Firebase console:
   - Go to Firestore Database
   - Click on the "Rules" tab
   - Replace the default rules with the following:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /companies/{companyId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

These rules ensure that:
- Users can only access their own user documents
- Authenticated users can read and write to company documents

8. Click "Publish" to apply the new security rules

# Cloudinary Setup Instructions

This application uses Cloudinary for image and PDF storage. The app is configured with the following settings:

- Cloud name: dbpqkfw2x
- API key: 695637838557724
- API Secret: bYVJdeUK-7JrFtHxq8I9QyVimkg

To ensure Cloudinary uploads work properly, you'll need to:

1. Create an upload preset in your Cloudinary Dashboard:
   - Go to Settings > Upload
   - Scroll down to "Upload presets"
   - Create a new unsigned upload preset named "mz92r9oz" or use an existing one
   - If you create a custom preset, update the `uploadPreset` value in `src/config/cloudinary.ts`
   - Make sure to set the preset to "Unsigned" mode for frontend uploads

2. Configure CORS settings in your Cloudinary account:
   - Go to Settings > Security
   - In the CORS section, add your application domain (or * for testing)
   - Make sure to allow the following HTTP methods: GET, POST, PUT

If you want to use your own Cloudinary account instead:

1. Create a Cloudinary account at [Cloudinary](https://cloudinary.com/)
2. Go to your Cloudinary Dashboard
3. Get your Cloud name, API key, and API secret
4. Create an unsigned upload preset from the Settings > Upload section
5. Update the configuration in `src/config/cloudinary.ts`:

```typescript
export const cloudinaryConfig = {
  cloudName: 'YOUR_CLOUD_NAME',
  apiKey: 'YOUR_API_KEY',
  apiSecret: 'YOUR_API_SECRET',
  uploadPreset: 'YOUR_UPLOAD_PRESET', 
};
```

6. Update your CORS settings to allow uploads from your domain
