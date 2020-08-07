import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RewardsComponent } from "./rewards.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Restaurant } from "src/app/shared/models/restaurant.model";
import { User } from "src/app/shared/models/user.model";
import { MatDialogModule } from "@angular/material/dialog";
import { MatAutocompleteModule } from "@angular/material/autocomplete";

describe("RewardsComponent", () => {
  let component: RewardsComponent;
  let fixture: ComponentFixture<RewardsComponent>;

  let customer: User = {
    _id: null,
    isRestaurantStaff: false,
    createdRestaurant: false,
    loyalties: [
      {
        restaurantId: "a",
        numberOfTickets: 7,
        rewards: [
          {
            _id: null,
            content: "Purchase abc for $10 + tax",
            level: "Bronze",
          },
          {
            _id: null,
            content: "Purchase def for $10 + tax",
            level: "Silver",
          },
        ],
        level: "Bronze",
        achievements: [],
        completedNonRepeatableAchievements: [],
      },
    ],
    firstName: "abc",
    lastName: "def",
    username: "1234",
    log: null,
  };

  let restaurants: Restaurant[] = [
    {
      _id: "a",
      numberOfTicketsForRedemption: 3,
      staff: {
        _id: null,
      },
      name: "test",
      description: "js",
      cost: 2,
      cuisine: "Mexican",
      image: null,
      log: {
        achievements: [],
        rewards: [],
      },
      achievements: [
        {
          variables: ["1"],
          _id: null,
          templateNumber: 0,
          numberOfTickets: 5,
        },
        {
          variables: ["25", "1"],
          _id: null,
          templateNumber: 3,
          numberOfTickets: 5,
        },
      ],
      rewards: [
        {
          variables: ["abc", "10"],
          templateNumber: 2,
          level: "Bronze",
        },
        {
          variables: ["w", "w"],
          templateNumber: 3,
          level: "Silver",
        },
        {
          variables: ["2", "2"],
          templateNumber: 3,
          level: "Gold",
        },
      ],
      rewardWeight: null,
    },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatAutocompleteModule,
      ],
      declarations: [RewardsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardsComponent);
    component = fixture.componentInstance;
    component.restaurants = restaurants;
    component.customer = customer;
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
   * Description: This unit test checks if getCustomerLoyaltyByRestaurantId works
   * Expected Outcome: getCustomerLoyaltyByRestaurantId returns the correct CustomerLoyalty object given the relevant parameters
   * Risk Rating: Remote x Critical
   */
  it("should check to see if getCustomerLoyaltyByRestaurantId works", () => {
    expect(component.getCustomerLoyaltyByRestaurantId("a")).toEqual(
      customer.loyalties[0]
    );
  });

  /**
   * Description: This unit test checks if getCustomerRewardsByRestaurantId works
   * Expected Outcome: getCustomerRewardsByRestaurantId returns the correct CustomerReward array given the relevant parameters
   * Risk Rating: Remote x Critical
   */
  it("should check to see if getCustomerRewardsByRestaurantId works", () => {
    expect(component.getCustomerRewardsByRestaurantId("a")).toEqual(
      customer.loyalties[0].rewards
    );
  });

  /**
   * Description: This unit test checks if getCustomerRewardsByRestaurantId works
   * Expected Outcome: getCustomerRewardsByRestaurantId returns the correct CustomerReward array given the relevant parameters
   * Risk Rating: Remote x Critical
   */
  it("should check to see if getCustomerRewardsByRestaurantId (with level) works", () => {
    expect(component.getCustomerRewardsByRestaurantId("a", "Bronze")).toEqual([
      customer.loyalties[0].rewards[0],
    ]);
  });
});
