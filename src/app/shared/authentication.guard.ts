import { Injectable, Inject } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthenticationService } from "./authentication.service";
import { NOTYF } from "./utils/notyf.token";
import { Notyf } from "notyf";

/* Ensures if user is not logged in, they cannot access other pages than root */
@Injectable({ providedIn: "root" })
export class AuthenticationGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    @Inject(NOTYF) private notyf: Notyf
  ) {}

  canActivate() {
    if (this.authenticationService.currentUserValue) return true;

    this.router.navigate(["/"]);
    this.notyf.error(
      "Unauthorized or forbidden access to this resource, try signing in"
    );

    return false;
  }
}
