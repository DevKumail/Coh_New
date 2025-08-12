-- =============================================
-- HMIS Database Performance Indexing Script
-- For 200+ Concurrent Users Optimization
-- =============================================

USE HMIS;
GO

PRINT 'Starting HMIS Database Indexing for Performance Optimization...';

-- =============================================
-- PRIORITY 1: HIGH-TRAFFIC TABLES
-- =============================================

PRINT 'Creating indexes for RegPatient table...';
-- RegPatient Table Indexes
CREATE NONCLUSTERED INDEX IX_RegPatient_PersonFirstName ON RegPatient(PersonFirstName) WHERE PersonFirstName IS NOT NULL;
CREATE NONCLUSTERED INDEX IX_RegPatient_PersonLastName ON RegPatient(PersonLastName) WHERE PersonLastName IS NOT NULL;
CREATE NONCLUSTERED INDEX IX_RegPatient_PatientBirthDate ON RegPatient(PatientBirthDate) WHERE PatientBirthDate IS NOT NULL;
CREATE NONCLUSTERED INDEX IX_RegPatient_CreatedDate ON RegPatient(CreatedDate) WHERE CreatedDate IS NOT NULL;
CREATE NONCLUSTERED INDEX IX_RegPatient_PersonSocialSecurityNo ON RegPatient(PersonSocialSecurityNo) WHERE PersonSocialSecurityNo IS NOT NULL;
CREATE NONCLUSTERED INDEX IX_RegPatient_EmiratesIDN ON RegPatient(EmiratesIDN) WHERE EmiratesIDN IS NOT NULL;
CREATE NONCLUSTERED INDEX IX_RegPatient_IsDeleted ON RegPatient(IsDeleted) WHERE IsDeleted IS NOT NULL;

PRINT 'Creating indexes for SchAppointment table...';
-- SchAppointment Table Indexes (Most Critical)
CREATE NONCLUSTERED INDEX IX_SchAppointment_MRNo ON SchAppointment(MRNo);
CREATE NONCLUSTERED INDEX IX_SchAppointment_ProviderId ON SchAppointment(ProviderId);
CREATE NONCLUSTERED INDEX IX_SchAppointment_AppDateTime ON SchAppointment(AppDateTime);
CREATE NONCLUSTERED INDEX IX_SchAppointment_SiteId ON SchAppointment(SiteId);
CREATE NONCLUSTERED INDEX IX_SchAppointment_FacilityId ON SchAppointment(FacilityId) WHERE FacilityId IS NOT NULL;
CREATE NONCLUSTERED INDEX IX_SchAppointment_AppStatusId ON SchAppointment(AppStatusId);
CREATE NONCLUSTERED INDEX IX_SchAppointment_SpecialtyId ON SchAppointment(SpecialtyId) WHERE SpecialtyId IS NOT NULL;
CREATE NONCLUSTERED INDEX IX_SchAppointment_VisitAccountNo ON SchAppointment(VisitAccountNo) WHERE VisitAccountNo IS NOT NULL;
CREATE NONCLUSTERED INDEX IX_SchAppointment_EntryDateTime ON SchAppointment(EntryDateTime);
CREATE NONCLUSTERED INDEX IX_SchAppointment_IsActive ON SchAppointment(IsActive);

-- Composite Indexes for Common Queries
CREATE NONCLUSTERED INDEX IX_SchAppointment_Provider_Date ON SchAppointment(ProviderId, AppDateTime);
CREATE NONCLUSTERED INDEX IX_SchAppointment_Site_Date ON SchAppointment(SiteId, AppDateTime);
CREATE NONCLUSTERED INDEX IX_SchAppointment_Facility_Date ON SchAppointment(FacilityId, AppDateTime) WHERE FacilityId IS NOT NULL;
CREATE NONCLUSTERED INDEX IX_SchAppointment_MRNo_Date ON SchAppointment(MRNo, AppDateTime);
CREATE NONCLUSTERED INDEX IX_SchAppointment_Status_Date ON SchAppointment(AppStatusId, AppDateTime);

-- =============================================
-- PRIORITY 2: BILLING & INSURANCE TABLES
-- =============================================

