import { Component } from "@angular/core";
import { Restaurant } from "src/app/shared/models/restaurant.model";
import { RestaurantService } from 'src/app/shared/restaurant.service';
import { AuthenticationService } from 'src/app/shared/authentication.service';

@Component({
  selector: "app-my-restaurant",
  templateUrl: "./my-restaurant.component.html",
  styleUrls: ["./my-restaurant.component.css"],
})
export class MyRestaurantComponent {
  restaurant: Restaurant;

  constructor(
    restaurantService: RestaurantService,
    authenticationService: AuthenticationService
  ) {
    restaurantService
      .getRestaurantById(authenticationService.currentUserId)
      .subscribe((res) => {
        this.restaurant = res;
      });
  }
  food: string[] = [
    "Mexican",
    "Italian",
    "American",
    "Thai",
    "Japanese",
    "Chinese",
    "Indian",
    "French",
    "Brazilian",
    "Korean",
    "Greek",
  ];
  costs: number[] = [
    1,
    2,
    3,
    4,
  ];

}
