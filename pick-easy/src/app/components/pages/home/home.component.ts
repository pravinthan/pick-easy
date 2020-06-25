import { Component } from "@angular/core";
import { AuthenticationService } from "src/app/shared/authentication.service";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { SignUpComponent } from "../../sign-up/sign-up.component";
import { SignInComponent } from "../../sign-in/sign-in.component";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent {
  currentUser = this.authenticationService.currentUser;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    public dialog: MatDialog
  ) {
    // if (this.authenticationService.currentUserValue)
    //   this.router.navigateByUrl("/dashboard", { skipLocationChange: true });
  }

  openSignInDialog() {
    const signInDialog = this.dialog.open(SignInComponent, { width: "400px" });
    const signInSubscription = signInDialog.componentInstance.signedIn.subscribe(
      (signedIn: boolean) => {
        if (signedIn) {
          this.currentUser = this.authenticationService.currentUser;
          signInDialog.close();
        }
      }
    );

    signInDialog.afterClosed().subscribe((signedIn: boolean) => {
      signInSubscription.unsubscribe();
    });
  }

  openSignUpDialog() {
    const signUpDialog = this.dialog.open(SignUpComponent, { width: "400px" });
    const signUpSubscription = signUpDialog.componentInstance.signedUp.subscribe(
      (signedUp: boolean) => {
        if (signedUp) {
          this.currentUser = this.authenticationService.currentUser;
          signUpDialog.close();
        }
      }
    );

    signUpDialog.afterClosed().subscribe((signedUp: boolean) => {
      signUpSubscription.unsubscribe();
    });
  }
}
