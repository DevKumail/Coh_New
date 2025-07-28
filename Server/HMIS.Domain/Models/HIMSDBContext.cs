using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace HMIS.Data.Models
{
    public partial class HIMSDBContext : DbContext
    {
        public HIMSDBContext()
        {
        }

        public HIMSDBContext(DbContextOptions<HIMSDBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Action> Actions { get; set; }
        public virtual DbSet<AlergyType> AlergyTypes { get; set; }
        public virtual DbSet<AuditLog> AuditLogs { get; set; }
        public virtual DbSet<AvailableMrno> AvailableMrnos { get; set; }
        public virtual DbSet<BlEclaimEncounterEndType> BlEclaimEncounterEndTypes { get; set; }
        public virtual DbSet<BlEclaimEncounterStartType> BlEclaimEncounterStartTypes { get; set; }
        public virtual DbSet<BlEclaimEncounterType> BlEclaimEncounterTypes { get; set; }
        public virtual DbSet<BlProceduresGroup> BlProceduresGroups { get; set; }
        public virtual DbSet<Blcptgroup> Blcptgroups { get; set; }
        public virtual DbSet<BlcptgroupCode> BlcptgroupCodes { get; set; }
        public virtual DbSet<BlcptmasterRange> BlcptmasterRanges { get; set; }
        public virtual DbSet<BldentalGroup> BldentalGroups { get; set; }
        public virtual DbSet<BldentalGroupCode> BldentalGroupCodes { get; set; }
        public virtual DbSet<BleligibilityLog> BleligibilityLogs { get; set; }
        public virtual DbSet<Blhcpcsgroup> Blhcpcsgroups { get; set; }
        public virtual DbSet<BlhcpcsgroupCode> BlhcpcsgroupCodes { get; set; }
        public virtual DbSet<Blicd9cmgroup> Blicd9cmgroups { get; set; }
        public virtual DbSet<Blicd9cmgroupCode> Blicd9cmgroupCodes { get; set; }
        public virtual DbSet<Blicdversion> Blicdversions { get; set; }
        public virtual DbSet<BlmasterCpt> BlmasterCpts { get; set; }
        public virtual DbSet<BlmasterDentalCode> BlmasterDentalCodes { get; set; }
        public virtual DbSet<BlmasterHcpc> BlmasterHcpcs { get; set; }
        public virtual DbSet<BlmasterIcd9cm> BlmasterIcd9cms { get; set; }
        public virtual DbSet<BlmasterIrdrg> BlmasterIrdrgs { get; set; }
        public virtual DbSet<BlmasterProcedure> BlmasterProcedures { get; set; }
        public virtual DbSet<BlmasterWeqaya> BlmasterWeqayas { get; set; }
        public virtual DbSet<BlpatientVisit> BlpatientVisits { get; set; }
        public virtual DbSet<Blpayer> Blpayers { get; set; }
        public virtual DbSet<BlpayerPackage> BlpayerPackages { get; set; }
        public virtual DbSet<BlpayerPlan> BlpayerPlans { get; set; }
        public virtual DbSet<BlprocedureGroupCode> BlprocedureGroupCodes { get; set; }
        public virtual DbSet<BlsitePointOfSale> BlsitePointOfSales { get; set; }
        public virtual DbSet<BlsuperBillDiagnosis> BlsuperBillDiagnoses { get; set; }
        public virtual DbSet<BlsuperBillProcedure> BlsuperBillProcedures { get; set; }
        public virtual DbSet<BlsuperBillProcedureInvoice> BlsuperBillProcedureInvoices { get; set; }
        public virtual DbSet<BlunclassifiedCode> BlunclassifiedCodes { get; set; }
        public virtual DbSet<BluniversalToothCode> BluniversalToothCodes { get; set; }
        public virtual DbSet<CacheInfo> CacheInfos { get; set; }
        public virtual DbSet<Case> Cases { get; set; }
        public virtual DbSet<ClinicalUsage> ClinicalUsages { get; set; }
        public virtual DbSet<Consultationcategory> Consultationcategories { get; set; }
        public virtual DbSet<CptbyAppType> CptbyAppTypes { get; set; }
        public virtual DbSet<CptsInCptbyAppType> CptsInCptbyAppTypes { get; set; }
        public virtual DbSet<DeductiblePercent> DeductiblePercents { get; set; }
        public virtual DbSet<EligibilityLog> EligibilityLogs { get; set; }
        public virtual DbSet<EmirateType> EmirateTypes { get; set; }
        public virtual DbSet<Emrfrequency> Emrfrequencies { get; set; }
        public virtual DbSet<EmrnotesEncounterPath> EmrnotesEncounterPaths { get; set; }
        public virtual DbSet<Emrroute> Emrroutes { get; set; }
        public virtual DbSet<Emrsite> Emrsites { get; set; }
        public virtual DbSet<EntityType> EntityTypes { get; set; }
        public virtual DbSet<FamilyProblemList> FamilyProblemLists { get; set; }
        public virtual DbSet<FeeSchedule> FeeSchedules { get; set; }
        public virtual DbSet<FinancialClass> FinancialClasses { get; set; }
        public virtual DbSet<HolidaySchedule> HolidaySchedules { get; set; }
        public virtual DbSet<Hremployee> Hremployees { get; set; }
        public virtual DbSet<HremployeeFacility> HremployeeFacilities { get; set; }
        public virtual DbSet<HremployeeType> HremployeeTypes { get; set; }
        public virtual DbSet<HrlicenseInfo> HrlicenseInfos { get; set; }
        public virtual DbSet<ImmunizationList> ImmunizationLists { get; set; }
        public virtual DbSet<InsuranceCompanyFieldMapping> InsuranceCompanyFieldMappings { get; set; }
        public virtual DbSet<InsuranceEligibility> InsuranceEligibilities { get; set; }
        public virtual DbSet<InsuranceRelation> InsuranceRelations { get; set; }
        public virtual DbSet<InsuranceRequestType> InsuranceRequestTypes { get; set; }
        public virtual DbSet<Insured> Insureds { get; set; }
        public virtual DbSet<InsuredCoverage> InsuredCoverages { get; set; }
        public virtual DbSet<InsuredPolicy> InsuredPolicies { get; set; }
        public virtual DbSet<InsuredSubscriber> InsuredSubscribers { get; set; }
        public virtual DbSet<LabOrderSetDetail> LabOrderSetDetails { get; set; }
        public virtual DbSet<LabTest> LabTests { get; set; }
        public virtual DbSet<Language> Languages { get; set; }
        public virtual DbSet<LoginUserHistory> LoginUserHistories { get; set; }
        public virtual DbSet<MedicationComment> MedicationComments { get; set; }
        public virtual DbSet<Nationality> Nationalities { get; set; }
        public virtual DbSet<Notification> Notifications { get; set; }
        public virtual DbSet<OrderReferral> OrderReferrals { get; set; }
        public virtual DbSet<PatientAlert> PatientAlerts { get; set; }
        public virtual DbSet<PatientAllergy> PatientAllergies { get; set; }
        public virtual DbSet<PatientAllergyDetail> PatientAllergyDetails { get; set; }
        public virtual DbSet<PatientBill> PatientBills { get; set; }
        public virtual DbSet<PatientBillInvoice> PatientBillInvoices { get; set; }
        public virtual DbSet<PatientChartFamilyHistory> PatientChartFamilyHistories { get; set; }
        public virtual DbSet<PatientChartSocialHistory> PatientChartSocialHistories { get; set; }
        public virtual DbSet<PatientImmunization> PatientImmunizations { get; set; }
        public virtual DbSet<PatientNotifiedOption> PatientNotifiedOptions { get; set; }
        public virtual DbSet<PatientProblem> PatientProblems { get; set; }
        public virtual DbSet<PatientProcedure> PatientProcedures { get; set; }
        public virtual DbSet<PatientProcedureType> PatientProcedureTypes { get; set; }
        public virtual DbSet<PatientVisitStatus> PatientVisitStatuses { get; set; }
        public virtual DbSet<PersonalReminder> PersonalReminders { get; set; }
        public virtual DbSet<Prescription> Prescriptions { get; set; }
        public virtual DbSet<ProblemList> ProblemLists { get; set; }
        public virtual DbSet<ProcedureType> ProcedureTypes { get; set; }
        public virtual DbSet<PromotionalMediaChannel> PromotionalMediaChannels { get; set; }
        public virtual DbSet<PromotionalMediaItem> PromotionalMediaItems { get; set; }
        public virtual DbSet<Provider> Providers { get; set; }
        public virtual DbSet<ProviderSchedule> ProviderSchedules { get; set; }
        public virtual DbSet<ProviderScheduleByAppType> ProviderScheduleByAppTypes { get; set; }
        public virtual DbSet<ProviderSpecialty> ProviderSpecialties { get; set; }
        public virtual DbSet<ProviderSpecialtyAssign> ProviderSpecialtyAssigns { get; set; }
        public virtual DbSet<RegAccount> RegAccounts { get; set; }
        public virtual DbSet<RegAlertType> RegAlertTypes { get; set; }
        public virtual DbSet<RegAssignment> RegAssignments { get; set; }
        public virtual DbSet<RegBloodGroup> RegBloodGroups { get; set; }
        public virtual DbSet<RegCity> RegCities { get; set; }
        public virtual DbSet<RegCompany> RegCompanies { get; set; }
        public virtual DbSet<RegCountry> RegCountries { get; set; }
        public virtual DbSet<RegCreditCardType> RegCreditCardTypes { get; set; }
        public virtual DbSet<RegDebitCardType> RegDebitCardTypes { get; set; }
        public virtual DbSet<RegEmploymentStatus> RegEmploymentStatuses { get; set; }
        public virtual DbSet<RegEmploymentType> RegEmploymentTypes { get; set; }
        public virtual DbSet<RegEthnicityType> RegEthnicityTypes { get; set; }
        public virtual DbSet<RegFacility> RegFacilities { get; set; }
        public virtual DbSet<RegGender> RegGenders { get; set; }
        public virtual DbSet<RegGenderIdentity> RegGenderIdentities { get; set; }
        public virtual DbSet<RegLastMrno> RegLastMrnos { get; set; }
        public virtual DbSet<RegLocation> RegLocations { get; set; }
        public virtual DbSet<RegLocationType> RegLocationTypes { get; set; }
        public virtual DbSet<RegMaritalStatus> RegMaritalStatuses { get; set; }
        public virtual DbSet<RegOccupation> RegOccupations { get; set; }
        public virtual DbSet<RegPatient> RegPatients { get; set; }
        public virtual DbSet<RegPatientAddress> RegPatientAddresses { get; set; }
        public virtual DbSet<RegPatientDetail> RegPatientDetails { get; set; }
        public virtual DbSet<RegPatientEmployer> RegPatientEmployers { get; set; }
        public virtual DbSet<RegPatientOld> RegPatientOlds { get; set; }
        public virtual DbSet<RegPatientTabsType> RegPatientTabsTypes { get; set; }
        public virtual DbSet<RegPatientTemp> RegPatientTemps { get; set; }
        public virtual DbSet<RegRelationShip> RegRelationShips { get; set; }
        public virtual DbSet<RegState> RegStates { get; set; }
        public virtual DbSet<RegTitle> RegTitles { get; set; }
        public virtual DbSet<Religion> Religions { get; set; }
        public virtual DbSet<ReschedulingReason> ReschedulingReasons { get; set; }
        public virtual DbSet<SchAppointment> SchAppointments { get; set; }
        public virtual DbSet<SchAppointmentCriterion> SchAppointmentCriteria { get; set; }
        public virtual DbSet<SchAppointmentStatus> SchAppointmentStatuses { get; set; }
        public virtual DbSet<SchAppointmentType> SchAppointmentTypes { get; set; }
        public virtual DbSet<SchBlockTimeslot> SchBlockTimeslots { get; set; }
        public virtual DbSet<SchPatientCall> SchPatientCalls { get; set; }
        public virtual DbSet<SchPatientStatus> SchPatientStatuses { get; set; }
        public virtual DbSet<SecEmployeeRole> SecEmployeeRoles { get; set; }
        public virtual DbSet<SecModule> SecModules { get; set; }
        public virtual DbSet<SecModuleForm> SecModuleForms { get; set; }
        public virtual DbSet<SecPrivilege> SecPrivileges { get; set; }
        public virtual DbSet<SecPrivilegesAssignedRole> SecPrivilegesAssignedRoles { get; set; }
        public virtual DbSet<SecPrivilegesAvailableForm> SecPrivilegesAvailableForms { get; set; }
        public virtual DbSet<SecRole> SecRoles { get; set; }
        public virtual DbSet<SecRoleForm> SecRoleForms { get; set; }
        public virtual DbSet<Servicecategory> Servicecategories { get; set; }
        public virtual DbSet<SeverityType> SeverityTypes { get; set; }
        public virtual DbSet<SocialFamilyHistoryMaster> SocialFamilyHistoryMasters { get; set; }
        public virtual DbSet<SpeechToText> SpeechToTexts { get; set; }
        public virtual DbSet<TabDrugsName> TabDrugsNames { get; set; }
        public virtual DbSet<Task> Tasks { get; set; }
        public virtual DbSet<TaskForwarding> TaskForwardings { get; set; }
        public virtual DbSet<TaskType> TaskTypes { get; set; }
        public virtual DbSet<TestTableType> TestTableTypes { get; set; }
        public virtual DbSet<TypeOfServiceMaster> TypeOfServiceMasters { get; set; }
        public virtual DbSet<VisitStatus> VisitStatuses { get; set; }
        public virtual DbSet<VisitType> VisitTypes { get; set; }
        public virtual DbSet<VitalSign> VitalSigns { get; set; }
        public virtual DbSet<VwAllActivePatient> VwAllActivePatients { get; set; }
        public virtual DbSet<VwGetDurationTimeSlot> VwGetDurationTimeSlots { get; set; }
        public virtual DbSet<VwProviderByFacilityId> VwProviderByFacilityIds { get; set; }
        public virtual DbSet<VwProviderbySiteid> VwProviderbySiteids { get; set; }
        public virtual DbSet<VwRegPatientAndAppointmentdetail> VwRegPatientAndAppointmentdetails { get; set; }
        public virtual DbSet<VwSiteByproviderId> VwSiteByproviderIds { get; set; }
        public virtual DbSet<VwSitebySpecialityid> VwSitebySpecialityids { get; set; }
        public virtual DbSet<VwSpecialityByEmployeeId> VwSpecialityByEmployeeIds { get; set; }
        public virtual DbSet<VwSpecialitybyFacilityid> VwSpecialitybyFacilityids { get; set; }
        public virtual DbSet<Vwprovider> Vwproviders { get; set; }

//        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
//        {
//            if (!optionsBuilder.IsConfigured)
//            {
//#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
//                optionsBuilder.UseSqlServer("Data Source=119.13.190.108;Initial Catalog=HIMSDB;user id=Express;Password=Tekno@2024;Encrypt=False;TrustServerCertificate=True");
//            }
//        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Action>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<AlergyType>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<AuditLog>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Action)
                    .WithMany(p => p.AuditLogs)
                    .HasForeignKey(d => d.ActionId)
                    .HasConstraintName("FK__AuditLog__Action__2DE6D218");

                entity.HasOne(d => d.UserLoginHistory)
                    .WithMany(p => p.AuditLogs)
                    .HasForeignKey(d => d.UserLoginHistoryId)
                    .HasConstraintName("FK__AuditLog__UserLo__32AB8735");
            });

            modelBuilder.Entity<AvailableMrno>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<BlProceduresGroup>(entity =>
            {
                entity.HasKey(e => e.GroupId)
                    .HasName("PK_BL_Group");

                entity.HasOne(d => d.ProcedureType)
                    .WithMany(p => p.BlProceduresGroups)
                    .HasForeignKey(d => d.ProcedureTypeId)
                    .HasConstraintName("FK_BL_Group_Procedure_Type");
            });

            modelBuilder.Entity<Blcptgroup>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<BlcptgroupCode>(entity =>
            {
                entity.HasKey(e => new { e.GroupCodeId, e.GroupId, e.Cptcode })
                    .HasName("PK_BLCPTGroupCode_1");

                entity.Property(e => e.GroupCodeId).ValueGeneratedOnAdd();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Group)
                    .WithMany(p => p.BlcptgroupCodes)
                    .HasForeignKey(d => d.GroupId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_BLCPTGroupCode_BLCPTGroup");
            });

            modelBuilder.Entity<BlcptmasterRange>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.ServiceType)
                    .WithMany(p => p.BlcptmasterRanges)
                    .HasForeignKey(d => d.ServiceTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_BLCPTMasterRanges_TypeOfServiceMaster");
            });

            modelBuilder.Entity<BldentalGroup>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<BldentalGroupCode>(entity =>
            {
                entity.HasKey(e => new { e.GroupCodeId, e.GroupId, e.DentalCode })
                    .HasName("PK_BLDentalGroupCode_1");

                entity.Property(e => e.GroupCodeId).ValueGeneratedOnAdd();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.DentalCodeNavigation)
                    .WithMany(p => p.BldentalGroupCodes)
                    .HasForeignKey(d => d.DentalCode)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_BLDentalGroupCode_BLMasterDentalCodes");

                entity.HasOne(d => d.Group)
                    .WithMany(p => p.BldentalGroupCodes)
                    .HasForeignKey(d => d.GroupId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_BLDentalGroupCode_BLDentalGroup");
            });

            modelBuilder.Entity<BleligibilityLog>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Appointment)
                    .WithMany(p => p.BleligibilityLogs)
                    .HasForeignKey(d => d.AppointmentId)
                    .HasConstraintName("FK_BLEligibilityLog_SchAppointment");
            });

            modelBuilder.Entity<Blhcpcsgroup>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<BlhcpcsgroupCode>(entity =>
            {
                entity.HasKey(e => new { e.GroupCodeId, e.GroupId, e.Hcpcscode });

                entity.Property(e => e.GroupCodeId).ValueGeneratedOnAdd();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Group)
                    .WithMany(p => p.BlhcpcsgroupCodes)
                    .HasForeignKey(d => d.GroupId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_BLHCPCSGroupCode_BLHCPCSGroup");

                entity.HasOne(d => d.HcpcscodeNavigation)
                    .WithMany(p => p.BlhcpcsgroupCodes)
                    .HasForeignKey(d => d.Hcpcscode)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_BLHCPCSGroupCode_BLMasterHCPCS");
            });

            modelBuilder.Entity<Blicd9cmgroup>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<Blicd9cmgroupCode>(entity =>
            {
                entity.HasKey(e => new { e.GroupId, e.Icd9code, e.GroupCodeId });

                entity.Property(e => e.GroupCodeId).ValueGeneratedOnAdd();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Group)
                    .WithMany(p => p.Blicd9cmgroupCodes)
                    .HasForeignKey(d => d.GroupId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_BLICD9CMGroupCode_BLICD9CMGroup");

                entity.HasOne(d => d.Icd9codeNavigation)
                    .WithMany(p => p.Blicd9cmgroupCodes)
                    .HasForeignKey(d => d.Icd9code)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_BLICD9CMGroupCode_BLMasterICD9CM");
            });

            modelBuilder.Entity<Blicdversion>(entity =>
            {
                entity.Property(e => e.IcdversionId).ValueGeneratedNever();

                entity.Property(e => e.Active).HasComment("All Active versions List to show in Charge Capture screen in RadioButtonList or Drop-Down List. active list will be shown to end user for end user selection. Select version select at GUI by default based on DOS check.");

                entity.Property(e => e.DosendDate).HasComment("DOS (Appointment Date) if defined then to apply end date to effect using ICD version. If Null then No Date Check to apply");

                entity.Property(e => e.DosstartDate).HasComment("DOS (Appointment Date) if defined then to apply starting date to effect using ICD version. If Null then No Date Check to apply");

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<BlmasterCpt>(entity =>
            {
                entity.HasKey(e => e.Cptcode)
                    .HasName("PK_CPTCode");

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<BlmasterDentalCode>(entity =>
            {
                entity.HasKey(e => e.DentalCode)
                    .HasName("PK_DentalCode");

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<BlmasterHcpc>(entity =>
            {
                entity.HasKey(e => e.Hcpcscode)
                    .HasName("PK_HCPCSCode");

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<BlmasterIcd9cm>(entity =>
            {
                entity.HasKey(e => e.Icd9code)
                    .HasName("PK_ICD9Code");

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<BlmasterIrdrg>(entity =>
            {
                entity.HasKey(e => e.Irdrgcode)
                    .HasName("PK_IRDRGCode");

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<BlmasterProcedure>(entity =>
            {
                entity.Property(e => e.ItemName).IsFixedLength();

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.BlmasterProcedureCreatedByNavigations)
                    .HasForeignKey(d => d.CreatedBy)
                    .HasConstraintName("FK_Procedures_CreatedBy");

                entity.HasOne(d => d.ProcedureType)
                    .WithMany(p => p.BlmasterProcedures)
                    .HasForeignKey(d => d.ProcedureTypeId)
                    .HasConstraintName("FK_Procedures_Procedures_types");

                entity.HasOne(d => d.UpdatedByNavigation)
                    .WithMany(p => p.BlmasterProcedureUpdatedByNavigations)
                    .HasForeignKey(d => d.UpdatedBy)
                    .HasConstraintName("FK_Procedures_UpdatedBy");
            });

            modelBuilder.Entity<BlmasterWeqaya>(entity =>
            {
                entity.HasKey(e => e.WeqayaId)
                    .HasName("PK_WeqayaId");

                entity.Property(e => e.WeqayaId).ValueGeneratedNever();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<BlpatientVisit>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Appointment)
                    .WithMany(p => p.BlpatientVisits)
                    .HasForeignKey(d => d.AppointmentId)
                    .HasConstraintName("FK_BLPatientVisit_SchAppointment");

                entity.HasOne(d => d.Payer)
                    .WithMany(p => p.BlpatientVisits)
                    .HasForeignKey(d => d.PayerId)
                    .HasConstraintName("FK_BLPatientVisit_BLPayer");

                entity.HasOne(d => d.Subscriber)
                    .WithMany(p => p.BlpatientVisits)
                    .HasForeignKey(d => d.SubscriberId)
                    .HasConstraintName("FK_BLPatientVisit_InsuredSubscriber");
            });

            modelBuilder.Entity<Blpayer>(entity =>
            {
                entity.HasKey(e => e.PayerId)
                    .HasName("PK__BLPayer__0ADBE86737501FF1");

                entity.Property(e => e.PayerId).ValueGeneratedNever();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<BlpayerPackage>(entity =>
            {
                entity.HasKey(e => e.PayerPackageId)
                    .HasName("PK__BLPayerP__8137B82DBA5F70C2");

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Payer)
                    .WithMany(p => p.BlpayerPackages)
                    .HasForeignKey(d => d.PayerId)
                    .HasConstraintName("FK_BLPayerPackage_BLPayer");
            });

            modelBuilder.Entity<BlpayerPlan>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Payer)
                    .WithMany(p => p.BlpayerPlans)
                    .HasForeignKey(d => d.PayerId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_BLPayerPlan_BLPayer");
            });

            modelBuilder.Entity<BlprocedureGroupCode>(entity =>
            {
                entity.HasOne(d => d.Payer)
                    .WithMany(p => p.BlprocedureGroupCodes)
                    .HasForeignKey(d => d.PayerId)
                    .HasConstraintName("FK_BLProcedureGroupCode_ProcedureMasterId");

                entity.HasOne(d => d.ProcedureGroup)
                    .WithMany(p => p.BlprocedureGroupCodes)
                    .HasForeignKey(d => d.ProcedureGroupId)
                    .HasConstraintName("FK_BLProcedureGroupCode_GroupId");

                entity.HasOne(d => d.ProcedureMaster)
                    .WithMany(p => p.BlprocedureGroupCodes)
                    .HasForeignKey(d => d.ProcedureMasterId)
                    .HasConstraintName("FK_BLProcedureGroupCode_PayerId");

                entity.HasOne(d => d.ProcedureType)
                    .WithMany(p => p.BlprocedureGroupCodes)
                    .HasForeignKey(d => d.ProcedureTypeId)
                    .HasConstraintName("FK_BLProcedureGroupCode_ProcedureTypeId");
            });

            modelBuilder.Entity<BlsitePointOfSale>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<BlsuperBillDiagnosis>(entity =>
            {
                entity.Property(e => e.Confidential).HasDefaultValueSql("((0))");

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.Property(e => e.IsHl7msgCreated).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Appointment)
                    .WithMany(p => p.BlsuperBillDiagnoses)
                    .HasForeignKey(d => d.AppointmentId)
                    .HasConstraintName("FK_BLSuperBillDiagnosis_SchAppointment");

                entity.HasOne(d => d.Icd9codeNavigation)
                    .WithMany(p => p.BlsuperBillDiagnoses)
                    .HasForeignKey(d => d.Icd9code)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_BLSuperBillDiagnosis_BLMasterICD9CM");

                entity.HasOne(d => d.Icdversion)
                    .WithMany(p => p.BlsuperBillDiagnoses)
                    .HasForeignKey(d => d.IcdversionId)
                    .HasConstraintName("FK_BLSuperBillDiagnosis_BLICDVersion");
            });

            modelBuilder.Entity<BlsuperBillProcedure>(entity =>
            {
                entity.Property(e => e.Covered).HasDefaultValueSql("((1))");

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.Property(e => e.IsHl7msgCreated).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Appointment)
                    .WithMany(p => p.BlsuperBillProcedures)
                    .HasForeignKey(d => d.AppointmentId)
                    .HasConstraintName("FK_BLSuperBillProcedure_SchAppointment");
            });

            modelBuilder.Entity<BlsuperBillProcedureInvoice>(entity =>
            {
                entity.HasKey(e => new { e.ProcedureId, e.InvoiceNo });

                entity.Property(e => e.Description).HasComment("Contains provider code");

                entity.Property(e => e.InvoiceStatusPosted).HasDefaultValueSql("((0))");

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.Property(e => e.IsHl7msgCreated).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Appointent)
                    .WithMany(p => p.BlsuperBillProcedureInvoices)
                    .HasForeignKey(d => d.AppointentId)
                    .HasConstraintName("FK_BLSuperBillProcedureInvoice_SchAppointment");
            });

            modelBuilder.Entity<BlunclassifiedCode>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<BluniversalToothCode>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<CacheInfo>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.IsActive).HasDefaultValueSql("((1))");

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<Case>(entity =>
            {
                entity.Property(e => e.CaseId).ValueGeneratedNever();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<ClinicalUsage>(entity =>
            {
                entity.Property(e => e.ClinicalUsageId).ValueGeneratedOnAdd();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<Consultationcategory>(entity =>
            {
                entity.Property(e => e.Consultationcategoryid).ValueGeneratedNever();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<CptbyAppType>(entity =>
            {
                entity.HasOne(d => d.AppType)
                    .WithMany(p => p.CptbyAppTypes)
                    .HasForeignKey(d => d.AppTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_CPTByAppType_SchAppointmentType");
            });

            modelBuilder.Entity<CptsInCptbyAppType>(entity =>
            {
                entity.HasOne(d => d.Group)
                    .WithMany(p => p.CptsInCptbyAppTypes)
                    .HasForeignKey(d => d.GroupId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_CPTsInCPTByAppType_CPTByAppType");
            });

            modelBuilder.Entity<DeductiblePercent>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Subscriber)
                    .WithMany(p => p.DeductiblePercents)
                    .HasForeignKey(d => d.SubscriberId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_DeductiblePercent_InsuredSubscriber");
            });

            modelBuilder.Entity<EligibilityLog>(entity =>
            {
                entity.HasOne(d => d.Facility)
                    .WithMany(p => p.EligibilityLogs)
                    .HasForeignKey(d => d.FacilityId)
                    .HasConstraintName("FK_EligibilityLog_RegFacility");

                entity.HasOne(d => d.Patient)
                    .WithMany(p => p.EligibilityLogs)
                    .HasForeignKey(d => d.PatientId)
                    .HasConstraintName("FK_EligibilityLog_RegPatient");

                entity.HasOne(d => d.Payer)
                    .WithMany(p => p.EligibilityLogs)
                    .HasForeignKey(d => d.PayerId)
                    .HasConstraintName("FK_EligibilityLog_BlPayer");

                entity.HasOne(d => d.Plan)
                    .WithMany(p => p.EligibilityLogs)
                    .HasForeignKey(d => d.PlanId)
                    .HasConstraintName("FK_EligibilityLog_BLPayerPlan");

                entity.HasOne(d => d.Requestedby)
                    .WithMany(p => p.EligibilityLogs)
                    .HasForeignKey(d => d.RequestedbyId)
                    .HasConstraintName("FK_EligibilityLog_HrEmployee");

                entity.HasOne(d => d.Visit)
                    .WithMany(p => p.EligibilityLogs)
                    .HasForeignKey(d => d.VisitId)
                    .HasConstraintName("FK_EligibilityLog_SchAppointment");
            });

            modelBuilder.Entity<EmirateType>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<EmrnotesEncounterPath>(entity =>
            {
                entity.HasKey(e => e.PathId)
                    .HasName("PK__EMRNotes__CD67DC596D2971D4");
            });

            modelBuilder.Entity<Emrsite>(entity =>
            {
                entity.HasKey(e => e.SiteId)
                    .HasName("PK_SiteId");

                entity.Property(e => e.SiteId).ValueGeneratedNever();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<EntityType>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<FamilyProblemList>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();
            });

            modelBuilder.Entity<FeeSchedule>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<FinancialClass>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<HolidaySchedule>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<Hremployee>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<HremployeeFacility>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Employee)
                    .WithMany(p => p.HremployeeFacilities)
                    .HasForeignKey(d => d.EmployeeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__HREmployeeFacility__HREmployee");

                entity.HasOne(d => d.Facility)
                    .WithMany(p => p.HremployeeFacilities)
                    .HasForeignKey(d => d.FacilityId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__HREmployeFacility__RegFacil");
            });

            modelBuilder.Entity<HremployeeType>(entity =>
            {
                entity.Property(e => e.TypeId).ValueGeneratedNever();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.Property(e => e.TypeDescription).IsFixedLength();
            });

            modelBuilder.Entity<HrlicenseInfo>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Employee)
                    .WithMany(p => p.HrlicenseInfos)
                    .HasForeignKey(d => d.EmployeeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_HRLICENSEINFO_HREMPLOYEE");
            });

            modelBuilder.Entity<ImmunizationList>(entity =>
            {
                entity.HasKey(e => e.ImmTypeId)
                    .HasName("PK_ImmTypeId");

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<InsuranceCompanyFieldMapping>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<InsuranceEligibility>(entity =>
            {
                entity.Property(e => e.CreatedBy).IsFixedLength();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.Property(e => e.PackageName).IsFixedLength();

                entity.Property(e => e.UpdatedBy).IsFixedLength();

                entity.HasOne(d => d.Appointment)
                    .WithMany(p => p.InsuranceEligibilities)
                    .HasForeignKey(d => d.AppointmentId)
                    .HasConstraintName("FK_InsuranceEligibility_SchAppointment");

                entity.HasOne(d => d.BlPayer)
                    .WithMany(p => p.InsuranceEligibilities)
                    .HasForeignKey(d => d.BlPayerId)
                    .HasConstraintName("FK_InsuranceEligibility_BLPayer");
            });

            modelBuilder.Entity<InsuranceRequestType>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<Insured>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Carrier)
                    .WithMany(p => p.Insureds)
                    .HasForeignKey(d => d.CarrierId)
                    .HasConstraintName("FK_Insured_BLPayer");

                entity.HasOne(d => d.Patient)
                    .WithMany(p => p.Insureds)
                    .HasForeignKey(d => d.PatientId)
                    .HasConstraintName("FK__Insured__RegPatient");

                entity.HasOne(d => d.PayerPackage)
                    .WithMany(p => p.Insureds)
                    .HasForeignKey(d => d.PayerPackageId)
                    .HasConstraintName("FK_Insured_BLPayerPackage");
            });

            modelBuilder.Entity<InsuredCoverage>(entity =>
            {
                entity.HasKey(e => new { e.Mrno, e.RelationCode, e.SubscriberId, e.CoverageOrder });

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<InsuredPolicy>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Subscriber)
                    .WithMany(p => p.InsuredPolicies)
                    .HasForeignKey(d => d.SubscriberId)
                    .HasConstraintName("FK_InsuredPolicy_InsuredSubscriber");
            });

            modelBuilder.Entity<InsuredSubscriber>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Carrier)
                    .WithMany(p => p.InsuredSubscribers)
                    .HasForeignKey(d => d.CarrierId)
                    .HasConstraintName("FK_InsuredSubscriber_BLPayer");

                entity.HasOne(d => d.City)
                    .WithMany(p => p.InsuredSubscribers)
                    .HasForeignKey(d => d.CityId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_InsuredSubscriber_RegCities");

                entity.HasOne(d => d.Country)
                    .WithMany(p => p.InsuredSubscribers)
                    .HasForeignKey(d => d.CountryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_InsuredSubscriber_RegCountries");

                entity.HasOne(d => d.PayerPackage)
                    .WithMany(p => p.InsuredSubscribers)
                    .HasForeignKey(d => d.PayerPackageId)
                    .HasConstraintName("FK_InsuredSubscriber_BLPayerPackage");

                entity.HasOne(d => d.State)
                    .WithMany(p => p.InsuredSubscribers)
                    .HasForeignKey(d => d.StateId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_InsuredSubscriber_RegStates");
            });

            modelBuilder.Entity<LabOrderSetDetail>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.Property(e => e.IsRadiologyTest).HasComment("2 = Pathalogy\r\n1 = Lab\r\n0 = Radiology");
            });

            modelBuilder.Entity<LabTest>(entity =>
            {
                entity.Property(e => e.LabTestId).ValueGeneratedNever();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<Language>(entity =>
            {
                entity.Property(e => e.LanguageId).ValueGeneratedNever();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<LoginUserHistory>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<Nationality>(entity =>
            {
                entity.Property(e => e.NationalityId).ValueGeneratedNever();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<OrderReferral>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<PatientAlert>(entity =>
            {
                entity.Property(e => e.AlertId).ValueGeneratedNever();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<PatientAllergy>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Appointment)
                    .WithMany(p => p.PatientAllergies)
                    .HasForeignKey(d => d.AppointmentId)
                    .HasConstraintName("FK_PatientAllergy_AppointmentId");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.PatientAllergyCreatedByNavigations)
                    .HasForeignKey(d => d.CreatedBy)
                    .HasConstraintName("FK_PatientAllergy_CreatedBy");

                entity.HasOne(d => d.Provider)
                    .WithMany(p => p.PatientAllergyProviders)
                    .HasForeignKey(d => d.ProviderId)
                    .HasConstraintName("FK_PatientAllergy_ProviderId");

                entity.HasOne(d => d.SeverityCodeNavigation)
                    .WithMany(p => p.PatientAllergies)
                    .HasForeignKey(d => d.SeverityCode)
                    .HasConstraintName("FK_PatientAllergy_Severity");

                entity.HasOne(d => d.Type)
                    .WithMany(p => p.PatientAllergies)
                    .HasForeignKey(d => d.TypeId)
                    .HasConstraintName("FK_PatientAllergy_TypeId");

                entity.HasOne(d => d.UpdatedByNavigation)
                    .WithMany(p => p.PatientAllergyUpdatedByNavigations)
                    .HasForeignKey(d => d.UpdatedBy)
                    .HasConstraintName("FK_PatientAllergy_UpdatedBy");
            });

            modelBuilder.Entity<PatientAllergyDetail>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<PatientBill>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.Property(e => e.IsOraclePostedDelete).HasDefaultValueSql("((0))");

                entity.Property(e => e.IsPaymentPosted).HasDefaultValueSql("((0))");

                entity.Property(e => e.IsPaymentPostedDelete).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Procedure)
                    .WithMany(p => p.PatientBills)
                    .HasForeignKey(d => d.ProcedureId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PatientBill_BLSuperBillProcedure");
            });

            modelBuilder.Entity<PatientBillInvoice>(entity =>
            {
                entity.HasKey(e => e.InvoiceId)
                    .HasName("PK__PatientBillInvoi__7DA38D70");

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Appointment)
                    .WithMany(p => p.PatientBillInvoices)
                    .HasForeignKey(d => d.AppointmentId)
                    .HasConstraintName("FK_PatientBillInvoice_SchAppointment");
            });

            modelBuilder.Entity<PatientChartFamilyHistory>(entity =>
            {
                entity.HasOne(d => d.RelationShip)
                    .WithMany(p => p.PatientChartFamilyHistories)
                    .HasForeignKey(d => d.RelationShipId)
                    .HasConstraintName("FK_PatientChartFamilyHistory_RegRelationShip");
            });

            modelBuilder.Entity<PatientChartSocialHistory>(entity =>
            {
                entity.HasOne(d => d.ShitemNavigation)
                    .WithMany(p => p.PatientChartSocialHistories)
                    .HasForeignKey(d => d.Shitem)
                    .HasConstraintName("FK_PatientChartSocialHistory_SHItem");
            });

            modelBuilder.Entity<PatientImmunization>(entity =>
            {
                entity.HasOne(d => d.Appointment)
                    .WithMany(p => p.PatientImmunizations)
                    .HasForeignKey(d => d.AppointmentId)
                    .HasConstraintName("FK_PatientImmunization_AppointmentId");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.PatientImmunizationCreatedByNavigations)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PatientImmunization_CreatedBy");

                entity.HasOne(d => d.DrugType)
                    .WithMany(p => p.PatientImmunizationDrugTypes)
                    .HasForeignKey(d => d.DrugTypeId)
                    .HasConstraintName("FK_PatientImmunization_DrugTypeId");

                entity.HasOne(d => d.ImmType)
                    .WithMany(p => p.PatientImmunizationImmTypes)
                    .HasForeignKey(d => d.ImmTypeId)
                    .HasConstraintName("FK_ImmunizationList_PatientImmunization");

                entity.HasOne(d => d.Provider)
                    .WithMany(p => p.PatientImmunizationProviders)
                    .HasForeignKey(d => d.ProviderId)
                    .HasConstraintName("FK_PatientImmunization_ProviderId");

                entity.HasOne(d => d.Route)
                    .WithMany(p => p.PatientImmunizations)
                    .HasForeignKey(d => d.RouteId)
                    .HasConstraintName("FK_PatientImmunization_RouteId");

                entity.HasOne(d => d.UpdatedByNavigation)
                    .WithMany(p => p.PatientImmunizationUpdatedByNavigations)
                    .HasForeignKey(d => d.UpdatedBy)
                    .HasConstraintName("FK_PatientImmunization_UpdatedBy");
            });

            modelBuilder.Entity<PatientNotifiedOption>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<PatientProblem>(entity =>
            {
                entity.HasOne(d => d.Appointment)
                    .WithMany(p => p.PatientProblems)
                    .HasForeignKey(d => d.AppointmentId)
                    .HasConstraintName("FK_PatientProblemAppointment");

                entity.HasOne(d => d.Patient)
                    .WithMany(p => p.PatientProblems)
                    .HasForeignKey(d => d.PatientId)
                    .HasConstraintName("FK_PatientProblemPatientId");
            });

            modelBuilder.Entity<PatientProcedure>(entity =>
            {
                entity.Property(e => e.Active).HasDefaultValueSql("((1))");

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.Property(e => e.IsHl7msgCreated).HasDefaultValueSql("((0))");

                entity.Property(e => e.PerformedOnFacility).HasDefaultValueSql("((1))");

                entity.Property(e => e.ProcedureEndDateTime).HasDefaultValueSql("('')");

                entity.Property(e => e.ProcedurePriority).HasDefaultValueSql("('')");

                entity.Property(e => e.ProcedureType).HasDefaultValueSql("('')");

                entity.HasOne(d => d.Appointment)
                    .WithMany(p => p.PatientProcedures)
                    .HasForeignKey(d => d.AppointmentId)
                    .HasConstraintName("FK_PatientProcedure_SchAppointment");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.PatientProcedureCreatedByNavigations)
                    .HasForeignKey(d => d.CreatedBy)
                    .HasConstraintName("FK_CreatedBy_HREmployee");

                entity.HasOne(d => d.ProcedureTypeNavigation)
                    .WithMany(p => p.PatientProcedures)
                    .HasForeignKey(d => d.ProcedureType)
                    .HasConstraintName("FK_ProcedureTypeId");

                entity.HasOne(d => d.UpdatedByNavigation)
                    .WithMany(p => p.PatientProcedureUpdatedByNavigations)
                    .HasForeignKey(d => d.UpdatedBy)
                    .HasConstraintName("FK_UpdateBy_HREmployee");
            });

            modelBuilder.Entity<PatientVisitStatus>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Appointment)
                    .WithMany(p => p.PatientVisitStatuses)
                    .HasForeignKey(d => d.AppointmentId)
                    .HasConstraintName("FK_PatientVisitStatus_SchAppointment");

                entity.HasOne(d => d.Status)
                    .WithMany(p => p.PatientVisitStatuses)
                    .HasForeignKey(d => d.StatusId)
                    .HasConstraintName("FK_PatientVisitStatus_SchPatientStatus");

                entity.HasOne(d => d.VisitStatus)
                    .WithMany(p => p.PatientVisitStatuses)
                    .HasForeignKey(d => d.VisitStatusId)
                    .HasConstraintName("FK_PATIENTVISITSTATUS_VisitStatus");
            });

            modelBuilder.Entity<PersonalReminder>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<Prescription>(entity =>
            {
                entity.HasOne(d => d.Appointment)
                    .WithMany(p => p.Prescriptions)
                    .HasForeignKey(d => d.AppointmentId)
                    .HasConstraintName("fk_appointment");

                entity.HasOne(d => d.Drug)
                    .WithMany(p => p.Prescriptions)
                    .HasForeignKey(d => d.DrugId)
                    .HasConstraintName("FK_Prescription_TabsDrugName_DrugId");

                entity.HasOne(d => d.Provider)
                    .WithMany(p => p.Prescriptions)
                    .HasForeignKey(d => d.ProviderId)
                    .HasConstraintName("fk_provider");
            });

            modelBuilder.Entity<ProblemList>(entity =>
            {
                entity.HasKey(e => e.ProblemId)
                    .HasName("PK_ProblemId");

                entity.Property(e => e.ProblemId).ValueGeneratedNever();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<PromotionalMediaChannel>(entity =>
            {
                entity.HasKey(e => e.MediaChannelId)
                    .HasName("PK_MediaChannelId");

                entity.Property(e => e.MediaChannelId).ValueGeneratedNever();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<PromotionalMediaItem>(entity =>
            {
                entity.HasKey(e => e.MediaItemId)
                    .HasName("PK_MediaItemId");

                entity.Property(e => e.MediaItemId).ValueGeneratedNever();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<Provider>(entity =>
            {
                entity.ToView("Provider");

                entity.Property(e => e.EmployeeId).ValueGeneratedOnAdd();
            });

            modelBuilder.Entity<ProviderSchedule>(entity =>
            {
                entity.HasKey(e => e.Psid)
                    .HasName("PK_PSId");

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Facility)
                    .WithMany(p => p.ProviderSchedules)
                    .HasForeignKey(d => d.FacilityId)
                    .HasConstraintName("FK_ProviderSchedule_RegFacility");

                entity.HasOne(d => d.Speciality)
                    .WithMany(p => p.ProviderSchedules)
                    .HasForeignKey(d => d.SpecialityId)
                    .HasConstraintName("FK_ProviderSchedule_ProviderSpeciality");
            });

            modelBuilder.Entity<ProviderScheduleByAppType>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.AppType)
                    .WithMany(p => p.ProviderScheduleByAppTypes)
                    .HasForeignKey(d => d.AppTypeId)
                    .HasConstraintName("FK_ProviderScheduleByAppType_SchAppointmentType");

                entity.HasOne(d => d.Ps)
                    .WithMany(p => p.ProviderScheduleByAppTypes)
                    .HasForeignKey(d => d.Psid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ProviderScheduleByAppType_ProviderSchedule");
            });

            modelBuilder.Entity<ProviderSpecialty>(entity =>
            {
                entity.Property(e => e.Active).HasDefaultValueSql("((1))");

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<ProviderSpecialtyAssign>(entity =>
            {
                entity.HasKey(e => new { e.ProviderId, e.SpecialtyId });

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<RegAccount>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Patient)
                    .WithMany(p => p.RegAccounts)
                    .HasForeignKey(d => d.PatientId)
                    .HasConstraintName("FK_RegAccount_RegPatientId");

                entity.HasOne(d => d.Relationship)
                    .WithMany(p => p.RegAccounts)
                    .HasForeignKey(d => d.RelationshipId)
                    .HasConstraintName("FK_RegAccount_RegRelationshipId");
            });

            modelBuilder.Entity<RegAlertType>(entity =>
            {
                entity.HasKey(e => e.TypeId)
                    .HasName("PK_TypeIdAlert");

                entity.Property(e => e.TypeId).ValueGeneratedNever();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<RegAssignment>(entity =>
            {
                entity.Property(e => e.Active).HasDefaultValueSql("((0))");

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<RegBloodGroup>(entity =>
            {
                entity.HasKey(e => e.BloodGroupId)
                    .HasName("PK_BloodGroupId");

                entity.Property(e => e.BloodGroupId).ValueGeneratedNever();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<RegCity>(entity =>
            {
                entity.HasKey(e => e.CityId)
                    .HasName("PK_CityId");

                entity.Property(e => e.CityId).ValueGeneratedNever();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<RegCompany>(entity =>
            {
                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.RegCompanies)
                    .HasForeignKey(d => d.CreatedById)
                    .HasConstraintName("FK_RegCompany_HREmployee");
            });

            modelBuilder.Entity<RegCountry>(entity =>
            {
                entity.HasKey(e => e.CountryId)
                    .HasName("PK_CountryId");

                entity.Property(e => e.CountryId).ValueGeneratedNever();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<RegCreditCardType>(entity =>
            {
                entity.HasKey(e => e.TypeId)
                    .HasName("PK_TypeId");

                entity.Property(e => e.TypeId).ValueGeneratedNever();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<RegDebitCardType>(entity =>
            {
                entity.HasKey(e => e.TypeId)
                    .HasName("PK_TypeIdDebit");

                entity.Property(e => e.TypeId).ValueGeneratedNever();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<RegEmploymentStatus>(entity =>
            {
                entity.HasKey(e => e.EmpStatusId)
                    .HasName("PK_EmpStatusId");

                entity.Property(e => e.EmpStatusId).ValueGeneratedNever();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<RegEmploymentType>(entity =>
            {
                entity.HasKey(e => e.EmpTypeId)
                    .HasName("PK_EmpTypeId");

                entity.Property(e => e.EmpTypeId).ValueGeneratedNever();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<RegEthnicityType>(entity =>
            {
                entity.HasKey(e => e.TypeId)
                    .HasName("PK_TypeIdEthnicity");

                entity.Property(e => e.TypeId).ValueGeneratedNever();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<RegFacility>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Company)
                    .WithMany(p => p.RegFacilities)
                    .HasForeignKey(d => d.CompanyId)
                    .HasConstraintName("FK_RegFacility_RegCompany");
            });

            modelBuilder.Entity<RegGender>(entity =>
            {
                entity.HasKey(e => e.GenderId)
                    .HasName("PK_GenderId");

                entity.Property(e => e.GenderId).ValueGeneratedNever();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<RegGenderIdentity>(entity =>
            {
                entity.HasKey(e => e.GenderId)
                    .HasName("PK__RegGende__4E24E9F7C883AD8E");

                entity.Property(e => e.Active).HasDefaultValueSql("((1))");
            });

            modelBuilder.Entity<RegLastMrno>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();
            });

            modelBuilder.Entity<RegLocation>(entity =>
            {
                entity.HasKey(e => e.LocationId)
                    .HasName("PK_LocationId");

                entity.Property(e => e.LocationId).ValueGeneratedNever();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<RegLocationType>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Facility)
                    .WithMany(p => p.RegLocationTypes)
                    .HasForeignKey(d => d.FacilityId)
                    .HasConstraintName("FK_RegLocationTypes_RegFacility");
            });

            modelBuilder.Entity<RegMaritalStatus>(entity =>
            {
                entity.HasKey(e => e.MaritalStatusId)
                    .HasName("PK_MaritalStatusId");

                entity.Property(e => e.MaritalStatusId).ValueGeneratedNever();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<RegOccupation>(entity =>
            {
                entity.HasKey(e => e.OccupationId)
                    .HasName("PK_OccupationId");

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<RegPatient>(entity =>
            {
                entity.HasKey(e => e.PatientId)
                    .HasName("PK_PatientId");

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.PatientBloodGroup)
                    .WithMany(p => p.RegPatients)
                    .HasForeignKey(d => d.PatientBloodGroupId)
                    .HasConstraintName("FK_RegPatient_RegBloodGroup");

                entity.HasOne(d => d.TabsType)
                    .WithMany(p => p.RegPatients)
                    .HasForeignKey(d => d.TabsTypeId)
                    .HasConstraintName("FK_RegPatient_RegPateintTabsType");
            });

            modelBuilder.Entity<RegPatientAddress>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<RegPatientDetail>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.City)
                    .WithMany(p => p.RegPatientDetails)
                    .HasForeignKey(d => d.CityId)
                    .HasConstraintName("FK__RegPatien__RegCity");

                entity.HasOne(d => d.Gender)
                    .WithMany(p => p.RegPatientDetails)
                    .HasForeignKey(d => d.GenderId)
                    .HasConstraintName("FK__RegPatien__RegGender");

                entity.HasOne(d => d.Location)
                    .WithMany(p => p.RegPatientDetails)
                    .HasForeignKey(d => d.LocationId)
                    .HasConstraintName("FK__RegPatienDetails__RegLocations");

                entity.HasOne(d => d.Patient)
                    .WithMany(p => p.RegPatientDetails)
                    .HasForeignKey(d => d.PatientId)
                    .HasConstraintName("FK_RegPatientDetails_RegPatientId");

                entity.HasOne(d => d.Provider)
                    .WithMany(p => p.RegPatientDetails)
                    .HasForeignKey(d => d.ProviderId)
                    .HasConstraintName("FK__RegPatien__HREmployee");

                entity.HasOne(d => d.Relationship)
                    .WithMany(p => p.RegPatientDetails)
                    .HasForeignKey(d => d.RelationshipId)
                    .HasConstraintName("FK__RegPatienDetails__RegRelationShip");

                entity.HasOne(d => d.Site)
                    .WithMany(p => p.RegPatientDetails)
                    .HasForeignKey(d => d.SiteId)
                    .HasConstraintName("FK__RegPatien__RegLocationType");

                entity.HasOne(d => d.State)
                    .WithMany(p => p.RegPatientDetails)
                    .HasForeignKey(d => d.StateId)
                    .HasConstraintName("FK__RegPatien__RegState");

                entity.HasOne(d => d.TabsType)
                    .WithMany(p => p.RegPatientDetails)
                    .HasForeignKey(d => d.TabsTypeId)
                    .HasConstraintName("FK_RegPatientDetails_RegPateintTabsType");
            });

            modelBuilder.Entity<RegPatientEmployer>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.EmploymentOccupation)
                    .WithMany(p => p.RegPatientEmployers)
                    .HasForeignKey(d => d.EmploymentOccupationId)
                    .HasConstraintName("FK_RegPatientEmployer_RegOccupationId");

                entity.HasOne(d => d.EmploymentType)
                    .WithMany(p => p.RegPatientEmployers)
                    .HasForeignKey(d => d.EmploymentTypeId)
                    .HasConstraintName("FK_RegPatientEmployer_RegEmploymentTypeId");

                entity.HasOne(d => d.Patient)
                    .WithMany(p => p.RegPatientEmployers)
                    .HasForeignKey(d => d.PatientId)
                    .HasConstraintName("FK_RegPatientEmployer_RegPatientId");
            });

            modelBuilder.Entity<RegPatientOld>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.PatientBloodGroup)
                    .WithMany()
                    .HasForeignKey(d => d.PatientBloodGroupId)
                    .HasConstraintName("FK_RegPatientOld_RegBloodGroup");

                entity.HasOne(d => d.Patient)
                    .WithMany()
                    .HasForeignKey(d => d.PatientId)
                    .HasConstraintName("FK_RegPatientOld_RegPatientId");

                entity.HasOne(d => d.TabsType)
                    .WithMany()
                    .HasForeignKey(d => d.TabsTypeId)
                    .HasConstraintName("FK_RegPatientOld_RegPateintTabsType");
            });

            modelBuilder.Entity<RegPatientTabsType>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<RegPatientTemp>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Nokcity)
                    .WithMany(p => p.RegPatientTempNokcities)
                    .HasForeignKey(d => d.NokcityId)
                    .HasConstraintName("FK_NOK_RegPatientTemp_RegCities");

                entity.HasOne(d => d.Nokcountry)
                    .WithMany(p => p.RegPatientTempNokcountries)
                    .HasForeignKey(d => d.NokcountryId)
                    .HasConstraintName("FK_NOK_RegPatientTemp_RegCountries");

                entity.HasOne(d => d.Nokstate)
                    .WithMany(p => p.RegPatientTempNokstates)
                    .HasForeignKey(d => d.NokstateId)
                    .HasConstraintName("FK_NOK_RegPatientTemp_RegStates");

                entity.HasOne(d => d.PersonCity)
                    .WithMany(p => p.RegPatientTempPersonCities)
                    .HasForeignKey(d => d.PersonCityId)
                    .HasConstraintName("FK_RegPatientTemp_RegCities");

                entity.HasOne(d => d.PersonCountry)
                    .WithMany(p => p.RegPatientTempPersonCountries)
                    .HasForeignKey(d => d.PersonCountryId)
                    .HasConstraintName("FK_RegPatientTemp_RegCountries");

                entity.HasOne(d => d.PersonNationality)
                    .WithMany(p => p.RegPatientTemps)
                    .HasForeignKey(d => d.PersonNationalityId)
                    .HasConstraintName("FK_RegPatientTemp_Nationality");

                entity.HasOne(d => d.PersonState)
                    .WithMany(p => p.RegPatientTempPersonStates)
                    .HasForeignKey(d => d.PersonStateId)
                    .HasConstraintName("FK_RegPatientTemp_RegStates");

                entity.HasOne(d => d.PersonTitle)
                    .WithMany(p => p.RegPatientTemps)
                    .HasForeignKey(d => d.PersonTitleId)
                    .HasConstraintName("FK_RegPatientTemp_RegTitle");
            });

            modelBuilder.Entity<RegRelationShip>(entity =>
            {
                entity.HasKey(e => e.RelationshipId)
                    .HasName("PK_RelationshipId");

                entity.Property(e => e.RelationshipId).ValueGeneratedNever();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<RegState>(entity =>
            {
                entity.HasKey(e => e.StateId)
                    .HasName("PK_StateID");

                entity.Property(e => e.StateId).ValueGeneratedNever();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<RegTitle>(entity =>
            {
                entity.HasKey(e => e.TitleId)
                    .HasName("PK_TitleId");

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<Religion>(entity =>
            {
                entity.Property(e => e.ReligionId).ValueGeneratedNever();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<ReschedulingReason>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<SchAppointment>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.AppCriteria)
                    .WithMany(p => p.SchAppointments)
                    .HasForeignKey(d => d.AppCriteriaId)
                    .HasConstraintName("FK_SchAppointment_SchAppointmentCriteria");

                entity.HasOne(d => d.AppStatus)
                    .WithMany(p => p.SchAppointments)
                    .HasForeignKey(d => d.AppStatusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_SchAppointment_SchAppointmentStatus");

                entity.HasOne(d => d.Employee)
                    .WithMany(p => p.SchAppointments)
                    .HasForeignKey(d => d.EmployeeId)
                    .HasConstraintName("FK_SchAppointment_HrEmployee");

                entity.HasOne(d => d.Facility)
                    .WithMany(p => p.SchAppointments)
                    .HasForeignKey(d => d.FacilityId)
                    .HasConstraintName("FK_SchAppointment_RegFacility");

                entity.HasOne(d => d.Patient)
                    .WithMany(p => p.SchAppointments)
                    .HasForeignKey(d => d.PatientId)
                    .HasConstraintName("FK_SchAppointment_RegPatient");

                entity.HasOne(d => d.PatientNotified)
                    .WithMany(p => p.SchAppointments)
                    .HasForeignKey(d => d.PatientNotifiedId)
                    .HasConstraintName("FK_SchAppointment_PatientNotifiedOptions");

                entity.HasOne(d => d.PatientStatus)
                    .WithMany(p => p.SchAppointments)
                    .HasForeignKey(d => d.PatientStatusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_SchAppointment_SchPatientStatus");

                entity.HasOne(d => d.Payer)
                    .WithMany(p => p.SchAppointments)
                    .HasForeignKey(d => d.PayerId)
                    .HasConstraintName("FK_SchAppointment_BLPayer");

                entity.HasOne(d => d.Plan)
                    .WithMany(p => p.SchAppointments)
                    .HasForeignKey(d => d.PlanId)
                    .HasConstraintName("FK_SchAppointment_BLPayerPlan");

                entity.HasOne(d => d.PurposeOfVisitNavigation)
                    .WithMany(p => p.SchAppointments)
                    .HasForeignKey(d => d.PurposeOfVisitId)
                    .HasConstraintName("FK_SchAppointment_ProblemList");

                entity.HasOne(d => d.Rescheduled)
                    .WithMany(p => p.SchAppointments)
                    .HasForeignKey(d => d.RescheduledId)
                    .HasConstraintName("FK_SchAppointment_ReschedulingReasons");

                entity.HasOne(d => d.Site)
                    .WithMany(p => p.SchAppointments)
                    .HasForeignKey(d => d.SiteId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_SchAppointment_RegLocationTypes");

                entity.HasOne(d => d.Subscriber)
                    .WithMany(p => p.SchAppointments)
                    .HasForeignKey(d => d.SubscriberId)
                    .HasConstraintName("FK_SchAppointment_InsuredSubscriber");

                entity.HasOne(d => d.VisitStatus)
                    .WithMany(p => p.SchAppointments)
                    .HasForeignKey(d => d.VisitStatusId)
                    .HasConstraintName("FK_SchAppointment_VisitStatus");

                entity.HasOne(d => d.VisitType)
                    .WithMany(p => p.SchAppointments)
                    .HasForeignKey(d => d.VisitTypeId)
                    .HasConstraintName("FK_SchAppointment_VisitType");
            });

            modelBuilder.Entity<SchAppointmentCriterion>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<SchAppointmentStatus>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<SchAppointmentType>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<SchBlockTimeslot>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<SchPatientCall>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<SchPatientStatus>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<SecEmployeeRole>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Employee)
                    .WithMany(p => p.SecEmployeeRoles)
                    .HasForeignKey(d => d.EmployeeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_SecEmployeeRole_HREmployee");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.SecEmployeeRoles)
                    .HasForeignKey(d => d.RoleId)
                    .HasConstraintName("FK_SecEmployeeRole_SecRole");
            });

            modelBuilder.Entity<SecModule>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<SecModuleForm>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Module)
                    .WithMany(p => p.SecModuleForms)
                    .HasForeignKey(d => d.ModuleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_SecModuleForm_SecModule");
            });

            modelBuilder.Entity<SecPrivilege>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<SecPrivilegesAssignedRole>(entity =>
            {
                entity.HasKey(e => e.RolePrivilegeId)
                    .HasName("PK_SecPrivilegesAssignedRole_1");

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.FormPrivilege)
                    .WithMany(p => p.SecPrivilegesAssignedRoles)
                    .HasForeignKey(d => d.FormPrivilegeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__SecPrivil__SecPrivilegesAvailableForm");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.SecPrivilegesAssignedRoles)
                    .HasForeignKey(d => d.RoleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__SecPrivil__SecRoleI");
            });

            modelBuilder.Entity<SecPrivilegesAvailableForm>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Form)
                    .WithMany(p => p.SecPrivilegesAvailableForms)
                    .HasForeignKey(d => d.FormId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_SecPrivilegesAvailableForm_SecModuleForm");

                entity.HasOne(d => d.Privilege)
                    .WithMany(p => p.SecPrivilegesAvailableForms)
                    .HasForeignKey(d => d.PrivilegeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__SecPrivil__SecPrivileges");
            });

            modelBuilder.Entity<SecRole>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<SecRoleForm>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Form)
                    .WithMany(p => p.SecRoleForms)
                    .HasForeignKey(d => d.FormId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_SecRoleForm_SecModuleForm");
            });

            modelBuilder.Entity<Servicecategory>(entity =>
            {
                entity.Property(e => e.ServiceCategoryId).ValueGeneratedNever();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<SpeechToText>(entity =>
            {
                entity.HasOne(d => d.Patient)
                    .WithMany(p => p.SpeechToTexts)
                    .HasForeignKey(d => d.PatientId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_SpeechToText_RegPatient");
            });

            modelBuilder.Entity<TabDrugsName>(entity =>
            {
                entity.HasKey(e => e.DrugId)
                    .HasName("PK_TabsDrugName_DrugId");

                entity.Property(e => e.DrugId).ValueGeneratedNever();
            });

            modelBuilder.Entity<Task>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<TaskForwarding>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.ReceiverRole)
                    .WithMany(p => p.TaskForwardings)
                    .HasForeignKey(d => d.ReceiverRoleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__TaskForwa__SecRole");
            });

            modelBuilder.Entity<TaskType>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<TestTableType>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<TypeOfServiceMaster>(entity =>
            {
                entity.Property(e => e.ServiceTypeId).ValueGeneratedNever();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<VisitStatus>(entity =>
            {
                entity.Property(e => e.VisitStatusId).ValueGeneratedNever();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<VisitType>(entity =>
            {
                entity.Property(e => e.VisitTypeId).ValueGeneratedNever();

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<VitalSign>(entity =>
            {
                entity.HasOne(d => d.Appointment)
                    .WithMany(p => p.VitalSigns)
                    .HasForeignKey(d => d.AppointmentId)
                    .HasConstraintName("FK_VitalSigns_SchAppointment");
            });

            modelBuilder.Entity<VwAllActivePatient>(entity =>
            {
                entity.ToView("vwAllActivePatients");
            });

            modelBuilder.Entity<VwGetDurationTimeSlot>(entity =>
            {
                entity.ToView("VwGetDurationTimeSlot");
            });

            modelBuilder.Entity<VwProviderByFacilityId>(entity =>
            {
                entity.ToView("VwProviderByFacilityId");
            });

            modelBuilder.Entity<VwProviderbySiteid>(entity =>
            {
                entity.ToView("VwProviderbySiteid");
            });

            modelBuilder.Entity<VwRegPatientAndAppointmentdetail>(entity =>
            {
                entity.ToView("VwRegPatientAndAppointmentdetails");
            });

            modelBuilder.Entity<VwSiteByproviderId>(entity =>
            {
                entity.ToView("VwSiteByproviderId");
            });

            modelBuilder.Entity<VwSitebySpecialityid>(entity =>
            {
                entity.ToView("VwSitebySpecialityid");
            });

            modelBuilder.Entity<VwSpecialityByEmployeeId>(entity =>
            {
                entity.ToView("VwSpecialityByEmployeeId");
            });

            modelBuilder.Entity<VwSpecialitybyFacilityid>(entity =>
            {
                entity.ToView("VwSpecialitybyFacilityid");
            });

            modelBuilder.Entity<Vwprovider>(entity =>
            {
                entity.ToView("VWProvider");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
