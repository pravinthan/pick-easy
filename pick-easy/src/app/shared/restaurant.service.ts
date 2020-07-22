import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  Restaurant,
  RestaurantAchievement,
  RestaurantReward,
  RestaurantCost,
  RestaurantCuisine,
} from "./models/restaurant.model";

@Injectable({ providedIn: "root" })
export class RestaurantService {
  constructor(private http: HttpClient) {}

  getAllRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(`/api/restaurants`);
  }

  getRestaurantById(restaurantId: string): Observable<Restaurant> {
    return this.http.get<Restaurant>(`/api/restaurants/${restaurantId}`);
  }

  getOwnRestaurant(): Observable<Restaurant> {
    return this.http.get<Restaurant>(`/api/restaurants/owned`);
  }

  updateAchievements(
    restaurantId: string,
    numberOfTicketsForRedemption: number,
    achievements: RestaurantAchievement[]
  ) {
    return this.http.patch(
      `/api/restaurants/${restaurantId}/achievements`,
      {
        numberOfTicketsForRedemption,
        achievements,
      },
      { responseType: "text" }
    );
  }

  updateRewards(restaurantId: string, rewards: RestaurantReward[]) {
    return this.http.patch(
      `/api/restaurants/${restaurantId}/rewards`,
      { rewards },
      { responseType: "text" }
    );
  }

  updateRestaurant(
    restaurantId: string,
    restaurantImage: File,
    restaurantName: string,
    restaurantDescription: string,
    restaurantCost: RestaurantCost,
    restaurantCuisine: RestaurantCuisine
  ) {
    const formData = new FormData();
    if (restaurantImage) {
      formData.append("restaurantImage", restaurantImage, restaurantImage.name);
    }
    formData.append("restaurantName", restaurantName);
    formData.append("restaurantDescription", restaurantDescription);
    formData.append("restaurantCost", restaurantCost.toString());
    formData.append("restaurantCuisine", restaurantCuisine);
    return this.http.patch(`/api/restaurants/${restaurantId}`, formData, {
      responseType: "text",
    });
  }

  createRestaurant(
    restaurantImage: File,
    restaurantName: string,
    restaurantDescription: string,
    restaurantCost: RestaurantCost,
    restaurantCuisine: RestaurantCuisine
  ) {
    const formData = new FormData();
    if (restaurantImage) {
      formData.append("restaurantImage", restaurantImage, restaurantImage.name);
    }
    formData.append("restaurantName", restaurantName);
    formData.append("restaurantDescription", restaurantDescription);
    formData.append("restaurantCost", restaurantCost.toString());
    formData.append("restaurantCuisine", restaurantCuisine);
    return this.http.post(`/api/restaurants`, formData);
  }

  getRestaurantImage(restaurantId: string): Observable<Blob> {
    return this.http.get(`/api/restaurants/${restaurantId}/image`, {
      responseType: "blob",
    });
  }
}
