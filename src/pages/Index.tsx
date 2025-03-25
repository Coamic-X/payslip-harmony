
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { InfoIcon, FileText } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import CompanyList from '@/components/company/CompanyList';
import AddCompanyDialog from '@/components/company/AddCompanyDialog';
import { Company } from '@/types/types';

const STORAGE_KEY = 'payslip-manager-data';

const Index = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  
  // Load data from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        setCompanies(JSON.parse(savedData));
      } catch (error) {
        console.error('Failed to parse saved data:', error);
        // If parsing fails, reset to default state
        setCompanies([]);
      }
    }
  }, []);
  
  // Save data to localStorage whenever companies change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
  }, [companies]);
  
  const handleAddCompany = (company: Company) => {
    setCompanies(prevCompanies => [...prevCompanies, company]);
    toast.success(`${company.name} has been added`);
  };
  
  const handleUpdateCompany = (updatedCompany: Company) => {
    setCompanies(prevCompanies => 
      prevCompanies.map(company => 
        company.id === updatedCompany.id ? updatedCompany : company
      )
    );
  };
  
  const handleRemoveCompany = (companyId: string) => {
    setCompanies(prevCompanies => 
      prevCompanies.filter(company => company.id !== companyId)
    );
  };
  
  const handleUpdateCompanies = (updatedCompanies: Company[]) => {
    setCompanies(updatedCompanies);
  };
  
  return (
    <MainLayout>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-medium">My Companies</h2>
          <p className="text-muted-foreground">Manage payslips for multiple companies</p>
        </div>
        
        <AddCompanyDialog onAddCompany={handleAddCompany} />
      </div>
      
      {companies.length > 0 ? (
        <CompanyList 
          companies={companies} 
          onUpdateCompanies={handleUpdateCompanies}
          onUpdateCompany={handleUpdateCompany}
          onRemoveCompany={handleRemoveCompany}
        />
      ) : (
        <div className="text-center py-16 px-6 border border-dashed rounded-2xl bg-muted/40 animate-fade-in">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-medium mb-2">No companies added yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Add your first company to get started with organizing and managing your payslips.
          </p>
          <AddCompanyDialog onAddCompany={handleAddCompany} />
          
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <InfoIcon className="h-4 w-4" />
            <p>Data is stored locally in your browser</p>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Index;
