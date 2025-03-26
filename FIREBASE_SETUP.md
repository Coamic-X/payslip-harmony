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

This application uses Cloudinary for image storage. The app is already configured with the following settings:

- Cloud name: dbpqkfw2x
- API key: 695637838557724

If you want to use your own Cloudinary account:

1. Create a Cloudinary account at [Cloudinary](https://cloudinary.com/)
2. Go to your Cloudinary Dashboard
3. Get your Cloud name, API key, and API secret
4. Update the configuration in `src/config/cloudinary.ts`:

```typescript
export const cloudinary = new Cloudinary({
  cloud: {
    cloudName: 'YOUR_CLOUD_NAME',
  },
  url: {
    secure: true,
  },
});
```

5. Update the upload URL in `src/components/upload/FileUploader.tsx`:

```typescript
const response = await fetch(`https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/upload`, {
  // ... keep the rest of the code
});
```

6. Create an upload preset in your Cloudinary Dashboard:
   - Go to Settings > Upload
   - Scroll down to "Upload presets"
   - Create a new unsigned upload preset or use the default "ml_default"
