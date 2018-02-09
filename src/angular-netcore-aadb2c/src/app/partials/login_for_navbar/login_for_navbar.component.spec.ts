/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { LoginForNavbarComponent } from './login_for_navbar.component';

let component: LoginForNavbarComponent;
let fixture: ComponentFixture<LoginForNavbarComponent>;

describe('login_for_navbar component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
          declarations: [LoginForNavbarComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(LoginForNavbarComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});
