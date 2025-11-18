using Dapper;
using HMIS.Application.DTOs.IVFDTOs;
using HMIS.Application.DTOs.SpLocalModel;
using HMIS.Core.Context;
using HMIS.Core.Entities;
using HMIS.Infrastructure.ORM;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Data;

namespace HMIS.Application.ServiceLogics.IVF
{
    public interface IFertilityHistoryService
    {
        Task<(bool IsSuccess, object? Data)> GetAllFertilityHistory(string ivfmainid, PaginationInfo pagination);
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

        public async Task<(bool IsSuccess, object? Data)> GetAllFertilityHistory(string ivfmainid, PaginationInfo pagination)
        {
            // Basic validations
            if (string.IsNullOrWhiteSpace(ivfmainid))
            {
                return (false, null);
            }
            if (!int.TryParse(ivfmainid, out var ivfMainIdInt))
            {
                return (false, null);
            }
            var page = pagination?.Page ?? 1;
            var rows = pagination?.RowsPerPage ?? 10;
            using var conn = _dapper.CreateConnection();
            try
            {
                var data = (await conn.QueryAsync(
                    "IVF_GetAllFertilityHistory",
                    new { PageNumber = page, PageSize = rows, IVFMainId = ivfMainIdInt },
                    commandType: System.Data.CommandType.StoredProcedure)).ToList();

                return (true, data);
            }
            catch
            {
                return (false, null);
            }
        }
        public async Task<Result<int>> CreateMaleFertilityHistoryAsync(IVFMaleFertilityHistoryDto dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Validate minimally: at least an identifier to locate or create
                if (!dto.IVFMaleFHId.HasValue && !dto.IVFMainId.HasValue)
                {
                    return Result<int>.Failure("Either IVFMaleFHId or IVFMainId must be provided");
                }

                // Upsert main fertility history
                IvfmaleFertilityHistory fertilityHistory;
                if (dto.IVFMaleFHId.HasValue && dto.IVFMaleFHId.Value > 0)
                {
                    fertilityHistory = await _context.IvfmaleFertilityHistory
                        .FirstOrDefaultAsync(x => x.IvfmaleFhid == dto.IVFMaleFHId.Value);
                    if (fertilityHistory == null)
                    {
                        if (!dto.IVFMainId.HasValue)
                            return Result<int>.Failure("IVFMainId is required to create new record");
                        fertilityHistory = new IvfmaleFertilityHistory { IvfmainId = dto.IVFMainId.Value };
                        _context.IvfmaleFertilityHistory.Add(fertilityHistory);
                    }
                }
                else
                {
                    // Try to find an existing record by IVFMainId; create if not found
                    if (!dto.IVFMainId.HasValue)
                        return Result<int>.Failure("IVFMainId is required to locate or create record");
                    fertilityHistory = await _context.IvfmaleFertilityHistory
                        .FirstOrDefaultAsync(x => x.IvfmainId == dto.IVFMainId.Value) ?? new IvfmaleFertilityHistory { IvfmainId = dto.IVFMainId.Value };
                    if (fertilityHistory.IvfmaleFhid == 0)
                    {
                        // For a new record, require ProviderId and Date as entity requires them
                        if (!dto.ProviderId.HasValue || !dto.Date.HasValue)
                            return Result<int>.Failure("ProviderId and Date are required to create a new record");
                        fertilityHistory.Date = dto.Date.Value;
                        fertilityHistory.ProviderId = dto.ProviderId.Value;
                        _context.IvfmaleFertilityHistory.Add(fertilityHistory);
                    }
                }

                // Partial update only when values provided
                if (dto.Date.HasValue) fertilityHistory.Date = dto.Date.Value;
                if (dto.ProviderId.HasValue) fertilityHistory.ProviderId = dto.ProviderId.Value;
                if (dto.AdiposityCategoryId.HasValue) fertilityHistory.AdiposityCategoryId = dto.AdiposityCategoryId.Value;
                if (dto.GenerallyHealthyCategoryId.HasValue) fertilityHistory.GenerallyHealthyCategoryId = dto.GenerallyHealthyCategoryId.Value;
                if (dto.LongTermMedication != null) fertilityHistory.LongTermMedication = dto.LongTermMedication;
                if (dto.NoOfPregnanciesAchieved.HasValue) fertilityHistory.NoOfPregnanciesAchieved = dto.NoOfPregnanciesAchieved.Value;
                if (dto.ChromosomeAnalysisCategoryId.HasValue) fertilityHistory.ChromosomeAnalysisCategoryId = dto.ChromosomeAnalysisCategoryId.Value;
                if (dto.CFTRCarrierCategoryId.HasValue) fertilityHistory.CftrcarrierCategoryId = dto.CFTRCarrierCategoryId.Value;

                await _context.SaveChangesAsync();

                int maleFHId = fertilityHistory.IvfmaleFhid;

                // Create General record only if any general data present
                if (dto.General != null && (
                        dto.General.HasChildren.HasValue ||
                        dto.General.Girls.HasValue ||
                        dto.General.Boys.HasValue ||
                        dto.General.InfertileSince != null ||
                        dto.General.AndrologicalDiagnosisPerformed.HasValue ||
                        dto.General.Date.HasValue ||
                        dto.General.InfertilityTypeCategoryId.HasValue ||
                        dto.General.FurtherPlanning != null ||
                        dto.General.Illness != null ||
                        dto.General.PerformedTreatment != null
                    ))
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

                    if (dto.General.HasChildren.HasValue) general.HasChildren = dto.General.HasChildren;
                    if (dto.General.Girls.HasValue) general.Girls = dto.General.Girls;
                    if (dto.General.Boys.HasValue) general.Boys = dto.General.Boys;
                    if (dto.General.InfertileSince != null) general.InfertileSince = dto.General.InfertileSince;
                    if (dto.General.AndrologicalDiagnosisPerformed.HasValue) general.AndrologicalDiagnosisPerformed = dto.General.AndrologicalDiagnosisPerformed;
                    if (dto.General.Date.HasValue) general.Date = dto.General.Date;
                    if (dto.General.InfertilityTypeCategoryId.HasValue) general.InfertilityTypeCategoryId = dto.General.InfertilityTypeCategoryId.Value;

                    await _context.SaveChangesAsync();

                    int generalId = general.IvfmaleFhgeneralId;

                    // Create Further Planning only if any field provided
                    if (dto.General.FurtherPlanning != null && (
                            dto.General.FurtherPlanning.SemenAnalysis.HasValue ||
                            dto.General.FurtherPlanning.MorphologicalExamination.HasValue ||
                            dto.General.FurtherPlanning.SerologicalExamination.HasValue ||
                            dto.General.FurtherPlanning.AndrologicalUrologicalConsultation.HasValue ||
                            dto.General.FurtherPlanning.DNAFragmentation.HasValue ||
                            dto.General.FurtherPlanning.SpermFreezing.HasValue
                        ))
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

                        if (dto.General.FurtherPlanning.SemenAnalysis.HasValue) furtherPlanning.SemenAnalysis = dto.General.FurtherPlanning.SemenAnalysis.Value;
                        if (dto.General.FurtherPlanning.MorphologicalExamination.HasValue) furtherPlanning.MorphologicalExamination = dto.General.FurtherPlanning.MorphologicalExamination.Value;
                        if (dto.General.FurtherPlanning.SerologicalExamination.HasValue) furtherPlanning.SerologicalExamination = dto.General.FurtherPlanning.SerologicalExamination.Value;
                        if (dto.General.FurtherPlanning.AndrologicalUrologicalConsultation.HasValue) furtherPlanning.AndrologicalUrologicalConsultation = dto.General.FurtherPlanning.AndrologicalUrologicalConsultation.Value;
                        if (dto.General.FurtherPlanning.DNAFragmentation.HasValue) furtherPlanning.Dnafragmentation = dto.General.FurtherPlanning.DNAFragmentation.Value;
                        if (dto.General.FurtherPlanning.SpermFreezing.HasValue) furtherPlanning.SpermFreezing = dto.General.FurtherPlanning.SpermFreezing.Value;
                    }

