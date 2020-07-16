import { Injectable, Inject } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { AuthenticationService } from "./authentication.service";
import { NOTYF } from "./utils/notyf.token";
import { Notyf } from "notyf";

@Injectable({
  providedIn: "root",
})
export class AuthenticationGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    @Inject(NOTYF) private notyf: Notyf
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authenticationService.currentUserValue) return true;

    this.router.navigate(["/"], { queryParams: { returnUrl: state.url } });
    this.notyf.error(
      "Unauthorized or forbidden access to this resource, try signing in"
    );

    return false;
  }
}
