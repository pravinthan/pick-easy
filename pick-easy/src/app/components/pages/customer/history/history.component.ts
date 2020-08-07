import { Component, ViewChild } from "@angular/core";
import { AuthenticationService } from "src/app/shared/authentication.service";
import {
  User,
  UserAchievementLog,
  UserRewardLog,
} from "src/app/shared/models/user.model";
import { UserService } from "src/app/shared/user.service";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { FormControl } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";

@Component({
  selector: "app-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.css"],
})
// class represenation of table data
export class HistoryComponent {
  achievementLogDisplayedColumns: string[] = [
    "timeOfScan",
    "restaurantName",
    "achievement",
    "progress",
  ];
  rewardLogDisplayedColumns: string[] = [
    "timeOfScan",
    "restaurantName",
    "reward",
  ];
  //inialized variables
  achievementLogDataSource: MatTableDataSource<UserAchievementLog>;
  rewardLogDataSource: MatTableDataSource<UserRewardLog>;
  currentUser: User;
  queryName: string;
  filteredOptions: Observable<string[]>;
  myControl = new FormControl();
  @ViewChild("achievementLogSort") achievementLogSort: MatSort;
  @ViewChild("rewardLogSort") rewardLogSort: MatSort;

  constructor(
    public route: ActivatedRoute,
    authenticationService: AuthenticationService,
    userService: UserService
  ) {
    // Gets users information and adds it to history table
    userService
      .getUserInfo(authenticationService.currentUserId)
      .subscribe((res) => {
        this.currentUser = res;
        this.achievementLogDataSource = new MatTableDataSource(
          this.currentUser.log.achievements
        );
        this.achievementLogDataSource.sort = this.achievementLogSort;
        this.rewardLogDataSource = new MatTableDataSource(
          this.currentUser.log.rewards
        );
        this.rewardLogDataSource.sort = this.rewardLogSort;
        this.queryName = this.route.snapshot.queryParamMap.get(
          "restaurantName"
        );
        this.myControl.setValue(this.queryName);
        this.achievementLogDataSource.filter = this.queryName;
        this.rewardLogDataSource.filter = this.queryName;
      });
  }
  // filters out data from the table
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.achievementLogDataSource.filter = filterValue.trim().toLowerCase();
    this.rewardLogDataSource.filter = filterValue.trim().toLowerCase();
  }
}
