
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';
import { Company } from '@/types/types';

interface AddCompanyDialogProps {
  onAddCompany: (company: Company) => void;
}

// Company color options
const colorOptions = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#6366F1", // Indigo
  "#F97316", // Orange
];

const AddCompanyDialog: React.FC<AddCompanyDialogProps> = ({ onAddCompany }) => {
  const [companyName, setCompanyName] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [open, setOpen] = useState(false);

  const handleAddCompany = () => {
    if (companyName.trim()) {
      const newCompany: Company = {
        id: uuidv4(),
        name: companyName.trim(),
        color: selectedColor,
        payslips: [],
        createdAt: new Date().toISOString()
      };
      
      onAddCompany(newCompany);
      setCompanyName('');
      setSelectedColor(colorOptions[0]);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 pr-6">
          <PlusCircle className="h-4 w-4" />
          Add Company
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a new company</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="company-name">Company name</Label>
            <Input
              id="company-name"
              placeholder="Enter company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="col-span-3"
              autoComplete="off"
            />
          </div>
          <div className="grid gap-2">
            <Label>Company color</Label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <div
                  key={color}
                  className={`w-8 h-8 rounded-full cursor-pointer transition-all hover:scale-110 ${
                    selectedColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            onClick={handleAddCompany} 
            disabled={!companyName.trim()}
          >
            Add Company
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCompanyDialog;