                    // Create Illness only if any field provided
                    if (dto.General.Illness != null && (
                            dto.General.Illness.Idiopathic.HasValue ||
                            dto.General.Illness.MumpsAfterPuberty.HasValue ||
                            dto.General.Illness.EndocrinopathiesCategoryId.HasValue ||
                            dto.General.Illness.PreviousTumorCategoryId.HasValue ||
                            dto.General.Illness.Hepatitis.HasValue ||
                            dto.General.Illness.HepatitisDetails != null ||
                            dto.General.Illness.ExistingAllergies.HasValue ||
                            dto.General.Illness.ExistingAllergiesDetails != null ||
                            dto.General.Illness.ChronicIllnesses != null ||
                            dto.General.Illness.OtherDiseases != null ||
                            (dto.General.Illness.IdiopathicIds != null && dto.General.Illness.IdiopathicIds.Any())
                        ))
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

                        if (dto.General.Illness.Idiopathic.HasValue) illness.Idiopathic = dto.General.Illness.Idiopathic;
                        if (dto.General.Illness.MumpsAfterPuberty.HasValue) illness.MumpsAfterPuberty = dto.General.Illness.MumpsAfterPuberty;
                        if (dto.General.Illness.EndocrinopathiesCategoryId.HasValue) illness.EndocrinopathiesCategoryId = dto.General.Illness.EndocrinopathiesCategoryId.Value;
                        if (dto.General.Illness.PreviousTumorCategoryId.HasValue) illness.PreviousTumorCategoryId = dto.General.Illness.PreviousTumorCategoryId.Value;
                        if (dto.General.Illness.Hepatitis.HasValue) illness.Hepatitis = dto.General.Illness.Hepatitis;
                        if (dto.General.Illness.HepatitisDetails != null) illness.HepatitisDetails = dto.General.Illness.HepatitisDetails;
                        if (dto.General.Illness.ExistingAllergies.HasValue) illness.ExistingAllergies = dto.General.Illness.ExistingAllergies;
                        if (dto.General.Illness.ExistingAllergiesDetails != null) illness.ExistingAllergiesDetails = dto.General.Illness.ExistingAllergiesDetails;
                        if (dto.General.Illness.ChronicIllnesses != null) illness.ChronicIllnesses = dto.General.Illness.ChronicIllnesses;
                        if (dto.General.Illness.OtherDiseases != null) illness.OtherDiseases = dto.General.Illness.OtherDiseases;

