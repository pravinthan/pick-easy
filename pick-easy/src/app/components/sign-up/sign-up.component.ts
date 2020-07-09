import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Output, EventEmitter, Inject } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
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
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: {is_restaurant_owner: boolean},
    @Inject(NOTYF) private notyf: Notyf
  ) {
    if (this.authenticationService.currentUserValue)
      this.router.navigate(["/"]);
  }

  signUp(form: NgForm) {
    this.loading = true;
    this.authenticationService
      .signUp(
        form.value.username,
        form.value.password,
        form.value.firstName,
        form.value.lastName,
        this.data.is_restaurant_owner
      )
      .subscribe(
        (data) => {
          this.signedUp.emit(true);
          const returnUrl = this.route.snapshot.queryParams.returnUrl;
          //console.log(this.data.is_restaurant_owner);
          //if (returnUrl) this.router.navigate([returnUrl]);
          if (!this.data.is_restaurant_owner) this.router.navigate(["/consumer"])
          else if (this.data.is_restaurant_owner) this.router.navigate(["/restaurant"])
          //else this.router.navigate(["/consumer"]);
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
