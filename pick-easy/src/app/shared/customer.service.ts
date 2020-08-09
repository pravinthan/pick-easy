import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User, CustomerReward } from "./models/user.model";

@Injectable({ providedIn: "root" })
export class CustomerService {
  constructor(private http: HttpClient) {}

  /* Returns all customer info */
  getCustomerInformation(customerId: string): Observable<User> {
    return this.http.get<User>(`/api/customers/${customerId}`);
  }

  /* Given customer id, restaurant id, and achievement, sends post request to create achievement */
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

  /* Redeems an achievement */
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

  /* Upgrades a level of a customer for a restaurant */
  upgradeLevel(customerId: string, restaurantId: string) {
    return this.http.patch(
      `/api/customers/${customerId}/level`,
      {
        restaurantId,
      },
      { responseType: "text" }
    );
  }

  /* Makes progress on an achievement */
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

  /* Submits a partial change request on achievement */
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

  /* Redeems a reward through patch request */
  redeemReward(
    customerId: string,
    restaurantId: string,
    customerRewardId: string
  ): Observable<string> {
    return this.http.patch(
      `/api/customers/${customerId}/rewards`,
      {
        customerId,
        restaurantId,
        customerRewardId,
      },
      { responseType: "text" }
    );
  }

  /* Creates a new customer reward */
  generateReward(
    customerId: string,
    restaurantId: string
  ): Observable<CustomerReward> {
    return this.http.post<CustomerReward>(
      `/api/customers/${customerId}/rewards`,
      {
        restaurantId,
      }
    );
  }
}
