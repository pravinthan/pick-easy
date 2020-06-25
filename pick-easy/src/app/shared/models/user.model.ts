export class User {
  _id: string;
  username: string;

  constructor(_id: string, username: string) {
    return { _id, username };
  }
}
