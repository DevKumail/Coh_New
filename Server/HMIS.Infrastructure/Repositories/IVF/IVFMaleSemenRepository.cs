using Dapper;
using HMIS.Core.DTOs;
using HMIS.Infrastructure.IRepositories;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace HMIS.Infrastructure.Repositories.IVF
{
    public class IVFMaleSemenRepository : IIVFMaleSemenRepository
    {
        private readonly string _connectionString;

        public IVFMaleSemenRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<(IEnumerable<IVFMaleSemenSampleListDto> Data, int TotalCount)> GetAllSemenSamples(int ivfMainId, int page, int pageSize)
        {
            using var connection = new SqlConnection(_connectionString);

            var parameters = new DynamicParameters();
            parameters.Add("@IVFMainId", ivfMainId);
            parameters.Add("@Page", page);
            parameters.Add("@PageSize", pageSize);
            parameters.Add("@TotalCount", dbType: DbType.Int32, direction: ParameterDirection.Output);

            // Use proper Dapper QueryAsync instead of DataSet
            var samples = await connection.QueryAsync<IVFMaleSemenSampleListDto>(
                "IVF_MaleSemenSamplesGetAll",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            var totalCount = parameters.Get<int>("@TotalCount");

            return (samples, totalCount);
        }

        public async Task<IVFMaleSemenSampleDto> GetSemenSampleById(int sampleId)
        {
            using var connection = new SqlConnection(_connectionString);

            // Use QueryMultiple for multiple result sets
            using var multi = await connection.QueryMultipleAsync(
                "IVF_MaleSemenSampleGetById",
                new { SampleId = sampleId },
                commandType: CommandType.StoredProcedure
            );

            var sample = await multi.ReadFirstOrDefaultAsync<IVFMaleSemenSampleDto>();
            if (sample == null) return null;

            // Read multiple result sets directly into objects
            sample.Observations = (await multi.ReadAsync<IVFMaleSemenObservationDto>()).ToList();
            var motilities = (await multi.ReadAsync<IVFMaleSemenMotilityDto>()).ToList();
            var morphologies = (await multi.ReadAsync<IVFMaleSemenMorphologyDto>()).ToList();
            var preparations = (await multi.ReadAsync<IVFMaleSemenObservationPreparationDto>()).ToList();
            var preparationMethods = (await multi.ReadAsync<IVFMaleSemenObservationPreparationMethodDto>()).ToList();
            sample.Diagnoses = (await multi.ReadAsync<IVFMaleSemenSampleDiagnosisDto>()).ToList();
            var icdTypes = (await multi.ReadAsync<IVFMaleSemenSampleDiagnosisICDTypeDto>()).ToList(); 
            sample.ApprovalStatus = await multi.ReadFirstOrDefaultAsync<IVFMaleSemenSampleApprovalStatusDto>();

            // Map related data
            MapRelatedData(sample, motilities, morphologies, preparations, preparationMethods, icdTypes); 

            return sample;
        }

        private void MapRelatedData(
            IVFMaleSemenSampleDto sample,
            List<IVFMaleSemenMotilityDto> motilities,
            List<IVFMaleSemenMorphologyDto> morphologies,
            List<IVFMaleSemenObservationPreparationDto> preparations,
            List<IVFMaleSemenObservationPreparationMethodDto> preparationMethods,
            List<IVFMaleSemenSampleDiagnosisICDTypeDto> icdTypes) 
        {
            foreach (var observation in sample.Observations)
            {
                observation.Motility = motilities.FirstOrDefault(m => m.ObservationId == observation.ObservationId);
                observation.Morphology = morphologies.FirstOrDefault(m => m.ObservationId == observation.ObservationId);
                observation.Preparations = preparations.Where(p => p.ObservationId == observation.ObservationId).ToList();

                foreach (var preparation in observation.Preparations)
                {
                    preparation.PreparationMethods = preparationMethods
                        .Where(pm => pm.PreparationId == preparation.PreparationId)
                        .ToList();
                }
            }

            // NEW: Map ICD types to diagnoses
            foreach (var diagnosis in sample.Diagnoses)
            {
                diagnosis.ICDTypes = icdTypes
                    .Where(icd => icd.DiagnosisId == diagnosis.DiagnosisId)
                    .ToList();
            }
        }
    }
}