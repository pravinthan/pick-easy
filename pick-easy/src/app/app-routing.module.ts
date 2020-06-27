import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SignUpComponent } from "./components/sign-up/sign-up.component";
import { SignInComponent } from "./components/sign-in/sign-in.component";
import { PageNotFoundComponent } from "./components/pages/page-not-found/page-not-found.component";
import { HomeComponent } from "./components/pages/home/home.component";
import { CreditsComponent } from "./components/pages/credits/credits.component";
import { LoyaltyComponent } from "./components/loyalty/loyalty.component";

const routes: Routes = [
  { path: "", pathMatch: "full", component: HomeComponent },
  { path: "signin", component: SignInComponent },
  { path: "signup", component: SignUpComponent },
  { path: "credits", component: CreditsComponent },
  { path : "loyalty", component: LoyaltyComponent},
  { path: "**", component: PageNotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
