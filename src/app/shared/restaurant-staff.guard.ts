import { Injectable, Inject } from "@angular/core";
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthenticationService } from "./authentication.service";
import { NOTYF } from "./utils/notyf.token";
import { Notyf } from "notyf";

@Injectable({ providedIn: "root" })
export class RestaurantStaffGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    @Inject(NOTYF) private notyf: Notyf
  ) {}

  /* Guards against non-restaurant-staff from routing to restaurant routes */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authenticationService.currentUser.isRestaurantStaff) return true;

    this.router.navigate(["/"]);
    this.notyf.error("Unauthorized or forbidden access to this resource");

    return false;
  }
}
