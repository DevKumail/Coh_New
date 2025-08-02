using Dapper;
using HMIS.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace HMIS.Persistence.Services
{
    public class DapperSPService : IDapperSPService
    {
        private readonly string _connectionString;

        public DapperSPService(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("Default");
        }

        private IDbConnection GetConnection() => new SqlConnection(_connectionString);

        public async Task<DataSet> GetDataSetAsync(string spName, DynamicParameters parameters = null)
        {
            try
            {
                using var conn = GetConnection();
                var reader = await conn.ExecuteReaderAsync(spName, parameters, commandType: CommandType.StoredProcedure);
                var ds = new DataSet();
                ds.Load(reader, LoadOption.OverwriteChanges, "Result");
                return ds;
            }
            catch
            {
                return new DataSet(); 
            }
        }

        public async Task<bool> ExecuteStoredProcedureAsync(string spName, DynamicParameters parameters)
        {
            try
            {
                using var conn = GetConnection();
                await conn.ExecuteAsync(spName, parameters, commandType: CommandType.StoredProcedure);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
