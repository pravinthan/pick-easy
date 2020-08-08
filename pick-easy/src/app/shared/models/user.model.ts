/* Most of the models are self-explanatory */
import { RestaurantRewardLevel } from "./restaurant.model";

export class User {
  _id: string;
  username: string;
  isRestaurantStaff: boolean;
  createdRestaurant: boolean;
  firstName?: string;
  lastName?: string;
  loyalties?: CustomerLoyalty[];
  log: UserLog;

  constructor(
    _id: string,
    username: string,
    isRestaurantStaff: boolean,
    createdRestaurant: boolean,
    log?: UserLog,
    firstName?: string,
    lastName?: string,
    loyalties?: CustomerLoyalty[]
  ) {
    return {
      _id,
      username,
      isRestaurantStaff,
      createdRestaurant,
      log,
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
  completedNonRepeatableAchievements: CompletedNonRepeatableAchievement[];
  rewards: CustomerReward[];
};

export type CustomerAchievement = {
  restaurantAchievementId: string;
  progress: number;
  complete: boolean;
};

export type CompletedNonRepeatableAchievement = {
  restaurantAchievementId: string;
};

export type CustomerReward = {
  _id: string;
  content: string;
  level: RestaurantRewardLevel;
};

export type UserAchievementLog = {
  restaurantId: string;
  restaurantName: string;
  achievement: string;
  progress: string;
  complete: boolean;
  timeOfScan: Date;
};

export type UserRewardLog = {
  restaurantId: string;
  restaurantName: string;
  reward: string;
  level: RestaurantRewardLevel;
  timeOfScan: Date;
};

export type UserLog = {
  achievements: UserAchievementLog[];
  rewards: UserRewardLog[];
};
