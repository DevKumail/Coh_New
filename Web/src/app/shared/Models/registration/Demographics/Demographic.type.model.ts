import { Assignments, Contact, Demographic, FamilyMembers, NextOfKin, Parent } from './Demographic.model';

export class DemographicDTO implements Demographic {
  PatientPicture?: string;
  practice: string = '';
  MrNo: string = '';
  PersonTitleId: number = 0;
  PersonFirstName: string = '';
  PersonMiddleName?: string;
  PersonLastName: string = '';
  PersonSexId: number = 0;
  preferredName?: string;
  genderIdentity: number = 0;
  PersonMaritalStatus: number = 0;
  PatientBloodGroupId: number = 0;
  PatientBirthDate: Date = new Date();
  Age: number = 0;
  personSocialSecurityNo: string = '';
  LaborCardNo?: string;
  Religion: number = 0;
  PersonEthnicityTypeId?: number;
  Nationality: number = 0;
  PrimaryLanguage?: number;
  PersonPassportNo?: string;
  PersonDriversLicenseNo?: string; 
  MediaChannelId?: number;
  MediaItemId?: number;
  ResidenceVisaNo?: string;
  EmiratesIDN!: string;
  primarycarephysicianPcp: number = 0;
  causeofDeath?: string;
  deathDate?: Date;
  BillingNote: string = '';
  VIPPatient: boolean = false;
  Pregnant: boolean = false;
  AdvDirective: boolean = false;
  DrugHistConsent: boolean = false;
  ExemptReporting: boolean = false;
  CreatedDate?: Date;
  ModifiedDate?: Date;
  CreatedBy?: string;
  ModifiedBy?: string;
  ContactNumber: string = '';
  Email?: string;
  AddressLine1?: string;
  AddressLine2?: string;
  CityId?: number;
  StateId?: number;
  CountryId?: number;
  ZipCode?: string;
  Contact?: ContactDTO;
  Employment?: any;
  EmergencyContact?: any;
  NextOfKin?: any;
  Spouse?: any;
  Parent?: any;
  Assignments?: any;
  FamilyMembers?: any;
  regPatientEmployer?: any;
  regAccount?: any;

}

export class ContactDTO implements Contact {
  streetName?: string;
  dwellingNumber?: string;
  countryId?: number;
  stateId?: number;
  cityId?: number;
  postalCode?: string;
  cellPhone?: string;
  homePhone?: string;
  workPhone?: string;
  fax?: string;
  email?: string;
  tabsTypeId?: number
}
export class NextOfKinDTO implements NextOfKin {
  relationshipId?: number;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  streetName?: string;
  email?: string;
  countryId?:number;
  stateId?:number;
  cityId?:number;
  postalCode?:number;
  cellPhone?:number;
  homePhone?:number;
  workPhone?:number;
  TabsTypeId?:number;
}
export class ParentDTO implements Parent {

  firstName?: string;
  middleName?: string;
  lastName?: string;
  homePhone?: number;
  cellPhone?: number;
  email?: string;
  motherFirstName?: string;
  mothermiddleName?: string;
  motherLastName?: string;
  motherHomePhone?: number;
  motherCellPhone?: number;
  motherEmail?: string; 
  TabsTypeId?: number;
}

export class AssignmentsDTO implements Assignments {

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
  tabsTypeId?: number;
}

export class FamilyMembersDTO implements FamilyMembers {
  mrNo?: number;
  accountTypeId?: number;
  masterMrNo?: number;
  relationshipId?: number;
  TabsTypeId?: number;
}
