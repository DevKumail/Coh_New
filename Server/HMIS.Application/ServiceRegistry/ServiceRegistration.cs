using HMIS.Application.Implementations;
using HMIS.Application.ServiceLogics;
using HMIS.Application.ServiceLogics.Cryo;
using HMIS.Application.ServiceLogics.IVF;
using HMIS.Service.Implementations;
using HMIS.Service.ServiceLogics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace HMIS.Application
{
    public static class ServiceRegistration
    {
        public static void AddSharedInfrastructure(this IServiceCollection services, IConfiguration _config)
        {
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IAuthenticateUserToken, AuthenticateUserToken>();
            services.AddScoped<IPermissionService, PermissionService>();
            services.AddScoped<ILoginHistoryService, LoginHistoryService>();
            services.AddScoped<IAllDropdownsManager, AllDropdownsManager>();
            services.AddScoped<IChargeCaptureManager, ChargeCaptureManager>();
            services.AddScoped<IProviderScheduleManager, ProviderScheduleManager>();
            services.AddScoped<IAppointmentManager, AppointmentManager>();
            services.AddScoped<IDemographicManager, DemographicManager>();
            services.AddScoped<ICommonManager, CommonManager>();
            services.AddScoped<IHolidayScheduleManager, HolidayScheduleManager>();
            services.AddScoped<IRoleManager, RoleManager>();
            services.AddScoped<IUserManager, UserManager>();
            services.AddScoped<IWelcomeScreenManager, WelcomeScreenManager>();
            services.AddScoped<ICoveragesManager, CoveragesManager>();
            services.AddScoped<IEncounterManager, EncounterManager>();
            services.AddScoped<ITempDemographicManager, TempDemographicManager>();
            services.AddScoped<IBillGeneratorManager, BillGeneratorManager>();
            services.AddScoped<ISummarySheetManager,SummarySheetManager>();
            services.AddScoped<IEligibilityManager, EligibilityManager>();
            services.AddScoped<IPatientProblem, PatientProblemManager>();
            services.AddScoped<IPatientImmunization, PatientImmunizationManager>();
            services.AddScoped<IPatientProcedure, PatientProcedureManager>();
            services.AddScoped<IAlergyManager, AlergyManager >();
            services.AddScoped<IEMRNotesManager, EMRNotesManager>();
            services.AddScoped<IPatientChartFamilyHistoryManager, PatientChartFamilyHistoryManager>();
            services.AddScoped<ILocalizationSpService, LocalizationSpService>();
            services.AddScoped<IPrescription, PrescriptionManager>();
            services.AddScoped<IAlertManager, AlertManager >();
            services.AddScoped<IDashboardService, DashboardService>();
            services.AddScoped<ICryoManagementService, CryoManagementService>();



        }
    }
}
