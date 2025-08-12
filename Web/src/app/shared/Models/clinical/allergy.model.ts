export interface AllergyDto {
//   allergyType: number;
allergyid?: number;
  typeId?: number;
  reaction: string;
  startDate?: string;   // ISO format (e.g. '2025-07-25')
  endDate?: string;
  status: number;
  active: boolean;
  updatedBy?: number;
  updatedDate?: string;
  providerId?: number;
  mrno: string;
  createdBy?: number;
  createdDate?: string;
  severityCode?: number;
  allergen: string;
  isHl7msgCreated?: boolean;
  reviewedDate?: string;
  reviewedBy?: string;
  errorReason?: string;
  oldMrno?: string;
  isDeleted?: boolean;
  appointmentId?: number;
  providerDescription?: string;
}