                        await _context.SaveChangesAsync();

                        int illnessId = illness.IvfmaleFhillnessId;

                        // Create Illness-Idiopathic mappings if provided (replace semantics)
                        if (dto.General.Illness.IdiopathicIds != null)
                        {
                            // replace existing mappings
                            var existingIdiopathics = await _context.IvfmaleFhillnessIdiopathic.Where(m => m.IvfmaleFhillnessId == illnessId).ToListAsync();
                            if (existingIdiopathics.Any())
                                _context.IvfmaleFhillnessIdiopathic.RemoveRange(existingIdiopathics);

                            if (dto.General.Illness.IdiopathicIds.Any())
                            {
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
                    }

                    // Create Performed Treatment only if any field provided
                    if (dto.General.PerformedTreatment != null && (
                            dto.General.PerformedTreatment.AlreadyTreated.HasValue ||
                            dto.General.PerformedTreatment.Notes != null ||
                            (dto.General.PerformedTreatment.TreatmentYears != null && dto.General.PerformedTreatment.TreatmentYears.Any())
                        ))
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

                        if (dto.General.PerformedTreatment.AlreadyTreated.HasValue) performedTreatment.AlreadyTreated = dto.General.PerformedTreatment.AlreadyTreated;
                        if (dto.General.PerformedTreatment.Notes != null) performedTreatment.Notes = dto.General.PerformedTreatment.Notes;

                        await _context.SaveChangesAsync();

                        int performedTreatmentId = performedTreatment.IvfmaleFhperformedTreatmentId;

                        // Create Treatment Years if provided (replace semantics)
                        if (dto.General.PerformedTreatment.TreatmentYears != null)
                        {
                            // replace existing years
                            var existingYears = await _context.IvfmaleFhperformedTreatmentYear.Where(y => y.IvfmaleFhperformedTreatmentId == performedTreatmentId).ToListAsync();
                            if (existingYears.Any()) _context.IvfmaleFhperformedTreatmentYear.RemoveRange(existingYears);

                            if (dto.General.PerformedTreatment.TreatmentYears.Any())
                            {
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
                    }

                    await _context.SaveChangesAsync();
                }

                // Create Genetics record only if any field provided
                if (dto.Genetics != null && (
                        dto.Genetics.Genetics != null ||
                        dto.Genetics.CategoryIdInheritance.HasValue ||
                        dto.Genetics.MedicalOpinion != null
                    ))
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

                    if (dto.Genetics.Genetics != null) genetics.Genetics = dto.Genetics.Genetics;
                    if (dto.Genetics.CategoryIdInheritance.HasValue) genetics.CategoryIdInheritance = dto.Genetics.CategoryIdInheritance;
                    if (dto.Genetics.MedicalOpinion != null) genetics.MedicalOpinion = dto.Genetics.MedicalOpinion;
                }

