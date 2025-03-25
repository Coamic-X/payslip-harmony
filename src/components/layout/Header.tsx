
import React from 'react';
import { FileText } from 'lucide-react';
import ThemeToggle from '../theme/ThemeToggle';
import AuthDialog from '../auth/AuthDialog';

const Header = () => {
  return (
    <header className="py-6 px-8 flex justify-between items-center glass sticky top-0 z-10">
      <div className="flex items-center gap-2.5">
        <div className="bg-primary w-10 h-10 rounded-lg flex items-center justify-center shadow-md animate-float">
          <FileText className="text-white h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-medium leading-none">Payslip Manager</h1>
          <p className="text-sm text-muted-foreground">Manage payslips across multiple companies</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <AuthDialog />
      </div>
    </header>
  );
};

export default Header;
