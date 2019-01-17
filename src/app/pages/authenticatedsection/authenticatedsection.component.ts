import { Component, OnInit } from "@angular/core";
import { Http, Headers } from "@angular/http";

import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-authenticatedsection",
  templateUrl: "./authenticatedsection.component.html",
  styleUrls: ["./authenticatedsection.component.css"]
})

export class AuthenticatedsectionComponent implements OnInit {
  apiValues: string[];

  constructor(
    private readonly httpService: Http,
    private readonly authService: AuthService) { }

  ngOnInit(): void {
    const getTokenPromise = this.authService.getAccessToken().toPromise();
    getTokenPromise.then(accessToken => {
      const header = new Headers();
      header.append("Authorization", `Bearer ${accessToken}`);

      this.httpService.get("/api/secure", { headers: header }).subscribe(values => {
        this.apiValues = values.json() as string[];
      });
    });
  }
}
