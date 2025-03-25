
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Trash2 } from 'lucide-react';
import { PayslipFile } from '@/types/types';
import { format } from 'date-fns';

interface PayslipPreviewDialogProps {
  payslip: PayslipFile;
  onClose: () => void;
  onDelete: () => void;
}

const PayslipPreviewDialog: React.FC<PayslipPreviewDialogProps> = ({ 
  payslip, 
  onClose,
  onDelete
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = payslip.url;
    a.download = payslip.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-lg">{payslip.name}</DialogTitle>
          <div className="text-sm text-muted-foreground">
            Uploaded on {format(new Date(payslip.uploadedAt), 'PPpp')} • {formatFileSize(payslip.size)}
          </div>
        </DialogHeader>
        
        <div className="mt-2 h-[60vh] border rounded-lg overflow-hidden bg-muted/50">
          <iframe 
            src={`${payslip.url}#toolbar=0`} 
            className="w-full h-full"
            title={payslip.name}
          />
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button 
            variant="destructive" 
            onClick={onDelete}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Payslip
          </Button>
          
          <div className="flex gap-3">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            
            <Button onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PayslipPreviewDialog;
