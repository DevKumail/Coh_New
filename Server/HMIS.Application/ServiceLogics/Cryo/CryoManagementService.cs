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
            return _context.CryoContainers.Any(c => c.Id == id);
        }

        public async Task<bool> InsertOrUpdateCryoContainer(CryoContainerDto containerDto)
        {
            try
            {
                bool exist = Exist(containerDto.ID);

                if (!exist)
                {
                    // Create new container
                    var container = new CryoContainers
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

                    _context.CryoContainers.Add(container);
                    await _context.SaveChangesAsync();

                    // Add nested levels
                    if(containerDto.LevelA != null) {

                        foreach (var levelA in containerDto.LevelA)
                        {
                            var levelAEntity = new CryoLevelA
                            {
                                ContainerId = container.Id,
                                CanisterCode = levelA.CanisterCode,
                                CreatedBy = levelA.CreatedBy,
                                CreatedAt = DateTime.Now
                            };
                            _context.CryoLevelA.Add(levelAEntity);
                            await _context.SaveChangesAsync();

                            foreach (var levelB in levelA.LevelB)
                            {
                                var levelBEntity = new CryoLevelB
                                {
                                    LevelAid = levelAEntity.Id,
                                    CaneCode = levelB.CaneCode,
                                    CreatedBy = levelB.CreatedBy,
                                    CreatedAt = DateTime.Now
                                };
                                _context.CryoLevelB.Add(levelBEntity);
                                await _context.SaveChangesAsync();

                                if (levelB.LevelC != null)
                                {
                                    foreach (var levelC in levelB.LevelC)
                                    {
                                        var levelCEntity = new CryoLevelC
                                        {
                                            LevelBid = levelBEntity.Id,
                                            StrawPosition = levelC.StrawPosition,
                                            SampleId = levelC.SampleID,
                                            Status = levelC.Status,
                                            CreatedBy = levelC.CreatedBy,
                                            CreatedAt = DateTime.Now
                                        };
                                        _context.CryoLevelC.Add(levelCEntity);
                                    }
                                }
                            }
                        }
                    }

                    await _context.SaveChangesAsync();
                    return true;
                }
                else
                {
                    // Update existing container
                    var container = await _context.CryoContainers
                        .Include(c => c.CryoLevelA)
                            .ThenInclude(a => a.CryoLevelB)
                                .ThenInclude(b => b.CryoLevelC)
                        .FirstOrDefaultAsync(c => c.Id == containerDto.ID && !c.IsDeleted);

                    if (container == null) return false;

                    container.CryoLevelA = container.CryoLevelA
                        .Where(a => !a.IsDeleted)
                        .Select(a =>
                        {
                            a.CryoLevelB = a.CryoLevelB
                                .Where(b => !b.IsDeleted)
                                .Select(b =>
                                {
                                    b.CryoLevelC = b.CryoLevelC
                                        .Where(c => !c.IsDeleted)
                                        .ToList();
                                    return b;
                                })
                                .ToList();
                            return a;
                        })
                        .ToList();


                    container.Description = containerDto.Description;
                    container.IsSperm = containerDto.IsSperm;
                    container.IsOocyteOrEmbryo = containerDto.IsOocyteOrEmb;
                    container.LastAudit = containerDto.LastAudit;
                    container.MaxStrawsInLastLevel = containerDto.MaxStrawsInLastLevel;
                    container.UpdatedBy = containerDto.UpdatedBy;
                    container.UpdatedAt = DateTime.Now;

                    // Handle LevelA
                    if (containerDto.LevelA != null)
                    {
                        foreach (var levelADto in containerDto.LevelA)
                        {
                            CryoLevelA? levelAEntity = null;
                            if (levelADto.ID.HasValue && levelADto.ID.Value > 0)
                            {
                                // Update existing LevelA
                                levelAEntity = container.CryoLevelA.FirstOrDefault(a => a.Id == levelADto.ID && !a.IsDeleted);
                                if (levelAEntity != null)
                                {
                                    levelAEntity.CanisterCode = levelADto.CanisterCode;
                                    levelAEntity.UpdatedBy = levelADto.UpdatedBy;
                                    levelAEntity.UpdatedAt = DateTime.Now;
                                }
                            }
                            else
                            {
                                // Add new LevelA
                                levelAEntity = new CryoLevelA
                                {
                                    ContainerId = containerDto.ID,
                                    CanisterCode = levelADto.CanisterCode,
                                    CreatedBy = levelADto.CreatedBy,
                                    CreatedAt = DateTime.Now
                                };
                                _context.CryoLevelA.Add(levelAEntity);
                                await _context.SaveChangesAsync(); 
                                container.CryoLevelA.Add(levelAEntity);
                            }

                            // Handle LevelB for this LevelA
                            if (levelADto.LevelB != null && levelAEntity != null)
                            {
                                foreach (var levelBDto in levelADto.LevelB)
                                {
                                    CryoLevelB? levelBEntity = null;
                                    if (levelBDto.ID.HasValue && levelBDto.ID.Value > 0)
                                    {
                                        // Update existing LevelB
                                        levelBEntity = levelAEntity.CryoLevelB.FirstOrDefault(b => b.Id == levelBDto.ID && !b.IsDeleted);
                                        if (levelBEntity != null)
                                        {
                                            levelBEntity.CaneCode = levelBDto.CaneCode;
                                            levelBEntity.UpdatedBy = levelBDto.UpdatedBy;
                                            levelBEntity.UpdatedAt = DateTime.Now;
                                        }
                                    }
                                    else
                                    {
                                        // Add new LevelB
                                        levelBEntity = new CryoLevelB
                                        {
                                            LevelAid = levelAEntity.Id,
                                            CaneCode = levelBDto.CaneCode,
                                            CreatedBy = levelBDto.CreatedBy,
                                            CreatedAt = DateTime.Now
                                        };
                                        _context.CryoLevelB.Add(levelBEntity);
                                        await _context.SaveChangesAsync(); 
                                        levelAEntity.CryoLevelB.Add(levelBEntity);
                                    }

                                    // Handle LevelC for this LevelB
                                    if (levelBDto.LevelC != null && levelBEntity != null)
                                    {
                                        foreach (var levelCDto in levelBDto.LevelC)
                                        {
                                            CryoLevelC? levelCEntity = null;
                                            if (levelCDto.ID.HasValue && levelCDto.ID.Value > 0)
                                            {
                                                // Update existing LevelC
                                                levelCEntity = levelBEntity.CryoLevelC.FirstOrDefault(c => c.Id == levelCDto.ID && !c.IsDeleted);
                                                if (levelCEntity != null)
                                                {
                                                    levelCEntity.StrawPosition = levelCDto.StrawPosition;
                                                    levelCEntity.SampleId = levelCDto.SampleID;
                                                    levelCEntity.Status = levelCDto.Status;
                                                    levelCEntity.UpdatedBy = levelCDto.UpdatedBy;
                                                    levelCEntity.UpdatedAt = DateTime.Now;
                                                }
                                            }
                                            else
                                            {
                                                // Add new LevelC
                                                levelCEntity = new CryoLevelC
                                                {
                                                    LevelBid = levelBEntity.Id,
                                                    StrawPosition = levelCDto.StrawPosition,
                                                    SampleId = levelCDto.SampleID,
                                                    Status = levelCDto.Status,
                                                    CreatedBy = levelCDto.CreatedBy,
                                                    CreatedAt = DateTime.Now
                                                };
                                                _context.CryoLevelC.Add(levelCEntity);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    await _context.SaveChangesAsync();
                    return true;

                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<(IEnumerable<CryoContainerDto> Data, int TotalCount)>
        GetAllCryoContainers(int page, int pageSize)
        {
            try
            {
                var query = _context.CryoContainers
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
            var container = await _context.CryoContainers
                .Include(c => c.CryoLevelA)
                    .ThenInclude(a => a.CryoLevelB)
                        .ThenInclude(b => b.CryoLevelC)
                .FirstOrDefaultAsync(c => c.Id == containerId);

            if (container == null || (container.GetType().GetProperty("IsDeleted") != null && (bool?)container.GetType().GetProperty("IsDeleted")?.GetValue(container) == true))
                return false;

            if (container.GetType().GetProperty("IsDeleted") != null)
                container.GetType().GetProperty("IsDeleted")?.SetValue(container, true);
            container.UpdatedBy = updatedBy;
            container.UpdatedAt = DateTime.Now;

            // Soft delete LevelA
            if (container.CryoLevelA != null)
            {
                foreach (var levelA in container.CryoLevelA)
                {
                    if (levelA.GetType().GetProperty("IsDeleted") != null)
                        levelA.GetType().GetProperty("IsDeleted")?.SetValue(levelA, true);
                    levelA.UpdatedBy = updatedBy;
                    levelA.UpdatedAt = DateTime.Now;

                    // Soft delete LevelB
                    if (levelA.CryoLevelB != null)
                    {
                        foreach (var levelB in levelA.CryoLevelB)
                        {
                            if (levelB.GetType().GetProperty("IsDeleted") != null)
                                levelB.GetType().GetProperty("IsDeleted")?.SetValue(levelB, true);
                            levelB.UpdatedBy = updatedBy;
                            levelB.UpdatedAt = DateTime.Now;

                            // Soft delete LevelC
                            if (levelB.CryoLevelC != null)
                            {
                                foreach (var levelC in levelB.CryoLevelC)
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
            var container = await _context.CryoContainers
                .Include(c => c.CryoLevelA)
                    .ThenInclude(a => a.CryoLevelB)
                        .ThenInclude(b => b.CryoLevelC)
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
                LevelA = container.CryoLevelA?
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
                        LevelB = a.CryoLevelB?
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
                                LevelC = b.CryoLevelC?
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
            var levelA = await _context.CryoLevelA
                .Include(a => a.CryoLevelB)
                    .ThenInclude(b => b.CryoLevelC)
                .FirstOrDefaultAsync(a => a.Id == levelAId && !a.IsDeleted);

            if (levelA == null)
                return false;

            levelA.IsDeleted = true;
            levelA.UpdatedBy = updatedBy;
            levelA.UpdatedAt = DateTime.Now;

            if (levelA.CryoLevelB != null)
            {
                foreach (var levelB in levelA.CryoLevelB)
                {
                    levelB.IsDeleted = true;
                    levelB.UpdatedBy = updatedBy;
                    levelB.UpdatedAt = DateTime.Now;

                    if (levelB.CryoLevelC != null)
                    {
                        foreach (var levelC in levelB.CryoLevelC)
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
            var levelB = await _context.CryoLevelB
                .Include(b => b.CryoLevelC)
                .FirstOrDefaultAsync(b => b.Id == levelBId && !b.IsDeleted);

            if (levelB == null)
                return false;

            levelB.IsDeleted = true;
            levelB.UpdatedBy = updatedBy;
            levelB.UpdatedAt = DateTime.Now;

            if (levelB.CryoLevelC != null)
            {
                foreach (var levelC in levelB.CryoLevelC)
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
            var levelC = await _context.CryoLevelC
                .FirstOrDefaultAsync(c => c.Id == levelCId && !c.IsDeleted);

            if (levelC == null)
                return false;

            levelC.IsDeleted = true;
            levelC.UpdatedBy = updatedBy;
            levelC.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

    }
}