                // Create Testicles and Sem record only if any field provided
                if (dto.TesticlesAndSem != null && (
                        dto.TesticlesAndSem.PrimaryHypogonadotropy.HasValue ||
                        dto.TesticlesAndSem.SecondaryHypogonadotropy.HasValue ||
                        dto.TesticlesAndSem.RetractileTestes.HasValue ||
                        dto.TesticlesAndSem.CategoryIdTesticle.HasValue ||
                        dto.TesticlesAndSem.CategoryIdKryptorchidism.HasValue ||
                        dto.TesticlesAndSem.CategoryIdOrchitis.HasValue ||
                        dto.TesticlesAndSem.TesticleVolumeLeft != null ||
                        dto.TesticlesAndSem.TesticleVolumeRight != null ||
                        dto.TesticlesAndSem.Varicocele.HasValue ||
                        dto.TesticlesAndSem.OperatedVaricocele.HasValue ||
                        dto.TesticlesAndSem.CategoryIdInstrumentalVaricocele.HasValue ||
                        dto.TesticlesAndSem.CategoryIdClinicalVaricocele.HasValue ||
                        dto.TesticlesAndSem.ObstipationOfSpermaticDuct.HasValue ||
                        dto.TesticlesAndSem.CategoryIdProximalSeminalTract.HasValue ||
                        dto.TesticlesAndSem.CategoryIdDistalSeminalTract.HasValue ||
                        dto.TesticlesAndSem.CategoryIdEtiologicalDiagnosis.HasValue ||
                        dto.TesticlesAndSem.Inflammation.HasValue ||
                        dto.TesticlesAndSem.Note != null ||
                        dto.TesticlesAndSem.Infections != null
                    ))
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

                    if (dto.TesticlesAndSem.PrimaryHypogonadotropy.HasValue) testiclesAndSem.PrimaryHypogonadotropy = dto.TesticlesAndSem.PrimaryHypogonadotropy;
                    if (dto.TesticlesAndSem.SecondaryHypogonadotropy.HasValue) testiclesAndSem.SecondaryHypogonadotropy = dto.TesticlesAndSem.SecondaryHypogonadotropy;
                    if (dto.TesticlesAndSem.RetractileTestes.HasValue) testiclesAndSem.RetractileTestes = dto.TesticlesAndSem.RetractileTestes;
                    if (dto.TesticlesAndSem.CategoryIdTesticle.HasValue) testiclesAndSem.CategoryIdTesticle = dto.TesticlesAndSem.CategoryIdTesticle;
                    if (dto.TesticlesAndSem.CategoryIdKryptorchidism.HasValue) testiclesAndSem.CategoryIdKryptorchidism = dto.TesticlesAndSem.CategoryIdKryptorchidism;
                    if (dto.TesticlesAndSem.CategoryIdOrchitis.HasValue) testiclesAndSem.CategoryIdOrchitis = dto.TesticlesAndSem.CategoryIdOrchitis;
                    if (dto.TesticlesAndSem.TesticleVolumeLeft != null) testiclesAndSem.TesticleVolumeLeft = dto.TesticlesAndSem.TesticleVolumeLeft;
                    if (dto.TesticlesAndSem.TesticleVolumeRight != null) testiclesAndSem.TesticleVolumeRight = dto.TesticlesAndSem.TesticleVolumeRight;
                    if (dto.TesticlesAndSem.Varicocele.HasValue) testiclesAndSem.Varicocele = dto.TesticlesAndSem.Varicocele;
                    if (dto.TesticlesAndSem.OperatedVaricocele.HasValue) testiclesAndSem.OperatedVaricocele = dto.TesticlesAndSem.OperatedVaricocele;
                    if (dto.TesticlesAndSem.CategoryIdInstrumentalVaricocele.HasValue) testiclesAndSem.CategoryIdInstrumentalVaricocele = dto.TesticlesAndSem.CategoryIdInstrumentalVaricocele;
                    if (dto.TesticlesAndSem.CategoryIdClinicalVaricocele.HasValue) testiclesAndSem.CategoryIdClinicalVaricocele = dto.TesticlesAndSem.CategoryIdClinicalVaricocele;
                    if (dto.TesticlesAndSem.ObstipationOfSpermaticDuct.HasValue) testiclesAndSem.ObstipationOfSpermaticDuct = dto.TesticlesAndSem.ObstipationOfSpermaticDuct;
                    if (dto.TesticlesAndSem.CategoryIdProximalSeminalTract.HasValue) testiclesAndSem.CategoryIdProximalSeminalTract = dto.TesticlesAndSem.CategoryIdProximalSeminalTract;
                    if (dto.TesticlesAndSem.CategoryIdDistalSeminalTract.HasValue) testiclesAndSem.CategoryIdDistalSeminalTract = dto.TesticlesAndSem.CategoryIdDistalSeminalTract;
                    if (dto.TesticlesAndSem.CategoryIdEtiologicalDiagnosis.HasValue) testiclesAndSem.CategoryIdEtiologicalDiagnosis = dto.TesticlesAndSem.CategoryIdEtiologicalDiagnosis;
                    if (dto.TesticlesAndSem.Inflammation.HasValue) testiclesAndSem.Inflammation = dto.TesticlesAndSem.Inflammation;
                    if (dto.TesticlesAndSem.Note != null) testiclesAndSem.Note = dto.TesticlesAndSem.Note;

