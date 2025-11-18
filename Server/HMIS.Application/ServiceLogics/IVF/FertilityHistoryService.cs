using HMIS.Application.DTOs.IVFDTOs;
using HMIS.Application.DTOs.SpLocalModel;
using HMIS.Core.Context;
using HMIS.Core.Entities;
using HMIS.Infrastructure.ORM;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace HMIS.Application.ServiceLogics.IVF
{
    public interface IFertilityHistoryService
    {
        Task<(bool IsSuccess, DashboardReadDTO Data)> GetFertilityHistory(string ivfmainid, PaginationInfo pagination);
        Task<Result<int>> CreateMaleFertilityHistoryAsync(IVFMaleFertilityHistoryDto dto);
    }
    internal class FertilityHistoryService : IFertilityHistoryService
    {
        private readonly DapperContext _dapper;
        private readonly HMISDbContext _context;
        public FertilityHistoryService(DapperContext dapper, HMISDbContext db)
        {
            _dapper = dapper;
            _context = db;
        }

        public Task<(bool IsSuccess, DashboardReadDTO Data)> GetFertilityHistory(string ivfmainid, PaginationInfo pagination)
        {
            throw new NotImplementedException();
        }
        public async Task<Result<int>> CreateMaleFertilityHistoryAsync(IVFMaleFertilityHistoryDto dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Validate required fields
                if (dto.IVFMainId <= 0)
                {
                    return Result<int>.Failure("IVFMainId is required");
                }

                if (dto.ProviderId <= 0)
                {
                    return Result<int>.Failure("ProviderId is required");
                }

                // Upsert main fertility history
                IvfmaleFertilityHistory fertilityHistory;
                if (dto.IVFMaleFHId.HasValue && dto.IVFMaleFHId.Value > 0)
                {
                    fertilityHistory = await _context.IvfmaleFertilityHistory
                        .FirstOrDefaultAsync(x => x.IvfmaleFhid == dto.IVFMaleFHId.Value);
                    if (fertilityHistory == null)
                    {
                        fertilityHistory = new IvfmaleFertilityHistory { IvfmainId = dto.IVFMainId };
                        _context.IvfmaleFertilityHistory.Add(fertilityHistory);
                    }
                }
                else
                {
                    fertilityHistory = new IvfmaleFertilityHistory { IvfmainId = dto.IVFMainId };
                    _context.IvfmaleFertilityHistory.Add(fertilityHistory);
                }

                fertilityHistory.Date = dto.Date;
                fertilityHistory.ProviderId = dto.ProviderId;
                fertilityHistory.Adiposity = dto.Adiposity;
                fertilityHistory.GenerallyHealthy = dto.GenerallyHealthy;
                fertilityHistory.LongTermMedication = dto.LongTermMedication;
                fertilityHistory.NoOfPregnanciesAchieved = dto.NoOfPregnanciesAchieved;
                fertilityHistory.ChromosomeAnalysisCategoryId = dto.ChromosomeAnalysisCategoryId;
                fertilityHistory.Cftrcarrier = dto.CFTRCarrier;

                await _context.SaveChangesAsync();

                int maleFHId = fertilityHistory.IvfmaleFhid;

                // Create General record if provided
                if (dto.General != null)
                {
                    IvfmaleFhgeneral general;
                    if (dto.General.IVFMaleFHGeneralId.HasValue && dto.General.IVFMaleFHGeneralId.Value > 0)
                    {
                        general = await _context.IvfmaleFhgeneral.FirstOrDefaultAsync(g => g.IvfmaleFhgeneralId == dto.General.IVFMaleFHGeneralId.Value);
                        if (general == null)
                        {
                            general = new IvfmaleFhgeneral { IvfmaleFhid = maleFHId };
                            _context.IvfmaleFhgeneral.Add(general);
                        }
                    }
                    else
                    {
                        general = await _context.IvfmaleFhgeneral.FirstOrDefaultAsync(g => g.IvfmaleFhid == maleFHId) ?? new IvfmaleFhgeneral { IvfmaleFhid = maleFHId };
                        if (general.IvfmaleFhgeneralId == 0) _context.IvfmaleFhgeneral.Add(general);
                    }

                    general.HasChildren = dto.General.HasChildren;
                    general.Girls = dto.General.Girls;
                    general.Boys = dto.General.Boys;
                    general.InfertileSince = dto.General.InfertileSince;
                    general.AndrologicalDiagnosisPerformed = dto.General.AndrologicalDiagnosisPerformed;
                    general.Date = dto.General.Date;
                    general.InfertilityType = dto.General.InfertilityType;

                    await _context.SaveChangesAsync();

                    int generalId = general.IvfmaleFhgeneralId;

                    // Create Further Planning if provided
                    if (dto.General.FurtherPlanning != null)
                    {
                        IvfmaleFhfurtherPlanning furtherPlanning;
                        if (dto.General.FurtherPlanning.IVFMaleFHFurtherPlanningId.HasValue && dto.General.FurtherPlanning.IVFMaleFHFurtherPlanningId.Value > 0)
                        {
                            furtherPlanning = await _context.IvfmaleFhfurtherPlanning.FirstOrDefaultAsync(x => x.IvfmaleFhfurtherPlanningId == dto.General.FurtherPlanning.IVFMaleFHFurtherPlanningId.Value) ?? new IvfmaleFhfurtherPlanning { IvfmaleFhgeneralId = generalId };
                        }
                        else
                        {
                            furtherPlanning = await _context.IvfmaleFhfurtherPlanning.FirstOrDefaultAsync(x => x.IvfmaleFhgeneralId == generalId) ?? new IvfmaleFhfurtherPlanning { IvfmaleFhgeneralId = generalId };
                        }
                        if (furtherPlanning.IvfmaleFhfurtherPlanningId == 0) _context.IvfmaleFhfurtherPlanning.Add(furtherPlanning);

                        furtherPlanning.SemenAnalysis = dto.General.FurtherPlanning.SemenAnalysis;
                        furtherPlanning.MorphologicalExamination = dto.General.FurtherPlanning.MorphologicalExamination;
                        furtherPlanning.SerologicalExamination = dto.General.FurtherPlanning.SerologicalExamination;
                        furtherPlanning.AndrologicalUrologicalConsultation = dto.General.FurtherPlanning.AndrologicalUrologicalConsultation;
                        furtherPlanning.Dnafragmentation = dto.General.FurtherPlanning.DNAFragmentation;
                        furtherPlanning.SpermFreezing = dto.General.FurtherPlanning.SpermFreezing;
                    }

                    // Create Illness if provided
                    if (dto.General.Illness != null)
                    {
                        IvfmaleFhillness illness;
                        if (dto.General.Illness.IVFMaleFHIllnessId.HasValue && dto.General.Illness.IVFMaleFHIllnessId.Value > 0)
                        {
                            illness = await _context.IvfmaleFhillness.FirstOrDefaultAsync(x => x.IvfmaleFhillnessId == dto.General.Illness.IVFMaleFHIllnessId.Value) ?? new IvfmaleFhillness { IvfmaleFhgeneralId = generalId };
                        }
                        else
                        {
                            illness = await _context.IvfmaleFhillness.FirstOrDefaultAsync(x => x.IvfmaleFhgeneralId == generalId) ?? new IvfmaleFhillness { IvfmaleFhgeneralId = generalId };
                        }
                        if (illness.IvfmaleFhillnessId == 0) _context.IvfmaleFhillness.Add(illness);

                        illness.Idiopathic = dto.General.Illness.Idiopathic;
                        illness.MumpsAfterPuberty = dto.General.Illness.MumpsAfterPuberty;
                        illness.Endocrinopathies = dto.General.Illness.Endocrinopathies;
                        illness.PreviousTumor = dto.General.Illness.PreviousTumor;
                        illness.Hepatitis = dto.General.Illness.Hepatitis;
                        illness.HepatitisDetails = dto.General.Illness.HepatitisDetails;
                        illness.ExistingAllergies = dto.General.Illness.ExistingAllergies;
                        illness.ExistingAllergiesDetails = dto.General.Illness.ExistingAllergiesDetails;
                        illness.ChronicIllnesses = dto.General.Illness.ChronicIllnesses;
                        illness.OtherDiseases = dto.General.Illness.OtherDiseases;

                        await _context.SaveChangesAsync();

                        int illnessId = illness.IvfmaleFhillnessId;

                        // Create Illness-Idiopathic mappings if provided
                        if (dto.General.Illness.IdiopathicIds != null && dto.General.Illness.IdiopathicIds.Any())
                        {
                            // replace existing mappings
                            var existingIdiopathics = await _context.IvfmaleFhillnessIdiopathic.Where(m => m.IvfmaleFhillnessId == illnessId).ToListAsync();
                            if (existingIdiopathics.Any())
                                _context.IvfmaleFhillnessIdiopathic.RemoveRange(existingIdiopathics);

                            foreach (var idiopathicId in dto.General.Illness.IdiopathicIds)
                            {
                                var illnessIdiopathic = new IvfmaleFhillnessIdiopathic
                                {
                                    IvfmaleFhillnessId = illnessId,
                                    IvfmaleFhidiopathicId = idiopathicId
                                };

                                _context.IvfmaleFhillnessIdiopathic.Add(illnessIdiopathic);
                            }
                        }
                    }

                    // Create Performed Treatment if provided
                    if (dto.General.PerformedTreatment != null)
                    {
                        IvfmaleFhperformedTreatment performedTreatment;
                        if (dto.General.PerformedTreatment.IVFMaleFHPerformedTreatmentId.HasValue && dto.General.PerformedTreatment.IVFMaleFHPerformedTreatmentId.Value > 0)
                        {
                            performedTreatment = await _context.IvfmaleFhperformedTreatment.FirstOrDefaultAsync(x => x.IvfmaleFhperformedTreatmentId == dto.General.PerformedTreatment.IVFMaleFHPerformedTreatmentId.Value) ?? new IvfmaleFhperformedTreatment { IvfmaleFhgeneralId = generalId };
                        }
                        else
                        {
                            performedTreatment = await _context.IvfmaleFhperformedTreatment.FirstOrDefaultAsync(x => x.IvfmaleFhgeneralId == generalId) ?? new IvfmaleFhperformedTreatment { IvfmaleFhgeneralId = generalId };
                        }
                        if (performedTreatment.IvfmaleFhperformedTreatmentId == 0) _context.IvfmaleFhperformedTreatment.Add(performedTreatment);

                        performedTreatment.AlreadyTreated = dto.General.PerformedTreatment.AlreadyTreated;
                        performedTreatment.Notes = dto.General.PerformedTreatment.Notes;

                        await _context.SaveChangesAsync();

                        int performedTreatmentId = performedTreatment.IvfmaleFhperformedTreatmentId;

                        // Create Treatment Years if provided
                        if (dto.General.PerformedTreatment.TreatmentYears != null &&
                            dto.General.PerformedTreatment.TreatmentYears.Any())
                        {
                            // replace existing years
                            var existingYears = await _context.IvfmaleFhperformedTreatmentYear.Where(y => y.IvfmaleFhperformedTreatmentId == performedTreatmentId).ToListAsync();
                            if (existingYears.Any()) _context.IvfmaleFhperformedTreatmentYear.RemoveRange(existingYears);

                            foreach (var yearDto in dto.General.PerformedTreatment.TreatmentYears)
                            {
                                var treatmentYear = new IvfmaleFhperformedTreatmentYear
                                {
                                    IvfmaleFhperformedTreatmentId = performedTreatmentId,
                                    TreatmentType = yearDto.TreatmentType,
                                    TreatmentNumber = yearDto.TreatmentNumber,
                                    Year = yearDto.Year
                                };

                                _context.IvfmaleFhperformedTreatmentYear.Add(treatmentYear);
                            }
                        }
                    }

                    await _context.SaveChangesAsync();
                }

                // Create Genetics record if provided
                if (dto.Genetics != null)
                {
                    IvfmaleFhgenetics genetics;
                    if (dto.Genetics.IVFMaleFHGeneticsId.HasValue && dto.Genetics.IVFMaleFHGeneticsId.Value > 0)
                    {
                        genetics = await _context.IvfmaleFhgenetics.FirstOrDefaultAsync(x => x.IvfmaleFhgeneticsId == dto.Genetics.IVFMaleFHGeneticsId.Value) ?? new IvfmaleFhgenetics { IvfmaleFhid = maleFHId };
                    }
                    else
                    {
                        genetics = await _context.IvfmaleFhgenetics.FirstOrDefaultAsync(x => x.IvfmaleFhid == maleFHId) ?? new IvfmaleFhgenetics { IvfmaleFhid = maleFHId };
                    }
                    if (genetics.IvfmaleFhgeneticsId == 0) _context.IvfmaleFhgenetics.Add(genetics);

                    genetics.Genetics = dto.Genetics.Genetics;
                    genetics.CategoryIdInheritance = dto.Genetics.CategoryIdInheritance;
                    genetics.MedicalOpinion = dto.Genetics.MedicalOpinion;
                }

                // Create Testicles and Sem record if provided
                if (dto.TesticlesAndSem != null)
                {
                    IvfmaleFhtesticlesAndSem testiclesAndSem;
                    if (dto.TesticlesAndSem.IVFMaleFHTesticlesAndSemId.HasValue && dto.TesticlesAndSem.IVFMaleFHTesticlesAndSemId.Value > 0)
                    {
                        testiclesAndSem = await _context.IvfmaleFhtesticlesAndSem.FirstOrDefaultAsync(x => x.IvfmaleFhtesticlesAndSemId == dto.TesticlesAndSem.IVFMaleFHTesticlesAndSemId.Value) ?? new IvfmaleFhtesticlesAndSem { IvfmaleFhid = maleFHId };
                    }
                    else
                    {
                        testiclesAndSem = await _context.IvfmaleFhtesticlesAndSem.FirstOrDefaultAsync(x => x.IvfmaleFhid == maleFHId) ?? new IvfmaleFhtesticlesAndSem { IvfmaleFhid = maleFHId };
                    }
                    if (testiclesAndSem.IvfmaleFhtesticlesAndSemId == 0) _context.IvfmaleFhtesticlesAndSem.Add(testiclesAndSem);

                    testiclesAndSem.PrimaryHypogonadotropy = dto.TesticlesAndSem.PrimaryHypogonadotropy;
                    testiclesAndSem.SecondaryHypogonadotropy = dto.TesticlesAndSem.SecondaryHypogonadotropy;
                    testiclesAndSem.RetractileTestes = dto.TesticlesAndSem.RetractileTestes;
                    testiclesAndSem.CategoryIdTesticle = dto.TesticlesAndSem.CategoryIdTesticle;
                    testiclesAndSem.CategoryIdKryptorchidism = dto.TesticlesAndSem.CategoryIdKryptorchidism;
                    testiclesAndSem.CategoryIdOrchitis = dto.TesticlesAndSem.CategoryIdOrchitis;
                    testiclesAndSem.TesticleVolumeLeft = dto.TesticlesAndSem.TesticleVolumeLeft;
                    testiclesAndSem.TesticleVolumeRight = dto.TesticlesAndSem.TesticleVolumeRight;
                    testiclesAndSem.Varicocele = dto.TesticlesAndSem.Varicocele;
                    testiclesAndSem.OperatedVaricocele = dto.TesticlesAndSem.OperatedVaricocele;
                    testiclesAndSem.CategoryIdInstrumentalVaricocele = dto.TesticlesAndSem.CategoryIdInstrumentalVaricocele;
                    testiclesAndSem.CategoryIdClinicalVaricocele = dto.TesticlesAndSem.CategoryIdClinicalVaricocele;
                    testiclesAndSem.ObstipationOfSpermaticDuct = dto.TesticlesAndSem.ObstipationOfSpermaticDuct;
                    testiclesAndSem.CategoryIdProximalSeminalTract = dto.TesticlesAndSem.CategoryIdProximalSeminalTract;
                    testiclesAndSem.CategoryIdDistalSeminalTract = dto.TesticlesAndSem.CategoryIdDistalSeminalTract;
                    testiclesAndSem.CategoryIdEtiologicalDiagnosis = dto.TesticlesAndSem.CategoryIdEtiologicalDiagnosis;
                    testiclesAndSem.Inflammation = dto.TesticlesAndSem.Inflammation;
                    testiclesAndSem.Note = dto.TesticlesAndSem.Note;

                    await _context.SaveChangesAsync();

                    int testiclesAndSemId = testiclesAndSem.IvfmaleFhtesticlesAndSemId;

                    // Create Infections if provided
                    if (dto.TesticlesAndSem.Infections != null)
                    {
                        IvfmaleFhinfections infections;
                        if (dto.TesticlesAndSem.Infections.IVFMaleFHInfectionsId.HasValue && dto.TesticlesAndSem.Infections.IVFMaleFHInfectionsId.Value > 0)
                        {
                            infections = await _context.IvfmaleFhinfections.FirstOrDefaultAsync(x => x.IvfmaleFhinfectionsId == dto.TesticlesAndSem.Infections.IVFMaleFHInfectionsId.Value) ?? new IvfmaleFhinfections { IvfmaleFhtesticlesAndSemId = testiclesAndSemId };
                        }
                        else
                        {
                            infections = await _context.IvfmaleFhinfections.FirstOrDefaultAsync(x => x.IvfmaleFhtesticlesAndSemId == testiclesAndSemId) ?? new IvfmaleFhinfections { IvfmaleFhtesticlesAndSemId = testiclesAndSemId };
                        }
                        if (infections.IvfmaleFhinfectionsId == 0) _context.IvfmaleFhinfections.Add(infections);

                        infections.Urethritis = dto.TesticlesAndSem.Infections.Urethritis;
                        infections.Prostatitis = dto.TesticlesAndSem.Infections.Prostatitis;
                        infections.Epididymitis = dto.TesticlesAndSem.Infections.Epididymitis;
                        infections.CategoryIdPrevInfections = dto.TesticlesAndSem.Infections.CategoryIdPrevInfections;
                        infections.CategoryIdDiagnosisOfInfection = dto.TesticlesAndSem.Infections.CategoryIdDiagnosisOfInfection;
                    }
                }

                // Create Impairment Factors if provided
                if (dto.ImpairmentFactors != null && dto.ImpairmentFactors.Any())
                {
                    // replace existing factors
                    var existingFactors = await _context.IvfmaleFhimpairmentFactor.Where(f => f.IvfmaleFhid == maleFHId).ToListAsync();
                    if (existingFactors.Any()) _context.IvfmaleFhimpairmentFactor.RemoveRange(existingFactors);

                    foreach (var factorDto in dto.ImpairmentFactors)
                    {
                        var impairmentFactor = new IvfmaleFhimpairmentFactor
                        {
                            IvfmaleFhid = maleFHId,
                            ImpairmentFactor = factorDto.ImpairmentFactor
                        };

                        _context.IvfmaleFhimpairmentFactor.Add(impairmentFactor);
                    }
                }

                // Create Previous Illnesses if provided
                if (dto.PrevIllnesses != null && dto.PrevIllnesses.Any())
                {
                    // replace existing previous illnesses
                    var existingPrevIllness = await _context.IvfmaleFhprevIllness.Where(p => p.IvfmaleFhid == maleFHId).ToListAsync();
                    if (existingPrevIllness.Any()) _context.IvfmaleFhprevIllness.RemoveRange(existingPrevIllness);

                    foreach (var prevIllnessDto in dto.PrevIllnesses)
                    {
                        if (string.IsNullOrWhiteSpace(prevIllnessDto.ICDCode))
                        {
                            continue;
                        }

                        var prevIllness = new IvfmaleFhprevIllness
                        {
                            IvfmaleFhid = maleFHId,
                            Icdcode = prevIllnessDto.ICDCode
                        };

                        _context.IvfmaleFhprevIllness.Add(prevIllness);
                    }
                }

                // Create Semen Analyses if provided
                if (dto.SemenAnalyses != null && dto.SemenAnalyses.Any())
                {
                    // replace existing semen analyses
                    var existingAnalyses = await _context.IvfmaleFhsemenAnalysis.Where(s => s.IvfmaleFhid == maleFHId).ToListAsync();
                    if (existingAnalyses.Any()) _context.IvfmaleFhsemenAnalysis.RemoveRange(existingAnalyses);

                    foreach (var analysisDto in dto.SemenAnalyses)
                    {
                        var semenAnalysis = new IvfmaleFhsemenAnalysis
                        {
                            IvfmaleFhid = maleFHId,
                            Date = analysisDto.Date,
                            Id = analysisDto.ID,
                            MotileNo = analysisDto.MotileNo,
                            CollectionMethod = analysisDto.CollectionMethod,
                            ConcentrationNative = analysisDto.ConcentrationNative,
                            ConcentrationAfterPrep = analysisDto.ConcentrationAfterPrep,
                            OverallMotilityNative = analysisDto.OverallMotilityNative,
                            OverallMotilityPrep = analysisDto.OverallMotilityPrep,
                            ProgressiveMotilityNativ = analysisDto.ProgressiveMotilityNativ,
                            ProgressiveMotilityPrep = analysisDto.ProgressiveMotilityPrep,
                            NormalFormsNative = analysisDto.NormalFormsNative,
                            NormalFormsPrep = analysisDto.NormalFormsPrep
                        };

                        _context.IvfmaleFhsemenAnalysis.Add(semenAnalysis);
                    }
                }

                // Save all remaining changes
                await _context.SaveChangesAsync();

                // Commit transaction
                await transaction.CommitAsync();


                return Result<int>.Success(maleFHId);
            }
            catch (DbUpdateException ex)
            {
                await transaction.RollbackAsync();
                return Result<int>.Failure($"Database error: {ex.InnerException?.Message ?? ex.Message}");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return Result<int>.Failure($"An error occurred: {ex.Message}");
            }
        }
    }

    public class Result<T>
    {
        public bool IsSuccess { get; set; }
        public T Data { get; set; }
        public string ErrorMessage { get; set; }

        public static Result<T> Success(T data)
        {
            return new Result<T>
            {
                IsSuccess = true,
                Data = data
            };
        }

        public static Result<T> Failure(string errorMessage)
        {
            return new Result<T>
            {
                IsSuccess = false,
                ErrorMessage = errorMessage
            };
        }
    }
}
