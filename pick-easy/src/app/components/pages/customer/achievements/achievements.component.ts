import { Component, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { startWith, map } from "rxjs/operators";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import {
  Restaurant,
  RestaurantAchievement,
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
import { QRCodeComponent } from "../qr-code/qr-code.component";
import * as confetti from "canvas-confetti";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-achievements",
  templateUrl: "./achievements.component.html",
  styleUrls: ["./achievements.component.css"],
})
export class AchievementsComponent implements AfterViewInit {
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
    public userService: UserService,
    public customerService: CustomerService,
    public dialog: MatDialog,
    public route: ActivatedRoute
  ) {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value: string) =>
        value.length >= 1 ? this._filter(value.trim()) : []
      )
    );

    this.queryName = this.route.snapshot.queryParamMap.get("restaurantName");
    this.myControl.setValue(this.queryName);

    this.templateService
      .getAchievementTemplates()
      .toPromise()
      .then((templates) => (this.templates = templates));

    this.getCustomer();
    this.getRestaurants().then();
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

    this.confetti({
      particleCount: 100,
      spread: 90,
      origin: {
        y: 1,
        x: 0.5,
      },
      zIndex: 1001,
    });
  }

  openDetailsDialog(restaurant: Restaurant) {
    this.dialog.open(RestaurantDetailsComponent, {
      width: "600px",
      data: { restaurant },
    });
  }

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
