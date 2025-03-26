
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import { Upload, FileWarning, AlertCircle, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PayslipFile } from '@/types/types';
import { toast } from 'sonner';

interface FileUploaderProps {
  onUploadComplete: (files: PayslipFile[]) => void;
  companyName: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUploadComplete, companyName }) => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const uploadToCloudinary = async (file: File): Promise<string> => {
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default'); // Use 'ml_default' or create a custom unsigned upload preset in Cloudinary
    formData.append('folder', `payslips/${companyName}`);
    
    try {
      // Upload to Cloudinary using their upload API
      const response = await fetch(`https://api.cloudinary.com/v1_1/dbpqkfw2x/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      // Return the secure URL of the uploaded file
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  };
  
  const processFiles = useCallback(async (acceptedFiles: File[]) => {
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
    
    try {
      const totalFiles = pdfFiles.length;
      const payslipFiles: PayslipFile[] = [];
      
      for (let i = 0; i < pdfFiles.length; i++) {
        const file = pdfFiles[i];
        
        // Update progress based on current file index
        setUploadProgress(Math.round((i / totalFiles) * 90));
        
        // Upload file to Cloudinary
        const cloudinaryUrl = await uploadToCloudinary(file);
        
        // Create PayslipFile object with Cloudinary URL
        const payslipFile: PayslipFile = {
          id: uuidv4(),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
          url: cloudinaryUrl
        };
        
        payslipFiles.push(payslipFile);
      }
      
      // Finalize progress
      setUploadProgress(100);
      
      // Pass the created PayslipFile objects to the parent component
      onUploadComplete(payslipFiles);
      
      // Reset the uploader state
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    } catch (error) {
      console.error('Upload error:', error);
      setError('An error occurred during upload. Please try again.');
      setIsUploading(false);
      toast.error('Failed to upload files. Please try again.');
    }
  }, [onUploadComplete, companyName]);
  
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
              <p className="text-sm font-medium">Uploading payslips to Cloudinary...</p>
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
