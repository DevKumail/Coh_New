using Dapper;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using System.Xml.Linq;
using Microsoft.AspNetCore.Mvc.Routing;
using HMIS.Infrastructure.Logger;

namespace HMIS.Infrastructure.ORM
{
    public static class DapperHelper
    {

        public static bool ExcecuteSP(string sql)
        {
            try
            {

                var connectionString = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("ConnectionStrings")["DefaultConnection"];
                DbConnection cnn = new SqlConnection(connectionString);
                cnn.Open();



                var command = CreateCommand(sql, null);

                cnn.Execute(command);
                return true;
            }
            catch (Exception ex)
            {
                //FILE BASED
                //NLogHelper.WriteLog(new LogParameter() { Message = ex.Message, ActionDetails = $"ExcecuteSP > sql = {sql}", ActionId = 1, ActionTime = DateTime.Now, FormName = "N/A", ModuleName = "DapperHelper.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, "Exception from ExecuteSP");

                return false;

            }
        }

        public static async Task<DataSet> GetDataSetBySPWithParams(string SP, DynamicParameters parameters)
        {
            try
            {
                var connectionString = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("ConnectionStrings")["DefaultConnection"];
                DataSet dataset;

                using (var connection = new SqlConnection(connectionString))
                {

                    var list = await SqlMapper.ExecuteReaderAsync(connection, SP, parameters, commandType: CommandType.StoredProcedure);
                    dataset = ConvertDataReaderToDataSet(list);
                }

                return dataset;
            }
            catch (Exception ex)
            {
                var sb = new StringBuilder();

                if (parameters != null)
                {
                    foreach (var name in parameters.ParameterNames)
                    {
                        var pValue = parameters.Get<dynamic>(name);
                        sb.AppendFormat("{0}={1}\n", name, pValue.ToString());
                    }
                }

                //FILE BASED
                //NLogHelper.WriteLog(new LogParameter() { Message = ex.Message, ActionDetails = $"GetDataSetBySPWithParams > sql = {SP} , params > {sb.ToString()}", ActionId = 1, ActionTime = DateTime.Now, FormName = "N/A", ModuleName = "DapperHelper.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, "Exception from GetDataSetBySPWithParams");

                return new DataSet();

            }
        }

        public static async Task<bool> ExcecuteSPByParams(string SP, DynamicParameters parameters)
        {
            try
            {

                var connectionString = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("ConnectionStrings")["DefaultConnection"];

                using (var connection = new SqlConnection(connectionString))
                {

                    long result = await connection.ExecuteAsync(SP, parameters, commandType: CommandType.StoredProcedure);
                    return true;

                }




            }
            catch (Exception ex)
            {


                var sb = new StringBuilder();
                if (parameters != null)
                {
                    foreach (var name in parameters.ParameterNames)
                    {
                        var pValue = parameters.Get<dynamic>(name);
                        sb.AppendFormat("{0}={1}\n", name, pValue.ToString());
                    }
                }
                //FILE BASED
               // NLogHelper.WriteLog(new LogParameter() { Message = ex.Message, ActionDetails = $"ExcecuteSPByParams > sql = {SP} , params > {sb.ToString()}", ActionId = 1, ActionTime = DateTime.Now, FormName = "N/A", ModuleName = "DapperHelper.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, "Exception from ExcecuteSPByParams");

                return false;

            }
        }


        public static CommandDefinition CreateCommand(
    string commandText, object parameters = null,
    IDbTransaction transaction = null,
    int? commandTimeout = null,
    CommandType? commandType = null,
    CommandFlags flags = CommandFlags.Buffered,
    CancellationToken cancellationToken = default)
        {
            //Here you can apply some custom code before the creation of the command definition
            return new CommandDefinition(
            commandText, parameters, transaction,
                commandTimeout ?? 5000,
                commandType, flags, cancellationToken);
        }
        public static async Task<DataSet> GetDataSetBySP(string spName, DynamicParameters parameters = null)
        {
            try
            {
                var connectionString = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("ConnectionStrings")["DefaultConnection"];



                DbConnection cnn = new SqlConnection(connectionString);
                cnn.Open();
                var storedprocedure = spName;

                //    param.Add("@userId", UserId);
                var list = await cnn.ExecuteReaderAsync(storedprocedure, parameters, commandType: CommandType.StoredProcedure);


                var dataset = ConvertDataReaderToDataSet(list);

                return dataset;
            }
            catch (Exception ex)
            {
                var sb = new StringBuilder();
                if (parameters != null)
                {
                    foreach (var name in parameters.ParameterNames)
                    {
                        var pValue = parameters.Get<dynamic>(name);
                        sb.AppendFormat("{0}={1}\n", name, pValue.ToString());
                    }
                }


                //FILE BASED
                //NLogHelper.WriteLog(new LogParameter() { Message = ex.Message, ActionDetails = $"GetDataSetBySP > spName = {spName} , params > {sb.ToString()}", ActionId = 1, ActionTime = DateTime.Now, FormName = "N/A", ModuleName = "DapperHelper.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, "Exception from GetDataSetBySP");
                return new DataSet();
            }


        }

        
        //public static async Task<DataSet> GetAppointmentDetails(string spName, DynamicParameters parameters)
        //{
        //    try
        //    {
        //        var connectionString = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("ConnectionStrings")["DefaultConnection"];



