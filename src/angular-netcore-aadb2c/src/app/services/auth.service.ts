// ReSharper disable once InconsistentNaming
declare var jwt_decode: any;

import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { Http, Response } from "@angular/http";

import { AuthStatus, PolicyType } from "../models/auth.models";
import { SettingsService, OauthSettings } from "./settings.service";

@Injectable()
export class AuthService {
  private readonly getCodeScope: string = null;
  private nonce: string = null;
  private readonly clientId: string = null;
  private readonly tenantName: string = null;
  private readonly signInPolicy: string = null;
  private readonly signUpPolicy: string = null;
  private readonly loginRedirectUri: string = null;
  private readonly logoutRedirectUri: string = null;
  private readonly registerRedirectUri: string = null;
  private readonly refreshTokenSlidingWindowLifetime: number = null;

  // ReSharper disable InconsistentNaming
  private readonly aadGetCodeUrl_SignIn: string;
  private readonly aadGetCodeUrl_Register: string;
  // ReSharper restore InconsistentNaming

  private secureTimeGap = 60 * 5; //5 mins

  authChanged: BehaviorSubject<AuthStatus> = new BehaviorSubject<AuthStatus>(null);

  constructor(
    private readonly httpService: Http,
    private readonly router: Router,
    private readonly settingsService: SettingsService) {

    //Get settings
    const settings = settingsService.getOauthSettings();

    //Set params
    this.getCodeScope = settings.GetAccessScopes;
    this.clientId = settings.ClientId;
    this.tenantName = settings.Tenant;
    this.signInPolicy = settings.SignInPolicyId;
    this.signUpPolicy = settings.SignUpPolicyId;
    this.refreshTokenSlidingWindowLifetime = settings.RefreshTokenSlidingWindowLifetime;

    const redirectUriHost = settings.RedirectUri;
    this.loginRedirectUri = redirectUriHost + "login";
    this.logoutRedirectUri = redirectUriHost;
    this.registerRedirectUri = redirectUriHost + "register";

    //Init urls
    this.aadGetCodeUrl_SignIn = "https://login.microsoftonline.com/" + this.tenantName + `/oauth2/v2.0/authorize?client_id=${this.clientId}&response_type=code&redirect_uri=${encodeURIComponent(this.loginRedirectUri)}&response_mode=query&scope=${this.getCodeScope}&state=${""}&nonce=${this.nonce}&p=${this.signInPolicy}`;
    this.aadGetCodeUrl_Register = "https://login.microsoftonline.com/" + this.tenantName + `/oauth2/v2.0/authorize?client_id=${this.clientId}&response_type=code&redirect_uri=${encodeURIComponent(this.registerRedirectUri)}&response_mode=query&scope=${this.getCodeScope}&state=${""}&nonce=${this.nonce}&p=${this.signUpPolicy}`;

    //Notify current status
    if (this.isLoggedIn()) {
      const username = this.getUserName();
      const authStatus = new AuthStatus(true, username);
      this.authChanged.next(authStatus);
    } else {
      const authStatus = new AuthStatus(false, "");
      this.authChanged.next(authStatus);
    }
  }

  login(): boolean {
    if (!this.isLoggedIn()) {
      //Navigate to AAD B2C
      window.location.href = this.aadGetCodeUrl_SignIn;
      return true;
    }
    return false;
  }

  register(): boolean {
    if (!this.isLoggedIn()) {
      //Navigate to AAD B2C
      window.location.href = this.aadGetCodeUrl_Register;
      return true;
    }
    return false;
  }

  logout(): any {
    //Clear local info
    this.clearStoredAuthInfo();

    //Logout in AAD
    const params = `p=${this.signInPolicy}&post_logout_redirect_uri=${this.logoutRedirectUri}`;
    window.location.href = "https://login.microsoftonline.com/" + this.tenantName + "/oauth2/v2.0/logout?" + params;
  }

  getAccessToken(): Observable<string> {
    const policy = localStorage.getItem("policy");
    const savedStatus = this.getCurrentSavedStatus();
    const nowEpoch = Date.now() / 1000 | 0;

    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      throw new Error("Not authenticated");
    }

    if (nowEpoch < (savedStatus.accessTokenExpiresTimeEpoch - this.secureTimeGap)) {
      return Observable.of(accessToken);
    } else {
      //Look if still inside of sliding window
      const slidingWindowMaxTime = +localStorage.getItem("sliding_window");
      if (slidingWindowMaxTime === 0 || !slidingWindowMaxTime || nowEpoch > slidingWindowMaxTime) {
        console.warn("Sliding window exceeded");
        this.logout();
      }

      //Retrieve refresh token and validate it
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        throw new Error("refresh token not valid");
      }

