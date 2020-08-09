import { Component, ViewChild } from "@angular/core";
import { AuthenticationService } from "src/app/shared/authentication.service";
import {
  User,
  UserAchievementLog,
  UserRewardLog,
} from "src/app/shared/models/user.model";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { FormControl } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { CustomerService } from "src/app/shared/customer.service";

@Component({
  selector: "app-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.css"],
})
export class HistoryComponent {
  // Class-level vars
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
  achievementLogDataSource: MatTableDataSource<UserAchievementLog>;
  rewardLogDataSource: MatTableDataSource<UserRewardLog>;
  currentUser = this.authenticationService.currentUser;
  customer: User;
  queryName: string;
  filteredOptions: Observable<string[]>;
  myControl = new FormControl();
  @ViewChild("achievementLogSort") achievementLogSort: MatSort;
  @ViewChild("rewardLogSort") rewardLogSort: MatSort;

  constructor(
    public route: ActivatedRoute,
    public customerService: CustomerService,
    public authenticationService: AuthenticationService
  ) {
    // Gets users information and adds it to history table
    customerService
      .getCustomerInformation(this.currentUser._id)
      .toPromise()
      .then((customer) => {
        this.customer = customer;
        this.achievementLogDataSource = new MatTableDataSource(
          this.customer.log.achievements
        );
        this.achievementLogDataSource.sort = this.achievementLogSort;
        this.rewardLogDataSource = new MatTableDataSource(
          this.customer.log.rewards
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

  // Filters out data from the table
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.achievementLogDataSource.filter = filterValue.trim().toLowerCase();
    this.rewardLogDataSource.filter = filterValue.trim().toLowerCase();
  }
}
