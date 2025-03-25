
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useAuth } from "@/contexts/AuthContext";

type AuthMode = 'login' | 'register';

const AuthDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>('login');
  const { isAuthenticated, logout, user } = useAuth();

  const handleLoginClick = () => setMode('login');
  const handleRegisterClick = () => setMode('register');
  const handleSuccess = () => setIsOpen(false);

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm hidden md:inline">
          Hi, {user.name}
        </span>
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <LogIn className="h-4 w-4" />
          <span className="hidden md:inline">Sign In</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {mode === 'login' ? (
          <LoginForm onSuccess={handleSuccess} onRegisterClick={handleRegisterClick} />
        ) : (
          <RegisterForm onSuccess={handleSuccess} onLoginClick={handleLoginClick} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
