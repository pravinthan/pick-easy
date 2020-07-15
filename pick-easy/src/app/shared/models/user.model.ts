export class User {
  _id: string;
  username: string;
  isRestaurantStaff: boolean;
  createdRestaurant: boolean;
  firstName?: string;
  lastName?: string;

  constructor(
    _id: string,
    username: string,
    isRestaurantStaff: boolean,
    createdRestaurant: boolean,
    firstName?: string,
    lastName?: string
  ) {
    return {
      _id,
      username,
      isRestaurantStaff,
      createdRestaurant,
      firstName,
      lastName,
    };
  }
}
