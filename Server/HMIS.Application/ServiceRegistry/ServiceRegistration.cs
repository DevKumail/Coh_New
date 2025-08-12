﻿using HMIS.Application.ServiceLogics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using HMIS.Application.Implementations;
using HMIS.ApplicationImplementations;

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
            services.AddScoped<IPatientChartFamilyHistoryManager, PatientChartFamilyHistoryManager>();

            services.AddScoped<IPrescription, PrescriptionManager>();
            services.AddScoped<IAlertManager, AlertManager >();


        }
    }
}
