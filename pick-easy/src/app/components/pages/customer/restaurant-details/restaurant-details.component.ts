import { Component, Inject, ViewChild, ElementRef } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Restaurant } from "src/app/shared/models/restaurant.model";
import { AchievementTemplate } from "src/app/shared/models/achievement-template.model";
import { RestaurantService } from "src/app/shared/restaurant.service";

@Component({
  selector: "app-restaurant-details",
  templateUrl: "./restaurant-details.component.html",
  styleUrls: ["./restaurant-details.component.css"],
})
export class RestaurantDetailsComponent {
  @ViewChild("logo") logoImageElement: ElementRef<HTMLImageElement>;
  @ViewChild("image") imageElement: ElementRef<HTMLImageElement>;
  templates: AchievementTemplate[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { restaurant: Restaurant },
    public restaurantService: RestaurantService
  ) {}

  ngAfterViewInit() {
    this.getRestaurantImage(
      this.data.restaurant._id,
      this.logoImageElement.nativeElement
    );
    this.getRestaurantImage(
      this.data.restaurant._id,
      this.imageElement.nativeElement
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
}
