using Deepgram;
using Deepgram.Models.Listen.v1.REST;
using HMIS.Application.DTOs.AppointmentDTOs;
using HMIS.Application.DTOs.Clinical;
using HMIS.Application.Implementations;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.IO.Compression;
//using static HMIS.Application.DTOs.AppointmentDTOs.SchAppointmentIWithFilter;
using static HMIS.Application.DTOs.AppointmentDTOs.SpLocalModel.SchAppointmentIWithFilter;
namespace HMIS.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : BaseApiController
    {
        private readonly IAppointmentManager _appointmentManager;
        private readonly IConfiguration _configuration;
        TimerElapsed timerElapsed = new TimerElapsed();
        public AppointmentController(IAppointmentManager appointmentManager, IConfiguration configuration)
        {
            _appointmentManager = appointmentManager;
            _configuration = configuration;
        }



        [HttpGet("SearchAppointment")]
        public async Task<IActionResult> SearchAppointment(
            DateTime? FromDate,
             DateTime? ToDate,
             int? ProviderID,
             int? LocationID,
             int? SpecialityID,
             int? SiteID,
             int? FacilityID,
             int? ReferredProviderId,
             long? PurposeOfVisitId,
             int? AppTypeId,
             int? VisitTypeId,
             string? LastUpdatedBy,
             //[FromQuery(Name = "ids")]
             [FromQuery] List<int>? AppStatusIds,
             bool? ShowScheduledAppointmentOnly,
             int? Page, int? Size)
        {
            DataSet result = await _appointmentManager.SearchAppointmentDB(
                    FromDate,
                    ToDate,
                    ProviderID,
                    LocationID,
                    SpecialityID,
                    SiteID,
                    FacilityID,
                    ReferredProviderId,
                    PurposeOfVisitId,
                    AppTypeId,
                    VisitTypeId,
                    LastUpdatedBy,
                    AppStatusIds,   // ✅ yahan bhi plural use hoga
                    ShowScheduledAppointmentOnly,
                    Page,
                    Size
                );

            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpGet("DashboardSearchAppointmentDB")]
        public async Task<IActionResult> DashboardSearchAppointmentDB(
           DateTime? FromDate,
            DateTime? ToDate,
            int? ProviderID,
            int? LocationID,
            int? SpecialityID,
            int? SiteID,
            int? FacilityID,
            int? ReferredProviderId,
            long? PurposeOfVisitId,
            int? AppTypeId,
            int? VisitTypeId,
            string? LastUpdatedBy,
            //[FromQuery(Name = "ids")]
            [FromQuery] List<int>? AppStatusIds,
            bool? ShowScheduledAppointmentOnly,
            int? Page, int? Size)
        {
            DataSet result = await _appointmentManager.DashboardSearchAppointmentDB(
                    FromDate,
                    ToDate,
                    ProviderID,
                    LocationID,
                    SpecialityID,
                    SiteID,
                    FacilityID,
                    ReferredProviderId,
                    PurposeOfVisitId,
                    AppTypeId,
                    VisitTypeId,
                    LastUpdatedBy,
                    AppStatusIds,   // ✅ yahan bhi plural use hoga
                    ShowScheduledAppointmentOnly,
                    Page,
                    Size
                );

            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }


        [HttpPost("GetViewAppointments")]
        public async Task<IActionResult> GetViewAppointmentsDetails(ViewAppointments view)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            DataSet result = await _appointmentManager.GetViewAppointmentDetailsDB(view);


            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpGet("GetAppointmentDetailsByVisitAccountNo")]
        public async Task<IActionResult> GetAppointmentDetails(long VisitAccountNo)
        {
            //table1 = REG_GetUniquePatientOld
            DataSet result = await _appointmentManager.GetAppointmentDetailsDB(VisitAccountNo);


            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }



        [HttpPost("InsertAppointment")]
        public async Task<IActionResult> InsertAppointment(HMIS.Application.DTOs.AppointmentDTOs.SchAppointmentModel schApp)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            //FILE BASED
            //NLogHelper.WriteLog(new LogParameter() { Message = "Insert Appointment", ActionDetails = $"InsertAppointment", ActionId = 1, ActionTime = DateTime.Now, FormName = "SchAppointment table", ModuleName = "AppointmentController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"Insert Appointment > object  = {schApp.ToString()}");




            // schApp.EnteredBy = User.Claims.Where(c => c.Type == "UserName").First().Value;

            //DataSet result1 = await _appointmentManager.ValidateAppointmentDB(schApp);
            //if (result1.Tables[0].Rows.Count > 0)
            //{
            // string res = result1.Tables[0].Rows[0]["ErrorMessage"].ToString();
            //  if (res == "SUCCESS")
            //    {
            var result = await _appointmentManager.InsertAppointmentDB(schApp);


            //FILE BASED
            //NLogHelper.WriteLog(new LogParameter() { Message = "Insert Appointment", ActionDetails = $"InsertAppointment", ActionId = 1, ActionTime = DateTime.Now, FormName = "SchAppointment table", ModuleName = "AppointmentController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"Insert Appointment > object  = {schApp.ToString()}");


            if (result != null)
            {
                return Ok(result);
            }
            return BadRequest(result);


            //  }


            // }
            //  return BadRequest(result1);

        }

        //DataSet result1 = await obj.ValidateAppointmentDB(schApp);
        //if (result1 == "success")
        //{
        //    var result = await obj.InsertAppointmentDB(schApp);


        //    //FILE BASED
        //    NLogHelper.WriteLog(new LogParameter() { Message = "Insert Appointment", ActionDetails = $"InsertAppointment", ActionId = 1, ActionTime = DateTime.Now, FormName = "SchAppointment table", ModuleName = "AppointmentController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"Insert Appointment > object  = {schApp.ToString()}");


        //    if (result != null)
        //    {
        //        return Ok(result);
        //    }

        //    return BadRequest(result);
        //}





        [HttpPut("UpdateAppointment")]
        public async Task<IActionResult> UpdateAppointment(SchAppointmentModel schApp)
        {

            // NLogHelper.WriteLog(new LogParameter() { Message = "Update Appointment", ActionDetails = $"UpdateAppointment", ActionId = 1, ActionTime = DateTime.Now, FormName = "SchAppointment table", ModuleName = "AppointmentController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"Update Appointment > object  = {schApp.ToString()}");

            var result = await _appointmentManager.UpdateAppointmentDB(schApp);

            //NLogHelper.WriteLog(new LogParameter() { Message = "Update Appointment", ActionDetails = $"UpdateAppointment", ActionId = 1, ActionTime = DateTime.Now, FormName = "SchAppointment table", ModuleName = "AppointmentController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"Update Appointment > object  = {schApp.ToString()}");

            if (result)
            {
                return Ok(new { Success = true });
            }

            return BadRequest(result);

        }

        [HttpPut("UpdateAppointmentStatus")]

        //public async Task<IActionResult> UpdateAppointmentStatus(long appId, int appStatusId, int appVisitId)
        public async Task<IActionResult> UpdateAppointmentStatus(long appId, int patientStatusId, int appVisitId)
        {

            var result = await _appointmentManager.AppointmentStatus(appId, patientStatusId, appVisitId);

            //NLogHelper.WriteLog(new LogParameter() { Message = "Update Appointment", ActionDetails = $"UpdateAppointment", ActionId = 1, ActionTime = DateTime.Now, FormName = "SchAppointment table", ModuleName = "AppointmentController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"Update Appointment > object  = {schApp.ToString()}");

            if (result)
            {
                return Ok(new { Success = true });
            }

            return BadRequest(result);
        }

        [HttpGet("SearchAppointmentHistory")]
        public async Task<IActionResult> SearchAppointmentHistory(string MRNo, int? ProviderId, int? PatientStatusId, int? AppStatusId, int? Page, int? Size)
        {


            //FILE BASED
            //  NLogHelper.WriteLog(new LogParameter() { Message = "SearchAppointmentHistoryControllerError", ActionDetails = $"SearchAppointmentHistory", ActionId = 1, ActionTime = DateTime.Now, FormName = "SearchAppointmentHistory", ModuleName = "AppointmentController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }(short)NLog.LogLevel.Info.Ordinal, $"SearchAppointmentHistory > params  = {MRNo}, {ProviderId}, {PatientStatusId},  {AppStatusId},  {Page},  {Size}, {SortColumn}, {SortOrder}");


            //FILE BASED
            // NLogHelper.WriteLog(new LogParameter() { Message = "SearchUsers", ActionDetails = $"SearchUsers", ActionId = 1, ActionTime = DateTime.Now, FormName = "SearchUsers", ModuleName = "UserController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"SearchAppointmentHistory > params  = {MRNo}, {ProviderId}, {PatientStatusId},  {AppStatusId},  {Page},  {Size}, {SortColumn}, {SortOrder}");



            DataSet result = await _appointmentManager.SearchAppointmentHistoryDB(MRNo, ProviderId, PatientStatusId, AppStatusId, Page, Size);


            //FILE BASED
            // NLogHelper.WriteLog(new LogParameter() { Message = "SearchUsers", ActionDetails = $"SearchUsers", ActionId = 1, ActionTime = DateTime.Now, FormName = "SearchUsers", ModuleName = "UserController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"SearchAppointmentHistory > params  = {MRNo}, {ProviderId}, {PatientStatusId},  {AppStatusId},  {Page},  {Size}, {SortColumn}, {SortOrder}");


            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }




        [HttpGet("CancelOrRescheduleAppointment")]
        public async Task<IActionResult> CancelOrRescheduleAppointment(long AppId, int AppStatusId, bool ByProvider, int? RescheduledId)
        {

            // NLogHelper.WriteLog(new LogParameter() { Message = "CancelOrRescheduleAppointment", ActionDetails = $"CancelOrRescheduleAppointment", ActionId = 1, ActionTime = DateTime.Now, FormName = "SchAppointment table", ModuleName = "AppointmentController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"SearchAppointment > param  = {AppId},{RescheduledId}");

            var result = await _appointmentManager.CancelOrRescheduleAppointmentDB(AppId, AppStatusId, ByProvider, RescheduledId);

            //NLogHelper.WriteLog(new LogParameter() { Message = "CancelOrRescheduleAppointment", ActionDetails = $"CancelOrRescheduleAppointment", ActionId = 1, ActionTime = DateTime.Now, FormName = "SchAppointment table", ModuleName = "AppointmentController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"SearchAppointment > param  = {AppId},{RescheduledId}");
            if (result)
            {
                return Ok(new { Success = true });
            }

            return BadRequest(result);

        }


        [HttpGet("ViewAppointmentByAppId")]
        public async Task<IActionResult> ValidateCheckIn(long AppId)
        {


            var result = await _appointmentManager.ValidateCheckInDB(AppId);

            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest(result);

        }

        [HttpGet("EditAppoimentByAppId")]

        public async Task<IActionResult> EditAppoimentByAppId(long appId)
        {
            try
            {
                var result = await _appointmentManager.GetAppoimentForEditById(appId);
                if (result != null)
                {
                    return Ok(result);

                }
                return BadRequest(result);

            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        //[HttpPut("UpdateByAppId")]
        //public async Task<IActionResult> UpdateAppointment(SchAppointment schApp)
        //{

        //    // NLogHelper.WriteLog(new LogParameter() { Message = "Update Appointment", ActionDetails = $"UpdateAppointment", ActionId = 1, ActionTime = DateTime.Now, FormName = "SchAppointment table", ModuleName = "AppointmentController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"Update Appointment > object  = {schApp.ToString()}");

        //    var result = await _appointmentManager.UpdateAppointmentDB(schApp);

        //    // NLogHelper.WriteLog(new LogParameter() { Message = "Update Appointment", ActionDetails = $"UpdateAppointment", ActionId = 1, ActionTime = DateTime.Now, FormName = "SchAppointment table", ModuleName = "AppointmentController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"Update Appointment > object  = {schApp.ToString()}");

        //    if (result)
        //    {
        //        return Ok(new { Success = true });
        //    }

        //    return BadRequest(result);

        //}

        [HttpPut("UpdateRescheduleById")]
        public async Task<IActionResult> UpdateReschedule(SchRescheduleAppointments schReschedule)
        {

            // NLogHelper.WriteLog(new LogParameter() { Message = "Update Appointment", ActionDetails = $"UpdateAppointment", ActionId = 1, ActionTime = DateTime.Now, FormName = "SchAppointment table", ModuleName = "AppointmentController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"Update Appointment > object  = {schApp.ToString()}");

            var result = await _appointmentManager.UpdateRescheduleAppointmentDB(schReschedule);

            // NLogHelper.WriteLog(new LogParameter() { Message = "Update Appointment", ActionDetails = $"UpdateAppointment", ActionId = 1, ActionTime = DateTime.Now, FormName = "SchAppointment table", ModuleName = "AppointmentController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"Update Appointment > object  = {schApp.ToString()}");

            if (result)
            {
                return Ok(new { Success = true });
            }

            return BadRequest(result);

        }

        [HttpGet("SpeechtoText")]
        public async Task<IActionResult> SpeechtoText(int? MRNo, int? PageNumber, int? PageSize)
        {

            DataSet result = await _appointmentManager.SpeechtoText(MRNo, PageNumber, PageSize);

            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        //[HttpPost("InsertSpeech")]
        //public async Task<IActionResult> InsertSpeech(SpeechModel sp)

        //{
        //    var result = await _appointmentManager.InsertSpeech(sp);

        //    //NLogHelper.WriteLog(new LogParameter() { Message = "Update Appointment", ActionDetails = $"UpdateAppointment", ActionId = 1, ActionTime = DateTime.Now, FormName = "SchAppointment table", ModuleName = "AppointmentController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"Update Appointment > object  = {schApp.ToString()}");

        //    if (result)
        //    {
        //        return Ok(new { Success = true });
        //    }

        //    return BadRequest(result);
        //}

        //[HttpPost("InsertSpeech")]
        //public async Task<IActionResult> InsertSpeech([FromBody] ClinicalNoteDto note)
        //{
        //    try
        //    {
        //        string? transcript = null;
        //        string? fileUrl = null;
        //        string? zipPath = null;

        //        // Only process voice file if it exists
        //        if (!string.IsNullOrEmpty(note.VoiceFile))
        //        {
        //            // Optionally: Initialize logging if Deepgram SDK needs it
        //            Deepgram.Library.Initialize(); // Optional, only if your SDK uses it

        //            // Read API key (either from env or directly)
        //            //string apiKey = Environment.GetEnvironmentVariable("433829a3a9a2cf7581722504d21ef82fc50742ed");
        //            string apiKey = "9fdf56b01c4d873bf1d2cbeaad4c0a48b1dc609c";
        //            // OR: string apiKey = "your_api_key";

        //            // Create the client
        //            var listenClient = ClientFactory.CreateListenRESTClient(apiKey);

        //            // Convert Base64 to byte[]
        //            byte[] audioBytes = Convert.FromBase64String(note.VoiceFile);

        //            // Define file path
        //            string fileName = $"{note.AppointmentId}_{Guid.NewGuid()}.webm";
        //            string zipName = Path.ChangeExtension(fileName, ".zip");
        //            string folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "voice-notes");
        //            Directory.CreateDirectory(folderPath);
        //            string filePath = Path.Combine(folderPath, fileName);
        //            zipPath = Path.Combine(folderPath, zipName);

        //            // Save to disk

        //            // Compress to .zip
        //            using (FileStream zipToOpen = new FileStream(zipPath, FileMode.Create))
        //            using (ZipArchive archive = new ZipArchive(zipToOpen, ZipArchiveMode.Create))
        //            {
        //                var zipEntry = archive.CreateEntry(fileName);
        //                using var originalFileStream = new MemoryStream(audioBytes);
        //                using var entryStream = zipEntry.Open();
        //                await originalFileStream.CopyToAsync(entryStream);
        //            }

        //            //await System.IO.File.WriteAllBytesAsync(zipPath, audioBytes);
        //            await System.IO.File.WriteAllBytesAsync(filePath, audioBytes);

        //            // ✅ Save file path in DB (you can modify as needed)
        //            fileUrl = $"/uploads/voice-notes/{fileName}";

        //            //// 1. Convert Base64 to byte[]
        //            //byte[] audioBytes = Convert.FromBase64String(note.VoiceFile);

        //            //// 2. Define file names and paths
        //            //string fileName = $"{Guid.NewGuid()}.webm";
        //            //string zipName = Path.ChangeExtension(fileName, ".zip");
        //            //string folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "voice-notes");
        //            //Directory.CreateDirectory(folderPath);
        //            //string webmPath = Path.Combine(folderPath, fileName);
        //            //string zipPath = Path.Combine(folderPath, zipName);

        //            //// 3. Save .webm file temporarily
        //            //await File.WriteAllBytesAsync(webmPath, audioBytes);

        //            //// 4. Compress the .webm into .zip
        //            //using (FileStream zipToOpen = new FileStream(zipPath, FileMode.Create))
        //            //using (ZipArchive archive = new ZipArchive(zipToOpen, ZipArchiveMode.Create))
        //            //{
        //            //    var zipEntry = archive.CreateEntry(fileName);
        //            //    using var entryStream = zipEntry.Open();
        //            //    using var fileToZip = new FileStream(webmPath, FileMode.Open, FileAccess.Read);
        //            //    await fileToZip.CopyToAsync(entryStream);
        //            //}

        //            //// 5. Delete the temporary .webm file
        //            //File.Delete(webmPath);

        //            //// 6. File URL to save in DB
        //            //string fileUrl = $"/uploads/voice-notes/{zipName}";

        //            // TODO: Save note info + fileUrl to your database
        //            // Read the audio back from disk

        //            //var audioData = await System.IO.File.ReadAllBytesAsync(filePath);
        //            //var audioData = audioBytes; 

        //            var response = await listenClient.TranscribeFile(
        //                audioBytes,
        //                new PreRecordedSchema()
        //                {
        //                    Model = "nova-3"
        //                });

        //            transcript = response.Results.Channels[0].Alternatives[0].Transcript;
        //        }

        //        // Create note data object (with or without transcription)
        //        var NoteData = new ClinicalNoteObj()
        //        {
        //            Id = note.Id,
        //            CreatedBy = note.CreatedBy,
        //            Description = note.Description,
        //            NoteTitle = note.NoteTitle,
        //            SignedBy = note.SignedBy,
        //            UpdatedBy = note.UpdatedBy,
        //            NoteText = transcript,
        //            NotePath = zipPath,
        //            Mrno = note.mrNo,
        //            AppointmentId = note.AppointmentId
        //        };

        //        var result = await _appointmentManager.InsertSpeech(NoteData);

        //        if (result == true)
        //        {
        //            return Ok(new
        //            {
        //                message = "Note saved",
        //                fileUrl,
        //                transcript
        //            });
        //        }
        //        else
        //        {
        //            return StatusCode(500, $"Internal Server Error");
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"Internal Server Error: {ex.Message}");
        //    }
        //}

        //[HttpPost("InsertSpeech")]
        //public async Task<IActionResult> InsertSpeech([FromBody] ClinicalNoteDto note)
        //{
        //    if (string.IsNullOrEmpty(note.VoiceFile))
        //        return BadRequest("Voice data missing");

        //    try
        //    {
        //        // Initialize Deepgram
        //        Library.Initialize();
        //        var apiKey = "9fdf56b01c4d873bf1d2cbeaad4c0a48b1dc609c";
        //        var listenClient = ClientFactory.CreateListenRESTClient(apiKey);

        //        // Decode base64
        //        byte[] audioBytes = Convert.FromBase64String(note.VoiceFile);

        //        // Prepare paths
        //        string fileName = $"{Guid.NewGuid()}.webm";
        //        string zipName = Path.ChangeExtension(fileName, ".zip");

        //        string folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "voice-notes");
        //        Directory.CreateDirectory(folderPath);

        //        string filePath = Path.Combine(folderPath, fileName);
        //        string zipPath = Path.Combine(folderPath, zipName);

        //        // Save original .webm
        //        //await System.IO.File.WriteAllBytesAsync(filePath, audioBytes);
        //        var audioData = await System.IO.File.ReadAllBytesAsync(filePath);

        //        // Compress to .zip
        //        using (FileStream zipToOpen = new FileStream(zipPath, FileMode.Create))
        //        using (ZipArchive archive = new ZipArchive(zipToOpen, ZipArchiveMode.Create))
        //        {
        //            var zipEntry = archive.CreateEntry(fileName);
        //            using var originalFileStream = new MemoryStream(audioBytes);
        //            using var entryStream = zipEntry.Open();
        //            await originalFileStream.CopyToAsync(entryStream);
        //        }

        //        // Transcribe from raw .webm
        //        //var response = await listenClient.TranscribeFile(
        //        //    audioBytes,
        //        //    new PreRecordedSchema() { Model = "nova-3" }
        //        //);

        //        var response = await listenClient.TranscribeFile(
        //            audioData,
        //            new PreRecordedSchema()
        //            {
        //                Model = "nova-3"
        //            });

        //        string transcript = response.Results.Channels[0].Alternatives[0].Transcript;

        //        // Save note
        //        var NoteData = new ClinicalNoteObj()
        //        {
        //            Id = note.Id,
        //            CreatedBy = note.CreatedBy,
        //            Description = note.Description,
        //            NoteTitle = note.NoteTitle,
        //            SignedBy = note.SignedBy,
        //            UpdatedBy = note.UpdatedBy,
        //            NoteText = transcript,
        //            NotePath = zipPath, // Save compressed path
        //            Mrno = note.mrNo
        //        };

        //        var result = await _appointmentManager.InsertSpeech(NoteData);

        //        return Ok(new
        //        {
        //            message = "Note saved",
        //            fileUrl = $"/uploads/voice-notes/{zipName}",
        //            transcript
        //        });
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"Internal Server Error: {ex.Message}");
        //    }
        //}


        [HttpGet("GetSpecialitybyFacilityId")]
        public async Task<IActionResult> GetSpecialitybyFacilityid(int FacilityId)
        {
            /*if(FacilityId != 0|| FacilityId != null)
            { 
            }

            return BadRequest(FacilityId);*/
            var result = await _appointmentManager.GetVwSpecialitybyFacilityid(FacilityId);
            if (result != null)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpGet("GetSitebySpecialityId")]
        public async Task<IActionResult> GetSitebySpecialityId(int SpecialtyId)
        {
            /*if (SpecialtyId != 0 || SpecialtyId != null)
            { 
            }

            return BadRequest(SpecialtyId);*/
            var result = await _appointmentManager.GetSitebySpecialityId(SpecialtyId);
            if (result != null)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpGet("GetProviderbySiteId")]
        public async Task<IActionResult> GetProviderbySiteId(int SiteId)
        {
            /*            if (SiteId != 0 || SiteId != null)
                        { 
                        }

                        return BadRequest(SiteId);*/
            var result = await _appointmentManager.GetProviderbySiteId(SiteId);
            if (result != null)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpGet("GetProviderByFacilityId")]
        public async Task<IActionResult> GetProviderByFacilityId(int FacilityId)
        {

            /*            if (FacilityId != 0 || FacilityId != null)
                        { 
                        }

                        return BadRequest(FacilityId);*/
            var result = await _appointmentManager.GetProviderByFacilityId(FacilityId);
            if (result != null)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpGet("GetSpecialityByEmployeeId")]
        public async Task<IActionResult> GetSpecialityByEmployeeId(int EmployeeId)
        {
            if (EmployeeId != 0 || EmployeeId != null)
            {
            }
            var result = await _appointmentManager.GetSpecialityByEmployeeId(EmployeeId);
            if (result != null)
            {
                return Ok(result);
            }
            return BadRequest(result);

        }

        [HttpGet("GetSiteByProviderId")]
        public async Task<IActionResult> GetSiteByproviderId(int EmployeeId)
        {

            var result = await _appointmentManager.GetSiteByproviderId(EmployeeId);
            if (result != null)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }


        [HttpGet("GetTimeSlotbySiteId")]
        public async Task<IActionResult> GetTimeSlotbySiteId(int SiteId)
        {

            var result = await _appointmentManager.GetTimeSlotbySiteId(SiteId);
            if (result != null)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpGet("GetTimeSlots")]
        public async Task<IActionResult> GetTimeSlots(int SiteId, int ProviderId, int FacilityId, string Days)
        {
            var result = await _appointmentManager.GetTimeSlots(SiteId, ProviderId, FacilityId, Days);
            if (result != null)
            {
                return Ok(result);
            }
            return Ok(result);
        }

        [HttpGet("GetSchAppointmentList")]
        public async Task<IActionResult> GetSchAppointmentList(int? SiteId, int? ProviderId, int? FacilityId, int? SpecialityId, string? Date)
        {
            var result = await _appointmentManager.GetSchAppointmentList(SiteId, ProviderId, FacilityId, SpecialityId, Date);
            if (result != null)
            {
                return Ok(result);
            }
            return Ok(result);
        }


        //[HttpPost("AddBLPatientVisit")]
        //public async Task<IActionResult> AddBLPatientVisit(BlPatientVisitModel req)
        //{
        //    var result = await _appointmentManager.AddBLPatientVisit(req);
        //    if (result != null)
        //    {
        //        return Ok(new { Success = true });
        //    }
        //    return BadRequest(result);
        //}

        [HttpPost("SearchAppointmentDBWithPagination")]
        public async Task<IActionResult> SearchAppointmentDBWithPagination(SchAppointmentIWithFilterRequest req)
        {
            var result = await _appointmentManager.SearchAppointmentDBWithPagination(req);
            if (result != null)
            {
                return Ok(result);
            }
            return Ok(result);
        }

    }


}