        //        DbConnection cnn = new SqlConnection(connectionString);
        //        cnn.Open();
        //        var storedprocedure = spName;

        //        //    param.Add("@userId", UserId);
        //        var list = await cnn.ExecuteReaderAsync(storedprocedure, parameters, commandType: CommandType.StoredProcedure);



        //        DataSet dataSet = new DataSet();

        //        // Load data into the DataSet
        //        dataSet.Load(list, LoadOption.OverwriteChanges, "Table");

        //        return dataSet;
        //        var dataset = ConvertDataReaderToDataSet(list);

        //        return dataset;
        //    }
        //    catch (Exception ex)
        //    {
        //        var sb = new StringBuilder();
        //        if (parameters != null)
        //        {
        //            foreach (var name in parameters.ParameterNames)
        //            {
        //                var pValue = parameters.Get<dynamic>(name);
        //                sb.AppendFormat("{0}={1}\n", name, pValue.ToString());
        //            }
        //        }


        //        //FILE BASED
        //        //NLogHelper.WriteLog(new LogParameter() { Message = ex.Message, ActionDetails = $"GetDataSetBySP > spName = {spName} , params > {sb.ToString()}", ActionId = 1, ActionTime = DateTime.Now, FormName = "N/A", ModuleName = "DapperHelper.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, "Exception from GetDataSetBySP");
        //        return new DataSet();
        //    }
        //}



        public static async Task<DataSet> GetAppointmentDetails(string SP, DynamicParameters parameters)
        {
            try
            {
                var connectionString = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("ConnectionStrings")["DefaultConnection"];
                DataSet dataset;

                using (var connection = new SqlConnection(connectionString))
                {

                    var list = await SqlMapper.ExecuteReaderAsync(connection, SP, parameters, commandType: CommandType.StoredProcedure);
                    dataset = ConvertDataReaderToDataSet(list);
                }

                return dataset;
            }
            catch (Exception ex)
            {
                var sb = new StringBuilder();

                if (parameters != null)
                {
                    foreach (var name in parameters.ParameterNames)
                    {
                        var pValue = parameters.Get<dynamic>(name);
                        sb.AppendFormat("{0}={1}\n", name, pValue.ToString());
                    }
                }

                //FILE BASED
                //NLogHelper.WriteLog(new LogParameter() { Message = ex.Message, ActionDetails = $"GetDataSetBySPWithParams > sql = {SP} , params > {sb.ToString()}", ActionId = 1, ActionTime = DateTime.Now, FormName = "N/A", ModuleName = "DapperHelper.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, "Exception from GetDataSetBySPWithParams");

                return new DataSet();

            }
        }


        public static async Task<DataSet> GetModuleAndForm(string SP, DynamicParameters parameters)
        {
            try
            {
                var connectionString = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("ConnectionStrings")["DefaultConnection"];
                DataSet dataset;

                using (var connection = new SqlConnection(connectionString))
                {

                    var list = await SqlMapper.ExecuteReaderAsync(connection, SP, parameters, commandType: CommandType.StoredProcedure);
                    dataset = ConvertDataReaderToDataSet(list);
                }

                return dataset;
            }
            catch (Exception ex)
            {
                var sb = new StringBuilder();

                if (parameters != null)
                {
                    foreach (var name in parameters.ParameterNames)
                    {
                        var pValue = parameters.Get<dynamic>(name);
                        sb.AppendFormat("{0}={1}\n", name, pValue.ToString());
                    }
                }

                //FILE BASED
                //NLogHelper.WriteLog(new LogParameter() { Message = ex.Message, ActionDetails = $"GetDataSetBySPWithParams > sql = {SP} , params > {sb.ToString()}", ActionId = 1, ActionTime = DateTime.Now, FormName = "N/A", ModuleName = "DapperHelper.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, "Exception from GetDataSetBySPWithParams");

                return new DataSet();

            }
        }
        public static DataSet ConvertDataReaderToDataSet(IDataReader data)
        {


            DataSet ds = new DataSet();
            try
            {

                int i = 0;
                while (!data.IsClosed)
                {
                    ds.Tables.Add("Table" + (i + 1));
                    ds.EnforceConstraints = false;
                    ds.Tables[i].Load(data);
                    i++;
                }
            }
            catch (Exception ex)
            {
                //FILE BASED
                //NLogHelper.WriteLog(new LogParameter() { Message = ex.Message, ActionDetails = $"ConvertDataReaderToDataSet > dataCount  = {data.FieldCount}", ActionId = 1, ActionTime = DateTime.Now, FormName = "N/A", ModuleName = "DapperHelper.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, "Exception from ConvertDataReaderToDataSet");


            }

            return ds;
        }
    }
}
