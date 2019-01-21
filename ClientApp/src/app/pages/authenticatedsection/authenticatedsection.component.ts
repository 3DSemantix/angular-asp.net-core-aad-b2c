import { Component, OnInit, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-authenticatedsection',
    templateUrl: './authenticatedsection.component.html',
    styleUrls: ['./authenticatedsection.component.css']
})

export class AuthenticatedsectionComponent implements OnInit {
    apiValues: string[];
    baseUrl: string;

    constructor(
        private readonly httpService: Http,
        private readonly authService: AuthService,
        @Inject('BASE_URL') baseUrl: string) {

        this.baseUrl = baseUrl;
    }

    ngOnInit(): void {
        const getTokenPromise = this.authService.getAccessToken().toPromise();
        getTokenPromise.then(accessToken => {
            const header = new Headers();
            header.append('Authorization', `Bearer ${accessToken}`);

            this.httpService.get(this.baseUrl + 'api/Secure/GetData', { headers: header }).subscribe(values => {
                this.apiValues = values.json() as string[];
            });
        });
    }
}
