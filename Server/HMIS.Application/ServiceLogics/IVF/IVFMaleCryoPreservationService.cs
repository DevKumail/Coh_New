using HMIS.Core.Context;
using HMIS.Core.DTOs;
using HMIS.Core.Entities;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography.X509Certificates;

namespace HMIS.Application.ServiceLogics.IVF
{
    public interface IIVFMaleCryoPreservationService
    {
        Task<IEnumerable<IVFMaleCryoPreservationDto>> GetAllCryoPreservations();
        Task<IVFMaleCryoPreservationDto?> GetCryoPreservationById(int cryoPreservationId);
        Task<IEnumerable<IVFMaleCryoPreservationDto>> GetCryoPreservationsBySampleId(int sampleId);
        Task<bool> CreateCryoPreservation(IVFMaleCryoPreservationCreateDto preservationDto);
        Task<bool> UpdateCryoPreservation(IVFMaleCryoPreservationUpdateDto preservationDto);
        Task<bool> DeleteCryoPreservation(int cryoPreservationId, int? updatedBy);

        // Cryo Storage Management
        Task<IEnumerable<IVFCryoStorageLocationDto>> GetAvailableStorageLocations();
        Task<NextAvailableSlotDto?> GetNextAvailableStorageSlot();
        Task<bool> AssignStorageLocation(int cryoPreservationId, long storageLevelCId, int? updatedBy);

        // Straw Management
        Task<bool> GenerateStraws(int cryoPreservationId, int startNumber, int count, int? createdBy);
    }

        public class IVFMaleCryoPreservationService : IIVFMaleCryoPreservationService
        {
            private readonly HMISDbContext _context;

            public IVFMaleCryoPreservationService(HMISDbContext context)
            {
                _context = context;
            }

            public async Task<IEnumerable<IVFMaleCryoPreservationDto>> GetAllCryoPreservations()
            {
                var preservations = await _context.IvfmaleCryoPreservation
                    .Where(cp => !cp.IsDeleted ?? false)
                    .Include(cp => cp.Sample)
                    .Include(cp => cp.MaterialType)
                    .Include(cp => cp.Status)
                    .Include(cp => cp.Color)
                    .Include(cp => cp.StoragePlace)
                    .ThenInclude(sp => sp.LevelB)
                    .ThenInclude(lb => lb.LevelA)
                    .ThenInclude(la => la.Container)
                    .OrderByDescending(cp => cp.CreatedAt)
                    .Select(cp => new IVFMaleCryoPreservationDto
                    {
                        CryoPreservationId = cp.CryoPreservationId,
                        SampleId = cp.SampleId,
                        PreservationCode = cp.PreservationCode,
                        FreezingDateTime = cp.FreezingDateTime,
                        CryopreservedById = cp.CryopreservedById,
                        OriginallyFromClinicId = cp.OriginallyFromClinicId,
                        StorageDateTime = cp.StorageDateTime,
                        StoredById = cp.StoredById,
                        MaterialTypeId = cp.MaterialTypeId,
                        StrawStartNumber = cp.StrawStartNumber,
                        StrawCount = cp.StrawCount,
                        StatusId = cp.StatusId,
                        CryoContractId = cp.CryoContractId,
                        PreserveUsingCryoStorage = cp.PreserveUsingCryoStorage,
                        StoragePlaceId = cp.StoragePlaceId,
                        Position = cp.Position,
                        ColorId = cp.ColorId,
                        ForResearch = cp.ForResearch,
                        ReasonForResearchId = cp.ReasonForResearchId,
                        Notes = cp.Notes,
                        CreatedBy = cp.CreatedBy,
                        UpdatedBy = cp.UpdatedBy,
                        CreatedAt = cp.CreatedAt,
                        UpdatedAt = cp.UpdatedAt,
                        IsDeleted = cp.IsDeleted,

                        // Navigation properties
                        SampleCode = cp.Sample.SampleCode,
                        MaterialTypeName = cp.MaterialType.ValueName,
                        StatusName = cp.Status.ValueName,
                        ColorCode = cp.Color.ColorCode,
                        StorageLocation = cp.StoragePlace != null ?
                            $"{cp.StoragePlace.LevelB.LevelA.Container.Description}-{cp.StoragePlace.LevelB.LevelA.CanisterCode}-{cp.StoragePlace.LevelB.CaneCode}-{cp.StoragePlace.StrawPosition}"
                            : null
                    })
                    .ToListAsync();

                return preservations;
            }

