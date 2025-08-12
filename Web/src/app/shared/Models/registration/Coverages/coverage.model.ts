export interface InsuranceSubscriberDTO {
  SubscriberID?: number;
  CarrierId: number;
  InsuredIDNo: string;
  InsuranceTypeCode: string;
  InsuredGroupOrPolicyNo: string;
  InsuredGroupOrPolicyName: string;
  CompanyOrIndividual: number;
  Copay: number;
  Suffix: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  BirthDate: string;
  Sex: string;
  InsuredPhone: string;
  OtherPhone?: string;
  Address1: string;
  Address2?: string;
  ZipCode: string;
  CityId: number;
  StateId: number;
  CountryId: number;
  Inactive: boolean;
  EnteredBy: string;
  Verified?: boolean;
  ChkDeductible?: boolean;
  Deductibles: number;
  DNDeductible: number;
  OpCopay: number;
  MRNo?: string;
  CoverageOrder?: number;
  IsSelected?: boolean;
  PayerPackageId?: number;

  policyList?: any[];
}
export interface PolicyDTO {
  effectiveDate: string;
  terminationDate: string;
  groupNo: string;
  noOfVisits: number;
  amount: number;
  status: string;
}
export interface CoverageResponse {
  table1: {
    type: string;
    subscriberName: string;
    payerName: string;
    memberId: string;
    plan: string;
    terminationDate: string;
    careerAddress: string;
    relationCode: string;
    priority: number;
  }}
