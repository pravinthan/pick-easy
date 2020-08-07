import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RewardConfiguratorComponent } from "./reward-configurator.component";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { By } from "@angular/platform-browser";
import { NOTYF } from "src/app/shared/utils/notyf.token";

describe("RewardConfiguratorComponent", () => {
  let component: RewardConfiguratorComponent;
  let fixture: ComponentFixture<RewardConfiguratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      declarations: [RewardConfiguratorComponent],
      providers: [{ provide: NOTYF, useValue: NOTYF }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.restaurant = {
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
      rewardWeight: {
        bronze: 100,
        diamond: 0,
        gold: 0,
        platinum: 0,
        silver: 0,
      },
    };

    component.rewardWeight = {
      bronze: 100,
      diamond: 0,
      gold: 0,
      platinum: 0,
      silver: 0,
    };

    component.templates = [
      {
        _id: "0",
        templateNumber: 0,
        content: "Get <percentage>% off for all purchases",
        value: "Get :variable% off for all purchases",
        variables: ["Percent"],
      },
      {
        _id: "1",
        templateNumber: 1,
        content:
          "Spend $<amount> or more pre-tax and get <restaurant item> for FREE",
        value: "Spend $:variable or more pre-tax and get :variable for FREE",
        variables: ["Dollar", "Restaurant Item"],
      },
      {
        _id: "2",
        templateNumber: 2,
        content: "Purchase <restaurant item> for $<amount> + tax",
        value: "Purchase :variable for $:variable + tax",
        variables: ["Restaurant Item", "Dollar"],
      },
      {
        _id: "3",
        templateNumber: 3,
        content: "Buy <restaurant item> and get <restaurant item> for FREE",
        value: "Buy :variable and get :variable for FREE",
        variables: ["Restaurant Item", "Restaurant Item"],
      },
      {
        _id: "4",
        templateNumber: 4,
        content: "Purchase <restaurant item> and get <percentage> off",
        value: "Purchase :variable and get :variable off",
        variables: ["Restaurant Item", "Percent"],
      },
      {
        _id: "5",
        templateNumber: 5,
        content: "Purchase <restaurant item> and get $<amount> off",
        value: "Purchase :variable and get $:variable off",
        variables: ["Restaurant Item", "Dollar"],
      },
      {
        _id: "6",
        templateNumber: 6,
        content: "FREE <restaurant item>",
        value: "FREE :variable",
        variables: ["Restaurant Item"],
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
   * Description: This unit test checks if adding an reward template works
   * Expected Outcome: Adding an reward template modifies the component's rewards array appropriately
   * Risk Rating: Remote x Critical
   */
  it("should check to see if adding a reward template works", () => {
    const matSelect = fixture.debugElement.query(By.css(".mat-select-trigger"))
      .nativeElement;
    matSelect.click();
    fixture.detectChanges();
    const matOption = fixture.debugElement.query(By.css(".mat-option"))
      .nativeElement;
    matOption.click();

    fixture.detectChanges();
    expect(component.rewards.length).toEqual(1);
  });

  /**
   * Description: This unit test checks if removing an reward template works
   * Expected Outcome: Removing an reward template modifies the component's rewards array appropriately
   * Risk Rating: Remote x Critical
   */
  it("should check to see if removing an reward template works", async () => {
    const matSelect = fixture.debugElement.query(By.css(".mat-select-trigger"))
      .nativeElement;
    matSelect.click();
    fixture.detectChanges();
    const matOption = fixture.debugElement.query(By.css("mat-option"))
      .nativeElement;
    matOption.click();

    fixture.detectChanges();
    fixture.whenStable();

    (fixture.debugElement.query(
      By.css("#rewards :first-child .remove-reward-button")
    ).nativeElement as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(component.rewards.length).toEqual(0);
  });
});