      return this.httpService.post(`/api/Auth/RefreshTokens?refreshToken=${refreshToken}&policy=${policy}`, "").map((res: Response) => {
        const wrappedData = new TokensInfoWrapper(<TokensInfo>res.json());
        this.setStoredAuthInfo(
          policy,
          wrappedData.data.access_token,
          wrappedData.data.refresh_token,
          wrappedData.data.expires_on,
          ((+wrappedData.data.not_before) + (+wrappedData.data.refresh_token_expires_in)).toString(),
          wrappedData.getName(), wrappedData.getEmail()
        );

        return wrappedData.data.access_token;
      });
    }
  }

  getUserName(): string {
    return localStorage.getItem("username");
  }

  getEmail(): string {
    return localStorage.getItem("email");
  }

  isLoggedIn(): boolean {
    //Get data
    const savedStatus = this.getCurrentSavedStatus();
    const nowEpoch = Date.now() / 1000 | 0;

    if (savedStatus.hasSavedData) {
      if (nowEpoch < (savedStatus.accessTokenExpiresTimeEpoch - this.secureTimeGap) || nowEpoch < (savedStatus.refreshTokenExpiresTimeEpoch - this.secureTimeGap)) {
        //Is logged in
        return true;
      } else {
        //Not logged in anymore, clear all
        this.clearStoredAuthInfo();
      }
    }
    return false;
  }

  private getCurrentSavedStatus(): SavedStatus {
    const accessToken = localStorage.getItem("access_token");
    const accessTokenExpiresTimeEpoch = +localStorage.getItem("access_token_expire");
    const refreshTokenExpiresTimeEpoch = +localStorage.getItem("refresh_token_expire");

    return new SavedStatus(accessToken !== null, accessTokenExpiresTimeEpoch, refreshTokenExpiresTimeEpoch);
  }

  private setStoredAuthInfo(policy: string, accessToken: string, refreshToken: string, accessTokenExpire: string, refreshTokenExpire: string, username: string, email: string) {
    //Calculate refresh token sliding window
    const nowEpoch = Date.now() / 1000 | 0;
    const slidingWindow = nowEpoch + this.refreshTokenSlidingWindowLifetime * 24 * 60 * 60;

    //Set
    localStorage.setItem("policy", policy);
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("access_token_expire", accessTokenExpire);
    localStorage.setItem("refresh_token_expire", refreshTokenExpire);
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    localStorage.setItem("sliding_window", slidingWindow.toString());

    //Push modification
    const authStatus = new AuthStatus(true, username);
    this.authChanged.next(authStatus);
  }

  private clearStoredAuthInfo() {
    //Clear
    localStorage.removeItem("policy");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("access_token_expire");
    localStorage.removeItem("refresh_token_expire");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("sliding_window");

    //Push modification
    const auth = new AuthStatus(false, "");
    this.authChanged.next(auth);
  }

  initAuthFromCode(code: string, policyType: PolicyType): Promise<boolean> {
    const policyUsed = policyType === PolicyType.SignIn ? this.signInPolicy : this.signUpPolicy;

    return this.httpService.post(`/api/Auth/GetTokens?code=${code}&policy=${policyUsed}`, "").toPromise().then(
      (res: Response) => {
        const wrappedData = new TokensInfoWrapper(<TokensInfo>res.json());
        this.setStoredAuthInfo(
          policyUsed,
          wrappedData.data.access_token,
          wrappedData.data.refresh_token,
          wrappedData.data.expires_on,
          ((+wrappedData.data.not_before) + (+wrappedData.data.refresh_token_expires_in)).toString(),
          wrappedData.getName(), wrappedData.getEmail()
        );
        return true;
      },
      (err) => {
        console.error(err);
        return false;
      }
    );
  }

}

class SavedStatus {
  constructor(public hasSavedData: boolean, public accessTokenExpiresTimeEpoch: number, public refreshTokenExpiresTimeEpoch: number) {

  }
}

class TokensInfo {
  // ReSharper disable InconsistentNaming
  access_token: string;
  expires_in: string;
  expires_on: string;
  not_before: string;
  profile_info: string;
  refresh_token: string;
  refresh_token_expires_in: string;
  resource: string;
  token_type: string;
  // ReSharper restore InconsistentNaming
}

class TokensInfoWrapper {
  private decodedAccessToken: any;

  constructor(public data: TokensInfo) { }

  getName(): string {
    this.decodeAccessToken();
    return this.decodedAccessToken.name;
  }

  getEmail(): string {
    this.decodeAccessToken();
    return this.decodedAccessToken.emails[0].toLowerCase();
  }

  private decodeAccessToken() {
    if (!this.decodedAccessToken) {
      this.decodedAccessToken = jwt_decode(this.data.access_token);
    }
  }
}

export const AUTH_PROVIDERS: Array<any> = [
  { provide: AuthService, useClass: AuthService }
];
