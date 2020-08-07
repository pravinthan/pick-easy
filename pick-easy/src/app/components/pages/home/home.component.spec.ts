import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { HomeComponent } from "./home.component";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatDialogModule } from "@angular/material/dialog";

describe("HomeComponent", () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let anchors: HTMLAnchorElement[] = [];
  let trimAnchorArray = (array: HTMLCollectionOf<HTMLAnchorElement>) =>
    Array.from(array).filter((el) => el.href != "");

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, MatDialogModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Description: This unit test checks if the component is created
   * Expected Outcome: Component is created
   * Risk Rating: Improbable x Critical
   */
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  /**
   * Description: This unit test checks all the anchor tags in the component (assuming user is a not restaurant staff)
   * Expected Outcome: All anchor tags are present and linked correctly (and in correct order)
   * Risk Rating: Remote x Marginal
   */
  it("should link to customer pages correctly", async () => {
    component.currentUser = {
      _id: "1",
      createdRestaurant: false,
      isRestaurantStaff: false,
      username: "abc",
      log: null,
    };
    component.isRestaurantStaff = false;

    fixture.detectChanges();
    await fixture.whenStable();

    anchors = trimAnchorArray(
      fixture.debugElement.nativeElement.querySelectorAll("a")
    );

    expect(new URL(anchors[0]?.href).pathname).toEqual("/discover");
    expect(new URL(anchors[1]?.href).pathname).toEqual("/history");
    expect(new URL(anchors[2]?.href).pathname).toEqual("/achievements");
    expect(new URL(anchors[3]?.href).pathname).toEqual("/rewards");
  });

  /**
   * Description: This unit test checks all the anchor tags in the component (assuming user is a restaurant staff and has not created a restaurant)
   * Expected Outcome: All anchor tags are present and linked correctly (and in correct order)
   * Risk Rating: Remote x Marginal
   */
  it("should link to restaurant pages (if restaurant not created) correctly", async () => {
    component.currentUser = {
      _id: "1",
      createdRestaurant: false,
      isRestaurantStaff: true,
      username: "abc",
      log: null,
    };
    component.isRestaurantStaff = true;

    fixture.detectChanges();
    await fixture.whenStable();

    anchors = trimAnchorArray(
      fixture.debugElement.nativeElement.querySelectorAll("a")
    );

    expect(new URL(anchors[0]?.href).pathname).toEqual("/my-restaurant");
  });

  /**
   * Description: This unit test checks all the anchor tags in the component (assuming user is a restaurant staff and has created a restaurant)
   * Expected Outcome: All anchor tags are present and linked correctly (and in correct order)
   * Risk Rating: Remote x Marginal
   */
  it("should link to restaurant pages (if restaurant created) correctly", async () => {
    component.currentUser = {
      _id: "1",
      createdRestaurant: true,
      isRestaurantStaff: true,
      username: "abc",
      log: null,
    };
    component.isRestaurantStaff = true;

    fixture.detectChanges();
    await fixture.whenStable();

    anchors = trimAnchorArray(
      fixture.debugElement.nativeElement.querySelectorAll("a")
    );

    expect(new URL(anchors[0]?.href).pathname).toEqual("/my-restaurant");
    expect(new URL(anchors[1]?.href).pathname).toEqual("/scan");
    expect(new URL(anchors[2]?.href).pathname).toEqual("/achievements");
    expect(new URL(anchors[3]?.href).pathname).toEqual("/rewards");
  });
});
