using HMIS.Core.Context;
using HMIS.Core.DTOs;
using HMIS.Core.Entities;
using HMIS.Infrastructure.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Application.ServiceLogics.IVF
{
    public interface IIVFMaleSemenService
    {
        Task<bool> InsertOrUpdateSemenSample(IVFMaleSemenSampleDto sampleDto);
        Task<(IEnumerable<IVFMaleSemenSampleListDto> Data, int TotalCount)> GetAllSemenSamples(int page, int pageSize);
        Task<IVFMaleSemenSampleDto> GetSemenSampleById(int sampleId);
        Task<bool> DeleteSemenSample(int sampleId, int? updatedBy);
        Task<bool> DeleteObservation(int observationId, int? updatedBy);
        Task<bool> DeleteDiagnosis(int diagnosisId, int? updatedBy);
        Task<bool> UpdateApprovalStatus(IVFMaleSemenSampleApprovalStatusDto approvalStatusDto);
    }

    public class IVFMaleSemenService : IIVFMaleSemenService
    {
        private readonly HMISDbContext _context;
        private readonly IIVFMaleSemenRepository _semenRepository;

        public IVFMaleSemenService(HMISDbContext context, IIVFMaleSemenRepository semenRepository)
        {
            _context = context;
            _semenRepository = semenRepository;
        }

        public async Task<bool> InsertOrUpdateSemenSample(IVFMaleSemenSampleDto sampleDto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                IvfmaleSemenSample sample;

                if (sampleDto.SampleId > 0)
                {
                    // Update existing sample
                    sample = await _context.IvfmaleSemenSample
                        .Include(s => s.IvfmaleSemenObservation)
                        .FirstOrDefaultAsync(s => s.SampleId == sampleDto.SampleId && !s.IsDeleted);

                    if (sample == null) return false;

                    // Update sample properties
                    UpdateSampleProperties(sample, sampleDto);
                }
                else
                {
                    // Create new sample
                    sample = new IvfmaleSemenSample();
                    UpdateSampleProperties(sample, sampleDto);
                    sample.CreatedAt = DateTime.Now;
                    _context.IvfmaleSemenSample.Add(sample);
                }

                sample.UpdatedAt = DateTime.Now;
                await _context.SaveChangesAsync();

                // Handle nested entities
                await HandleObservations(sample.SampleId, sampleDto.Observations);
                await HandleDiagnoses(sample.SampleId, sampleDto.Diagnoses);
                await HandleApprovalStatus(sample.SampleId, sampleDto.ApprovalStatus);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return true;
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        private void UpdateSampleProperties(IvfmaleSemenSample sample, IVFMaleSemenSampleDto dto)
        {
            sample.IvfmainId = dto.IVFMainId;
            sample.SampleCode = dto.SampleCode;
            sample.CollectionDateTime = dto.CollectionDateTime;
            sample.ThawingDateTime = dto.ThawingDateTime;
            sample.PurposeId = dto.PurposeId;
            sample.CollectionMethodId = dto.CollectionMethodId;
            sample.CollectionPlaceId = dto.CollectionPlaceId;
            sample.CollectionDifficulties = dto.CollectionDifficulties;
            sample.AbstinencePeriod = dto.AbstinencePeriod;
            sample.AnalysisStartTime = dto.AnalysisStartTime;
            sample.AnalyzedById = dto.AnalyzedById;
            sample.AppearanceId = dto.AppearanceId;
            sample.SmellId = dto.SmellId;
            sample.ViscosityId = dto.ViscosityId;
            sample.LiquefactionMinutes = dto.LiquefactionMinutes;
            sample.Agglutination = dto.Agglutination ?? false;
            sample.TreatmentNotes = dto.TreatmentNotes;
            sample.Score = dto.Score;
            sample.DnafragmentedPercent = dto.DNAFragmentedPercent;
            sample.TimeBetweenCollectionUsage = dto.TimeBetweenCollectionUsage;
            sample.InseminationMotileSperms = dto.InseminationMotileSperms;
            sample.InseminatedAmountMl = dto.InseminatedAmountML;
            sample.Motility24hPercent = dto.Motility24hPercent;
            sample.CryoStatusId = dto.CryoStatusId;
            sample.StatusId = dto.StatusId;
            sample.UpdatedBy = dto.UpdatedBy;
        }

        private async System.Threading.Tasks.Task HandleObservations(int sampleId, List<IVFMaleSemenObservationDto> observationDtos)
        {
            if (observationDtos == null) return;

            foreach (var obsDto in observationDtos)
            {
                IvfmaleSemenObservation observation;

                if (obsDto.ObservationId > 0)
                {
                    observation = await _context.IvfmaleSemenObservation
                        .FirstOrDefaultAsync(o => o.ObservationId == obsDto.ObservationId);

                    if (observation == null) continue;
                }
                else
                {
                    observation = new IvfmaleSemenObservation { SampleId = sampleId };
                    _context.IvfmaleSemenObservation.Add(observation);
                }

                // Update observation properties
                UpdateObservationProperties(observation, obsDto);
                await _context.SaveChangesAsync();

                // Handle motility
                await HandleMotility(observation.ObservationId, obsDto.Motility);

                // Handle morphology
                await HandleMorphology(observation.ObservationId, obsDto.Morphology);

                // Handle preparations
                await HandlePreparations(observation.ObservationId, obsDto.Preparations);
            }
        }

        private void UpdateObservationProperties(IvfmaleSemenObservation observation, IVFMaleSemenObservationDto dto)
        {
            observation.ObservationType = dto.ObservationType;
            observation.VolumeMl = dto.VolumeML;
            observation.Phvalue = dto.PHValue;
            observation.ConcentrationPerMl = dto.ConcentrationPerML;
            observation.ConcLessThanPointOne = dto.ConcLessThanPointOne;
            observation.VitalityPercent = dto.VitalityPercent;
            observation.Leukocytesml = dto.Leukocytesml;
            observation.RoundCellsml = dto.RoundCellsml;
            observation.QuantificationPossibleId = dto.QuantificationPossibleId;
            observation.TotalSpermCount = dto.TotalSpermCount;
            observation.PeroxidasePositive = dto.PeroxidasePositive;
            observation.ImmunobeadAdherentPercent = dto.ImmunobeadAdherentPercent;
            observation.MartesPercent = dto.MARTesPercent;
            observation.MarIgGPercent = dto.MAR_IgG_Percent;
            observation.MarIgAPercent = dto.MAR_IgA_Percent;
            observation.UpdatedBy = dto.UpdatedBy;
            observation.UpdatedAt = DateTime.Now;

            if (observation.ObservationId == 0)
            {
                observation.CreatedBy = dto.CreatedBy;
                observation.CreatedAt = DateTime.Now;
            }
        }

        private async System.Threading.Tasks.Task HandleMotility(int observationId, IVFMaleSemenMotilityDto motilityDto)
        {
            if (motilityDto == null) return;

            var motility = await _context.IvfmaleSemenMotility
                .FirstOrDefaultAsync(m => m.ObservationId == observationId);

            if (motility == null)
            {
                motility = new IvfmaleSemenMotility { ObservationId = observationId };
                _context.IvfmaleSemenMotility.Add(motility);
            }

            motility.WhoAbPercent = motilityDto.WHO_AB_Percent;
            motility.WhoCPercent = motilityDto.WHO_C_Percent;
            motility.WhoDPercent = motilityDto.WHO_D_Percent;
            motility.ProgressiveMotile = motilityDto.ProgressiveMotile;
            motility.OverallMotilityPercent = motilityDto.OverallMotilityPercent;
            motility.UpdatedAt = DateTime.Now;

            if (motility.MotilityId == 0)
            {
                motility.CreatedAt = DateTime.Now;
            }
        }

        private async System.Threading.Tasks.Task HandleMorphology(int observationId, IVFMaleSemenMorphologyDto morphologyDto)
        {
            if (morphologyDto == null) return;

            var morphology = await _context.IvfmaleSemenMorphology
                .FirstOrDefaultAsync(m => m.ObservationId == observationId);

            if (morphology == null)
            {
                morphology = new IvfmaleSemenMorphology { ObservationId = observationId };
                _context.IvfmaleSemenMorphology.Add(morphology);
            }

            morphology.MorphologyNormalPercent = morphologyDto.MorphologyNormalPercent;
            morphology.HeadDefectsPercent = morphologyDto.HeadDefectsPercent;
            morphology.NeckMidpieceDefectsPercent = morphologyDto.NeckMidpieceDefectsPercent;
            morphology.TailDefectsPercent = morphologyDto.TailDefectsPercent;
            morphology.Ercpercent = morphologyDto.ERCPercent;
            morphology.MultipleDefectsPercent = morphologyDto.MultipleDefectsPercent;
            morphology.TeratozoospermiaIndex = morphologyDto.TeratozoospermiaIndex;
            morphology.UpdatedAt = DateTime.Now;

            if (morphology.MorphologyId == 0)
            {
                morphology.CreatedAt = DateTime.Now;
            }
        }

        private async System.Threading.Tasks.Task HandlePreparations(int observationId, List<IVFMaleSemenObservationPreparationDto> preparationDtos)
        {
            if (preparationDtos == null) return;

            foreach (var prepDto in preparationDtos)
            {
                IvfmaleSemenObservationPreparation preparation;

                if (prepDto.PreparationId > 0)
                {
                    preparation = await _context.IvfmaleSemenObservationPreparation
                        .FirstOrDefaultAsync(p => p.PreparationId == prepDto.PreparationId);

                    if (preparation == null) continue;
                }
                else
                {
                    preparation = new IvfmaleSemenObservationPreparation { ObservationId = observationId };
                    _context.IvfmaleSemenObservationPreparation.Add(preparation);
                }

                preparation.PreparationDate = prepDto.PreparationDate;
                preparation.PreparationTime = prepDto.PreparationTime;
                preparation.PreparedById = prepDto.PreparedById;
                preparation.UpdatedAt = DateTime.Now;

                if (preparation.PreparationId == 0)
                {
                    preparation.CreatedAt = DateTime.Now;
                }

                await _context.SaveChangesAsync();

                // Handle preparation methods
                await HandlePreparationMethods(preparation.PreparationId, prepDto.PreparationMethods);
            }
        }
        private async System.Threading.Tasks.Task HandlePreparationMethods(int preparationId, List<IVFMaleSemenObservationPreparationMethodDto> methodDtos)
        {
            if (methodDtos == null) return;

            // Remove existing methods
            var existingMethods = _context.IvfmaleSemenObservationPreparationMethod
                .Where(m => m.PreparationId == preparationId);
            _context.IvfmaleSemenObservationPreparationMethod.RemoveRange(existingMethods);

            // Add new methods
            foreach (var methodDto in methodDtos)
            {
                var method = new IvfmaleSemenObservationPreparationMethod
                {
                    PreparationId = preparationId,
                    PreparationMethodId = methodDto.PreparationMethodId,
                    CreatedAt = DateTime.Now
                };
                _context.IvfmaleSemenObservationPreparationMethod.Add(method);
            }
        }

        private async System.Threading.Tasks.Task HandleDiagnoses(int sampleId, List<IVFMaleSemenSampleDiagnosisDto> diagnosisDtos)
        {
            if (diagnosisDtos == null) return;

            // Remove existing diagnoses and add new ones
            var existingDiagnoses = _context.IvfmaleSemenSampleDiagnosis
                .Where(d => d.SampleId == sampleId);
            _context.IvfmaleSemenSampleDiagnosis.RemoveRange(existingDiagnoses);

            foreach (var diagDto in diagnosisDtos)
            {
                var diagnosis = new IvfmaleSemenSampleDiagnosis
                {
                    SampleId = sampleId,
                    IcdcodeId = diagDto.ICDCodeId,
                    Finding = diagDto.Finding,
                    Notes = diagDto.Notes,
                    CreatedBy = diagDto.CreatedBy,
                    CreatedAt = DateTime.Now
                };
                _context.IvfmaleSemenSampleDiagnosis.Add(diagnosis);
            }
        }

        private async System.Threading.Tasks.Task HandleApprovalStatus(int sampleId, IVFMaleSemenSampleApprovalStatusDto approvalStatusDto)
        {
            if (approvalStatusDto == null) return;

            var approvalStatus = await _context.IvfmaleSemenSampleApprovalStatus
                .FirstOrDefaultAsync(a => a.SampleId == sampleId);

            if (approvalStatus == null)
            {
                approvalStatus = new IvfmaleSemenSampleApprovalStatus { SampleId = sampleId };
                _context.IvfmaleSemenSampleApprovalStatus.Add(approvalStatus);
            }

            approvalStatus.IsApproved = approvalStatusDto.IsApproved;
            approvalStatus.IsAttention = approvalStatusDto.IsAttention;
            approvalStatus.AttentionForId = approvalStatusDto.AttentionForId;
            approvalStatus.Comment = approvalStatusDto.Comment;
            approvalStatus.UpdatedBy = approvalStatusDto.UpdatedBy;
            approvalStatus.UpdatedAt = DateTime.Now;

            if (approvalStatus.ApprovalStatusId == 0)
            {
                approvalStatus.CreatedBy = approvalStatusDto.CreatedBy;
                approvalStatus.CreatedAt = DateTime.Now;
            }
        }

        //public async Task<(IEnumerable<IVFMaleSemenSampleListDto> Data, int TotalCount)> GetAllSemenSamples(int page, int pageSize)
        //{
        //    var query = _context.IvfmaleSemenSample
        //        .Include(s => s.IvfmaleSemenObservation)
        //            .ThenInclude(o => o.ivf)
        //        .Include(s => s.IvfmaleSemenObservation)
        //            .ThenInclude(o => o.IvfmaleSemenMorphology)
        //        .Include(s => s.Purpose) // Assuming this is a navigation property to DropdownConfiguration
        //        .Include(s => s.CollectionMethod) // Assuming this is a navigation property to DropdownConfiguration
        //        .Include(s => s.CryoStatus) // Assuming this is a navigation property
        //        .Include(s => s.Status) // Assuming this is a navigation property
        //        .Include(s => s.CreatedByNavigation) // Assuming this is a navigation property to User
        //        .Where(s => !s.IsDeleted)
        //        .OrderByDescending(s => s.SampleId);

        //    int totalCount = await query.CountAsync();

        //    var samples = await query
        //        .Skip((page - 1) * pageSize)
        //        .Take(pageSize)
        //        .Select(s => new IVFMaleSemenSampleListDto
        //        {
        //            SampleId = s.SampleId,
        //            SampleCode = s.SampleCode,
        //            CollectionDateTime = s.CollectionDateTime,
        //            ThawingDateTime = s.ThawingDateTime,
        //            Purpose = s.Purpose != null ? s.Purpose.DisplayValue : null, // Assuming DisplayValue property in DropdownConfiguration
        //            CollectionMethod = s.CollectionMethod != null ? s.CollectionMethod.DisplayValue : null,
        //            VolumeML = s.IvfmaleSemenObservation.FirstOrDefault().VolumeMl,
        //            ConcentrationPerML = s.IvfmaleSemenObservation.FirstOrDefault().ConcentrationPerMl,
        //            TotalSpermCount = s.IvfmaleSemenObservation.FirstOrDefault().TotalSpermCount,
        //            WHO_AB_Percent = s.IvfmaleSemenObservation.FirstOrDefault().IvfmaleSemenMotility.WhoAbPercent,
        //            WHO_C_Percent = s.IvfmaleSemenObservation.FirstOrDefault().IvfmaleSemenMotility.WhoCPercent,
        //            WHO_D_Percent = s.IvfmaleSemenObservation.FirstOrDefault().IvfmaleSemenMotility.WhoDPercent,
        //            MorphologyNormalPercent = s.IvfmaleSemenObservation.FirstOrDefault().IvfmaleSemenMorphology.MorphologyNormalPercent,
        //            CryoStatus = s.CryoStatus != null ? s.CryoStatus.DisplayValue : null, // Adjust based on your Status entity
        //            Status = s.Status != null ? s.Status.DisplayValue : null, // Adjust based on your Status entity
        //            CreatedBy = s.CreatedByNavigation != null ? s.CreatedByNavigation.FullName : s.CreatedBy.ToString(), // Adjust based on your User entity
        //            CreatedAt = s.CreatedAt
        //        })
        //        .ToListAsync();

        //    return (samples, totalCount);
        //}

        public async Task<(IEnumerable<IVFMaleSemenSampleListDto> Data, int TotalCount)> GetAllSemenSamples(int page, int pageSize)
        {
            return await _semenRepository.GetAllSemenSamples(page, pageSize);
        }


        public async Task<IVFMaleSemenSampleDto> GetSemenSampleById(int sampleId)
        {
            var sample = await _context.IvfmaleSemenSample
                .Include(s => s.IvfmaleSemenObservation)
                .Include(s => s.IvfmaleSemenSampleDiagnosis)
                .Include(s => s.IvfmaleSemenSampleApprovalStatus)
                .FirstOrDefaultAsync(s => s.SampleId == sampleId && !s.IsDeleted);

            if (sample == null) return null;

            // Get related entities separately
            var observations = await GetObservationsWithDetails(sample.IvfmaleSemenObservation?.Select(o => o.ObservationId).ToList() ?? new List<int>());

            return MapToSampleDto(sample, observations);
        }

        private async Task<List<ObservationWithDetails>> GetObservationsWithDetails(List<int> observationIds)
        {
            if (!observationIds.Any()) return new List<ObservationWithDetails>();

            var observationsWithDetails = new List<ObservationWithDetails>();

            foreach (var observationId in observationIds)
            {
                var motility = await _context.IvfmaleSemenMotility
                    .FirstOrDefaultAsync(m => m.ObservationId == observationId);

                var morphology = await _context.IvfmaleSemenMorphology
                    .FirstOrDefaultAsync(m => m.ObservationId == observationId);

                var preparations = await _context.IvfmaleSemenObservationPreparation
                    .Where(p => p.ObservationId == observationId)
                    .Select(p => new PreparationWithMethods
                    {
                        Preparation = p,
                        Methods = _context.IvfmaleSemenObservationPreparationMethod
                            .Where(m => m.PreparationId == p.PreparationId)
                            .ToList()
                    })
                    .ToListAsync();

                observationsWithDetails.Add(new ObservationWithDetails
                {
                    ObservationId = observationId,
                    Motility = motility,
                    Morphology = morphology,
                    Preparations = preparations
                });
            }

            return observationsWithDetails;
        }

        private IVFMaleSemenSampleDto MapToSampleDto(IvfmaleSemenSample sample, List<ObservationWithDetails> observationsWithDetails)
        {
            var sampleDto = new IVFMaleSemenSampleDto
            {
                SampleId = sample.SampleId,
                IVFMainId = sample.IvfmainId,
                SampleCode = sample.SampleCode,
                CollectionDateTime = sample.CollectionDateTime,
                ThawingDateTime = sample.ThawingDateTime,
                PurposeId = sample.PurposeId,
                CollectionMethodId = sample.CollectionMethodId,
                CollectionPlaceId = sample.CollectionPlaceId,
                CollectionDifficulties = sample.CollectionDifficulties,
                AbstinencePeriod = sample.AbstinencePeriod,
                AnalysisStartTime = sample.AnalysisStartTime,
                AnalyzedById = sample.AnalyzedById,
                AppearanceId = sample.AppearanceId,
                SmellId = sample.SmellId,
                ViscosityId = sample.ViscosityId,
                LiquefactionMinutes = sample.LiquefactionMinutes,
                Agglutination = sample.Agglutination,
                TreatmentNotes = sample.TreatmentNotes,
                Score = sample.Score,
                DNAFragmentedPercent = sample.DnafragmentedPercent,
                TimeBetweenCollectionUsage = sample.TimeBetweenCollectionUsage,
                InseminationMotileSperms = sample.InseminationMotileSperms,
                InseminatedAmountML = sample.InseminatedAmountMl,
                Motility24hPercent = sample.Motility24hPercent,
                CryoStatusId = sample.CryoStatusId,
                StatusId = sample.StatusId,
                CreatedBy = sample.CreatedBy,
                UpdatedBy = sample.UpdatedBy,
                CreatedAt = sample.CreatedAt,
                UpdatedAt = sample.UpdatedAt,
                Observations = new List<IVFMaleSemenObservationDto>(),
                Diagnoses = sample.IvfmaleSemenSampleDiagnosis?.Select(d => new IVFMaleSemenSampleDiagnosisDto
                {
                    DiagnosisId = d.DiagnosisId,
                    SampleId = d.SampleId,
                    ICDCodeId = d.IcdcodeId,
                    Finding = d.Finding,
                    Notes = d.Notes,
                    CreatedBy = d.CreatedBy,
                    UpdatedBy = d.UpdatedBy,
                    CreatedAt = d.CreatedAt,
                    UpdatedAt = d.UpdatedAt
                }).ToList(),
                ApprovalStatus = sample.IvfmaleSemenSampleApprovalStatus?.FirstOrDefault() != null ? new IVFMaleSemenSampleApprovalStatusDto
                {
                    ApprovalStatusId = sample.IvfmaleSemenSampleApprovalStatus.FirstOrDefault().ApprovalStatusId,
                    SampleId = sample.IvfmaleSemenSampleApprovalStatus.FirstOrDefault().SampleId,
                    IsApproved = sample.IvfmaleSemenSampleApprovalStatus.FirstOrDefault().IsApproved,
                    IsAttention = sample.IvfmaleSemenSampleApprovalStatus.FirstOrDefault().IsAttention,
                    AttentionForId = sample.IvfmaleSemenSampleApprovalStatus.FirstOrDefault().AttentionForId,
                    Comment = sample.IvfmaleSemenSampleApprovalStatus.FirstOrDefault().Comment,
                    CreatedBy = sample.IvfmaleSemenSampleApprovalStatus.FirstOrDefault().CreatedBy,
                    UpdatedBy = sample.IvfmaleSemenSampleApprovalStatus.FirstOrDefault().UpdatedBy,
                    CreatedAt = sample.IvfmaleSemenSampleApprovalStatus.FirstOrDefault().CreatedAt,
                    UpdatedAt = sample.IvfmaleSemenSampleApprovalStatus.FirstOrDefault().UpdatedAt
                } : null
            };

            // Map observations with their details
            if (sample.IvfmaleSemenObservation != null)
            {
                foreach (var observation in sample.IvfmaleSemenObservation)
                {
                    var observationDetails = observationsWithDetails.FirstOrDefault(o => o.ObservationId == observation.ObservationId);

                    var observationDto = new IVFMaleSemenObservationDto
                    {
                        ObservationId = observation.ObservationId,
                        SampleId = observation.SampleId,
                        ObservationType = observation.ObservationType,
                        VolumeML = observation.VolumeMl,
                        PHValue = observation.Phvalue,
                        ConcentrationPerML = observation.ConcentrationPerMl,
                        ConcLessThanPointOne = observation.ConcLessThanPointOne,
                        VitalityPercent = observation.VitalityPercent,
                        Leukocytesml = observation.Leukocytesml,
                        RoundCellsml = observation.RoundCellsml,
                        QuantificationPossibleId = observation.QuantificationPossibleId,
                        TotalSpermCount = observation.TotalSpermCount,
                        PeroxidasePositive = observation.PeroxidasePositive,
                        ImmunobeadAdherentPercent = observation.ImmunobeadAdherentPercent,
                        MARTesPercent = observation.MartesPercent,
                        MAR_IgG_Percent = observation.MarIgGPercent,
                        MAR_IgA_Percent = observation.MarIgAPercent,
                        CreatedBy = observation.CreatedBy,
                        UpdatedBy = observation.UpdatedBy,
                        CreatedAt = observation.CreatedAt,
                        UpdatedAt = observation.UpdatedAt,
                        Motility = observationDetails?.Motility != null ? new IVFMaleSemenMotilityDto
                        {
                            MotilityId = observationDetails.Motility.MotilityId,
                            ObservationId = observationDetails.Motility.ObservationId,
                            WHO_AB_Percent = observationDetails.Motility.WhoAbPercent,
                            WHO_C_Percent = observationDetails.Motility.WhoCPercent,
                            WHO_D_Percent = observationDetails.Motility.WhoDPercent,
                            ProgressiveMotile = observationDetails.Motility.ProgressiveMotile,
                            OverallMotilityPercent = observationDetails.Motility.OverallMotilityPercent,
                            CreatedAt = observationDetails.Motility.CreatedAt,
                            UpdatedAt = observationDetails.Motility.UpdatedAt
                        } : null,
                        Morphology = observationDetails?.Morphology != null ? new IVFMaleSemenMorphologyDto
                        {
                            MorphologyId = observationDetails.Morphology.MorphologyId,
                            ObservationId = observationDetails.Morphology.ObservationId,
                            MorphologyNormalPercent = observationDetails.Morphology.MorphologyNormalPercent,
                            HeadDefectsPercent = observationDetails.Morphology.HeadDefectsPercent,
                            NeckMidpieceDefectsPercent = observationDetails.Morphology.NeckMidpieceDefectsPercent,
                            TailDefectsPercent = observationDetails.Morphology.TailDefectsPercent,
                            ERCPercent = observationDetails.Morphology.Ercpercent,
                            MultipleDefectsPercent = observationDetails.Morphology.MultipleDefectsPercent,
                            TeratozoospermiaIndex = observationDetails.Morphology.TeratozoospermiaIndex,
                            CreatedAt = observationDetails.Morphology.CreatedAt,
                            UpdatedAt = observationDetails.Morphology.UpdatedAt
                        } : null,
                        Preparations = observationDetails?.Preparations?.Select(p => new IVFMaleSemenObservationPreparationDto
                        {
                            PreparationId = p.Preparation.PreparationId,
                            ObservationId = p.Preparation.ObservationId,
                            PreparationDate = p.Preparation.PreparationDate,
                            PreparationTime = p.Preparation.PreparationTime,
                            PreparedById = p.Preparation.PreparedById,
                            CreatedAt = p.Preparation.CreatedAt,
                            UpdatedAt = p.Preparation.UpdatedAt,
                            PreparationMethods = p.Methods?.Select(pm => new IVFMaleSemenObservationPreparationMethodDto
                            {
                                Id = pm.Id,
                                PreparationId = pm.PreparationId,
                                PreparationMethodId = pm.PreparationMethodId,
                                CreatedAt = pm.CreatedAt
                            }).ToList()
                        }).ToList()
                    };

                    sampleDto.Observations.Add(observationDto);
                }
            }

            return sampleDto;
        }

        public async Task<bool> DeleteSemenSample(int sampleId, int? updatedBy)
        {
            var sample = await _context.IvfmaleSemenSample
                .FirstOrDefaultAsync(s => s.SampleId == sampleId && !s.IsDeleted);

            if (sample == null) return false;

            sample.IsDeleted = true;
            sample.UpdatedBy = updatedBy;
            sample.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteObservation(int observationId, int? updatedBy)
        {
            var observation = await _context.IvfmaleSemenObservation
                .FirstOrDefaultAsync(o => o.ObservationId == observationId);

            if (observation == null) return false;

            // Also delete related motility, morphology, and preparations
            var motility = await _context.IvfmaleSemenMotility
                .FirstOrDefaultAsync(m => m.ObservationId == observationId);
            if (motility != null)
                _context.IvfmaleSemenMotility.Remove(motility);

            var morphology = await _context.IvfmaleSemenMorphology
                .FirstOrDefaultAsync(m => m.ObservationId == observationId);
            if (morphology != null)
                _context.IvfmaleSemenMorphology.Remove(morphology);

            var preparations = await _context.IvfmaleSemenObservationPreparation
                .Where(p => p.ObservationId == observationId)
                .ToListAsync();
            foreach (var preparation in preparations)
            {
                var methods = await _context.IvfmaleSemenObservationPreparationMethod
                    .Where(m => m.PreparationId == preparation.PreparationId)
                    .ToListAsync();
                _context.IvfmaleSemenObservationPreparationMethod.RemoveRange(methods);
            }
            _context.IvfmaleSemenObservationPreparation.RemoveRange(preparations);

            _context.IvfmaleSemenObservation.Remove(observation);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteDiagnosis(int diagnosisId, int? updatedBy)
        {
            var diagnosis = await _context.IvfmaleSemenSampleDiagnosis
                .FirstOrDefaultAsync(d => d.DiagnosisId == diagnosisId);

            if (diagnosis == null) return false;

            _context.IvfmaleSemenSampleDiagnosis.Remove(diagnosis);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateApprovalStatus(IVFMaleSemenSampleApprovalStatusDto approvalStatusDto)
        {
            var approvalStatus = await _context.IvfmaleSemenSampleApprovalStatus
                .FirstOrDefaultAsync(a => a.SampleId == approvalStatusDto.SampleId);

            if (approvalStatus == null)
            {
                approvalStatus = new IvfmaleSemenSampleApprovalStatus
                {
                    SampleId = approvalStatusDto.SampleId,
                    CreatedBy = approvalStatusDto.CreatedBy,
                    CreatedAt = DateTime.Now
                };
                _context.IvfmaleSemenSampleApprovalStatus.Add(approvalStatus);
            }

            approvalStatus.IsApproved = approvalStatusDto.IsApproved;
            approvalStatus.IsAttention = approvalStatusDto.IsAttention;
            approvalStatus.AttentionForId = approvalStatusDto.AttentionForId;
            approvalStatus.Comment = approvalStatusDto.Comment;
            approvalStatus.UpdatedBy = approvalStatusDto.UpdatedBy;
            approvalStatus.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }
    }

    // Helper classes for data mapping
    internal class ObservationWithDetails
    {
        public int ObservationId { get; set; }
        public IvfmaleSemenMotility? Motility { get; set; }
        public IvfmaleSemenMorphology? Morphology { get; set; }
        public List<PreparationWithMethods>? Preparations { get; set; }
    }

    internal class PreparationWithMethods
    {
        public IvfmaleSemenObservationPreparation Preparation { get; set; }
        public List<IvfmaleSemenObservationPreparationMethod> Methods { get; set; }
    }
}

