using HMIS.Infrastructure.IRepositories;
using HMIS.Infrastructure.Repositories.IVF;
using Microsoft.Extensions.DependencyInjection;
namespace HMIS.Infrastructure
{
    public static class ServiceExtensions
    {
        public static void AddApplicationLayer(this IServiceCollection services)
        {
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            services.AddScoped<IIVFMaleSemenRepository, IVFMaleSemenRepository>();

        }
    }
}
