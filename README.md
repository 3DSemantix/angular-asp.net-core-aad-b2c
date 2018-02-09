# Angular + ASP.NET Core + AAD B2C
A single page app implemented using Angular 5, ASP.NET Core 2.0 and Azure AD B2C.

## Synopsis

This is a fully functionnal ASP.NET Core 2.0 and Angular 5 application, using Azure Active Directory B2C to handle authentication based on the [OAuth 2.0 authorization flow](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-protocols-oauth-code). 

Here are some of the provided functionnalities:
- Sign-in/Sign-out/Register via AAD B2C
- Retrieve access_token and refresh_token from AAD B2C authorization response code
- Access AAD B2C protected API with retrieved access_token
- Restrict Angular pages on current authentication status
- Auto refresh the access_token when needed using the refresh_token
- Support the [sliding window](https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-token-session-sso#token-lifetimes-configuration) option (token lifetime configuration)
- Support multiples configurations based on environment variables (usefull in Azure Deployement Slots)


## Getting Started

### Prerequisites

[Node.js](https://nodejs.org/en/) Installed

[.NET Core](https://www.microsoft.com/net/core#windowscmd) Installed

### Setup the project

Copy the **appsettings.json** file and rename it **appsettings.Development.json**.

Set your **appsettings.Development.json** file with your own AAD B2C informations:

```
"OauthValues": {
	"AadInstance": "https://login.microsoftonline.com/{0}/v2.0/.well-known/openid-configuration?p={1}",
	"ClientId": "00000000-0000-0000-0000-00000000000",
	"ClientSecret": "your_client_secret",
	"Tenant": "your_website.onmicrosoft.com",
	"SignInPolicyId": "YOUR_SIGN_IN_POLICY",
	"SignUpPolicyId": "YOUR_SIGN_UP_POLICY",
	"GetAccessScopes": "offline_access https://your_website.onmicrosoft.com/YOUR_APP/application.claim",
	"RedirectUri": "http://localhost:4200/",
	"RefreshTokenSlidingWindowLifetime": 80
}
```

Run inside the \src\angular-netcore-aadb2c folder the following command:

```
npm install
```

### Run the project

You need to run both ASP.NET Core and Angular applications to run the entire project. 

Start ASP.NET Core project:
```
dotnet watch run
```

Start Angular project:
```
ng serve --proxy-config proxy.config.json
```

The application will be available on localhost:4200.


## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments 
Thanks to Levi Fuller for his tutorial:
[How to build an Angular Application with ASP.NET Core in Visual Studio 2017, visualized](https://medium.com/@levifuller/building-an-angular-application-with-asp-net-core-in-visual-studio-2017-visualized-f4b163830eaa)

