import { Component, Output, EventEmitter, Inject } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "src/app/shared/authentication.service";
import { NOTYF } from "src/app/shared/utils/notyf.token";
import { Notyf } from "notyf";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.css"],
})
export class SignInComponent {
  loading = false;
  @Output() signedIn = new EventEmitter();

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: { isRestaurantStaff: boolean },
    @Inject(NOTYF) private notyf: Notyf
  ) {
    if (this.authenticationService.currentUserValue)
      this.router.navigate(["/"]);
  }

  signIn(form: NgForm) {
    this.loading = true;
    this.authenticationService
      .signIn(
        form.value.username,
        form.value.password,
        this.data.isRestaurantStaff
      )
      .subscribe(
        (data) => {
          this.signedIn.emit(true);
          this.router.navigate(["/"]);
        },
        (error) => {
          this.loading = false;

          this.notyf.error(
            error.status == 401 ? error.error : "Sign in failed, try again."
          );
        }
      );
  }
}
