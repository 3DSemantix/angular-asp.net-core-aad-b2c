import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";

import { map } from "rxjs/operators";

@Injectable()
export class SettingsService {
  private oauthSettings: OauthSettings = null;

  constructor(private readonly httpService: Http) { }

  getOauthSettings(): OauthSettings {
    return this.oauthSettings;
  }

  load(): Promise<boolean> {
    const oauthPromise = this.httpService.get(`/api/Settings/GetOauthSettings`)
      .pipe(
      map((res: Response) => {
        const settings = <OauthSettings>res.json();
        this.oauthSettings = settings;
      }))
      .toPromise();

    const isLoadedPromise = Promise.all([oauthPromise]).then(() => {
      return true;
    });
    return isLoadedPromise;
  }
}

// ReSharper disable InconsistentNaming
export class OauthSettings {
  ClientId: string;
  Tenant: string;
  SignInPolicyId: string;
  SignUpPolicyId: string;
  GetAccessScopes: string;
  GetSubmissionScopes: string;
  RedirectUri: string;
  RefreshTokenSlidingWindowLifetime: number;
}
// ReSharper restore InconsistentNaming
