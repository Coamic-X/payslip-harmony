
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string | null;
  name: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  const login = async (email: string, password: string): Promise<void> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      if (firebaseUser) {
        toast.success(`Welcome back, ${firebaseUser.displayName || 'User'}!`);
      }
    } catch (error: any) {
      console.error('Login error:', error.message);
      let errorMessage = 'An error occurred during sign in';
      
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        errorMessage = 'Invalid email or password';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later';
      }
      
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };
  
  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Update profile with name
      await updateProfile(firebaseUser, {
        displayName: name
      });
      
      // Create a user document in Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        uid: firebaseUser.uid,
        email: email,
        name: name,
        createdAt: new Date().toISOString()
      });
      
      toast.success(`Welcome, ${name}!`);
    } catch (error: any) {
      console.error('Registration error:', error.message);
      let errorMessage = 'An error occurred during registration';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already in use';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }
      
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };
  
  const logout = async () => {
    try {
      await signOut(auth);
      toast.info('You have been logged out');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
