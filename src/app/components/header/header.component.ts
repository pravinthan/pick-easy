import { Component, Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AuthenticationService } from "src/app/shared/authentication.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  currentUser = this.authenticationService.currentUser;
  signingOut = false;

  constructor(
    public dialog: MatDialog,
    private authenticationService: AuthenticationService
  ) {
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
