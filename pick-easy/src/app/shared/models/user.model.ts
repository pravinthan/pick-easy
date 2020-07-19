import { RestaurantRewardLevel } from "./restaurant.model";

export class User {
  _id: string;
  username: string;
  isRestaurantStaff: boolean;
  createdRestaurant: boolean;
  firstName?: string;
  lastName?: string;
  loyalties?: CustomerLoyalty[];

  constructor(
    _id: string,
    username: string,
    isRestaurantStaff: boolean,
    createdRestaurant: boolean,
    firstName?: string,
    lastName?: string,
    loyalties?: CustomerLoyalty[]
  ) {
    return {
      _id,
      username,
      isRestaurantStaff,
      createdRestaurant,
      firstName,
      lastName,
      loyalties,
    };
  }
}

export type CustomerLoyalty = {
  restaurantId: string;
  numberOfTickets: number;
  level: RestaurantRewardLevel;
  achievements: CustomerAchievement[];
};

export type CustomerAchievement = {
  restaurantAchievementId: string;
  progress: number;
  complete: boolean;
};
