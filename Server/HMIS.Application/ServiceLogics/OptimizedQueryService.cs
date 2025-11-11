using Microsoft.EntityFrameworkCore;
using HMIS.Core.Entities;
using HMIS.Infrastructure.ORM;
using HMIS.Core.Context;

namespace HMIS.Application.ServiceLogics
{
    /// <summary>
    /// Optimized Query Service to resolve N+1 query issues
    /// Roman Urdu: N+1 query problem ka hal - ek hi query mein sab data load karna
    /// </summary>
    public class OptimizedQueryService
    {
        private readonly HMISDbContext _context;

        public OptimizedQueryService(HMISDbContext context)
        {
            _context = context;
        }

        #region "❌ WRONG WAY - N+1 Problem Examples"
        
        /// <summary>
        /// ❌ GALAT TARIKA - Ye N+1 problem create karta hai
        /// Roman Urdu: Har patient ke liye alag query chalti hai
        /// </summary>
        public async Task<List<RegPatient>> GetPatientsWithAppointments_WRONG()
        {
            // 1 query for patients
            var patients = await _context.RegPatient.Take(10).ToListAsync();

            foreach (var patient in patients)
            {
                // 10 separate queries - BAHUT SLOW!
                var appointments = await _context.SchAppointment
                    .Where(a => a.Mrno == patient.Mrno)
                    .ToListAsync();
            }

            return patients; // Total: 1 + 10 = 11 queries
        }

        #endregion

        #region "✅ CORRECT WAY - Optimized Solutions"

        /// <summary>
        /// ✅ SAHI TARIKA - Include() use karke ek hi query mein sab data
        /// Roman Urdu: Sirf 1 query chalegi, sab data mil jayega
        /// </summary>
        public async Task<List<RegPatient>> GetPatientsWithAppointments_OPTIMIZED()
        {
            // Single optimized query with Include
            var patients = await _context.RegPatient
                .Include(p => p.SchAppointment.Take(5)) // Latest 5 appointments only
                .Include(p => p.RegPatientDetails)
                .Where(p => p.IsDeleted != true)
                .Take(10)
                .AsNoTracking() // Memory optimization
                .ToListAsync();

            return patients; // Total: SIRF 1 QUERY!
        }

        /// <summary>
        /// ✅ Projection-based optimization - Sirf zaroori fields
        /// Roman Urdu: Sirf zaroori data load karna, memory bachane ke liye
        /// </summary>
        public async Task<List<object>> GetPatientAppointmentSummary_PROJECTION()
        {
            var result = await _context.RegPatient
                .Where(p => p.IsDeleted != true)
                .Select(p => new
                {
                    PatientId = p.PatientId,
                    MRNo = p.Mrno,
                    PatientName = p.PersonFirstName + " " + p.PersonLastName,
                    TotalAppointments = p.SchAppointment.Count(),
                    LatestAppointment = p.SchAppointment
                        .OrderByDescending(a => a.AppDateTime)
                        .Select(a => new
                        {
                            a.AppId,
                            a.AppDateTime,
                            a.AppStatusId
                        })
                        .FirstOrDefault()
                })
                .Take(50)
                .ToListAsync<object>();

            return result; // Single query with minimal data
        }

        /// <summary>
        /// ✅ Batch loading optimization
        /// Roman Urdu: Batches mein data load karna performance ke liye
        /// </summary>
        public async Task<List<SchAppointment>> GetAppointmentsByProviders_BATCH(List<long> providerIds)
        {
            // Single query for multiple providers
            var appointments = await _context.SchAppointment
                .Where(a => providerIds.Contains(a.ProviderId))
                .Include(a => a.Patient)
                .Where(a => a.AppDateTime >= DateTime.Today)
                .OrderBy(a => a.AppDateTime)
                .AsNoTracking()
                .ToListAsync();

            return appointments; // 1 query instead of N queries
        }