            public async Task<IVFMaleCryoPreservationDto?> GetCryoPreservationById(int cryoPreservationId)
            {
                var preservation = await _context.IvfmaleCryoPreservation
                    .Where(cp => cp.CryoPreservationId == cryoPreservationId && !(cp.IsDeleted ?? false))
                    .Include(cp => cp.Sample)
                    .Include(cp => cp.MaterialType)
                    .Include(cp => cp.Status)
                    .Include(cp => cp.Color)
                    .Include(cp => cp.StoragePlace)
                    .ThenInclude(sp => sp.LevelB)
                    .ThenInclude(lb => lb.LevelA)
                    .ThenInclude(la => la.Container)
                    .Select(cp => new IVFMaleCryoPreservationDto
                    {
                        CryoPreservationId = cp.CryoPreservationId,
                        SampleId = cp.SampleId,
                        PreservationCode = cp.PreservationCode,
                        FreezingDateTime = cp.FreezingDateTime,
                        CryopreservedById = cp.CryopreservedById,
                        OriginallyFromClinicId = cp.OriginallyFromClinicId,
                        StorageDateTime = cp.StorageDateTime,
                        StoredById = cp.StoredById,
                        MaterialTypeId = cp.MaterialTypeId,
                        StrawStartNumber = cp.StrawStartNumber,
                        StrawCount = cp.StrawCount,
                        StatusId = cp.StatusId,
                        CryoContractId = cp.CryoContractId,
                        PreserveUsingCryoStorage = cp.PreserveUsingCryoStorage,
                        StoragePlaceId = cp.StoragePlaceId,
                        Position = cp.Position,
                        ColorId = cp.ColorId,
                        ForResearch = cp.ForResearch,
                        ReasonForResearchId = cp.ReasonForResearchId,
                        Notes = cp.Notes,
                        CreatedBy = cp.CreatedBy,
                        UpdatedBy = cp.UpdatedBy,
                        CreatedAt = cp.CreatedAt,
                        UpdatedAt = cp.UpdatedAt,
                        IsDeleted = cp.IsDeleted,

                        SampleCode = cp.Sample.SampleCode,
                        MaterialTypeName = cp.MaterialType.ValueName,
                        StatusName = cp.Status.ValueName,
                        ColorCode = cp.Color.ColorCode,
                        StorageLocation = cp.StoragePlace != null ?
                            $"{cp.StoragePlace.LevelB.LevelA.Container.Description}-{cp.StoragePlace.LevelB.LevelA.CanisterCode}-{cp.StoragePlace.LevelB.CaneCode}-{cp.StoragePlace.StrawPosition}"
                            : null
                    })
                    .FirstOrDefaultAsync();

                return preservation;
            }

