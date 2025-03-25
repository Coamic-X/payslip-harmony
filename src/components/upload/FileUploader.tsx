
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import { Upload, FileWarning, AlertCircle, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PayslipFile } from '@/types/types';

interface FileUploaderProps {
  onUploadComplete: (files: PayslipFile[]) => void;
  companyName: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUploadComplete, companyName }) => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const processFiles = useCallback((acceptedFiles: File[]) => {
    setError(null);
    
    // Filter for PDF files only
    const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length === 0) {
      setError('Only PDF files are allowed.');
      return;
    }
    
    if (acceptedFiles.length !== pdfFiles.length) {
      setError('Some files were skipped. Only PDF files are allowed.');
    }
    
    setIsUploading(true);
    
    // Simulate upload process
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Create PayslipFile objects from the accepted files
        const payslipFiles: PayslipFile[] = pdfFiles.map(file => ({
          id: uuidv4(),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
          // In a real app, you would upload to a server and get a URL
          // Here we're creating an Object URL for demo purposes
          url: URL.createObjectURL(file)
        }));
        
        // Pass the created PayslipFile objects to the parent component
        onUploadComplete(payslipFiles);
        
        // Reset the uploader state
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
        }, 500);
      }
    }, 100);
  }, [onUploadComplete]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: processFiles,
    accept: {
      'application/pdf': ['.pdf']
    },
    disabled: isUploading,
    multiple: true
  });
  
  return (
    <div>
      {error && (
        <Alert variant="destructive" className="mb-4 animate-fade-in">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer text-center
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/20 hover:border-primary/40'}
          ${isUploading ? 'opacity-70 pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-2">
          {isUploading ? (
            <>
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <p className="text-sm font-medium">Uploading payslips...</p>
            </>
          ) : (
            <>
              {isDragActive ? (
                <>
                  <Upload className="h-10 w-10 text-primary animate-bounce" />
                  <p className="text-sm font-medium">Drop the files here</p>
                </>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground/70" />
                  <div>
                    <p className="text-sm font-medium">Drag and drop payslip files here</p>
                    <p className="text-xs text-muted-foreground mt-1">or click to browse (PDF only)</p>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        
        {isUploading && (
          <div className="mt-4 upload-progress-animation">
            <Progress value={uploadProgress} className="h-1.5" />
            <p className="text-xs text-muted-foreground mt-1.5">{uploadProgress}% uploaded</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
