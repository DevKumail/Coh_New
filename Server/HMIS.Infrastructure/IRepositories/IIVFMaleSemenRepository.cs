using HMIS.Core.DTOs;

namespace HMIS.Infrastructure.IRepositories
{
    public interface IIVFMaleSemenRepository
    {
        Task<(IEnumerable<IVFMaleSemenSampleListDto> Data, int TotalCount)> GetAllSemenSamples(int page, int pageSize);
        Task<IVFMaleSemenSampleDto> GetSemenSampleById(int sampleId);
    }
}
