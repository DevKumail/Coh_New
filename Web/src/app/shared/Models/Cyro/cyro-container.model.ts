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
  Type: string; // Sperm / Ooc/Emb
  LastAudit?: string;
  MaxStrawsInLastLevel?: number;
  CreatedBy?: number;
  UpdatedBy?: number;
  CreatedAt?: string | Date;
  UpdatedAt?: string | Date;
  LevelA?: CryoLevelADto[];
}
