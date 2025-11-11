using Dapper;
using HMIS.Infrastructure.ORM;
using HMIS.Infrastructure.Repository;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using HMIS.Core.Entities;
using Task = System.Threading.Tasks.Task;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using HMIS.Application.Implementations;
using HMIS.Infrastructure.Helpers;
using HMIS.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using HMIS.Application.DTOs.Registration;
using HMIS.Application.DTOs.AppointmentDTOs;
using SchAppointment = HMIS.Application.DTOs.AppointmentDTOs;
using HMIS.Application.DTOs.Clinical;
using System.Globalization;
using System.Linq.Dynamic.Core;
using System.Xml;
using System.Xml.Serialization;
using System.Configuration;
using HMIS.Core.Context;

namespace HMIS.Application.ServiceLogics
{
    public class EligibilityManager : IEligibilityManager
    {
        private readonly HMISDbContext _context;

        private readonly IConfiguration _configuration;
       
        public EligibilityManager(HMISDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public string ToXML(Object oObject)
        {
            XmlDocument xmlDoc = new XmlDocument();
            XmlSerializer xmlSerializer = new XmlSerializer(oObject.GetType());
            using (MemoryStream xmlStream = new MemoryStream())
            {
                xmlSerializer.Serialize(xmlStream, oObject);
                xmlStream.Position = 0;
                xmlDoc.Load(xmlStream);
                return xmlDoc.InnerXml;
            }
        }

        public async Task<(List<string> columnNames, List<object[]> columnValues)> InsertEligibilityLog(long appid)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@VisitId", appid, DbType.Int64);


                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("GetEligibilityDataByVisitId", param);

                if (ds.Tables[0].Rows.Count == 0)
                {
                    throw new Exception("No data found");
                }
                List<string> columnNames = new List<string>();
                foreach (DataColumn column in ds.Tables[0].Columns)
                {
                    columnNames.Add(column.ColumnName);
                }

                List<object[]> columnValues = new List<object[]>();
                foreach (DataRow row in ds.Tables[0].Rows)
                {
                    columnValues.Add(row.ItemArray);
                }

                return (columnNames, columnValues);
                //return ds;
            }
            catch (Exception ex)
            {
                //return new DataSet();
                return (new List<string>(), new List<object[]>());
            }

        }

        public async Task<(List<string> columnNames, List<object[]> columnValues)> Get270fileInfoByAppId(long appId)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@AppointmentId", appId, DbType.Int64);
                var ds = await DapperHelper.GetDataSetBySPWithParams("Get270InfoByAppId", param);

                if (ds.Tables[0].Rows.Count == 0)
                {
                    throw new Exception("No data found");
                }
                List<string> columnNames = new List<string>();
                foreach (DataColumn column in ds.Tables[0].Columns)
                {
                    columnNames.Add(column.ColumnName);
                }

                List<object[]> columnValues = new List<object[]>();
                foreach (DataRow row in ds.Tables[0].Rows)
                {
                    columnValues.Add(row.ItemArray);
                }

                return (columnNames, columnValues);
            }
            catch (Exception ex)
            {
                // Handle exception
                Console.WriteLine("An error occurred: " + ex.Message);
                return (new List<string>(), new List<object[]>());
            }
        }

        public void Gen270File(string subscriberName, string subsciberName2,string claimLicenseNo, string facilityEligInfo, string payerCode, string insuredNo,string ssnNo, string birthDate, long insertedRowId)
        {
            string isaSegment = $"ISA*00*          *00*          *ZZ*{claimLicenseNo}*ZZ*CMS*090427*1734*{insertedRowId}*|*00501*000000001*0*P*:~";

            string gsSegment = $"GS*HS*{ facilityEligInfo}*CMS*20090428*1425*0001*X*005010X279A1~";

            string stSegment = "ST*270*0001*005010X279A1~";

            string bhtSegment = "BHT*0022*13*TRANSACTION~";

            string hl1Segment = "HL*1**20*1~";

            string nm1Segment = "NM1*PR*2*PI*CMS~";

            string hl2Segment = "HL*2*1*21*1~";

            string nm2Segment = $"NM1*P5*2*PI*{payerCode}~";

            string hl3Segment = "HL*3*2*22*0~";

            string subscriberSegment = $"NM1*IL*1*{subscriberName}*{subsciberName2}****MI*{insuredNo}~";

            string refSegment = $"REF*IG*{ssnNo}*NQ*098765432109876543210987654321*EA*123456789012345678901234567890~";

            string dmgSegment = $"DMG*D8*{birthDate}*F~";

            string seSegment = "SE*11*0001~";

            string geSegment = "GE*1*0001~";

            string ieaSegment = "IEA*1*000000001~";

            string fileContent = isaSegment + Environment.NewLine +
                                 gsSegment + Environment.NewLine +
                                 stSegment + Environment.NewLine +
                                 bhtSegment + Environment.NewLine +
                                 hl1Segment + Environment.NewLine +
                                 nm1Segment + Environment.NewLine +
                                 hl2Segment + Environment.NewLine +
                                 nm2Segment + Environment.NewLine +
                                 hl3Segment + Environment.NewLine +
                                 subscriberSegment + Environment.NewLine +
                                 refSegment + Environment.NewLine +
                                 dmgSegment + Environment.NewLine +
                                 seSegment + Environment.NewLine +
                                 geSegment + Environment.NewLine +
                                 ieaSegment;

            string filePath = _configuration.GetValue<string>("Files:270FilePath");
            File.WriteAllText(filePath, fileContent);
        }

        public async Task<DataSet> GetEligibilityLogDetailsDB(long mrno)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@Mrno", mrno, DbType.Int64);

                DataSet ds = await DapperHelper.GetDataSetBySP("GetEligibilityLog",param);
                if (ds.Tables.Count == 0)
                {
                    throw new Exception("No data found");
                }

                return ds;
            }
            catch (Exception ex)
            {
                return new DataSet();
            }

        }
    }
}
