import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PageNotFoundComponent } from "./components/pages/page-not-found/page-not-found.component";
import { CreditsComponent } from "./components/pages/credits/credits.component";
import { AuthenticationGuard } from "./shared/authentication.guard";
import { CustomerHomeComponent } from "./components/pages/customer/customer-home/customer-home.component";
import { DiscoverComponent } from "./components/pages/customer/discover/discover.component";
import { ProfileComponent } from "./components/pages/customer/profile/profile.component";
import { RestaurantHomeComponent } from "./components/pages/restaurant/restaurant-home/restaurant-home.component";
import { RewardConfiguratorComponent } from "./components/pages/restaurant/reward-configurator/reward-configurator.component";
import { AchievementConfiguratorComponent } from "./components/pages/restaurant/achievement-configurator/achievement-configurator.component";
import { LandingPageComponent } from "./components/pages/landing-page/landing-page.component";
import { MyRestaurantComponent } from "./components/pages/restaurant/my-restaurant/my-restaurant.component";
import { CustomerGuard } from "./shared/customer.guard";
import { RestaurantStaffGuard } from "./shared/restaurant-staff.guard";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: LandingPageComponent,
  },
  {
    path: "customer",
    component: CustomerHomeComponent,
    canActivate: [CustomerGuard],
    data: { guardOnlyIfSignedIn: true },
  },
  {
    path: "customer/discover",
    component: DiscoverComponent,
    canActivate: [AuthenticationGuard, CustomerGuard],
  },
  {
    path: "customer/profile",
    component: ProfileComponent,
    canActivate: [AuthenticationGuard, CustomerGuard],
  },
  {
    path: "restaurant",
    component: RestaurantHomeComponent,
    canActivate: [RestaurantStaffGuard],
    data: { guardOnlyIfSignedIn: true },
  },
  {
    path: "restaurant/my-restaurant",
    component: MyRestaurantComponent,
    canActivate: [AuthenticationGuard, RestaurantStaffGuard],
  },
  {
    path: "restaurant/rewards",
    component: RewardConfiguratorComponent,
    canActivate: [AuthenticationGuard, RestaurantStaffGuard],
  },
  {
    path: "restaurant/achievements",
    component: AchievementConfiguratorComponent,
    canActivate: [AuthenticationGuard, RestaurantStaffGuard],
  },
  { path: "credits", component: CreditsComponent },
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
