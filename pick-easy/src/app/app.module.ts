import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { JwtInterceptor } from "./shared/jwt.interceptor";
import { NOTYF, notyfFactory } from "./shared/utils/notyf.token";

import { SignInComponent } from "./components/sign-in/sign-in.component";
import { SignUpComponent } from "./components/sign-up/sign-up.component";
import { HeaderComponent } from "./components/header/header.component";
import { PageNotFoundComponent } from "./components/pages/page-not-found/page-not-found.component";
import { CreditsComponent } from "./components/pages/credits/credits.component";
import { MyPicksComponent } from "./components/pages/customer/my-picks/my-picks.component";
import { MyRestaurantComponent } from "./components/pages/restaurant/my-restaurant/my-restaurant.component";
import { ProfileComponent } from "./components/pages/customer/profile/profile.component";
import { DiscoverComponent } from "./components/pages/customer/discover/discover.component";
import { CustomerHomeComponent } from "./components/pages/customer/customer-home/customer-home.component";
import { RewardConfiguratorComponent } from "./components/pages/restaurant/reward-configurator/reward-configurator.component";
import { RestaurantHomeComponent } from "./components/pages/restaurant/restaurant-home/restaurant-home.component";
import { AchievementConfiguratorComponent } from "./components/pages/restaurant/achievement-configurator/achievement-configurator.component";
import { LandingPageComponent } from "./components/pages/landing-page/landing-page.component";

import { MatListModule } from "@angular/material/list";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatCardModule } from "@angular/material/card";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { RatingModule } from "ng-starrating";
import { MatChipsModule } from "@angular/material/chips";
import { MatSelectModule } from "@angular/material/select";

import { NgxMatFileInputModule } from "@angular-material-components/file-input";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SignInComponent,
    SignUpComponent,
    CustomerHomeComponent,
    PageNotFoundComponent,
    CreditsComponent,
    MyPicksComponent,
    ProfileComponent,
    DiscoverComponent,
    RewardConfiguratorComponent,
    RestaurantHomeComponent,
    AchievementConfiguratorComponent,
    LandingPageComponent,
    MyRestaurantComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatListModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatCardModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    RatingModule,
    MatChipsModule,
    MatSelectModule,
    NgxMatFileInputModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: NOTYF, useFactory: notyfFactory },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
