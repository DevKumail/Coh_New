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
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
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

        public async Task<ClinicalNoteResponse> SaveClinicalNote(ClinicalNoteDto note)
        {
            try
            {
                _logger.LogInformation("Processing clinical note for MRNo: {MrNo}, AppointmentId: {AppointmentId}",
                    note.MrNo, note.AppointmentId);

                // Determine note type
                string noteType = (note.NoteType ?? "FreeText").Trim().ToLower();

                // Validate note type
                if (noteType != "structured" && noteType != "freetext")
                {
                    return new ClinicalNoteResponse
                    {
                        Success = false,
                        NoteId = 0,
                        Message = $"Unsupported note type: {note.NoteType}. Supported types: Structured, FreeText"
                    };
                }

                // Map DTO to entity
                var emrNote = MapToEmrNoteEntity(note, noteType);

                // Check if this is an update
                bool isUpdate = note.Id > 0;

                if (isUpdate)
                {
                    // Find existing note
                    var existingNote = await _context.EmrnotesNote
                        .FirstOrDefaultAsync(n => n.NoteId == note.Id);

                    if (existingNote == null)
                    {
                        return new ClinicalNoteResponse
                        {
                            Success = false,
                            NoteId = 0,
                            Message = $"Note with ID {note.Id} not found"
                        };
                    }

                    // Update existing note
                   UpdateEmrNote(existingNote, emrNote);
                    await _context.SaveChangesAsync();

                    _logger.LogInformation("Successfully updated note ID: {NoteId}", existingNote.NoteId);
                }
                else
                {
                    // Create new note
                    _context.EmrnotesNote.Add(emrNote);
                    await _context.SaveChangesAsync();


                    if (note.TemplateId > 0)
                    {
                        var noteId = emrNote.NoteId;

                        await AddTemplateDetail(note,noteId);
                    }
                    if(note.FileId > 0)
                    {
                        note.Id = emrNote.NoteId; 
                        await InsertSpeechWithTranscription(note);
                    }
                    _logger.LogInformation("Successfully created new note ID: {NoteId}", emrNote.NoteId);
                }

                if (noteType == "structured" && note.StructuredNote?.Node?.Questions != null)
                {
                    await SaveStructuredQuestions(note, emrNote.NoteId);
                }


                return new ClinicalNoteResponse
                {
                    Success = true,
                    NoteId = emrNote.NoteId,
                    Message = $"{noteType} note saved successfully"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving clinical note for MRNo: {MrNo}", note.MrNo);
                return new ClinicalNoteResponse
                {
                    Success = false,
                    NoteId = 0,
                    Message = $"Error saving note: {ex.Message}"
                };
            }
        }

        private EmrnotesNote MapToEmrNoteEntity(ClinicalNoteDto note, string noteType)
        {
            // Use VisitAcNo from payload if provided, otherwise use AppointmentId
            var visitAcNo = note.VisitAcNo ?? note.AppointmentId;

            // Determine note title
            string noteTitle = !string.IsNullOrEmpty(note.NoteTitle)
                ? note.NoteTitle
                : (note.StructuredNote?.Node?.NoteTitle ?? $"{noteType} Note");

            // Determine note status
            string noteStatus = note.NoteStatus ?? (note.SignedBy > 0 ? "Signed" : "Draft");

            var emrNote = new EmrnotesNote
            {
                // Update existing note if Id is provided
                NoteId = note.Id > 0 ? note.Id : 0,

                // Basic info
                NotesTitle = noteTitle,
                NoteText = note.NoteText,
                NoteHtmltext = note.HtmlContent ?? note.NoteHtmltext,
                Description = note.Description,
                Mrno = note.MrNo,
                VisitAcNo = visitAcNo,

                // Note type and status
                NoteType = noteType == "structured" ? "Structured" : "FreeText",
                NoteStatus = noteStatus,

                // Signing info
                SignedBy = note.SignedBy,
                SignedDate = note.SignedDate,
                Signed = note.Signed ?? (note.SignedBy > 0),

                // Flags
                Active = note.Active ?? true,
                IsEdit = note.IsEdit ?? (note.SignedBy == 0),
                Review = note.Review ?? false,
                IsNursingNote = note.IsNursingNote ?? false,
                IsMbrcompleted = note.IsMbrcompleted ?? false,

                CaseId = note.CaseId ?? Guid.Empty,

            };

            if (emrNote.Signed && emrNote.SignedDate == null)
            {
                emrNote.SignedDate = DateTime.Now;
            }

            return emrNote;
        }

        private void UpdateEmrNote(EmrnotesNote existingNote, EmrnotesNote updatedNote)
        {
            // Update only modifiable fields
            existingNote.NotesTitle = updatedNote.NotesTitle;
            existingNote.NoteText = updatedNote.NoteText;
            existingNote.NoteHtmltext = updatedNote.NoteHtmltext;
            existingNote.Description = updatedNote.Description;
            existingNote.UpdatedBy = updatedNote.UpdatedBy;
            existingNote.UpdatedAt = DateTime.Now;

            // Update signing info if provided
            if (updatedNote.SignedBy > 0 && !existingNote.Signed)
            {
                existingNote.Signed = true;
                existingNote.SignedBy = updatedNote.SignedBy;
                existingNote.SignedDate = updatedNote.SignedDate ?? DateTime.Now;
                existingNote.NoteStatus = "Signed";
                existingNote.IsEdit = false;
            }

            // Update other fields if provided
            if (!string.IsNullOrEmpty(updatedNote.NoteStatus))
                existingNote.NoteStatus = updatedNote.NoteStatus;

            if (updatedNote.Review.HasValue)
                existingNote.Review = updatedNote.Review.Value;

            if (updatedNote.IsNursingNote.HasValue)
                existingNote.IsNursingNote = updatedNote.IsNursingNote.Value;

            if (updatedNote.IsMbrcompleted.HasValue)
                existingNote.IsMbrcompleted = updatedNote.IsMbrcompleted.Value;

        }

        private async System.Threading.Tasks.Task AddTemplateDetail(ClinicalNoteDto note,long noteId)
        {
        
            if (note.Id > 0)
            {
                //implement in future
            }
            else
            {
                var noteTemplate = new EmrnoteTemplate();
                noteTemplate.TemplateId = note.TemplateId ?? 0;
                noteTemplate.NoteId = noteId;
                 _context.EmrnoteTemplate.Add(noteTemplate);
                await _context.SaveChangesAsync();
            }
        
        }

        private async System.Threading.Tasks.Task SaveStructuredQuestions(ClinicalNoteDto note, long noteId)
        {
            try
            {
                // Flatten all questions and answers
                var answers = FlattenQuestions(
                    note.StructuredNote.Node.Questions,
                    noteId,
                    note.MrNo,
                    note.VisitAcNo ?? note.AppointmentId
                    );

                if (answers.Any())
                {
                    // Delete existing answers if updating
                    var existingAnswers = await _context.EmrnotesAnswer
                        .Where(a => a.NoteId == noteId)
                        .ToListAsync();

                    if (existingAnswers.Any())
                    {
                        _context.EmrnotesAnswer.RemoveRange(existingAnswers);
                        await _context.SaveChangesAsync();
                    }

                    // Add new answers
                    var answerEntities = _mapper.Map<List<EmrnotesAnswer>>(answers);
                    await _context.EmrnotesAnswer.AddRangeAsync(answerEntities);
                    await _context.SaveChangesAsync();

                    _logger.LogInformation("Saved {Count} structured question answers for note ID: {NoteId}",
                        answers.Count, noteId);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving structured questions for note ID: {NoteId}", noteId);
                throw;
            }
        }

        private List<AnswerItem> FlattenQuestions(
            List<Question> questions,
            long noteId,
            string mrNo,
            long visitAcNo
           )
        {
            var answers = new List<AnswerItem>();

            foreach (var question in questions)
            {
                if (!string.IsNullOrWhiteSpace(question.Answer))
                {
                    answers.Add(new AnswerItem
                    {
                        NoteId = noteId,
                        Quest_Id = question.Quest_Id,
                        Answer = question.Answer,
                        MrNo = mrNo,
                        VisitAcNo = visitAcNo,
                    });
                }

                if (question.Children != null && question.Children.Any())
                {
                    answers.AddRange(FlattenQuestions(
                        question.Children,
                        noteId,
                        mrNo,
                        visitAcNo
                        ));
                }
            }

            return answers;
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
                    Mrno = note.Mrno,
                    NoteTitle = note.NoteTitle,
                    Description = note.Description,
                    SignedBy = note.SignedBy,
                    VisitDate = note.VisitDate ?? DateTime.Now,
                    IsDeleted = note.IsDeleted ?? false,
                    NotePath = note.NotePath,
                    AppointmentId = note.AppointmentId,
                    NotePathId = note.pathId,
                    FileId = note.File_Id,
                    NoteId = note.Id
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
                    Description = note.Description,
                    NoteTitle = note.NoteTitle,
                    // SignedBy = note.SignedBy,
                    NoteText = transcript,
                    NotePath = filePath,
                    Mrno = note.MrNo,
                    AppointmentId = note.AppointmentId,
                    pathId = note.PathId,
                    File_Id = note.FileId
                };

                return await InsertSpeech(NoteData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in InsertSpeechWithTranscription for MRNo: {Mrno}", note.MrNo);
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

        public async Task<(IEnumerable<GetEMRNoteListDto> Data, int TotalCount)> GetEMRNotesByMRNo(string mrno, int page, int pageSize)
        {
            using var connection = new SqlConnection(_connectionString);

            var parameters = new DynamicParameters();
            parameters.Add("@MRNo", mrno);
            parameters.Add("@Page", page);
            parameters.Add("@PageSize", pageSize);
            parameters.Add("@TotalCount", dbType: DbType.Int32, direction: ParameterDirection.Output);

            var notes = await connection.QueryAsync<GetEMRNoteListDto>(
                "EMRNotes_GetByMRNo",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            var totalCount = parameters.Get<int>("@TotalCount");

            return (notes, totalCount);
        }


        public async Task<EMRNoteDetailDto?> GetEMRNoteByNoteId(long noteId)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);

                var parameters = new DynamicParameters();
                parameters.Add("@NoteId", noteId);

                var result = await connection.QueryFirstOrDefaultAsync<EMRNoteDetailDto>(
                    "EMRNotes_GetByNoteId",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                if (result?.TemplateId > 0)
                {
                    var emrNotesModel = await GetNoteQuestionBYPathId(result.TemplateId ?? 0);

                    // Convert EMRNotesModel to GetEMRNotesModel
                    var getTemplate = new GetEMRNotesModel
                    {
                        NoteTitle = emrNotesModel.NoteTitle,
                        Questions = ConvertNoteModelToGetNoteModel(emrNotesModel.Questions)
                    };

                    var flatQuestions = JsonConvert.DeserializeObject<List<FlatQuestionDto>>(result.AnswerJson)
                                        ?? new List<FlatQuestionDto>();

                    var answerLookup = flatQuestions
                        .Where(q => !string.IsNullOrEmpty(q.Answer))
                        .ToDictionary(q => q.Quest_Id, q => q.Answer);

                    // Populate answers recursively
                    PopulateAnswersRecursively(getTemplate.Questions, answerLookup);

                    // Wrap in a List since AnsweredNotesTemplate expects List<GetEMRNotesModel>
                    result.AnsweredNotesTemplate = new List<GetEMRNotesModel> { getTemplate };
                }

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetEMRNoteByNoteId for NoteId: {NoteId}", noteId);
                return null;
            }
        }

        // Helper method to convert List<NoteModel> to List<GetNoteModel>
        private List<GetNoteModel> ConvertNoteModelToGetNoteModel(List<NoteModel> noteModels)
        {
            if (noteModels == null) return new List<GetNoteModel>();

            var result = new List<GetNoteModel>();

            foreach (var noteModel in noteModels)
            {
                result.Add(new GetNoteModel
                {
                    Quest_Id = noteModel.Quest_Id,
                    Quest_Title = noteModel.Quest_Title,
                    Type = noteModel.Type,
                    Answer = noteModel.Answer,
                    Children = ConvertNoteModelToGetNoteModel(noteModel.Children)
                });
            }

            return result;
        }

        // Recursive method to populate answers
        private void PopulateAnswersRecursively(List<GetNoteModel> questions, Dictionary<long, string> answerLookup)
        {
            if (questions == null) return;

            foreach (var question in questions)
            {
                if (answerLookup.TryGetValue(question.Quest_Id, out var answer))
                {
                    question.Answer = answer;
                }

                if (question.Children != null && question.Children.Any())
                {
                    PopulateAnswersRecursively(question.Children, answerLookup);
                }
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