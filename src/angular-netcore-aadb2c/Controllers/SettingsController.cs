using angularNetcoreAadb2c.Controllers.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace angularNetcoreAadb2c.Controllers
{
  [Route("api/[controller]/[action]")]
  public class SettingsController : Controller
  {
    private readonly OauthProtectedValues _oauthValues;

    #region Ctor
    public SettingsController(IOptions<OauthValues> oauthValues)
    {
      _oauthValues = new OauthProtectedValues(oauthValues.Value);
    }
    #endregion

    [HttpGet]
    public string GetOauthSettings()
    {
      return JsonConvert.SerializeObject(_oauthValues);
    }
  }
}
