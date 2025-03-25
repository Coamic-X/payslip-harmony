
import React, { useState } from 'react';
import { Trash2, DownloadCloud, X, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Company, PayslipFile } from '@/types/types';
import FileUploader from '../upload/FileUploader';
import PayslipList from '../payslip/PayslipList';

interface CompanySectionProps {
  company: Company;
  onUpdateCompany: (updatedCompany: Company) => void;
  onRemoveCompany: (companyId: string) => void;
}

const CompanySection: React.FC<CompanySectionProps> = ({ 
  company, 
  onUpdateCompany, 
  onRemoveCompany 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleUploadComplete = (files: PayslipFile[]) => {
    const updatedCompany = {
      ...company,
      payslips: [...company.payslips, ...files]
    };
    onUpdateCompany(updatedCompany);
    toast.success(`${files.length} payslip${files.length > 1 ? 's' : ''} uploaded to ${company.name}`);
  };

  const handleDeletePayslip = (payslipId: string) => {
    const updatedPayslips = company.payslips.filter(p => p.id !== payslipId);
    const updatedCompany = {
      ...company,
      payslips: updatedPayslips
    };
    onUpdateCompany(updatedCompany);
    toast.success(`Payslip removed from ${company.name}`);
  };

  const handleRemoveCompany = () => {
    onRemoveCompany(company.id);
    toast.success(`${company.name} has been removed`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                style={{ backgroundColor: company.color }}
              >
                {company.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-medium text-lg">{company.name}</h3>
                <p className="text-sm text-muted-foreground">{company.payslips.length} payslip{company.payslips.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-label={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDeleteConfirmOpen(true)}
                className="text-muted-foreground hover:text-destructive"
                aria-label="Delete company"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {isDeleteConfirmOpen && (
            <Alert variant="destructive" className="animate-fade-in">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>Are you sure you want to remove {company.name}?</span>
                <div className="flex items-center gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsDeleteConfirmOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleRemoveCompany}
                  >
                    Remove
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          {isExpanded && (
            <div className="space-y-4 animate-slide-in">
              <FileUploader onUploadComplete={handleUploadComplete} companyName={company.name} />
              
              {company.payslips.length > 0 ? (
                <PayslipList payslips={company.payslips} onDeletePayslip={handleDeletePayslip} />
              ) : (
                <div className="text-center py-8 border border-dashed rounded-lg bg-muted/40">
                  <DownloadCloud className="w-10 h-10 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-muted-foreground">No payslips uploaded yet</p>
                  <p className="text-sm text-muted-foreground/70">Upload a PDF file to get started</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default CompanySection;
