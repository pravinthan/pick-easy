export class User {
  _id: string;
  username: string;
  isRestaurantOwner: boolean;
  firstName?: string;
  lastName?: string;

  constructor(
    _id: string,
    username: string,
    isRestaurantOwner: boolean,
    firstName?: string,
    lastName?: string
  ) {
    return { _id, username, isRestaurantOwner, firstName, lastName };
  }
}
