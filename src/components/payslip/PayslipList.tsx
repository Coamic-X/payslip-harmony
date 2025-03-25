
import React, { useState } from 'react';
import { 
  MoreVertical, 
  Download, 
  Trash2, 
  FileText, 
  Search, 
  Clock, 
  XCircle 
} from 'lucide-react';
import { format } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PayslipFile } from '@/types/types';
import PayslipPreviewDialog from './PayslipPreviewDialog';

interface PayslipListProps {
  payslips: PayslipFile[];
  onDeletePayslip: (payslipId: string) => void;
}

const PayslipList: React.FC<PayslipListProps> = ({ payslips, onDeletePayslip }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipFile | null>(null);
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const filteredPayslips = payslips.filter(payslip => 
    payslip.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleOpenPreview = (payslip: PayslipFile) => {
    setSelectedPayslip(payslip);
  };
  
  const handleClosePreview = () => {
    setSelectedPayslip(null);
  };
  
  const handleDownload = (payslip: PayslipFile) => {
    // Create an anchor element and set the href to the file URL
    const a = document.createElement('a');
    a.href = payslip.url;
    a.download = payslip.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search payslips..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 max-w-md"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <XCircle className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
          </button>
        )}
      </div>
      
      {filteredPayslips.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPayslips.map((payslip) => (
            <div 
              key={payslip.id} 
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div 
                className="h-24 bg-muted/70 relative flex items-center justify-center cursor-pointer"
                onClick={() => handleOpenPreview(payslip)}
              >
                <FileText className="h-12 w-12 text-muted-foreground/50" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white font-medium">View Payslip</p>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="mr-2">
                    <h4 className="font-medium text-sm truncate" title={payslip.name}>
                      {payslip.name}
                    </h4>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{format(new Date(payslip.uploadedAt), 'PP')}</span>
                      <span className="mx-1">•</span>
                      <span>{formatFileSize(payslip.size)}</span>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleOpenPreview(payslip)}>
                        <Search className="mr-2 h-4 w-4" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload(payslip)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDeletePayslip(payslip.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed rounded-lg bg-muted/40">
          <Search className="w-10 h-10 text-muted-foreground/50 mx-auto mb-2" />
          <p className="text-muted-foreground">
            {searchTerm ? 'No payslips found for your search' : 'No payslips available'}
          </p>
        </div>
      )}
      
      {selectedPayslip && (
        <PayslipPreviewDialog 
          payslip={selectedPayslip} 
          onClose={handleClosePreview} 
          onDelete={() => {
            onDeletePayslip(selectedPayslip.id);
            handleClosePreview();
          }}
        />
      )}
    </div>
  );
};

export default PayslipList;
