export interface AlertDTO {
  alertId: number;
  mrno: string;
  alertMessage: string;
  repeatDate: Date;
  startDate: Date;
  enteredBy: string;
  enteredDate: Date;
  updatedBy: string;
  alertTypeId: number;
  active: number;
  isDeleted: boolean;
  comments: string;
  hasChild: boolean;
  oldMrno: string | null;
}