            public async Task<IEnumerable<IVFMaleCryoPreservationDto>> GetCryoPreservationsBySampleId(int sampleId)
            {
                var preservations = await _context.IvfmaleCryoPreservation
                    .Where(cp => cp.SampleId == sampleId && !(cp.IsDeleted ?? false))
                    .Include(cp => cp.Sample)
                    .Include(cp => cp.MaterialType)
                    .Include(cp => cp.Status)
                    .Include(cp => cp.Color)
                    .Include(cp => cp.StoragePlace)
                    .ThenInclude(sp => sp.LevelB)
                    .ThenInclude(lb => lb.LevelA)
                    .ThenInclude(la => la.Container)
                    .OrderByDescending(cp => cp.CreatedAt)
                    .Select(cp => new IVFMaleCryoPreservationDto
                    {
                        CryoPreservationId = cp.CryoPreservationId,
                        SampleId = cp.SampleId,
                        PreservationCode = cp.PreservationCode,
                        FreezingDateTime = cp.FreezingDateTime,
                        CryopreservedById = cp.CryopreservedById,
                        OriginallyFromClinicId = cp.OriginallyFromClinicId,
                        StorageDateTime = cp.StorageDateTime,
                        StoredById = cp.StoredById,
                        MaterialTypeId = cp.MaterialTypeId,
                        StrawStartNumber = cp.StrawStartNumber,
                        StrawCount = cp.StrawCount,
                        StatusId = cp.StatusId,
                        CryoContractId = cp.CryoContractId,
                        PreserveUsingCryoStorage = cp.PreserveUsingCryoStorage,
                        StoragePlaceId = cp.StoragePlaceId,
                        Position = cp.Position,
                        ColorId = cp.ColorId,
                        ForResearch = cp.ForResearch,
                        ReasonForResearchId = cp.ReasonForResearchId,
                        Notes = cp.Notes,
                        CreatedBy = cp.CreatedBy,
                        UpdatedBy = cp.UpdatedBy,
                        CreatedAt = cp.CreatedAt,
                        UpdatedAt = cp.UpdatedAt,
                        IsDeleted = cp.IsDeleted,

                        SampleCode = cp.Sample.SampleCode,
                        MaterialTypeName = cp.MaterialType.ValueName,
                        StatusName = cp.Status.ValueName,
                        ColorCode = cp.Color.ColorCode,
                        StorageLocation = cp.StoragePlace != null ?
                            $"{cp.StoragePlace.LevelB.LevelA.Container.Description}-{cp.StoragePlace.LevelB.LevelA.CanisterCode}-{cp.StoragePlace.LevelB.CaneCode}-{cp.StoragePlace.StrawPosition}"
                            : null
                    })
                    .ToListAsync();

                return preservations;
            }

            public async Task<bool> CreateCryoPreservation(IVFMaleCryoPreservationCreateDto preservationDto)
            {
                try
                {
                    var preservation = new IvfmaleCryoPreservation
                    {
                        SampleId = preservationDto.SampleId,
                        PreservationCode = preservationDto.PreservationCode,
                        FreezingDateTime = preservationDto.FreezingDateTime,
                        CryopreservedById = preservationDto.CryopreservedById,
                        OriginallyFromClinicId = preservationDto.OriginallyFromClinicId,
                        StorageDateTime = preservationDto.StorageDateTime,
                        StoredById = preservationDto.StoredById,
                        MaterialTypeId = preservationDto.MaterialTypeId,
                        StrawStartNumber = preservationDto.StrawStartNumber,
                        StrawCount = preservationDto.StrawCount,
                        StatusId = preservationDto.StatusId,
                        CryoContractId = preservationDto.CryoContractId,
                        PreserveUsingCryoStorage = preservationDto.PreserveUsingCryoStorage,
                        StoragePlaceId = preservationDto.StoragePlaceId,
                        Position = preservationDto.Position,
                        ColorId = preservationDto.ColorId,
                        ForResearch = preservationDto.ForResearch,
                        ReasonForResearchId = preservationDto.ReasonForResearchId,
                        Notes = preservationDto.Notes,
                        CreatedBy = preservationDto.CreatedBy,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        IsDeleted = false
                    };

                    _context.IvfmaleCryoPreservation.Add(preservation);
                    await _context.SaveChangesAsync();

                    // Generate straws if count is specified
                    if (preservationDto.StrawStartNumber.HasValue && preservationDto.StrawCount.HasValue)
                    {
                        await GenerateStraws(preservation.CryoPreservationId,
                            preservationDto.StrawStartNumber.Value,
                            preservationDto.StrawCount.Value,
                            preservationDto.CreatedBy);
                    }

                    // change cryolevelc table status

                    if(preservationDto.StoragePlaceId > 0)
                {
                    var levelC = await _context.IvfcryoLevelC
                                 .FirstOrDefaultAsync(cp => cp.Id == preservationDto.StoragePlaceId);

                    levelC.Status = "Occupied";
                    levelC.SampleId = preservation.SampleId;
                    levelC.UpdatedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                }


                return true;
                }
                catch (Exception ex)
                {
                    // Log exception
                    return false;
                }
            }

