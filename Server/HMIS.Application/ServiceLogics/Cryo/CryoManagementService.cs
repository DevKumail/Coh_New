using HMIS.Application.DTOs.CryoDTOs;
using HMIS.Core.Context;
using HMIS.Core.Entities;
using HMIS.Infrastructure.ORM;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace HMIS.Application.ServiceLogics.Cryo
{
    public interface ICryoManagementService
    {
        Task<bool> InsertOrUpdateCryoContainer(CryoContainerDto containerDto);

        Task<(IEnumerable<CryoContainerDto> Data, int TotalCount)>
      GetAllCryoContainers(int page, int pageSize);

        Task<bool> DeleteCryoContainer(long containerId, long? updatedBy);

        Task<CryoContainerDto?> GetCryoContainerById(long id);

        Task<bool> DeleteLevelA(long levelAId, long? updatedBy);
        Task<bool> DeleteLevelB(long levelBId, long? updatedBy);
        Task<bool> DeleteLevelC(long levelCId, long? updatedBy);

        Task<List<CryoDropDownDto>> GetContainersDropdown();
        Task<List<CryoDropDownDto>> GetLevelADropdown(long containerId);
        Task<List<CryoDropDownDto>> GetLevelBDropdown(long levelAId);
        Task<List<CryoStorageListDto>> SearchCryoStorages(CryoSearchRequestDto searchRequest);

    }
    public class CryoManagementService : ICryoManagementService
    {
        private readonly HMISDbContext _context;

        public CryoManagementService(HMISDbContext context)
        {
            _context = context;
        }

        private bool Exist(long? id)
        {
            if (id == null || id == 0) return false;
            return _context.IvfcryoContainers.Any(c => c.Id == id);
        }

        public async Task<bool> InsertOrUpdateCryoContainer(CryoContainerDto containerDto)
        {
            try
            {
                bool exist = Exist(containerDto.ID);

                if (!exist)
                {
                    // Create new container
                    var container = new IvfcryoContainers
                    {
                        FacilityId = containerDto.FacilityID,
                        Description = containerDto.Description,
                        IsSperm = containerDto.IsSperm,
                        IsOocyteOrEmbryo = containerDto.IsOocyteOrEmb,
                        LastAudit = containerDto.LastAudit,
                        MaxStrawsInLastLevel = containerDto.MaxStrawsInLastLevel,
                        CreatedBy = containerDto.CreatedBy,
                        CreatedAt = DateTime.Now
                    };

                    _context.IvfcryoContainers.Add(container);
                    await _context.SaveChangesAsync(); // Save to get Container ID

                    // Add nested levels
                    if (containerDto.LevelA != null)
                    {
                        foreach (var levelA in containerDto.LevelA)
                        {
                            var levelAEntity = new IvfcryoLevelA
                            {
                                ContainerId = container.Id,
                                CanisterCode = levelA.CanisterCode,
                                CreatedBy = levelA.CreatedBy,
                                CreatedAt = DateTime.Now
                            };
                            _context.IvfcryoLevelA.Add(levelAEntity);
                            await _context.SaveChangesAsync(); // Save to get LevelA ID

                            // Process all LevelB entities for this LevelA first
                            var levelBEntities = new List<IvfcryoLevelB>();
                            foreach (var levelB in levelA.LevelB)
                            {
                                var levelBEntity = new IvfcryoLevelB
                                {
                                    LevelAid = levelAEntity.Id, // Now LevelA ID is available
                                    CaneCode = levelB.CaneCode,
                                    CreatedBy = levelB.CreatedBy,
                                    CreatedAt = DateTime.Now
                                };
                                _context.IvfcryoLevelB.Add(levelBEntity);
                                levelBEntities.Add(levelBEntity);
                            }
                            await _context.SaveChangesAsync(); // Save all LevelB to get their IDs

                            // Now process LevelC with the actual LevelB IDs
                            foreach (var levelB in levelA.LevelB)
                            {
                                var levelBEntity = levelBEntities.First(b => b.CaneCode == levelB.CaneCode);

                                if (levelB.LevelC != null && levelB.LevelC.Any())
                                {
                                    foreach (var levelC in levelB.LevelC)
                                    {
                                        var levelCEntity = new IvfcryoLevelC
                                        {
                                            LevelBid = levelBEntity.Id, // Now LevelB ID is available
                                            StrawPosition = levelC.StrawPosition,
                                            SampleId = levelC.SampleID,
                                            Status = levelC.Status,
                                            CreatedBy = levelC.CreatedBy,
                                            CreatedAt = DateTime.Now
                                        };
                                        _context.IvfcryoLevelC.Add(levelCEntity);
                                    }
                                }
                            }
                            await _context.SaveChangesAsync(); // Save all LevelC
                        }
                    }
                    return true;
                }
                else
                {
                    // Update existing container
                    var container = await _context.IvfcryoContainers
                        .Include(c => c.IvfcryoLevelA)
                            .ThenInclude(a => a.IvfcryoLevelB)
                                .ThenInclude(b => b.IvfcryoLevelC)
                        .FirstOrDefaultAsync(c => c.Id == containerDto.ID && !c.IsDeleted);

                    if (container == null) return false;

                    // Update container properties
                    container.Description = containerDto.Description;
                    container.IsSperm = containerDto.IsSperm;
                    container.IsOocyteOrEmbryo = containerDto.IsOocyteOrEmb;
                    container.LastAudit = containerDto.LastAudit;
                    container.MaxStrawsInLastLevel = containerDto.MaxStrawsInLastLevel;
                    container.UpdatedBy = containerDto.UpdatedBy;
                    container.UpdatedAt = DateTime.Now;

                    // Handle LevelA updates
                    await UpdateLevelAEntities(container, containerDto.LevelA);

                    await _context.SaveChangesAsync();
                    return true;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        private async System.Threading.Tasks.Task UpdateLevelAEntities(IvfcryoContainers container, List<CryoLevelADto>? levelADtos)
        {
            if (levelADtos == null) return;

            var existingLevelAIds = levelADtos
                .Where(dto => dto.ID.HasValue && dto.ID.Value > 0)
                .Select(dto => dto.ID.Value)
                .ToList();

            // Soft delete LevelA entities not in the DTO
            var levelAToDelete = container.IvfcryoLevelA
                .Where(a => !a.IsDeleted && !existingLevelAIds.Contains(a.Id))
                .ToList();

            foreach (var levelA in levelAToDelete)
            {
                levelA.IsDeleted = true;
                levelA.UpdatedAt = DateTime.Now;
                levelA.UpdatedBy = container.UpdatedBy;

                // Also soft delete child entities
                await SoftDeleteLevelBEntities(levelA.IvfcryoLevelB.Where(b => !b.IsDeleted).ToList(), null);
            }

            foreach (var levelADto in levelADtos)
            {
                IvfcryoLevelA? levelAEntity;

                if (levelADto.ID.HasValue && levelADto.ID.Value > 0)
                {
                    // Update existing LevelA
                    levelAEntity = container.IvfcryoLevelA.FirstOrDefault(a => a.Id == levelADto.ID && !a.IsDeleted);
                    if (levelAEntity != null)
                    {
                        levelAEntity.CanisterCode = levelADto.CanisterCode;
                        levelAEntity.UpdatedBy = levelADto.UpdatedBy ?? container.UpdatedBy;
                        levelAEntity.UpdatedAt = DateTime.Now;
                    }
                    else
                    {
                        continue;
                    }
                }
                else
                {
                    // Add new LevelA
                    levelAEntity = new IvfcryoLevelA
                    {
                        ContainerId = container.Id,
                        CanisterCode = levelADto.CanisterCode,
                        CreatedBy = levelADto.CreatedBy ?? container.UpdatedBy,
                        CreatedAt = DateTime.Now
                    };
                    _context.IvfcryoLevelA.Add(levelAEntity);
                    await _context.SaveChangesAsync(); 
                    container.IvfcryoLevelA.Add(levelAEntity);
                }

                // Handle LevelB for this LevelA
                if (levelAEntity != null)
                {
                    await UpdateLevelBEntities(levelAEntity, levelADto.LevelB, null);
                }
            }
        }

        private async System.Threading.Tasks.Task UpdateLevelBEntities(IvfcryoLevelA levelA, List<CryoLevelBDto>? levelBDtos, string updatedBy)
        {
            if (levelBDtos == null) return;

            var existingLevelBIds = levelBDtos
                .Where(dto => dto.ID.HasValue && dto.ID.Value > 0)
                .Select(dto => dto.ID.Value)
                .ToList();

            // Soft delete LevelB entities not in the DTO
            var levelBToDelete = levelA.IvfcryoLevelB
                .Where(b => !b.IsDeleted && !existingLevelBIds.Contains(b.Id))
                .ToList();

            foreach (var levelB in levelBToDelete)
            {
                levelB.IsDeleted = true;
                levelB.UpdatedAt = DateTime.Now;
                levelB.UpdatedBy = null;

                // Also soft delete child entities
                await SoftDeleteLevelCEntities(levelB.IvfcryoLevelC.Where(c => !c.IsDeleted).ToList(), updatedBy);
            }

            foreach (var levelBDto in levelBDtos)
            {
                IvfcryoLevelB? levelBEntity;

                if (levelBDto.ID.HasValue && levelBDto.ID.Value > 0)
                {
                    // Update existing LevelB
                    levelBEntity = levelA.IvfcryoLevelB.FirstOrDefault(b => b.Id == levelBDto.ID && !b.IsDeleted);
                    if (levelBEntity != null)
                    {
                        levelBEntity.CaneCode = levelBDto.CaneCode;
                        levelBEntity.UpdatedBy = null;
                        levelBEntity.UpdatedAt = DateTime.Now;
                    }
                    else
                    {
                        continue;
                    }
                }
                else
                {
                    // Add new LevelB
                    levelBEntity = new IvfcryoLevelB
                    {
                        LevelAid = levelA.Id,
                        CaneCode = levelBDto.CaneCode,
                        CreatedBy = null,
                        CreatedAt = DateTime.Now
                    };
                    _context.IvfcryoLevelB.Add(levelBEntity);
                    await _context.SaveChangesAsync(); 
                    levelA.IvfcryoLevelB.Add(levelBEntity);
                }

                // Handle LevelC for this LevelB
                if (levelBEntity != null)
                {
                    await UpdateLevelCEntities(levelBEntity, levelBDto.LevelC, null);
                }
            }
        }

        private async System.Threading.Tasks.Task UpdateLevelCEntities(IvfcryoLevelB levelB, List<CryoLevelCDto>? levelCDtos, string updatedBy)
        {
            if (levelCDtos == null) return;

            var existingLevelCIds = levelCDtos
                .Where(dto => dto.ID.HasValue && dto.ID.Value > 0)
                .Select(dto => dto.ID.Value)
                .ToList();

            // Soft delete LevelC entities not in the DTO
            var levelCToDelete = levelB.IvfcryoLevelC
                .Where(c => !c.IsDeleted && !existingLevelCIds.Contains(c.Id))
                .ToList();

            foreach (var levelC in levelCToDelete)
            {
                levelC.IsDeleted = true;
                levelC.UpdatedAt = DateTime.Now;
                levelC.UpdatedBy = null;
            }

            foreach (var levelCDto in levelCDtos)
            {
                if (levelCDto.ID.HasValue && levelCDto.ID.Value > 0)
                {
                    // Update existing LevelC
                    var levelCEntity = levelB.IvfcryoLevelC.FirstOrDefault(c => c.Id == levelCDto.ID && !c.IsDeleted);
                    if (levelCEntity != null)
                    {
                        levelCEntity.StrawPosition = levelCDto.StrawPosition;
                        levelCEntity.SampleId = levelCDto.SampleID;
                        levelCEntity.Status = levelCDto.Status;
                        levelCEntity.UpdatedBy = null;
                        levelCEntity.UpdatedAt = DateTime.Now;
                    }
                }
                else
                {
                    // Add new LevelC
                    var levelCEntity = new IvfcryoLevelC
                    {
                        LevelBid = levelB.Id, // Now LevelB ID is properly set
                        StrawPosition = levelCDto.StrawPosition,
                        SampleId = levelCDto.SampleID,
                        Status = levelCDto.Status,
                        CreatedBy = null,
                        CreatedAt = DateTime.Now
                    };
                    _context.IvfcryoLevelC.Add(levelCEntity);
                }
            }
        }

        private async System.Threading.Tasks.Task SoftDeleteLevelBEntities(List<IvfcryoLevelB> levelBs, string updatedBy)
        {
            foreach (var levelB in levelBs)
            {
                levelB.IsDeleted = true;
                levelB.UpdatedAt = DateTime.Now;
                levelB.UpdatedBy = null;
                await SoftDeleteLevelCEntities(levelB.IvfcryoLevelC.Where(c => !c.IsDeleted).ToList(), updatedBy);
            }
        }

        private async System.Threading.Tasks.Task SoftDeleteLevelCEntities(List<IvfcryoLevelC> levelCs, string updatedBy)
        {
            foreach (var levelC in levelCs)
            {
                levelC.IsDeleted = true;
                levelC.UpdatedAt = DateTime.Now;
                levelC.UpdatedBy = null;
            }
        }


        public async Task<(IEnumerable<CryoContainerDto> Data, int TotalCount)>
        GetAllCryoContainers(int page, int pageSize)
        {
            try
            {
                var query = _context.IvfcryoContainers
                    .Where(c => !c.IsDeleted);

                int totalCount = await query.CountAsync();

                var containers = await query
                    .OrderByDescending(c => c.Id)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(c => new CryoContainerDto
                    {
                        ID = c.Id,
                        FacilityID = c.FacilityId,
                        Description = c.Description,
                        IsSperm = c.IsSperm,
                        IsOocyteOrEmb = c.IsOocyteOrEmbryo,
                        LastAudit = c.LastAudit,
                        MaxStrawsInLastLevel = c.MaxStrawsInLastLevel,
                        CreatedAt = c.CreatedAt,
                        UpdatedAt = c.UpdatedAt
                    })
                    .ToListAsync();

                return (containers, totalCount);
            }
            catch (Exception)
            {
                throw;
            }
        }


        public async Task<bool> DeleteCryoContainer(long containerId, long? updatedBy)
        {
            var container = await _context.IvfcryoContainers
                .Include(c => c.IvfcryoLevelA)
                    .ThenInclude(a => a.IvfcryoLevelB)
                        .ThenInclude(b => b.IvfcryoLevelC)
                .FirstOrDefaultAsync(c => c.Id == containerId);

            if (container == null || (container.GetType().GetProperty("IsDeleted") != null && (bool?)container.GetType().GetProperty("IsDeleted")?.GetValue(container) == true))
                return false;

            if (container.GetType().GetProperty("IsDeleted") != null)
                container.GetType().GetProperty("IsDeleted")?.SetValue(container, true);
            container.UpdatedBy = updatedBy;
            container.UpdatedAt = DateTime.Now;

            // Soft delete LevelA
            if (container.IvfcryoLevelA != null)
            {
                foreach (var levelA in container.IvfcryoLevelA)
                {
                    if (levelA.GetType().GetProperty("IsDeleted") != null)
                        levelA.GetType().GetProperty("IsDeleted")?.SetValue(levelA, true);
                    levelA.UpdatedBy = updatedBy;
                    levelA.UpdatedAt = DateTime.Now;

                    // Soft delete LevelB
                    if (levelA.IvfcryoLevelB != null)
                    {
                        foreach (var levelB in levelA.IvfcryoLevelB)
                        {
                            if (levelB.GetType().GetProperty("IsDeleted") != null)
                                levelB.GetType().GetProperty("IsDeleted")?.SetValue(levelB, true);
                            levelB.UpdatedBy = updatedBy;
                            levelB.UpdatedAt = DateTime.Now;

                            // Soft delete LevelC
                            if (levelB.IvfcryoLevelC != null)
                            {
                                foreach (var levelC in levelB.IvfcryoLevelC)
                                {
                                    if (levelC.GetType().GetProperty("IsDeleted") != null)
                                        levelC.GetType().GetProperty("IsDeleted")?.SetValue(levelC, true);
                                    levelC.UpdatedBy = updatedBy;
                                    levelC.UpdatedAt = DateTime.Now;
                                }
                            }
                        }
                    }
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<CryoContainerDto?> GetCryoContainerById(long id)
        {
            var container = await _context.IvfcryoContainers
                .Include(c => c.IvfcryoLevelA)
                    .ThenInclude(a => a.IvfcryoLevelB)
                        .ThenInclude(b => b.IvfcryoLevelC)
                .FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted);

            if (container == null)
                return null;

            return new CryoContainerDto
            {
                ID = container.Id,
                FacilityID = container.FacilityId,
                Description = container.Description,
                LastAudit = container.LastAudit,
                MaxStrawsInLastLevel = container.MaxStrawsInLastLevel,
                IsSperm = container.IsSperm ?? false,
                IsOocyteOrEmb = container.IsOocyteOrEmbryo,
                CreatedBy = container.CreatedBy,
                UpdatedBy = container.UpdatedBy,
                CreatedAt = container.CreatedAt,
                UpdatedAt = container.UpdatedAt,
                LevelA = container.IvfcryoLevelA?
                    .Where(a => !a.IsDeleted)
                    .Select(a => new CryoLevelADto
                    {
                        ID = a.Id,
                        ContainerID = a.ContainerId,
                        CanisterCode = a.CanisterCode,
                        CreatedBy = a.CreatedBy,
                        UpdatedBy = a.UpdatedBy,
                        CreatedAt = a.CreatedAt,
                        UpdatedAt = a.UpdatedAt,
                        LevelB = a.IvfcryoLevelB?
                            .Where(b => !b.IsDeleted)
                            .Select(b => new CryoLevelBDto
                            {
                                ID = b.Id,
                                LevelAID = b.LevelAid,
                                CaneCode = b.CaneCode,
                                CreatedBy = b.CreatedBy,
                                UpdatedBy = b.UpdatedBy,
                                CreatedAt = b.CreatedAt,
                                UpdatedAt = b.UpdatedAt,
                                LevelC = b.IvfcryoLevelC?
                                    .Where(c => !c.IsDeleted)
                                    .Select(c => new CryoLevelCDto
                                    {
                                        ID = c.Id,
                                        LevelBID = c.LevelBid,
                                        StrawPosition = c.StrawPosition,
                                        SampleID = c.SampleId,
                                        Status = c.Status,
                                        CreatedBy = c.CreatedBy,
                                        UpdatedBy = c.UpdatedBy,
                                        CreatedAt = c.CreatedAt,
                                        UpdatedAt = c.UpdatedAt
                                    }).ToList()
                            }).ToList()
                    }).ToList()
            };
        }

        public async Task<bool> DeleteLevelA(long levelAId, long? updatedBy)
        {
            var levelA = await _context.IvfcryoLevelA
                .Include(a => a.IvfcryoLevelB)
                    .ThenInclude(b => b.IvfcryoLevelC)
                .FirstOrDefaultAsync(a => a.Id == levelAId && !a.IsDeleted);

            if (levelA == null)
                return false;

            levelA.IsDeleted = true;
            levelA.UpdatedBy = updatedBy;
            levelA.UpdatedAt = DateTime.Now;

            if (levelA.IvfcryoLevelB != null)
            {
                foreach (var levelB in levelA.IvfcryoLevelB)
                {
                    levelB.IsDeleted = true;
                    levelB.UpdatedBy = updatedBy;
                    levelB.UpdatedAt = DateTime.Now;

                    if (levelB.IvfcryoLevelC != null)
                    {
                        foreach (var levelC in levelB.IvfcryoLevelC)
                        {
                            levelC.IsDeleted = true;
                            levelC.UpdatedBy = updatedBy;
                            levelC.UpdatedAt = DateTime.Now;
                        }
                    }
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteLevelB(long levelBId, long? updatedBy)
        {
            var levelB = await _context.IvfcryoLevelB
                .Include(b => b.IvfcryoLevelC)
                .FirstOrDefaultAsync(b => b.Id == levelBId && !b.IsDeleted);

            if (levelB == null)
                return false;

            levelB.IsDeleted = true;
            levelB.UpdatedBy = updatedBy;
            levelB.UpdatedAt = DateTime.Now;

            if (levelB.IvfcryoLevelC != null)
            {
                foreach (var levelC in levelB.IvfcryoLevelC)
                {
                    levelC.IsDeleted = true;
                    levelC.UpdatedBy = updatedBy;
                    levelC.UpdatedAt = DateTime.Now;
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteLevelC(long levelCId, long? updatedBy)
        {
            var levelC = await _context.IvfcryoLevelC
                .FirstOrDefaultAsync(c => c.Id == levelCId && !c.IsDeleted);

            if (levelC == null)
                return false;

            levelC.IsDeleted = true;
            levelC.UpdatedBy = updatedBy;
            levelC.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<CryoDropDownDto>> GetContainersDropdown()
        {
            return await _context.IvfcryoContainers
                .Where(c => !c.IsDeleted)
                .Select(c => new CryoDropDownDto
                {
                    Value = c.Id,
                    Label = c.Description
                })
                .OrderBy(c => c.Label)
                .ToListAsync();
        }

        public async Task<List<CryoDropDownDto>> GetLevelADropdown(long containerId)
        {
            return await _context.IvfcryoLevelA
                .Where(a => a.ContainerId == containerId && !a.IsDeleted)
                .Select(a => new CryoDropDownDto
                {
                    Value = a.Id,
                    Label = a.CanisterCode
                })
                .OrderBy(a => a.Label)
                .ToListAsync();
        }

        public async Task<List<CryoDropDownDto>> GetLevelBDropdown(long levelAId)
        {
            return await _context.IvfcryoLevelB
                .Where(b => b.LevelAid == levelAId && !b.IsDeleted)
                .Select(b => new CryoDropDownDto
                {
                    Value = b.Id,
                    Label = b.CaneCode
                })
                .OrderBy(b => b.Label)
                .ToListAsync();
        }

        public async Task<List<CryoStorageListDto>> SearchCryoStorages(CryoSearchRequestDto searchRequest)
        {
            // 1. Base LevelB join with LevelA + Container
            var baseQuery = from levelB in _context.IvfcryoLevelB
                            join levelA in _context.IvfcryoLevelA on levelB.LevelAid equals levelA.Id
                            join container in _context.IvfcryoContainers on levelA.ContainerId equals container.Id
                            where !levelB.IsDeleted && !levelA.IsDeleted && !container.IsDeleted
                            select new
                            {
                                levelB,
                                levelA,
                                container
                            };

            // Filters
            if (searchRequest.ContainerId >0)
                baseQuery = baseQuery.Where(x => x.container.Id == searchRequest.ContainerId.Value);

            if (searchRequest.LevelAId>0)
                baseQuery = baseQuery.Where(x => x.levelA.Id == searchRequest.LevelAId.Value);

            if (searchRequest.LevelBId>0)
                baseQuery = baseQuery.Where(x => x.levelB.Id == searchRequest.LevelBId.Value);

            // 2. LEFT JOIN LevelC
            var storageQuery =
                from b in baseQuery
                join c in _context.IvfcryoLevelC.Where(lc => !lc.IsDeleted)
                      on b.levelB.Id equals c.LevelBid into levelCGroup
                from lc in levelCGroup.DefaultIfEmpty()
                select new
                {
                    b.container.Description,
                    b.levelA.CanisterCode,
                    b.levelB.CaneCode,
                    LevelBId = b.levelB.Id,
                    LevelC = lc
                };

            // 3. Group and calculate counts
            var groupedQuery =
                from x in storageQuery
                group x by new { x.Description, x.CanisterCode, x.CaneCode, x.LevelBId } into g
                select new
                {
                    g.Key.Description,
                    Canister = g.Key.CanisterCode,
                    Goblet = g.Key.CaneCode,
                    // Distinct Patients
                    PatientCount = g.Where(z => z.LevelC != null && z.LevelC.SampleId != null)
                        .Select(z => z.LevelC.Sample.Ivfmain.MalePatientId)
                        .Distinct()
                        .Count(),
                    // Sample count
                    SampleCount = g.Count(z => z.LevelC != null &&
                                               z.LevelC.SampleId != null &&
                                               z.LevelC.Status != "Available"),
                    // Free slots = total slots - occupied
                    FreePlaces = (
                        g.Count(z => z.LevelC == null ||        // no LevelC = free slot
                                    z.LevelC.SampleId == null ||
                                    z.LevelC.Status == "Available")
                    ),
                    StrawIds = g.Where(z => z.LevelC != null && z.LevelC.SampleId != null)
                                .Select(z => z.LevelC.SampleId.ToString()),

                    FirstFreeLevelCId =
            g.Where(z => z.LevelC.Id != null &&
                         (z.LevelC.SampleId == null || z.LevelC.Status == "Available"))
             .Select(z => z.LevelC.Id)
             .FirstOrDefault()
                };

            // Filters
            if (searchRequest.MinFreePositions>0)
                groupedQuery = groupedQuery.Where(x => x.FreePlaces >= searchRequest.MinFreePositions.Value);

            if (searchRequest.MaxPatients>0)
                groupedQuery = groupedQuery.Where(x => x.PatientCount <= searchRequest.MaxPatients.Value);

            if (searchRequest.MaxSamples>0)
                groupedQuery = groupedQuery.Where(x => x.SampleCount <= searchRequest.MaxSamples.Value);

            var data = await groupedQuery.ToListAsync();

            // Final DTO mapping
            return data.Select(x => new CryoStorageListDto
            {
                Description = x.Description,
                Canister = x.Canister,
                Goblet = x.Goblet,
                PatientCount = x.PatientCount,
                SampleCount = x.SampleCount,
                FreePlaces = x.FreePlaces,
                StrawId = x.StrawIds.Any() ? string.Join(", ", x.StrawIds) : null,
                LevelCId = x.FirstFreeLevelCId
            }).ToList();
        }
        // Helper method to get patient count through SampleId
        private int GetPatientCount(IQueryable<IvfcryoLevelC> levelCQuery)
        {
            return (from levelC in levelCQuery
                    join sample in _context.IvfmaleSemenSample on levelC.SampleId equals sample.SampleId
                    join ivfMain in _context.Ivfmain on sample.IvfmainId equals ivfMain.IvfmainId
                    select ivfMain.MalePatientId)
                    .Distinct()
                    .Count();
        }

    }
}
