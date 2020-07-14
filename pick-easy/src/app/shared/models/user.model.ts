export class User {
  _id: string;
  username: string;
  isRestaurantStaff: boolean;
  firstName?: string;
  lastName?: string;

  constructor(
    _id: string,
    username: string,
    isRestaurantStaff: boolean,
    firstName?: string,
    lastName?: string
  ) {
    return { _id, username, isRestaurantStaff, firstName, lastName };
  }
}
