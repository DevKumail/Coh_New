using HMIS.Core.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace HMIS.Core.Context
{
	public partial class HMISDbContext
	{
		private readonly IHttpContextAccessor _accessor;

		public HMISDbContext(DbContextOptions<HMISDbContext> options,
							 IHttpContextAccessor accessor)
			: this(options)  
		{
			_accessor = accessor;
		}

		public override int SaveChanges()
		{
			ApplyAudit();
			return base.SaveChanges();
		}

		public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
		{
			ApplyAudit();
			return base.SaveChangesAsync(cancellationToken);
		}

		private void ApplyAudit()
		{
			var userIdString = _accessor?.HttpContext?.User?.FindFirst("UserId")?.Value;

			int userId = 0; 
			if (!string.IsNullOrEmpty(userIdString))
			{
				int.TryParse(userIdString, out userId);
			}

			var now = DateTime.UtcNow;

			foreach (var entry in ChangeTracker.Entries())
			{
				if (entry.State == EntityState.Added)
				{
					if (entry.Properties.Any(p => p.Metadata.Name == "CreatedAt"))
						entry.Property("CreatedAt").CurrentValue = now;
						entry.Property("CreatedAt").IsModified = true;


                    if (entry.Properties.Any(p => p.Metadata.Name == "CreatedBy"))
						entry.Property("CreatedBy").CurrentValue = userId;
					    entry.Property("CreatedBy").IsModified = true;

                }

                if (entry.State == EntityState.Modified)
				{
					if (entry.Properties.Any(p => p.Metadata.Name == "UpdatedAt"))
						entry.Property("UpdatedAt").CurrentValue = now;

					if (entry.Properties.Any(p => p.Metadata.Name == "UpdatedBy"))
						entry.Property("UpdatedBy").CurrentValue = userId;

					if (entry.Properties.Any(p => p.Metadata.Name == "CreatedAt"))
						entry.Property("CreatedAt").IsModified = false;

					if (entry.Properties.Any(p => p.Metadata.Name == "CreatedBy"))
						entry.Property("CreatedBy").IsModified = false;
				}
			}
		}

	}
}
