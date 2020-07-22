import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "./models/user.model";

@Injectable({ providedIn: "root" })
export class CustomerService {
  constructor(private http: HttpClient) {}

  initializeAchievement(
    customerId: string,
    restaurantId: string,
    restaurantAchievementId: string
  ): Observable<User> {
    return this.http.post<User>(`/api/customers/${customerId}/achievements`, {
      restaurantId,
      restaurantAchievementId,
    });
  }

  redeemTicketsForCompletedAchievement(
    customerId: string,
    restaurantId: string,
    restaurantAchievementId: string
  ) {
    return this.patchAchievements(
      customerId,
      restaurantId,
      restaurantAchievementId,
      "redeem"
    );
  }

  progressAchievement(
    customerId: string,
    restaurantId: string,
    restaurantAchievementId: string
  ) {
    return this.patchAchievements(
      customerId,
      restaurantId,
      restaurantAchievementId,
      "progress"
    );
  }

  private patchAchievements(
    customerId: string,
    restaurantId: string,
    restaurantAchievementId: string,
    operation: "progress" | "redeem"
  ): Observable<string> {
    return this.http.patch(
      `/api/customers/${customerId}/achievements`,
      {
        operation,
        restaurantId,
        restaurantAchievementId,
      },
      { responseType: "text" }
    );
  }
}
