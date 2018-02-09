/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { AuthenticatedsectionComponent } from './authenticatedsection.component';

let component: AuthenticatedsectionComponent;
let fixture: ComponentFixture<AuthenticatedsectionComponent>;

describe('authenticatedsection component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AuthenticatedsectionComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(AuthenticatedsectionComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});