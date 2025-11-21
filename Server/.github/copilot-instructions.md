## Purpose
This file gives concise, repository-specific guidance for AI coding agents working on the HMIS server solution. Focus on practical, discoverable patterns, integration points, and examples that help an agent be productive immediately.

## Big picture (how this repo is structured)
- Root solution: `HealthManagementInformationSystem.sln` (multiple projects under this Server folder).
- API surface: `HMIS.Web.API` (Program.cs configures DI, logging, AutoMapper, JWT, Swagger, and calls shared/service registrations).
- Application layer: `HMIS.Application` contains DTOs, service interfaces (Implementations folder), service logic implementations (`ServiceLogics`), and `ServiceRegistry/ServiceRegistration.cs` which registers scoped services used by the API.
- Core: `HMIS.Core` holds `HMISDbContext`, EF Core entities and shared types.
- Infrastructure: `HMIS.Infrastructure` implements repositories, Dapper helpers, custom type handlers and service extension helpers.

## Key patterns an agent should follow
- Dependency injection: central registration happens in `HMIS.Application/ServiceRegistry/ServiceRegistration.cs`. New services should be:
  1. Interface in `HMIS.Application/Implementations` (I* naming).
 2. Implementation in `HMIS.Application/ServiceLogics` (Manager/Service suffixes). 
 3. Registered in `ServiceRegistration.AddSharedInfrastructure` so `Program.cs` picks it up.
- Data access: mixture of EF Core (`HMISDbContext`) for transactional operations and Dapper/stored-procedures for read-heavy queries (see `AppointmentManager` which calls `DapperHelper.GetDataSetBySPWithParams` and stored proc names like `SchAppointmentsLoad`). Many service methods return `DataSet` (legacy pattern) — do not silently convert returns to different shapes without checking callers.
- Transactions: use `IUnitOfWork` (registered in ServiceRegistration) and `BeginTransaction()` where used (see `AppointmentManager.InsertAppointmentDB`).
- DTOs: located under `HMIS.Application/DTOs` (use these types for controller <-> service boundaries).

## Build / run / debug (practical commands)
- Build entire solution (from Server folder):
  dotnet build HealthManagementInformationSystem.sln
- Run API (PowerShell example):
  $env:ASPNETCORE_ENVIRONMENT = 'Development'; dotnet run --project .\HMIS.Web.API\
- When adding a new service: implement interface, register in `ServiceRegistration.AddSharedInfrastructure`, then run the app to pick up DI errors.

## Configuration & environment
- Database: connection string named `DefaultConnection` (checked by `HMIS.Web.API/Program.cs`). SQL Server is used via `UseSqlServer`.
- JWT: keys come from configuration section `Jwt` (`Issuer`, `Audience`, `Key`) — used by `Program.cs` for authentication.
- CORS: origin read from config key `angularAppUrl` in `Program.cs`.

## Notable files to inspect for context
- `HMIS.Web.API/Program.cs` — app startup, logging (Serilog), AutoMapper, JWT, Swagger.
- `HMIS.Application/ServiceRegistry/ServiceRegistration.cs` — where to register new services.
- `HMIS.Application/ServiceLogics/AppointmentManager.cs` — example service showing EF/Dapper mix, transactions, Date handling, and stored-proc usage.
- `HMIS.Infrastructure/ServiceExtensions.cs` — application-layer helpers (Dapper type handlers, repository registrations).

## Integration points & external deps
- Dapper and stored procedures (DB-first queries). Look for `DapperHelper` and SP names when modifying queries.
- Third-party services referenced in controllers (e.g., Confluent.Kafka, Deepgram) — ensure config entries exist before calling.
- NLog / Serilog config files live in `HMIS.Infrastructure` and `HMIS.Web.API` (look for `NLog.config` and Program.cs Serilog wiring).

## Quick examples
- Add a new scoped manager service:
  1. Create `IThingManager` in `HMIS.Application/Implementations`.
 2. Implement `ThingManager` in `HMIS.Application/ServiceLogics`.
 3. Add `services.AddScoped<IThingManager, ThingManager>();` in `ServiceRegistration.AddSharedInfrastructure`.

## Warnings / gotchas
- Many methods return `DataSet` and controllers return them directly — changing the return type requires updating all call sites and any front-end expectations.
- Stored procedures are source-of-truth for complex queries; modifying LINQ in service logic may not affect SP-based flows.
- Tests: there are few or no unit tests in the repository; prefer small, isolated changes and local validation.

If any section is unclear or you'd like more detail (example: DB migration workflow, CI steps, or a map of the most-used stored procedures), tell me which area and I'll expand the file.
