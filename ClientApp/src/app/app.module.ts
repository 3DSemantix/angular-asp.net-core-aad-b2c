import { BrowserModule } from "@angular/platform-browser";
import { NgModule, APP_INITIALIZER } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { AuthenticatedsectionComponent } from "./pages/authenticatedsection/authenticatedsection.component";
import { LoginForNavbarComponent } from "./partials/login_for_navbar/login_for_navbar.component";
import { AUTH_PROVIDERS } from "./services/auth.service";
import { SettingsService } from "./services/settings.service";
import { AuthGuard } from "./guards/auth.guards";

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "authenticatedsection", component: AuthenticatedsectionComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "**", redirectTo: "home" }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthenticatedsectionComponent,
    LoginComponent,
    RegisterComponent,
    LoginForNavbarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes)
  ],
  providers: [AUTH_PROVIDERS, SettingsService, AuthGuard, { provide: APP_INITIALIZER, useFactory: settingsServiceFactory, deps: [SettingsService], multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function settingsServiceFactory(service: SettingsService) {
  return () => service.load();
}
