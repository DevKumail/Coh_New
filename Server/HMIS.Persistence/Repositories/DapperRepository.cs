using Dapper;
using HMIS.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace HMIS.Persistence.Repositories
{
    public class DapperRepository<T> : IDapperRepository<T> where T : class
    {
        private readonly string _connectionString;
        private const int MaxRetryCount = 3;

        public DapperRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("Default");
        }
        private IDbConnection GetConnection() => new SqlConnection(_connectionString);

        #region CRUD

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            string sql = $"SELECT * FROM {typeof(T).Name}s WITH(NOLOCK)";
            return await RetryPolicy(async () =>
            {
                using var conn = GetConnection();
                return await conn.QueryAsync<T>(sql);
            });
        }

        public async Task<T?> GetByIdAsync(int id)
        {
            string sql = $"SELECT * FROM {typeof(T).Name}s WITH(NOLOCK) WHERE Id = @Id";
            return await RetryPolicy(async () =>
            {
                using var conn = GetConnection();
                return await conn.QueryFirstOrDefaultAsync<T>(sql, new { Id = id });
            });
        }

        public async Task<int> AddAsync(T entity)
        {
            var props = GetProps();
            string sql = $"INSERT INTO {typeof(T).Name}s ({string.Join(", ", props)}) VALUES ({string.Join(", ", props.Select(p => "@" + p))})";

            return await RetryPolicy(async () =>
            {
                using var conn = GetConnection();
                return await conn.ExecuteAsync(sql, entity);
            });
        }

        public async Task<int> UpdateAsync(T entity)
        {
            var props = GetProps();
            string setClause = string.Join(", ", props.Select(p => $"{p} = @{p}"));
            string sql = $"UPDATE {typeof(T).Name}s SET {setClause} WHERE Id = @Id";

            return await RetryPolicy(async () =>
            {
                using var conn = GetConnection();
                return await conn.ExecuteAsync(sql, entity);
            });
        }

        public async Task<int> DeleteAsync(int id)
        {
            string sql = $"DELETE FROM {typeof(T).Name}s WHERE Id = @Id";
            return await RetryPolicy(async () =>
            {
                using var conn = GetConnection();
                return await conn.ExecuteAsync(sql, new { Id = id });
            });
        }

        #endregion

        #region Bulk

        public async Task<int> BulkInsertAsync(IEnumerable<T> entities)
        {
            var props = GetProps();
            string sql = $"INSERT INTO {typeof(T).Name}s ({string.Join(", ", props)}) VALUES ({string.Join(", ", props.Select(p => "@" + p))})";

            var tasks = entities.Select(entity =>
                RetryPolicy(async () =>
                {
                    using var conn = GetConnection();
                    return await conn.ExecuteAsync(sql, entity);
                })
            );

            await Task.WhenAll(tasks);
            return entities.Count();
        }

        public async Task<IEnumerable<T>> BulkGetByIdsAsync(IEnumerable<int> ids)
        {
            string sql = $"SELECT * FROM {typeof(T).Name}s WHERE Id IN @Ids";
            return await RetryPolicy(async () =>
            {
                using var conn = GetConnection();
                return await conn.QueryAsync<T>(sql, new { Ids = ids });
            });
        }

        #endregion

        #region Pagination & Filtering

        public async Task<IEnumerable<T>> GetPagedAsync(int pageNumber, int pageSize)
        {
            string sql = $"""
                          SELECT * FROM {typeof(T).Name}s WITH(NOLOCK)
                          ORDER BY Id
                          OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY
                          """;

            return await RetryPolicy(async () =>
            {
                using var conn = GetConnection();
                return await conn.QueryAsync<T>(sql, new
                {
                    Offset = (pageNumber - 1) * pageSize,
                    PageSize = pageSize
                });
            });
        }

        public async Task<IEnumerable<T>> GetFilteredAsync(string column, string value)
        {
            string sql = $"SELECT * FROM {typeof(T).Name}s WITH(NOLOCK) WHERE {column} LIKE @Value";
            return await RetryPolicy(async () =>
            {
                using var conn = GetConnection();
                return await conn.QueryAsync<T>(sql, new { Value = $"%{value}%" });
            });
        }

        #endregion

        #region Relational Queries

        public async Task<IEnumerable<TReturn>> QueryWithJoinAsync<TFirst, TSecond, TReturn>(
            string sql,
            Func<TFirst, TSecond, TReturn> map,
            object? param = null,
            string splitOn = "Id")
        {
            return await RetryPolicy(async () =>
            {
                using var conn = GetConnection();
                return await conn.QueryAsync(sql, map, param, splitOn: splitOn);
            });
        }

        public async Task<IEnumerable<TReturn>> QueryMultiMapAsync<TFirst, TSecond, TThird, TReturn>(
            string sql,
            Func<TFirst, TSecond, TThird, TReturn> map,
            object? param = null,
            string splitOn = "Id")
        {
            return await RetryPolicy(async () =>
            {
                using var conn = GetConnection();
                return await conn.QueryAsync(sql, map, param, splitOn: splitOn);
            });
        }

        #endregion

        #region Transaction

        public async Task ExecuteInTransactionAsync(Func<IDbConnection, IDbTransaction, Task> operation)
        {
            using var conn = new SqlConnection(_connectionString); // concrete type
            await conn.OpenAsync();
            using var transaction = conn.BeginTransaction();

            try
            {
                await operation(conn, transaction);
                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        #endregion

        #region Utilities

        private static List<string> GetProps()
        {
            return typeof(T).GetProperties()
                .Where(p => !string.Equals(p.Name, "Id", StringComparison.OrdinalIgnoreCase))
                .Select(p => p.Name).ToList();
        }

        private async Task<TResult> RetryPolicy<TResult>(Func<Task<TResult>> operation)
        {
            int retries = 0;
            while (true)
            {
                try
                {
                    return await operation();
                }
                catch (SqlException ex) when (ex.Number == 1205) // Deadlock
                {
                    if (++retries >= MaxRetryCount)
                        throw;
                    await Task.Delay(300 * retries);
                }
            }
        }

        #endregion
    }
}
