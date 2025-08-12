using HMIS.Infrastructure.Helpers;
using HMIS.Core.Entities;
using HMIS.Application.DTOs;
using HMIS.Application.DTOs.AuthenticateDTOs;
using HMIS.Application.Implementations;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Application.ServiceLogics
{
    public class AuthenticateUserToken : IAuthenticateUserToken
    {
        #region Fields
        private readonly HmisContext _HMISdbContext;
        private IConfiguration _config;
        #endregion
        #region ctor
        public AuthenticateUserToken
            (
            IConfiguration Configuration,
            HmisContext HMISdbContext
            )
        {
            _HMISdbContext = HMISdbContext;
            _config = Configuration;
        }
        #endregion

        #region Methods

        /// <summary>
        /// Create a User Based Token 
        /// </summary>
        /// <returns>JWT Token on Authenticate User</returns>
        public string GenerateTokenJWT(string userName, string Id, List<Roles> roles)
        {
            var authClaims = new List<Claim>
                {
                    new Claim("UserId",Id),
                    new Claim("UserName", userName),
                    new Claim(JwtRegisteredClaimNames.UniqueName, userName),



        };

            foreach (var item in roles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, item.Name));
            }


            var issuer = _config["Jwt:Issuer"];
            var audience = _config["Jwt:Audience"];
            var expiry = DateTime.Now.AddHours(12);
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(issuer: issuer, audience: audience,
                expires: expiry, claims: authClaims, signingCredentials: credentials);
            var tokenHandler = new JwtSecurityTokenHandler();
            var stringToken = tokenHandler.WriteToken(token);
            return stringToken;
        }

        /// <summary>
        /// Check Valid User 
        /// </summary>
        /// <param name="loginDetalhes"></param>
        /// <returns>Return Authenticate User/Password</returns>
        //public async Task<AuthenticateUserResponse> ValidarUser(AuthernticateUserToken loginDetails)
        //{
        //    // var user = new Users();
        //    var user = await System.Threading.Tasks.Task.Run(() => _HMISdbContext.Hremployees
        //    .Where(x => x.UserName == loginDetails.Name && x.IsDeleted==false &&x.Active==true)
        //    .Select(x => new {
        //        x.EmployeeId,
        //        x.UserName,
        //        x.Password
        //    }).SingleOrDefault());



        //    // user = _mapper.Map<Users>(getAuthenticate);
        //    if (user != null)
        //    {
        //        HashingHelper hashHelper = HashingHelper.GetInstance();

        //        string pwdHash = hashHelper.ComputeHash(loginDetails.Password);
        //        if (pwdHash == user.Password)

        //            return new AuthenticateUserResponse() { User = new Hremployee { EmployeeId = user.EmployeeId, UserName = user.UserName } };
        //    }

        //    return new AuthenticateUserResponse(); ;//"User Not Valid";
        //}
        public async Task<AuthenticateUserResponse> ValidarUser(AuthernticateUserToken loginDetails)
        {
            var user = await _HMISdbContext.Hremployees
                .Where(x => x.UserName == loginDetails.Name && x.IsDeleted == false && x.Active == true)
                .SingleOrDefaultAsync();

            if (user != null)
            {
                var hashHelper = HashingHelper.GetInstance();
                string pwdHash = hashHelper.ComputeHash(loginDetails.Password);

                if (pwdHash == user.Password)
                {
                    var dto = new HMIS.Application.DTOs.ControlPanel.Hremployee
                    {
                        EmployeeId = user.EmployeeId,
                        UserName = user.UserName
                        // map other fields as needed
                    };

                    return new AuthenticateUserResponse() { User = dto };
                }
            }

            // fallback return to satisfy the compiler
            return new AuthenticateUserResponse();
        }




        #endregion


    }
}
