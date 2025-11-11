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
                        Type = containerDto.Type,
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
                        .FirstOrDefaultAsync(c => c.Id == containerDto.ID);

                    if (container == null) return false;

                    container.Description = containerDto.Description;
                    container.Type = containerDto.Type;
                    container.LastAudit = containerDto.LastAudit;
                    container.MaxStrawsInLastLevel = containerDto.MaxStrawsInLastLevel;
                    container.UpdatedBy = containerDto.UpdatedBy;
                    container.UpdatedAt = DateTime.Now;

                    // TODO: Handle updating nested levels (LevelA/B/C) if needed

                    await _context.SaveChangesAsync();
                    return true;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