PRINT 'Creating indexes for Billing tables...';
-- BlPatientVisit Table
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'BlPatientVisit')
BEGIN
    CREATE NONCLUSTERED INDEX IX_BlPatientVisit_MRNo ON BlPatientVisit(MRNo) WHERE MRNo IS NOT NULL;
    CREATE NONCLUSTERED INDEX IX_BlPatientVisit_VisitAccountNo ON BlPatientVisit(VisitAccountNo) WHERE VisitAccountNo IS NOT NULL;
    CREATE NONCLUSTERED INDEX IX_BlPatientVisit_AppId ON BlPatientVisit(AppId) WHERE AppId IS NOT NULL;
    CREATE NONCLUSTERED INDEX IX_BlPatientVisit_CreatedDate ON BlPatientVisit(CreatedDate) WHERE CreatedDate IS NOT NULL;
END

-- Insured Table
CREATE NONCLUSTERED INDEX IX_Insured_PatientId ON Insured(PatientId);
CREATE NONCLUSTERED INDEX IX_Insured_InsuredIDNo ON Insured(InsuredIDNo) WHERE InsuredIDNo IS NOT NULL;
CREATE NONCLUSTERED INDEX IX_Insured_CarrierId ON Insured(CarrierId) WHERE CarrierId IS NOT NULL;

-- BleligibilityLog Table
CREATE NONCLUSTERED INDEX IX_BleligibilityLog_MRNo ON BleligibilityLog(MRNo) WHERE MRNo IS NOT NULL;
CREATE NONCLUSTERED INDEX IX_BleligibilityLog_VisitAccountNo ON BleligibilityLog(VisitAccountNo) WHERE VisitAccountNo IS NOT NULL;
CREATE NONCLUSTERED INDEX IX_BleligibilityLog_MessageRequestDate ON BleligibilityLog(MessageRequestDate) WHERE MessageRequestDate IS NOT NULL;

-- =============================================
-- PRIORITY 3: PROVIDER & CLINICAL TABLES
-- =============================================

PRINT 'Creating indexes for Provider tables...';
-- Provider Table
CREATE NONCLUSTERED INDEX IX_Provider_EmployeeId ON Provider(EmployeeId) WHERE EmployeeId IS NOT NULL;
CREATE NONCLUSTERED INDEX IX_Provider_FacilityId ON Provider(FacilityId) WHERE FacilityId IS NOT NULL;
CREATE NONCLUSTERED INDEX IX_Provider_SpecialtyId ON Provider(SpecialtyId) WHERE SpecialtyId IS NOT NULL;
CREATE NONCLUSTERED INDEX IX_Provider_Active ON Provider(Active) WHERE Active IS NOT NULL;

-- ProviderSchedule Table
CREATE NONCLUSTERED INDEX IX_ProviderSchedule_ProviderId ON ProviderSchedule(ProviderId);
CREATE NONCLUSTERED INDEX IX_ProviderSchedule_SiteId ON ProviderSchedule(SiteId) WHERE SiteId IS NOT NULL;
CREATE NONCLUSTERED INDEX IX_ProviderSchedule_DayOfWeek ON ProviderSchedule(DayOfWeek) WHERE DayOfWeek IS NOT NULL;

-- PatientProblem Table
CREATE NONCLUSTERED INDEX IX_PatientProblem_PatientId ON PatientProblem(PatientId);
CREATE NONCLUSTERED INDEX IX_PatientProblem_CreatedDate ON PatientProblem(CreatedDate) WHERE CreatedDate IS NOT NULL;

-- PatientAllergy Table
CREATE NONCLUSTERED INDEX IX_PatientAllergy_PatientId ON PatientAllergy(PatientId);
CREATE NONCLUSTERED INDEX IX_PatientAllergy_CreatedDate ON PatientAllergy(CreatedDate) WHERE CreatedDate IS NOT NULL;

-- Prescription Table
CREATE NONCLUSTERED INDEX IX_Prescription_PatientId ON Prescription(PatientId);
CREATE NONCLUSTERED INDEX IX_Prescription_ProviderId ON Prescription(ProviderId) WHERE ProviderId IS NOT NULL;
CREATE NONCLUSTERED INDEX IX_Prescription_CreatedDate ON Prescription(CreatedDate) WHERE CreatedDate IS NOT NULL;

-- =============================================
-- PRIORITY 4: SECURITY & AUDIT TABLES
-- =============================================

