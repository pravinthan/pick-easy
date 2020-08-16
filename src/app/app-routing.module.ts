import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PageNotFoundComponent } from "./components/pages/page-not-found/page-not-found.component";
import { CreditsComponent } from "./components/pages/credits/credits.component";
import { AuthenticationGuard } from "./shared/authentication.guard";
import { DiscoverComponent } from "./components/pages/customer/discover/discover.component";
import { RewardConfiguratorComponent } from "./components/pages/restaurant/reward-configurator/reward-configurator.component";
import { AchievementConfiguratorComponent } from "./components/pages/restaurant/achievement-configurator/achievement-configurator.component";
import { LandingPageComponent } from "./components/pages/landing-page/landing-page.component";
import { MyRestaurantComponent } from "./components/pages/restaurant/my-restaurant/my-restaurant.component";
import { CustomerGuard } from "./shared/customer.guard";
import { RestaurantStaffGuard } from "./shared/restaurant-staff.guard";
import { RestaurantCreationGuard } from "./shared/restaurant-creation.guard";
import { AchievementsComponent } from "./components/pages/customer/achievements/achievements.component";
import { RewardsComponent } from "./components/pages/customer/rewards/rewards.component";
import { ScanQRCodeComponent } from "./components/pages/restaurant/scan-qr-code/scan-qr-code.component";
import { HomeComponent } from "./components/pages/home/home.component";
import { HistoryComponent } from "./components/pages/customer/history/history.component";

// sets up all the rounting links that the user can visit.
const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: LandingPageComponent,
  },
  {
    path: "customer",
    component: HomeComponent,
  },
  {
    path: "customer/discover",
    component: DiscoverComponent,
    canActivate: [AuthenticationGuard, CustomerGuard],
  },
  {
    path: "customer/history",
    component: HistoryComponent,
    canActivate: [AuthenticationGuard, CustomerGuard],
  },
  {
    path: "customer/achievements",
    component: AchievementsComponent,
    canActivate: [AuthenticationGuard, CustomerGuard],
  },
  {
    path: "customer/rewards",
    component: RewardsComponent,
    canActivate: [AuthenticationGuard, CustomerGuard],
  },
  {
    path: "restaurant",
    component: HomeComponent,
  },
  {
    path: "restaurant/my-restaurant",
    component: MyRestaurantComponent,
    canActivate: [AuthenticationGuard, RestaurantStaffGuard],
  },
  {
    path: "restaurant/rewards",
    component: RewardConfiguratorComponent,
    canActivate: [
      AuthenticationGuard,
      RestaurantStaffGuard,
      RestaurantCreationGuard,
    ],
  },
  {
    path: "restaurant/achievements",
    component: AchievementConfiguratorComponent,
    canActivate: [
      AuthenticationGuard,
      RestaurantStaffGuard,
      RestaurantCreationGuard,
    ],
  },
  {
    path: "restaurant/scan",
    component: ScanQRCodeComponent,
    canActivate: [
      AuthenticationGuard,
      RestaurantStaffGuard,
      RestaurantCreationGuard,
    ],
  },
  { path: "credits", component: CreditsComponent },
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
