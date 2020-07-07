import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Restaurant } from "./models/restaurant.model";

@Injectable({ providedIn: "root" })
export class RestaurantService {
  constructor(private http: HttpClient) {}

  getRestaurantById(restaurantId: string): Observable<Restaurant> {
    return this.http.get<Restaurant>(`/api/restaurant/${restaurantId}`);
  }

  getOwnRestaurant(): Observable<Restaurant> {
    return this.http.get<Restaurant>(`/api/restaurant/owned`);
  }
}
