import { Component, Output, EventEmitter, Inject } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "src/app/shared/authentication.service";
import { NOTYF } from "src/app/shared/utils/notyf.token";
import { Notyf } from "notyf";

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
    @Inject(NOTYF) private notyf: Notyf
  ) {
    if (this.authenticationService.currentUserValue)
      this.router.navigate(["/"]);
  }

  signIn(form: NgForm) {
    this.loading = true;
    this.authenticationService
      .signIn(form.value.username, form.value.password)
      .subscribe(
        (data) => {
          this.signedIn.emit(true);

          const returnUrl = this.route.snapshot.queryParams.returnUrl;
          if (returnUrl) this.router.navigate([returnUrl]);
          else this.router.navigate(["/"]);
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
