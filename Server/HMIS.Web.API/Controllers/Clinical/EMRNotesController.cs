//using Deepgram;
//using HMIS.Common.Logger;
//using HMIS.Service.DTOs;
//using HMIS.Service.DTOs.AppointmentDTOs;
//using HMIS.Service.DTOs.Clinical;
//using HMIS.Service.Implementations;
//using HMIS.Service.ServiceLogics;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.IdentityModel.Logging;
//using System.Data;
//using Deepgram;


using Deepgram;
using Deepgram.Models.Manage.v1;
using HMIS.Application.DTOs.Clinical;
using HMIS.Application.Implementations;
using HMIS.Application.ServiceLogics;
using HMIS.Service.Implementations;
using HMIS.Web.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Logging;
using System.Data;
using System.IO.Compression;
using Deepgram.Models.Listen.v1.REST;

namespace HMIS.API.Controllers.Clinical
{
    [Route("api/[controller]")]
    [ApiController]
   
    public class EMRNotesController : BaseApiController
    {
        private readonly IEMRNotesManager _eMRNotesManager;
        private readonly IConfiguration _configuration;
        TimerElapsed timerElapsed = new TimerElapsed();
        public EMRNotesController(IEMRNotesManager eMRNotesManager, IConfiguration configuration)
        {
            _eMRNotesManager = eMRNotesManager;
            _configuration = configuration;
        }
        [HttpGet("GetNoteQuestionBYPathId")]
        public async Task<IActionResult> GetNoteQuestionBYPathId(int PathId)
        {
            var node = _eMRNotesManager.GetNoteQuestionBYPathId(PathId);

            //string json = JsonConvert.SerializeObject(result, Formatting.Indented);
            //Console.WriteLine(json);
            return Ok(new
            {
                node
                //Data = drugs,
                //TotalCount = totalCount
            });
        }
        [HttpGet("EMRNotesGetByEmpId")]
        public async Task<IActionResult> EMRNotesGetByEmpId(int EmpId)
        {
            var result = _eMRNotesManager.EMRNotesGetByEmpId(EmpId);

            
            return Ok(new
            {
                result
               
            });
        }

        [HttpPost("InsertSpeech")]
        public async Task<IActionResult> InsertSpeech([FromBody] ClinicalNoteDto note)
        {

            //if (string.IsNullOrEmpty(note.VoiceFile))
            //    return BadRequest("Voice data missing");

            try
            {
                // Optionally: Initialize logging if Deepgram SDK needs it
                Library.Initialize(); // Optional, only if your SDK uses it

                // Read API key (either from env or directly)
                //string apiKey = Environment.GetEnvironmentVariable("433829a3a9a2cf7581722504d21ef82fc50742ed");
                string apiKey = "9fdf56b01c4d873bf1d2cbeaad4c0a48b1dc609c";
                // OR: string apiKey = "your_api_key";

                // Create the client
                var listenClient = ClientFactory.CreateListenRESTClient(apiKey);
                string transcript = "";
                string filePath = "";
                // Convert Base64 to byte[]

                //string voicefile=
                if (!(string.IsNullOrEmpty(note.VoiceFile)))
                {
                    byte[] audioBytes = Convert.FromBase64String(note.VoiceFile);

                    string fileName = $"{note.AppointmentId}_{Guid.NewGuid()}.webm";
                    string zipName = Path.ChangeExtension(fileName, ".zip");
                    string folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "voice-notes");
                    Directory.CreateDirectory(folderPath);
                     filePath = Path.Combine(folderPath, fileName);
                    string zipPath = Path.Combine(folderPath, zipName);

                    // Save to disk

                    // Compress to .zip
                    //using (FileStream zipToOpen = new FileStream(zipPath, FileMode.Create))
                    //using (ZipArchive archive = new ZipArchive(zipToOpen, ZipArchiveMode.Create))
                    //{
                    //    var zipEntry = archive.CreateEntry(fileName);
                    //    using var originalFileStream = new MemoryStream(audioBytes);
                    //    using var entryStream = zipEntry.Open();
                    //    await originalFileStream.CopyToAsync(entryStream);
                    //}

                    //await System.IO.File.WriteAllBytesAsync(zipPath, audioBytes);
                    await System.IO.File.WriteAllBytesAsync(filePath, audioBytes);

                    // ✅ Save file path in DB (you can modify as needed)
                    string fileUrl = $"/uploads/voice-notes/{fileName}";

                    //// 1. Convert Base64 to byte[]
                    //byte[] audioBytes = Convert.FromBase64String(note.VoiceFile);

                    //// 2. Define file names and paths
                    //string fileName = $"{Guid.NewGuid()}.webm";
                    //string zipName = Path.ChangeExtension(fileName, ".zip");
                    //string folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "voice-notes");
                    //Directory.CreateDirectory(folderPath);
                    //string webmPath = Path.Combine(folderPath, fileName);
                    //string zipPath = Path.Combine(folderPath, zipName);

                    //// 3. Save .webm file temporarily
                    //await File.WriteAllBytesAsync(webmPath, audioBytes);

                    //// 4. Compress the .webm into .zip
                    //using (FileStream zipToOpen = new FileStream(zipPath, FileMode.Create))
                    //using (ZipArchive archive = new ZipArchive(zipToOpen, ZipArchiveMode.Create))
                    //{
                    //    var zipEntry = archive.CreateEntry(fileName);
                    //    using var entryStream = zipEntry.Open();
                    //    using var fileToZip = new FileStream(webmPath, FileMode.Open, FileAccess.Read);
                    //    await fileToZip.CopyToAsync(entryStream);
                    //}

                    //// 5. Delete the temporary .webm file
                    //File.Delete(webmPath);

                    //// 6. File URL to save in DB
                    //string fileUrl = $"/uploads/voice-notes/{zipName}";

                    // TODO: Save note info + fileUrl to your database
                    // Read the audio back from disk

                    //var audioData = await System.IO.File.ReadAllBytesAsync(filePath);
                    //var audioData = audioBytes; 

                    var response = await listenClient.TranscribeFile(
                        audioBytes,
                        new PreRecordedSchema()
                        {
                            Model = "nova-3"
                        });

                    transcript = response.Results.Channels[0].Alternatives[0].Transcript;
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
                    pathId = note.pathId
                };

                var result = await _eMRNotesManager.InsertSpeech(NoteData);

                return Ok(result);

                //if (result == true)
                //{
                //return Ok(new
                //{
                //    message = "Note saved",
                //    fileUrl,
                //    transcript,
                //    result
                //});
                //}
                //else
                //{
                //    return StatusCode(500, $"Internal Server Error");
                //}

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

    }
}
