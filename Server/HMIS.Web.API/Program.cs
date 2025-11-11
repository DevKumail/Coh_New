using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using Sieve.Services;
using HMIS.Infrastructure;
using HMIS.Infrastructure.ORM;
using HMIS.Infrastructure.Helpers;
using HMIS.Application.ModelMapping;
using HMIS.Application;
using HMIS.Core.Entities;
using HMIS.Core.Context;

var builder = WebApplication.CreateBuilder(args);

// Serilog configuration
builder.Host.UseSerilog((ctx, lc) => lc
    .WriteTo.Console()
    .ReadFrom.Configuration(ctx.Configuration));

// Add AutoMapper
//builder.Services.AddAutoMapper(cfg =>
//{
//    cfg.AddProfile<GeneralProfile>();
//}, typeof(Program));

builder.Services.AddAutoMapper(typeof(GeneralProfile).Assembly);


// Add DB Context
builder.Services.AddDbContext<HMISDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var jwtConfig = builder.Configuration.GetSection("Jwt");
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtConfig["Issuer"],
            ValidAudience = jwtConfig["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConfig["Key"]))
        };
    });

// CORS
builder.Services.AddCors(options =>
{
    var angularAppUrl = builder.Configuration.GetValue<string>("angularAppUrl");
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(angularAppUrl).AllowAnyHeader().AllowAnyMethod();
    });
});

// Add Sieve
builder.Services.AddScoped<SieveProcessor>();

// Shared + Application layers
builder.Services.AddSharedInfrastructure(builder.Configuration);
builder.Services.AddApplicationLayer();
builder.Services.AddSingleton<DapperContext>();

// JSON settings to avoid reference loops
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);

// Swagger with JWT Auth
builder.Services.AddSwaggerGen(config =>
{
    config.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer 12345abcdef\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT"
    });

    config.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header
            },
            new List<string>()
        }
    });

    var titleBase = "HealthManagementInformationSystem";
    var description = "This is an Open-API for Test operations.";
    var license = new OpenApiLicense() { Name = "License: HealthManagementInformationSystem" };
    var contact = new OpenApiContact() { Name = "HealthManagementInformationSystem", Email = "Test@hotmail.com" };

    config.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = titleBase + " v1",
        Description = description,
        License = license,
        Contact = contact
    });

    config.SwaggerDoc("v2", new OpenApiInfo
    {
        Version = "v2",
        Title = titleBase + " v2",
        Description = description,
        License = license,
        Contact = contact
    });
});

// Optional: Setup CacheHelper (if needed at startup)
var cache = new CacheHelper();

var app = builder.Build();

// Middleware pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(config =>
    {
        config.SwaggerEndpoint("/swagger/v1/swagger.json", "Test v1");
        // config.SwaggerEndpoint("/swagger/v2/swagger.json", "Test v2");
    });
}
else
{
    app.UseSwagger();
    app.UseSwaggerUI(config =>
    {
        config.SwaggerEndpoint("/swagger/v1/swagger.json", "Test v1");
    });
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseSerilogRequestLogging();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();

