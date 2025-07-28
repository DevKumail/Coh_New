using HMIS.Service.DTOs;
using HMIS.Service.DTOs.AuthenticateDTOs;
using HMIS.Service.ServiceLogics;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.Implementations
{
    public interface IAuthenticateUserToken
    {
        /// <summary>
        /// Create a User Based Token 
        /// </summary>
        /// <returns>JWT Token on Authenticate User</returns>
        public string GenerateTokenJWT(string userName, string Id, List<Roles> roles);

        /// <summary>
        /// Check Valid User 
        /// </summary>
        /// <param name="loginDetalhes"></param>
        /// <returns>Return Authenticate User/Password</returns>
        Task<AuthenticateUserResponse> ValidarUser(AuthernticateUserToken loginDetails);

    }
}
