import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PageNotFoundComponent } from "./components/pages/page-not-found/page-not-found.component";
import { CreditsComponent } from "./components/pages/credits/credits.component";
import { AuthenticationGuard } from "./shared/authentication.guard";
import { ConsumerHomeComponent } from "./components/pages/consumer/consumer-home/consumer-home.component";
import { DiscoverComponent } from "./components/pages/consumer/discover/discover.component";
import { MyPicksComponent } from "./components/pages/consumer/my-picks/my-picks.component";
import { ProfileComponent } from "./components/pages/consumer/profile/profile.component";
import { RewardConfiguratorComponent } from "./components/pages/restaurant/reward-configurator/reward-configurator.component";

const routes: Routes = [
  // { path: "", pathMatch: "full", component: <<<consumer/restaurant component switcher here>>> },
  {
    path: "consumer",
    component: ConsumerHomeComponent,
  },
  {
    path: "consumer/discover",
    component: DiscoverComponent,
    canActivate: [AuthenticationGuard],
    // maybe add another guard to verify consumer/restaurant access
  },
  {
    path: "consumer/my-picks",
    component: MyPicksComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: "consumer/profile",
    component: ProfileComponent,
    canActivate: [AuthenticationGuard],
  },
  // {
  //   path: "restaurant",
  //   component: RestaurantHomeComponent,
  // },
  {
    path: "restaurant/rewards",
    component: RewardConfiguratorComponent,
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
