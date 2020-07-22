import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  AfterViewInit,
  AfterViewChecked,
  ElementRef,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { map, startWith } from "rxjs/operators";
import { Observable } from "rxjs";
import { Restaurant } from "src/app/shared/models/restaurant.model";
import { MatDialog } from "@angular/material/dialog";
import { RestaurantDetailsComponent } from "src/app/components/pages/customer/restaurant-details/restaurant-details.component";
import { RestaurantService } from "src/app/shared/restaurant.service";

@Component({
  selector: "app-discover",
  templateUrl: "./discover.component.html",
  styleUrls: ["./discover.component.css"],
})
export class DiscoverComponent implements OnInit, AfterViewInit {
  @ViewChildren("logo") logoImageElements: QueryList<HTMLImageElement>;
  @ViewChildren("image") imageElements: QueryList<HTMLImageElement>;
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

  ngAfterViewInit() {
    this.logoImageElements.changes.subscribe(
      (logoImageElements: QueryList<ElementRef<HTMLImageElement>>) => {
        this.getRestaurantImage(
          logoImageElements.last.nativeElement.id.substring(
            0,
            logoImageElements.last.nativeElement.id.indexOf("-")
          ),
          logoImageElements.last.nativeElement
        );
      }
    );

    this.imageElements.changes.subscribe(
      (imageElements: QueryList<ElementRef<HTMLImageElement>>) => {
        this.getRestaurantImage(
          imageElements.last.nativeElement.id.substring(
            0,
            imageElements.last.nativeElement.id.indexOf("-")
          ),
          imageElements.last.nativeElement
        );
      }
    );
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => (value.length >= 1 ? this._filter(value) : []))
    );
  }

  async getRestaurantImage(
    restaurantId: string,
    imageElement: HTMLImageElement
  ) {
    const image = await this.restaurantService
      .getRestaurantImage(restaurantId)
      .toPromise();

    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = () => {
      imageElement.src = reader.result as string;
    };
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
