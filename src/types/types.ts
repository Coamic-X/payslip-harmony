
export interface PayslipFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface Company {
  id: string;
  name: string;
  color: string;
  payslips: PayslipFile[];
  createdAt: string;
}
