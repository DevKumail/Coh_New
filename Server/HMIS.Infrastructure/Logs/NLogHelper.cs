using Microsoft.Extensions.Configuration;
using NLog.Targets;
using NLog.Web;
using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Infrastructure.Logger
{
    public static class NLogHelper
    {



        private static NLog.Logger logger = NLogBuilder.ConfigureNLog("NLog.config").GetCurrentClassLogger();

        private static string _cnn;

        static NLogHelper()
        {
            var connection = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("ConnectionStrings")["DefaultConnection"];
            _cnn = connection;
        }
        //
        // Summary:
        //     Logs that contain the most detailed messages. These messages may contain sensitive
        //     application data. These messages are disabled by default and should never be
        //     enabled in a production environment.
        //  Trace = 0,
        //
        // Summary:
        //     Logs that are used for interactive investigation during development. These logs
        //     should primarily contain information useful for debugging and have no long-term
        //     value.
        // Debug = 1,
        //
        // Summary:
        //     Logs that track the general flow of the application. These logs should have long-term
        //     value.
        //  Information = 2,
        //
        // Summary:
        //     Logs that highlight an abnormal or unexpected event in the application flow,
        //     but do not otherwise cause the application execution to stop.
        // Warning = 3,
        //
        // Summary:
        //     Logs that highlight when the current flow of execution is stopped due to a failure.
        //     These should indicate a failure in the current activity, not an application-wide
        //     failure.
        // Error = 4,
        //
        // Summary:
        //     Logs that describe an unrecoverable application or system crash, or a catastrophic
        //     failure that requires immediate attention.
        //  Critical = 5,
        //
        // Summary:
        //     Not used for writing log messages. Specifies that a logging category should not
        //     write any messages.
        // None = 6
        public static NLog.LogLevel GetLogLevel()
        {
            short logLevel = 1;


            var config = new ConfigurationBuilder()
   .SetBasePath(Directory.GetCurrentDirectory())
   .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true).Build();
            //            LogManager.Configuration = new NLogLoggingConfiguration(config.GetSection("Logging"));




            IConfigurationSection level = config.GetSection("Logging:LogLevel:Default");

            switch (level.Value.ToLower())
            {
                case "trace":
                    logLevel = 0;

                    GlobalDiagnosticsContext.Set("loglevel", "trace");

                    break;

                case "debug":
                    GlobalDiagnosticsContext.Set("loglevel", "debug");

                    logLevel = 1;

                    break;

                case "information":
                    GlobalDiagnosticsContext.Set("loglevel", "info");

                    logLevel = 2;
                    break;

                case "warning":
                    GlobalDiagnosticsContext.Set("loglevel", "warn");

                    logLevel = 3;
                    break;


                case "error":
                    GlobalDiagnosticsContext.Set("loglevel", "error");

                    logLevel = 4;
                    break;

                case "critical":
                    GlobalDiagnosticsContext.Set("loglevel", "critical");

                    logLevel = 5;
                    break;

                case "none":
                    GlobalDiagnosticsContext.Set("loglevel", "none");

                    logLevel = 6;
                    break;
            }
            return NLog.LogLevel.FromOrdinal(logLevel);

            // return  Enum.Parse(Microsoft.Extensions.Logging.LogLevel, level.Value.ToString());

        }

        public static void WriteLogBySP(string commandText, List<DatabaseParameterInfo> parameters, short logLevel)
        {
            try
            {
                DatabaseTarget target = new DatabaseTarget();



                target.ConnectionString = _cnn;

                target.CommandText = commandText;



                NLog.Config.SimpleConfigurator.ConfigureForTargetLogging(target, GetLogLevel());




                LogManager.ReconfigExistingLoggers();

                LogByLevel(logLevel, "");

            }
            catch (Exception ex)
            {

                throw;
            }



            //target.DBProvider = "mssql";
            //target.DBHost = ".";
            //target.DBUserName = "nloguser";
            //target.DBPassword = "pass";
            //target.DBDatabase = "databasename";

            //param = new DatabaseParameterInfo();
            // param.Name = "@time_stamp";
            // param.Layout = "${date}";
            // target.Parameters.Add(param);

            //if (parameters.Count > 0)
            //{
            //    foreach (var item in parameters)
            //    {
            //        target.Parameters.Add(item);
            //    }
            //}



        }

        public static void LogByLevel(short logLevel, string text)
        {
            switch ((Microsoft.Extensions.Logging.LogLevel)logLevel)
            {
                case Microsoft.Extensions.Logging.LogLevel.Trace:
                    logger.Log(NLog.LogLevel.Trace, text);
                    break;
                case Microsoft.Extensions.Logging.LogLevel.Debug:
                    logger.Log(NLog.LogLevel.Debug, text);
                    break;
                case Microsoft.Extensions.Logging.LogLevel.Information:
                    logger.Log(NLog.LogLevel.Info, text);
                    break;
                case Microsoft.Extensions.Logging.LogLevel.Warning:
                    logger.Log(NLog.LogLevel.Warn, text);
                    break;
                case Microsoft.Extensions.Logging.LogLevel.Error:
                    logger.Log(NLog.LogLevel.Error, text);
                    break;
                case Microsoft.Extensions.Logging.LogLevel.Critical:
                    logger.Log(NLog.LogLevel.Fatal, text);
                    break;

                default:
                    break;
            }
        }
        public static void WriteLog(LogParameter param, short logLevel, string text, bool isDBLevelLogging = false)
        {


            GlobalDiagnosticsContext.Set("nLogConnectionstring", _cnn);


            try
            {




                if (isDBLevelLogging)
                {


                    GlobalDiagnosticsContext.Set("AllowDBWrite", true);


                    GlobalDiagnosticsContext.Set("ActionId", param?.ActionId);

                    GlobalDiagnosticsContext.Set("UserLoginHistoryId", param?.UserLoginHistoryId);

                    GlobalDiagnosticsContext.Set("ActionTime", DateTime.Now);
                    GlobalDiagnosticsContext.Set("UserName", param?.UserName);
                    GlobalDiagnosticsContext.Set("ModuleName", param?.ModuleName);
                    GlobalDiagnosticsContext.Set("FormName", param?.FormName);
                    GlobalDiagnosticsContext.Set("ActionDetails", param?.ActionDetails);
                    GlobalDiagnosticsContext.Set("TablesReadOrModified", param?.TablesReadOrModified);

                    GlobalDiagnosticsContext.Set("MRNo", param?.MRNo);

                    GlobalDiagnosticsContext.Set("MachineIP", param?.MachineIP);

                    var target = (DatabaseTarget)LogManager.Configuration.FindTargetByName("database");

                    var config = LogManager.Configuration;
                    config.LoggingRules[0].Targets.Clear();
                    config.LoggingRules[0].Targets.Add(target);

                    //apply 
                    LogManager.Configuration = config;

                    LogManager.ReconfigExistingLoggers();




                }

                else
                {


                    GlobalDiagnosticsContext.Set("AllowDBWrite", false);




                    GlobalDiagnosticsContext.Set("ActionId", param?.ActionId);

                    GlobalDiagnosticsContext.Set("UserLoginHistoryId", param?.UserLoginHistoryId);




                    GlobalDiagnosticsContext.Set("ActionTime", DateTime.Now);
                    GlobalDiagnosticsContext.Set("UserName", param?.UserName);
                    GlobalDiagnosticsContext.Set("ModuleName", param?.ModuleName);
                    GlobalDiagnosticsContext.Set("Method", param?.FormName);
                    GlobalDiagnosticsContext.Set("Message", text);

                    GlobalDiagnosticsContext.Set("ActionDetails", param?.ActionDetails);
                    GlobalDiagnosticsContext.Set("TablesReadOrModified", param?.TablesReadOrModified);



                    GlobalDiagnosticsContext.Set("MRNo", null);

                    GlobalDiagnosticsContext.Set("MachineIP", null);

                    var target = (FileTarget)LogManager.Configuration.FindTargetByName("file");

                    var config = LogManager.Configuration;


                    config.LoggingRules[0].Targets.Clear();
                    config.LoggingRules[0].Targets.Add(target);

                    //apply 
                    LogManager.Configuration = config;

                    LogManager.ReconfigExistingLoggers();
                }
                LogByLevel(logLevel, text);

            }
            catch (Exception)
            {

                throw;
            }
        }

    }
}

