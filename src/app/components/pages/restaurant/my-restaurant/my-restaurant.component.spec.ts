import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MyRestaurantComponent } from "./my-restaurant.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { NOTYF } from "src/app/shared/utils/notyf.token";
import { MatFormFieldModule } from "@angular/material/form-field";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatInputModule } from "@angular/material/input";
import { By } from "@angular/platform-browser";
import { MatSelectModule } from "@angular/material/select";
import { NgxMatFileInputModule } from "@angular-material-components/file-input";

describe("MyRestaurantComponent", () => {
  let component: MyRestaurantComponent;
  let fixture: ComponentFixture<MyRestaurantComponent>;
  let nameInput: HTMLInputElement;
  let descriptionInput: HTMLInputElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        NgxMatFileInputModule,
        BrowserAnimationsModule,
      ],
      declarations: [MyRestaurantComponent],
      providers: [{ provide: NOTYF, useValue: NOTYF }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyRestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    nameInput = fixture.debugElement.query(
      By.css("input[formControlName='restaurantName']")
    ).nativeElement;

    descriptionInput = fixture.debugElement.query(
      By.css("input[formControlName='restaurantDescription']")
    ).nativeElement;
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
   * Description: This unit test checks if the restaurant name input accepts strings of < 30 characters
   * Expected Outcome: Restaurant name input accepts strings of < 30 characters
   * Risk Rating: Improbable x Marginal
   */
  it("should check to see if the restaurant name input only accepts strings of < 30 characters", () => {
    expect(nameInput.maxLength).toEqual(30);
  });

  /**
   * Description: This unit test checks if the restaurant description input accepts strings of < 250 characters
   * Expected Outcome: Restaurant description input accepts strings of < 250 characters
   * Risk Rating: Improbable x Marginal
   */
  it("should check to see if the restaurant description input only accepts strings of < 250 characters", () => {
    expect(descriptionInput.maxLength).toEqual(250);
  });
});
