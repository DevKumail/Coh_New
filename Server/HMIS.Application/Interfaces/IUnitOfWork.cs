using System;
using System.Data;
using System.Threading.Tasks;

namespace HMIS.Application.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IDbConnection Connection { get; }
        IDbTransaction Transaction { get; }

        void BeginTransaction();
        void Commit();
        void Rollback();

        Task<int> ExecuteAsync(string sql, object param = null);
        Task<T> QueryFirstOrDefaultAsync<T>(string sql, object param = null);
        Task<IEnumerable<T>> QueryAsync<T>(string sql, object param = null);
    }
}
