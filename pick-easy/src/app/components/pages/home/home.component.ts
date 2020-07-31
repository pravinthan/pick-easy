import { Component } from "@angular/core";
import { AuthenticationService } from "src/app/shared/authentication.service";
import { MatDialog } from "@angular/material/dialog";
import { SignInComponent } from "../../sign-in/sign-in.component";
import { SignUpComponent } from "../../sign-up/sign-up.component";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent {
  currentUser = this.authenticationService.currentUser;
  isRestaurantStaff = false;

  constructor(
    private authenticationService: AuthenticationService,
    public dialog: MatDialog,
    public router: Router
  ) {
    this.isRestaurantStaff = this.router.url == "/restaurant";
  }

  openSignInDialog() {
    const signInDialog = this.dialog.open(SignInComponent, {
      width: "400px",
      data: { isRestaurantStaff: this.isRestaurantStaff },
    });
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
    const signUpDialog = this.dialog.open(SignUpComponent, {
      width: "400px",
      data: { isRestaurantStaff: this.isRestaurantStaff },
    });
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
