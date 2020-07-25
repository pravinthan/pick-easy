import { Component, ViewChild, ElementRef } from "@angular/core";
import { startWith, map } from "rxjs/operators";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { Restaurant } from "src/app/shared/models/restaurant.model";
import { RestaurantService } from "src/app/shared/restaurant.service";
import { MatDialog } from "@angular/material/dialog";
import { UserService } from "src/app/shared/user.service";
import { AuthenticationService } from "src/app/shared/authentication.service";
import { User } from "src/app/shared/models/user.model";
import { CustomerService } from "src/app/shared/customer.service";
import { RestaurantDetailsComponent } from "../restaurant-details/restaurant-details.component";
import { QRCodeComponent } from "../qr-code/qr-code.component";
import { ActivatedRoute } from "@angular/router";

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

  getCustomerRewardsByRestaurantId(restaurantId: string) {
    return this.getCustomerLoyaltyByRestaurantId(restaurantId)?.rewards;
  }

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

  openDetailsDialog(restaurant: Restaurant) {
    this.dialog.open(RestaurantDetailsComponent, {
      width: "600px",
      data: { restaurant },
    });
  }

  openQRCodeDialog(restaurantId: string, customerRewardId: string) {
    let qrCodeDialog = this.dialog.open(QRCodeComponent, {
      data: {
        customerId: this.currentUser._id,
        restaurantId: restaurantId,
        customerRewardId: customerRewardId,
      },
    });

    qrCodeDialog.afterClosed().subscribe(() => {
      this.getCustomer();
    });
  }
}
