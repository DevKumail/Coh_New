using HMIS.Application.DTOs.IVFDTOs.EpisodeDto.Overview;
using HMIS.Core.Context;
using HMIS.Core.Entities;
using HMIS.Infrastructure.ORM;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Application.ServiceLogics.IVF.Episode.Overview
{
    public interface IEventService 
    {
        Task<(bool isSuccess, string message)> CreateEvent(EventCreateDto dto);
        Task<(bool isSuccess, string message)> UpdateEvent(int eventId, EventCreateDto dto);
        Task<(bool isSuccess, string message)> DeleteEvent(int eventId);
    }

    public class EventService : IEventService
    {
        private readonly DapperContext _dapper;
        private readonly HMISDbContext _context;
        public EventService(DapperContext dapper, HMISDbContext context) 
        {
            _dapper = dapper;
            _context = context;
        }
        public async Task<(bool isSuccess, string message)> CreateEvent(EventCreateDto dto)
        {
            if (dto.OverviewId == 0 || dto.CategoryId == 0 || dto.AppId == 0)
                return (false, "Invalid input. Some required IDs are missing.");

            try
            {
                var overviewExists = await _context.IvftreatmentEpisodeOverviewStage
                    .AnyAsync(x => x.OverviewId == dto.OverviewId);

                if (!overviewExists)
                    return (false, "Overview does not exist.");

                var entity = new IvfepisodeOverviewEvents
                {
                    OverviewId = dto.OverviewId,
                    EventTypeCategoryId = dto.CategoryId,
                    AppointmentId = dto.AppId,
                    StartDate = dto.Startdate,
                    EndDate = dto.Enddate
                };

                await _context.IvfepisodeOverviewEvents.AddAsync(entity);
                await _context.SaveChangesAsync();

                return (true, "Event created successfully.");
            }
            catch (Exception ex)
            {
                return (false, $"An error occurred: {ex.Message}");
            }
        }

        public async Task<(bool isSuccess, string message)> UpdateEvent(int eventId, EventCreateDto dto)
        {
            if (dto.OverviewId == 0 || dto.CategoryId == 0 || dto.AppId == 0)
                return (false, "Invalid input. Some required IDs are missing.");

            try
            {
                var overviewExists = await _context.IvftreatmentEpisodeOverviewStage
                    .AnyAsync(x => x.OverviewId == dto.OverviewId);

                if (!overviewExists)
                    return (false, "Overview does not exist.");

                var entity = await _context.IvfepisodeOverviewEvents
                    .FirstOrDefaultAsync(x => x.EventId == eventId);

                if (entity == null)
                    return (false, "Event not found.");

                entity.OverviewId = dto.OverviewId;
                entity.EventTypeCategoryId = dto.CategoryId;
                entity.AppointmentId = dto.AppId;
                entity.StartDate = dto.Startdate;
                entity.EndDate = dto.Enddate;

                await _context.SaveChangesAsync();

                return (true, "Event updated successfully.");
            }
            catch (Exception ex)
            {
                return (false, $"An error occurred: {ex.Message}");
            }
        }

        public async Task<(bool isSuccess, string message)> DeleteEvent(int eventId)
        {
            try
            {
                var entity = await _context.IvfepisodeOverviewEvents
                    .FirstOrDefaultAsync(x => x.EventId == eventId);

                if (entity == null)
                    return (false, "Event not found.");

                entity.IsDeleted = true;

                await _context.SaveChangesAsync();

                return (true, "Event deleted successfully.");
            }
            catch (Exception ex)
            {
                return (false, $"An error occurred: {ex.Message}");
            }
        }
    }
}
