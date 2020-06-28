import { AuthenticationService } from "./../../shared/authentication.service";
import { UserService } from "./../../shared/user.service";
import { User } from "./../../shared/models/user.model";
import { Component } from "@angular/core";

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
