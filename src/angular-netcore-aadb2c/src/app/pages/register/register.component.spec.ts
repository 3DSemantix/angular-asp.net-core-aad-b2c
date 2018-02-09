/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { RegisterComponent } from './register.component';

let component: RegisterComponent;
let fixture: ComponentFixture<RegisterComponent>;

describe('register component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ RegisterComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});