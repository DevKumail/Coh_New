using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Infrastructure.Helpers
{
    public class HashingHelper
    {
        private static HashingHelper hashingHelpher = null;


        public static HashingHelper GetInstance()
        {
            if (hashingHelpher == null)
                hashingHelpher = new HashingHelper();
            return hashingHelpher;
        }

        public string GenerateHash(string str, ref string saltStr)
        {
            // generate a 128-bit salt using a secure PRNG
            byte[] salt = new byte[128 / 8];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            // derive a 256-bit subkey (use HMACSHA1 with 10,000 iterations)
            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: str,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));

            saltStr = Convert.ToBase64String(salt);
            return hashed;
        }

        public string ComputeHash(string str)
        {
            //byte[] salt = new byte[128 / 8];
            //salt = Encoding.UTF8.GetBytes(saltStr);
            // byte[] salt = Convert.FromBase64String(saltStr);
            byte[] salt = Convert.FromBase64String("dGltZXNoZWV0");
            // derive a 256-bit subkey (use HMACSHA1 with 10,000 iterations)
            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: str,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));

            return hashed;
        }

        public int DecodeJWT(string JWT)
        {
            var splitToken = JWT.Split(' ');
            var stream = splitToken[1];
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(stream);
            var tokenS = jsonToken as JwtSecurityToken;
            IEnumerable<System.Security.Claims.Claim> claims = tokenS.Claims;
            var getId = claims.FirstOrDefault().Value;
            int usrId = Convert.ToInt32(getId);
            return usrId;
        }
    }
}
