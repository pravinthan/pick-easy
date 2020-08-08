/* Most of the models are self-explanatory */
export class Restaurant {
  _id: string;
  staff: {
    _id: string;
  };
  image: MulterFile;
  name: string;
  description: string;
  cost: RestaurantCost;
  cuisine: RestaurantCuisine;
  numberOfTicketsForRedemption?: number;
  achievements?: RestaurantAchievement[];
  rewards?: RestaurantReward[];
  rewardWeight: RestaurantRewardWeight;
  log: {
    achievements: RestaurantAchievementLog[];
    rewards: RestaurantRewardLog[];
  };
}

/* For image in restaurant */
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

export class RestaurantRewardWeight {
  bronze: number;
  silver: number;
  gold: number;
  platinum: number;
  diamond: number;
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

/* Number of dollar signs, 1 is the least, 4 is the most. Like Google Maps */
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
