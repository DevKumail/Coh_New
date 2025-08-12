using HMIS.Infrastructure.Repository;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using Task = System.Threading.Tasks.Task;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using HMIS.ApplicationImplementations;
using HMIS.Core.Entities;

namespace HMIS.Application.ServiceLogics
{
    public class AllDropdownsManager : GenericRepositoryAsync<BlsuperBillDiagnosis>, IAllDropdownsManager
    {
        private readonly IMapper _mapper;
        private readonly HmisContext _dbContext;
        public AllDropdownsManager(IMapper mapper, HmisContext dbContext) : base(dbContext)
        {
            this._mapper = mapper;
            _dbContext = dbContext;
        }
        public async Task<List<RegState>> GetStateByCountry(long? Id)
        {

            var DbData = await Task.Run(() => _dbContext.RegStates.Where(x => x.CountryId == Id).OrderBy(x => x.Name).ToListAsync());

            return DbData;
        }
        public async Task<List<RegCity>> GetCityByState(long? Id)
        {

            var DbData = await Task.Run(() => _dbContext.RegCities.Where(x => x.StateId == Id).OrderBy(x => x.Name).ToListAsync());

            return DbData;
        }
        public async Task<List<FeeSchedule>> GetFeeSchedule()
        {

            var DbData = await Task.Run(() => _dbContext.FeeSchedules.ToListAsync());

            return DbData;
        }
        public async Task<List<FinancialClass>> GetFinancialClass()
        {

            var DbData = await Task.Run(() => _dbContext.FinancialClasses.ToListAsync());

            return DbData;
        }
        public async Task<List<EntityType>> GetEntityTypes()
        {

            var DbData = await Task.Run(() => _dbContext.EntityTypes.ToListAsync());

            return DbData;
        }
        public async Task<List<EmirateType>> GetEmirateType()
        {

            var DbData = await Task.Run(() => _dbContext.EmirateTypes.ToListAsync());

            return DbData;
        }
        public async Task<List<RegLocationType>> GetSitebyfacility(long? Id)
        {

            var DbData = await Task.Run(() => _dbContext.RegLocationTypes.Where(x => x.FacilityId == Id).ToListAsync());

            return DbData;
        }
        public async Task<List<CptbyAppType>> GetCPTGroupId()
        {

            var DbData = await Task.Run(() => _dbContext.CptbyAppTypes.ToListAsync());

            return DbData;
        }

        public async Task<List<BlEclaimEncounterType>> GetBlEclaimEncounterType()
        {
            var EncouterType = await Task.Run(() => _dbContext.BlEclaimEncounterTypes.ToListAsync());
            return EncouterType;
        }

        public async Task<List<BlEclaimEncounterStartType>> GetBlEclaimEncounterStartType()
        {
            var EncouterStartType = await Task.Run(()=>_dbContext.BlEclaimEncounterStartTypes.ToListAsync());
            return EncouterStartType;
        }

        public Task<List<BlEclaimEncounterEndType>> GetBlEclaimEncounterEndType()
        {
            var EncounterEndType = Task.Run(() => _dbContext.BlEclaimEncounterEndTypes.ToListAsync());
            return EncounterEndType;
        }

        public async Task<List<RegGenderIdentity>> GetRegGenderIdentities()
        {
            List<RegGenderIdentity> GetDGenderType = new List<RegGenderIdentity>();
             GetDGenderType = await Task.Run(() => _dbContext.RegGenderIdentities.ToListAsync());
            return GetDGenderType;
        }
        public async Task<List<ImmunizationList>> GetImmunizationLists()
        {
            var GetImmunizationLists = _dbContext.ImmunizationLists.Where(x => x.Active == true).ToList();
            return GetImmunizationLists;
        }

        public async Task<List<Emrsite>> GetEMRSite()
        {
            var GetEMRSite = _dbContext.Emrsites.Where(x => x.Active == true).ToList();
            return GetEMRSite;
        }

        public async Task<List<Emrroute>> GetEMRRoute()
        {
            var GetEMRRoute = _dbContext.Emrroutes.Where(x=>x.Active==true).ToList();
            return GetEMRRoute;
        }

        public async Task<List<AlergyType>> GetAlergyTypes()
        {
            var GetAlergyTypes = _dbContext.AlergyTypes.ToList();
            return GetAlergyTypes;
        }

        public async Task<List<SeverityType>> GetSeverityType()
        {
            var GetSeverityType = _dbContext.SeverityTypes.ToList();
            return GetSeverityType;
        }

        
        public async Task<List<PatientProcedureType>> GetPatientProcedureTypeList()
        {
            var ProcedureType = _dbContext.PatientProcedureTypes.ToList();
            return ProcedureType;
        }

        public async Task<List<SocialFamilyHistoryMaster>> GetSocialHistory()
        {
            var GetSocialHistory = _dbContext.SocialFamilyHistoryMasters.ToList();
            return GetSocialHistory;
        }

        public async Task<List<FamilyProblemList>> GetFamilyProblemHistory()
        {
            var GetFamilyProblemHistory = _dbContext.FamilyProblemLists.ToList();
            return GetFamilyProblemHistory;
        }

        public async Task<List<MedicationComment>> GetComments()
        {
            var GetComments = _dbContext.MedicationComments.ToList();
            return GetComments;
        }

        public async Task<List<Emrfrequency>> GetFrequency()
        {
            var GetFrequency = _dbContext.Emrfrequencies.Where(x => x.Active == true).ToList();
            return GetFrequency;
        }

        public async Task<List<RegAlertType>> GetAlertType()
        {
            try
            {
                var GetAlertTypes = _dbContext.RegAlertTypes.ToList();

                return GetAlertTypes;
            }
            catch (Exception ex)
            {
                var exce = ex;


                return null;
            }
        }

    }
}