        /// <summary>
        /// ✅ Split Query optimization for complex includes
        /// Roman Urdu: Complex relationships ke liye split queries
        /// </summary>
        public async Task<List<RegPatient>> GetPatientsWithComplexData_SPLIT()
        {
            var patients = await _context.RegPatient
                .AsSplitQuery() // Multiple optimized queries instead of huge JOIN
                .Include(p => p.SchAppointment.Take(3))
                .Include(p => p.PatientProblem.Take(5))
                .Include(p => p.Insured.Take(2))
                .Where(p => p.IsDeleted != true)
                .Take(20)
                .AsNoTracking()
                .ToListAsync();

            return patients; // 4 optimized queries instead of 1 huge slow query
        }

        #endregion

        #region "🚀 Advanced Optimization Techniques"

        /// <summary>
        /// 🚀 Compiled Query - Pre-compiled for better performance
        /// Roman Urdu: Query ko pehle se compile kar ke speed badhana
        /// </summary>
        private static readonly Func<HMISDbContext, string, Task<RegPatient?>> GetPatientByMRNo =
            EF.CompileAsyncQuery((HMISDbContext context, string mrno) =>
                context.RegPatient
                    .Include(p => p.SchAppointment.Take(5))
                    .AsNoTracking()
                    .FirstOrDefault(p => p.Mrno == mrno));

        public async Task<RegPatient?> GetPatientOptimized(string mrno)
        {
            return await GetPatientByMRNo(_context, mrno);
        }

        /// <summary>
        /// 🚀 Raw SQL for complex queries
        /// Roman Urdu: Complex queries ke liye direct SQL use karna
        /// </summary>
        public async Task<List<object>> GetAppointmentStatistics_RAW_SQL()
        {
            var sql = @"
                SELECT 
                    p.MRNo,
                    p.PersonFirstName + ' ' + p.PersonLastName as PatientName,
                    COUNT(a.AppId) as TotalAppointments,
                    MAX(a.AppDateTime) as LastAppointment
                FROM RegPatient p
                LEFT JOIN SchAppointment a ON p.MRNo = a.MRNo
                WHERE p.IsDeleted != 1
                GROUP BY p.MRNo, p.PersonFirstName, p.PersonLastName
                ORDER BY TotalAppointments DESC";

            var result = await _context.Database
                .SqlQueryRaw<object>(sql)
                .ToListAsync();

            return result; // Single optimized SQL query
        }

        #endregion

        #region "📊 Performance Monitoring"

        /// <summary>
        /// 📊 Query performance monitoring
        /// Roman Urdu: Query ki performance check karna
        /// </summary>
        public async Task<string> MonitorQueryPerformance()
        {
            var stopwatch = System.Diagnostics.Stopwatch.StartNew();

            var patients = await _context.RegPatient
                .Include(p => p.SchAppointment)
                .Take(10)
                .AsNoTracking()
                .ToListAsync();

            stopwatch.Stop();

            return $"Query executed in {stopwatch.ElapsedMilliseconds}ms for {patients.Count} patients";
        }

        #endregion
    }

    /// <summary>
    /// Repository pattern with optimized queries
    /// Roman Urdu: Repository pattern se organized queries
    /// </summary>
    public class OptimizedPatientRepository
    {
        private readonly HMISDbContext _context;

        public OptimizedPatientRepository(HMISDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get patients with pagination and includes
        /// Roman Urdu: Pagination ke saath optimized patient data
        /// </summary>
        public async Task<(List<RegPatient> Patients, int TotalCount)> GetPatientsPagedAsync(
            int pageNumber, int pageSize, string? searchTerm = null)
        {
            var query = _context.RegPatient
                .Include(p => p.SchAppointment.OrderByDescending(a => a.AppDateTime).Take(3))
                .Where(p => p.IsDeleted != true);

            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(p => 
                    p.PersonFirstName.Contains(searchTerm) ||
                    p.PersonLastName.Contains(searchTerm) ||
                    p.Mrno.Contains(searchTerm));
            }

            var totalCount = await query.CountAsync();

            var patients = await query
                .OrderBy(p => p.PersonLastName)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .AsNoTracking()
                .ToListAsync();

            return (patients, totalCount);
        }
    }
}
