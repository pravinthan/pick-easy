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

    component.templates = [
      {
        _id: null,
        variables: ["Dollar", "Restaurant Item"],
        templateNumber: 1,
        content:
          "Spend $<amount> or more pre-tax and get <restaurant item> for FREE",
      },
      {
        _id: null,
        variables: ["Percent"],
        templateNumber: 0,
        content: "Get <percentage>% off for all purchases",
      },
      {
        _id: null,
        variables: ["Restaurant Item", "Dollar"],
        templateNumber: 2,
        content: "Purchase <restaurant item> for $<amount> + tax",
      },
      {
        _id: null,
        variables: ["Restaurant Item", "Percent"],
        templateNumber: 4,
        content: "Purchase <restaurant item> and get <percentage> off",
      },
      {
        _id: null,
        variables: ["Restaurant Item"],
        templateNumber: 6,
        content: "FREE <restaurant item>",
      },
      {
        _id: null,
        variables: ["Restaurant Item", "Restaurant Item"],
        templateNumber: 3,
        content: "Buy <restaurant item> and get <restaurant item> for FREE",
      },
      {
        _id: null,
        variables: ["Restaurant Item", "Dollar"],
        templateNumber: 5,
        content: "Purchase <restaurant item> and get $<amount> off",
      },
    ];

    fixture.detectChanges();
  });

  /* component should be created so not be falsy */
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  /* Adding reward template should be able to be added */
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

  /* Removing reward template should be able to be removed */
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
