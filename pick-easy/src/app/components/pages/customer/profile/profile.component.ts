import { Component } from "@angular/core";
import { UserService } from "src/app/shared/user.service";
import { User } from "src/app/shared/models/user.model";
import { AuthenticationService } from "src/app/shared/authentication.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent {
  user: User;

  constructor(
    userService: UserService,
    authenticationService: AuthenticationService
  ) {
    userService
      .getUserInfo(authenticationService.currentUserId)
      .subscribe((res) => {
        this.user = res;
      });
  }
}
