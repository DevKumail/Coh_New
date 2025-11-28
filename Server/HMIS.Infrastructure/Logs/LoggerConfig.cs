using Microsoft.Extensions.Configuration;
using Serilog.Core;
using Serilog.Events;
using Serilog.Formatting.Compact;
using Serilog;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS
{
    public class LoggerConfig
    {

        public static Logger CreateLogger(string requestMessage, string responseMessage, IConfiguration configuration)
        {
            var loggerConfiguration = new LoggerConfiguration()
                                     .MinimumLevel.Verbose()
                                     .WriteTo.Console(new RenderedCompactJsonFormatter())
                                     .WriteTo.Seq(configuration["SeqUrl"]) // Read Seq URL from appsettings.json
                                     .Enrich.WithMachineName()
                                     .Enrich.WithProperty("Application", "HMIS.Web")
                                     .Enrich.FromLogContext()
                                     .Enrich.With(new RequestMessageEnricher(requestMessage))
                                     .Enrich.With(new ResponseMessageEnricher(responseMessage));

            return loggerConfiguration.CreateLogger();
        }
    }
    public class RequestMessageEnricher : ILogEventEnricher
    {
        private readonly string _requestMessage;

        public RequestMessageEnricher(string requestMessage)
        {
            _requestMessage = requestMessage;
        }

        public void Enrich(LogEvent logEvent, ILogEventPropertyFactory propertyFactory)
        {
            logEvent.AddPropertyIfAbsent(propertyFactory.CreateProperty("RequestMessage", _requestMessage));
        }
    }
    public class ResponseMessageEnricher : ILogEventEnricher
    {
        private readonly string _responseMessage;

        public ResponseMessageEnricher(string responseMessage)
        {
            _responseMessage = responseMessage;
        }

        public void Enrich(LogEvent logEvent, ILogEventPropertyFactory propertyFactory)
        {
            logEvent.AddPropertyIfAbsent(propertyFactory.CreateProperty("ResponseMessage", _responseMessage));
        }
    }
    public class TimerElapsed
    {
        private Stopwatch stopwatch;

        public void StartTimer()
        {
            stopwatch = Stopwatch.StartNew();
        }

        public double StopTimer()
        {
            stopwatch.Stop();
            return stopwatch.Elapsed.TotalMilliseconds;
        }
    }
}