PRINT 'Creating indexes for Security tables...';
-- AuditLog Table
CREATE NONCLUSTERED INDEX IX_AuditLog_UserName ON AuditLog(UserName) WHERE UserName IS NOT NULL;
CREATE NONCLUSTERED INDEX IX_AuditLog_ActionTime ON AuditLog(ActionTime);
CREATE NONCLUSTERED INDEX IX_AuditLog_FormName ON AuditLog(FormName) WHERE FormName IS NOT NULL;
CREATE NONCLUSTERED INDEX IX_AuditLog_ModuleName ON AuditLog(ModuleName) WHERE ModuleName IS NOT NULL;

-- LoginUserHistory Table
CREATE NONCLUSTERED INDEX IX_LoginUserHistory_UserName ON LoginUserHistory(UserName) WHERE UserName IS NOT NULL;
CREATE NONCLUSTERED INDEX IX_LoginUserHistory_LoginDateTime ON LoginUserHistory(LoginDateTime);

-- HREmployee Table
CREATE NONCLUSTERED INDEX IX_HREmployee_FullName ON HREmployee(FullName) WHERE FullName IS NOT NULL;
CREATE NONCLUSTERED INDEX IX_HREmployee_Email ON HREmployee(Email) WHERE Email IS NOT NULL;
CREATE NONCLUSTERED INDEX IX_HREmployee_Active ON HREmployee(Active) WHERE Active IS NOT NULL;

-- =============================================
-- PRIORITY 5: SUPPORTING TABLES
-- =============================================

PRINT 'Creating indexes for Supporting tables...';
-- RegPatientDetail Table
CREATE NONCLUSTERED INDEX IX_RegPatientDetail_PatientId ON RegPatientDetail(PatientId);
CREATE NONCLUSTERED INDEX IX_RegPatientDetail_CreatedDate ON RegPatientDetail(CreatedDate) WHERE CreatedDate IS NOT NULL;

-- RegPatientAddress Table
CREATE NONCLUSTERED INDEX IX_RegPatientAddress_PatientId ON RegPatientAddress(PatientId);

-- Task Table
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Task')
BEGIN
    CREATE NONCLUSTERED INDEX IX_Task_ReceiverId ON Task(ReceiverId) WHERE ReceiverId IS NOT NULL;
    CREATE NONCLUSTERED INDEX IX_Task_ReceiverRoleId ON Task(ReceiverRoleId) WHERE ReceiverRoleId IS NOT NULL;
    CREATE NONCLUSTERED INDEX IX_Task_CreatedDate ON Task(CreatedDate) WHERE CreatedDate IS NOT NULL;
END

-- PersonalReminder Table
CREATE NONCLUSTERED INDEX IX_PersonalReminder_EmployeeId ON PersonalReminder(EmployeeId);
CREATE NONCLUSTERED INDEX IX_PersonalReminder_ReminderDateTime ON PersonalReminder(ReminderDateTime);

-- RegFacility Table
CREATE NONCLUSTERED INDEX IX_RegFacility_FacilityName ON RegFacility(FacilityName) WHERE FacilityName IS NOT NULL;
CREATE NONCLUSTERED INDEX IX_RegFacility_Active ON RegFacility(Active) WHERE Active IS NOT NULL;

-- =============================================
-- STATISTICS UPDATE
-- =============================================

PRINT 'Updating statistics for better query optimization...';
UPDATE STATISTICS RegPatient;
UPDATE STATISTICS SchAppointment;
UPDATE STATISTICS Provider;
UPDATE STATISTICS Insured;
UPDATE STATISTICS BlPatientVisit;

PRINT 'HMIS Database Indexing completed successfully!';
PRINT 'Performance optimization for 200+ concurrent users is now active.';

-- =============================================
-- PERFORMANCE MONITORING QUERIES
-- =============================================

PRINT 'Performance monitoring queries:';
PRINT '1. Check index usage: SELECT * FROM sys.dm_db_index_usage_stats WHERE database_id = DB_ID(''HMIS'')';
PRINT '2. Find missing indexes: SELECT * FROM sys.dm_db_missing_index_details';
PRINT '3. Monitor query performance: SELECT * FROM sys.dm_exec_query_stats';