            public async Task<bool> UpdateCryoPreservation(IVFMaleCryoPreservationUpdateDto preservationDto)
            {
                try
                {
                    var preservation = await _context.IvfmaleCryoPreservation
                        .FirstOrDefaultAsync(cp => cp.CryoPreservationId == preservationDto.CryoPreservationId && !(cp.IsDeleted ?? false));

                    if (preservation == null)
                        return false;

                if (preservationDto.StoragePlaceId != preservation.StoragePlaceId)
                {
                    var levelC = await _context.IvfcryoLevelC
                                 .FirstOrDefaultAsync(cp => cp.Id == preservationDto.StoragePlaceId);

                    levelC.Status = "Occupied";
                    levelC.SampleId = preservation.SampleId;
                    levelC.UpdatedAt = DateTime.UtcNow;
                }

                preservation.FreezingDateTime = preservationDto.FreezingDateTime;
                    preservation.CryopreservedById = preservationDto.CryopreservedById;
                    preservation.OriginallyFromClinicId = preservationDto.OriginallyFromClinicId;
                    preservation.StorageDateTime = preservationDto.StorageDateTime;
                    preservation.StoredById = preservationDto.StoredById;
                    preservation.MaterialTypeId = preservationDto.MaterialTypeId;
                    preservation.StrawStartNumber = preservationDto.StrawStartNumber;
                    preservation.StrawCount = preservationDto.StrawCount;
                    preservation.StatusId = preservationDto.StatusId;
                    preservation.CryoContractId = preservationDto.CryoContractId;
                    preservation.PreserveUsingCryoStorage = preservationDto.PreserveUsingCryoStorage;
                    preservation.StoragePlaceId = preservationDto.StoragePlaceId;
                    preservation.Position = preservationDto.Position;
                    preservation.ColorId = preservationDto.ColorId;
                    preservation.ForResearch = preservationDto.ForResearch;
                    preservation.ReasonForResearchId = preservationDto.ReasonForResearchId;
                    preservation.Notes = preservationDto.Notes;
                    preservation.UpdatedBy = preservationDto.UpdatedBy;
                    preservation.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

              
                    return true;
                }
                catch (Exception)
                {
                    return false;
                }
            }

            public async Task<bool> DeleteCryoPreservation(int cryoPreservationId, int? updatedBy)
            {
                try
                {
                    var preservation = await _context.IvfmaleCryoPreservation
                        .FirstOrDefaultAsync(cp => cp.CryoPreservationId == cryoPreservationId && !(cp.IsDeleted ?? false));

                    if (preservation == null)
                        return false;

                    preservation.IsDeleted = true;
                    preservation.UpdatedBy = updatedBy;
                    preservation.UpdatedAt = DateTime.UtcNow;

                    // Also delete associated straws
                    var straws = await _context.IvfmaleCryoStraw
                        .Where(s => s.CryoPreservationId == cryoPreservationId && !(s.IsDeleted ?? false))
                        .ToListAsync();

                    foreach (var straw in straws)
                    {
                        straw.IsDeleted = true;
                        straw.UpdatedBy = updatedBy;
                        straw.UpdatedAt = DateTime.UtcNow;
                    }

                    await _context.SaveChangesAsync();
                    return true;
                }
                catch (Exception)
                {
                    return false;
                }
            }

            public async Task<IEnumerable<IVFCryoStorageLocationDto>> GetAvailableStorageLocations()
            {
                var availableLocations = await _context.IvfcryoLevelC
                    .Where(lc => lc.Status == "Available" && !lc.IsDeleted)
                    .Include(lc => lc.LevelB)
                    .ThenInclude(lb => lb.LevelA)
                    .ThenInclude(la => la.Container)
                    .Select(lc => new IVFCryoStorageLocationDto
                    {
                        ContainerId = lc.LevelB.LevelA.Container.Id,
                        ContainerDescription = lc.LevelB.LevelA.Container.Description,
                        CanisterCode = lc.LevelB.LevelA.CanisterCode,
                        CaneCode = lc.LevelB.CaneCode,
                        StrawPosition = lc.StrawPosition,
                        IsAvailable = true,
                        CurrentPatientName = null,
                        CurrentSampleCount = null
                    })
                    .ToListAsync();

                return availableLocations;
            }

