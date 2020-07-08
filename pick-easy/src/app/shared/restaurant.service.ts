import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Restaurant, RestaurantAchievement } from "./models/restaurant.model";

@Injectable({ providedIn: "root" })
export class RestaurantService {
  constructor(private http: HttpClient) {}

  getRestaurantById(restaurantId: string): Observable<Restaurant> {
    return this.http.get<Restaurant>(`/api/restaurants/${restaurantId}`);
  }

  getOwnRestaurant(): Observable<Restaurant> {
    return this.http.get<Restaurant>(`/api/restaurants/owned`);
  }

  updateAchievements(
    restaurantId: string,
    numberOfStampsForReward: number,
    achievements: RestaurantAchievement[]
  ) {
    return this.http.patch(
      `/api/restaurants/${restaurantId}`,
      {
        numberOfStampsForReward,
        achievements,
      },
      { responseType: "text" }
    );
  }
}
