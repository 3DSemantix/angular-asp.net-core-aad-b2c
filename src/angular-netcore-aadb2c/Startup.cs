using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using angularNetcoreAadb2c.Controllers.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace angular_netcore_aadb2c
{
  public class Startup
  {
    public IConfigurationRoot Configuration { get; }

    public Startup(IHostingEnvironment env)
    {
      Console.WriteLine($"EnvironmentName {env.EnvironmentName}");

      var builder = new ConfigurationBuilder()
          .SetBasePath(env.ContentRootPath)
          .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
          .AddJsonFile($"appsettings.{env.EnvironmentName.ToLowerInvariant()}.json", optional: true)
          .AddEnvironmentVariables();
      Configuration = builder.Build();
    }

    // This method gets called by the runtime. Use this method to add services to the container.
    // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
    public void ConfigureServices(IServiceCollection services)
    {
      services.Configure<OauthValues>(Configuration.GetSection("OauthValues"));

      var oauthSettings = Configuration.GetSection("OauthValues").Get<OauthValues>();
      services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
          .AddJwtBearer(options =>
          {
            options.Audience = oauthSettings.ClientId;
            options.MetadataAddress = string.Format(oauthSettings.AadInstance, oauthSettings.Tenant, oauthSettings.SignInPolicyId);
          });

      services.AddMvc();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env, IOptions<OauthValues> optionOauthSettings)
    {
      app.Use(async (context, next) =>
      {
        await next();
        if (context.Response.StatusCode == 404 &&
            !Path.HasExtension(context.Request.Path.Value) &&
            !context.Request.Path.Value.StartsWith("/api/"))
        {
          context.Request.Path = "/index.html";
          await next();
        }
      });

      app.UseAuthentication();

      //var oauthSettings = optionOauthSettings.Value;
      //  app.UseJwtBearerAuthentication(new JwtBearerOptions()
      //  {
      //      MetadataAddress = string.Format(oauthSettings.AadInstance, oauthSettings.Tenant, oauthSettings.SignInPolicyId),
      //      Audience = oauthSettings.ClientId
      //  });

      app.UseMvcWithDefaultRoute();

      app.UseDefaultFiles();
      app.UseStaticFiles();
    }
  }
}
