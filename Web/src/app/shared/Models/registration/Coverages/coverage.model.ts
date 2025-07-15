export interface InsuranceSubscriberDTO {
  subscriberID: number;
  carrierId: number;
  insuredIDNo: string;
  insuranceTypeCode: string;
  insuredGroupOrPolicyNo: string;
  insuredGroupOrPolicyName: string;
  companyOrIndividual: number;
  copay: number;
  suffix: string;
  firstName: string;
  middleName: string;
  lastName: string;
  birthDate: Date;
  sex: string;
  insuredPhone: string;
  otherPhone: string;
  address1: string;
  address2: string;
  zipCode: string;
  cityId: number;
  stateId: number;
  countryId: number;
  inactive: boolean;
  enteredBy: string;
  verified: boolean;
  chkDeductible: boolean;
  deductibles: number | null;
  dnDeductible: number | null;
  opCopay: number | null;
  mrNo: string | null;
  coverageOrder: number | null;
  isSelected: boolean | null;

}
