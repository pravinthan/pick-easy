import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Component, Output, EventEmitter, Inject } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthenticationService } from "src/app/shared/authentication.service";
import { NOTYF } from "src/app/shared/utils/notyf.token";
import { Notyf } from "notyf";

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.css"],
})
export class SignUpComponent {
  loading = false;
  @Output() signedUp = new EventEmitter();

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: { isRestaurantStaff: boolean },
    @Inject(NOTYF) private notyf: Notyf
  ) {
    if (this.authenticationService.currentUserValue)
      this.router.navigate(["/"]);
  }

  /* Given a form, use the username, password, first name, and last name
     to sign up through authentication service. Note restaurant status is passed
     through dialog */
  signUp(form: NgForm) {
    this.loading = true;
    this.authenticationService
      .signUp(
        form.value.username,
        form.value.password,
        form.value.firstName,
        form.value.lastName,
        this.data.isRestaurantStaff
      )
      .subscribe(
        (data) => {
          this.signedUp.emit(true);
          ``;
          if (!this.data.isRestaurantStaff) this.router.navigate(["/customer"]);
          else this.router.navigate(["/restaurant"]);
        },
        (error) => {
          this.loading = false;

          this.notyf.error(
            error.status == 409 ? error.error : "Sign up failed, try again."
          );
        }
      );
  }
}
