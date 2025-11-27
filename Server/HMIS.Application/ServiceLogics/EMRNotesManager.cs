using AutoMapper;
using Dapper;
using Deepgram.Clients.Interfaces.v1;
using Deepgram.Models.Listen.v1.REST;
using HMIS.Application.DTOs.Clinical;
using HMIS.Core.Context;
using HMIS.Core.Entities;
using HMIS.Core.FileSystem;
using HMIS.Service.DTOs;
using HMIS.Service.Implementations;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Data;
using System.Linq.Dynamic.Core;
using System.Text.RegularExpressions;



namespace HMIS.Service.ServiceLogics
{
    public class EMRNotesManager : IEMRNotesManager
    {
        private readonly HMISDbContext _context;
        private readonly IMapper _mapper;
        private readonly string _connectionString;
        private readonly ILogger<EMRNotesManager> _logger;
        private readonly IListenRESTClient _deepgram;
        private readonly IFileRepository _fileRepository;

        public EMRNotesManager(HMISDbContext context, IConfiguration configuration,
                              IMapper mapper, ILogger<EMRNotesManager> logger, IListenRESTClient deepgram, IFileRepository fileRepository)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
            _deepgram = deepgram;
            _fileRepository = fileRepository;
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new ArgumentNullException(nameof(configuration), "DefaultConnection string not found");
        }

