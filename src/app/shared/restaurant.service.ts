import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  Restaurant,
  RestaurantAchievement,
  RestaurantReward,
  RestaurantRewardWeight,
  RestaurantCost,
  RestaurantCuisine,
} from "./models/restaurant.model";

@Injectable({ providedIn: "root" })
export class RestaurantService {
  constructor(private http: HttpClient) {}

  /* Returns a list of all restaurants */
  getAllRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(`/api/restaurants`);
  }

  /* Returns a restaurant given an id */
  getRestaurantById(restaurantId: string): Observable<Restaurant> {
    return this.http.get<Restaurant>(`/api/restaurants/${restaurantId}`);
  }

  /* Returns owned restaurant */
  getOwnRestaurant(): Observable<Restaurant> {
    return this.http.get<Restaurant>(`/api/restaurants/owned`);
  }

  /* Updates achievements through patch request */
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

  /* Updates rewards through patch request */
  updateRewards(restaurantId: string, rewards: RestaurantReward[]) {
    return this.http.patch(
      `/api/restaurants/${restaurantId}/rewards`,
      { rewards },
      { responseType: "text" }
    );
  }

  /* Updates restaurant through patch request in a form */
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

  /* Updates reward weights through patch request */
  updateRestaurantRewardWeight(
    restaurantId: string,
    restaurantRewardWeight: RestaurantRewardWeight
  ) {
    return this.http.patch(
      `/api/restaurants/${restaurantId}/rewardWeight`,
      { rewardWeight: restaurantRewardWeight },
      { responseType: "text" }
    );
  }

  /* Creates new restaurant */
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

  /* Returns restaurant image */
  getRestaurantImage(restaurantId: string): Observable<Blob> {
    return this.http.get(`/api/restaurants/${restaurantId}/image`, {
      responseType: "blob",
    });
  }
}
