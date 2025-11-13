using HMIS.Application.DTOs.Configurations;
using HMIS.Core.Context;
using HMIS.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Application.ServiceLogics
{
    public interface IDropDownLookUpService
    {
        Task<(IEnumerable<DropDownCategoryDto> Data, int TotalCount)> GetAllCategoriesAsync(int page, int pageSize); Task<DropDownCategoryDto?> GetCategoryByIdAsync(long categoryId);
        Task<bool> CreateOrUpdateCategoryAsync(DropDownCategoryDto categoryDto);
        Task<bool> DeleteCategoryAsync(long categoryId, long? updatedBy);

        Task<List<DropDownConfigurationDto>> GetConfigurationsByCategoryIdAsync(long categoryId);
        Task<DropDownConfigurationDto?> GetConfigurationByIdAsync(long valueId);
        Task<bool> CreateOrUpdateConfigurationAsync(DropDownConfigurationDto configurationDto);
        Task<bool> DeleteConfigurationAsync(long valueId, long? updatedBy);

        Task<DropDownCategoryWithValuesDto?> GetCategoryWithValuesAsync(long categoryId);
        Task<List<DropDownCategoryWithValuesDto>> GetAllCategoriesWithValuesAsync();
    }
    public class DropDownLookUpService : IDropDownLookUpService
    {
        private readonly HMISDbContext _context;

        public DropDownLookUpService(HMISDbContext context)
        {
            _context = context;
        }

        public async Task<(IEnumerable<DropDownCategoryDto> Data, int TotalCount)> GetAllCategoriesAsync(int page, int pageSize)
        {
            try
            {
                var query = _context.DropdownCategory;

                int totalCount = await query.CountAsync();

                var categories = await query
                    .OrderBy(c => c.CategoryName)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(c => new DropDownCategoryDto
                    {
                        CategoryId = c.CategoryId,
                        CategoryName = c.CategoryName,
                        Description = c.Description,
                    })
                    .ToListAsync();

                return (categories, totalCount);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<DropDownCategoryDto?> GetCategoryByIdAsync(long categoryId)
        {
            try
            {
                var category = await _context.DropdownCategory
                    .FirstOrDefaultAsync(c => c.CategoryId == categoryId );

                if (category == null) return null;

                return new DropDownCategoryDto
                {
                    CategoryId = category.CategoryId,
                    CategoryName = category.CategoryName,
                    Description = category.Description,
                };
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<bool> CreateOrUpdateCategoryAsync(DropDownCategoryDto categoryDto)
        {
            try
            {
                if (categoryDto.CategoryId.HasValue && categoryDto.CategoryId > 0)
                {
                    // Update existing category
                    var existingCategory = await _context.DropdownCategory
                        .FirstOrDefaultAsync(c => c.CategoryId == categoryDto.CategoryId );

                    if (existingCategory == null) return false;

                    existingCategory.CategoryName = categoryDto.CategoryName;
                    existingCategory.Description = categoryDto.Description;
                }
                else
                {
                    // Create new category
                    var newCategory = new DropdownCategory
                    {
                        CategoryName = categoryDto.CategoryName,
                        Description = categoryDto.Description,
                    };

                    _context.DropdownCategory.Add(newCategory);
                }

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<bool> DeleteCategoryAsync(long categoryId, long? updatedBy)
        {
            try
            {
                var category = await _context.DropdownCategory
                    .FirstOrDefaultAsync(c => c.CategoryId == categoryId );

                if (category == null) return false;


                var configurations = await _context.DropdownConfiguration
                    .Where(c => c.CategoryId == categoryId && !c.IsActive)
                    .ToListAsync();

                foreach (var config in configurations)
                {
                }

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<List<DropDownConfigurationDto>> GetConfigurationsByCategoryIdAsync(long categoryId)
        {
            try
            {
                var configurations = await _context.DropdownConfiguration
                    .Where(c => c.CategoryId == categoryId && c.IsActive)
                    .OrderBy(c => c.SortOrder)
                    .ThenBy(c => c.ValueName)
                    .Select(c => new DropDownConfigurationDto
                    {
                        ValueId = c.ValueId,
                        CategoryId = c.CategoryId,
                        ValueName = c.ValueName,
                        SortOrder = c.SortOrder,
                        IsActive = c.IsActive,
                    })
                    .ToListAsync();

                return configurations;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<DropDownConfigurationDto?> GetConfigurationByIdAsync(long valueId)
        {
            try
            {
                var configuration = await _context.DropdownConfiguration
                    .FirstOrDefaultAsync(c => c.ValueId == valueId && !c.IsActive);

                if (configuration == null) return null;

                return new DropDownConfigurationDto
                {
                    ValueId = configuration.ValueId,
                    CategoryId = configuration.CategoryId,
                    ValueName = configuration.ValueName,
                    SortOrder = configuration.SortOrder,
                    IsActive = configuration.IsActive,
                };
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<bool> CreateOrUpdateConfigurationAsync(DropDownConfigurationDto configurationDto)
        {
            try
            {
                if (configurationDto.ValueId.HasValue && configurationDto.ValueId > 0)
                {
                    // Update existing configuration
                    var existingConfig = await _context.DropdownConfiguration
                        .FirstOrDefaultAsync(c => c.ValueId == configurationDto.ValueId && !c.IsActive);

                    if (existingConfig == null) return false;

                    existingConfig.ValueName = configurationDto.ValueName;
                    existingConfig.SortOrder = configurationDto.SortOrder;
                    existingConfig.IsActive = configurationDto.IsActive;
                }
                else
                {
                    // Create new configuration
                    var newConfig = new DropdownConfiguration
                    {
                        CategoryId = configurationDto.CategoryId,
                        ValueName = configurationDto.ValueName,
                        SortOrder = configurationDto.SortOrder,
                        IsActive = configurationDto.IsActive,
                    };

                    _context.DropdownConfiguration.Add(newConfig);
                }

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<bool> DeleteConfigurationAsync(long valueId, long? updatedBy)
        {
            try
            {
                var configuration = await _context.DropdownConfiguration
                    .FirstOrDefaultAsync(c => c.ValueId == valueId && !c.IsActive);

                if (configuration == null) return false;

                configuration.IsActive = false;

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<DropDownCategoryWithValuesDto?> GetCategoryWithValuesAsync(long categoryId)
        {
            try
            {
                var category = await _context.DropdownCategory
                    .Include(c => c.DropdownConfiguration)
                    .FirstOrDefaultAsync(c => c.CategoryId == categoryId );

                if (category == null) return null;

                return new DropDownCategoryWithValuesDto
                {
                    CategoryId = category.CategoryId,
                    CategoryName = category.CategoryName,
                    Description = category.Description,
                    Values = category.DropdownConfiguration?
                        .Where(c =>  c.IsActive)
                        .OrderBy(c => c.SortOrder)
                        .ThenBy(c => c.ValueName)
                        .Select(c => new DropDownConfigurationDto
                        {
                            ValueId = c.ValueId,
                            CategoryId = c.CategoryId,
                            ValueName = c.ValueName,
                            SortOrder = c.SortOrder,
                            IsActive = c.IsActive,
                        }).ToList() ?? new List<DropDownConfigurationDto>()
                };
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<List<DropDownCategoryWithValuesDto>> GetAllCategoriesWithValuesAsync()
        {
            try
            {
                var categories = await _context.DropdownCategory
                    .Include(c => c.DropdownConfiguration)
                    .OrderBy(c => c.CategoryName)
                    .Select(c => new DropDownCategoryWithValuesDto
                    {
                        CategoryId = c.CategoryId,
                        CategoryName = c.CategoryName,
                        Description = c.Description,
                        Values = c.DropdownConfiguration!
                            .Where(config => config.IsActive)
                            .OrderBy(config => config.SortOrder)
                            .ThenBy(config => config.ValueName)
                            .Select(config => new DropDownConfigurationDto
                            {
                                ValueId = config.ValueId,
                                CategoryId = config.CategoryId,
                                ValueName = config.ValueName,
                                SortOrder = config.SortOrder,
                                IsActive = config.IsActive,
                            }).ToList()
                    })
                    .ToListAsync();

                return categories;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
