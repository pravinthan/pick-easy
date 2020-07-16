import { Injectable, Inject } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthenticationService } from "./authentication.service";
import { NOTYF } from "./utils/notyf.token";
import { Notyf } from "notyf";

@Injectable({ providedIn: "root" })
export class RestaurantCreationGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    @Inject(NOTYF) private notyf: Notyf
  ) {}

  canActivate() {
    if (this.authenticationService.currentUser.createdRestaurant) return true;

    this.router.navigate(["/restaurant"]);
    this.notyf.error("Create a restaurant to access this resource");

    return false;
  }
}
