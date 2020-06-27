export class User {
  _id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  isRestaurantOwner?: boolean;

  constructor(
    _id: string,
    username: string,
    firstName?: string,
    lastName?: string,
    isRestaurantOwner?: boolean
  ) {
    return { _id, username, firstName, lastName, isRestaurantOwner };
  }
}
