import { Component } from "@angular/core";
import { Restaurant } from "src/app/shared/models/restaurant.model";

@Component({
  selector: "app-my-picks",
  templateUrl: "./my-picks.component.html",
  styleUrls: ["./my-picks.component.css"],
})
export class MyPicksComponent {
  restaurants: Restaurant[] = [
    {
      _id: "11",
      name: "Kinton Ramen",
      description: "This is Kinton Ramen",
      rating: 1,
      cost: 1,
      cuisine: "Japanese",
    },
    {
      _id: "12",
      name: "Panda Express",
      description: "This is panda express",
      rating: 3,
      cost: 2,
      cuisine: "Chinese",
    },
    {
      _id: "13",
      name: "KFC",
      description: "This is kfc",
      rating: 4,
      cost: 3,
      cuisine: "American",
    },
  ];

  constructor() {}
}
