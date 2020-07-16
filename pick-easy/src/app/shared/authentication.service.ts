import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "./models/user.model";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUserObservable: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem("currentUser"))
    );

    this.currentUserObservable = this.currentUserSubject.asObservable();
  }

  private parseJWT(token: string) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  }

  public get currentUser(): User {
    if (this.currentUserSubject.value) {
      const token = this.parseJWT(this.currentUserSubject.value.token);
      if (token) {
        return new User(token._id, token.username, token.isRestaurantOwner);
      }
    }

    return null;
  }

  public get currentUserId(): string {
    return this.parseJWT(this.currentUserSubject.value.token)._id;
  }

  public get currentUsername(): string {
    return this.parseJWT(this.currentUserSubject.value.token).username;
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  signIn(username: string, password: string) {
    return this.http
      .post<any>(`/api/users/signin`, {
        username,
        password,
      })
      .pipe(
        map((user) => {
          localStorage.setItem("currentUser", JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  signUp(
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    isRestaurantOwner: boolean
  ) {
    return this.http
      .post<any>(`/api/users/signup`, {
        username,
        password,
        firstName,
        lastName,
        isRestaurantOwner,
      })
      .pipe(
        map((user) => {
          localStorage.setItem("currentUser", JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  signOut() {
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
  }
}
