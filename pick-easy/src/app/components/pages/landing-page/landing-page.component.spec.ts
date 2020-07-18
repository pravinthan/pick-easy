import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LandingPageComponent } from "./landing-page.component";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("LandingPageComponent", () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;
  let anchors: HTMLAnchorElement[] = [];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [LandingPageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    anchors = fixture.debugElement.nativeElement.querySelectorAll("a");
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should link to customer page correctly", () => {
    expect(new URL(anchors[0]?.href).pathname).toEqual("/customer");
  });

  it("should link to restaurant page correctly", () => {
    expect(new URL(anchors[1]?.href).pathname).toEqual("/restaurant");
  });
});
