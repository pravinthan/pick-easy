import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AchievementsComponent } from "./achievements.component";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDialogModule } from "@angular/material/dialog";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";

describe("AchievementsComponent", () => {
  let component: AchievementsComponent;
  let fixture: ComponentFixture<AchievementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AchievementsComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatAutocompleteModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AchievementsComponent);
    component = fixture.componentInstance;

    component.customer = {
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

    component.restaurants = [
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
            _id: "1",
            templateNumber: 0,
            numberOfTickets: 5,
          },
          {
            variables: ["25", "1"],
            _id: "2",
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

    component.templates = [
      {
        _id: null,
        templateNumber: 0,
        content: "Visit <number> time(s)",
        value: "Visit :variable time(s)",
        variables: [
          {
            variableDescription: "Number of times to visit",
            variableType: "number",
            isProgressionVariable: true,
          },
        ],
        repeatable: true,
        typeOfAchievement: "progress",
      },
      {
        _id: null,
        templateNumber: 1,
        content: "Order <item> <number> time(s)",
        value: "Order :variable :variable time(s)",
        variables: [
          {
            variableDescription: "Restaurant menu item name",
            variableType: "string",
            isProgressionVariable: false,
          },
          {
            variableDescription: "Number of times to order",
            variableType: "number",
            isProgressionVariable: true,
          },
        ],
        repeatable: true,
        typeOfAchievement: "progress",
      },
      {
        _id: null,
        templateNumber: 2,
        content: "Visit as a group of <number> or more <number> time(s)",
        value: "Visit as a group of :variable or more :variable time(s)",
        variables: [
          {
            variableDescription: "Number of people in group",
            variableType: "number",
            isProgressionVariable: false,
          },
          {
            variableDescription: "Number of times to visit",
            variableType: "number",
            isProgressionVariable: true,
          },
        ],
        repeatable: true,
        typeOfAchievement: "progress",
      },
      {
        _id: null,
        templateNumber: 3,
        content: "Spend $<number> <number> time(s)",
        value: "Spend $:variable :variable time(s)",
        variables: [
          {
            variableDescription: "Required money to spend (in $)",
            variableType: "number",
            isProgressionVariable: false,
          },
          {
            variableDescription: "Number of times to spend",
            variableType: "number",
            isProgressionVariable: true,
          },
        ],
        repeatable: true,
        typeOfAchievement: "progress",
      },
      {
        _id: null,
        templateNumber: 4,
        content: "Write a review on a review site (e.g. Google, Yelp)",
        value: "Write a review on a review site (e.g. Google, Yelp)",
        variables: [],
        repeatable: false,
        typeOfAchievement: "oneOff",
      },
      {
        _id: null,
        templateNumber: 5,
        content: "Share a picture of your meal on social media",
        value: "Share a picture of your meal on social media",
        variables: [],
        repeatable: false,
        typeOfAchievement: "oneOff",
      },
      {
        _id: null,
        templateNumber: 6,
        content: "Like and follow on social media",
        value: "Like and follow on social media",
        variables: [],
        repeatable: false,
        typeOfAchievement: "oneOff",
      },
    ];

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
   * Description: This unit test checks if getTemplateByNumber works
   * Expected Outcome: getTemplateByNumber returns the RestaurantTemplate object given the template number
   * Risk Rating: Remote x Critical
   */
  it("should check to see if getTemplateByNumber works", () => {
    expect(component.getTemplateByNumber(1)).toEqual(component.templates[1]);
    expect(component.getTemplateByNumber(2)).toEqual(component.templates[2]);
  });

  /**
   * Description: This unit test checks if getRestaurantAchievementById works
   * Expected Outcome: getRestaurantAchievementById returns the RestaurantAchievment object given the relevant parameters
   * Risk Rating: Remote x Critical
   */
  it("should check to see if getRestaurantAchievementById works", () => {
    expect(
      component.getRestaurantAchievementById(
        component.restaurants[0].achievements,
        "1"
      )
    ).toEqual(component.restaurants[0].achievements[0]);
    expect(
      component.getRestaurantAchievementById(
        component.restaurants[0].achievements,
        "2"
      )
    ).toEqual(component.restaurants[0].achievements[1]);
  });

  /**
   * Description: This unit test checks if restaurantAchievementToText works
   * Expected Outcome: restaurantAchievementToText returns the displaed text version of the restaurant achievement
   * Risk Rating: Remote x Marginal
   */
  it("should check to see if restaurantAchievementToText works", () => {
    expect(
      component.restaurantAchievementToText(
        component.restaurants[0].achievements[0]
      )
    ).toEqual("Visit 1 time(s)");
    expect(
      component.restaurantAchievementToText(
        component.restaurants[0].achievements[1]
      )
    ).toEqual("Spend $25 1 time(s)");
  });

  /**
   * Description: This unit test checks if getCustomerLoyaltyByRestaurantId works
   * Expected Outcome: getCustomerLoyaltyByRestaurantId returns the correct CustomerLoyalty object given the relevant parameters
   * Risk Rating: Remote x Critical
   */
  it("should check to see if getCustomerLoyaltyByRestaurantId works", () => {
    expect(component.getCustomerLoyaltyByRestaurantId("a")).toEqual(
      component.customer.loyalties[0]
    );
  });

  /**
   * Description: This unit test checks if getCustomerAchievementsByRestaurantId works
   * Expected Outcome: getCustomerAchievementsByRestaurantId returns the correct CustomerAchievement array given the relevant parameters
   * Risk Rating: Remote x Critical
   */
  it("should check to see if getCustomerAchievementsByRestaurantId works", () => {
    expect(component.getCustomerAchievementsByRestaurantId("a")).toEqual(
      component.customer.loyalties[0].achievements
    );
  });

  /**
   * Description: This unit test checks if getUnactivatedAchievements works
   * Expected Outcome: getUnactivatedAchievements returns the correct RestaurantAchievement array given the relevant parameters
   * Risk Rating: Remote x Critical
   */
  it("should check to see if getUnactivatedAchievements works", () => {
    expect(
      component.getUnactivatedAchievements(
        "a",
        component.restaurants[0].achievements
      )
    ).toEqual(component.restaurants[0].achievements);

    component.customer.loyalties[0].achievements.push({
      complete: false,
      progress: 0,
      restaurantAchievementId: "1",
    });
    expect(
      component.getUnactivatedAchievements(
        "a",
        component.restaurants[0].achievements
      )
    ).toEqual([component.restaurants[0].achievements[1]]);
  });

  /**
   * Description: This unit test checks if getProgressionNumber works
   * Expected Outcome: getProgressionNumber returns the correct progression number given the relevant parameters
   * Risk Rating: Remote x Marginal
   */
  it("should check to see if getProgressionNumber works", () => {
    expect(
      component.getProgressionNumber(component.restaurants[0].achievements[0])
    ).toEqual(1);
    expect(
      component.getProgressionNumber(component.restaurants[0].achievements[1])
    ).toEqual(1);
  });
});
