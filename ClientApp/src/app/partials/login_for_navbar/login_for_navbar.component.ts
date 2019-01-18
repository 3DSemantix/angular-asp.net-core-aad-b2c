import { Component, OnInit } from "@angular/core";

import { AuthService } from "../../services/auth.service";

@Component({
    selector: "app-login_for_navbar",
    templateUrl: "./login_for_navbar.component.html",
    styleUrls: ["./login_for_navbar.component.css"]
})

export class LoginForNavbarComponent implements OnInit {
    isConnected: boolean;
    userName: string;

    constructor(private readonly authService: AuthService) {}

    ngOnInit(): void {
        //Subscribe for futur changes
        this.authService.authChanged.subscribe((authStatus) => {
            if (authStatus) {
                this.isConnected = authStatus.isConnected;
                this.userName = authStatus.userName;
            }
        });

        //Get current state
        this.isConnected = this.authService.isLoggedIn();
        if (this.isConnected) {
            this.userName = this.authService.getUserName();
        }
    }

    login(): boolean {
        this.authService.login();
        return false;
    }

    register(): boolean {
        this.authService.register();
        return false;
    }

    logout(): boolean {
        this.authService.logout();
        return false;
    }
}