                    await _context.SaveChangesAsync();

                    int testiclesAndSemId = testiclesAndSem.IvfmaleFhtesticlesAndSemId;

                    // Create Infections only if any field provided
                    if (dto.TesticlesAndSem.Infections != null && (
                            dto.TesticlesAndSem.Infections.Urethritis.HasValue ||
                            dto.TesticlesAndSem.Infections.Prostatitis.HasValue ||
                            dto.TesticlesAndSem.Infections.Epididymitis.HasValue ||
                            dto.TesticlesAndSem.Infections.CategoryIdPrevInfections.HasValue ||
                            dto.TesticlesAndSem.Infections.CategoryIdDiagnosisOfInfection.HasValue
                        ))
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

                        if (dto.TesticlesAndSem.Infections.Urethritis.HasValue) infections.Urethritis = dto.TesticlesAndSem.Infections.Urethritis;
                        if (dto.TesticlesAndSem.Infections.Prostatitis.HasValue) infections.Prostatitis = dto.TesticlesAndSem.Infections.Prostatitis;
                        if (dto.TesticlesAndSem.Infections.Epididymitis.HasValue) infections.Epididymitis = dto.TesticlesAndSem.Infections.Epididymitis;
                        if (dto.TesticlesAndSem.Infections.CategoryIdPrevInfections.HasValue) infections.CategoryIdPrevInfections = dto.TesticlesAndSem.Infections.CategoryIdPrevInfections.Value;
                        if (dto.TesticlesAndSem.Infections.CategoryIdDiagnosisOfInfection.HasValue) infections.CategoryIdDiagnosisOfInfection = dto.TesticlesAndSem.Infections.CategoryIdDiagnosisOfInfection.Value;
                    }
                }

                // Create Impairment Factors if provided (replace semantics)
                if (dto.ImpairmentFactors != null)
                {
                    // replace existing factors
                    var existingFactors = await _context.IvfmaleFhimpairmentFactor.Where(f => f.IvfmaleFhid == maleFHId).ToListAsync();
                    if (existingFactors.Any()) _context.IvfmaleFhimpairmentFactor.RemoveRange(existingFactors);

                    if (dto.ImpairmentFactors.Any())
                    {
                        foreach (var factorDto in dto.ImpairmentFactors)
                        {
                            if (!factorDto.ImpairmentFactorCategoryId.HasValue)
                            {
                                // skip invalid items lacking required category id
                                continue;
                            }
                            var impairmentFactor = new IvfmaleFhimpairmentFactor
                            {
                                IvfmaleFhid = maleFHId,
                                ImpairmentFactorCategoryId = factorDto.ImpairmentFactorCategoryId.Value
                            };

                            _context.IvfmaleFhimpairmentFactor.Add(impairmentFactor);
                        }
                    }
                }

                // Create Previous Illnesses if provided (replace semantics)
                if (dto.PrevIllnesses != null)
                {
                    // replace existing previous illnesses
                    var existingPrevIllness = await _context.IvfmaleFhprevIllness.Where(p => p.IvfmaleFhid == maleFHId).ToListAsync();
                    if (existingPrevIllness.Any()) _context.IvfmaleFhprevIllness.RemoveRange(existingPrevIllness);

                    if (dto.PrevIllnesses.Any())
                    {
                        foreach (var prevIllnessDto in dto.PrevIllnesses)
                        {
                            if (!prevIllnessDto.PrevIllnessCategoryId.HasValue)
                            {
                                continue;
                            }

                            var prevIllness = new IvfmaleFhprevIllness
                            {
                                IvfmaleFhid = maleFHId,
                                PrevIllnessCategoryId = prevIllnessDto.PrevIllnessCategoryId.Value
                            };

                            _context.IvfmaleFhprevIllness.Add(prevIllness);
                        }
                    }
                }

                // Create Semen Analyses if provided (replace semantics)
                if (dto.SemenAnalyses != null)
                {
                    // replace existing semen analyses
                    var existingAnalyses = await _context.IvfmaleFhsemenAnalysis.Where(s => s.IvfmaleFhid == maleFHId).ToListAsync();
                    if (existingAnalyses.Any()) _context.IvfmaleFhsemenAnalysis.RemoveRange(existingAnalyses);

                    if (dto.SemenAnalyses.Any())
                    {
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
