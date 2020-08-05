import { async, ComponentFixture, TestBed, tick } from "@angular/core/testing";

import { AchievementConfiguratorComponent } from "./achievement-configurator.component";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NOTYF } from "src/app/shared/utils/notyf.token";
import { By } from "@angular/platform-browser";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe("AchievementConfiguratorComponent", () => {
  let component: AchievementConfiguratorComponent;
  let fixture: ComponentFixture<AchievementConfiguratorComponent>;
  let ticketsPickerInput: HTMLInputElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        BrowserAnimationsModule,
      ],
      declarations: [AchievementConfiguratorComponent],
      providers: [{ provide: NOTYF, useValue: NOTYF }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AchievementConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    ticketsPickerInput = (fixture.debugElement
      .nativeElement as HTMLElement).querySelector("#tickets-picker-input");

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
   * Description: This unit test checks if the tickets picker input accepts numbers of 1 or more
   * Expected Outcome: Tickets picker input accepts numbers of 1 or more
   * Risk Rating: Improbable x Marginal
   */
  it("should check to see if the number of tickets input only accepts numbers of 1 or more", () => {
    expect(ticketsPickerInput.type).toEqual("number");
    expect(ticketsPickerInput.min).toEqual("1");
  });

  /**
   * Description: This unit test checks if adding an achievement template works
   * Expected Outcome: Adding an achievement template modifies the component's achievements array appropriately
   * Risk Rating: Remote x Critical
   */
  it("should check to see if adding an achievement template works", () => {
    const matSelect = fixture.debugElement.query(By.css(".mat-select-trigger"))
      .nativeElement;
    matSelect.click();
    fixture.detectChanges();
    const matOption = fixture.debugElement.query(By.css(".mat-option"))
      .nativeElement;
    matOption.click();

    fixture.detectChanges();
    expect(component.achievements.length).toEqual(1);
  });

  /**
   * Description: This unit test checks if removing an achievement template works
   * Expected Outcome: Removing an achievement template modifies the component's achievements array appropriately
   * Risk Rating: Remote x Critical
   */
  it("should check to see if removing an achievement template works", async () => {
    const matSelect = fixture.debugElement.query(By.css(".mat-select-trigger"))
      .nativeElement;
    matSelect.click();
    fixture.detectChanges();
    const matOption = fixture.debugElement.query(By.css("mat-option"))
      .nativeElement;
    matOption.click();

    fixture.detectChanges();
    await fixture.whenStable();

    (fixture.debugElement.query(
      By.css("#achievements :first-child .remove-achievement-button")
    ).nativeElement as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(component.achievements.length).toEqual(0);
  });
});
