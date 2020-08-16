import { Component, ViewChild } from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { AuthenticationService } from "src/app/shared/authentication.service";

@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.css"],
})
export class NavigationComponent {
  @ViewChild(MatSidenav) sidebar: MatSidenav;
  currentUser = this.authenticationService.currentUser;
  signingOut = false;

  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.currentUserObservable.subscribe((userToken) => {
      if ((userToken?.token as string)?.split(".").length == 3) {
        this.currentUser = this.authenticationService.currentUser;
      }
    });
  }

  /* Tells authentication service that user is signed out  */
  signOut() {
    this.signingOut = true;
    this.authenticationService.signOut();
    this.currentUser = null;
    window.location.href = "/";
  }
}
