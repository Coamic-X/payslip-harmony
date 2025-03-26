
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { InfoIcon, FileText } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import CompanyList from '@/components/company/CompanyList';
import AddCompanyDialog from '@/components/company/AddCompanyDialog';
import { Company } from '@/types/types';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc,
  updateDoc 
} from 'firebase/firestore';
import { db } from '../config/firebase';

const Index = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Load data from Firestore when component mounts or user changes
  useEffect(() => {
    const fetchCompanies = async () => {
      if (!user) {
        setCompanies([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const companiesRef = collection(db, 'companies');
        const q = query(companiesRef, where('userId', '==', user.id));
        const querySnapshot = await getDocs(q);
        
        const fetchedCompanies: Company[] = [];
        querySnapshot.forEach((doc) => {
          fetchedCompanies.push(doc.data() as Company);
        });
        
        setCompanies(fetchedCompanies);
      } catch (error) {
        console.error('Error fetching companies:', error);
        toast.error('Failed to load companies');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompanies();
  }, [user]);
  
  const handleAddCompany = async (company: Company) => {
    if (!user) return;
    
    try {
      // Add userId field to company
      const companyWithUser = {
        ...company,
        userId: user.id
      };
      
      // Add to Firestore
      await setDoc(doc(db, 'companies', company.id), companyWithUser);
      
      // Update local state
      setCompanies(prevCompanies => [...prevCompanies, companyWithUser]);
      toast.success(`${company.name} has been added`);
    } catch (error) {
      console.error('Error adding company:', error);
      toast.error('Failed to add company');
    }
  };
  
  const handleUpdateCompany = async (updatedCompany: Company) => {
    if (!user) return;
    
    try {
      // Update in Firestore
      await updateDoc(doc(db, 'companies', updatedCompany.id), updatedCompany);
      
      // Update local state
      setCompanies(prevCompanies => 
        prevCompanies.map(company => 
          company.id === updatedCompany.id ? updatedCompany : company
        )
      );
    } catch (error) {
      console.error('Error updating company:', error);
      toast.error('Failed to update company');
    }
  };
  
  const handleRemoveCompany = async (companyId: string) => {
    if (!user) return;
    
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'companies', companyId));
      
      // Update local state
      setCompanies(prevCompanies => 
        prevCompanies.filter(company => company.id !== companyId)
      );
    } catch (error) {
      console.error('Error removing company:', error);
      toast.error('Failed to remove company');
    }
  };
  
  const handleUpdateCompanies = async (updatedCompanies: Company[]) => {
    if (!user) return;
    
    try {
      // We would need to batch update these in Firestore
      // This is a simplified implementation
      setCompanies(updatedCompanies);
    } catch (error) {
      console.error('Error updating companies:', error);
      toast.error('Failed to update companies');
    }
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
      
      {loading ? (
        <div className="text-center py-16">
          <p>Loading companies...</p>
        </div>
      ) : companies.length > 0 ? (
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
            <p>Data is stored securely in Firebase</p>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Index;
