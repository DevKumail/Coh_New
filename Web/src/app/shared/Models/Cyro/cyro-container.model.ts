// Cryo Level C
export interface CryoLevelCDto {
  ID?: number;
  LevelBID?: number;
  StrawPosition: number;
  SampleID?: number;
  Status?: string; // Default "Available"
  CreatedBy?: number;
  UpdatedBy?: number;
  CreatedAt?: string | Date;
  UpdatedAt?: string | Date;
}

// Cryo Level B
export interface CryoLevelBDto {
  ID?: number;
  LevelAID?: number;
  CaneCode: string;
  CreatedBy?: number;
  UpdatedBy?: number;
  CreatedAt?: string | Date;
  UpdatedAt?: string | Date;
  LevelC?: CryoLevelCDto[];
}

// Cryo Level A
export interface CryoLevelADto {
  ID?: number;
  ContainerID?: number;
  CanisterCode: string;
  CreatedBy?: number;
  UpdatedBy?: number;
  CreatedAt?: string | Date;
  UpdatedAt?: string | Date;
  LevelB?: CryoLevelBDto[];
}

// Cryo Container
export interface CryoContainerDto {
  ID?: number;
  FacilityID: number;
  Description: string;
  LastAudit?: string;
  MaxStrawsInLastLevel?: number;
  IsSperm: boolean;
  IsOocyteOrEmb?: boolean; 
  CreatedBy?: number;
  UpdatedBy?: number;
  CreatedAt?: string | Date;
  UpdatedAt?: string | Date;
  LevelA?: CryoLevelADto[];
}


export interface CryoContainerResultDto {
  id?: number;
  facilityId: number;
  description: string;
  isSperm: boolean;
  isOocyteOrEmb?: boolean;
  lastAudit?: string;
  maxStrawsInLastLevel?: number;
  createdBy?: number;
  updatedBy?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  levelA?: CryoLevelADto[];
}
