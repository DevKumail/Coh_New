import { Contact, Demographic } from './Demographic.model';

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
  EmiratesIDN: number = 0;
  primarycarephysicianPcp: number = 0;
  causeofDeath?: string;
  deathDate?: Date;
  BillingNote: string = '';
  isVIP: boolean = false;
  isPregnant: boolean = false;
  isDirective: boolean = false;
  isDrugHist: boolean = false;
  isExpReporting: boolean = false;
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
  Contact ?:ContactDTO;

}


export class ContactDTO implements Contact {
  CellPhone?: string;
  HomePhone?: string;
}
