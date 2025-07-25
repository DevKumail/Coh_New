export interface vitalsingsDto {
  ID?: number;
  MRNo: string;
  VisitAccountNo?: number;
  EntryDate: string | Date;
  UpdateDate: string | Date;
  AgeInMonths?: number;
  UpdateBy?: string;
  BPSystolic?: number;
  BPDiastolic?: number;
  BPArm?: number;
  PulseRate?: number;
  HeartRate?: number;
  RespirationRate?: number;
  Temperature?: number;
  Weight?: number;
  Height?: number;
  BMI?: number;
  SPO2?: number;
  Glucose?: number;
  Comment?: string;
  AppointmentId?: number;
}


