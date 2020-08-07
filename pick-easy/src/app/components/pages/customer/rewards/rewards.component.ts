import { Component, ViewChild, ElementRef } from "@angular/core";
import { startWith, map } from "rxjs/operators";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import {
  Restaurant,
  RestaurantRewardLevel,
} from "src/app/shared/models/restaurant.model";

import { RestaurantService } from "src/app/shared/restaurant.service";
import { MatDialog } from "@angular/material/dialog";
import { UserService } from "src/app/shared/user.service";
import { AuthenticationService } from "src/app/shared/authentication.service";
import { User, CustomerReward } from "src/app/shared/models/user.model";
import { CustomerService } from "src/app/shared/customer.service";
import { RestaurantDetailsComponent } from "../restaurant-details/restaurant-details.component";
import { QRCodeComponent } from "../qr-code/qr-code.component";
import { ActivatedRoute } from "@angular/router";
import * as confetti from "canvas-confetti";
import { RewardPoolComponent } from "./reward-pool/reward-pool.component";
import { AutofillMonitor } from '@angular/cdk/text-field';

@Component({
  selector: "app-rewards",
  templateUrl: "./rewards.component.html",
  styleUrls: ["./rewards.component.css"],
})
export class RewardsComponent {
  @ViewChild("canvas") canvas: ElementRef<HTMLCanvasElement>;
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  restaurants: Restaurant[];
  currentUser = this.authenticationService.currentUser;
  customer: User;
  queryName: string;
  confetti: any;
  showOldLevel = false;
  showNewLevel = false;
  lootBoxOverlayOpened = false;
  levelUpOverlayOpened = false;
  levelUp: {
    oldLevel: RestaurantRewardLevel;
    newLevel: RestaurantRewardLevel;
  } = null;
  openedLootBox = false;
  lootBoxReward: CustomerReward;
  showLootBoxReward = false;
  levels: RestaurantRewardLevel[] = [
    "Bronze",
    "Silver",
    "Gold",
    "Platinum",
    "Diamond",
  ];
  openedRewardPool = false;

  constructor(
    private authenticationService: AuthenticationService,
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

    this.getRestaurants();
    this.getCustomer();
  }

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

  async getCustomer() {
    try {
      let customer = await this.userService
        .getUserInfo(this.currentUser._id)
        .toPromise();

      this.customer = customer;

      return customer;
    } catch {
      console.error("Could not retrieve customer information");
    }
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

  getCustomerRewardsByRestaurantId(
    restaurantId: string,
    level?: RestaurantRewardLevel
  ) {
    if (level) {
      return this.getCustomerLoyaltyByRestaurantId(
        restaurantId
      )?.rewards?.filter((reward) => reward.level == level);
    } else {
      return this.getCustomerLoyaltyByRestaurantId(restaurantId)?.rewards;
    }
  }

  async upgradeLevel(restaurantId: string) {
    await this.customerService
      .upgradeLevel(this.customer._id, restaurantId)
      .toPromise();
    const oldLevel = this.getCustomerLoyaltyByRestaurantId(restaurantId)?.level;
    const newLevel = this.levels[this.levels.indexOf(oldLevel) + 1];
    this.levelUp = { oldLevel, newLevel };
    this.showOldLevel = true;
    this.levelUpOverlayOpened = true;
    setTimeout(() => {
      this.showOldLevel = false;
    }, 2000);
    setTimeout(() => {
      this.showNewLevel = true;
    }, 2250);
    setTimeout(() => {
      this.showNewLevel = false;
      this.levelUpOverlayOpened = false;
    }, 6250);

    this.playConfetti(true);

    await this.getCustomer();
  }

  playConfetti(isLevelUpConfetti: boolean) {
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

      const clearCondition = isLevelUpConfetti
        ? !this.levelUpOverlayOpened
        : !this.showLootBoxReward;
      if (timeLeft <= 0 || clearCondition) {
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

  openDetailsDialog(restaurant: Restaurant) {
    this.dialog.open(RestaurantDetailsComponent, {
      width: "600px",
      data: { restaurant },
    });
  }

  openQRCodeDialog(restaurantId: string, customerRewardId: string) {
    const qrCodeDialog = this.dialog.open(QRCodeComponent, {
      data: {
        customerId: this.customer._id,
        restaurantId: restaurantId,
        customerRewardId: customerRewardId,
      },
    });

    qrCodeDialog.afterClosed().subscribe(() => {
      this.getCustomer();
    });
  }

  openRewardPool(restaurant: Restaurant, level: RestaurantRewardLevel) {
    this.dialog.open(RewardPoolComponent, {
      data: { restaurant: restaurant, level: level },
    });
  }

  async rollRandomReward(restaurantId: string) {
    this.lootBoxReward = await this.customerService
      .generateReward(this.customer._id, restaurantId)
      .toPromise();
    await this.getCustomer();
    this.lootBoxOverlayOpened = true;
  }

  openLootBox() {
    this.openedLootBox = true;
    setTimeout(() => {
      this.showLootBoxReward = true;
      this.playConfetti(false);
    }, 1000);
    setTimeout(() => {
      this.lootBoxOverlayOpened = false;
      this.openedLootBox = false;
      this.showLootBoxReward = false;
    }, 5000);
  }
}
