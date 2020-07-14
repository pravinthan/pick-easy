import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { map, startWith } from "rxjs/operators";
import { Observable } from "rxjs";
import { Restaurant } from "src/app/shared/models/restaurant.model";
import { MatDialog } from "@angular/material/dialog";
import { RestaurantDetailsComponent } from "src/app/components/pages/customer/discover/restaurant-details/restaurant-details.component";
import { RestaurantService } from "src/app/shared/restaurant.service";

@Component({
  selector: "app-discover",
  templateUrl: "./discover.component.html",
  styleUrls: ["./discover.component.css"],
})
export class DiscoverComponent implements OnInit {
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  restaurants: Restaurant[];

  constructor(
    public restaurantService: RestaurantService,
    public dialog: MatDialog
  ) {
    this.restaurantService
      .getAllRestaurants()
      .toPromise()
      .then((restaurants) => {
        this.restaurants = restaurants;
      });
  }

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
