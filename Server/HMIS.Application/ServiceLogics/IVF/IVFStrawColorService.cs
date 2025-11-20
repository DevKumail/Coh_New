using HMIS.Application.DTOs.IVFDTOs;
using HMIS.Core.Context;
using HMIS.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Application.ServiceLogics.IVF
{
    public interface IIVFStrawColorService
    {
        Task<IEnumerable<IVFStrawColorDto>> GetAllStrawColors();
        Task<IEnumerable<IVFStrawColorDto>> GetActiveStrawColors();
        Task<IVFStrawColorDto?> GetStrawColorById(int colorId);
        Task<bool> CreateStrawColor(IVFStrawColorCreateDto colorDto);
        Task<bool> UpdateStrawColor(IVFStrawColorUpdateDto colorDto);
        Task<bool> DeleteStrawColor(int colorId, int? updatedBy);
    }
    public class IVFStrawColorService : IIVFStrawColorService
    {
        private readonly HMISDbContext _context;

        public IVFStrawColorService(HMISDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<IVFStrawColorDto>> GetAllStrawColors()
        {
            var colors = await _context.IvfstrawColors
                .Where(c => !c.IsDeleted ?? false)
                .OrderBy(c => c.SortOrder)
                .ThenBy(c => c.ColorDescription)
                .Select(c => new IVFStrawColorDto
                {
                    ColorId = c.ColorId,
                    ColorCode = c.ColorCode,
                    ColorDescription = c.ColorDescription,
                    SortOrder = c.SortOrder,
                    IsActive = c.IsActive ?? false, 
                    CreatedBy = c.CreatedBy,
                    CreatedAt = c.CreatedAt ?? DateTime.MinValue,
                    UpdatedBy = c.UpdatedBy,
                    UpdatedAt = c.UpdatedAt ?? DateTime.MinValue,
                    IsDeleted = c.IsDeleted ?? false
                })
                .ToListAsync();

            return colors;
        }

        public async Task<IEnumerable<IVFStrawColorDto>> GetActiveStrawColors()
        {
            var colors = await _context.IvfstrawColors
                .Where(c => (c.IsActive ?? false) && !(c.IsDeleted ?? false)) 
                .OrderBy(c => c.SortOrder)
                .ThenBy(c => c.ColorDescription)
                .Select(c => new IVFStrawColorDto
                {
                    ColorId = c.ColorId,
                    ColorCode = c.ColorCode,
                    ColorDescription = c.ColorDescription,
                    SortOrder = c.SortOrder,
                    IsActive = c.IsActive ?? false,
                    CreatedBy = c.CreatedBy,
                    CreatedAt = c.CreatedAt ?? DateTime.MinValue,
                    UpdatedBy = c.UpdatedBy,
                    UpdatedAt = c.UpdatedAt ?? DateTime.MinValue,
                    IsDeleted = c.IsDeleted ?? false
                })
                .ToListAsync();

            return colors;
        }

        public async Task<IVFStrawColorDto?> GetStrawColorById(int colorId)
        {
            var color = await _context.IvfstrawColors
                .Where(c => c.ColorId == colorId && !(c.IsDeleted ?? false))
                .Select(c => new IVFStrawColorDto
                {
                    ColorId = c.ColorId,
                    ColorCode = c.ColorCode,
                    ColorDescription = c.ColorDescription,
                    SortOrder = c.SortOrder,
                    IsActive = c.IsActive ?? false,
                    CreatedBy = c.CreatedBy,
                    CreatedAt = c.CreatedAt ?? DateTime.MinValue,
                    UpdatedBy = c.UpdatedBy,
                    UpdatedAt = c.UpdatedAt ?? DateTime.MinValue,
                    IsDeleted = c.IsDeleted ?? false
                })
                .FirstOrDefaultAsync();

            return color;
        }

        public async Task<bool> CreateStrawColor(IVFStrawColorCreateDto colorDto)
        {
            try
            {
                var color = new IvfstrawColors
                {
                    ColorCode = colorDto.ColorCode,
                    ColorDescription = colorDto.ColorDescription,
                    SortOrder = colorDto.SortOrder,
                    IsActive = colorDto.IsActive, 
                    CreatedBy = colorDto.CreatedBy,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    IsDeleted = false
                };

                _context.IvfstrawColors.Add(color);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> UpdateStrawColor(IVFStrawColorUpdateDto colorDto)
        {
            try
            {
                var color = await _context.IvfstrawColors
                    .FirstOrDefaultAsync(c => c.ColorId == colorDto.ColorId && !(c.IsDeleted ?? false));

                if (color == null)
                    return false;

                color.ColorCode = colorDto.ColorCode;
                color.ColorDescription = colorDto.ColorDescription;
                color.SortOrder = colorDto.SortOrder;
                color.IsActive = colorDto.IsActive;
                color.UpdatedBy = colorDto.UpdatedBy;
                color.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> DeleteStrawColor(int colorId, int? updatedBy)
        {
            try
            {
                var color = await _context.IvfstrawColors
                    .FirstOrDefaultAsync(c => c.ColorId == colorId && !(c.IsDeleted ?? false));

                if (color == null)
                    return false;

                color.IsDeleted = true;
                color.UpdatedBy = updatedBy;
                color.UpdatedAt = DateTime.UtcNow;

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