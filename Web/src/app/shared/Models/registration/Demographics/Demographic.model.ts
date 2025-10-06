
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
  EmiratesIDN: string;
  primarycarephysicianPcp: number;
  causeofDeath?: string;
  DeathDate?: Date;
  BillingNote: string;
  VIPPatient: boolean;
  Pregnant: boolean;
  AdvDirective: boolean;
  DrugHistConsent: boolean;
  ExemptReporting: boolean;
}


export interface Contact {
  streetName?: string;
  countryId?: number;
  stateId?: number;
  cityId?: number;
  postalCode?: string;
  cellPhone?: string;
  homePhone?: string;
  workPhone?: string;
  dwellingNumber?: string;
  fax?: string;
  email?: string;
  tabsTypeId?: number
  
}


export interface NextOfKin {
  relationshipId?: number,
  firstName?: string,
  middleName?: string,
  lastName?: string,
  streetName?: string,
  email?: string,
  countryId?:number,
  stateId?:number,
  cityId?:number,
  postalCode?:number,
  cellPhone?:number,
  homePhone?:number,
  workPhone?:number,
  TabsTypeId?:number,
}


export interface Parent {
  firstName?: string,
  middleName?: string,
  lastName?: string,
  homePhone?: number,
  cellPhone?: number,
  email?: string,
  motherFirstName?: string,
  mothermiddleName?: string,
  motherLastName?: string,
  motherHomePhone?: number,
  motherCellPhone?: number,
  motherEmail?: string,
  TabsTypeId?: number,
}

export interface Assignments {
  proofOfIncome?: string;
  providerId?: number;
  feeScheduleId?: number;
  financialClassId?: number;
  locationId?: number;
  siteId?: number;
  signedDate?: Date;
  unsignedDate?: Date;
  entityTypeId?: number;
  entityNameId?: number;
  referredById?: number;
  TabsTypeId?: number;
}


export interface FamilyMembers {
  mrNo?: number;
  accountTypeId?: number;
  masterMrNo?: number;
  relationshipId?: number;
  TabsTypeId?: number;
}