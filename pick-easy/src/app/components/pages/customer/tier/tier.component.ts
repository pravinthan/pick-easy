import { Component, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { startWith, map } from "rxjs/operators";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import {
  Restaurant,
  RestaurantAchievement,
  RestaurantRewardLevel,
} from "src/app/shared/models/restaurant.model";
import { RestaurantService } from "src/app/shared/restaurant.service";
import { MatDialog } from "@angular/material/dialog";
import { UserService } from "src/app/shared/user.service";
import { TemplateService } from "src/app/shared/template.service";
import { AchievementTemplate } from "src/app/shared/models/achievement-template.model";
import { AuthenticationService } from "src/app/shared/authentication.service";
import { User } from "src/app/shared/models/user.model";
import { CustomerService } from "src/app/shared/customer.service";
import { RestaurantDetailsComponent } from "../restaurant-details/restaurant-details.component";
import * as confetti from "canvas-confetti";

@Component({
  selector: "app-achievements",
  templateUrl: "./tier.component.html",
  styleUrls: ["./tier.component.css"],
})
export class TierComponent implements AfterViewInit {
  @ViewChild("canvas") canvas: ElementRef<HTMLCanvasElement>;
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  restaurants: Restaurant[];
  templates: AchievementTemplate[];
  currentUser = this.authenticationService.currentUser;
  customer: User;
  endVal: number = null;
  tierVal: string = null;
  countUpOptions = { duration: 4 };
  confetti: any;

  constructor(
    private authenticationService: AuthenticationService,
    private templateService: TemplateService,
    public restaurantService: RestaurantService,
    public userService: UserService,
    public customerService: CustomerService,
    public dialog: MatDialog
  ) {
    this.templateService
      .getAchievementTemplates()
      .toPromise()
      .then((templates) => (this.templates = templates));

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => (value.length >= 1 ? this._filter(value) : []))
    );

    this.getRestaurants();
    this.getCustomer();
  }

  ngAfterViewInit() {
    this.canvas.nativeElement.width = window.innerWidth;

    this.confetti = confetti.create(this.canvas.nativeElement, {
      resize: true,
    });
  }

  async getRestaurants() {
    let restaurants = await this.restaurantService
      .getAllRestaurants()
      .toPromise();

    this.restaurants = restaurants;

    return restaurants;
  }

  async getCustomer() {
    let customer = await this.userService
      .getUserInfo(this.currentUser._id)
      .toPromise();

    this.customer = customer;

    return customer;
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.restaurants
      .map((restaurant) => restaurant.name)
      .filter((name) => name.toLowerCase().indexOf(filterValue) != -1);
  }

  getCustomerLoyaltyByRestaurantId(restaurantId: string) {
    return this.customer?.loyalties.find(
      (loyalty) => loyalty.restaurantId == restaurantId
    );
  }

  openDetailsDialog(restaurant: Restaurant) {
    this.dialog.open(RestaurantDetailsComponent, {
      width: "600px",
      data: { restaurant },
    });
  }
  /////////////////
  async upgradeLevel(restaurantId: string) {
    // put tier changing animation here?

    // first if statement and the number of tickets removed when moving up a tier
    // aren't connected to restaurant side variable values and values are not
    // being saved when updating tier?
    await this.customerService
      .upgradeLevel(this.customer._id, restaurantId)
      .toPromise();

    await this.getCustomer();
  }
  /////////////////
}
