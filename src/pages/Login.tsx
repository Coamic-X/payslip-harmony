
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import MainLayout from '@/components/layout/MainLayout';
import { FileText } from 'lucide-react';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <MainLayout>
      <div className="max-w-md mx-auto py-12">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="bg-primary w-16 h-16 rounded-xl flex items-center justify-center shadow-lg mb-6">
            <FileText className="text-white h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold">Payslip Manager</h1>
          <p className="text-muted-foreground mt-2">Manage your payslips securely</p>
        </div>

        <div className="border rounded-lg p-6 shadow-sm">
          {mode === 'login' ? (
            <LoginForm onRegisterClick={() => setMode('register')} />
          ) : (
            <RegisterForm onLoginClick={() => setMode('login')} />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
