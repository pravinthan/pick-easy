import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { NavigationComponent } from "./navigation.component";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("NavigationComponent", () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let anchors: HTMLAnchorElement[] = [];
  let trimAnchorArray = (array: HTMLCollectionOf<HTMLAnchorElement>) =>
    Array.from(array).filter((el) => el.href != "");

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavigationComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationComponent);
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

    fixture.detectChanges();
    await fixture.whenStable();

    anchors = trimAnchorArray(
      fixture.debugElement.nativeElement.querySelectorAll("a")
    );

    expect(new URL(anchors[0]?.href).pathname).toEqual("/customer");
    expect(new URL(anchors[1]?.href).pathname).toEqual("/customer/discover");
    expect(new URL(anchors[2]?.href).pathname).toEqual("/customer/history");
    expect(new URL(anchors[3]?.href).pathname).toEqual(
      "/customer/achievements"
    );
    expect(new URL(anchors[4]?.href).pathname).toEqual("/customer/rewards");
  });

  /**
   * Description: This unit test checks all the anchor tags in the component (assuming user is a restaurant staff and has created a restaurant)
   * Expected Outcome: All anchor tags are present and linked correctly (and in correct order)
   * Risk Rating: Remote x Marginal
   */
  it("should link to restaurant pages correctly", async () => {
    component.currentUser = {
      _id: "1",
      createdRestaurant: true,
      isRestaurantStaff: true,
      username: "abc",
      log: null,
    };

    fixture.detectChanges();
    await fixture.whenStable();

    anchors = trimAnchorArray(
      fixture.debugElement.nativeElement.querySelectorAll("a")
    );

    expect(new URL(anchors[0]?.href).pathname).toEqual("/restaurant");
    expect(new URL(anchors[1]?.href).pathname).toEqual(
      "/restaurant/my-restaurant"
    );
    expect(new URL(anchors[2]?.href).pathname).toEqual("/restaurant/scan");
    expect(new URL(anchors[3]?.href).pathname).toEqual(
      "/restaurant/achievements"
    );
    expect(new URL(anchors[4]?.href).pathname).toEqual("/restaurant/rewards");
  });
});