        public async Task<EMRNotesModel> GetNoteQuestionBYPathId(int pathId)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);

                var parameters = new DynamicParameters();
                parameters.Add("@PathId", pathId);
                parameters.Add("@AllQuestions", false);
                parameters.Add("@Quest_Type", null);

                var results = await connection.QueryAsync<EMRNotesQuestionDto>(
                    "EMRNotesEncounterPath_GetAllQuestions",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                var questions = results.Select(r => new EMRNotesQuestionModel
                {
                    Quest_Id = r.Quest_Id,
                    Quest_Title = r.Quest_Title,
                    Type = MapQuestionType(r.Quest_Type),
                    Parent_Id = r.Parent_Id,
                    Answer = ""
                }).ToList();

                if (!questions.Any())
                    return new EMRNotesModel();

                var hierarchy = BuildHierarchy(questions);
                var noteModel = _mapper.Map<List<NoteModel>>(hierarchy);

                // Get NoteName from the first result
                var firstResult = results.FirstOrDefault();
                var eMRNotesModel = new EMRNotesModel
                {
                    NoteTitle = firstResult?.NoteName ?? string.Empty,
                    Questions = noteModel
                };

                string json = JsonConvert.SerializeObject(eMRNotesModel, Formatting.Indented);
                Console.WriteLine(json);

                return eMRNotesModel;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetNoteQuestionBYPathId for PathId: {PathId}", pathId);
                return null;
            }
        }

        public async Task<nodeModel> GetNoteQuestionBYNoteId(int pathId, string? voiceText)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);

                var parameters = new DynamicParameters();
                parameters.Add("@PathId", pathId);
                parameters.Add("@AllQuestions", false);
                parameters.Add("@Quest_Type", null);

                var results = await connection.QueryAsync<EMRNotesQuestionDto>(
                    "EMRNotesEncounterPath_GetAllQuestions",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                var questions = results.Select(r => new EMRNotesQuestionModel
                {
                    Quest_Id = r.Quest_Id,
                    Quest_Title = r.Quest_Title,
                    Type = MapQuestionType(r.Quest_Type),
                    Parent_Id = r.Parent_Id
                }).ToList();

                if (!questions.Any())
                    return new nodeModel();

                var hierarchy = BuildHierarchy(questions);
                var noteModel = _mapper.Map<List<NoteModel>>(hierarchy);

                // Get NoteName from the first result
                var firstResult = results.FirstOrDefault();
                var eMRNotesModel = new EMRNotesModel
                {
                    NoteTitle = firstResult?.NoteName ?? string.Empty,
                    Questions = noteModel
                };

                var nodeModel = new nodeModel
                {
                    node = eMRNotesModel,
                    conversation = voiceText
                };

                string json = JsonConvert.SerializeObject(nodeModel, Formatting.Indented);
                Console.WriteLine(json);

                return nodeModel;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetNoteQuestionBYNoteId for PathId: {PathId}", pathId);
                return null;
            }
        }

        public async Task<List<ProvierEMRNotesModel>> EMRNotesGetByEmpId(long EmpId)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);

                var parameters = new DynamicParameters();
                parameters.Add("@EmpId", EmpId);

                var results = await connection.QueryAsync<ProvierEMRNotesModel>(
                    "EMRNotesEM_GetByEmpId",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return results.ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in EMRNotesGetByEmpId for EmpId: {EmpId}", EmpId);
                return null;
            }
        }

        public async Task<nodeModel> InsertSpeech(ClinicalNoteObj note)
        {
            try
            {
                // Get patient ID
                var patientId = await _context.RegPatient
                    .Where(x => x.Mrno == note.Mrno)
                    .Select(x => x.PatientId)
                    .FirstOrDefaultAsync();

                var speechToText = new SpeechToText
                {
                    PatientId = patientId,
                    NoteHtmltext = note.NoteHtmltext,
                    NoteText = note.NoteText,
                    CreatedOn = note.CreatedOn ?? DateTime.Now,
                    Mrno = note.Mrno,
                    NoteTitle = note.NoteTitle,
                    Description = note.Description,
                    CreatedBy = note.CreatedBy,
                    SignedBy = note.SignedBy,
                    VisitDate = note.VisitDate ?? DateTime.Now,
                    IsDeleted = note.IsDeleted ?? false,
                    UpdatedBy = note.UpdatedBy,
                    NotePath = note.NotePath,
                    AppointmentId = note.AppointmentId,
                    NotePathId = note.pathId,
                    FileId = note.File_Id
                };

                _context.SpeechToText.Add(speechToText);
                await _context.SaveChangesAsync();

                _logger.LogInformation("SpeechToText record inserted with ID: {InsertedId}", speechToText.Id);

                string notetext = note.NoteText;
                var node = await GetNoteQuestionBYNoteId(note.pathId, notetext);

                // Get API response using EF instead of Dapper
                var getpurposeofvisit2 = await _context.SpeechToText
                    .Where(x => x.Id == 567)
                    .Select(x => new SpeechToTextResponse { ApiResponse = x.ApiResponse })
                    .FirstOrDefaultAsync();

                if (!string.IsNullOrEmpty(getpurposeofvisit2?.ApiResponse))
                {
                    var model = ParseApiResponse(getpurposeofvisit2.ApiResponse);
                    if (model != null)
                    {
                        node = new nodeModel { node = model };
                    }
                }

                return node;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in InsertSpeech for MRNo: {Mrno}", note.Mrno);
                return null;
            }
        }
        public async Task<nodeModel> InsertSpeechWithTranscription(ClinicalNoteDto note)
        {
            try
            {
                string transcript = "";
                string filePath = "";

                if (note.FileId > 0)
                {
                    var result = await TranscribeAudioFile(note.FileId);
                    transcript = result.Transcript;
                    filePath = result.FilePath;
                }

                var NoteData = new ClinicalNoteObj()
                {
                    Id = note.Id,
                    CreatedBy = note.CreatedBy,
                    Description = note.Description,
                    NoteTitle = note.NoteTitle,
                    SignedBy = note.SignedBy,
                    UpdatedBy = note.UpdatedBy,
                    NoteText = transcript,
                    NotePath = filePath,
                    Mrno = note.mrNo,
                    AppointmentId = note.AppointmentId,
                    pathId = note.pathId,
                    File_Id = note.FileId
                };

                return await InsertSpeech(NoteData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in InsertSpeechWithTranscription for MRNo: {Mrno}", note.mrNo);
                return null;
            }
        }
        private async Task<TranscriptionResult> TranscribeAudioFile(long? fileId)
        {
            try
            {
                if (!fileId.HasValue)
                    throw new ArgumentException("FileId is required");

                // Use FileRepository to get file path
                var filePath = await _fileRepository.GetFilePathAsync(fileId.Value);

                if (string.IsNullOrEmpty(filePath))
                    throw new FileNotFoundException($"File not found for FileId: {fileId}");

                if (!System.IO.File.Exists(filePath))
                    throw new FileNotFoundException($"Audio file not found at: {filePath}");

                // Read audio file
                byte[] audioBytes = await System.IO.File.ReadAllBytesAsync(filePath);

                // Deepgram call
                var response = await _deepgram.TranscribeFile(
                    audioBytes,
                    new PreRecordedSchema
                    {
                        Model = "nova-3"
                    });

                string transcript = response?
                    .Results?
                    .Channels?[0]?
                    .Alternatives?[0]?
                    .Transcript ?? "";

                _logger.LogInformation(
                    "Deepgram transcription complete. FileId: {FileId}, Transcript Length: {Length}",
                    fileId,
                    transcript.Length
                );

                return new TranscriptionResult
                {
                    Transcript = transcript,
                    FilePath = filePath
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error transcribing audio file for FileId: {FileId}", fileId);
                throw;
            }
        }

        // Helper method to parse API response
        private EMRNotesModel ParseApiResponse(string apiResponse)
        {
            try
            {
                if (string.IsNullOrEmpty(apiResponse))
                    return null;

                var jsonParts = apiResponse.Split("```json");
                if (jsonParts.Length < 2)
                    return null;

                string escapedJson = jsonParts[1].Trim('`', '\n', ' ', '"');
                string cleaned = escapedJson
                        .Replace("```json", "")
                        .Replace("```", "")
                        .Replace("\"}`", "")
                        .Replace("\"}", "")
                        .Trim();

                if (cleaned.StartsWith("\"") && cleaned.EndsWith("\""))
                {
                    cleaned = cleaned.Substring(1, cleaned.Length - 2);
                }
                string unescapedJson = Regex.Unescape(cleaned);

                return JsonConvert.DeserializeObject<EMRNotesModel>(unescapedJson);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error parsing API response");
                return null;
            }
        }

        // Helper method to map question type
        private string MapQuestionType(int questType)
        {
            return questType switch
            {
                0 => "TextBox",
                3 => "CheckBox",
                4 => "Question Section",
                _ => "TextBox"
            };
        }

        // Existing hierarchy methods (unchanged)
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
                .Select(child => BuildHierarchyRecursive(all, child))
                .ToList();

            current.Children = children;
            return current;
        }

        private static void PrintQuestions(List<NoteModel> questions, int level)
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