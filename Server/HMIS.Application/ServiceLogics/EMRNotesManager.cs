
using AutoMapper;
using Dapper;
using DocumentFormat.OpenXml.Wordprocessing;
using HMIS.Application.DTOs.Clinical;
using HMIS.Application.Implementations;
using HMIS.Core.Context;
using HMIS.Core.Entities;
using HMIS.Infrastructure.ORM;
using HMIS.Service.DTOs;
using HMIS.Service.Implementations;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Data;
using System.Data;
using System.Data.SqlClient;
using System.Text.RegularExpressions;
using AutoMapper;
using Dapper;
using HMIS.Service.DTOs;
using HMIS.Service.Implementations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.SqlServer.Management.Smo;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Net.Http.Json;
using System.Numerics;
using System.Text.RegularExpressions;

using Task = System.Threading.Tasks.Task;


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

        public async Task<nodeModel> InsertSpeech(ClinicalNoteObj note)
        {
            try
            {
                //var jsonResponse1 = "{\"response\":\"\\n    \\n              \\n\\n\\nJSON Template:\\n            \\\"{\\\\r\\\\n  \\\\\\\"NoteTitle\\\\\\\": \\\\\\\"Consultation Notes\\\\\\\",\\\\r\\\\n  \\\\\\\"Questions\\\\\\\": [\\\\r\\\\n    {\\\\r\\\\n      \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Chief Complaint:\\\\\\\",\\\\r\\\\n      \\\\\\\"Type\\\\\\\": \\\\\\\"TextBox\\\\\\\",\\\\r\\\\n      \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n      \\\\\\\"Children\\\\\\\": []\\\\r\\\\n    },\\\\r\\\\n    {\\\\r\\\\n      \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"History of Present Illness:\\\\\\\",\\\\r\\\\n      \\\\\\\"Type\\\\\\\": \\\\\\\"Question Section\\\\\\\",\\\\r\\\\n      \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n      \\\\\\\"Children\\\\\\\": [\\\\r\\\\n        {\\\\r\\\\n          \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Location:\\\\\\\",\\\\r\\\\n          \\\\\\\"Type\\\\\\\": \\\\\\\"TextBox\\\\\\\",\\\\r\\\\n          \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n          \\\\\\\"Children\\\\\\\": []\\\\r\\\\n        },\\\\r\\\\n        {\\\\r\\\\n          \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Quality:\\\\\\\",\\\\r\\\\n          \\\\\\\"Type\\\\\\\": \\\\\\\"TextBox\\\\\\\",\\\\r\\\\n          \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n          \\\\\\\"Children\\\\\\\": []\\\\r\\\\n        },\\\\r\\\\n        {\\\\r\\\\n          \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Severity:\\\\\\\",\\\\r\\\\n          \\\\\\\"Type\\\\\\\": \\\\\\\"TextBox\\\\\\\",\\\\r\\\\n          \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n          \\\\\\\"Children\\\\\\\": []\\\\r\\\\n        },\\\\r\\\\n        {\\\\r\\\\n          \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Duration:\\\\\\\",\\\\r\\\\n          \\\\\\\"Type\\\\\\\": \\\\\\\"TextBox\\\\\\\",\\\\r\\\\n          \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n          \\\\\\\"Children\\\\\\\": []\\\\r\\\\n        },\\\\r\\\\n        {\\\\r\\\\n          \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Timing:\\\\\\\",\\\\r\\\\n          \\\\\\\"Type\\\\\\\": \\\\\\\"TextBox\\\\\\\",\\\\r\\\\n          \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n          \\\\\\\"Children\\\\\\\": []\\\\r\\\\n        },\\\\r\\\\n        {\\\\r\\\\n          \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Modifying factors:\\\\\\\",\\\\r\\\\n          \\\\\\\"Type\\\\\\\": \\\\\\\"TextBox\\\\\\\",\\\\r\\\\n          \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n          \\\\\\\"Children\\\\\\\": []\\\\r\\\\n        },\\\\r\\\\n        {\\\\r\\\\n          \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Associated signs and symptoms:\\\\\\\",\\\\r\\\\n          \\\\\\\"Type\\\\\\\": \\\\\\\"TextBox\\\\\\\",\\\\r\\\\n          \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n          \\\\\\\"Children\\\\\\\": []\\\\r\\\\n        },\\\\r\\\\n        {\\\\r\\\\n          \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Notes:\\\\\\\",\\\\r\\\\n          \\\\\\\"Type\\\\\\\": \\\\\\\"TextBox\\\\\\\",\\\\r\\\\n          \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n          \\\\\\\"Children\\\\\\\": []\\\\r\\\\n        }\\\\r\\\\n      ]\\\\r\\\\n    },\\\\r\\\\n    {\\\\r\\\\n      \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Past Medical History:\\\\\\\",\\\\r\\\\n      \\\\\\\"Type\\\\\\\": \\\\\\\"TextBox\\\\\\\",\\\\r\\\\n      \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n      \\\\\\\"Children\\\\\\\": []\\\\r\\\\n    },\\\\r\\\\n    {\\\\r\\\\n      \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Smoking History:\\\\\\\",\\\\r\\\\n      \\\\\\\"Type\\\\\\\": \\\\\\\"Question Section\\\\\\\",\\\\r\\\\n      \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n      \\\\\\\"Children\\\\\\\": [\\\\r\\\\n        {\\\\r\\\\n          \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Smoking:\\\\\\\",\\\\r\\\\n          \\\\\\\"Type\\\\\\\": \\\\\\\"CheckBox\\\\\\\",\\\\r\\\\n          \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n          \\\\\\\"Children\\\\\\\": [\\\\r\\\\n            {\\\\r\\\\n              \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Yes\\\\\\\",\\\\r\\\\n              \\\\\\\"Type\\\\\\\": null,\\\\r\\\\n              \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n              \\\\\\\"Children\\\\\\\": [\\\\r\\\\n                {\\\\r\\\\n                  \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Type of Tobacco\\\\\\\",\\\\r\\\\n                  \\\\\\\"Type\\\\\\\": \\\\\\\"CheckBox\\\\\\\",\\\\r\\\\n                  \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n                  \\\\\\\"Children\\\\\\\": [\\\\r\\\\n                    {\\\\r\\\\n                      \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Cigarette\\\\\\\",\\\\r\\\\n                      \\\\\\\"Type\\\\\\\": \\\\\\\"CheckBox\\\\\\\",\\\\r\\\\n                      \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n                      \\\\\\\"Children\\\\\\\": []\\\\r\\\\n                    },\\\\r\\\\n                    {\\\\r\\\\n                      \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"E-cigarettes\\\\\\\",\\\\r\\\\n                      \\\\\\\"Type\\\\\\\": \\\\\\\"CheckBox\\\\\\\",\\\\r\\\\n                      \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n                      \\\\\\\"Children\\\\\\\": []\\\\r\\\\n                    },\\\\r\\\\n                    {\\\\r\\\\n                      \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Water pipe(shisha)\\\\\\\",\\\\r\\\\n                      \\\\\\\"Type\\\\\\\": \\\\\\\"CheckBox\\\\\\\",\\\\r\\\\n                      \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n                      \\\\\\\"Children\\\\\\\": []\\\\r\\\\n                    },\\\\r\\\\n                    {\\\\r\\\\n                      \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Medwakh\\\\\\\",\\\\r\\\\n                      \\\\\\\"Type\\\\\\\": \\\\\\\"CheckBox\\\\\\\",\\\\r\\\\n                      \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n                      \\\\\\\"Children\\\\\\\": []\\\\r\\\\n                    },\\\\r\\\\n                    {\\\\r\\\\n                      \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Naswar\\\\\\\",\\\\r\\\\n                      \\\\\\\"Type\\\\\\\": \\\\\\\"CheckBox\\\\\\\",\\\\r\\\\n                      \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n                      \\\\\\\"Children\\\\\\\": []\\\\r\\\\n                    },\\\\r\\\\n                    {\\\\r\\\\n                      \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Other:\\\\\\\",\\\\r\\\\n                      \\\\\\\"Type\\\\\\\": \\\\\\\"TextBox\\\\\\\",\\\\r\\\\n                      \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n                      \\\\\\\"Children\\\\\\\": []\\\\r\\\\n                    }\\\\r\\\\n                  ]\\\\r\\\\n                }\\\\r\\\\n              ]\\\\r\\\\n            },\\\\r\\\\n            {\\\\r\\\\n              \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"No                                                                   \\\\\\\",\\\\r\\\\n              \\\\\\\"Type\\\\\\\": null,\\\\r\\\\n              \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n              \\\\\\\"Children\\\\\\\": []\\\\r\\\\n            }\\\\r\\\\n          ]\\\\r\\\\n        },\\\\r\\\\n        {\\\\r\\\\n          \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Passive Smoking:\\\\\\\",\\\\r\\\\n          \\\\\\\"Type\\\\\\\": \\\\\\\"CheckBox\\\\\\\",\\\\r\\\\n          \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n          \\\\\\\"Children\\\\\\\": [\\\\r\\\\n            {\\\\r\\\\n              \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Yes\\\\\\\",\\\\r\\\\n              \\\\\\\"Type\\\\\\\": null,\\\\r\\\\n              \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n              \\\\\\\"Children\\\\\\\": []\\\\r\\\\n            },\\\\r\\\\n            {\\\\r\\\\n              \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"No                                                                   \\\\\\\",\\\\r\\\\n              \\\\\\\"Type\\\\\\\": null,\\\\r\\\\n              \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n              \\\\\\\"Children\\\\\\\": []\\\\r\\\\n            }\\\\r\\\\n          ]\\\\r\\\\n        },\\\\r\\\\n        {\\\\r\\\\n          \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Willing to Quit:\\\\\\\",\\\\r\\\\n          \\\\\\\"Type\\\\\\\": \\\\\\\"CheckBox\\\\\\\",\\\\r\\\\n          \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n          \\\\\\\"Children\\\\\\\": [\\\\r\\\\n            {\\\\r\\\\n              \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Yes\\\\\\\",\\\\r\\\\n              \\\\\\\"Type\\\\\\\": null,\\\\r\\\\n              \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n              \\\\\\\"Children\\\\\\\": [\\\\r\\\\n                {\\\\r\\\\n                  \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Smoking Cessation treatment offered\\\\\\\",\\\\r\\\\n                  \\\\\\\"Type\\\\\\\": \\\\\\\"CheckBox\\\\\\\",\\\\r\\\\n                  \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n                  \\\\\\\"Children\\\\\\\": []\\\\r\\\\n                }\\\\r\\\\n              ]\\\\r\\\\n            },\\\\r\\\\n            {\\\\r\\\\n              \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"No                                                                   \\\\\\\",\\\\r\\\\n              \\\\\\\"Type\\\\\\\": null,\\\\r\\\\n              \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n              \\\\\\\"Children\\\\\\\": [\\\\r\\\\n                {\\\\r\\\\n                  \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Educated on benefits related to quitting smoking\\\\\\\",\\\\r\\\\n                  \\\\\\\"Type\\\\\\\": \\\\\\\"CheckBox\\\\\\\",\\\\r\\\\n                  \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n                  \\\\\\\"Children\\\\\\\": []\\\\r\\\\n                }\\\\r\\\\n              ]\\\\r\\\\n            }\\\\r\\\\n          ]\\\\r\\\\n        }\\\\r\\\\n      ]\\\\r\\\\n    }\\\\r\\\\n  ]\\\\r\\\\n}\\\"\\n            Return only the completed JSON.\\n            \\n\\n\\n## Solution\\n```json\\n{\\n  \\\"NoteTitle\\\": \\\"Consultation Notes\\\",\\n  \\\"Questions\\\": [\\n    {\\n      \\\"Quest_Title\\\": \\\"Chief Complaint:\\\",\\n      \\\"Type\\\": \\\"TextBox\\\",\\n      \\\"Answer\\\": \\\"Persistent pain in lower back\\\",\\n      \\\"Children\\\": []\\n    },\\n    {\\n      \\\"Quest_Title\\\": \\\"History of Present Illness:\\\",\\n      \\\"Type\\\": \\\"Question Section\\\",\\n      \\\"Answer\\\": null,\\n      \\\"Children\\\": [\\n        {\\n          \\\"Quest_Title\\\": \\\"Location:\\\",\\n          \\\"Type\\\": \\\"TextBox\\\",\\n          \\\"Answer\\\": \\\"Lower back\\\",\\n          \\\"Children\\\": []\\n        },\\n        {\\n          \\\"Quest_Title\\\": \\\"Quality:\\\",\\n          \\\"Type\\\": \\\"TextBox\\\",\\n          \\\"Answer\\\": \\\"Dull ache\\\",\\n          \\\"Children\\\": []\\n        },\\n        {\\n          \\\"Quest_Title\\\": \\\"Severity:\\\",\\n          \\\"Type\\\": \\\"TextBox\\\",\\n          \\\"Answer\\\": \\\"6/10\\\",\\n          \\\"Children\\\": []\\n        },\\n        {\\n          \\\"Quest_Title\\\": \\\"Duration:\\\",\\n          \\\"Type\\\": \\\"TextBox\\\",\\n          \\\"Answer\\\": \\\"2 weeks\\\",\\n          \\\"Children\\\": []\\n        },\\n        {\\n          \\\"Quest_Title\\\": \\\"Timing:\\\",\\n          \\\"Type\\\": \\\"TextBox\\\",\\n          \\\"Answer\\\": \\\"Morning stiffness, improves during the day\\\",\\n          \\\"Children\\\": []\\n        },\\n        {\\n          \\\"Quest_Title\\\": \\\"Modifying factors:\\\",\\n          \\\"Type\\\": \\\"TextBox\\\",\\n          \\\"Answer\\\": \\\"Helped move heavy furniture\\\",\\n          \\\"Children\\\": []\\n        },\\n        {\\n          \\\"Quest_Title\\\": \\\"Associated signs and symptoms:\\\",\\n          \\\"Type\\\": \\\"TextBox\\\",\\n          \\\"Answer\\\": \\\"No\\\",\\n          \\\"Children\\\": []\\n        },\\n        {\\n          \\\"Quest_Title\\\": \\\"Notes:\\\",\\n          \\\"Type\\\": \\\"TextBox\\\",\\n          \\\"Answer\\\": \\\"No other symptoms\\\",\\n          \\\"Children\\\": []\\n        }\\n      ]\\n    },\\n    {\\n      \\\"Quest_Title\\\": \\\"Past Medical History:\\\",\\n      \\\"Type\\\": \\\"TextBox\\\",\\n      \\\"Answer\\\": \\\"No significant past medical history\\\",\\n      \\\"Children\\\": []\\n    },\\n    {\\n      \\\"Quest_Title\\\": \\\"Smoking History:\\\",\\n      \\\"Type\\\": \\\"Question Section\\\",\\n      \\\"Answer\\\": null,\\n      \\\"Children\\\": [\\n        {\\n          \\\"Quest_Title\\\": \\\"Smoking:\\\",\\n          \\\"Type\\\": \\\"CheckBox\\\",\\n          \\\"Answer\\\": \\\"Yes\\\",\\n          \\\"Children\\\": [\\n            {\\n              \\\"Quest_Title\\\": \\\"Type of Tobacco:\\\",\\n              \\\"Type\\\": \\\"CheckBox\\\",\\n              \\\"Answer\\\": \\\"Cigarette\\\",\\n              \\\"Children\\\": []\\n            }\\n          ]\\n        },\\n        {\\n          \\\"Quest_Title\\\": \\\"Passive Smoking:\\\",\\n          \\\"Type\\\": \\\"CheckBox\\\",\\n          \\\"Answer\\\": \\\"No\\\",\\n          \\\"Children\\\": []\\n        },\\n        {\\n          \\\"Quest_Title\\\": \\\"Willing to Quit:\\\",\\n          \\\"Type\\\": \\\"CheckBox\\\",\\n          \\\"Answer\\\": \\\"Yes\\\",\\n          \\\"Children\\\": [\\n            {\\n              \\\"Quest_Title\\\": \\\"Smoking Cessation treatment offered:\\\",\\n              \\\"Type\\\": \\\"CheckBox\\\",\\n              \\\"Answer\\\": \\\"No\\\",\\n              \\\"Children\\\": []\\n            }\\n          ]\\n        }\\n      ]\\n    }\\n  ]\\n}\\n```\"} ";

                //string escapedJson = jsonResponse1.Split("## Solution")[1].Trim('`', '\n', ' ', '"');
                //string escapedJson2 = escapedJson.Split("json")[1].Trim('`', '\n', ' ', '"');
                //string escapedJson3 = escapedJson2.Split("```\"}")[0].Trim('`', '\n', ' ', '"');

                //// 2. Unescape JSON string to valid format
                //string unescapedJson = Regex.Unescape(escapedJson3);

                //// 3. Now deserialize```"}
                //var model = JsonConvert.DeserializeObject<EMRNotesModel>(unescapedJson);




                string connectionString = Configuration.GetConnectionString("DefaultConnection");
                var patid = await _context.RegPatient.Where(x => x.Mrno == note.Mrno).Select(x => x.PatientId).FirstOrDefaultAsync();
                RegPatient regPatient = new RegPatient();
                regPatient.PatientId = patid; regPatient.Mrno = note.Mrno;

                var query = @"
                INSERT INTO SpeechToText
                (
                    PatientId, NoteHTMLText, NoteText, CreatedOn, MRNo,
                    NoteTitle, Description, CreatedBy, SignedBy, VisitDate,
                    IsDeleted, UpdatedBy, NotePath, AppointmentId, NotePathId
                )
                VALUES
                (
                    @PatientId, @NoteHTMLText, @NoteText, @CreatedOn, @MRNo,
                    @NoteTitle, @Description, @CreatedBy, @SignedBy, @VisitDate,
                    @IsDeleted, @UpdatedBy, @NotePath, @AppointmentId, @NotePathId
                  );
                SELECT SCOPE_IDENTITY();";

                using (SqlConnection conn = new SqlConnection(connectionString))
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@PatientId", (object?)regPatient.PatientId ?? 0);
                    cmd.Parameters.AddWithValue("@NoteHTMLText", (object?)note.NoteHtmltext ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@NoteText", (object?)note.NoteText ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@CreatedOn", (object?)note.CreatedOn ?? DateTime.Now);
                    cmd.Parameters.AddWithValue("@MRNo", note.Mrno);
                    cmd.Parameters.AddWithValue("@AppointmentId", note.AppointmentId);
                    cmd.Parameters.AddWithValue("@NoteTitle", note.NoteTitle);
                    cmd.Parameters.AddWithValue("@Description", (object?)note.Description ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@CreatedBy", note.CreatedBy);
                    cmd.Parameters.AddWithValue("@SignedBy", note.SignedBy);
                    cmd.Parameters.AddWithValue("@VisitDate", (object?)note.VisitDate ?? DateTime.Now);
                    cmd.Parameters.AddWithValue("@IsDeleted", (object?)note.IsDeleted ?? false);
                    cmd.Parameters.AddWithValue("@UpdatedBy", note.UpdatedBy);
                    cmd.Parameters.AddWithValue("@NotePath", (object?)note.NotePath ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@NotePathId", (object?)note.pathId ?? DBNull.Value);

                    await conn.OpenAsync();
                    //int rows = await cmd.ExecuteNonQueryAsync();

                    var insertedId = await cmd.ExecuteScalarAsync();  // SCOPE_IDENTITY() will return the inserted ID
                    int insertedNoteId = 0;
                    if (insertedId != null)
                    {
                        insertedNoteId = Convert.ToInt32(insertedId);
                        // Now you have the ID of the inserted record (insertedNoteId)
                        // Do whatever you need with this ID
                    }

                    string notetext = note.NoteText;
                    //string notetext = "good morning doctor i've been experiencing some pain in my chest and shortness of breath it's been bothering me for a few weeks now i'm glad you came in it's important not to ignore any chest related symptoms let me ask you a few questions to better understand your condition have you noticed if these symptoms occur during any specific activities or times of the day yes i've noticed that it happens mostly when i push myself physically like when i'm climbing stairs or walking fast alright do you have any history of heart disease in your family not that i'm aware of my parents and siblings don't have any heart related issues based on your symptoms and their relation to physical activity it's important to consider your heart health i'd like to order an electrocardiogram also called ecg to get a baseline assessment of your heart's electrical activity it will help us determine if any abnormalities are present i trust your judgment doctor please go ahead with the necessary tests i want to make sure everything is okay thank you for your trust mister johnson in the meantime i recommend making some lifestyle changes to support your heart health have you been following a balanced diet and indulging in regular exercise i must admit my diet hasn't been the healthiest lately and my exercise routine is almost nonexistent due to work are there any medications i should be taking or any other treatments we should consider we'll wait for the ecg results before discussing specific medications as they will depend on the findings if necessary we may consider prescribing i concern goodbye mister johnson take care and stay well";
                    // notetext = "Good morning doctor, I've been having this persistent pain in my lower back for about two weeks now. It started after I helped my friend move some heavy furniture.\r\n\r\nHmm, sounds like a musculoskeletal issue. Can you describe the pain — is it sharp, dull, or something else?\r\n\r\nIt’s more of a dull ache, but it intensifies when I bend or twist.\r\n\r\nUnderstood. On a scale of 1 to 10, how severe would you say the pain is?\r\n\r\nProbably around 6.\r\n\r\nAny numbness or tingling in your legs?\r\n\r\nNo, just stiffness in the morning, but it improves a bit during the day.\r\n\r\nThat’s useful. Have you tried anything to relieve it — heat, rest, medications?\r\n\r\nI've taken ibuprofen a couple of times, and it helps temporarily. I also applied a heating pad which seemed to work.\r\n\r\nAlright. Besides this, have you noticed any changes in your bowel or bladder habits?\r\n\r\nNo, everything else seems normal.\r\n\r\nAny recent fevers, night sweats, or unexpected weight loss?\r\n\r\nNo, I’ve been eating normally and haven’t lost any weight.\r\n\r\nLet's do a quick exam. Can you bend forward for me?\r\n\r\n[Patient tries to bend forward and winces]\r\n\r\nI see. Tenderness in the lumbar region. Reflexes and leg strength appear normal.\r\n\r\nWe'll continue with conservative management for now — physical therapy, posture correction, and possibly imaging if it doesn’t improve.\r\n\r\nThat sounds good. Thank you, doctor.";



                    //var node = _eMRNotesManager.GetNoteQuestionBYNoteId(note.pathId, note.NoteText);
                    var node = GetNoteQuestionBYNoteId(note.pathId, notetext);
                    // Retrieve node for API call
                    //var node = _eMRNotesManager.GetNoteQuestionBYNoteId(note.pathId, note.NoteText);


                    //if (notetext == null || notetext == "")
                    //{
                    //    var getpurposeofvisit = _context.EmrnoteVoiceinText.Where(x => x.NotePathId == note.pathId && x.Active == true).FirstOrDefault();

                    //    notetext = getpurposeofvisit.VoiceInText;
                    //}

                    //if (node != null)
                    //{

                    //    string jsonnode = JsonConvert.SerializeObject(node.node, Formatting.Indented);
                    //    string jsonCon = JsonConvert.SerializeObject(notetext, Formatting.Indented);
                    //    // Prepare API payload
                    //    var apiPayload = new
                    //    {
                    //        node = node
                    //    };
                    //    var payload = new
                    //    {
                    //        node = jsonnode,
                    //        conversation = jsonCon
                    //    };
                    //    // string jsonnode = JsonConvert.SerializeObject(node.node, Formatting.Indented);

                    //    using (var client = new HttpClient())
                    //    {
                    //        client.Timeout = TimeSpan.FromMinutes(5);
                    //        client.BaseAddress = new Uri("http://192.168.100.169:5000");
                    //        client.DefaultRequestHeaders.Add("Accept", "*/*");

                    //        var response = await client.PostAsJsonAsync("/process", payload);

                    //        if (response.IsSuccessStatusCode)
                    //        {
                    //            string jsonResponse = await response.Content.ReadAsStringAsync();
                    //            //var wrapper = JsonConvert.DeserializeObject<Dictionary<string, string>>(jsonResponse);
                    //            //string actualJson = wrapper["response"];

                    //            //nodeModel notem = JsonConvert.DeserializeObject<nodeModel>(actualJson);

                    //            //var wrapper = JsonConvert.DeserializeObject<Dictionary<string, string>>(jsonResponse);

                    //            // string escapedJson = wrapper["response"];

                    //            // Unescape the JSON string (remove \r\n, etc.)
                    //            //string cleanedJson = JsonConvert.DeserializeObject<string>(JsonConvert.SerializeObject(escapedJson));

                    //            // EMRNotesModel emrNotes = JsonConvert.DeserializeObject<EMRNotesModel>(jsonOnly);
                    //            // Deserialize into C# object
                    //            //var nodeMod = JsonConvert.DeserializeObject<EMRNotesModel>(cleanedJson);

                    //            // Example: Print all questions and answers
                    //            //PrintQuestions(nodeMod.Questions, 0);
                    //            var updateQuery = @"
                    //                UPDATE SpeechToText
                    //                SET ApiResponse = @ApiResponse
                    //                WHERE ID = @Id";

                    //            using (var updateCmd = new SqlCommand(updateQuery, conn))
                    //            {
                    //                updateCmd.Parameters.AddWithValue("@ApiResponse", jsonResponse);
                    //                updateCmd.Parameters.AddWithValue("@Id", insertedNoteId);

                    //                await updateCmd.ExecuteNonQueryAsync();
                    //            }

                    //            //var jsonResponse1 = "{\"response\":\"\\n    \\n              \\n\\n\\nJSON Template:\\n            \\\"{\\\\r\\\\n  \\\\\\\"NoteTitle\\\\\\\": \\\\\\\"Consultation Notes\\\\\\\",\\\\r\\\\n  \\\\\\\"Questions\\\\\\\": [\\\\r\\\\n    {\\\\r\\\\n      \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Chief Complaint:\\\\\\\",\\\\r\\\\n      \\\\\\\"Type\\\\\\\": \\\\\\\"TextBox\\\\\\\",\\\\r\\\\n      \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n      \\\\\\\"Children\\\\\\\": []\\\\r\\\\n    },\\\\r\\\\n    {\\\\r\\\\n      \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"History of Present Illness:\\\\\\\",\\\\r\\\\n      \\\\\\\"Type\\\\\\\": \\\\\\\"Question Section\\\\\\\",\\\\r\\\\n      \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n      \\\\\\\"Children\\\\\\\": [\\\\r\\\\n        {\\\\r\\\\n          \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Location:\\\\\\\",\\\\r\\\\n          \\\\\\\"Type\\\\\\\": \\\\\\\"TextBox\\\\\\\",\\\\r\\\\n          \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n          \\\\\\\"Children\\\\\\\": []\\\\r\\\\n        },\\\\r\\\\n        {\\\\r\\\\n          \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Quality:\\\\\\\",\\\\r\\\\n          \\\\\\\"Type\\\\\\\": \\\\\\\"TextBox\\\\\\\",\\\\r\\\\n          \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n          \\\\\\\"Children\\\\\\\": []\\\\r\\\\n        },\\\\r\\\\n        {\\\\r\\\\n          \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Severity:\\\\\\\",\\\\r\\\\n          \\\\\\\"Type\\\\\\\": \\\\\\\"TextBox\\\\\\\",\\\\r\\\\n          \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n          \\\\\\\"Children\\\\\\\": []\\\\r\\\\n        },\\\\r\\\\n        {\\\\r\\\\n          \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Duration:\\\\\\\",\\\\r\\\\n          \\\\\\\"Type\\\\\\\": \\\\\\\"TextBox\\\\\\\",\\\\r\\\\n          \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n          \\\\\\\"Children\\\\\\\": []\\\\r\\\\n        },\\\\r\\\\n        {\\\\r\\\\n          \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Timing:\\\\\\\",\\\\r\\\\n          \\\\\\\"Type\\\\\\\": \\\\\\\"TextBox\\\\\\\",\\\\r\\\\n          \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n          \\\\\\\"Children\\\\\\\": []\\\\r\\\\n        },\\\\r\\\\n        {\\\\r\\\\n          \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Modifying factors:\\\\\\\",\\\\r\\\\n          \\\\\\\"Type\\\\\\\": \\\\\\\"TextBox\\\\\\\",\\\\r\\\\n          \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n          \\\\\\\"Children\\\\\\\": []\\\\r\\\\n        },\\\\r\\\\n        {\\\\r\\\\n          \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Associated signs and symptoms:\\\\\\\",\\\\r\\\\n          \\\\\\\"Type\\\\\\\": \\\\\\\"TextBox\\\\\\\",\\\\r\\\\n          \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n          \\\\\\\"Children\\\\\\\": []\\\\r\\\\n        },\\\\r\\\\n        {\\\\r\\\\n          \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Notes:\\\\\\\",\\\\r\\\\n          \\\\\\\"Type\\\\\\\": \\\\\\\"TextBox\\\\\\\",\\\\r\\\\n          \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n          \\\\\\\"Children\\\\\\\": []\\\\r\\\\n        }\\\\r\\\\n      ]\\\\r\\\\n    },\\\\r\\\\n    {\\\\r\\\\n      \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Past Medical History:\\\\\\\",\\\\r\\\\n      \\\\\\\"Type\\\\\\\": \\\\\\\"TextBox\\\\\\\",\\\\r\\\\n      \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n      \\\\\\\"Children\\\\\\\": []\\\\r\\\\n    },\\\\r\\\\n    {\\\\r\\\\n      \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Smoking History:\\\\\\\",\\\\r\\\\n      \\\\\\\"Type\\\\\\\": \\\\\\\"Question Section\\\\\\\",\\\\r\\\\n      \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n      \\\\\\\"Children\\\\\\\": [\\\\r\\\\n        {\\\\r\\\\n          \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Smoking:\\\\\\\",\\\\r\\\\n          \\\\\\\"Type\\\\\\\": \\\\\\\"CheckBox\\\\\\\",\\\\r\\\\n          \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n          \\\\\\\"Children\\\\\\\": [\\\\r\\\\n            {\\\\r\\\\n              \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Yes\\\\\\\",\\\\r\\\\n              \\\\\\\"Type\\\\\\\": null,\\\\r\\\\n              \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n              \\\\\\\"Children\\\\\\\": [\\\\r\\\\n                {\\\\r\\\\n                  \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Type of Tobacco\\\\\\\",\\\\r\\\\n                  \\\\\\\"Type\\\\\\\": \\\\\\\"CheckBox\\\\\\\",\\\\r\\\\n                  \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n                  \\\\\\\"Children\\\\\\\": [\\\\r\\\\n                    {\\\\r\\\\n                      \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Cigarette\\\\\\\",\\\\r\\\\n                      \\\\\\\"Type\\\\\\\": \\\\\\\"CheckBox\\\\\\\",\\\\r\\\\n                      \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n                      \\\\\\\"Children\\\\\\\": []\\\\r\\\\n                    },\\\\r\\\\n                    {\\\\r\\\\n                      \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"E-cigarettes\\\\\\\",\\\\r\\\\n                      \\\\\\\"Type\\\\\\\": \\\\\\\"CheckBox\\\\\\\",\\\\r\\\\n                      \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n                      \\\\\\\"Children\\\\\\\": []\\\\r\\\\n                    },\\\\r\\\\n                    {\\\\r\\\\n                      \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Water pipe(shisha)\\\\\\\",\\\\r\\\\n                      \\\\\\\"Type\\\\\\\": \\\\\\\"CheckBox\\\\\\\",\\\\r\\\\n                      \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n                      \\\\\\\"Children\\\\\\\": []\\\\r\\\\n                    },\\\\r\\\\n                    {\\\\r\\\\n                      \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Medwakh\\\\\\\",\\\\r\\\\n                      \\\\\\\"Type\\\\\\\": \\\\\\\"CheckBox\\\\\\\",\\\\r\\\\n                      \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n                      \\\\\\\"Children\\\\\\\": []\\\\r\\\\n                    },\\\\r\\\\n                    {\\\\r\\\\n                      \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Naswar\\\\\\\",\\\\r\\\\n                      \\\\\\\"Type\\\\\\\": \\\\\\\"CheckBox\\\\\\\",\\\\r\\\\n                      \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n                      \\\\\\\"Children\\\\\\\": []\\\\r\\\\n                    },\\\\r\\\\n                    {\\\\r\\\\n                      \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Other:\\\\\\\",\\\\r\\\\n                      \\\\\\\"Type\\\\\\\": \\\\\\\"TextBox\\\\\\\",\\\\r\\\\n                      \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n                      \\\\\\\"Children\\\\\\\": []\\\\r\\\\n                    }\\\\r\\\\n                  ]\\\\r\\\\n                }\\\\r\\\\n              ]\\\\r\\\\n            },\\\\r\\\\n            {\\\\r\\\\n              \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"No                                                                   \\\\\\\",\\\\r\\\\n              \\\\\\\"Type\\\\\\\": null,\\\\r\\\\n              \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n              \\\\\\\"Children\\\\\\\": []\\\\r\\\\n            }\\\\r\\\\n          ]\\\\r\\\\n        },\\\\r\\\\n        {\\\\r\\\\n          \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Passive Smoking:\\\\\\\",\\\\r\\\\n          \\\\\\\"Type\\\\\\\": \\\\\\\"CheckBox\\\\\\\",\\\\r\\\\n          \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n          \\\\\\\"Children\\\\\\\": [\\\\r\\\\n            {\\\\r\\\\n              \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Yes\\\\\\\",\\\\r\\\\n              \\\\\\\"Type\\\\\\\": null,\\\\r\\\\n              \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n              \\\\\\\"Children\\\\\\\": []\\\\r\\\\n            },\\\\r\\\\n            {\\\\r\\\\n              \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"No                                                                   \\\\\\\",\\\\r\\\\n              \\\\\\\"Type\\\\\\\": null,\\\\r\\\\n              \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n              \\\\\\\"Children\\\\\\\": []\\\\r\\\\n            }\\\\r\\\\n          ]\\\\r\\\\n        },\\\\r\\\\n        {\\\\r\\\\n          \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Willing to Quit:\\\\\\\",\\\\r\\\\n          \\\\\\\"Type\\\\\\\": \\\\\\\"CheckBox\\\\\\\",\\\\r\\\\n          \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n          \\\\\\\"Children\\\\\\\": [\\\\r\\\\n            {\\\\r\\\\n              \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Yes\\\\\\\",\\\\r\\\\n              \\\\\\\"Type\\\\\\\": null,\\\\r\\\\n              \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n              \\\\\\\"Children\\\\\\\": [\\\\r\\\\n                {\\\\r\\\\n                  \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Smoking Cessation treatment offered\\\\\\\",\\\\r\\\\n                  \\\\\\\"Type\\\\\\\": \\\\\\\"CheckBox\\\\\\\",\\\\r\\\\n                  \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n                  \\\\\\\"Children\\\\\\\": []\\\\r\\\\n                }\\\\r\\\\n              ]\\\\r\\\\n            },\\\\r\\\\n            {\\\\r\\\\n              \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"No                                                                   \\\\\\\",\\\\r\\\\n              \\\\\\\"Type\\\\\\\": null,\\\\r\\\\n              \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n              \\\\\\\"Children\\\\\\\": [\\\\r\\\\n                {\\\\r\\\\n                  \\\\\\\"Quest_Title\\\\\\\": \\\\\\\"Educated on benefits related to quitting smoking\\\\\\\",\\\\r\\\\n                  \\\\\\\"Type\\\\\\\": \\\\\\\"CheckBox\\\\\\\",\\\\r\\\\n                  \\\\\\\"Answer\\\\\\\": null,\\\\r\\\\n                  \\\\\\\"Children\\\\\\\": []\\\\r\\\\n                }\\\\r\\\\n              ]\\\\r\\\\n            }\\\\r\\\\n          ]\\\\r\\\\n        }\\\\r\\\\n      ]\\\\r\\\\n    }\\\\r\\\\n  ]\\\\r\\\\n}\\\"\\n            Return only the completed JSON.\\n            \\n\\n\\n## Solution\\n```json\\n{\\n  \\\"NoteTitle\\\": \\\"Consultation Notes\\\",\\n  \\\"Questions\\\": [\\n    {\\n      \\\"Quest_Title\\\": \\\"Chief Complaint:\\\",\\n      \\\"Type\\\": \\\"TextBox\\\",\\n      \\\"Answer\\\": \\\"Persistent pain in lower back\\\",\\n      \\\"Children\\\": []\\n    },\\n    {\\n      \\\"Quest_Title\\\": \\\"History of Present Illness:\\\",\\n      \\\"Type\\\": \\\"Question Section\\\",\\n      \\\"Answer\\\": null,\\n      \\\"Children\\\": [\\n        {\\n          \\\"Quest_Title\\\": \\\"Location:\\\",\\n          \\\"Type\\\": \\\"TextBox\\\",\\n          \\\"Answer\\\": \\\"Lower back\\\",\\n          \\\"Children\\\": []\\n        },\\n        {\\n          \\\"Quest_Title\\\": \\\"Quality:\\\",\\n          \\\"Type\\\": \\\"TextBox\\\",\\n          \\\"Answer\\\": \\\"Dull ache\\\",\\n          \\\"Children\\\": []\\n        },\\n        {\\n          \\\"Quest_Title\\\": \\\"Severity:\\\",\\n          \\\"Type\\\": \\\"TextBox\\\",\\n          \\\"Answer\\\": \\\"6/10\\\",\\n          \\\"Children\\\": []\\n        },\\n        {\\n          \\\"Quest_Title\\\": \\\"Duration:\\\",\\n          \\\"Type\\\": \\\"TextBox\\\",\\n          \\\"Answer\\\": \\\"2 weeks\\\",\\n          \\\"Children\\\": []\\n        },\\n        {\\n          \\\"Quest_Title\\\": \\\"Timing:\\\",\\n          \\\"Type\\\": \\\"TextBox\\\",\\n          \\\"Answer\\\": \\\"Morning stiffness, improves during the day\\\",\\n          \\\"Children\\\": []\\n        },\\n        {\\n          \\\"Quest_Title\\\": \\\"Modifying factors:\\\",\\n          \\\"Type\\\": \\\"TextBox\\\",\\n          \\\"Answer\\\": \\\"Helped move heavy furniture\\\",\\n          \\\"Children\\\": []\\n        },\\n        {\\n          \\\"Quest_Title\\\": \\\"Associated signs and symptoms:\\\",\\n          \\\"Type\\\": \\\"TextBox\\\",\\n          \\\"Answer\\\": \\\"No\\\",\\n          \\\"Children\\\": []\\n        },\\n        {\\n          \\\"Quest_Title\\\": \\\"Notes:\\\",\\n          \\\"Type\\\": \\\"TextBox\\\",\\n          \\\"Answer\\\": \\\"No other symptoms\\\",\\n          \\\"Children\\\": []\\n        }\\n      ]\\n    },\\n    {\\n      \\\"Quest_Title\\\": \\\"Past Medical History:\\\",\\n      \\\"Type\\\": \\\"TextBox\\\",\\n      \\\"Answer\\\": \\\"No significant past medical history\\\",\\n      \\\"Children\\\": []\\n    },\\n    {\\n      \\\"Quest_Title\\\": \\\"Smoking History:\\\",\\n      \\\"Type\\\": \\\"Question Section\\\",\\n      \\\"Answer\\\": null,\\n      \\\"Children\\\": [\\n        {\\n          \\\"Quest_Title\\\": \\\"Smoking:\\\",\\n          \\\"Type\\\": \\\"CheckBox\\\",\\n          \\\"Answer\\\": \\\"Yes\\\",\\n          \\\"Children\\\": [\\n            {\\n              \\\"Quest_Title\\\": \\\"Type of Tobacco:\\\",\\n              \\\"Type\\\": \\\"CheckBox\\\",\\n              \\\"Answer\\\": \\\"Cigarette\\\",\\n              \\\"Children\\\": []\\n            }\\n          ]\\n        },\\n        {\\n          \\\"Quest_Title\\\": \\\"Passive Smoking:\\\",\\n          \\\"Type\\\": \\\"CheckBox\\\",\\n          \\\"Answer\\\": \\\"No\\\",\\n          \\\"Children\\\": []\\n        },\\n        {\\n          \\\"Quest_Title\\\": \\\"Willing to Quit:\\\",\\n          \\\"Type\\\": \\\"CheckBox\\\",\\n          \\\"Answer\\\": \\\"Yes\\\",\\n          \\\"Children\\\": [\\n            {\\n              \\\"Quest_Title\\\": \\\"Smoking Cessation treatment offered:\\\",\\n              \\\"Type\\\": \\\"CheckBox\\\",\\n              \\\"Answer\\\": \\\"No\\\",\\n              \\\"Children\\\": []\\n            }\\n          ]\\n        }\\n      ]\\n    }\\n  ]\\n}\\n```\"} ";
                    //            // string escapedJson = jsonResponse.Split("## Solution")[1].Trim('`', '\n', ' ', '"');

                    //            string escapedJson = jsonResponse.Split("```json")[1].Trim('`', '\n', ' ', '"');
                    //            //// string escapedJson2 = escapedJson.Split("json")[1].Trim('`', '\n', ' ', '"');
                    //            string escapedJson3 = escapedJson.Split("###")[0].Trim('`', '\n', ' ', '"');
                    //            string cleaned = escapedJson3
                    //                 .Replace("```json", "")
                    //                 .Replace("```", "")
                    //                 .Replace("\"}`", "") // remove "}`
                    //                 .Replace("\"}", "")  // remove trailing "}
                    //                 .Trim();

                    //            // Step 2: Remove surrounding double quotes if any
                    //            if (cleaned.StartsWith("\"") && cleaned.EndsWith("\""))
                    //            {
                    //                cleaned = cleaned.Substring(1, cleaned.Length - 2);
                    //            }
                    //            // 2. Unescape JSON string to valid format
                    //            string unescapedJson = Regex.Unescape(cleaned);

                    //            // 3. Now deserialize```"}
                    //            var model = JsonConvert.DeserializeObject<EMRNotesModel>(unescapedJson);
                    //            node = new nodeModel();
                    //            node.node = model;
                    //            //string escapedJson = jsonResponse.Split("## Solution")[1].Trim('`', '\n', ' ', '"');

                    //            //// 2. Unescape JSON string to valid format
                    //            //string unescapedJson = Regex.Unescape(escapedJson);

                    //            //// 3. Now deserialize
                    //            //var model = JsonConvert.DeserializeObject<EMRNotesModel>(unescapedJson);
                    //            //string jsonOnly = jsonResponse.Split("## Solution")[1].Trim();
                    //            //var emrNotes = JsonConvert.DeserializeObject<EMRNotesModel>(jsonOnly);
                    //        }

                    //    }
                    //}


                    ////  For Testing start
                    var getpurposeofvisit2 = _context.SpeechToText.Where(x => x.Id == 567).FirstOrDefault();

                    string escapedJson = getpurposeofvisit2.ApiResponse.Split("```json")[1].Trim('`', '\n', ' ', '"');
                    // string escapedJson2 = escapedJson.Split("json")[1].Trim('`', '\n', ' ', '"');
                    //string escapedJson3 = escapedJson.Split(""}"}")[0].Trim('`', '\n', ' ', '"');
                    string cleaned = escapedJson
                            .Replace("```json", "")
                            .Replace("```", "")
                            .Replace("\"}`", "") // remove "}`
                            .Replace("\"}", "")  // remove trailing "}
                            .Trim();

                    // Step 2: Remove surrounding double quotes if any
                    if (cleaned.StartsWith("\"") && cleaned.EndsWith("\""))
                    {
                        cleaned = cleaned.Substring(1, cleaned.Length - 2);
                    }
                    // 2. Unescape JSON string to valid format
                    string unescapedJson = Regex.Unescape(cleaned);

                    // 3. Now deserialize```"}
                    var model = JsonConvert.DeserializeObject<EMRNotesModel>(unescapedJson);
                    node = new nodeModel();
                    node.node = model;


                    ////  For Testing end

                    return node;




                }
            }
            catch (Exception EX)
            {
                return null;
            }
        }
        static void PrintQuestions(List<NoteModel> questions, int level)
        {
            foreach (var q in questions)
            {
                Console.WriteLine($"{new string(' ', level * 2)}{q.Quest_Title} => {q.Answer}");
                if (q.Children != null && q.Children.Count > 0)
                    PrintQuestions(q.Children, level + 1);
            }
        }

    }
}
