using HMIS.Persistence;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace HMIS.Infrastructure.Caching
{
    internal class ThreadStruct
    {
        public Dictionary<string, JArray> innerCache = new Dictionary<string, JArray>();
        public ReaderWriterLockSlim cacheLock = new ReaderWriterLockSlim();
        public Thread t = null;
    }
    public class CacheHelper
    {
        private static IMemoryCache _cacheService;

        private Dictionary<string, ThreadStruct> ta = new Dictionary<string, ThreadStruct>();
        private static CacheHelper cache = new CacheHelper();
        public static CacheHelper Instance
        {
            get
            {
                if (cache == null)
                {
                    cache = new CacheHelper();
                }
                return cache;
            }
        }

        public CacheHelper()
        {

            if (_cacheService == null)
            {
                _cacheService = new MemoryCache(new MemoryCacheOptions());

            }



            var cacheRefreshTime = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("Cache")["CacheRefreshTimeInterval"];

            //return;//for development //5 min = 300000 mili
            string cacheRefrestInterval = cacheRefreshTime == null ? "300000" : cacheRefreshTime;//"60000";  //60000 millisecond equivalent to minute - Set this value in config        



            ThreadStruct t = new ThreadStruct();
            t.t = new Thread(() =>
            {
                while (true)
                {
                    try
                    {
                        LoadCacheData(t);
                    }
                    catch
                    {

                    }
                    Thread.Sleep(Convert.ToInt32(cacheRefrestInterval));
                }
            });
            t.t.IsBackground = true;
            t.t.Start();
        }


        public Dictionary<string, JArray> ReadInMemoryCache(List<string> keys)
        {
            Dictionary<string, JArray> records = new Dictionary<string, JArray>();

            foreach (var item in keys)
            {
                JArray _record;
                _cacheService.TryGetValue<JArray>(item, out _record);


                if (_record != null)
                {
                    records.Add(item, _record);


                }
            }
            return records;
        }


        private void WriteInMemoryCache(string key, JArray value)
        {
            try
            {
                var cache = _cacheService.Get<JArray>(key);
                if (cache != null)
                {
                    //reset new cache

                    _cacheService.Remove(key);
                }

                _cacheService.Set<JArray>(key, value, DateTime.Now.AddHours(1));


            }
            catch (Exception ex)
            {


            }
        }


        private async void LoadCacheData(ThreadStruct t)
        {
            try
            {
                DataSet CacheDataSet = new DataSet();
                CacheDataSet = await DapperHelper.GetDataSetBySP("GetDataForCaching");     //Write this function to get data from Cache SP

                DataSet CacheInfo = new DataSet();

                DataTable CacheInfodt = new DataTable();


                CacheInfo = await DapperHelper.GetDataSetBySP("GetCacheTable");



                CacheInfodt = CacheInfo.Tables[0];



                for (int i = 0; i <= CacheInfodt.Rows.Count - 1; i++)
                {


                    if (CacheDataSet.Tables[i].Rows.Count > 0)
                    {
                        string tableName = CacheInfodt.Rows[i]["ObjectName"].ToString();

                        WriteInMemoryCache(tableName, JArray.Parse(JsonConvert.SerializeObject(CacheDataSet.Tables[i], Newtonsoft.Json.Formatting.Indented)));



                    }

                }
            }
            catch (Exception e)
            {
                //  ActivityLogger.Instance.SystemLog(LogLevel.Error, string.Format("Exception occurred in {0} ", System.Reflection.MethodBase.GetCurrentMethod().Name), ActionType.View.ToString(), "", "", "", this.GetType().FullName, string.Format("Exception: {0} | {1} | {2} ", e.Message, e.InnerException, e.StackTrace), 0, e);
            }
        }





    }
}
