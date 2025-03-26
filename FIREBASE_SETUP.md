
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

