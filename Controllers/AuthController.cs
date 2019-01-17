using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using angularNetcoreAadb2c.Controllers.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace angularNetcoreAadb2c.Controllers
{
  [Route("api/[controller]/[action]")]
  public class AuthController : Controller
  {
    private readonly OauthValues _oauthValues;
    
    #region Ctor
    public AuthController(IOptions<OauthValues> oauthValues)
    {
      _oauthValues = oauthValues.Value;
    }
    #endregion
    
    [HttpPost]
    public async Task<string> GetTokens(string code, string policy, string scopes)
    {
      using (var client = new HttpClient())
      {
        client.BaseAddress = new Uri("https://login.microsoftonline.com");
        using (var request = new HttpRequestMessage(HttpMethod.Post, $"/{_oauthValues.Tenant}/oauth2/v2.0/token?p={policy}"))
        {
          var contentParams = new StringContent($"grant_type=authorization_code&client_id={_oauthValues.ClientId}&scope={scopes}&redirect_uri=urn:ietf:wg:oauth:2.0:oob&client_secret={Uri.EscapeDataString(_oauthValues.ClientSecret)}&code={code}", Encoding.UTF8, "application/x-www-form-urlencoded");
          request.Content = contentParams;

          using (var response = await client.SendAsync(request))
          {
            if (response.StatusCode == HttpStatusCode.OK)
            {
              var resultJson = await response.Content.ReadAsStringAsync();
              return resultJson;
            }
            else if (response.Content != null)
            {
              var errorDetails = await response.Content.ReadAsStringAsync();
              return errorDetails;
            }
          }
        }
        return "Error";
      }
    }

    [HttpPost]
    public async Task<string> RefreshTokens(string refreshToken, string policy, string scopes)
    {
      using (var client = new HttpClient())
      {
        client.BaseAddress = new Uri("https://login.microsoftonline.com");
        using (var request = new HttpRequestMessage(HttpMethod.Post, $"/{_oauthValues.Tenant}/oauth2/v2.0/token?p={policy}"))
        {
          var contentParams = new StringContent($"grant_type=refresh_token&client_id={_oauthValues.ClientId}&scope={scopes}&refresh_token={refreshToken}&redirect_uri=urn:ietf:wg:oauth:2.0:oob&client_secret={Uri.EscapeDataString(_oauthValues.ClientSecret)}", Encoding.UTF8, "application/x-www-form-urlencoded");
          request.Content = contentParams;

          using (var response = await client.SendAsync(request))
          {
            if (response.StatusCode == HttpStatusCode.OK)
            {
              var resultJson = await response.Content.ReadAsStringAsync();
              return resultJson;
            }
            else if (response.Content != null)
            {
              var errorDetails = await response.Content.ReadAsStringAsync();
              return errorDetails;
            }
          }
        }
        return "Error";
      }
    }
  }
}
