using HMIS.Application.DTOs;
using HMIS.Application.Implementations;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace HMIS.Application.ServiceLogics
{
    public class LocalizationSpService : ILocalizationSpService
    {
        public IConfiguration Configuration { get; }

        private readonly string _i18nFolder;


        public LocalizationSpService(IConfiguration configuration)
        {
            Configuration = configuration;
            _i18nFolder = Path.Combine("C:\\Logs", "assets", "i18n");
            //_i18nFolder = Path.Combine(settings.UiFolderPath, "assets", "i18n");

            if (!Directory.Exists(_i18nFolder))
            {
                Directory.CreateDirectory(_i18nFolder);
            }
        }

        public string GenerateLocalizationFiles()
        {
            try
            {
                var records = new List<TranslationRecord>();
                string connectionString = Configuration.GetConnectionString("DefaultConnection");
                using (var con = new SqlConnection(connectionString))
                using (var cmd = new SqlCommand("GetTranslations", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    con.Open();

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            records.Add(new TranslationRecord
                            {
                                Key = reader["Key"].ToString(),
                                LanguageId = Convert.ToInt32(reader["LanguageId"]),
                                Title = reader["Title"].ToString()
                            });
                        }
                    }
                }

                // Group by Language
                var grouped = records.GroupBy(r => r.LanguageId);

                foreach (var group in grouped)
                {
                    var dict = group.ToDictionary(
                        r => r.Key.ToUpper(),
                        r => r.Title
                    );

                    string fileName = group.Key == 1 ? "en.json" : "ar.json";

                    File.WriteAllText(Path.Combine(_i18nFolder, fileName),
                        JsonSerializer.Serialize(dict, new JsonSerializerOptions { WriteIndented = true }));
                }
                return "Created";
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }

        }
    }

}
