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

  /* Parses JSON web token */
  private parseJWT(token: string) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  }

  /* Returns current user */
  public get currentUser(): User {
    if (this.currentUserSubject.value) {
      const token = this.parseJWT(this.currentUserSubject.value.token);
      if (token) {
        return new User(
          token._id,
          token.username,
          token.isRestaurantStaff,
          token.createdRestaurant
        );
      }
    }

    return null;
  }

  /* Returns user ID */
  public get currentUserId(): string {
    return this.parseJWT(this.currentUserSubject.value.token)._id;
  }

  /* Returns username */
  public get currentUsername(): string {
    return this.parseJWT(this.currentUserSubject.value.token).username;
  }

  /* Returns user value */
  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  /* Retrieves new JSON web token from server */
  retrieveNewJWT() {
    if (this.currentUser) {
      return this.http.get<any>(`/api/users/retrieve-new-jwt`).pipe(
        map((user) => {
          localStorage.setItem("currentUser", JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
    }
  }

  /* Given username, password, and restaurant staff status, tries to sign in */
  signIn(username: string, password: string, isRestaurantStaff: boolean) {
    return this.http
      .post<any>(`/api/users/signin`, {
        username,
        password,
        isRestaurantStaff,
      })
      .pipe(
        map((user) => {
          localStorage.setItem("currentUser", JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  /* Given username, password, first name, last name and restaurant staff status, tries to sign up */
  signUp(
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    isRestaurantStaff: boolean
  ) {
    return this.http
      .post<any>(`/api/users/signup`, {
        username,
        password,
        firstName,
        lastName,
        isRestaurantStaff,
      })
      .pipe(
        map((user) => {
          localStorage.setItem("currentUser", JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  /* Signs out */
  signOut() {
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
  }
}
