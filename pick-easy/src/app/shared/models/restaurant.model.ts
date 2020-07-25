export class Restaurant {
  _id: string;
  staff: {
    _id: string;
  };
  image: MulterFile;
  name: string;
  description: string;
  rating: 0 | 1 | 2 | 3 | 4 | 5;
  cost: RestaurantCost;
  cuisine: RestaurantCuisine;
  numberOfTicketsForRedemption?: number;
  achievements?: RestaurantAchievement[];
  rewards?: RestaurantReward[];
  log: {
    achievements: RestaurantAchievementLog[];
    rewards: RestaurantRewardLog[];
  };
}

export class MulterFile {
  _id: string;
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: string;
}

export class RestaurantAchievement {
  _id?: string;
  templateNumber: number;
  variables: string[];
  numberOfTickets: number;
}

export class RestaurantReward {
  templateNumber: number;
  variables: string[];
  level: RestaurantRewardLevel;
}

export type RestaurantRewardLevel =
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Platinum"
  | "Diamond";

export type RestaurantCuisine =
  | "Mexican"
  | "Italian"
  | "American"
  | "Thai"
  | "Japanese"
  | "Chinese"
  | "Indian"
  | "French"
  | "Brazilian"
  | "Greek"
  | "Korean";

export type RestaurantCost = 1 | 2 | 3 | 4;

export type RestaurantAchievementLog = {
  customerId: string;
  customerName: string;
  achievement: string;
  progress: string;
  complete: boolean;
  timeOfScan: Date;
};

export type RestaurantRewardLog = {
  customerId: string;
  customerName: string;
  reward: string;
  level: RestaurantRewardLevel;
  timeOfScan: Date;
};
