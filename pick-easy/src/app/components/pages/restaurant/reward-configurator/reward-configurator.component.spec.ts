import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RewardConfiguratorComponent } from "./reward-configurator.component";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("RewardConfiguratorComponent", () => {
  let component: RewardConfiguratorComponent;
  let fixture: ComponentFixture<RewardConfiguratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [RewardConfiguratorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // Check if adding rewards works
  // Check if removing rewards works
  // Check if 0 rewards works
});
