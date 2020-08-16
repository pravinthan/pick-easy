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

  /**
   * Description: This unit test checks if the component is created
   * Expected Outcome: Component is created
   * Risk Rating: Improbable x Critical
   */
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  /**
   * Description: This unit test checks all the anchor tags in the component
   * Expected Outcome: All anchor tags are present and linked correctly (and in correct order)
   * Risk Rating: Remote x Marginal
   */
  it("should link to customer/restaurant page correctly", () => {
    expect(new URL(anchors[0]?.href).pathname).toEqual("/customer");
    expect(new URL(anchors[1]?.href).pathname).toEqual("/restaurant");
  });
});
