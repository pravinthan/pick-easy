export class Restaurant {
  _id: string;
  name: string;
  description: string;
  rating: 0 | 1 | 2 | 3 | 4 | 5;
  cost: 1 | 2 | 3 | 4;
  cuisine:
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
  numberOfStampsForReward: number;
  level: string;
}
