import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { map, startWith } from "rxjs/operators";
import { Observable } from "rxjs";
import { Restaurant } from "src/app/shared/models/restaurant.model";
import { MatDialog } from "@angular/material/dialog";
import { RestaurantDetailsComponent } from "src/app/components/pages/consumer/discover/restaurant-details/restaurant-details.component";

@Component({
  selector: "app-discover",
  templateUrl: "./discover.component.html",
  styleUrls: ["./discover.component.css"],
})
export class DiscoverComponent implements OnInit {
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  restaurants: Array<Restaurant> = [
    {
      _id: "11",
      name: "Kinton Ramen",
      description: "This is Kinton Ramen",
      rating: 1,
      cost: 1,
      cuisine: "Japanese",
      numberOfStampsForReward: 5,
      achievements: [
        {
          templateNumber: 4,
          variables: [],
          numberOfStamps: 5,
        },
        {
          templateNumber: 5,
          variables: [],
          numberOfStamps: 5,
        },
      ],
    },
    {
      _id: "12",
      name: "Panda Express",
      description: "This is panda express",
      rating: 3,
      cost: 2,
      cuisine: "Chinese",
      numberOfStampsForReward: 5,
      achievements: [
        {
          templateNumber: 5,
          variables: [],
          numberOfStamps: 5,
        },
      ],
    },
    {
      _id: "13",
      name: "KFC",
      description: "This is kfc",
      rating: 4,
      cost: 3,
      cuisine: "American",
      numberOfStampsForReward: 5,
      achievements: [
        {
          templateNumber: 6,
          variables: [],
          numberOfStamps: 5,
        },
      ],
    },
  ];

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => (value.length >= 1 ? this._filter(value) : []))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.restaurants
      .map((restaurant) => restaurant.name)
      .filter((name) => name.toLowerCase().indexOf(filterValue) != -1);
  }

  openDetailsDialog(restaurant: Restaurant) {
    this.dialog.open(RestaurantDetailsComponent, {
      width: "600px",
      data: { restaurant },
    });
  }
}
