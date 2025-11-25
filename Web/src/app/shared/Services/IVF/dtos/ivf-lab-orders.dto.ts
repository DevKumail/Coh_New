export interface IvfLabOrderHeaderDto {
  // Required (commonly used)
  mrNo: number;
  providerId: number;
  orderDate: string; // ISO string
  visitAccountNo: number;
  createdBy: number;
  createdDate: string; // ISO string
  orderControlCode: string; // e.g. 'NW'
  orderStatus: string; // e.g. 'NEW'
  isHL7MsgCreated: boolean;
  isHL7MessageGeneratedForPhilips: boolean;
  isSigned: boolean;

  // Optional/extended
  orderSetId?: number;
  updatedBy?: number;
  updatedDate?: string; // ISO string
  oldMRNo?: string | null;
  hL7MessageId?: number | null;
}

export interface IvfLabOrderDetailDto {
  // Required (commonly used)
  labTestId: number;
  cptCode: string;
  orderQuantity: number;
  investigationTypeId: number;
  billOnOrder: number;

  // Optional/extended
  sampleTypeId?: number | null;
  orderSetDetailId?: number;
  orderSetId?: number;
  pComments?: string;
  sendToLabId?: string | number | null;
  isRadiologyTest?: number;
  isInternalTest?: boolean;
  radiologySide?: string | null;
  profileLabTestID?: number | null;
  visitOrderNo?: number | null;
  resultExpectedDate?: string | null; // ISO or date string
  referralName?: string | null;
  referralId?: number | null;
  signedDate?: string | null;
  referralTo?: string | null;
  cancelComments?: string | null;
  oldOrderDetailId?: number | null;
  rescheduledTo?: string | null;
  isDeleted?: boolean;
  collectDate?: string | null;
  status?: string | null;
  performDate?: string | null;
}

export interface IvfCreateLabOrderDto {
  header: IvfLabOrderHeaderDto;
  details: IvfLabOrderDetailDto[];
}
