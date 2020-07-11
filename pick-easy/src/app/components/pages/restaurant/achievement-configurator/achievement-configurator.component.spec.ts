import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AchievementConfiguratorComponent } from "./achievement-configurator.component";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NOTYF } from "src/app/shared/utils/notyf.token";

describe("AchievementConfiguratorComponent", () => {
  let component: AchievementConfiguratorComponent;
  let fixture: ComponentFixture<AchievementConfiguratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [AchievementConfiguratorComponent],
      providers: [{ provide: NOTYF, useValue: NOTYF }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AchievementConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // Check if number of tickets input works
  // Check if adding achievement works
  // Check if removing achievement works
  // Check if 0 achievements works
});
