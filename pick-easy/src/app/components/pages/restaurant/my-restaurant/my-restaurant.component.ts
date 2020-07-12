import { Component } from "@angular/core";
import { Restaurant } from "src/app/shared/models/restaurant.model";

@Component({
  selector: "app-my-restaurant",
  templateUrl: "./my-restaurant.component.html",
  styleUrls: ["./my-restaurant.component.css"],
})
export class MyRestaurantComponent {
  restaurant = Restaurant;
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
