using System;
using System.Collections.Generic;
using HMIS.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Context;

public partial class HMISDbContext : DbContext
{
    public HMISDbContext()
    {
    }

    public HMISDbContext(DbContextOptions<HMISDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Action> Action { get; set; }

    public virtual DbSet<AlergyTypes> AlergyTypes { get; set; }

    public virtual DbSet<Assingment> Assingment { get; set; }

    public virtual DbSet<AuditLog> AuditLog { get; set; }

    public virtual DbSet<AvailableMrno> AvailableMrno { get; set; }

    public virtual DbSet<BlEclaimEncounterEndType> BlEclaimEncounterEndType { get; set; }

    public virtual DbSet<BlEclaimEncounterStartType> BlEclaimEncounterStartType { get; set; }

    public virtual DbSet<BlEclaimEncounterType> BlEclaimEncounterType { get; set; }

    public virtual DbSet<BlProceduresGroup> BlProceduresGroup { get; set; }

    public virtual DbSet<Blcptgroup> Blcptgroup { get; set; }

    public virtual DbSet<BlcptgroupCode> BlcptgroupCode { get; set; }

    public virtual DbSet<BlcptmasterRanges> BlcptmasterRanges { get; set; }

    public virtual DbSet<BldentalGroup> BldentalGroup { get; set; }

    public virtual DbSet<BldentalGroupCode> BldentalGroupCode { get; set; }

    public virtual DbSet<BleligibilityLog> BleligibilityLog { get; set; }

    public virtual DbSet<Blhcpcsgroup> Blhcpcsgroup { get; set; }

    public virtual DbSet<BlhcpcsgroupCode> BlhcpcsgroupCode { get; set; }

    public virtual DbSet<Blicd9cmgroup> Blicd9cmgroup { get; set; }

    public virtual DbSet<Blicd9cmgroupCode> Blicd9cmgroupCode { get; set; }

    public virtual DbSet<Blicdversion> Blicdversion { get; set; }

    public virtual DbSet<BlmasterCpt> BlmasterCpt { get; set; }

    public virtual DbSet<BlmasterDentalCodes> BlmasterDentalCodes { get; set; }

    public virtual DbSet<BlmasterHcpcs> BlmasterHcpcs { get; set; }

    public virtual DbSet<BlmasterIcd9cm> BlmasterIcd9cm { get; set; }

    public virtual DbSet<BlmasterIrdrg> BlmasterIrdrg { get; set; }

    public virtual DbSet<BlmasterProcedures> BlmasterProcedures { get; set; }

    public virtual DbSet<BlmasterWeqaya> BlmasterWeqaya { get; set; }

    public virtual DbSet<BlpatientVisit> BlpatientVisit { get; set; }

    public virtual DbSet<Blpayer> Blpayer { get; set; }

    public virtual DbSet<BlpayerPackage> BlpayerPackage { get; set; }

    public virtual DbSet<BlpayerPlan> BlpayerPlan { get; set; }

    public virtual DbSet<BlprocedureGroupCode> BlprocedureGroupCode { get; set; }

    public virtual DbSet<BlsitePointOfSale> BlsitePointOfSale { get; set; }

    public virtual DbSet<BlsuperBillDiagnosis> BlsuperBillDiagnosis { get; set; }

    public virtual DbSet<BlsuperBillProcedure> BlsuperBillProcedure { get; set; }

    public virtual DbSet<BlsuperBillProcedureInvoice> BlsuperBillProcedureInvoice { get; set; }

    public virtual DbSet<BlunclassifiedCodes> BlunclassifiedCodes { get; set; }

    public virtual DbSet<BluniversalToothCodes> BluniversalToothCodes { get; set; }

    public virtual DbSet<CacheInfo> CacheInfo { get; set; }

    public virtual DbSet<Cases> Cases { get; set; }

    public virtual DbSet<City> City { get; set; }

    public virtual DbSet<ClinicalUsage> ClinicalUsage { get; set; }

    public virtual DbSet<Consultationcategory> Consultationcategory { get; set; }

    public virtual DbSet<CptbyAppType> CptbyAppType { get; set; }

    public virtual DbSet<CptsInCptbyAppType> CptsInCptbyAppType { get; set; }

    public virtual DbSet<CryoContainers> CryoContainers { get; set; }

    public virtual DbSet<CryoLevelA> CryoLevelA { get; set; }

    public virtual DbSet<CryoLevelB> CryoLevelB { get; set; }

    public virtual DbSet<CryoLevelC> CryoLevelC { get; set; }

    public virtual DbSet<DeductiblePercent> DeductiblePercent { get; set; }

    public virtual DbSet<DocumentUpload> DocumentUpload { get; set; }

    public virtual DbSet<DropdownCategory> DropdownCategory { get; set; }

    public virtual DbSet<DropdownConfiguration> DropdownConfiguration { get; set; }

    public virtual DbSet<EligibilityLog> EligibilityLog { get; set; }

    public virtual DbSet<EmirateType> EmirateType { get; set; }

    public virtual DbSet<Emrfrequency> Emrfrequency { get; set; }

    public virtual DbSet<EmrnoteQuestionRemoved> EmrnoteQuestionRemoved { get; set; }

    public virtual DbSet<EmrnoteVoiceinText> EmrnoteVoiceinText { get; set; }

    public virtual DbSet<EmrnotesEncounterPath> EmrnotesEncounterPath { get; set; }

    public virtual DbSet<EmrnotesPathQuestion> EmrnotesPathQuestion { get; set; }

    public virtual DbSet<EmrnotesQuestion> EmrnotesQuestion { get; set; }

    public virtual DbSet<EmrproviderEncounterPath> EmrproviderEncounterPath { get; set; }

    public virtual DbSet<Emrroute> Emrroute { get; set; }

    public virtual DbSet<Emrsite> Emrsite { get; set; }

    public virtual DbSet<EntityTypes> EntityTypes { get; set; }

    public virtual DbSet<FamilyProblemList> FamilyProblemList { get; set; }

    public virtual DbSet<FeeSchedule> FeeSchedule { get; set; }

    public virtual DbSet<FinancialClass> FinancialClass { get; set; }

    public virtual DbSet<HiePatientDemographicsOutboundQueue> HiePatientDemographicsOutboundQueue { get; set; }

    public virtual DbSet<HolidaySchedule> HolidaySchedule { get; set; }

    public virtual DbSet<Hremployee> Hremployee { get; set; }

    public virtual DbSet<HremployeeFacility> HremployeeFacility { get; set; }

    public virtual DbSet<HremployeeType> HremployeeType { get; set; }

    public virtual DbSet<HrlicenseInfo> HrlicenseInfo { get; set; }

    public virtual DbSet<ImmunizationList> ImmunizationList { get; set; }

    public virtual DbSet<InsuranceCompanyFieldMapping> InsuranceCompanyFieldMapping { get; set; }

    public virtual DbSet<InsuranceEligibility> InsuranceEligibility { get; set; }

    public virtual DbSet<InsuranceRelations> InsuranceRelations { get; set; }

    public virtual DbSet<InsuranceRequestType> InsuranceRequestType { get; set; }

    public virtual DbSet<Insured> Insured { get; set; }

    public virtual DbSet<InsuredCoverage> InsuredCoverage { get; set; }

    public virtual DbSet<InsuredPolicy> InsuredPolicy { get; set; }

    public virtual DbSet<InsuredSubscriber> InsuredSubscriber { get; set; }

    public virtual DbSet<InvestigationType> InvestigationType { get; set; }

    public virtual DbSet<Ivfmain> Ivfmain { get; set; }

    public virtual DbSet<IvfmaleFertilityHistory> IvfmaleFertilityHistory { get; set; }

    public virtual DbSet<IvfmaleFhfurtherPlanning> IvfmaleFhfurtherPlanning { get; set; }

    public virtual DbSet<IvfmaleFhgeneral> IvfmaleFhgeneral { get; set; }

    public virtual DbSet<IvfmaleFhgenetics> IvfmaleFhgenetics { get; set; }

    public virtual DbSet<IvfmaleFhidiopathic> IvfmaleFhidiopathic { get; set; }

    public virtual DbSet<IvfmaleFhillness> IvfmaleFhillness { get; set; }

    public virtual DbSet<IvfmaleFhillnessIdiopathic> IvfmaleFhillnessIdiopathic { get; set; }

    public virtual DbSet<IvfmaleFhimpairmentFactor> IvfmaleFhimpairmentFactor { get; set; }

    public virtual DbSet<IvfmaleFhinfections> IvfmaleFhinfections { get; set; }

    public virtual DbSet<IvfmaleFhperformedTreatment> IvfmaleFhperformedTreatment { get; set; }

    public virtual DbSet<IvfmaleFhperformedTreatmentYear> IvfmaleFhperformedTreatmentYear { get; set; }

    public virtual DbSet<IvfmaleFhprevIllness> IvfmaleFhprevIllness { get; set; }

    public virtual DbSet<IvfmaleFhsemenAnalysis> IvfmaleFhsemenAnalysis { get; set; }

    public virtual DbSet<IvfmaleFhtesticlesAndSem> IvfmaleFhtesticlesAndSem { get; set; }

    public virtual DbSet<IvfmaleSemenMorphology> IvfmaleSemenMorphology { get; set; }

    public virtual DbSet<IvfmaleSemenMotility> IvfmaleSemenMotility { get; set; }

    public virtual DbSet<IvfmaleSemenObservation> IvfmaleSemenObservation { get; set; }

    public virtual DbSet<IvfmaleSemenObservationPreparation> IvfmaleSemenObservationPreparation { get; set; }

    public virtual DbSet<IvfmaleSemenObservationPreparationMethod> IvfmaleSemenObservationPreparationMethod { get; set; }

    public virtual DbSet<IvfmaleSemenSample> IvfmaleSemenSample { get; set; }

    public virtual DbSet<IvfmaleSemenSampleApprovalStatus> IvfmaleSemenSampleApprovalStatus { get; set; }

    public virtual DbSet<IvfmaleSemenSampleDiagnosis> IvfmaleSemenSampleDiagnosis { get; set; }

    public virtual DbSet<LabOrderSet> LabOrderSet { get; set; }

    public virtual DbSet<LabOrderSetDetail> LabOrderSetDetail { get; set; }

    public virtual DbSet<LabResultsMain> LabResultsMain { get; set; }

    public virtual DbSet<LabResultsObservation> LabResultsObservation { get; set; }

    public virtual DbSet<LabSampleTypes> LabSampleTypes { get; set; }

    public virtual DbSet<LabTests> LabTests { get; set; }

    public virtual DbSet<Laboratories> Laboratories { get; set; }

    public virtual DbSet<Language> Language { get; set; }

    public virtual DbSet<LoginUserHistory> LoginUserHistory { get; set; }

    public virtual DbSet<MedicationComments> MedicationComments { get; set; }

    public virtual DbSet<Nationality> Nationality { get; set; }

    public virtual DbSet<Notification> Notification { get; set; }

    public virtual DbSet<OrderReferral> OrderReferral { get; set; }

    public virtual DbSet<PatientAlerts> PatientAlerts { get; set; }

    public virtual DbSet<PatientAllergy> PatientAllergy { get; set; }

    public virtual DbSet<PatientAllergyDetail> PatientAllergyDetail { get; set; }

    public virtual DbSet<PatientBill> PatientBill { get; set; }

    public virtual DbSet<PatientBillInvoice> PatientBillInvoice { get; set; }

    public virtual DbSet<PatientChartFamilyHistory> PatientChartFamilyHistory { get; set; }

    public virtual DbSet<PatientChartSocialHistory> PatientChartSocialHistory { get; set; }

    public virtual DbSet<PatientImmunization> PatientImmunization { get; set; }

    public virtual DbSet<PatientNotifiedOptions> PatientNotifiedOptions { get; set; }

    public virtual DbSet<PatientProblem> PatientProblem { get; set; }

    public virtual DbSet<PatientProcedure> PatientProcedure { get; set; }

    public virtual DbSet<PatientProcedureType> PatientProcedureType { get; set; }

    public virtual DbSet<PatientVisitStatus> PatientVisitStatus { get; set; }

    public virtual DbSet<PersonalReminders> PersonalReminders { get; set; }

    public virtual DbSet<Prescription> Prescription { get; set; }

    public virtual DbSet<ProblemList> ProblemList { get; set; }

    public virtual DbSet<ProcedureType> ProcedureType { get; set; }

    public virtual DbSet<PromotionalMediaChannel> PromotionalMediaChannel { get; set; }

    public virtual DbSet<PromotionalMediaItem> PromotionalMediaItem { get; set; }

    public virtual DbSet<Provider> Provider { get; set; }

    public virtual DbSet<ProviderSchedule> ProviderSchedule { get; set; }

    public virtual DbSet<ProviderScheduleByAppType> ProviderScheduleByAppType { get; set; }

    public virtual DbSet<ProviderSpecialty> ProviderSpecialty { get; set; }

    public virtual DbSet<ProviderSpecialtyAssign> ProviderSpecialtyAssign { get; set; }

    public virtual DbSet<RegAccount> RegAccount { get; set; }

    public virtual DbSet<RegAlertTypes> RegAlertTypes { get; set; }

    public virtual DbSet<RegAssignments> RegAssignments { get; set; }

    public virtual DbSet<RegBloodGroup> RegBloodGroup { get; set; }

    public virtual DbSet<RegCities> RegCities { get; set; }

    public virtual DbSet<RegCompany> RegCompany { get; set; }

    public virtual DbSet<RegCountries> RegCountries { get; set; }

    public virtual DbSet<RegCreditCardTypes> RegCreditCardTypes { get; set; }

    public virtual DbSet<RegDebitCardTypes> RegDebitCardTypes { get; set; }

    public virtual DbSet<RegEmploymentStatus> RegEmploymentStatus { get; set; }

    public virtual DbSet<RegEmploymentType> RegEmploymentType { get; set; }

    public virtual DbSet<RegEthnicityTypes> RegEthnicityTypes { get; set; }

    public virtual DbSet<RegFacility> RegFacility { get; set; }

    public virtual DbSet<RegGender> RegGender { get; set; }

    public virtual DbSet<RegGenderIdentity> RegGenderIdentity { get; set; }

    public virtual DbSet<RegLastMrno> RegLastMrno { get; set; }

    public virtual DbSet<RegLocationTypes> RegLocationTypes { get; set; }

    public virtual DbSet<RegLocations> RegLocations { get; set; }

    public virtual DbSet<RegMaritalStatus> RegMaritalStatus { get; set; }

    public virtual DbSet<RegOccupation> RegOccupation { get; set; }

    public virtual DbSet<RegPatient> RegPatient { get; set; }

    public virtual DbSet<RegPatientAddress> RegPatientAddress { get; set; }

    public virtual DbSet<RegPatientDetails> RegPatientDetails { get; set; }

    public virtual DbSet<RegPatientEmployer> RegPatientEmployer { get; set; }

    public virtual DbSet<RegPatientOld> RegPatientOld { get; set; }

    public virtual DbSet<RegPatientRelation> RegPatientRelation { get; set; }

    public virtual DbSet<RegPatientTabsType> RegPatientTabsType { get; set; }

    public virtual DbSet<RegPatientTemp> RegPatientTemp { get; set; }

    public virtual DbSet<RegRelationInverseMap> RegRelationInverseMap { get; set; }

    public virtual DbSet<RegRelationShip> RegRelationShip { get; set; }

    public virtual DbSet<RegStates> RegStates { get; set; }

    public virtual DbSet<RegTitle> RegTitle { get; set; }

    public virtual DbSet<Religion> Religion { get; set; }

    public virtual DbSet<ReschedulingReasons> ReschedulingReasons { get; set; }

    public virtual DbSet<SchAppointment> SchAppointment { get; set; }

    public virtual DbSet<SchAppointmentCriteria> SchAppointmentCriteria { get; set; }

    public virtual DbSet<SchAppointmentStatus> SchAppointmentStatus { get; set; }

    public virtual DbSet<SchAppointmentType> SchAppointmentType { get; set; }

    public virtual DbSet<SchBlockTimeslots> SchBlockTimeslots { get; set; }

    public virtual DbSet<SchPatientCall> SchPatientCall { get; set; }

    public virtual DbSet<SchPatientStatus> SchPatientStatus { get; set; }

    public virtual DbSet<SecEmployeeRole> SecEmployeeRole { get; set; }

    public virtual DbSet<SecModule> SecModule { get; set; }

    public virtual DbSet<SecModuleForm> SecModuleForm { get; set; }

    public virtual DbSet<SecPrivileges> SecPrivileges { get; set; }

    public virtual DbSet<SecPrivilegesAssignedRole> SecPrivilegesAssignedRole { get; set; }

    public virtual DbSet<SecPrivilegesAvailableForm> SecPrivilegesAvailableForm { get; set; }

    public virtual DbSet<SecRole> SecRole { get; set; }

    public virtual DbSet<SecRoleForm> SecRoleForm { get; set; }

    public virtual DbSet<Servicecategory> Servicecategory { get; set; }

    public virtual DbSet<SeverityType> SeverityType { get; set; }

    public virtual DbSet<SocialFamilyHistoryMaster> SocialFamilyHistoryMaster { get; set; }

    public virtual DbSet<SpeechToText> SpeechToText { get; set; }

    public virtual DbSet<StudentCourses> StudentCourses { get; set; }

    public virtual DbSet<StudentInfo> StudentInfo { get; set; }

    public virtual DbSet<StudentPortal> StudentPortal { get; set; }

    public virtual DbSet<TabDrugsName> TabDrugsName { get; set; }

    public virtual DbSet<TabDrugsNameBackup> TabDrugsNameBackup { get; set; }

    public virtual DbSet<Task> Task { get; set; }

    public virtual DbSet<TaskForwarding> TaskForwarding { get; set; }

    public virtual DbSet<TaskType> TaskType { get; set; }

    public virtual DbSet<Teacher> Teacher { get; set; }

    public virtual DbSet<TestTableType> TestTableType { get; set; }

    public virtual DbSet<TypeOfServiceMaster> TypeOfServiceMaster { get; set; }

    public virtual DbSet<UppInsuranceClaims> UppInsuranceClaims { get; set; }

    public virtual DbSet<VisitStatus> VisitStatus { get; set; }

    public virtual DbSet<VisitType> VisitType { get; set; }

    public virtual DbSet<VitalSigns> VitalSigns { get; set; }

    public virtual DbSet<VwAllActivePatients> VwAllActivePatients { get; set; }

    public virtual DbSet<VwGetDurationTimeSlot> VwGetDurationTimeSlot { get; set; }

    public virtual DbSet<VwProviderByFacilityId> VwProviderByFacilityId { get; set; }

    public virtual DbSet<VwProviderbySiteid> VwProviderbySiteid { get; set; }

    public virtual DbSet<VwRegPatientAndAppointmentdetails> VwRegPatientAndAppointmentdetails { get; set; }

    public virtual DbSet<VwSiteByproviderId> VwSiteByproviderId { get; set; }

    public virtual DbSet<VwSitebySpecialityid> VwSitebySpecialityid { get; set; }

    public virtual DbSet<VwSpecialityByEmployeeId> VwSpecialityByEmployeeId { get; set; }

    public virtual DbSet<VwSpecialitybyFacilityid> VwSpecialitybyFacilityid { get; set; }

    public virtual DbSet<Vwprovider> Vwprovider { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=175.107.195.221;Database=HMISCOH;User Id=Tekno;Password=123qwe@;Encrypt=False;TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Action>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<AlergyTypes>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.HasIndex(e => e.FormName, "IX_AuditLog_FormName").HasFilter("([FormName] IS NOT NULL)");

            entity.HasIndex(e => e.UserName, "IX_AuditLog_UserName").HasFilter("([UserName] IS NOT NULL)");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Action).WithMany(p => p.AuditLog).HasConstraintName("FK__AuditLog__Action__2DE6D218");

            entity.HasOne(d => d.UserLoginHistory).WithMany(p => p.AuditLog).HasConstraintName("FK__AuditLog__UserLo__32AB8735");
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

            entity.HasOne(d => d.ProcedureType).WithMany(p => p.BlProceduresGroup).HasConstraintName("FK_BL_Group_Procedure_Type");
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

            entity.HasOne(d => d.Group).WithMany(p => p.BlcptgroupCode)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BLCPTGroupCode_BLCPTGroup");
        });

        modelBuilder.Entity<BlcptmasterRanges>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.ServiceType).WithMany(p => p.BlcptmasterRanges)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BLCPTMasterRanges_TypeOfServiceMaster");
        });

        modelBuilder.Entity<BldentalGroup>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<BldentalGroupCode>(entity =>
        {
            entity.HasKey(e => new { e.GroupCodeId, e.GroupId, e.DentalCode }).HasName("PK_BLDentalGroupCode_1");

            entity.Property(e => e.GroupCodeId).ValueGeneratedOnAdd();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.DentalCodeNavigation).WithMany(p => p.BldentalGroupCode)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BLDentalGroupCode_BLMasterDentalCodes");

            entity.HasOne(d => d.Group).WithMany(p => p.BldentalGroupCode)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BLDentalGroupCode_BLDentalGroup");
        });

        modelBuilder.Entity<BleligibilityLog>(entity =>
        {
            entity.HasIndex(e => e.MessageRequestDate, "IX_BleligibilityLog_MessageRequestDate").HasFilter("([MessageRequestDate] IS NOT NULL)");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Appointment).WithMany(p => p.BleligibilityLog).HasConstraintName("FK_BLEligibilityLog_SchAppointment");
        });

        modelBuilder.Entity<Blhcpcsgroup>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<BlhcpcsgroupCode>(entity =>
        {
            entity.Property(e => e.GroupCodeId).ValueGeneratedOnAdd();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Group).WithMany(p => p.BlhcpcsgroupCode)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BLHCPCSGroupCode_BLHCPCSGroup");

            entity.HasOne(d => d.HcpcscodeNavigation).WithMany(p => p.BlhcpcsgroupCode)
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

            entity.HasOne(d => d.Group).WithMany(p => p.Blicd9cmgroupCode)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BLICD9CMGroupCode_BLICD9CMGroup");

            entity.HasOne(d => d.Icd9codeNavigation).WithMany(p => p.Blicd9cmgroupCode)
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

        modelBuilder.Entity<BlmasterDentalCodes>(entity =>
        {
            entity.HasKey(e => e.DentalCode).HasName("PK_DentalCode");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<BlmasterHcpcs>(entity =>
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

        modelBuilder.Entity<BlmasterProcedures>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_Procedures");

            entity.Property(e => e.ItemName).IsFixedLength();

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.BlmasterProceduresCreatedByNavigation).HasConstraintName("FK_Procedures_CreatedBy");

            entity.HasOne(d => d.ProcedureType).WithMany(p => p.BlmasterProcedures).HasConstraintName("FK_Procedures_Procedures_types");

            entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.BlmasterProceduresUpdatedByNavigation).HasConstraintName("FK_Procedures_UpdatedBy");
        });

        modelBuilder.Entity<BlmasterWeqaya>(entity =>
        {
            entity.HasKey(e => e.WeqayaId).HasName("PK_WeqayaId");

            entity.Property(e => e.WeqayaId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<BlpatientVisit>(entity =>
        {
            entity.HasIndex(e => e.VisitAccountNo, "IX_BlPatientVisit_VisitAccountNo").HasFilter("([VisitAccountNo] IS NOT NULL)");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Appointment).WithMany(p => p.BlpatientVisit).HasConstraintName("FK_BLPatientVisit_SchAppointment");

            entity.HasOne(d => d.Payer).WithMany(p => p.BlpatientVisit).HasConstraintName("FK_BLPatientVisit_BLPayer");

            entity.HasOne(d => d.Subscriber).WithMany(p => p.BlpatientVisit).HasConstraintName("FK_BLPatientVisit_InsuredSubscriber");
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

            entity.HasOne(d => d.Payer).WithMany(p => p.BlpayerPackage).HasConstraintName("FK_BLPayerPackage_BLPayer");
        });

        modelBuilder.Entity<BlpayerPlan>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Payer).WithMany(p => p.BlpayerPlan)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BLPayerPlan_BLPayer");
        });

        modelBuilder.Entity<BlprocedureGroupCode>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__BLProced__3214EC079A1BA76F");

            entity.HasOne(d => d.Payer).WithMany(p => p.BlprocedureGroupCode).HasConstraintName("FK_BLProcedureGroupCode_ProcedureMasterId");

            entity.HasOne(d => d.ProcedureGroup).WithMany(p => p.BlprocedureGroupCode).HasConstraintName("FK_BLProcedureGroupCode_GroupId");

            entity.HasOne(d => d.ProcedureMaster).WithMany(p => p.BlprocedureGroupCode).HasConstraintName("FK_BLProcedureGroupCode_PayerId");

            entity.HasOne(d => d.ProcedureType).WithMany(p => p.BlprocedureGroupCode).HasConstraintName("FK_BLProcedureGroupCode_ProcedureTypeId");
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

            entity.HasOne(d => d.Appointment).WithMany(p => p.BlsuperBillDiagnosis).HasConstraintName("FK_BLSuperBillDiagnosis_SchAppointment");

            entity.HasOne(d => d.Icd9codeNavigation).WithMany(p => p.BlsuperBillDiagnosis).HasConstraintName("FK_BLSuperBillDiagnosis_BLMasterICD9CM");

            entity.HasOne(d => d.Icdversion).WithMany(p => p.BlsuperBillDiagnosis).HasConstraintName("FK_BLSuperBillDiagnosis_BLICDVersion");
        });

        modelBuilder.Entity<BlsuperBillProcedure>(entity =>
        {
            entity.Property(e => e.Covered).HasDefaultValue(true);
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            entity.Property(e => e.IsHl7msgCreated).HasDefaultValue(false);

            entity.HasOne(d => d.Appointment).WithMany(p => p.BlsuperBillProcedure).HasConstraintName("FK_BLSuperBillProcedure_SchAppointment");
        });

        modelBuilder.Entity<BlsuperBillProcedureInvoice>(entity =>
        {
            entity.Property(e => e.Description).HasComment("Contains provider code");
            entity.Property(e => e.InvoiceStatusPosted).HasDefaultValue(false);
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            entity.Property(e => e.IsHl7msgCreated).HasDefaultValue(false);

            entity.HasOne(d => d.Appointent).WithMany(p => p.BlsuperBillProcedureInvoice).HasConstraintName("FK_BLSuperBillProcedureInvoice_SchAppointment");
        });

        modelBuilder.Entity<BlunclassifiedCodes>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<BluniversalToothCodes>(entity =>
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

        modelBuilder.Entity<Cases>(entity =>
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
            entity.HasOne(d => d.AppType).WithMany(p => p.CptbyAppType)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CPTByAppType_SchAppointmentType");
        });

        modelBuilder.Entity<CptsInCptbyAppType>(entity =>
        {
            entity.HasOne(d => d.Group).WithMany(p => p.CptsInCptbyAppType)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CPTsInCPTByAppType_CPTByAppType");
        });

        modelBuilder.Entity<CryoContainers>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Cryo_Con__3214EC27B2AC8892");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");
        });

        modelBuilder.Entity<CryoLevelA>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Cryo_Lev__3214EC27FFA90B71");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Container).WithMany(p => p.CryoLevelA)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Cryo_Leve__Conta__43E1002F");
        });

        modelBuilder.Entity<CryoLevelB>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Cryo_Lev__3214EC27172594AE");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.LevelA).WithMany(p => p.CryoLevelB)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Cryo_Leve__Level__48A5B54C");
        });

        modelBuilder.Entity<CryoLevelC>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Cryo_Lev__3214EC270D952296");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Status).HasDefaultValue("Available");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.LevelB).WithMany(p => p.CryoLevelC)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Cryo_Leve__Level__541767F8");
        });

        modelBuilder.Entity<DeductiblePercent>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Subscriber).WithMany(p => p.DeductiblePercent)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DeductiblePercent_InsuredSubscriber");
        });

        modelBuilder.Entity<DocumentUpload>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Document__3214EC07B46B22F3");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            entity.Property(e => e.UploadedDate).HasDefaultValueSql("(getdate())");
        });

        modelBuilder.Entity<DropdownCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__Dropdown__19093A0B926B72D2");
        });

        modelBuilder.Entity<DropdownConfiguration>(entity =>
        {
            entity.HasKey(e => e.ValueId).HasName("PK__Dropdown__93364E485C5ACFCE");

            entity.Property(e => e.IsActive).HasDefaultValue(true);

            entity.HasOne(d => d.Category).WithMany(p => p.DropdownConfiguration)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DropdownC__Categ__2EB0D91F");
        });

        modelBuilder.Entity<EligibilityLog>(entity =>
        {
            entity.HasOne(d => d.Facility).WithMany(p => p.EligibilityLog).HasConstraintName("FK_EligibilityLog_RegFacility");

            entity.HasOne(d => d.Patient).WithMany(p => p.EligibilityLog).HasConstraintName("FK_EligibilityLog_RegPatient");

            entity.HasOne(d => d.Payer).WithMany(p => p.EligibilityLog).HasConstraintName("FK_EligibilityLog_BlPayer");

            entity.HasOne(d => d.Plan).WithMany(p => p.EligibilityLog).HasConstraintName("FK_EligibilityLog_BLPayerPlan");

            entity.HasOne(d => d.Requestedby).WithMany(p => p.EligibilityLog).HasConstraintName("FK_EligibilityLog_HrEmployee");

            entity.HasOne(d => d.Visit).WithMany(p => p.EligibilityLog).HasConstraintName("FK_EligibilityLog_SchAppointment");
        });

        modelBuilder.Entity<EmirateType>(entity =>
        {
            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<EmrnoteVoiceinText>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_Table_1");
        });

        modelBuilder.Entity<EmrnotesEncounterPath>(entity =>
        {
            entity.Property(e => e.PathId).ValueGeneratedNever();
        });

        modelBuilder.Entity<EmrnotesPathQuestion>(entity =>
        {
            entity.Property(e => e.PathQuestionId).ValueGeneratedNever();
        });

        modelBuilder.Entity<EmrnotesQuestion>(entity =>
        {
            entity.Property(e => e.QuestId).ValueGeneratedNever();
        });

        modelBuilder.Entity<Emrsite>(entity =>
        {
            entity.HasKey(e => e.SiteId).HasName("PK_SiteId");

            entity.Property(e => e.SiteId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<EntityTypes>(entity =>
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

        modelBuilder.Entity<HiePatientDemographicsOutboundQueue>(entity =>
        {
            entity.HasKey(e => e.QueueId).HasName("PK__HIE_Pati__8324E7158AF56F0C");

            entity.Property(e => e.CreatedDate).HasDefaultValueSql("(getdate())");
        });

        modelBuilder.Entity<HolidaySchedule>(entity =>
        {
            entity.HasKey(e => e.HolidayScheduleId).HasName("PK_HolidayBlocked");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<Hremployee>(entity =>
        {
            entity.HasIndex(e => e.Active, "IX_HREmployee_Active").HasFilter("([Active] IS NOT NULL)");

            entity.HasIndex(e => e.Email, "IX_HREmployee_Email").HasFilter("([Email] IS NOT NULL)");

            entity.HasIndex(e => e.EmployeeType, "IX_HREmployee_EmployeeType").HasFilter("([EmployeeType] IS NOT NULL)");

            entity.HasIndex(e => e.FullName, "IX_HREmployee_FullName").HasFilter("([FullName] IS NOT NULL)");

            entity.HasIndex(e => e.UserName, "IX_HREmployee_UserName").HasFilter("([UserName] IS NOT NULL)");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<HremployeeFacility>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Employee).WithMany(p => p.HremployeeFacility)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__HREmployeeFacility__HREmployee");

            entity.HasOne(d => d.Facility).WithMany(p => p.HremployeeFacility)
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

            entity.HasOne(d => d.Employee).WithMany(p => p.HrlicenseInfo)
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

            entity.HasOne(d => d.Appointment).WithMany(p => p.InsuranceEligibility).HasConstraintName("FK_InsuranceEligibility_SchAppointment");

            entity.HasOne(d => d.BlPayer).WithMany(p => p.InsuranceEligibility).HasConstraintName("FK_InsuranceEligibility_BLPayer");
        });

        modelBuilder.Entity<InsuranceRequestType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Insuranc__3214EC071602273E");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<Insured>(entity =>
        {
            entity.HasKey(e => e.InsuredId).HasName("PK__Insured__03C4A17B84441545");

            entity.HasIndex(e => e.CarrierId, "IX_Insured_CarrierId").HasFilter("([CarrierId] IS NOT NULL)");

            entity.HasIndex(e => e.InsuredIdno, "IX_Insured_InsuredIDNo").HasFilter("([InsuredIDNo] IS NOT NULL)");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Carrier).WithMany(p => p.Insured).HasConstraintName("FK_Insured_BLPayer");

            entity.HasOne(d => d.Patient).WithMany(p => p.Insured).HasConstraintName("FK__Insured__RegPatient");

            entity.HasOne(d => d.PayerPackage).WithMany(p => p.Insured).HasConstraintName("FK_Insured_BLPayerPackage");
        });

        modelBuilder.Entity<InsuredCoverage>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<InsuredPolicy>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Subscriber).WithMany(p => p.InsuredPolicy).HasConstraintName("FK_InsuredPolicy_InsuredSubscriber");
        });

        modelBuilder.Entity<InsuredSubscriber>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Carrier).WithMany(p => p.InsuredSubscriber).HasConstraintName("FK_InsuredSubscriber_BLPayer");

            entity.HasOne(d => d.City).WithMany(p => p.InsuredSubscriber)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_InsuredSubscriber_RegCities");

            entity.HasOne(d => d.Country).WithMany(p => p.InsuredSubscriber)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_InsuredSubscriber_RegCountries");

            entity.HasOne(d => d.PayerPackage).WithMany(p => p.InsuredSubscriber).HasConstraintName("FK_InsuredSubscriber_BLPayerPackage");

            entity.HasOne(d => d.State).WithMany(p => p.InsuredSubscriber)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_InsuredSubscriber_RegStates");
        });

        modelBuilder.Entity<InvestigationType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Investig__3214EC07992AE891");
        });

        modelBuilder.Entity<Ivfmain>(entity =>
        {
            entity.HasKey(e => e.IvfmainId).HasName("PK__IVFMain__3F8F07820127E48F");

            entity.HasOne(d => d.App).WithMany(p => p.Ivfmain)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_IVFMain_Visit");

            entity.HasOne(d => d.FemalePatient).WithMany(p => p.IvfmainFemalePatient)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_IVFMain_FemalePatient");

            entity.HasOne(d => d.MalePatient).WithMany(p => p.IvfmainMalePatient)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_IVFMain_MalePatient");
        });

        modelBuilder.Entity<IvfmaleFertilityHistory>(entity =>
        {
            entity.HasKey(e => e.IvfmaleFhid).HasName("PK__IVFMaleF__354FB852D85F5098");

            entity.HasOne(d => d.CftrcarrierCategory).WithMany(p => p.IvfmaleFertilityHistoryCftrcarrierCategory).HasConstraintName("FK_IVFMaleFertilityHistory_DropdownConfiguration1");

            entity.HasOne(d => d.ChromosomeAnalysisCategory).WithMany(p => p.IvfmaleFertilityHistoryChromosomeAnalysisCategory).HasConstraintName("FK_IVFMaleFertilityHistory_DropdownConfiguration");

            entity.HasOne(d => d.Ivfmain).WithMany(p => p.IvfmaleFertilityHistory)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_IVFMaleFH_IVFMain");

            entity.HasOne(d => d.Provider).WithMany(p => p.IvfmaleFertilityHistory)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_IVFMaleFH_Provider");
        });

        modelBuilder.Entity<IvfmaleFhfurtherPlanning>(entity =>
        {
            entity.HasOne(d => d.IvfmaleFhgeneral).WithMany(p => p.IvfmaleFhfurtherPlanning)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_IVFMaleFHFurtherPlanning_IVFMaleFHGeneral");
        });

        modelBuilder.Entity<IvfmaleFhgeneral>(entity =>
        {
            entity.HasOne(d => d.IvfmaleFh).WithMany(p => p.IvfmaleFhgeneral)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_IVFMaleFHGeneral_IVFMaleFertilityHistory");
        });

        modelBuilder.Entity<IvfmaleFhgenetics>(entity =>
        {
            entity.HasOne(d => d.CategoryIdInheritanceNavigation).WithMany(p => p.IvfmaleFhgenetics).HasConstraintName("FK_IVFMaleFHGenetics_DropdownConfiguration");

            entity.HasOne(d => d.IvfmaleFh).WithMany(p => p.IvfmaleFhgenetics).HasConstraintName("FK_IVFMaleFHGenetics_IVFMaleFertilityHistory");
        });

        modelBuilder.Entity<IvfmaleFhillness>(entity =>
        {
            entity.HasOne(d => d.IvfmaleFhgeneral).WithMany(p => p.IvfmaleFhillness).HasConstraintName("FK_IVFMaleFHIllness_IVFMaleFHGeneral");
        });

        modelBuilder.Entity<IvfmaleFhillnessIdiopathic>(entity =>
        {
            entity.HasOne(d => d.IvfmaleFhidiopathic).WithMany()
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_IVFMaleFHIllnessIdiopathic_IVFMaleFHIdiopathic");

            entity.HasOne(d => d.IvfmaleFhillness).WithMany()
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_IVFMaleFHIllnessIdiopathic_IVFMaleFHIllness");
        });

        modelBuilder.Entity<IvfmaleFhimpairmentFactor>(entity =>
        {
            entity.HasKey(e => e.IvfmaleFhimpairmentFactorId).HasName("PK__IVFMaleF__D1E703FA6E8AA473");

            entity.HasOne(d => d.IvfmaleFh).WithMany(p => p.IvfmaleFhimpairmentFactor)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_IVFMaleFHImpairmentFactor_MaleFH");
        });

        modelBuilder.Entity<IvfmaleFhinfections>(entity =>
        {
            entity.HasOne(d => d.CategoryIdDiagnosisOfInfectionNavigation).WithMany(p => p.IvfmaleFhinfectionsCategoryIdDiagnosisOfInfectionNavigation)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_IVFMaleFHInfections_DropdownConfiguration1");

            entity.HasOne(d => d.CategoryIdPrevInfectionsNavigation).WithMany(p => p.IvfmaleFhinfectionsCategoryIdPrevInfectionsNavigation)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_IVFMaleFHInfections_DropdownConfiguration");

            entity.HasOne(d => d.IvfmaleFhtesticlesAndSem).WithMany(p => p.IvfmaleFhinfections)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_IVFMaleFHInfections_IVFMaleFHTesticlesAndSem");
        });

        modelBuilder.Entity<IvfmaleFhperformedTreatment>(entity =>
        {
            entity.HasKey(e => e.IvfmaleFhperformedTreatmentId).HasName("PK_IVFMaleFHGeneralPerformedTreatment");

            entity.HasOne(d => d.IvfmaleFhgeneral).WithMany(p => p.IvfmaleFhperformedTreatment)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_IVFMaleFHGeneralPerformedTreatment_IVFMaleFHGeneral");
        });

        modelBuilder.Entity<IvfmaleFhperformedTreatmentYear>(entity =>
        {
            entity.HasOne(d => d.IvfmaleFhperformedTreatment).WithMany(p => p.IvfmaleFhperformedTreatmentYear)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_IVFMaleFHPerformedTreatmentYear_IVFMaleFHPerformedTreatment");
        });

        modelBuilder.Entity<IvfmaleFhprevIllness>(entity =>
        {
            entity.HasKey(e => e.IvfmaleFhprevIllnessId).HasName("PK__IVFMaleF__9DF3C0CDB7BE7BF5");

            entity.HasOne(d => d.IvfmaleFh).WithMany(p => p.IvfmaleFhprevIllness)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_IVFMaleFHPrevIllness_MaleFH");
        });

        modelBuilder.Entity<IvfmaleFhsemenAnalysis>(entity =>
        {
            entity.HasKey(e => e.IvfmaleFhsemenAnalysisId).HasName("PK__IVFMaleF__4603CA5EEC612133");

            entity.HasOne(d => d.IvfmaleFh).WithMany(p => p.IvfmaleFhsemenAnalysis)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_IVFMaleFHSemenAnalysis_MaleFH");
        });

        modelBuilder.Entity<IvfmaleFhtesticlesAndSem>(entity =>
        {
            entity.HasOne(d => d.CategoryIdClinicalVaricoceleNavigation).WithMany(p => p.IvfmaleFhtesticlesAndSemCategoryIdClinicalVaricoceleNavigation).HasConstraintName("FK_IVFMaleFHTesticlesAndSem_DropdownConfiguration4");

            entity.HasOne(d => d.CategoryIdDistalSeminalTractNavigation).WithMany(p => p.IvfmaleFhtesticlesAndSemCategoryIdDistalSeminalTractNavigation).HasConstraintName("FK_IVFMaleFHTesticlesAndSem_DropdownConfiguration6");

            entity.HasOne(d => d.CategoryIdEtiologicalDiagnosisNavigation).WithMany(p => p.IvfmaleFhtesticlesAndSemCategoryIdEtiologicalDiagnosisNavigation).HasConstraintName("FK_IVFMaleFHTesticlesAndSem_DropdownConfiguration7");

            entity.HasOne(d => d.CategoryIdInstrumentalVaricoceleNavigation).WithMany(p => p.IvfmaleFhtesticlesAndSemCategoryIdInstrumentalVaricoceleNavigation).HasConstraintName("FK_IVFMaleFHTesticlesAndSem_DropdownConfiguration3");

            entity.HasOne(d => d.CategoryIdKryptorchidismNavigation).WithMany(p => p.IvfmaleFhtesticlesAndSemCategoryIdKryptorchidismNavigation).HasConstraintName("FK_IVFMaleFHTesticlesAndSem_DropdownConfiguration1");

            entity.HasOne(d => d.CategoryIdOrchitisNavigation).WithMany(p => p.IvfmaleFhtesticlesAndSemCategoryIdOrchitisNavigation).HasConstraintName("FK_IVFMaleFHTesticlesAndSem_DropdownConfiguration2");

            entity.HasOne(d => d.CategoryIdProximalSeminalTractNavigation).WithMany(p => p.IvfmaleFhtesticlesAndSemCategoryIdProximalSeminalTractNavigation).HasConstraintName("FK_IVFMaleFHTesticlesAndSem_DropdownConfiguration5");

            entity.HasOne(d => d.CategoryIdTesticleNavigation).WithMany(p => p.IvfmaleFhtesticlesAndSemCategoryIdTesticleNavigation).HasConstraintName("FK_IVFMaleFHTesticlesAndSem_DropdownConfiguration");

            entity.HasOne(d => d.IvfmaleFh).WithMany(p => p.IvfmaleFhtesticlesAndSem).HasConstraintName("FK_IVFMaleFHTesticlesAndSem_IVFMaleFertilityHistory");
        });

        modelBuilder.Entity<IvfmaleSemenMorphology>(entity =>
        {
            entity.HasKey(e => e.MorphologyId).HasName("PK__IVFMaleS__244A06C6A869A767");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");
        });

        modelBuilder.Entity<IvfmaleSemenMotility>(entity =>
        {
            entity.HasKey(e => e.MotilityId).HasName("PK__IVFMaleS__F944C3E1B82C0051");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");
        });

        modelBuilder.Entity<IvfmaleSemenObservation>(entity =>
        {
            entity.HasKey(e => e.ObservationId).HasName("PK__IVFMaleS__420EA5E72FF248B9");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.QuantificationPossible).WithMany(p => p.IvfmaleSemenObservation).HasConstraintName("FK_Observation_QuantificationPossible");

            entity.HasOne(d => d.Sample).WithMany(p => p.IvfmaleSemenObservation).HasConstraintName("FK_Observation_Sample");
        });

        modelBuilder.Entity<IvfmaleSemenObservationPreparation>(entity =>
        {
            entity.HasKey(e => e.PreparationId).HasName("PK__IVFMaleS__092D2B4B6BC1EA45");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");
        });

        modelBuilder.Entity<IvfmaleSemenObservationPreparationMethod>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__IVFMaleS__3214EC0773FBDAA5");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.PreparationMethod).WithMany(p => p.IvfmaleSemenObservationPreparationMethod)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_IVFObsPrepMethod_DropdownMaster");
        });

        modelBuilder.Entity<IvfmaleSemenSample>(entity =>
        {
            entity.HasKey(e => e.SampleId).HasName("PK__IVFMaleS__8B99EC6AA4916F2F");

            entity.Property(e => e.Agglutination).HasDefaultValue(false);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(sysdatetime())");

            entity.HasOne(d => d.Appearance).WithMany(p => p.IvfmaleSemenSampleAppearance).HasConstraintName("FK_Sample_Appearance");

            entity.HasOne(d => d.CollectionMethod).WithMany(p => p.IvfmaleSemenSampleCollectionMethod).HasConstraintName("FK_Sample_CollectionMethod");

            entity.HasOne(d => d.CollectionPlace).WithMany(p => p.IvfmaleSemenSampleCollectionPlace).HasConstraintName("FK_Sample_CollectionPlace");

            entity.HasOne(d => d.Ivfmain).WithMany(p => p.IvfmaleSemenSample)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SemenSample_IVFMain");

            entity.HasOne(d => d.Purpose).WithMany(p => p.IvfmaleSemenSamplePurpose).HasConstraintName("FK_Sample_Purpose");

            entity.HasOne(d => d.Smell).WithMany(p => p.IvfmaleSemenSampleSmell).HasConstraintName("FK_Sample_Smell");

            entity.HasOne(d => d.Viscosity).WithMany(p => p.IvfmaleSemenSampleViscosity).HasConstraintName("FK_Sample_Viscosity");
        });

        modelBuilder.Entity<IvfmaleSemenSampleApprovalStatus>(entity =>
        {
            entity.HasKey(e => e.ApprovalStatusId).HasName("PK__IVFMaleS__08E527F8432A2EFA");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Sample).WithMany(p => p.IvfmaleSemenSampleApprovalStatus).HasConstraintName("FK_Observation_Approval_Sample");
        });

        modelBuilder.Entity<IvfmaleSemenSampleDiagnosis>(entity =>
        {
            entity.HasKey(e => e.DiagnosisId).HasName("PK__IVFMaleS__0C54CC73DC667145");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(sysdatetime())");

            entity.HasOne(d => d.Sample).WithMany(p => p.IvfmaleSemenSampleDiagnosis).HasConstraintName("FK_Observation_Diagnosis_Sample");
        });

        modelBuilder.Entity<LabOrderSet>(entity =>
        {
            entity.HasKey(e => e.LabOrderSetId).HasName("PK__LabOrder__322AE07AA8CA4595");
        });

        modelBuilder.Entity<LabOrderSetDetail>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            entity.Property(e => e.IsRadiologyTest).HasComment("2 = Pathalogy\r\n1 = Lab\r\n0 = Radiology");

            entity.HasOne(d => d.SampleType).WithMany(p => p.LabOrderSetDetail).HasConstraintName("FK_LabOrderSetDetail_SampleTypes");
        });

        modelBuilder.Entity<LabResultsObservation>(entity =>
        {
            entity.Property(e => e.LabObservationId).ValueGeneratedOnAdd();
        });

        modelBuilder.Entity<LabSampleTypes>(entity =>
        {
            entity.HasKey(e => e.SampleTypeId).HasName("PK__LabSampl__4B9609E93B412B43");

            entity.Property(e => e.CreatedDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.FastingRequired).HasDefaultValue(false);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<LabTests>(entity =>
        {
            entity.HasKey(e => e.LabTestId).HasName("PK_LabTestId");

            entity.Property(e => e.LabTestId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Laboratory).WithMany(p => p.LabTests).HasConstraintName("FK_LabTests_Laboratory");

            entity.HasOne(d => d.SampleType).WithMany(p => p.LabTests).HasConstraintName("FK_LabTests_SampleTypes");
        });

        modelBuilder.Entity<Laboratories>(entity =>
        {
            entity.HasKey(e => e.LaboratoryId).HasName("PK__Laborato__238050AD19EC2334");

            entity.Property(e => e.Active).HasDefaultValue(true);
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

        modelBuilder.Entity<PatientAlerts>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<PatientAllergy>(entity =>
        {
            entity.HasIndex(e => e.CreatedDate, "IX_PatientAllergy_CreatedDate").HasFilter("([CreatedDate] IS NOT NULL)");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Appointment).WithMany(p => p.PatientAllergy).HasConstraintName("FK_PatientAllergy_AppointmentId");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.PatientAllergyCreatedByNavigation).HasConstraintName("FK_PatientAllergy_CreatedBy");

            entity.HasOne(d => d.Provider).WithMany(p => p.PatientAllergyProvider).HasConstraintName("FK_PatientAllergy_ProviderId");

            entity.HasOne(d => d.SeverityCodeNavigation).WithMany(p => p.PatientAllergy).HasConstraintName("FK_PatientAllergy_Severity");

            entity.HasOne(d => d.Type).WithMany(p => p.PatientAllergy).HasConstraintName("FK_PatientAllergy_TypeId");

            entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.PatientAllergyUpdatedByNavigation).HasConstraintName("FK_PatientAllergy_UpdatedBy");
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

            entity.HasOne(d => d.Procedure).WithMany(p => p.PatientBill)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PatientBill_BLSuperBillProcedure");
        });

        modelBuilder.Entity<PatientBillInvoice>(entity =>
        {
            entity.HasKey(e => e.InvoiceId).HasName("PK__PatientBillInvoi__7DA38D70");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Appointment).WithMany(p => p.PatientBillInvoice).HasConstraintName("FK_PatientBillInvoice_SchAppointment");
        });

        modelBuilder.Entity<PatientChartFamilyHistory>(entity =>
        {
            entity.HasOne(d => d.RelationShip).WithMany(p => p.PatientChartFamilyHistory).HasConstraintName("FK_PatientChartFamilyHistory_RegRelationShip");
        });

        modelBuilder.Entity<PatientImmunization>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PatientI__3214EC07517FDBEE");

            entity.HasOne(d => d.Appointment).WithMany(p => p.PatientImmunization).HasConstraintName("FK_PatientImmunization_AppointmentId");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.PatientImmunizationCreatedByNavigation).HasConstraintName("FK_PatientImmunization_CreatedBy");

            entity.HasOne(d => d.DrugType).WithMany(p => p.PatientImmunizationDrugType).HasConstraintName("FK_PatientImmunization_DrugTypeId");

            entity.HasOne(d => d.ImmType).WithMany(p => p.PatientImmunizationImmType).HasConstraintName("FK_ImmunizationList_PatientImmunization");

            entity.HasOne(d => d.Provider).WithMany(p => p.PatientImmunizationProvider).HasConstraintName("FK_PatientImmunization_ProviderId");

            entity.HasOne(d => d.Route).WithMany(p => p.PatientImmunization).HasConstraintName("FK_PatientImmunization_RouteId");

            entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.PatientImmunizationUpdatedByNavigation).HasConstraintName("FK_PatientImmunization_UpdatedBy");
        });

        modelBuilder.Entity<PatientNotifiedOptions>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<PatientProblem>(entity =>
        {
            entity.HasIndex(e => e.CreatedDate, "IX_PatientProblem_CreatedDate").HasFilter("([CreatedDate] IS NOT NULL)");

            entity.HasOne(d => d.Appointment).WithMany(p => p.PatientProblem).HasConstraintName("FK_PatientProblemAppointment");

            entity.HasOne(d => d.Patient).WithMany(p => p.PatientProblem).HasConstraintName("FK_PatientProblemPatientId");
        });

        modelBuilder.Entity<PatientProcedure>(entity =>
        {
            entity.Property(e => e.Active).HasDefaultValue(1);
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            entity.Property(e => e.IsHl7msgCreated).HasDefaultValue(false);
            entity.Property(e => e.PerformedOnFacility).HasDefaultValue(true);
            entity.Property(e => e.ProcedureEndDateTime).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.ProcedurePriority).HasDefaultValue("");
            entity.Property(e => e.ProcedureType).HasDefaultValueSql("('')");

            entity.HasOne(d => d.Appointment).WithMany(p => p.PatientProcedure).HasConstraintName("FK_PatientProcedure_SchAppointment");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.PatientProcedureCreatedByNavigation).HasConstraintName("FK_CreatedBy_HREmployee");

            entity.HasOne(d => d.ProcedureTypeNavigation).WithMany(p => p.PatientProcedure).HasConstraintName("FK_ProcedureTypeId");

            entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.PatientProcedureUpdatedByNavigation).HasConstraintName("FK_UpdateBy_HREmployee");
        });

        modelBuilder.Entity<PatientProcedureType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PatientP__3214EC07C6A9C284");
        });

        modelBuilder.Entity<PatientVisitStatus>(entity =>
        {
            entity.HasKey(e => e.PatientVisitStatusId).HasName("PK_PatientVisitStatus_1");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Appointment).WithMany(p => p.PatientVisitStatus).HasConstraintName("FK_PatientVisitStatus_SchAppointment");

            entity.HasOne(d => d.Status).WithMany(p => p.PatientVisitStatus).HasConstraintName("FK_PatientVisitStatus_SchPatientStatus");

            entity.HasOne(d => d.VisitStatus).WithMany(p => p.PatientVisitStatus).HasConstraintName("FK_PATIENTVISITSTATUS_VisitStatus");
        });

        modelBuilder.Entity<PersonalReminders>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<Prescription>(entity =>
        {
            entity.HasIndex(e => e.ProviderId, "IX_Prescription_ProviderId").HasFilter("([ProviderId] IS NOT NULL)");

            entity.HasOne(d => d.Appointment).WithMany(p => p.Prescription).HasConstraintName("fk_appointment");

            entity.HasOne(d => d.Drug).WithMany(p => p.Prescription).HasConstraintName("FK_Prescription_TabsDrugName_DrugId");

            entity.HasOne(d => d.Provider).WithMany(p => p.Prescription).HasConstraintName("fk_provider");
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

            entity.HasIndex(e => e.SiteId, "IX_ProviderSchedule_SiteId").HasFilter("([SiteId] IS NOT NULL)");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Facility).WithMany(p => p.ProviderSchedule).HasConstraintName("FK_ProviderSchedule_RegFacility");

            entity.HasOne(d => d.Speciality).WithMany(p => p.ProviderSchedule).HasConstraintName("FK_ProviderSchedule_ProviderSpeciality");
        });

        modelBuilder.Entity<ProviderScheduleByAppType>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.AppType).WithMany(p => p.ProviderScheduleByAppType).HasConstraintName("FK_ProviderScheduleByAppType_SchAppointmentType");

            entity.HasOne(d => d.Ps).WithMany(p => p.ProviderScheduleByAppType)
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

            entity.HasOne(d => d.Patient).WithMany(p => p.RegAccount).HasConstraintName("FK_RegAccount_RegPatientId");

            entity.HasOne(d => d.Relationship).WithMany(p => p.RegAccount).HasConstraintName("FK_RegAccount_RegRelationshipId");
        });

        modelBuilder.Entity<RegAlertTypes>(entity =>
        {
            entity.HasKey(e => e.TypeId).HasName("PK_TypeIdAlert");

            entity.Property(e => e.TypeId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<RegAssignments>(entity =>
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

        modelBuilder.Entity<RegCities>(entity =>
        {
            entity.HasKey(e => e.CityId).HasName("PK_CityId");

            entity.Property(e => e.CityId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<RegCompany>(entity =>
        {
            entity.HasOne(d => d.CreatedBy).WithMany(p => p.RegCompany).HasConstraintName("FK_RegCompany_HREmployee");
        });

        modelBuilder.Entity<RegCountries>(entity =>
        {
            entity.HasKey(e => e.CountryId).HasName("PK_CountryId");

            entity.Property(e => e.CountryId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<RegCreditCardTypes>(entity =>
        {
            entity.HasKey(e => e.TypeId).HasName("PK_TypeId");

            entity.Property(e => e.TypeId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<RegDebitCardTypes>(entity =>
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

        modelBuilder.Entity<RegEthnicityTypes>(entity =>
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

            entity.HasOne(d => d.Company).WithMany(p => p.RegFacility).HasConstraintName("FK_RegFacility_RegCompany");
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

        modelBuilder.Entity<RegLocationTypes>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Facility).WithMany(p => p.RegLocationTypes).HasConstraintName("FK_RegLocationTypes_RegFacility");
        });

        modelBuilder.Entity<RegLocations>(entity =>
        {
            entity.HasKey(e => e.LocationId).HasName("PK_LocationId");

            entity.Property(e => e.LocationId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
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

            entity.HasIndex(e => e.PersonSocialSecurityNo, "IX_RegPatient_PersonSocialSecurityNo").HasFilter("([PersonSocialSecurityNo] IS NOT NULL)");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.PatientBloodGroup).WithMany(p => p.RegPatient).HasConstraintName("FK_RegPatient_RegBloodGroup");

            entity.HasOne(d => d.TabsType).WithMany(p => p.RegPatient).HasConstraintName("FK_RegPatient_RegPateintTabsType");
        });

        modelBuilder.Entity<RegPatientAddress>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<RegPatientDetails>(entity =>
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

            entity.HasOne(d => d.EmploymentOccupation).WithMany(p => p.RegPatientEmployer).HasConstraintName("FK_RegPatientEmployer_RegOccupationId");

            entity.HasOne(d => d.EmploymentType).WithMany(p => p.RegPatientEmployer).HasConstraintName("FK_RegPatientEmployer_RegEmploymentTypeId");

            entity.HasOne(d => d.Patient).WithMany(p => p.RegPatientEmployer).HasConstraintName("FK_RegPatientEmployer_RegPatientId");
        });

        modelBuilder.Entity<RegPatientOld>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.PatientBloodGroup).WithMany().HasConstraintName("FK_RegPatientOld_RegBloodGroup");

            entity.HasOne(d => d.Patient).WithMany().HasConstraintName("FK_RegPatientOld_RegPatientId");

            entity.HasOne(d => d.TabsType).WithMany().HasConstraintName("FK_RegPatientOld_RegPateintTabsType");
        });

        modelBuilder.Entity<RegPatientRelation>(entity =>
        {
            entity.HasKey(e => e.PatientRelationId).HasName("PK__RegPatie__F72A978D0CECDF50");

            entity.Property(e => e.CanonicalKey).HasComputedColumnSql("(case when [PatientId]<[RelatedPatientId] then concat([PatientId],'-',[RelatedPatientId]) else concat([RelatedPatientId],'-',[PatientId]) end)", true);

            entity.HasOne(d => d.Patient).WithMany(p => p.RegPatientRelationPatient)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Rel_MainPatient");

            entity.HasOne(d => d.RelatedPatient).WithMany(p => p.RegPatientRelationRelatedPatient)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Rel_RelatedPatient");

            entity.HasOne(d => d.Relationship).WithMany(p => p.RegPatientRelation)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Rel_RelationshipType");
        });

        modelBuilder.Entity<RegPatientTabsType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_RegPateintTabsType");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<RegPatientTemp>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Nokcity).WithMany(p => p.RegPatientTempNokcity).HasConstraintName("FK_NOK_RegPatientTemp_RegCities");

            entity.HasOne(d => d.Nokcountry).WithMany(p => p.RegPatientTempNokcountry).HasConstraintName("FK_NOK_RegPatientTemp_RegCountries");

            entity.HasOne(d => d.Nokstate).WithMany(p => p.RegPatientTempNokstate).HasConstraintName("FK_NOK_RegPatientTemp_RegStates");

            entity.HasOne(d => d.PersonCity).WithMany(p => p.RegPatientTempPersonCity).HasConstraintName("FK_RegPatientTemp_RegCities");

            entity.HasOne(d => d.PersonCountry).WithMany(p => p.RegPatientTempPersonCountry).HasConstraintName("FK_RegPatientTemp_RegCountries");

            entity.HasOne(d => d.PersonNationality).WithMany(p => p.RegPatientTemp).HasConstraintName("FK_RegPatientTemp_Nationality");

            entity.HasOne(d => d.PersonState).WithMany(p => p.RegPatientTempPersonState).HasConstraintName("FK_RegPatientTemp_RegStates");

            entity.HasOne(d => d.PersonTitle).WithMany(p => p.RegPatientTemp).HasConstraintName("FK_RegPatientTemp_RegTitle");
        });

        modelBuilder.Entity<RegRelationInverseMap>(entity =>
        {
            entity.HasKey(e => e.RelationshipId).HasName("PK__RegRelat__31FEB8816EA6542A");

            entity.Property(e => e.RelationshipId).ValueGeneratedNever();
        });

        modelBuilder.Entity<RegRelationShip>(entity =>
        {
            entity.HasKey(e => e.RelationshipId).HasName("PK_RelationshipId");

            entity.Property(e => e.RelationshipId).ValueGeneratedNever();
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<RegStates>(entity =>
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

        modelBuilder.Entity<ReschedulingReasons>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<SchAppointment>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.AppCriteria).WithMany(p => p.SchAppointment).HasConstraintName("FK_SchAppointment_SchAppointmentCriteria");

            entity.HasOne(d => d.AppStatus).WithMany(p => p.SchAppointment)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SchAppointment_SchAppointmentStatus");

            entity.HasOne(d => d.Employee).WithMany(p => p.SchAppointment).HasConstraintName("FK_SchAppointment_HrEmployee");

            entity.HasOne(d => d.Facility).WithMany(p => p.SchAppointment).HasConstraintName("FK_SchAppointment_RegFacility");

            entity.HasOne(d => d.Patient).WithMany(p => p.SchAppointment).HasConstraintName("FK_SchAppointment_RegPatient");

            entity.HasOne(d => d.PatientNotified).WithMany(p => p.SchAppointment).HasConstraintName("FK_SchAppointment_PatientNotifiedOptions");

            entity.HasOne(d => d.PatientStatus).WithMany(p => p.SchAppointment)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SchAppointment_SchPatientStatus");

            entity.HasOne(d => d.Payer).WithMany(p => p.SchAppointment).HasConstraintName("FK_SchAppointment_BLPayer");

            entity.HasOne(d => d.Plan).WithMany(p => p.SchAppointment).HasConstraintName("FK_SchAppointment_BLPayerPlan");

            entity.HasOne(d => d.PurposeOfVisitNavigation).WithMany(p => p.SchAppointment).HasConstraintName("FK_SchAppointment_ProblemList");

            entity.HasOne(d => d.Rescheduled).WithMany(p => p.SchAppointment).HasConstraintName("FK_SchAppointment_ReschedulingReasons");

            entity.HasOne(d => d.Site).WithMany(p => p.SchAppointment)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SchAppointment_RegLocationTypes");

            entity.HasOne(d => d.Subscriber).WithMany(p => p.SchAppointment).HasConstraintName("FK_SchAppointment_InsuredSubscriber");

            entity.HasOne(d => d.VisitStatus).WithMany(p => p.SchAppointment).HasConstraintName("FK_SchAppointment_VisitStatus");

            entity.HasOne(d => d.VisitType).WithMany(p => p.SchAppointment).HasConstraintName("FK_SchAppointment_VisitType");
        });

        modelBuilder.Entity<SchAppointmentCriteria>(entity =>
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

        modelBuilder.Entity<SchBlockTimeslots>(entity =>
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

            entity.HasOne(d => d.Employee).WithMany(p => p.SecEmployeeRole)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SecEmployeeRole_HREmployee");

            entity.HasOne(d => d.Role).WithMany(p => p.SecEmployeeRole).HasConstraintName("FK_SecEmployeeRole_SecRole");
        });

        modelBuilder.Entity<SecModule>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<SecModuleForm>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Module).WithMany(p => p.SecModuleForm)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SecModuleForm_SecModule");
        });

        modelBuilder.Entity<SecPrivileges>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<SecPrivilegesAssignedRole>(entity =>
        {
            entity.HasKey(e => e.RolePrivilegeId).HasName("PK_SecPrivilegesAssignedRole_1");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.FormPrivilege).WithMany(p => p.SecPrivilegesAssignedRole)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SecPrivil__SecPrivilegesAvailableForm");

            entity.HasOne(d => d.Role).WithMany(p => p.SecPrivilegesAssignedRole)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SecPrivil__SecRoleI");
        });

        modelBuilder.Entity<SecPrivilegesAvailableForm>(entity =>
        {
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Form).WithMany(p => p.SecPrivilegesAvailableForm)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SecPrivilegesAvailableForm_SecModuleForm");

            entity.HasOne(d => d.Privilege).WithMany(p => p.SecPrivilegesAvailableForm)
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

            entity.HasOne(d => d.Form).WithMany(p => p.SecRoleForm)
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
            entity.HasOne(d => d.Appointment).WithMany(p => p.SpeechToText)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_SpeechToText_SchAppointment");

            entity.HasOne(d => d.Patient).WithMany(p => p.SpeechToText).HasConstraintName("FK_SpeechToText_RegPatient");
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

            entity.HasOne(d => d.ReceiverRole).WithMany(p => p.TaskForwarding)
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

        modelBuilder.Entity<UppInsuranceClaims>(entity =>
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

        modelBuilder.Entity<VitalSigns>(entity =>
        {
            entity.HasOne(d => d.Appointment).WithMany(p => p.VitalSigns).HasConstraintName("FK_VitalSigns_SchAppointment");
        });

        modelBuilder.Entity<VwAllActivePatients>(entity =>
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

        modelBuilder.Entity<VwRegPatientAndAppointmentdetails>(entity =>
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
