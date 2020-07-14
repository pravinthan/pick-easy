import { Component } from "@angular/core";
import { Restaurant } from "src/app/shared/models/restaurant.model";

@Component({
  selector: "app-my-picks",
  templateUrl: "./my-picks.component.html",
  styleUrls: ["./my-picks.component.css"],
})
export class MyPicksComponent {
  restaurants: Restaurant[] = [];

  constructor() {}
}
