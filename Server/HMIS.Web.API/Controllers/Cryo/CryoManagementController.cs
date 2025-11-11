using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HMIS.Web.Controllers.Cryo
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CryoManagementController : BaseApiController
    {
      
    }
}
