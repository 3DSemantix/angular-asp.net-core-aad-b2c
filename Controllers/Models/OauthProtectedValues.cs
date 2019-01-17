namespace angularNetcoreAadb2c.Controllers.Models
{
    /// <summary>
    /// Used to wrap sensitive data (all data here will be publicly accessible)
    /// </summary>
    public class OauthProtectedValues
    {
        #region Ctor
        public OauthProtectedValues(OauthValues val)
        {
            ClientId = val.ClientId;
            Tenant = val.Tenant;
            SignInPolicyId = val.SignInPolicyId;
            SignUpPolicyId = val.SignUpPolicyId;
            GetAccessScopes = val.GetAccessScopes;
            GetSubmissionScopes = val.GetSubmissionScopes;
            RedirectUri = val.RedirectUri;
            RefreshTokenSlidingWindowLifetime = val.RefreshTokenSlidingWindowLifetime;
        }
        #endregion

        public string ClientId { get; set; }
        public string Tenant { get; set; }
        public string SignInPolicyId { get; set; }
        public string SignUpPolicyId { get; set; }
        public string GetAccessScopes { get; set; }
        public string GetSubmissionScopes { get; set; }
        public string RedirectUri { get; set; }
        public int RefreshTokenSlidingWindowLifetime { get; set; }
    }
}
