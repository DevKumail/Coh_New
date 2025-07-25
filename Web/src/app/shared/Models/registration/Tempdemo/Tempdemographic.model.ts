export interface TempdemographicDto {

  tempId?: number;
  personTitleId?: number;
  personNationalityId?: number;
  personFirstName: string;
  personMiddleName?: string;
  personLastName?: string;
  personSex?: string;
  personAge?: number;
  personCellPhone?: string;
  personAddress1?: string;
  personAddress2?: string;
  personCountryId?: number;
  personStateId?: number;
  personCityId?: number;
  personZipCode?: string;
  personHomePhone1?: string;
  personWorkPhone1?: string;
  personEmail?: string;

  nokFirstName?: string;
  nokMiddleName?: string;
  nokLastName?: string;
  nokRelationshipId?: number;
  nokHomePhone?: string;
  nokWorkPhone?: string;
  nokCellNo?: string;
  nokSocialSecurityNo?: string;
  nokAddress1?: string;
  nokAddress2?: string;
  nokCountryId?: number;
  nokStateId?: number;
  nokCityId?: number;
  nokZipCode?: string;

  streetNumber?: string;
  dwellingNumber?: string;
  comments?: string;
  createdBy?: string;
  updatedBy?: string;
  active?: boolean;
  patientBirthDate: string;
}
