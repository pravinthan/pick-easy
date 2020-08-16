import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  AfterViewInit,
  ElementRef,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { map, startWith } from "rxjs/operators";
import { Observable } from "rxjs";
import { Restaurant } from "src/app/shared/models/restaurant.model";
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

  constructor(public restaurantService: RestaurantService) {
    this.restaurantService
      .getAllRestaurants()
      .toPromise()
      .then((restaurants) => {
        this.restaurants = restaurants;
      });
  }

  /* Overridden function that sets the image of the restaurant  */
  ngAfterViewInit() {
    this.logoImageElements.changes.subscribe(
      (logoImageElements: QueryList<ElementRef<HTMLImageElement>>) => {
        logoImageElements.forEach((logoImageElement) => {
          this.getRestaurantImage(
            logoImageElement.nativeElement.id.substring(
              0,
              logoImageElement.nativeElement.id.indexOf("-")
            ),
            logoImageElement.nativeElement
          );
        });
      }
    );

    this.imageElements.changes.subscribe(
      (imageElements: QueryList<ElementRef<HTMLImageElement>>) => {
        imageElements.forEach((imageElement) => {
          this.getRestaurantImage(
            imageElement.nativeElement.id.substring(
              0,
              imageElement.nativeElement.id.indexOf("-")
            ),
            imageElement.nativeElement
          );
        });
      }
    );
  }

  /* Lifecycle hook that searches filtered options (in Observable) */
  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value: string) =>
        value.length >= 1 ? this._filter(value.trim()) : []
      )
    );
  }

  /* Given restaurant id and <img> element obtains the restaurant image through restaurant service */
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

  /* Given a string, returns a list of all restaurant names starting with that string (case-insensitive) */
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.restaurants
      .map((restaurant) => restaurant.name)
      .filter((name) => name.toLowerCase().indexOf(filterValue) != -1);
  }
}
