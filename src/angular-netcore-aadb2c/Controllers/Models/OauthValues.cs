namespace angularNetcoreAadb2c.Controllers.Models
{
  public class OauthValues
  {
    public string AadInstance { get; set; }
    public string ClientId { get; set; }
    public string ClientSecret { get; set; }
    public string Tenant { get; set; }
    public string SignInPolicyId { get; set; }
    public string SignUpPolicyId { get; set; }
    public string GetAccessScopes { get; set; }
    public string GetSubmissionScopes { get; set; }
    public string RedirectUri { get; set; }
    public int RefreshTokenSlidingWindowLifetime { get; set; }
  }
}
