export interface PatientProblemModel {
  id: number;
   providerName?: string;
   icd9code: string;
  appointmentId?: number;
  icdVersionValue: string;
 activeStatus: number;
  icd9: string;
  icd9description: string;
  comments: string;
  providerId?: number;
  startDate: Date;
  endDate?: Date;
  status: number;
  active: boolean;
  updatedBy: number;
  updatedDate: Date;
  mrno: string;
  createdBy?: number;
  createdDate: Date;
  diagnosisPriority: string;
  diagnosisType: string;
  socialHistory?: boolean;
  outsideClinic: string;
  confidential: boolean;
  isHl7msgCreated?: boolean;
  isMedicalHistory?: boolean;
  caseId?: null; // Guid in .NET → string in Angular
  errorReason: string;
  oldMrno: string;
  icdversionId: number;
  isDeleted: boolean;
  patientId?: number;
  startstrdate: string;
  endstrdate: string;
  providerDescription: string;
  code?: string;
}
