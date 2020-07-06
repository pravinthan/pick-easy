import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { map, startWith } from "rxjs/operators";
import { Observable } from "rxjs";
import { Restaurant } from "src/app/shared/models/restaurant.model";

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
}
