
export interface Demographic {
  PatientPicture?: string;
  practice?: string;
  MrNo?: string;
  PersonTitleId: number;
  PersonFirstName: string;
  PersonMiddleName?: string;
  PersonLastName: string;
  PersonSexId: number;
  preferredName?: string;
  genderIdentity: number;
  PersonMaritalStatus: number;
  PatientBloodGroupId: number;
  PatientBirthDate: Date;
  Age?: number;
  personSocialSecurityNo: string;
  LaborCardNo?: string;
  Religion?: number;
  PersonEthnicityTypeId?: number;
  Nationality: number;
  PrimaryLanguage?: number;
  PersonPassportNo?: string;
  PersonDriversLicenseNo?: string;
  MediaChannelId?: number;
  MediaItemId?: number;
  ResidenceVisaNo?: string;
  EmiratesIDN: number;
  primarycarephysicianPcp: number;
  causeofDeath?: string;
  DeathDate?: Date;
  BillingNote: string;
  isVIP: boolean;
  isPregnant?: boolean;
  isDirective?: boolean;
  isDrugHist?: boolean;
  isExpReporting?: boolean;
}


export interface Contact {
  CellPhone?: string;
  HomePhone?: string;
  
}




