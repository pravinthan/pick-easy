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

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: LandingPageComponent,
  },
  {
    path: "customer",
    component: CustomerHomeComponent,
  },
  {
    path: "customer/discover",
    component: DiscoverComponent,
    canActivate: [AuthenticationGuard],
    // maybe add another guard to verify customer/restaurant access
  },
  {
    path: "costumer/profile",
    component: ProfileComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: "restaurant",
    component: RestaurantHomeComponent,
  },
  {
    path: "restaurant/rewards",
    component: RewardConfiguratorComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: "restaurant/achievements",
    component: AchievementConfiguratorComponent,
    canActivate: [AuthenticationGuard],
  },
  { path: "credits", component: CreditsComponent },
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
