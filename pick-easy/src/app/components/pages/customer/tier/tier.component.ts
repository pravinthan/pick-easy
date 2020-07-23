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
  countUpOptions = { duration: 4 };
  confetti: any;

  tier: RestaurantRewardLevel[] = [
    "Bronze",
    "Silver",
    "Gold",
    "Platinum",
    "Diamond",
  ];
  tierCount = 0;

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

  getTemplateByNumber(templateNumber: number): AchievementTemplate {
    return this.templates.find(
      (template) => template.templateNumber == templateNumber
    );
  }

  getRestaurantAchievementById(
    restaurantAchievements: RestaurantAchievement[],
    restaurantAchievementId: string
  ) {
    return restaurantAchievements.find(
      (restaurantAchievement) =>
        restaurantAchievement._id == restaurantAchievementId
    );
  }

  restaurantAchievementToText(restaurantAchievement: RestaurantAchievement) {
    let achievementWithVariables = this.getTemplateByNumber(
      restaurantAchievement.templateNumber
    ).value;
    for (const achievementVariable of restaurantAchievement.variables) {
      achievementWithVariables = achievementWithVariables.replace(
        ":variable",
        achievementVariable
      );
    }

    return achievementWithVariables;
  }

  getCustomerLoyaltyByRestaurantId(restaurantId: string) {
    return this.customer?.loyalties.find(
      (loyalty) => loyalty.restaurantId == restaurantId
    );
  }

  getCustomerAchievementsByRestaurantId(restaurantId: string) {
    return this.getCustomerLoyaltyByRestaurantId(restaurantId)?.achievements;
  }

  getUnactivatedAchievements(
    restaurantId: string,
    restaurantAchievements: RestaurantAchievement[]
  ) {
    // Filter out active achievements
    restaurantAchievements = restaurantAchievements.filter(
      (restaurantAchievement) =>
        !this.customer?.loyalties
          ?.find((loyalty) => loyalty.restaurantId == restaurantId)
          ?.achievements.find(
            (customerAchievement) =>
              customerAchievement.restaurantAchievementId ==
              restaurantAchievement._id
          )
    );

    // Filter out completed achievements
    restaurantAchievements = restaurantAchievements.filter(
      (restaurantAchievement) =>
        !this.customer?.loyalties
          ?.find((loyalty) => loyalty.restaurantId == restaurantId)
          ?.completedNonRepeatableAchievements.find(
            (completedNonRepeatableAchievement) =>
              completedNonRepeatableAchievement.restaurantAchievementId ==
              restaurantAchievement._id
          )
    );

    return restaurantAchievements;
  }

  getProgressionNumber(restaurantAchievement: RestaurantAchievement) {
    let templateVariables = this.getTemplateByNumber(
      restaurantAchievement.templateNumber
    ).variables;

    let templateVariableIndex = templateVariables.findIndex(
      (variable) => variable.isProgressionVariable
    );

    return Number(restaurantAchievement.variables[templateVariableIndex]);
  }

  activateAchievement(
    restaurantId: string,
    restaurantAchievement: RestaurantAchievement
  ) {
    this.customerService
      .initializeAchievement(
        this.customer._id,
        restaurantId,
        restaurantAchievement._id
      )
      .toPromise()
      .then((customer) => {
        this.customer = customer;
      });
  }

  openDetailsDialog(restaurant: Restaurant) {
    this.dialog.open(RestaurantDetailsComponent, {
      width: "600px",
      data: { restaurant },
    });
  }
  /////////////////
  async upgradeTier(restaurantId: string) {
    //put tier changing animation here?

    //first if statement and the number of tickets removed when moving up a tier
    //aren't connected to restaurant side variable values and values are not
    //being saved when updating tier?

    //temporary ticket amount needed to rank up set as 1
    if (
      this.getCustomerLoyaltyByRestaurantId(restaurantId).numberOfTickets == 1
    ) {
      //tickets decrease after moving up a tier. Current set with a temporary cost of 1 set
      this.getCustomerLoyaltyByRestaurantId(restaurantId).numberOfTickets =
      this.getCustomerLoyaltyByRestaurantId(restaurantId).numberOfTickets - 1;
      //count variable to keep track of the current tier user is on
      this.tierCount += 1;
      if (this.tierCount == 1) {
        this.getCustomerLoyaltyByRestaurantId(restaurantId).level = "Silver";
      } else if (this.tierCount == 2) {
        this.getCustomerLoyaltyByRestaurantId(restaurantId).level = "Gold";
      } else if (this.tierCount == 3) {
        this.getCustomerLoyaltyByRestaurantId(restaurantId).level = "Platinum";
      } else if (this.tierCount == 4) {
        this.getCustomerLoyaltyByRestaurantId(restaurantId).level = "Diamond";
      }
    }
  }
  /////////////////
}
