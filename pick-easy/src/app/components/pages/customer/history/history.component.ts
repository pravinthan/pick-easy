import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { AuthenticationService } from "src/app/shared/authentication.service";
import {
  User,
  UserAchievementLog,
  UserRewardLog,
} from "src/app/shared/models/user.model";
import { UserService } from "src/app/shared/user.service";

import { Restaurant } from "src/app/shared/models/restaurant.model";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { HistoryDialogComponent } from "./history-dialog/history-dialog.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.css"],
})
export class HistoryComponent implements AfterViewInit {
  availableDevices: MediaDeviceInfo[];
  deviceSelect = "none";
  currentDevice: MediaDeviceInfo = null;
  hasDevices: boolean;
  hasPermission: boolean;
  nextUpdateAllowed = true;
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
  restaurant: Restaurant;
  achievementLogDataSource: MatTableDataSource<UserAchievementLog>;
  rewardLogDataSource: MatTableDataSource<UserRewardLog>;
  currentUser: User;
  @ViewChild("achievementLogSort") achievementLogSort: MatSort;
  @ViewChild("rewardLogSort") rewardLogSort: MatSort;

  constructor(
    public dialog: MatDialog,
    authenticationService: AuthenticationService,
    userService: UserService  ) {
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
      });
  }

  ngAfterViewInit(): void {}

  openRedeemedRewardDialog(reward: string) {
    this.dialog.open(HistoryDialogComponent, {
      width: "600px",
      data: { reward },
      disableClose: true,
    });
  }
}
