import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RedeemedRewardDialogComponent } from "./redeemed-reward-dialog.component";

describe("RedeemedRewardDialogComponent", () => {
  let component: RedeemedRewardDialogComponent;
  let fixture: ComponentFixture<RedeemedRewardDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RedeemedRewardDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedeemedRewardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
