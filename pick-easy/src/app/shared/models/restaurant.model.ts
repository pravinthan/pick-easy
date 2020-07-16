export class Restaurant {
  _id: string;
  image: MulterFile;
  name: string;
  description: string;
  rating: 0 | 1 | 2 | 3 | 4 | 5;
  cost: RestaurantCost;
  cuisine: RestaurantCuisine;
  numberOfTicketsForReward?: number;
  achievements?: RestaurantAchievement[];
  rewards?: RestaurantReward[];
}

export class MulterFile {
  _id: string;
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: string;
  destination: string;
  filename: string;
  path: string;
  buffer: any[];
  isMain: boolean;
}

export class RestaurantAchievement {
  templateNumber: number;
  variables: string[];
  numberOfTickets: number;
}

export class RestaurantReward {
  templateNumber: number;
  variables: string[];
  level: string;
}

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
