using HMIS.Application.Interfaces;
using HMIS.Persistence;
using HMIS.Persistence.Repositories;
using HMIS.Persistence.Services;
using HMIS.Service.DTOs.Clinical;
using HMIS.Service.Implementations;
using HMIS.Service.ServiceLogics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Infrastructure
{
    public static class ServiceRegistration
    {
        public static void AddSharedInfrastructure(this IServiceCollection services, IConfiguration _config)
        {
            services.AddScoped(typeof(IDapperRepository<>), typeof(DapperRepository<>));
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IDapperSPService, DapperSPService>();
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
