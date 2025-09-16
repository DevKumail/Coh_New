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
        private readonly HMISDbContext _dbContext;
        public AllDropdownsManager(IMapper mapper, HMISDbContext dbContext) : base(dbContext)
        {
            this._mapper = mapper;
            _dbContext = dbContext;
        }
        public async Task<List<RegStates>> GetStateByCountry(long? Id)
        {

            var DbData = await Task.Run(() => _dbContext.RegStates.Where(x => x.CountryId == Id).OrderBy(x => x.Name).ToListAsync());

            return DbData;
        }
        public async Task<List<RegCities>> GetCityByState(long? Id)
        {

            var DbData = await Task.Run(() => _dbContext.RegCities.Where(x => x.StateId == Id).OrderBy(x => x.Name).ToListAsync());

            return DbData;
        }
        public async Task<List<FeeSchedule>> GetFeeSchedule()
        {

            var DbData = await Task.Run(() => _dbContext.FeeSchedule.ToListAsync());

            return DbData;
        }
        public async Task<List<FinancialClass>> GetFinancialClass()
        {

            var DbData = await Task.Run(() => _dbContext.FinancialClass.ToListAsync());

            return DbData;
        }
        public async Task<List<EntityTypes>> GetEntityTypes()
        {

            var DbData = await Task.Run(() => _dbContext.EntityTypes.ToListAsync());

            return DbData;
        }
        public async Task<List<EmirateType>> GetEmirateType()
        {

            var DbData = await Task.Run(() => _dbContext.EmirateType.ToListAsync());

            return DbData;
        }
        public async Task<List<RegLocationTypes>> GetSitebyfacility(long? Id)
        {

            var DbData = await Task.Run(() => _dbContext.RegLocationTypes.Where(x => x.FacilityId == Id).ToListAsync());

            return DbData;
        }
        public async Task<List<CptbyAppType>> GetCPTGroupId()
        {

            var DbData = await Task.Run(() => _dbContext.CptbyAppType.ToListAsync());

            return DbData;
        }

        public async Task<List<BlEclaimEncounterType>> GetBlEclaimEncounterType()
        {
            var EncouterType = await Task.Run(() => _dbContext.BlEclaimEncounterType.ToListAsync());
            return EncouterType;
        }

        public async Task<List<BlEclaimEncounterStartType>> GetBlEclaimEncounterStartType()
        {
            var EncouterStartType = await Task.Run(()=>_dbContext.BlEclaimEncounterStartType.ToListAsync());
            return EncouterStartType;
        }

        public Task<List<BlEclaimEncounterEndType>> GetBlEclaimEncounterEndType()
        {
            var EncounterEndType = Task.Run(() => _dbContext.BlEclaimEncounterEndType.ToListAsync());
            return EncounterEndType;
        }

        public async Task<List<RegGenderIdentity>> GetRegGenderIdentities()
        {
            List<RegGenderIdentity> GetDGenderType = new List<RegGenderIdentity>();
             GetDGenderType = await Task.Run(() => _dbContext.RegGenderIdentity.ToListAsync());
            return GetDGenderType;
        }
        public async Task<List<ImmunizationList>> GetImmunizationLists()
        {
            var GetImmunizationLists = _dbContext.ImmunizationList.Where(x => x.Active == true).ToList();
            return GetImmunizationLists;
        }

        public async Task<List<Emrsite>> GetEMRSite()
        {
            var GetEMRSite = _dbContext.Emrsite.Where(x => x.Active == true).ToList();
            return GetEMRSite;
        }

        public async Task<List<Emrroute>> GetEMRRoute()
        {
            var GetEMRRoute = _dbContext.Emrroute.Where(x=>x.Active==true).ToList();
            return GetEMRRoute;
        }

        public async Task<List<AlergyTypes>> GetAlergyTypes()
        {
            var GetAlergyTypes = _dbContext.AlergyTypes.ToList();
            return GetAlergyTypes;
        }

        public async Task<List<SeverityType>> GetSeverityType()
        {
            var GetSeverityType = _dbContext.SeverityType.ToList();
            return GetSeverityType;
        }

        
        public async Task<List<PatientProcedureType>> GetPatientProcedureTypeList()
        {
            var ProcedureType = _dbContext.PatientProcedureType.ToList();
            return ProcedureType;
        }

        public async Task<List<SocialFamilyHistoryMaster>> GetSocialHistory()
        {
            var GetSocialHistory = _dbContext.SocialFamilyHistoryMaster.ToList();
            return GetSocialHistory;
        }

        public async Task<List<FamilyProblemList>> GetFamilyProblemHistory()
        {
            var GetFamilyProblemHistory = _dbContext.FamilyProblemList.ToList();
            return GetFamilyProblemHistory;
        }

        public async Task<List<MedicationComments>> GetComments()
        {
            var GetComments = _dbContext.MedicationComments.ToList();
            return GetComments;
        }

        public async Task<List<Emrfrequency>> GetFrequency()
        {
            var GetFrequency = _dbContext.Emrfrequency.Where(x => x.Active == true).ToList();
            return GetFrequency;
        }

        public async Task<List<RegAlertTypes>> GetAlertType()
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
