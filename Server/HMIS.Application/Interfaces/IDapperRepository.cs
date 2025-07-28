using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace HMIS.Application.Interfaces
{
    public interface IDapperRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T?> GetByIdAsync(int id);
        Task<int> AddAsync(T entity);
        Task<int> UpdateAsync(T entity);
        Task<int> DeleteAsync(int id);
        Task<int> BulkInsertAsync(IEnumerable<T> entities);
        Task<IEnumerable<T>> BulkGetByIdsAsync(IEnumerable<int> ids);
        Task<IEnumerable<T>> GetPagedAsync(int pageNumber, int pageSize);
        Task<IEnumerable<T>> GetFilteredAsync(string column, string value);

        Task<IEnumerable<TReturn>> QueryWithJoinAsync<TFirst, TSecond, TReturn>(
            string sql, Func<TFirst, TSecond, TReturn> map, object? param = null, string splitOn = "Id");

        Task<IEnumerable<TReturn>> QueryMultiMapAsync<TFirst, TSecond, TThird, TReturn>(
            string sql, Func<TFirst, TSecond, TThird, TReturn> map, object? param = null, string splitOn = "Id");

        Task ExecuteInTransactionAsync(Func<IDbConnection, IDbTransaction, Task> operation);
    }
}
