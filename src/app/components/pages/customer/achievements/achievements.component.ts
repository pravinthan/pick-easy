import { Component, ViewChild, ElementRef } from "@angular/core";
import { startWith, map } from "rxjs/operators";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import {
  Restaurant,
  RestaurantAchievement,
} from "src/app/shared/models/restaurant.model";
import { RestaurantService } from "src/app/shared/restaurant.service";
import { MatDialog } from "@angular/material/dialog";
import { TemplateService } from "src/app/shared/template.service";
import { AchievementTemplate } from "src/app/shared/models/achievement-template.model";
import { AuthenticationService } from "src/app/shared/authentication.service";
import { User } from "src/app/shared/models/user.model";
import { CustomerService } from "src/app/shared/customer.service";
import { RestaurantDetailsComponent } from "../restaurant-details/restaurant-details.component";
import { QRCodeComponent } from "../qr-code/qr-code.component";
import * as confetti from "canvas-confetti";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-achievements",
  templateUrl: "./achievements.component.html",
  styleUrls: ["./achievements.component.css"],
})
export class AchievementsComponent {
  // Class-level variables
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
  queryName: string;

  constructor(
    private authenticationService: AuthenticationService,
    private templateService: TemplateService,
    public restaurantService: RestaurantService,
    public customerService: CustomerService,
    public dialog: MatDialog,
    public route: ActivatedRoute
  ) {
    // Search filtered options (in Observable)
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value: string) =>
        value.length >= 1 ? this._filter(value.trim()) : []
      )
    );

    // Gets the restaurant's name from the query params
    this.queryName = this.route.snapshot.queryParamMap.get("restaurantName");
    this.myControl.setValue(this.queryName);

    // Get the achievement templates
    this.templateService
      .getAchievementTemplates()
      .toPromise()
      .then((templates) => (this.templates = templates));

    // Get the current customer information and all restaurants
    this.getCustomer();
    this.getRestaurants();
  }

  /* Function that gets all the restaurants */
  async getRestaurants() {
    try {
      let restaurants = await this.restaurantService
        .getAllRestaurants()
        .toPromise();

      this.restaurants = restaurants;

      return restaurants;
    } catch {
      console.error("Could not retrieve restaurants information");
    }
  }

  /* Function that gets the current customer */
  async getCustomer() {
    try {
      let customer = await this.customerService
        .getCustomerInformation(this.currentUser._id)
        .toPromise();

      this.customer = customer;

      return customer;
    } catch {
      console.error("Could not retrieve customer information");
    }
  }

  /* Function that filters the restaurants by a string */
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.restaurants
      .map((restaurant) => restaurant.name)
      .filter((name) => name.toLowerCase().indexOf(filterValue) != -1);
  }

  /* Function that gets an achievement template by its number */
  getTemplateByNumber(templateNumber: number): AchievementTemplate {
    return this.templates?.find(
      (template) => template.templateNumber == templateNumber
    );
  }

  /* Function that gets restaurant achievement given its restaurant achievement
  array and a specific restaurant achievement id */
  getRestaurantAchievementById(
    restaurantAchievements: RestaurantAchievement[],
    restaurantAchievementId: string
  ) {
    return restaurantAchievements.find(
      (restaurantAchievement) =>
        restaurantAchievement._id == restaurantAchievementId
    );
  }

  /* Function that converts a restaurant achievement to text form */
  restaurantAchievementToText(restaurantAchievement: RestaurantAchievement) {
    let achievementWithVariables = this.getTemplateByNumber(
      restaurantAchievement.templateNumber
    )?.value;
    for (const achievementVariable of restaurantAchievement.variables) {
      achievementWithVariables = achievementWithVariables?.replace(
        ":variable",
        achievementVariable
      );
    }

    return achievementWithVariables;
  }

  /* Function that gets the customer's loyalty object given a restaurant id */
  getCustomerLoyaltyByRestaurantId(restaurantId: string) {
    return this.customer?.loyalties.find(
      (loyalty) => loyalty.restaurantId == restaurantId
    );
  }

  /* Function that gets customer achievements by the restaurant id */
  getCustomerAchievementsByRestaurantId(restaurantId: string) {
    return this.getCustomerLoyaltyByRestaurantId(restaurantId)?.achievements;
  }

  /* Function that gets all the unactivated achievements given its restaurant achievement
  array and a specific restaurant achievement id */
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

  /* Function that gets the progression value for a given restaurant achievement */
  getProgressionNumber(restaurantAchievement: RestaurantAchievement) {
    let templateVariables = this.getTemplateByNumber(
      restaurantAchievement.templateNumber
    ).variables;

    let templateVariableIndex = templateVariables.findIndex(
      (variable) => variable.isProgressionVariable
    );

    return Number(restaurantAchievement.variables[templateVariableIndex]);
  }

  /* Function that activates a specific customer achievement */
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

  /* Function that redeems the tickets for a given restaurant achievement id and the restaurant id */
  async redeemTickets(restaurantId: string, restaurantAchievementId: string) {
    await this.customerService
      .redeemTicketsForCompletedAchievement(
        this.customer._id,
        restaurantId,
        restaurantAchievementId
      )
      .toPromise();

    await this.getCustomer();

    this.endVal = this.getCustomerLoyaltyByRestaurantId(
      restaurantId
    ).numberOfTickets;

    this.playConfetti();
  }

  /* Function that plays the confetti animation in the view */
  playConfetti() {
    this.canvas.nativeElement.width = window.innerWidth;
    this.canvas.nativeElement.height = Math.max(
      this.canvas.nativeElement.parentElement.parentElement.offsetHeight,
      window.innerHeight
    );

    this.confetti = confetti.create(this.canvas.nativeElement, {
      resize: true,
    });

    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0 || !this.endVal) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      this.confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 0,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      this.confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 0,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  }

  /* Function that opens the restaurant details dialog with the given restaurant object */
  openDetailsDialog(restaurant: Restaurant) {
    this.dialog.open(RestaurantDetailsComponent, {
      width: "600px",
      data: { restaurant },
    });
  }

  /* Function that opens the QR code dialog given the restaurant's id and restaurant achievement id */
  openQRCodeDialog(restaurantId: string, restaurantAchievementId: string) {
    let qrCodeDialog = this.dialog.open(QRCodeComponent, {
      data: {
        customerId: this.currentUser._id,
        restaurantId: restaurantId,
        restaurantAchievementId: restaurantAchievementId,
      },
    });

    qrCodeDialog.afterClosed().subscribe(() => {
      this.getCustomer();
    });
  }
}
