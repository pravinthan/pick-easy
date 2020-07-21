import {
  FormControl,
  Validators,
  ValidatorFn,
  FormGroup,
} from "@angular/forms";
import { RestaurantService } from "src/app/shared/restaurant.service";
import {
  RestaurantCuisine,
  RestaurantCost,
} from "./../../../../shared/models/restaurant.model";
import { Component, OnInit, Inject } from "@angular/core";
import { Restaurant } from "src/app/shared/models/restaurant.model";
import { MaxSizeValidator } from "@angular-material-components/file-input";
import { SafeUrl } from "@angular/platform-browser";
import { Notyf } from "notyf";
import { NOTYF } from "src/app/shared/utils/notyf.token";
import { AuthenticationService } from "src/app/shared/authentication.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-my-restaurant",
  templateUrl: "./my-restaurant.component.html",
  styleUrls: ["./my-restaurant.component.css"],
})
export class MyRestaurantComponent implements OnInit {
  form: FormGroup;
  imageSrc: SafeUrl;
  fileControl: FormControl;
  file: File;
  restaurant: Restaurant;
  food: RestaurantCuisine[] = [
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
  costs: RestaurantCost[] = [1, 2, 3, 4];

  constructor(
    public restaurantService: RestaurantService,
    private router: Router,
    private authenticationService: AuthenticationService,
    @Inject(NOTYF) private notyf: Notyf
  ) {
    const imageValidators: ValidatorFn[] = [MaxSizeValidator(1024 * 1024 * 10)];
    this.fileControl = new FormControl(this.file, imageValidators);
    this.form = new FormGroup({
      restaurantImage: this.fileControl,
      restaurantName: new FormControl(""),
      restaurantDescription: new FormControl(""),
      restaurantCost: new FormControl(""),
      restaurantCuisine: new FormControl(""),
    });

    if (this.authenticationService.currentUser?.createdRestaurant) {
      this.restaurantService
        .getOwnRestaurant()
        .toPromise()
        .then((restaurant) => {
          this.restaurant = restaurant;

          if (!this.restaurant.image) {
            imageValidators.push(Validators.required);
          }

          this.form.controls.restaurantImage.setValidators(imageValidators);
          this.form.controls.restaurantName.patchValue(this.restaurant.name);
          this.form.controls.restaurantDescription.patchValue(
            this.restaurant.description
          );
          this.form.controls.restaurantCost.patchValue(this.restaurant.cost);
          this.form.controls.restaurantCuisine.patchValue(
            this.restaurant.cuisine
          );

          this.getImage();
        })
        .catch((err) => {});
    }
  }

  ngOnInit(): void {
    this.fileControl.valueChanges.subscribe((file: File) => {
      if (file) {
        this.file = file;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          this.imageSrc = reader.result;
        };
      }
    });
  }

  getImage() {
    this.restaurantService
      .getRestaurantImage(this.restaurant._id)
      .toPromise()
      .then((image) => {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onloadend = () => {
          this.imageSrc = reader.result;
        };
      });
  }

  save() {
    if (this.restaurant) {
      this.restaurantService
        .updateRestaurant(
          this.restaurant._id,
          this.file,
          this.form.controls.restaurantName.value,
          this.form.controls.restaurantDescription.value,
          this.form.controls.restaurantCost.value,
          this.form.controls.restaurantCuisine.value
        )
        .toPromise()
        .then(() => {
          this.form.markAsPristine();
          this.notyf.success("Saved successfully!");
        })
        .catch(() => this.notyf.error("An error occurred while saving"));
    } else {
      this.restaurantService
        .createRestaurant(
          this.file,
          this.form.controls.restaurantName.value,
          this.form.controls.restaurantDescription.value,
          this.form.controls.restaurantCost.value,
          this.form.controls.restaurantCuisine.value
        )
        .toPromise()
        .then(() => {
          this.form.markAsPristine();
          this.notyf.success("Saved successfully! You can configure your achievements here.");
          return this.authenticationService.retrieveNewJWT().toPromise();
        })
        .then(() => {
          this.router.navigate(["/restaurant/achievements"]);
        })
        .catch(() => this.notyf.error("An error occurred while saving"));
    }
  }
}
