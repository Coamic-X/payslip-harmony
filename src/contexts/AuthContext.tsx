
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple mock database for demo purposes
const USERS_STORAGE_KEY = 'payslip-manager-users';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Check for saved session on mount
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    
    // Initialize users array if it doesn't exist
    if (!localStorage.getItem(USERS_STORAGE_KEY)) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
    }
  }, []);
  
  const getUsers = (): { id: string; email: string; name: string; password: string }[] => {
    try {
      return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    } catch (error) {
      console.error('Failed to parse users:', error);
      return [];
    }
  };
  
  const login = async (email: string, password: string): Promise<void> => {
    // Simple mock authentication
    const users = getUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      toast.success(`Welcome back, ${foundUser.name}!`);
    } else {
      toast.error('Invalid email or password');
      throw new Error('Invalid email or password');
    }
  };
  
  const register = async (name: string, email: string, password: string): Promise<void> => {
    const users = getUsers();
    
    // Check if email already exists
    if (users.some(u => u.email === email)) {
      toast.error('Email already in use');
      throw new Error('Email already in use');
    }
    
    // Create new user
    const newUser = {
      id: crypto.randomUUID(),
      email,
      name,
      password
    };
    
    // Save user to "database"
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([...users, newUser]));
    
    // Log in the new user
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    
    toast.success(`Welcome, ${name}!`);
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    toast.info('You have been logged out');
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
