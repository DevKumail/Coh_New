using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class HMISDbContext : DbContext
{
    public HMISDbContext()
    {
    }

    public HMISDbContext(DbContextOptions<HMISDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Action> Actions { get; set; }

    public virtual DbSet<AlergyType> AlergyTypes { get; set; }

    public virtual DbSet<Assingment> Assingments { get; set; }

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

    public virtual DbSet<StudentCourse> StudentCourses { get; set; }

    public virtual DbSet<StudentInfo> StudentInfos { get; set; }

    public virtual DbSet<StudentPortal> StudentPortals { get; set; }

    public virtual DbSet<TabDrugsName> TabDrugsNames { get; set; }

    public virtual DbSet<TabDrugsNameBackup> TabDrugsNameBackups { get; set; }

    public virtual DbSet<Task> Tasks { get; set; }

    public virtual DbSet<TaskForwarding> TaskForwardings { get; set; }

    public virtual DbSet<TaskType> TaskTypes { get; set; }

    public virtual DbSet<Teacher> Teachers { get; set; }

    public virtual DbSet<TestTableType> TestTableTypes { get; set; }

    public virtual DbSet<TypeOfServiceMaster> TypeOfServiceMasters { get; set; }

    public virtual DbSet<UppInsuranceClaim> UppInsuranceClaims { get; set; }

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

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=DESKTOP-OMTM2PC;Initial Catalog=HMIS; user id=sa; password=123qwe;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Action>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<AlergyType>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Action).WithMany(p => p.AuditLogs).HasConstraintName("FK__AuditLog__Action__2DE6D218");

            entity.HasOne(d => d.UserLoginHistory).WithMany(p => p.AuditLogs).HasConstraintName("FK__AuditLog__UserLo__32AB8735");
        });

        modelBuilder.Entity<AvailableMrno>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<BlEclaimEncounterEndType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__BL_EClai__3214EC078020C21F");
        });

        modelBuilder.Entity<BlEclaimEncounterStartType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__BL_EClai__3214EC07E25D8580");
        });

        modelBuilder.Entity<BlEclaimEncounterType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__BL_EClai__3214EC078C27860D");
        });

        modelBuilder.Entity<BlProceduresGroup>(entity =>
        {
            entity.HasKey(e => e.GroupId).HasName("PK_BL_Group");

            entity.HasOne(d => d.ProcedureType).WithMany(p => p.BlProceduresGroups).HasConstraintName("FK_BL_Group_Procedure_Type");
        });

        modelBuilder.Entity<Blcptgroup>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<BlcptgroupCode>(entity =>
        {
            entity.HasKey(e => new { e.GroupCodeId, e.GroupId, e.Cptcode }).HasName("PK_BLCPTGroupCode_1");

            entity.Property(e => e.GroupCodeId).ValueGeneratedOnAdd();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Group).WithMany(p => p.BlcptgroupCodes)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BLCPTGroupCode_BLCPTGroup");
        });

        modelBuilder.Entity<BlcptmasterRange>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.ServiceType).WithMany(p => p.BlcptmasterRanges)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BLCPTMasterRanges_TypeOfServiceMaster");
        });

        modelBuilder.Entity<BldentalGroupCode>(entity =>
        {
            entity.HasKey(e => new { e.GroupCodeId, e.GroupId, e.DentalCode }).HasName("PK_BLDentalGroupCode_1");

            entity.Property(e => e.GroupCodeId).ValueGeneratedOnAdd();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.DentalCodeNavigation).WithMany(p => p.BldentalGroupCodes)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BLDentalGroupCode_BLMasterDentalCodes");

            entity.HasOne(d => d.Group).WithMany(p => p.BldentalGroupCodes)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BLDentalGroupCode_BLDentalGroup");
        });

        modelBuilder.Entity<BleligibilityLog>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Appointment).WithMany(p => p.BleligibilityLogs).HasConstraintName("FK_BLEligibilityLog_SchAppointment");
        });

        modelBuilder.Entity<Blhcpcsgroup>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<BlhcpcsgroupCode>(entity =>
        {
            entity.Property(e => e.GroupCodeId).ValueGeneratedOnAdd();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Group).WithMany(p => p.BlhcpcsgroupCodes)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BLHCPCSGroupCode_BLHCPCSGroup");

            entity.HasOne(d => d.HcpcscodeNavigation).WithMany(p => p.BlhcpcsgroupCodes)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BLHCPCSGroupCode_BLMasterHCPCS");
        });

        modelBuilder.Entity<Blicd9cmgroup>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<Blicd9cmgroupCode>(entity =>
        {
            entity.Property(e => e.GroupCodeId).ValueGeneratedOnAdd();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Group).WithMany(p => p.Blicd9cmgroupCodes)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BLICD9CMGroupCode_BLICD9CMGroup");

            entity.HasOne(d => d.Icd9codeNavigation).WithMany(p => p.Blicd9cmgroupCodes)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BLICD9CMGroupCode_BLMasterICD9CM");
        });

        modelBuilder.Entity<Blicdversion>(entity =>
        {
            entity.Property(e => e.IcdversionId).ValueGeneratedNever();
            entity.Property(e => e.Active).HasComment("All Active versions List to show in Charge Capture screen in RadioButtonList or Drop-Down List. active list will be shown to end user for end user selection. Select version select at GUI by default based on DOS check.");
            entity.Property(e => e.DosendDate).HasComment("DOS (Appointment Date) if defined then to apply end date to effect using ICD version. If Null then No Date Check to apply");
            entity.Property(e => e.DosstartDate).HasComment("DOS (Appointment Date) if defined then to apply starting date to effect using ICD version. If Null then No Date Check to apply");
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<BlmasterCpt>(entity =>
        {
            entity.HasKey(e => e.Cptcode).HasName("PK_CPTCode");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<BlmasterDentalCode>(entity =>
        {
            entity.HasKey(e => e.DentalCode).HasName("PK_DentalCode");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<BlmasterHcpc>(entity =>
        {
            entity.HasKey(e => e.Hcpcscode).HasName("PK_HCPCSCode");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<BlmasterIcd9cm>(entity =>
        {
            entity.HasKey(e => e.Icd9code).HasName("PK_ICD9Code");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<BlmasterIrdrg>(entity =>
        {
            entity.HasKey(e => e.Irdrgcode).HasName("PK_IRDRGCode");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<BlmasterProcedure>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_Procedures");

            entity.Property(e => e.ItemName).IsFixedLength();

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.BlmasterProcedureCreatedByNavigations).HasConstraintName("FK_Procedures_CreatedBy");

            entity.HasOne(d => d.ProcedureType).WithMany(p => p.BlmasterProcedures).HasConstraintName("FK_Procedures_Procedures_types");

            entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.BlmasterProcedureUpdatedByNavigations).HasConstraintName("FK_Procedures_UpdatedBy");
        });

        modelBuilder.Entity<BlmasterWeqaya>(entity =>
        {
            entity.HasKey(e => e.WeqayaId).HasName("PK_WeqayaId");

            entity.Property(e => e.WeqayaId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<BlpatientVisit>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Appointment).WithMany(p => p.BlpatientVisits).HasConstraintName("FK_BLPatientVisit_SchAppointment");

            entity.HasOne(d => d.Payer).WithMany(p => p.BlpatientVisits).HasConstraintName("FK_BLPatientVisit_BLPayer");

            entity.HasOne(d => d.Subscriber).WithMany(p => p.BlpatientVisits).HasConstraintName("FK_BLPatientVisit_InsuredSubscriber");
        });

        modelBuilder.Entity<Blpayer>(entity =>
        {
            entity.HasKey(e => e.PayerId).HasName("PK__BLPayer__0ADBE86737501FF1");

            entity.Property(e => e.PayerId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<BlpayerPackage>(entity =>
        {
            entity.HasKey(e => e.PayerPackageId).HasName("PK__BLPayerP__8137B82DBA5F70C2");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Payer).WithMany(p => p.BlpayerPackages).HasConstraintName("FK_BLPayerPackage_BLPayer");
        });

        modelBuilder.Entity<BlpayerPlan>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Payer).WithMany(p => p.BlpayerPlans)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BLPayerPlan_BLPayer");
        });

        modelBuilder.Entity<BlprocedureGroupCode>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__BLProced__3214EC079A1BA76F");

            entity.HasOne(d => d.Payer).WithMany(p => p.BlprocedureGroupCodes).HasConstraintName("FK_BLProcedureGroupCode_ProcedureMasterId");

            entity.HasOne(d => d.ProcedureGroup).WithMany(p => p.BlprocedureGroupCodes).HasConstraintName("FK_BLProcedureGroupCode_GroupId");

            entity.HasOne(d => d.ProcedureMaster).WithMany(p => p.BlprocedureGroupCodes).HasConstraintName("FK_BLProcedureGroupCode_PayerId");

            entity.HasOne(d => d.ProcedureType).WithMany(p => p.BlprocedureGroupCodes).HasConstraintName("FK_BLProcedureGroupCode_ProcedureTypeId");
        });

        modelBuilder.Entity<BlsitePointOfSale>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_BLSaleofPoint");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<BlsuperBillDiagnosis>(entity =>
        {
            entity.Property(e => e.Confidential).HasDefaultValue(false);
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            entity.Property(e => e.IsHl7msgCreated).HasDefaultValue(false);

            entity.HasOne(d => d.Appointment).WithMany(p => p.BlsuperBillDiagnoses).HasConstraintName("FK_BLSuperBillDiagnosis_SchAppointment");

            entity.HasOne(d => d.Icd9codeNavigation).WithMany(p => p.BlsuperBillDiagnoses).HasConstraintName("FK_BLSuperBillDiagnosis_BLMasterICD9CM");

            entity.HasOne(d => d.Icdversion).WithMany(p => p.BlsuperBillDiagnoses).HasConstraintName("FK_BLSuperBillDiagnosis_BLICDVersion");
        });

        modelBuilder.Entity<BlsuperBillProcedure>(entity =>
        {
            entity.Property(e => e.Covered).HasDefaultValue(true);
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            entity.Property(e => e.IsHl7msgCreated).HasDefaultValue(false);

            entity.HasOne(d => d.Appointment).WithMany(p => p.BlsuperBillProcedures).HasConstraintName("FK_BLSuperBillProcedure_SchAppointment");
        });

        modelBuilder.Entity<BlsuperBillProcedureInvoice>(entity =>
        {
            entity.Property(e => e.Description).HasComment("Contains provider code");
            entity.Property(e => e.InvoiceStatusPosted).HasDefaultValue(false);
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            entity.Property(e => e.IsHl7msgCreated).HasDefaultValue(false);

            entity.HasOne(d => d.Appointent).WithMany(p => p.BlsuperBillProcedureInvoices).HasConstraintName("FK_BLSuperBillProcedureInvoice_SchAppointment");
        });

        modelBuilder.Entity<BlunclassifiedCode>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<CacheInfo>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CacheInf__3214EC07014EF0AC");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.IsActive).HasDefaultValue(1);
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<Case>(entity =>
        {
            entity.HasKey(e => e.CaseId).HasName("PK_Episode");

            entity.Property(e => e.CaseId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<ClinicalUsage>(entity =>
        {
            entity.Property(e => e.ClinicalUsageId).ValueGeneratedOnAdd();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<Consultationcategory>(entity =>
        {
            entity.HasKey(e => e.Consultationcategoryid).HasName("PK__CONSULTA__67DF4653CD7BF109");

            entity.Property(e => e.Consultationcategoryid).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<CptbyAppType>(entity =>
        {
            entity.HasOne(d => d.AppType).WithMany(p => p.CptbyAppTypes)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CPTByAppType_SchAppointmentType");
        });

        modelBuilder.Entity<CptsInCptbyAppType>(entity =>
        {
            entity.HasOne(d => d.Group).WithMany(p => p.CptsInCptbyAppTypes)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CPTsInCPTByAppType_CPTByAppType");
        });

        modelBuilder.Entity<DeductiblePercent>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Subscriber).WithMany(p => p.DeductiblePercents)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DeductiblePercent_InsuredSubscriber");
        });

        modelBuilder.Entity<EligibilityLog>(entity =>
        {
            entity.HasOne(d => d.Facility).WithMany(p => p.EligibilityLogs).HasConstraintName("FK_EligibilityLog_RegFacility");

            entity.HasOne(d => d.Patient).WithMany(p => p.EligibilityLogs).HasConstraintName("FK_EligibilityLog_RegPatient");

            entity.HasOne(d => d.Payer).WithMany(p => p.EligibilityLogs).HasConstraintName("FK_EligibilityLog_BlPayer");

            entity.HasOne(d => d.Plan).WithMany(p => p.EligibilityLogs).HasConstraintName("FK_EligibilityLog_BLPayerPlan");

            entity.HasOne(d => d.Requestedby).WithMany(p => p.EligibilityLogs).HasConstraintName("FK_EligibilityLog_HrEmployee");

            entity.HasOne(d => d.Visit).WithMany(p => p.EligibilityLogs).HasConstraintName("FK_EligibilityLog_SchAppointment");
        });

        modelBuilder.Entity<EmirateType>(entity =>
        {
            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<Emrsite>(entity =>
        {
            entity.HasKey(e => e.SiteId).HasName("PK_SiteId");

            entity.Property(e => e.SiteId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<EntityType>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<FamilyProblemList>(entity =>
        {
            entity.Property(e => e.Id).ValueGeneratedNever();
        });

        modelBuilder.Entity<FeeSchedule>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<FinancialClass>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<HolidaySchedule>(entity =>
        {
            entity.HasKey(e => e.HolidayScheduleId).HasName("PK_HolidayBlocked");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<Hremployee>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<HremployeeFacility>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Employee).WithMany(p => p.HremployeeFacilities)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__HREmployeeFacility__HREmployee");

            entity.HasOne(d => d.Facility).WithMany(p => p.HremployeeFacilities)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__HREmployeFacility__RegFacil");
        });

        modelBuilder.Entity<HremployeeType>(entity =>
        {
            entity.Property(e => e.TypeId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            entity.Property(e => e.TypeDescription).IsFixedLength();
        });

        modelBuilder.Entity<HrlicenseInfo>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Employee).WithMany(p => p.HrlicenseInfos)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_HRLICENSEINFO_HREMPLOYEE");
        });

        modelBuilder.Entity<ImmunizationList>(entity =>
        {
            entity.HasKey(e => e.ImmTypeId).HasName("PK_ImmTypeId");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<InsuranceCompanyFieldMapping>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Insuranc__3214EC079B28B17A");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<InsuranceEligibility>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Insuranc__3214EC076193A183");

            entity.Property(e => e.CreatedBy).IsFixedLength();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            entity.Property(e => e.PackageName).IsFixedLength();
            entity.Property(e => e.UpdatedBy).IsFixedLength();

            entity.HasOne(d => d.Appointment).WithMany(p => p.InsuranceEligibilities).HasConstraintName("FK_InsuranceEligibility_SchAppointment");

            entity.HasOne(d => d.BlPayer).WithMany(p => p.InsuranceEligibilities).HasConstraintName("FK_InsuranceEligibility_BLPayer");
        });

        modelBuilder.Entity<InsuranceRequestType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Insuranc__3214EC071602273E");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<Insured>(entity =>
        {
            entity.HasKey(e => e.InsuredId).HasName("PK__Insured__03C4A17B84441545");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Carrier).WithMany(p => p.Insureds).HasConstraintName("FK_Insured_BLPayer");

            entity.HasOne(d => d.Patient).WithMany(p => p.Insureds).HasConstraintName("FK__Insured__RegPatient");

            entity.HasOne(d => d.PayerPackage).WithMany(p => p.Insureds).HasConstraintName("FK_Insured_BLPayerPackage");
        });

        modelBuilder.Entity<InsuredCoverage>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<InsuredPolicy>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Subscriber).WithMany(p => p.InsuredPolicies).HasConstraintName("FK_InsuredPolicy_InsuredSubscriber");
        });

        modelBuilder.Entity<InsuredSubscriber>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Carrier).WithMany(p => p.InsuredSubscribers).HasConstraintName("FK_InsuredSubscriber_BLPayer");

            entity.HasOne(d => d.City).WithMany(p => p.InsuredSubscribers)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_InsuredSubscriber_RegCities");

            entity.HasOne(d => d.Country).WithMany(p => p.InsuredSubscribers)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_InsuredSubscriber_RegCountries");

            entity.HasOne(d => d.PayerPackage).WithMany(p => p.InsuredSubscribers).HasConstraintName("FK_InsuredSubscriber_BLPayerPackage");

            entity.HasOne(d => d.State).WithMany(p => p.InsuredSubscribers)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_InsuredSubscriber_RegStates");
        });

        modelBuilder.Entity<LabOrderSetDetail>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            entity.Property(e => e.IsRadiologyTest).HasComment("2 = Pathalogy\r\n1 = Lab\r\n0 = Radiology");
        });

        modelBuilder.Entity<LabTest>(entity =>
        {
            entity.HasKey(e => e.LabTestId).HasName("PK_LabTestId");

            entity.Property(e => e.LabTestId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<Language>(entity =>
        {
            entity.HasKey(e => e.LanguageId).HasName("PK_LanguageId");

            entity.Property(e => e.LanguageId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<LoginUserHistory>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<Nationality>(entity =>
        {
            entity.HasKey(e => e.NationalityId).HasName("PK_NationalityId");

            entity.Property(e => e.NationalityId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<OrderReferral>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<PatientAlert>(entity =>
        {
            entity.Property(e => e.AlertId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<PatientAllergy>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Appointment).WithMany(p => p.PatientAllergies).HasConstraintName("FK_PatientAllergy_AppointmentId");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.PatientAllergyCreatedByNavigations).HasConstraintName("FK_PatientAllergy_CreatedBy");

            entity.HasOne(d => d.Provider).WithMany(p => p.PatientAllergyProviders).HasConstraintName("FK_PatientAllergy_ProviderId");

            entity.HasOne(d => d.SeverityCodeNavigation).WithMany(p => p.PatientAllergies).HasConstraintName("FK_PatientAllergy_Severity");

            entity.HasOne(d => d.Type).WithMany(p => p.PatientAllergies).HasConstraintName("FK_PatientAllergy_TypeId");

            entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.PatientAllergyUpdatedByNavigations).HasConstraintName("FK_PatientAllergy_UpdatedBy");
        });

        modelBuilder.Entity<PatientAllergyDetail>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<PatientBill>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            entity.Property(e => e.IsOraclePostedDelete).HasDefaultValue(false);
            entity.Property(e => e.IsPaymentPosted).HasDefaultValue(false);
            entity.Property(e => e.IsPaymentPostedDelete).HasDefaultValue(false);

            entity.HasOne(d => d.Procedure).WithMany(p => p.PatientBills)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PatientBill_BLSuperBillProcedure");
        });

        modelBuilder.Entity<PatientBillInvoice>(entity =>
        {
            entity.HasKey(e => e.InvoiceId).HasName("PK__PatientBillInvoi__7DA38D70");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Appointment).WithMany(p => p.PatientBillInvoices).HasConstraintName("FK_PatientBillInvoice_SchAppointment");
        });

        modelBuilder.Entity<PatientChartFamilyHistory>(entity =>
        {
            entity.HasOne(d => d.RelationShip).WithMany(p => p.PatientChartFamilyHistories).HasConstraintName("FK_PatientChartFamilyHistory_RegRelationShip");
        });

        modelBuilder.Entity<PatientImmunization>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PatientI__3214EC07517FDBEE");

            entity.HasOne(d => d.Appointment).WithMany(p => p.PatientImmunizations).HasConstraintName("FK_PatientImmunization_AppointmentId");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.PatientImmunizationCreatedByNavigations)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PatientImmunization_CreatedBy");

            entity.HasOne(d => d.DrugType).WithMany(p => p.PatientImmunizationDrugTypes).HasConstraintName("FK_PatientImmunization_DrugTypeId");

            entity.HasOne(d => d.ImmType).WithMany(p => p.PatientImmunizationImmTypes).HasConstraintName("FK_ImmunizationList_PatientImmunization");

            entity.HasOne(d => d.Provider).WithMany(p => p.PatientImmunizationProviders).HasConstraintName("FK_PatientImmunization_ProviderId");

            entity.HasOne(d => d.Route).WithMany(p => p.PatientImmunizations).HasConstraintName("FK_PatientImmunization_RouteId");

            entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.PatientImmunizationUpdatedByNavigations).HasConstraintName("FK_PatientImmunization_UpdatedBy");
        });

        modelBuilder.Entity<PatientNotifiedOption>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<PatientProblem>(entity =>
        {
            entity.HasOne(d => d.Appointment).WithMany(p => p.PatientProblems).HasConstraintName("FK_PatientProblemAppointment");

            entity.HasOne(d => d.Patient).WithMany(p => p.PatientProblems).HasConstraintName("FK_PatientProblemPatientId");
        });

        modelBuilder.Entity<PatientProcedure>(entity =>
        {
            entity.Property(e => e.Active).HasDefaultValue(1);
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            entity.Property(e => e.IsHl7msgCreated).HasDefaultValue(false);
            entity.Property(e => e.PerformedOnFacility).HasDefaultValue(true);
            entity.Property(e => e.ProcedureEndDateTime).HasDefaultValueSql("('')");
            entity.Property(e => e.ProcedurePriority).HasDefaultValue("");
            entity.Property(e => e.ProcedureType).HasDefaultValueSql("('')");

            entity.HasOne(d => d.Appointment).WithMany(p => p.PatientProcedures).HasConstraintName("FK_PatientProcedure_SchAppointment");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.PatientProcedureCreatedByNavigations).HasConstraintName("FK_CreatedBy_HREmployee");

            entity.HasOne(d => d.ProcedureTypeNavigation).WithMany(p => p.PatientProcedures).HasConstraintName("FK_ProcedureTypeId");

            entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.PatientProcedureUpdatedByNavigations).HasConstraintName("FK_UpdateBy_HREmployee");
        });

        modelBuilder.Entity<PatientProcedureType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PatientP__3214EC07C6A9C284");
        });

        modelBuilder.Entity<PatientVisitStatus>(entity =>
        {
            entity.HasKey(e => e.PatientVisitStatusId).HasName("PK_PatientVisitStatus_1");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Appointment).WithMany(p => p.PatientVisitStatuses).HasConstraintName("FK_PatientVisitStatus_SchAppointment");

            entity.HasOne(d => d.Status).WithMany(p => p.PatientVisitStatuses).HasConstraintName("FK_PatientVisitStatus_SchPatientStatus");

            entity.HasOne(d => d.VisitStatus).WithMany(p => p.PatientVisitStatuses).HasConstraintName("FK_PATIENTVISITSTATUS_VisitStatus");
        });

        modelBuilder.Entity<PersonalReminder>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<Prescription>(entity =>
        {
            entity.HasOne(d => d.Appointment).WithMany(p => p.Prescriptions).HasConstraintName("fk_appointment");

            entity.HasOne(d => d.Drug).WithMany(p => p.Prescriptions).HasConstraintName("FK_Prescription_TabsDrugName_DrugId");

            entity.HasOne(d => d.Provider).WithMany(p => p.Prescriptions).HasConstraintName("fk_provider");
        });

        modelBuilder.Entity<ProblemList>(entity =>
        {
            entity.HasKey(e => e.ProblemId).HasName("PK_ProblemId");

            entity.Property(e => e.ProblemId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<PromotionalMediaChannel>(entity =>
        {
            entity.HasKey(e => e.MediaChannelId).HasName("PK_MediaChannelId");

            entity.Property(e => e.MediaChannelId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<PromotionalMediaItem>(entity =>
        {
            entity.HasKey(e => e.MediaItemId).HasName("PK_MediaItemId");

            entity.Property(e => e.MediaItemId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<Provider>(entity =>
        {
            entity.ToView("Provider");

            entity.Property(e => e.EmployeeId).ValueGeneratedOnAdd();
        });

        modelBuilder.Entity<ProviderSchedule>(entity =>
        {
            entity.HasKey(e => e.Psid).HasName("PK_PSId");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Facility).WithMany(p => p.ProviderSchedules).HasConstraintName("FK_ProviderSchedule_RegFacility");

            entity.HasOne(d => d.Speciality).WithMany(p => p.ProviderSchedules).HasConstraintName("FK_ProviderSchedule_ProviderSpeciality");
        });

        modelBuilder.Entity<ProviderScheduleByAppType>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.AppType).WithMany(p => p.ProviderScheduleByAppTypes).HasConstraintName("FK_ProviderScheduleByAppType_SchAppointmentType");

            entity.HasOne(d => d.Ps).WithMany(p => p.ProviderScheduleByAppTypes)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProviderScheduleByAppType_ProviderSchedule");
        });

        modelBuilder.Entity<ProviderSpecialty>(entity =>
        {
            entity.Property(e => e.Active).HasDefaultValue(true);
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<ProviderSpecialtyAssign>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<RegAccount>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Patient).WithMany(p => p.RegAccounts).HasConstraintName("FK_RegAccount_RegPatientId");

            entity.HasOne(d => d.Relationship).WithMany(p => p.RegAccounts).HasConstraintName("FK_RegAccount_RegRelationshipId");
        });

        modelBuilder.Entity<RegAlertType>(entity =>
        {
            entity.HasKey(e => e.TypeId).HasName("PK_TypeIdAlert");

            entity.Property(e => e.TypeId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<RegAssignment>(entity =>
        {
            entity.Property(e => e.Active).HasDefaultValue(false);
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<RegBloodGroup>(entity =>
        {
            entity.HasKey(e => e.BloodGroupId).HasName("PK_BloodGroupId");

            entity.Property(e => e.BloodGroupId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<RegCity>(entity =>
        {
            entity.HasKey(e => e.CityId).HasName("PK_CityId");

            entity.Property(e => e.CityId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<RegCompany>(entity =>
        {
            entity.HasOne(d => d.CreatedBy).WithMany(p => p.RegCompanies).HasConstraintName("FK_RegCompany_HREmployee");
        });

        modelBuilder.Entity<RegCountry>(entity =>
        {
            entity.HasKey(e => e.CountryId).HasName("PK_CountryId");

            entity.Property(e => e.CountryId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<RegCreditCardType>(entity =>
        {
            entity.HasKey(e => e.TypeId).HasName("PK_TypeId");

            entity.Property(e => e.TypeId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<RegDebitCardType>(entity =>
        {
            entity.HasKey(e => e.TypeId).HasName("PK_TypeIdDebit");

            entity.Property(e => e.TypeId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<RegEmploymentStatus>(entity =>
        {
            entity.HasKey(e => e.EmpStatusId).HasName("PK_EmpStatusId");

            entity.Property(e => e.EmpStatusId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<RegEmploymentType>(entity =>
        {
            entity.HasKey(e => e.EmpTypeId).HasName("PK_EmpTypeId");

            entity.Property(e => e.EmpTypeId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<RegEthnicityType>(entity =>
        {
            entity.HasKey(e => e.TypeId).HasName("PK_TypeIdEthnicity");

            entity.Property(e => e.TypeId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<RegFacility>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__RegFacil__3214EC2756A1E454");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Company).WithMany(p => p.RegFacilities).HasConstraintName("FK_RegFacility_RegCompany");
        });

        modelBuilder.Entity<RegGender>(entity =>
        {
            entity.HasKey(e => e.GenderId).HasName("PK_GenderId");

            entity.Property(e => e.GenderId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<RegGenderIdentity>(entity =>
        {
            entity.HasKey(e => e.GenderId).HasName("PK__RegGende__4E24E9F7C883AD8E");

            entity.Property(e => e.Active).HasDefaultValue(true);
        });

        modelBuilder.Entity<RegLastMrno>(entity =>
        {
            entity.Property(e => e.Id).ValueGeneratedNever();
        });

        modelBuilder.Entity<RegLocation>(entity =>
        {
            entity.HasKey(e => e.LocationId).HasName("PK_LocationId");

            entity.Property(e => e.LocationId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<RegLocationType>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Facility).WithMany(p => p.RegLocationTypes).HasConstraintName("FK_RegLocationTypes_RegFacility");
        });

        modelBuilder.Entity<RegMaritalStatus>(entity =>
        {
            entity.HasKey(e => e.MaritalStatusId).HasName("PK_MaritalStatusId");

            entity.Property(e => e.MaritalStatusId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<RegOccupation>(entity =>
        {
            entity.HasKey(e => e.OccupationId).HasName("PK_OccupationId");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<RegPatient>(entity =>
        {
            entity.HasKey(e => e.PatientId).HasName("PK_PatientId");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.PatientBloodGroup).WithMany(p => p.RegPatients).HasConstraintName("FK_RegPatient_RegBloodGroup");

            entity.HasOne(d => d.TabsType).WithMany(p => p.RegPatients).HasConstraintName("FK_RegPatient_RegPateintTabsType");
        });

        modelBuilder.Entity<RegPatientAddress>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<RegPatientDetail>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.City).WithMany(p => p.RegPatientDetails).HasConstraintName("FK__RegPatien__RegCity");

            entity.HasOne(d => d.Gender).WithMany(p => p.RegPatientDetails).HasConstraintName("FK__RegPatien__RegGender");

            entity.HasOne(d => d.Location).WithMany(p => p.RegPatientDetails).HasConstraintName("FK__RegPatienDetails__RegLocations");

            entity.HasOne(d => d.Patient).WithMany(p => p.RegPatientDetails).HasConstraintName("FK_RegPatientDetails_RegPatientId");

            entity.HasOne(d => d.Provider).WithMany(p => p.RegPatientDetails).HasConstraintName("FK__RegPatien__HREmployee");

            entity.HasOne(d => d.Relationship).WithMany(p => p.RegPatientDetails).HasConstraintName("FK__RegPatienDetails__RegRelationShip");

            entity.HasOne(d => d.Site).WithMany(p => p.RegPatientDetails).HasConstraintName("FK__RegPatien__RegLocationType");

            entity.HasOne(d => d.State).WithMany(p => p.RegPatientDetails).HasConstraintName("FK__RegPatien__RegState");

            entity.HasOne(d => d.TabsType).WithMany(p => p.RegPatientDetails).HasConstraintName("FK_RegPatientDetails_RegPateintTabsType");
        });

        modelBuilder.Entity<RegPatientEmployer>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.EmploymentOccupation).WithMany(p => p.RegPatientEmployers).HasConstraintName("FK_RegPatientEmployer_RegOccupationId");

            entity.HasOne(d => d.EmploymentType).WithMany(p => p.RegPatientEmployers).HasConstraintName("FK_RegPatientEmployer_RegEmploymentTypeId");

            entity.HasOne(d => d.Patient).WithMany(p => p.RegPatientEmployers).HasConstraintName("FK_RegPatientEmployer_RegPatientId");
        });

        modelBuilder.Entity<RegPatientOld>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.PatientBloodGroup).WithMany().HasConstraintName("FK_RegPatientOld_RegBloodGroup");

            entity.HasOne(d => d.Patient).WithMany().HasConstraintName("FK_RegPatientOld_RegPatientId");

            entity.HasOne(d => d.TabsType).WithMany().HasConstraintName("FK_RegPatientOld_RegPateintTabsType");
        });

        modelBuilder.Entity<RegPatientTabsType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_RegPateintTabsType");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<RegPatientTemp>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Nokcity).WithMany(p => p.RegPatientTempNokcities).HasConstraintName("FK_NOK_RegPatientTemp_RegCities");

            entity.HasOne(d => d.Nokcountry).WithMany(p => p.RegPatientTempNokcountries).HasConstraintName("FK_NOK_RegPatientTemp_RegCountries");

            entity.HasOne(d => d.Nokstate).WithMany(p => p.RegPatientTempNokstates).HasConstraintName("FK_NOK_RegPatientTemp_RegStates");

            entity.HasOne(d => d.PersonCity).WithMany(p => p.RegPatientTempPersonCities).HasConstraintName("FK_RegPatientTemp_RegCities");

            entity.HasOne(d => d.PersonCountry).WithMany(p => p.RegPatientTempPersonCountries).HasConstraintName("FK_RegPatientTemp_RegCountries");

            entity.HasOne(d => d.PersonNationality).WithMany(p => p.RegPatientTemps).HasConstraintName("FK_RegPatientTemp_Nationality");

            entity.HasOne(d => d.PersonState).WithMany(p => p.RegPatientTempPersonStates).HasConstraintName("FK_RegPatientTemp_RegStates");

            entity.HasOne(d => d.PersonTitle).WithMany(p => p.RegPatientTemps).HasConstraintName("FK_RegPatientTemp_RegTitle");
        });

        modelBuilder.Entity<RegRelationShip>(entity =>
        {
            entity.HasKey(e => e.RelationshipId).HasName("PK_RelationshipId");

            entity.Property(e => e.RelationshipId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<RegState>(entity =>
        {
            entity.HasKey(e => e.StateId).HasName("PK_StateID");

            entity.Property(e => e.StateId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<RegTitle>(entity =>
        {
            entity.HasKey(e => e.TitleId).HasName("PK_TitleId");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<Religion>(entity =>
        {
            entity.HasKey(e => e.ReligionId).HasName("PK_ReligionId");

            entity.Property(e => e.ReligionId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<ReschedulingReason>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<SchAppointment>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.AppCriteria).WithMany(p => p.SchAppointments).HasConstraintName("FK_SchAppointment_SchAppointmentCriteria");

            entity.HasOne(d => d.AppStatus).WithMany(p => p.SchAppointments)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SchAppointment_SchAppointmentStatus");

            entity.HasOne(d => d.Employee).WithMany(p => p.SchAppointments).HasConstraintName("FK_SchAppointment_HrEmployee");

            entity.HasOne(d => d.Facility).WithMany(p => p.SchAppointments).HasConstraintName("FK_SchAppointment_RegFacility");

            entity.HasOne(d => d.Patient).WithMany(p => p.SchAppointments).HasConstraintName("FK_SchAppointment_RegPatient");

            entity.HasOne(d => d.PatientNotified).WithMany(p => p.SchAppointments).HasConstraintName("FK_SchAppointment_PatientNotifiedOptions");

            entity.HasOne(d => d.PatientStatus).WithMany(p => p.SchAppointments)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SchAppointment_SchPatientStatus");

            entity.HasOne(d => d.Payer).WithMany(p => p.SchAppointments).HasConstraintName("FK_SchAppointment_BLPayer");

            entity.HasOne(d => d.Plan).WithMany(p => p.SchAppointments).HasConstraintName("FK_SchAppointment_BLPayerPlan");

            entity.HasOne(d => d.PurposeOfVisitNavigation).WithMany(p => p.SchAppointments).HasConstraintName("FK_SchAppointment_ProblemList");

            entity.HasOne(d => d.Rescheduled).WithMany(p => p.SchAppointments).HasConstraintName("FK_SchAppointment_ReschedulingReasons");

            entity.HasOne(d => d.Site).WithMany(p => p.SchAppointments)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SchAppointment_RegLocationTypes");

            entity.HasOne(d => d.Subscriber).WithMany(p => p.SchAppointments).HasConstraintName("FK_SchAppointment_InsuredSubscriber");

            entity.HasOne(d => d.VisitStatus).WithMany(p => p.SchAppointments).HasConstraintName("FK_SchAppointment_VisitStatus");

            entity.HasOne(d => d.VisitType).WithMany(p => p.SchAppointments).HasConstraintName("FK_SchAppointment_VisitType");
        });

        modelBuilder.Entity<SchAppointmentCriterion>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<SchAppointmentStatus>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<SchAppointmentType>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<SchBlockTimeslot>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<SchPatientCall>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<SchPatientStatus>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<SecEmployeeRole>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Employee).WithMany(p => p.SecEmployeeRoles)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SecEmployeeRole_HREmployee");

            entity.HasOne(d => d.Role).WithMany(p => p.SecEmployeeRoles).HasConstraintName("FK_SecEmployeeRole_SecRole");
        });

        modelBuilder.Entity<SecModule>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<SecModuleForm>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Module).WithMany(p => p.SecModuleForms)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SecModuleForm_SecModule");
        });

        modelBuilder.Entity<SecPrivilege>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<SecPrivilegesAssignedRole>(entity =>
        {
            entity.HasKey(e => e.RolePrivilegeId).HasName("PK_SecPrivilegesAssignedRole_1");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.FormPrivilege).WithMany(p => p.SecPrivilegesAssignedRoles)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SecPrivil__SecPrivilegesAvailableForm");

            entity.HasOne(d => d.Role).WithMany(p => p.SecPrivilegesAssignedRoles)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SecPrivil__SecRoleI");
        });

        modelBuilder.Entity<SecPrivilegesAvailableForm>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Form).WithMany(p => p.SecPrivilegesAvailableForms)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SecPrivilegesAvailableForm_SecModuleForm");

            entity.HasOne(d => d.Privilege).WithMany(p => p.SecPrivilegesAvailableForms)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SecPrivil__SecPrivileges");
        });

        modelBuilder.Entity<SecRole>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<SecRoleForm>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Form).WithMany(p => p.SecRoleForms)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SecRoleForm_SecModuleForm");
        });

        modelBuilder.Entity<Servicecategory>(entity =>
        {
            entity.HasKey(e => e.ServiceCategoryId).HasName("PK__SERVICEC__E4CC7EAA3BB64236");

            entity.Property(e => e.ServiceCategoryId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<SeverityType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Severity__3214EC0747E0F56B");
        });

        modelBuilder.Entity<SocialFamilyHistoryMaster>(entity =>
        {
            entity.Property(e => e.Shid).ValueGeneratedOnAdd();
        });

        modelBuilder.Entity<SpeechToText>(entity =>
        {
            entity.HasOne(d => d.Patient).WithMany(p => p.SpeechToTexts)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SpeechToText_RegPatient");
        });

        modelBuilder.Entity<TabDrugsName>(entity =>
        {
            entity.HasKey(e => e.DrugId).HasName("PK_TabsDrugName_DrugId");
        });

        modelBuilder.Entity<TabDrugsNameBackup>(entity =>
        {
            entity.Property(e => e.NewDrugId).ValueGeneratedOnAdd();
        });

        modelBuilder.Entity<Task>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<TaskForwarding>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.ReceiverRole).WithMany(p => p.TaskForwardings)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__TaskForwa__SecRole");
        });

        modelBuilder.Entity<TaskType>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<Teacher>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_Teacher-Name");
        });

        modelBuilder.Entity<TestTableType>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<TypeOfServiceMaster>(entity =>
        {
            entity.Property(e => e.ServiceTypeId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<UppInsuranceClaim>(entity =>
        {
            entity.HasKey(e => e.InsuranceId).HasName("PK__UPP_Insu__74231A24A45695B6");

            entity.Property(e => e.Active).HasDefaultValue(true);
            entity.Property(e => e.CreatedDate).HasDefaultValueSql("(getdate())");
        });

        modelBuilder.Entity<VisitStatus>(entity =>
        {
            entity.HasKey(e => e.VisitStatusId).HasName("PK__VisitSta__8013A2D38F0919E1");

            entity.Property(e => e.VisitStatusId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<VisitType>(entity =>
        {
            entity.HasKey(e => e.VisitTypeId).HasName("PK_VisitTypeId");

            entity.Property(e => e.VisitTypeId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<VitalSign>(entity =>
        {
            entity.HasOne(d => d.Appointment).WithMany(p => p.VitalSigns).HasConstraintName("FK_VitalSigns_SchAppointment");
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
