import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs/Subscription";

import { AuthService } from "../../services/auth.service";
import { PolicyType } from "../../models/auth.models";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})

export class LoginComponent implements OnInit, OnDestroy {
  isRedirecting: boolean;
  hasError = false;
  error: string = null;
  errorDescription = "";

  private routeSub: Subscription;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.routeSub = this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.resetValues();

      const code = params["code"];
      this.error = params["error"];
      if (code) {
        this.isRedirecting = true;
        this.authService.initAuthFromCode(code, PolicyType.SignIn).then((succeeded) => {
          if (succeeded) {
            this.router.navigate(["/home"]);
          } else {
            this.hasError = true;
            this.errorDescription =
              "Error occured while initializing authentification, please contact administrators";
          }
        });
      } else if (this.error) {
        this.hasError = true;
        this.errorDescription = params["error_description"].replace(new RegExp("\\+", "g"), " ");
        console.error(`${this.error}: ${this.errorDescription}`);
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  resetValues() {
    this.isRedirecting = false;
    this.hasError = false;
    this.error = null;
    this.errorDescription = "";
  }
}
