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
import { MyRestaurantComponent } from "./components/pages/restaurant/my-restaurant/my-restaurant.component";
import { DiscoverComponent } from "./components/pages/customer/discover/discover.component";
import { RewardConfiguratorComponent } from "./components/pages/restaurant/reward-configurator/reward-configurator.component";
import { AchievementConfiguratorComponent } from "./components/pages/restaurant/achievement-configurator/achievement-configurator.component";
import { LandingPageComponent } from "./components/pages/landing-page/landing-page.component";
import { RestaurantDetailsComponent } from "./components/pages/customer/restaurant-details/restaurant-details.component";
import { AchievementsComponent } from "./components/pages/customer/achievements/achievements.component";
import { RewardsComponent } from "./components/pages/customer/rewards/rewards.component";
import { QRCodeComponent } from "./components/pages/customer/qr-code/qr-code.component";
import { ScanQRCodeComponent } from "./components/pages/restaurant/scan-qr-code/scan-qr-code.component";
import { RedeemedRewardDialogComponent } from "./components/pages/restaurant/scan-qr-code/redeemed-reward-dialog/redeemed-reward-dialog.component";
import { HomeComponent } from "./components/pages/home/home.component";
import { NavigationComponent } from "./components/navigation/navigation.component";
import { HistoryComponent } from "./components/pages/customer/history/history.component";
import { RewardPoolComponent } from "./components/pages/customer/rewards/reward-pool/reward-pool.component";

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
import { MatTabsModule } from "@angular/material/tabs";
import { MatChipsModule } from "@angular/material/chips";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatBadgeModule } from "@angular/material/badge";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatSidenavModule } from "@angular/material/sidenav";

import { NgxMatFileInputModule } from "@angular-material-components/file-input";
import { QRCodeModule } from "angularx-qrcode";
import { ZXingScannerModule } from "@zxing/ngx-scanner";
import { CountUpModule } from "ngx-countup";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SignInComponent,
    SignUpComponent,
    PageNotFoundComponent,
    CreditsComponent,
    DiscoverComponent,
    RewardConfiguratorComponent,
    RestaurantDetailsComponent,
    AchievementConfiguratorComponent,
    LandingPageComponent,
    MyRestaurantComponent,
    AchievementsComponent,
    RewardsComponent,
    QRCodeComponent,
    ScanQRCodeComponent,
    RedeemedRewardDialogComponent,
    HomeComponent,
    NavigationComponent,
    HistoryComponent,
    RewardPoolComponent,
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
    MatChipsModule,
    MatSelectModule,
    MatTabsModule,
    NgxMatFileInputModule,
    MatTooltipModule,
    MatBadgeModule,
    QRCodeModule,
    ZXingScannerModule,
    CountUpModule,
    MatTableModule,
    MatSortModule,
    MatSidenavModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: NOTYF, useFactory: notyfFactory },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
