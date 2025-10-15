export interface AlertDTO {
  alertId: number;
  ruleId: number;
  mrno: string | null;
  alertMessage: string | null;
  active: boolean;
  repeatDate: Date;
  startDate: Date;
  isFinished: boolean;
  enteredBy: string | null;
  enteredDate: Date;
  updatedBy: string | null;
  updatedDate?: Date | string | null;
  appointmentId: number;
  alertTypeId: number;
  comments: string | null;
  hasChild: boolean;
  oldMrno: string | number | null;
  isDeleted: boolean;
  updateDate: Date;
}
