using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace angularNetcoreAadb2c.Controllers
{
  [Authorize]
  [Route("api/[controller]")]
  public class SecureController : Controller
  {
    [HttpGet]
    public IEnumerable<string> Get()
    {
      return new string[] { "Hello", "World" };
    }
  }
}
