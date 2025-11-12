
using Dapper;
using DocumentFormat.OpenXml.Wordprocessing;
using HMIS.Application.DTOs.Clinical;
using HMIS.Application.Implementations;
using HMIS.Core.Entities;
using HMIS.Infrastructure.ORM;
using HMIS.Service.DTOs;
using HMIS.Service.Implementations;
using Microsoft.Extensions.Configuration;
using System.Data;
using AutoMapper;
using Newtonsoft.Json;
using System.Data;
using System.Data.SqlClient;
using Microsoft.Data.SqlClient;
using HMIS.Core.Context;


namespace HMIS.Service.ServiceLogics
{
    public class EMRNotesManager : IEMRNotesManager
    {
        public IConfiguration Configuration { get; }
        private readonly HMISDbContext _context;
        private readonly IMapper _mapper;


        public EMRNotesManager(HMISDbContext context, IConfiguration configuration, IMapper mapper)
        {
            _context = context;
            Configuration = configuration;
            _mapper = mapper;
        }


        public EMRNotesModel GetNoteQuestionBYPathId(int pathId)
        {
            try
            {

                // pathId = 158;

                var dataSet = new DataSet();
                var connectionString = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("ConnectionStrings")["DefaultConnection"];

                List<EMRNotesQuestionModel> questions = new List<EMRNotesQuestionModel>();
                EMRNotesModel eMRNotesModel = new EMRNotesModel();
                using (var connection = new SqlConnection(connectionString))
                {
                    using (var command = new SqlCommand("EMRNotesEncounterPath_GetAllQuestions", connection))
                    {

                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@PathId", pathId);
                        command.Parameters.AddWithValue("@AllQuestions", false);
                        command.Parameters.AddWithValue("@Quest_Type", DBNull.Value); // Null parameter

                        using (var adapter = new SqlDataAdapter(command))
                        {
                            //var dataSet = new DataSet();
                            connection.OpenAsync();
                            Console.WriteLine(command.CommandText);
                            adapter.Fill(dataSet);
                            Console.WriteLine("After Fill(): Rows retrieved = " + dataSet.Tables[0].Rows.Count);

                            if (dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
                            {
                                var NoteName = "";
                                foreach (DataRow row in dataSet.Tables[0].Rows)
                                {
                                    var model = new EMRNotesQuestionModel();
                                    NoteName = row["NoteName"]?.ToString();
                                    model.Quest_Id = Convert.ToInt64(row["Quest_Id"]);
                                    model.Quest_Title = row["Quest_Title"]?.ToString();
                                    var Type = Convert.ToInt32(row["Quest_Type"]);

                                    if (Type == 0)
                                    {
                                        model.Type = "TextBox";
                                    }
                                    else if (Type == 3)
                                    {
                                        model.Type = "CheckBox";
                                    }
                                    else if (Type == 4)
                                    {
                                        model.Type = "Question Section";
                                    }

                                    //model.Quest_Desription = row["Quest_Desription"]?.ToString();
                                    //model.Ans_Size = row["Ans_Size"] != DBNull.Value ? Convert.ToInt32(row["Ans_Size"]) : (int?)null;
                                    //model.Quest_Table = row["Quest_Table"]?.ToString();
                                    model.Parent_Id = Convert.ToInt64(row["Parent_Id"]);
                                    model.Answer = "";
                                    //model.Validation_Type = row["Validation_Type"] != DBNull.Value ? Convert.ToInt32(row["Validation_Type"]) : (int?)null;
                                    //model.Quest_Order = row["Quest_Order"] != DBNull.Value ? Convert.ToInt32(row["Quest_Order"]) : (int?)null;
                                    //model.prefix = row["prefix"]?.ToString();
                                    //model.postfix = row["postfix"]?.ToString();
                                    //model.negativePrefix = row["negativePrefix"]?.ToString();
                                    //model.negativePostfix = row["negativepostfix"]?.ToString();
                                    //model.Inactive = row["Inactive"] != DBNull.Value ? Convert.ToBoolean(row["Inactive"]) : (bool?)null;
                                    //model.ImageId = row["ImageId"] != DBNull.Value ? (Guid?)Guid.Parse(row["ImageId"].ToString()) : null;
                                    //model.WeqayaId = row["WeqayaId"] != DBNull.Value ? Convert.ToInt64(row["WeqayaId"]) : (long?)null;
                                    //model.Path_Id = row["Path_Id"] != DBNull.Value ? Convert.ToInt32(row["Path_Id"]) : (int?)null;
                                    //model.PathQuestionId = Convert.ToInt32(row["PathQuestionId"]);
                                    //model.Active = Convert.ToBoolean(row["Active"]);


                                    //model.HeadingLinked = row["HeadingLinked"] != DBNull.Value ? Convert.ToBoolean(row["HeadingLinked"]) : (bool?)null;


                                    // model.QuestOrder_Template = Convert.ToInt32(row["QuestOrder_Template"]);


                                    questions.Add(model);
                                }


                                questions = BuildHierarchy(questions); // Root records have Parent_Id = null

                                var noteModel = new List<NoteModel>();
                                noteModel = _mapper.Map<List<NoteModel>>(questions);
                                eMRNotesModel.NoteTitle = NoteName;
                                eMRNotesModel.Questions = noteModel;
                                // Convert to JSON:

                                
                                string json = JsonConvert.SerializeObject(eMRNotesModel, Formatting.Indented);
                                Console.WriteLine(json);










                            }
                        }
                    }
                }

                return eMRNotesModel;

            }
            catch (Exception ex)
            {

                return null;
            }

        }


        public nodeModel GetNoteQuestionBYNoteId(int pathId, string? voiceText)
        {
            try
            {

                // pathId = 158;
                nodeModel nodeModel = new nodeModel();
                var dataSet = new DataSet();
                var connectionString = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("ConnectionStrings")["DefaultConnection"];

                List<EMRNotesQuestionModel> questions = new List<EMRNotesQuestionModel>();
                EMRNotesModel eMRNotesModel = new EMRNotesModel();
                using (var connection = new SqlConnection(connectionString))
                {
                    using (var command = new SqlCommand("EMRNotesEncounterPath_GetAllQuestions", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@PathId", pathId);
                        command.Parameters.AddWithValue("@AllQuestions", false);
                        command.Parameters.AddWithValue("@Quest_Type", DBNull.Value); // Null parameter

                        using (var adapter = new SqlDataAdapter(command))
                        {
                            //var dataSet = new DataSet();
                            connection.OpenAsync();
                            adapter.Fill(dataSet);

                            if (dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
                            {
                                var NoteName = "";
                                foreach (DataRow row in dataSet.Tables[0].Rows)
                                {
                                    var model = new EMRNotesQuestionModel();
                                    NoteName = row["NoteName"]?.ToString();
                                    model.Quest_Id = Convert.ToInt64(row["Quest_Id"]);
                                    model.Quest_Title = row["Quest_Title"]?.ToString();
                                    var Type = Convert.ToInt32(row["Quest_Type"]);

                                    if (Type == 0)
                                    {
                                        model.Type = "TextBox";
                                    }
                                    else if (Type == 3)
                                    {
                                        model.Type = "CheckBox";
                                    }
                                    else if (Type == 4)
                                    {
                                        model.Type = "Question Section";
                                    }

                                    //model.Quest_Desription = row["Quest_Desription"]?.ToString();
                                    //model.Ans_Size = row["Ans_Size"] != DBNull.Value ? Convert.ToInt32(row["Ans_Size"]) : (int?)null;
                                    //model.Quest_Table = row["Quest_Table"]?.ToString();
                                    model.Parent_Id = Convert.ToInt64(row["Parent_Id"]);
                                    //model.Validation_Type = row["Validation_Type"] != DBNull.Value ? Convert.ToInt32(row["Validation_Type"]) : (int?)null;
                                    //model.Quest_Order = row["Quest_Order"] != DBNull.Value ? Convert.ToInt32(row["Quest_Order"]) : (int?)null;
                                    //model.prefix = row["prefix"]?.ToString();
                                    //model.postfix = row["postfix"]?.ToString();
                                    //model.negativePrefix = row["negativePrefix"]?.ToString();
                                    //model.negativePostfix = row["negativepostfix"]?.ToString();
                                    //model.Inactive = row["Inactive"] != DBNull.Value ? Convert.ToBoolean(row["Inactive"]) : (bool?)null;
                                    //model.ImageId = row["ImageId"] != DBNull.Value ? (Guid?)Guid.Parse(row["ImageId"].ToString()) : null;
                                    //model.WeqayaId = row["WeqayaId"] != DBNull.Value ? Convert.ToInt64(row["WeqayaId"]) : (long?)null;
                                    //model.Path_Id = row["Path_Id"] != DBNull.Value ? Convert.ToInt32(row["Path_Id"]) : (int?)null;
                                    //model.PathQuestionId = Convert.ToInt32(row["PathQuestionId"]);
                                    //model.Active = Convert.ToBoolean(row["Active"]);


                                    //model.HeadingLinked = row["HeadingLinked"] != DBNull.Value ? Convert.ToBoolean(row["HeadingLinked"]) : (bool?)null;


                                    // model.QuestOrder_Template = Convert.ToInt32(row["QuestOrder_Template"]);


                                    questions.Add(model);
                                }


                                questions = BuildHierarchy(questions); // Root records have Parent_Id = null

                                var noteModel = new List<NoteModel>();
                                noteModel = _mapper.Map<List<NoteModel>>(questions);
                                eMRNotesModel.NoteTitle = NoteName;
                                eMRNotesModel.Questions = noteModel;
                                //eMRNotesModel.conversation = voiceText;

                                // Convert to JSON:

                                nodeModel.node = eMRNotesModel;
                                nodeModel.conversation = voiceText;
                                string json = JsonConvert.SerializeObject(nodeModel, Formatting.Indented);
                                Console.WriteLine(json);










                            }
                        }
                    }
                }

                return nodeModel;

            }
            catch (Exception ex)
            {

                return null;
            }

        }

        public static List<EMRNotesQuestionModel> BuildHierarchy(List<EMRNotesQuestionModel> questions)
        {
            var allIds = questions.Select(q => q.Quest_Id).ToHashSet();
            var rootItems = questions.Where(q => !allIds.Contains(q.Parent_Id)).ToList();

            var hierarchy = rootItems
                .Select(root => BuildHierarchyRecursive(questions, root))
                .ToList();

            return hierarchy;
        }

        private static EMRNotesQuestionModel BuildHierarchyRecursive(List<EMRNotesQuestionModel> all, EMRNotesQuestionModel current)
        {
            var children = all
                .Where(q => q.Parent_Id == current.Quest_Id)
                //.OrderBy(q => q.QuestOrder_Template)
                .Select(child => BuildHierarchyRecursive(all, child))
                .ToList();

            current.Children = children;
            return current;
        }



        public List<ProvierEMRNotesModel> EMRNotesGetByEmpId(long EmpId)
        {
            try
            {
                var dataSet = new DataSet();
                var connectionString = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("ConnectionStrings")["DefaultConnection"];

                List<ProvierEMRNotesModel> questions = new List<ProvierEMRNotesModel>();
              
                using (var connection = new SqlConnection(connectionString))
                {
                    using (var command = new SqlCommand("EMRNotesEM_GetByEmpId", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@EmpId", EmpId);
                       

                        using (var adapter = new SqlDataAdapter(command))
                        {
                            //var dataSet = new DataSet();
                            connection.OpenAsync();
                            adapter.Fill(dataSet);

                            if (dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
                            {
                                var NoteName = "";
                                foreach (DataRow row in dataSet.Tables[0].Rows)
                                {
                                    var model = new ProvierEMRNotesModel();
                                  
                                    model.PathId = Convert.ToInt32(row["PathId"]);
                                    model.PathName = row["PathName"]?.ToString();


                                    model.PathDescription = row["PathDescription"]?.ToString();
                                    model.TemplateType = row["TemplateType"]?.ToString();
                                    model.TemplateText = row["TemplateText"]?.ToString();
                                    model.Category = row["Category"]?.ToString();
                                    model.TemplateHTML = row["TemplateHTML"]?.ToString();
                                    model.NewFormatting = row["NewFormatting"]?.ToString();
                                   


                                    questions.Add(model);
                                }
                            }
                        }
                    }
                }

                return questions;

            }
            catch (Exception ex)
            {

                return null;
            }

        }


    }
}