            public async Task<NextAvailableSlotDto?> GetNextAvailableStorageSlot()
            {
                var nextAvailable = await _context.IvfcryoLevelC
                    .Where(lc => lc.Status == "Available" && !lc.IsDeleted)
                    .Include(lc => lc.LevelB)
                    .ThenInclude(lb => lb.LevelA)
                    .ThenInclude(la => la.Container)
                    .OrderBy(lc => lc.LevelB.LevelA.Container.Id)
                    .ThenBy(lc => lc.LevelB.LevelA.CanisterCode)
                    .ThenBy(lc => lc.LevelB.CaneCode)
                    .ThenBy(lc => lc.StrawPosition)
                    .Select(lc => new NextAvailableSlotDto
                    {
                        ContainerId = lc.LevelB.LevelA.Container.Id,
                        ContainerDescription = lc.LevelB.LevelA.Container.Description,
                        CanisterCode = lc.LevelB.LevelA.CanisterCode,
                        CaneCode = lc.LevelB.CaneCode,
                        StrawPosition = lc.StrawPosition
                    })
                    .FirstOrDefaultAsync();

                return nextAvailable;
            }

            public async Task<bool> AssignStorageLocation(int cryoPreservationId, long storageLevelCId, int? updatedBy)
            {
                try
                {
                    var preservation = await _context.IvfmaleCryoPreservation
                        .FirstOrDefaultAsync(cp => cp.CryoPreservationId == cryoPreservationId && !(cp.IsDeleted ?? false));

                    var storageLocation = await _context.IvfcryoLevelC
                        .FirstOrDefaultAsync(lc => lc.Id == storageLevelCId && lc.Status == "Available" && !lc.IsDeleted);

                    if (preservation == null || storageLocation == null)
                        return false;

                    // Update storage location status
                    storageLocation.Status = "Occupied";
                    storageLocation.SampleId = preservation.SampleId;
                    storageLocation.UpdatedBy = updatedBy;
                    storageLocation.UpdatedAt = DateTime.UtcNow;

                    // Update preservation record
                    preservation.StoragePlaceId = storageLevelCId;
                    preservation.UpdatedBy = updatedBy;
                    preservation.UpdatedAt = DateTime.UtcNow;

                    await _context.SaveChangesAsync();
                    return true;
                }
                catch (Exception)
                {
                    return false;
                }
            }

            public async Task<bool> GenerateStraws(int cryoPreservationId, int startNumber, int count, int? createdBy)
            {
                try
                {
                    var preservation = await _context.IvfmaleCryoPreservation
                        .FirstOrDefaultAsync(cp => cp.CryoPreservationId == cryoPreservationId && !(cp.IsDeleted ?? false));

                    if (preservation == null)
                        return false;

                    var straws = new List<IvfmaleCryoStraw>();
                    for (int i = 0; i < count; i++)
                    {
                        var strawNumber = startNumber + i;
                        var straw = new IvfmaleCryoStraw
                        {
                            CryoPreservationId = cryoPreservationId,
                            SampleId = preservation.SampleId,
                            StrawNumber = strawNumber,
                            StrawLabel = $"{preservation.PreservationCode}-{strawNumber:000}",
                            MaterialTypeId = preservation.MaterialTypeId,
                            ColorId = preservation.ColorId,
                            Status = "Stored",
                            CreatedBy = createdBy,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow,
                            IsDeleted = false
                        };
                        straws.Add(straw);
                    }

                    _context.IvfmaleCryoStraw.AddRange(straws);
                    await _context.SaveChangesAsync();
                    return true;
                }
                catch (Exception)
                {
                    return false;
                }
            }
        }
    }